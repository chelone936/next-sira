from django.contrib import admin
from .models import Job,JobMatch, ScraperState
# Register your models here.
admin.site.register(Job)
admin.site.register(JobMatch)
admin.site.register(ScraperState)
