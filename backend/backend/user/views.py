from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, FileResponse, HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from .resume import enhance_resume, structured_resume_to_pdf_bytes, generate_cover_letter
from .models import UserProfile, RecruiterProfile
from job.models import Job
import json
import base64
from .x import enhance_resume_design
from .y import enhance_resume_with_template

@csrf_exempt
@api_view(['POST'])
def register(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    if not email or not password:
        return JsonResponse({'error': 'Email and password required'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already exists'}, status=400)

    # Set username as email
    user = User.objects.create_user(username=email, email=email, password=password)
    UserProfile.objects.create(user=user, first_name=first_name, last_name=last_name)
    return JsonResponse({'message': 'User created'}, status=201)

@csrf_exempt
@api_view(['POST'])
def token_obtain_pair(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    user = authenticate(username=user.username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        # Check if user has a profile object
        has_profile = hasattr(user, "profile")
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'has_profile': has_profile,
        })
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

@api_view(['GET', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)

    if request.method == 'GET':
        data = {
            'email': user.email,
            'first_name': profile.first_name,
            'last_name': profile.last_name,
            'age': profile.age,
            'gender': profile.gender,
            'job_title': profile.job_title,
            'experience': profile.experience,
            'location': profile.location,
            'bio': profile.bio,
            'skills': profile.skills,
            'linkedin_url': profile.linkedin_url,
            'portfolio_url': profile.portfolio_url,
            'preferred_locations': profile.preferred_locations,
            'job_types': profile.job_types,
        }
        return JsonResponse(data)

    if request.method == 'PUT':
        data = json.loads(request.body)
        for field in [
            'first_name', 'last_name', 'age', 'gender', 'job_title', 'experience',
            'location', 'bio', 'skills', 'linkedin_url', 'portfolio_url',
            'preferred_locations', 'job_types'
        ]:
            if field in data:
                setattr(profile, field, data[field])
        profile.save()
        return JsonResponse({'message': 'Profile updated'})

@csrf_exempt
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def onboarding(request):
    user = request.user
    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)

    data = request.data

    # Skills: expect array or comma-separated string, store as comma-separated string
    skills = data.get('skills')
    if isinstance(skills, str):
        try:
            skills_list = json.loads(skills)
            if isinstance(skills_list, list):
                skills_str = ",".join([str(s).strip() for s in skills_list if s])
            else:
                skills_str = skills
        except Exception:
            skills_str = skills
    elif isinstance(skills, list):
        skills_str = ",".join([str(s).strip() for s in skills if s])
    else:
        skills_str = ""

    # Handle file upload
    resume_file = request.FILES.get('resume')
    if resume_file:
        profile.resume = resume_file

    # Map frontend fields to model fields
    field_map = {
        "location": "location",
        "preferredLocations": "preferred_locations",
        "salaryRange": "salary_range",
        "jobTypes": "job_types",
        "bio": "bio",
        "linkedinUrl": "linkedin_url",
        "portfolioUrl": "portfolio_url",
        "availability": "availability",
    }

    for frontend_field, model_field in field_map.items():
        value = data.get(frontend_field)
        if value is not None:
            setattr(profile, model_field, value)

    profile.skills = skills_str
    profile.save()

    return JsonResponse({'message': 'Onboarding data saved'})

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_resume(request):
    user = request.user
    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)

    if not profile.resume:
        return JsonResponse({'error': 'Resume not found'}, status=404)

    response = FileResponse(profile.resume.open(), as_attachment=True, filename=profile.resume.name)
    return response

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def enhance_resume_view(request):
    file = request.FILES.get('resume')
    if not file:
        print("No resume file provided in request.")
        return JsonResponse({'error': 'No resume file provided'}, status=400)
    result, error = enhance_resume_with_template(file, file.name)
    if error:
        print(f"Enhance error: {error}")
        return JsonResponse({'error': error}, status=400)
    # Return HTML and scores directly to frontend (no PDF)
    response_data = {
        "html": result.get("html"),
        "score": result.get("score"),
        "subscores": result.get("subscores"),
        "improvements": result.get("improvements"),
    }
    return JsonResponse(response_data)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def enhance_user_resume_view(request):
    user = request.user
    try:
        profile = user.profile
    except UserProfile.DoesNotExist as e:
        print(f"Profile not found: {e}")
        return JsonResponse({'error': 'Profile not found'}, status=404)
    if not profile.resume:
        print("Resume not found for user.")
        return JsonResponse({'error': 'Resume not found'}, status=404)
    resume_file = profile.resume.open()
    filename = profile.resume.name
    result, error = enhance_resume(resume_file, filename)
    resume_file.close()
    if error:
        print(f"Enhance error: {error}")
        return JsonResponse({'error': error}, status=400)
    pdf_bytes = structured_resume_to_pdf_bytes(result)
    if not pdf_bytes:
        print("PDF conversion failed.")
        return JsonResponse({'error': 'PDF conversion failed'}, status=500)
    pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")
    response_data = {
        "score": result.get("score"),
        "subscores": result.get("subscores"),
        "improvements": result.get("improvements"),
        "pdf_base64": pdf_base64,
    }
    return JsonResponse(response_data)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def generate_cover_letter_view(request):
    """
    Expects JSON body with 'job_id'.
    Uses current user's profile and job info to generate a cover letter.
    """
    try:
        data = json.loads(request.body)
        job_id = data.get("job_id")
        if not job_id:
            return JsonResponse({"error": "job_id required"}, status=400)
        user = request.user
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'Profile not found'}, status=404)
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return JsonResponse({'error': 'Job not found'}, status=404)

        # Prepare user_info dict
        user_info = {
            "name": f"{profile.first_name} {profile.last_name}",
            "email": user.email,
            "phone": "",  # Add phone if available in profile
            "education": "",  # Add education if available in profile
            "experience": profile.experience,
            "skills": [s.strip() for s in profile.skills.split(",") if s.strip()],
            "summary": profile.bio,
        }
        # Prepare job_info dict
        job_info = {
            "title": job.title,
            "company": job.company,
            "description": job.description,
            "requirements": job.other_requirements,
            "location": job.location,
        }
        cover_letter, error = generate_cover_letter(user_info, job_info)
        if error:
            return JsonResponse({"error": error}, status=400)
        return JsonResponse({"cover_letter": cover_letter})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def recruiter_onboarding(request):
    user = request.user
    try:
        profile = user.recruiter_profile
    except RecruiterProfile.DoesNotExist:
        profile = RecruiterProfile(user=user)

    data = request.data

    field_map = {
        "company_name": "company_name",
        "company_website": "company_website",
        "position": "position",
        "contact_email": "contact_email",
        "bio": "bio",
        "linkedin_url": "linkedin_url",
    }

    for frontend_field, model_field in field_map.items():
        value = data.get(frontend_field)
        if value is not None:
            setattr(profile, model_field, value)

    profile.save()
    return JsonResponse({'message': 'Recruiter onboarding data saved'})
