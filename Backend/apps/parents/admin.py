from django.contrib import admin
from .models import Parent

# Remove previous registration if it exists
if Parent in admin.site._registry:
    admin.site.unregister(Parent)

@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')
    search_fields = ('user__username', 'phone_number')