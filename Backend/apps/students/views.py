from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Student, Parent
from .serializers import StudentProfileSerializer, StudentListSerializer, StudentSerializer

class IsParent(permissions.BasePermission):
    """
    Custom permission to only allow parents to access their own children's data
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'parent')

class StudentProfileView(APIView):
    """
    Get the profile of the student(s) belonging to the logged-in parent
    """
    permission_classes = [IsParent]
    
    def get(self, request):
        try:
            parent = request.user.parent
            
            # Get all children of this parent
            children = Student.objects.filter(parent=parent, status='active')
            
            if not children.exists():
                return Response(
                    {'error': 'No active students found for this parent'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # If parent has only one child, return that child's profile
            if children.count() == 1:
                serializer = StudentProfileSerializer(children.first())
                return Response(serializer.data)
            
            # If parent has multiple children, return the first one
            # (You can modify this logic based on your requirements)
            serializer = StudentProfileSerializer(children.first())
            return Response(serializer.data)
            
        except Parent.DoesNotExist:
            return Response(
                {'error': 'Parent profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing student profiles
    Parents can only view their own children
    """
    permission_classes = [IsParent]
    serializer_class = StudentProfileSerializer
    
    def get_queryset(self):
        """
        Filter students to only show children of the logged-in parent
        """
        parent = self.request.user.parent
        return Student.objects.filter(parent=parent, status='active')
    
    @action(detail=False, methods=['get'])
    def children(self, request):
        """
        List all children of the logged-in parent
        GET /api/students/children/
        """
        parent = request.user.parent
        children = Student.objects.filter(parent=parent, status='active')
        serializer = StudentListSerializer(children, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """
        Get detailed profile of a specific child
        GET /api/students/{id}/
        """
        parent = request.user.parent
        student = get_object_or_404(Student, id=pk, parent=parent, status='active')
        serializer = StudentProfileSerializer(student)
        return Response(serializer.data)

class ParentStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # try common relation names to locate students for this parent
        qs = Student.objects.none()
        lookups = [
            {'parent__user': request.user},
            {'guardian__user': request.user},
            {'parent_user': request.user},
            {'user': request.user},
        ]
        for lookup in lookups:
            try:
                qs = Student.objects.filter(**lookup)
                if qs.exists():
                    break
            except Exception:
                continue
        serializer = StudentSerializer(qs, many=True)
        return Response({'students': serializer.data}, status=status.HTTP_200_OK)
    
# Add these views to your existing apps/students/views.py file

from datetime import datetime, timedelta
from django.db.models import Q, Count
from calendar import monthrange
from .models import Attendance, AttendanceNotification
from .serializers import AttendanceRecordSerializer, AttendanceNotificationSerializer

class AttendanceView(APIView):
    """
    Get monthly attendance data for a student
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get year and month from query params
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))
            
            # Get the first student for this parent
            parent = request.user.parent
            student = Student.objects.filter(parent=parent, status='active').first()
            
            if not student:
                return Response(
                    {'error': 'No active student found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get all days in the month
            days_in_month = monthrange(year, month)[1]
            
            # Create a list of all dates in the month
            all_dates = []
            for day in range(1, days_in_month + 1):
                date = datetime(year, month, day).date()
                all_dates.append(date)
            
            # Get attendance records for the month
            attendance_records = Attendance.objects.filter(
                student=student,
                date__year=year,
                date__month=month
            ).order_by('date')
            
            # Create a dict for quick lookup
            attendance_dict = {record.date: record for record in attendance_records}
            
            # Build the response with all dates
            records = []
            for date in all_dates:
                if date in attendance_dict:
                    record = attendance_dict[date]
                    records.append({
                        'date': date.isoformat(),
                        'status': record.status,
                        'remarks': record.remarks
                    })
                else:
                    records.append({
                        'date': date.isoformat(),
                        'status': None,
                        'remarks': None
                    })
            
            # Calculate summary statistics
            total_present = attendance_records.filter(Q(status='present') | Q(status='late')).count()
            total_absent = attendance_records.filter(status='absent').count()
            total_late = attendance_records.filter(status='late').count()
            total_records = attendance_records.count()
            
            attendance_percentage = round((total_present / total_records * 100), 2) if total_records > 0 else 0
            
            response_data = {
                'student_name': f"{student.first_name} {student.last_name}",
                'student_id': student.student_id,
                'class_name': student.class_name,
                'section': student.section,
                'month': month,
                'year': year,
                'summary': {
                    'total_present': total_present,
                    'total_absent': total_absent,
                    'total_late': total_late,
                    'attendance_percentage': attendance_percentage,
                    'total_days': total_records
                },
                'records': records
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AttendanceNotificationsView(APIView):
    """
    Get all attendance notifications for the parent's students
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            parent = request.user.parent
            students = Student.objects.filter(parent=parent, status='active')
            
            # Get all notifications for these students
            notifications = AttendanceNotification.objects.filter(
                student__in=students
            ).order_by('-created_at')
            
            serializer = AttendanceNotificationSerializer(notifications, many=True)
            
            return Response({
                'notifications': serializer.data,
                'unread_count': notifications.filter(is_read=False).count()
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MarkNotificationReadView(APIView):
    """
    Mark a notification as read
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, notification_id):
        try:
            parent = request.user.parent
            students = Student.objects.filter(parent=parent, status='active')
            
            notification = get_object_or_404(
                AttendanceNotification,
                id=notification_id,
                student__in=students
            )
            
            notification.is_read = True
            notification.save()
            
            return Response(
                {'message': 'Notification marked as read'},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )