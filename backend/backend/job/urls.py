from django.urls import path
from . import views
from .views import recruiter_jobs

urlpatterns = [
    path('import_test/', views.import_jobs_from_json, name='import_json'),
    path('feed/', views.jobs_feed, name='jobs_feed'),
    path('search/', views.jobs_search, name='jobs_search'),
    path('<int:job_id>/', views.job_details, name='job_details'),
    path('<int:job_id>/apply_online/', views.apply_online, name='apply_online'),
    path('match_all/',views.match_all_jobs_for_user, name='match_all_jobs'),
    path('recruiter/jobs/create/', views.create_job, name='create_job'),  # <-- Add this line
    path('recruiter/jobs/', recruiter_jobs, name='recruiter_jobs'),
]