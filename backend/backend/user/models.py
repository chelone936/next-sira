from django.db import models
from django.contrib.auth.models import User
# from cloudinary.models import CloudinaryField

# Create your models here.
class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="recruiter_profile")
    company_name = models.CharField(max_length=100)
    company_website = models.URLField(blank=True)
    position = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    bio = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} (Recruiter)"
    
    
class UserProfile(models.Model):
    EXPERIENCE_LEVELS = [
        ("entry", "Entry Level (0-2 years)"),
        ("mid", "Mid Level (3-5 years)"),
        ("senior", "Senior Level (6-10 years)"),
        ("lead", "Lead/Principal (10+ years)"),
    ]
    JOB_TYPES = [
        ("full-time", "Full-time"),
        ("part-time", "Part-time"),
        ("contract", "Contract"),
        ("freelance", "Freelance"),
        ("internship", "Internship"),
    ]


    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    experience = models.CharField(max_length=10, choices=EXPERIENCE_LEVELS, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    skills = models.CharField(max_length=255, blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    preferred_locations = models.CharField(max_length=255, blank=True)
    job_types = models.CharField(max_length=20, choices=JOB_TYPES, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
