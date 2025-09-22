from django.db import models
from user.models import UserProfile,RecruiterProfile

# Create your

class Job(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('B', 'Both'),
    ]
    DEGREE_CHOICES = [
        ('Bachelor', 'Bachelor'),
        ('Master', 'Master'),
        ('Diploma', 'Diploma'),
        ('PhD', 'PhD'),
        ('Other', 'Other'),
    ]
    EXPERIENCE_LEVEL_CHOICES = [
        ('Entry', 'Entry'),
        ('Mid', 'Mid'),
        ('Senior', 'Senior'),
        ('Director', 'Director'),
        ('Intern', 'Intern'),
    ]
    APPLICATION_METHOD_CHOICES = [
        ('Online', 'Online'),
        ('In-person', 'In-person'),
        ('Email', 'Email'),
        ('Phone', 'Phone'),
    ]
    JOB_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
        ('Temporary', 'Temporary'),
    ]

    title = models.CharField(max_length=255, null=True, blank=True)
    company = models.CharField(max_length=255, null=True, blank=True)
    posted_by = models.ForeignKey(RecruiterProfile, on_delete=models.CASCADE,blank=True, null=True)
    description = models.TextField()  # Not nullable
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    agemax = models.PositiveIntegerField(null=True, blank=True)
    agemin = models.PositiveIntegerField(null=True, blank=True)
    other_requirements = models.TextField(null=True, blank=True)
    skills = models.JSONField(null=True, blank=True)
    is_online = models.BooleanField(null=True, blank=True)
    is_remote = models.BooleanField(null=True, blank=True)
    location = models.JSONField(null=True, blank=True)  # Make nullable
    country = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    salary = models.CharField(max_length=255, null=True, blank=True)
    salary_min = models.CharField(max_length=255, null=True, blank=True)
    salary_max = models.CharField(max_length=255, null=True, blank=True)
    deadline = models.CharField(max_length=255, null=True, blank=True)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, null=True, blank=True)  # Make nullable
    category = models.CharField(max_length=255)  # Not nullable
    posted_date = models.CharField(max_length=255, null=True, blank=True)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, null=True, blank=True)  # Make nullable
    degree_required = models.CharField(max_length=20, choices=DEGREE_CHOICES, null=True, blank=True)
    cgpa = models.FloatField(null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=50, null=True, blank=True)
    application_method = models.CharField(max_length=20, choices=APPLICATION_METHOD_CHOICES, null=True, blank=True)  # Make nullable
    application_instructions = models.TextField(null=True, blank=True)
    application_url = models.URLField(null=True, blank=True)
    number_of_positions = models.PositiveIntegerField(null=True, blank=True)
    tags = models.JSONField(null=True, blank=True)
    job_link = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class JobMatch(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="job_matches")
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="user_matches")
    match_percentage = models.FloatField()  # Store as 0-255
    calculated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_profile", "job")

    def __str__(self):
        return f"{self.user_profile.user.username} - {self.job.title}: {self.match_percentage:.2f}%"

class ScraperState(models.Model):
    """
    Stores the last scraped job link or job id for each scraper.
    """
    effoysira_last_job_link = models.URLField(null=True, blank=True)
    ethiojobs_last_job_link = models.URLField(null=True, blank=True)
    hamerejobs_last_job_link = models.URLField(null=True, blank=True)
    kebenajobs_last_job_link = models.URLField(null=True, blank=True)
    hiring_cafe_last_job_id = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ScraperState (updated {self.updated_at})"