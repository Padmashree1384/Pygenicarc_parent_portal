from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from apps.students.models import Student

class ParentMeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        # Get children associated with this parent
        children = Student.objects.filter(parent=user)
        
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "children": [
                {
                    "id": child.id,
                    "full_name": child.full_name,
                    "student_class": child.student_class,
                    "notes": child.notes
                }
                for child in children
            ]
        })