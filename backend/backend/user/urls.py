from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import recruiter_onboarding

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.profile, name='profile'),
    path('onboarding/', views.onboarding, name='onboarding'),
    path('resume/', views.get_resume, name='get_resume'),
    path('enhance-resume/', views.enhance_resume_view, name='enhance_resume'),  # For uploaded resume enhancement
    path('enhance-user-resume/', views.enhance_user_resume_view, name='enhance_user_resume'),  # For user's own resume enhancement
    path('generate-cover-letter/', views.generate_cover_letter_view, name='generate_cover_letter'),  # <-- Add this
    path('recruiter_onboarding/', recruiter_onboarding, name='recruiter_onboarding'),
]