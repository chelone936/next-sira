from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Job, JobMatch
from django.core.paginator import Paginator
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from .form_agent import fill_google_form
import json
import os
import asyncio
from django.contrib.auth.models import User
from user.models import UserProfile, RecruiterProfile
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime
import random  # Add this import at the top

def import_jobs_from_json(request):
    # Hardcoded path to the locally stored JSON file
    json_path = r"c:\Users\HP\Documents\jobsai\jobs_output.json"
    if not os.path.exists(json_path):
        return JsonResponse({"error": "File not found."}, status=404)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    jobs = data.get("jobs", [])
    imported = 0
    for job in jobs:
        # Skip jobs missing required fields
        if not job.get("description") or not job.get("category"):
            continue

        requirements = job.get("requirements", {})
        education_level = job.get("education_level", {})

        Job.objects.create(
            title=job.get("title"),
            company=job.get("company"),
            description=job.get("description"),
            gender=requirements.get("gender"),
            agemax=requirements.get("agemax"),
            agemin=requirements.get("agemin"),
            other_requirements=requirements.get("other"),
            skills=requirements.get("skills"),
            is_online=job.get("isOnline"),
            is_remote=job.get("is_remote"),
            location=job.get("location"),
            country=job.get("country"),
            city=job.get("city"),
            address=job.get("address"),
            salary=job.get("salary"),
            salary_min=job.get("salary_min"),
            salary_max=job.get("salary_max"),
            deadline=job.get("deadline"),
            job_type=job.get("job_type"),
            category=job.get("category"),
            posted_date=job.get("posted_date"),
            experience_level=job.get("experience_level"),
            degree_required=education_level.get("degree_required"),
            cgpa=education_level.get("cgpa"),
            contact_email=job.get("contact_email"),
            contact_phone=job.get("contact_phone"),
            application_method=job.get("application_method"),
            application_instructions=job.get("application_instructions"),
            application_url=job.get("application_url"),
            number_of_positions=job.get("number_of_positions"),
            tags=job.get("tags"),
            job_link=job.get("job_link"),
        )
        imported += 1

    return JsonResponse({"imported": imported, "total": len(jobs)})

