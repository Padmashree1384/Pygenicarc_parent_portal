from django.contrib import admin
from .models import Student, Subject, Grade, Attendance

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'first_name', 'last_name', 'class_name', 'status')
    search_fields = ('student_id', 'first_name', 'last_name')
    list_filter = ('class_name', 'status', 'gender')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'marks_obtained')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'status')

# Customize admin site headers
admin.site.site_header = 'Student Portal Administration'
admin.site.site_title = 'Student Portal Admin'
admin.site.index_title = 'Welcome to Student Portal Administration'