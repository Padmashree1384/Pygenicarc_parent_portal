from django.db import models
from django.utils import timezone
from datetime import date
from apps.parents.models import Parent

class Student(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('graduated', 'Graduated'),
    ]

    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='children')
    student_id = models.CharField(max_length=20, unique=True, default='STU000')
    first_name = models.CharField(max_length=100, default='First')
    last_name = models.CharField(max_length=100, default='Last')
    date_of_birth = models.DateField(default=date(2000, 1, 1))
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    contact_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    class_name = models.CharField(max_length=50, default='Class 1')
    address = models.TextField(blank=True)  # Added address field
    section = models.CharField(max_length=10, default='A')
    roll_number = models.CharField(max_length=20, default='0001')
    admission_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    total_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, editable=False)
    grade = models.CharField(max_length=2)
    exam_name = models.CharField(max_length=100)
    exam_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.percentage = (self.marks_obtained / self.total_marks) * 100
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('student', 'subject', 'exam_name')

class Attendance(models.Model):
    ATTENDANCE_STATUS = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS, default='present')
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'date')

class AttendanceNotification(models.Model):
    """Model to track absence notifications sent to parents"""
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notifications')
    date = models.DateField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('student', 'date')

    def __str__(self):
        return f"Notification for {self.student.student_id} - {self.date}"