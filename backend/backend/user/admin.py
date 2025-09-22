from django.contrib import admin
from .models import User,UserProfile,RecruiterProfile
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(RecruiterProfile)