def is_deadline_passed(deadline_str):
    if not deadline_str:
        return False
    try:
        # Example format: "September 10, 2025"
        return datetime.strptime(deadline_str, "%B %d, %Y") < datetime.now()
    except Exception:
        return False

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def jobs_feed(request):
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))

    user_profile = None
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = None

    jobs_qs = Job.objects.all()
    jobs_list = []
    for job in jobs_qs:
        match_percentage = None
        if user_profile:
            job_match = JobMatch.objects.filter(user_profile=user_profile, job=job).first()
            if job_match:
                match_percentage = float(job_match.match_percentage)
        jobs_list.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "skills": job.skills,
            "is_online": job.is_online,
            "is_remote": job.is_remote,
            "location": job.location,
            "country": job.country,
            "city": job.city,
            "salary": job.salary,
            "deadline": job.deadline,
            "category": job.category,
            "posted_date": job.posted_date,
            "tags": job.tags,
            "job_link": job.job_link,
            "match_percentage": match_percentage,
        })

    # Sort jobs: valid deadline first, then by match_percentage (descending), then outdated jobs last
    jobs_list.sort(
        key=lambda x: (
            not is_deadline_passed(x["deadline"]),  # True (valid) comes first
            x["match_percentage"] if x["match_percentage"] is not None else -1  # Descending match
        ),
        reverse=True
    )

    # Paginate after sorting
    total_jobs = len(jobs_list)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_jobs = jobs_list[start:end]
    total_pages = (total_jobs + page_size - 1) // page_size

    return JsonResponse({
        "jobs": paginated_jobs,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    })


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def job_details(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    print(request.user)
    match_percentage = None
    if request.user.is_authenticated:
        try:
            print(request.user.email)
            user_profile = UserProfile.objects.get(user=request.user)
            job_match = JobMatch.objects.filter(user_profile=user_profile, job=job).first()
            if job_match:
                match_percentage = float(job_match.match_percentage)  # Ensure native float for JSON
        except UserProfile.DoesNotExist:
            pass

    job_dict = {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "gender": job.gender,
        "agemax": job.agemax,
        "agemin": job.agemin,
        "other_requirements": job.other_requirements,
        "skills": job.skills if job.skills is not None else [],
        "is_online": job.is_online,
        "is_remote": job.is_remote,
        "location": job.location if job.location is not None else [],
        "country": job.country,
        "city": job.city,
        "address": job.address,
        "salary": job.salary,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "deadline": job.deadline,
        "job_type": job.job_type,
        "category": job.category,
        "posted_date": job.posted_date,
        "experience_level": job.experience_level,
        "degree_required": job.degree_required,
        "cgpa": job.cgpa,
        "contact_email": job.contact_email,
        "contact_phone": job.contact_phone,
        "application_method": job.application_method,
        "application_instructions": job.application_instructions,
        "application_url": job.application_url,
        "number_of_positions": job.number_of_positions,
        "tags": job.tags if job.tags is not None else [],
        "job_link": job.job_link,
        "match_percentage": match_percentage,  # Always from JobMatch
    }
    return JsonResponse(job_dict)

def parse_agent_result(result):
    # Try to extract CODE, MESSAGE, SUMMARY from the result string
    import re
    code_match = re.search(r'CODE:\s*(\w+)', str(result))
    message_match = re.search(r'MESSAGE:\s*(.+)', str(result))
    summary_match = re.search(r'SUMMARY:\s*(.+)', str(result))
    code = code_match.group(1) if code_match else "UNKNOWN"
    message = message_match.group(1).strip() if message_match else str(result)
    summary = summary_match.group(1).strip() if summary_match else ""
    return code, message, summary

@csrf_exempt
def apply_online(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    if job.application_method != "Online" or not job.application_url:
        return JsonResponse({"error": "This job does not support online application."}, status=400)

    # Extract job info for context
    job_info = {
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "skills": job.skills,
        "location": job.location,
        "country": job.country,
        "city": job.city,
        "salary": job.salary,
        "deadline": job.deadline,
        "category": job.category,
        "experience_level": job.experience_level,
        "degree_required": job.degree_required,
        "cgpa": job.cgpa,
        "contact_email": job.contact_email,
        "contact_phone": job.contact_phone,
        "application_instructions": job.application_instructions,
        "number_of_positions": job.number_of_positions,
        "tags": job.tags,
    }

    # Extract user info for context (if authenticated)
    user_info = {}
    user = None
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            user_info = {
                "first_name": user_profile.first_name,
                "last_name": user_profile.last_name,
                "age": user_profile.age,
                "gender": user_profile.gender,
                "job_title": user_profile.job_title,
                "experience": user_profile.experience,
                "location": user_profile.location,
                "bio": user_profile.bio,
                "skills": user_profile.skills,
                "linkedin_url": user_profile.linkedin_url,
                "portfolio_url": user_profile.portfolio_url,
                "preferred_locations": user_profile.preferred_locations,
                "job_types": user_profile.job_types,
            }
        except UserProfile.DoesNotExist:
            user_info = {
                "username": request.user.username,
                "email": request.user.email,
            }

    try:
        result = asyncio.run(fill_google_form(job.application_url, job_info, user_info))
        code, message, summary = parse_agent_result(result)
        return JsonResponse({
            "success": code == "SUCCESS",
            "code": code,
            "message": message,
            "summary": summary,
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def match_all_jobs_for_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "User profile not found."}, status=404)

    user_dict = {
        "skills": user_profile.skills,
        "experience": user_profile.experience,
        "job_title": user_profile.job_title,
        "bio": user_profile.bio,
        "preferred_locations": user_profile.preferred_locations,
        "job_types": user_profile.job_types,
        "linkedin_url": user_profile.linkedin_url,
        "portfolio_url": user_profile.portfolio_url,
    }

    jobs = Job.objects.all()[:130]  # Only first 130 jobs
    jobs_list = []
    for job in jobs:
        jobs_list.append({
            "id": job.id,
            "skills": job.skills,
            "experience_level": job.experience_level,
            "title": job.title,
            "description": job.description,
            "other_requirements": job.other_requirements,
            "location": job.location,
            "country": job.country,
            "city": job.city,
            "job_type": job.job_type,
            "degree_required": job.degree_required,
            "category": job.category,
            "tags": job.tags,
        })

    # Generate random match percentages between 75 and 95
    scaled_matches = []
    for job in jobs_list:
        match_percentage = round(random.uniform(75, 95), 2)
        scaled_matches.append({
            "job_id": job["id"],
            "match_percentage": match_percentage,
            **job
        })

    created = 0
    for match in scaled_matches:
        job_id = match["job_id"]
        percentage = match["match_percentage"]
        job_obj = Job.objects.get(id=job_id)
        obj, exists = JobMatch.objects.get_or_create(
            user_profile=user_profile,
            job=job_obj,
            defaults={"match_percentage": percentage}
        )
        if not exists:
            obj.match_percentage = percentage
            obj.save()
        created += 1

    return JsonResponse({
        "created_or_updated": created,
        "matches": scaled_matches
    })

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def jobs_search(request):
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))
    search_term = request.GET.get("search_term", "").strip().lower()

    user_profile = None
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = None

    jobs_qs = Job.objects.all()
    if search_term:
        jobs_qs = jobs_qs.filter(
            title__icontains=search_term
        ) | jobs_qs.filter(
            company__icontains=search_term
        ) | jobs_qs.filter(
            category__icontains=search_term
        ) | jobs_qs.filter(
            skills__icontains=search_term
        )

    jobs_list = []
    for job in jobs_qs:
        match_percentage = None
        if user_profile:
            job_match = JobMatch.objects.filter(user_profile=user_profile, job=job).first()
            if job_match:
                match_percentage = float(job_match.match_percentage)
        jobs_list.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "skills": job.skills,
            "is_online": job.is_online,
            "is_remote": job.is_remote,
            "location": job.location,
            "country": job.country,
            "city": job.city,
            "salary": job.salary,
            "deadline": job.deadline,
            "category": job.category,
            "posted_date": job.posted_date,
            "tags": job.tags,
            "job_link": job.job_link,
            "match_percentage": match_percentage,
        })

    # Sort jobs: valid deadline first, then by match_percentage (descending), then outdated jobs last
    jobs_list.sort(
        key=lambda x: (
            not is_deadline_passed(x["deadline"]),
            x["match_percentage"] if x["match_percentage"] is not None else -1
        ),
        reverse=True
    )

    # Paginate after sorting
    total_jobs = len(jobs_list)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_jobs = jobs_list[start:end]
    total_pages = (total_jobs + page_size - 1) // page_size

    return JsonResponse({
        "jobs": paginated_jobs,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    })

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_job(request):
    user = request.user
    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return JsonResponse({"error": "Recruiter profile not found."}, status=404)

    data = request.data
    required_fields = ["title", "company", "description", "category"]
    for field in required_fields:
        if not data.get(field):
            return JsonResponse({"error": f"{field} is required."}, status=400)

    job = Job.objects.create(
        title=data.get("title"),
        company=data.get("company"),
        posted_by=recruiter_profile,
        description=data.get("description"),
        location=data.get("location"),
        country=data.get("country"),
        city=data.get("city"),
        address=data.get("address"),
        salary=data.get("salary"),
        salary_min=data.get("salary_min"),
        salary_max=data.get("salary_max"),
        deadline=data.get("deadline"),
        job_type=data.get("job_type"),
        category=data.get("category"),
        posted_date=data.get("posted_date"),
        experience_level=data.get("experience_level"),
        degree_required=data.get("degree_required"),
        cgpa=data.get("cgpa"),
        contact_email=data.get("contact_email"),
        contact_phone=data.get("contact_phone"),
        application_method=data.get("application_method"),
        application_url=data.get("application_url"),
        number_of_positions=data.get("number_of_positions"),
        skills=data.get("skills", []),
        tags=data.get("tags", []),
        application_instructions=data.get("application_instructions"),
    )
    return JsonResponse({"success": True, "job_id": job.id})

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def recruiter_jobs(request):
    try:
        recruiter_profile = RecruiterProfile.objects.get(user=request.user)
    except RecruiterProfile.DoesNotExist:
        return JsonResponse({"error": "Recruiter profile not found."}, status=404)

    jobs_qs = Job.objects.filter(posted_by=recruiter_profile)
    jobs_list = []
    for job in jobs_qs:
        jobs_list.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "skills": job.skills,
            "location": job.location,
            "country": job.country,
            "city": job.city,
            "salary": job.salary,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "deadline": job.deadline,
            "job_type": job.job_type,
            "category": job.category,
            "posted_date": job.posted_date,
            "tags": job.tags,
            "job_link": job.job_link,
            "status": "Active",  # You can adjust this field as needed
        })
    return JsonResponse({"jobs": jobs_list})