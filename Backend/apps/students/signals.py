# Create a new file: apps/students/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Attendance, AttendanceNotification

@receiver(post_save, sender=Attendance)
def create_absence_notification(sender, instance, created, **kwargs):
    """
    Automatically create a notification when a student is marked absent
    """
    if instance.status == 'absent':
        # Create or update notification
        notification, created = AttendanceNotification.objects.get_or_create(
            student=instance.student,
            date=instance.date,
            defaults={
                'message': f"ALERT: {instance.student.first_name} {instance.student.last_name} was marked absent on {instance.date.strftime('%B %d, %Y')}.",
                'is_read': False
            }
        )
        
        if not created and not notification.is_read:
            # Update the message if notification already exists
            notification.message = f"ALERT: {instance.student.first_name} {instance.student.last_name} was marked absent on {instance.date.strftime('%B %d, %Y')}."
            notification.save()


# Then update apps/students/apps.py to register the signals:

# apps/students/apps.py
from django.apps import AppConfig

class StudentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.students'

    def ready(self):
        import apps.students.signals  # Import signals when app is ready