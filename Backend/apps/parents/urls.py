from django.urls import path
from .views import ParentMeView

urlpatterns = [
    path("me/", ParentMeView.as_view(), name="parent-me"),
]