# Update your apps/students/urls.py file

from django.urls import path
from .views import (
    StudentViewSet, 
    StudentProfileView, 
    ParentStudentsView,
    AttendanceView,
    AttendanceNotificationsView,
    MarkNotificationReadView
)

urlpatterns = [
    # Get current user's student profile (first child if multiple)
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
    
    # List all children
    path('children/', StudentViewSet.as_view({'get': 'children'}), name='student-children'),
    
    # Get specific child by ID
    path('<int:pk>/', StudentViewSet.as_view({'get': 'retrieve'}), name='student-detail'),

    # Parent's view to see all their students
    path('my-students/', ParentStudentsView.as_view(), name='parent-students'),
    
    # Attendance endpoints
    path('attendance/', AttendanceView.as_view(), name='student-attendance'),
    path('notifications/', AttendanceNotificationsView.as_view(), name='attendance-notifications'),
    path('notifications/<int:notification_id>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
]