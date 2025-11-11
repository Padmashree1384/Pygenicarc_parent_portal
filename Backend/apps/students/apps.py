# Then update apps/students/apps.py to register the signals:

# apps/students/apps.py
from django.apps import AppConfig

class StudentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.students'

    def ready(self):
        import apps.students.signals  # Import signals when app is ready