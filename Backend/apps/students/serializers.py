from rest_framework import serializers
from .models import Student, Grade, Subject, Attendance, Parent

class GradeSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source='subject.name')
    
    class Meta:
        model = Grade
        fields = ['subject', 'marks_obtained', 'total_marks', 'grade', 'percentage', 'exam_name', 'exam_date']

class StudentProfileSerializer(serializers.ModelSerializer):
    grades = serializers.SerializerMethodField()
    attendance_percentage = serializers.SerializerMethodField()
    overall_percentage = serializers.SerializerMethodField()
    overall_grade = serializers.SerializerMethodField()
    total_marks_obtained = serializers.SerializerMethodField()
    total_marks = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = '__all__'
    
    def get_grades(self, obj):
        # Get latest grades for each subject
        latest_grades = Grade.objects.filter(student=obj).order_by('subject', '-exam_date').distinct('subject')
        return GradeSerializer(latest_grades, many=True).data
    
    def get_attendance_percentage(self, obj):
        from django.db.models import Count, Q
        attendance = Attendance.objects.filter(student=obj)
        total = attendance.count()
        if total == 0:
            return 0
        present = attendance.filter(Q(status='present') | Q(status='late')).count()
        return round((present / total) * 100, 2)
    
    def get_overall_percentage(self, obj):
        grades = Grade.objects.filter(student=obj).order_by('subject', '-exam_date').distinct('subject')
        if not grades:
            return 0
        
        total_obtained = sum(float(g.marks_obtained) for g in grades)
        total_marks = sum(float(g.total_marks) for g in grades)
        
        if total_marks == 0:
            return 0
        return round((total_obtained / total_marks) * 100, 2)
    
    def get_total_marks_obtained(self, obj):
        grades = Grade.objects.filter(student=obj).order_by('subject', '-exam_date').distinct('subject')
        return round(sum(float(g.marks_obtained) for g in grades), 2)
    
    def get_total_marks(self, obj):
        grades = Grade.objects.filter(student=obj).order_by('subject', '-exam_date').distinct('subject')
        return round(sum(float(g.total_marks) for g in grades), 2)
    
    def get_overall_grade(self, obj):
        percentage = self.get_overall_percentage(obj)
        if percentage >= 90:
            return 'A+'
        elif percentage >= 80:
            return 'A'
        elif percentage >= 70:
            return 'B+'
        elif percentage >= 60:
            return 'B'
        elif percentage >= 50:
            return 'C'
        elif percentage >= 40:
            return 'D'
        else:
            return 'F'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Structure the data for frontend
        return {
            'personal_info': {
                'student_id': data['student_id'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'date_of_birth': data['date_of_birth'],
                'gender': data.get('gender'),
                'contact_number': data.get('contact_number'),
                'email': data.get('email'),
                'address': data.get('address'),
                'status': data.get('status'),
            },
            'academic_info': {
                'class_name': data['class_name'],
                'section': data['section'],
                'roll_number': data['roll_number'],
                'attendance_percentage': data['attendance_percentage'],
                'grades': data['grades'],
                'overall_percentage': data['overall_percentage'],
                'overall_grade': data['overall_grade'],
                'total_marks_obtained': data['total_marks_obtained'],
                'total_marks': data['total_marks'],
            }
        }

class StudentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing children"""
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'first_name', 'last_name', 'class_name', 'section', 'status']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'student_id', 'first_name', 'last_name', 'class_name', 'gender', 'status')

# Add these to your existing apps/students/serializers.py file

from .models import Attendance, AttendanceNotification

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['date', 'status', 'remarks']


class AttendanceNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceNotification
        fields = ['id', 'date', 'message', 'is_read', 'created_at']