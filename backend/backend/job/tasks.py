from celery import shared_task
from user.models import UserProfile
from job.models import Job
from job.models import ScraperState  # <-- Import ScraperState
from scrapers.main_scraper import MainScraper
from dotenv import load_dotenv
import os
import json
import time
from django.core.validators import validate_email, URLValidator
from django.core.exceptions import ValidationError
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from datetime import datetime, timedelta




@shared_task
def scrape_and_save_jobs():
    load_dotenv()
    PAGE_COUNT = 10
    BATCH_SIZE = 3
    RATE_LIMIT_SECONDS = 4

    # Load last_scraped values from ScraperState model
    try:
        scraper_state = ScraperState.objects.latest('updated_at')
        last_scraped = {
            "effoysira": scraper_state.effoysira_last_job_link,
            "ethiojobs": scraper_state.ethiojobs_last_job_link,
            "hamerejobs": scraper_state.hamerejobs_last_job_link,
            "hiring_cafe": scraper_state.hiring_cafe_last_job_id
        }
        use_last_scraped = True
    except ScraperState.DoesNotExist:
        scraper_state = None
        last_scraped = {}
        use_last_scraped = False

    scraper = MainScraper()
    if use_last_scraped:
        all_structured = scraper.scrape_all(
            last_scraped,
            max_pages=PAGE_COUNT,
            batch_size=BATCH_SIZE,
            rate_limit_seconds=RATE_LIMIT_SECONDS
        )
    else:
        # Pass num_jobs if no scraper state
        all_structured = scraper.scrape_all(
            {},
            max_pages=PAGE_COUNT,
            batch_size=BATCH_SIZE,
            rate_limit_seconds=RATE_LIMIT_SECONDS,
            num_jobs=PAGE_COUNT
        )

    latest_effoysira = None
    latest_ethiojobs = None
    latest_hamerejobs = None
    latest_hiring_cafe = None

    for job_data in all_structured.get("jobs", []):
        requirements = job_data.get("requirements", {}) or {}
        education_level = job_data.get("education_level", {}) or {}

        # --- Set category/description defaults ---
        category = job_data.get("category") or "Others"
        description = job_data.get("description") or ""

        # --- CamelCase to snake_case ---
        is_online = job_data.get("isOnline")
        is_remote = job_data.get("is_remote")

        # --- Always use lists for list fields ---
        skills = requirements.get("skills") if isinstance(requirements.get("skills"), list) else []
        location = job_data.get("location") if isinstance(job_data.get("location"), list) else []
        tags = job_data.get("tags") if isinstance(job_data.get("tags"), list) else []

        # --- Validate email/url fields ---
        contact_email = job_data.get("contact_email")
        try:
            if contact_email:
                validate_email(contact_email)
            else:
                contact_email = None
        except ValidationError:
            contact_email = None

        application_url = job_data.get("application_url")
        url_validator = URLValidator()
        try:
            if application_url:
                url_validator(application_url)
            else:
                application_url = None
        except ValidationError:
            application_url = None

        # --- Fix job_link for hiring_cafe ---
        job_link = job_data.get("job_link")
        job_hc_id = job_data.get("job_hc_id")
        source = job_data.get("source")
        if source == "hiring_cafe" and job_hc_id:
            job_link = f"https://hiringcafe.com/{job_hc_id}"

        # Save job to DB
        job_obj = Job.objects.create(
            title=job_data.get("title"),
            company=job_data.get("company"),
            description=description,
            gender=requirements.get("gender"),
            agemax=requirements.get("agemax"),
            agemin=requirements.get("agemin"),
            other_requirements=requirements.get("other"),
            skills=skills,
            is_online=is_online,
            is_remote=is_remote,
            location=location,
            country=job_data.get("country"),
            city=job_data.get("city"),
            address=job_data.get("address"),
            salary=job_data.get("salary"),
            salary_min=job_data.get("salary_min"),
            salary_max=job_data.get("salary_max"),
            deadline=job_data.get("deadline"),
            job_type=job_data.get("job_type"),
            category=category,
            posted_date=job_data.get("posted_date"),
            experience_level=job_data.get("experience_level"),
            degree_required=education_level.get("degree_required"),
            cgpa=education_level.get("cgpa"),
            contact_email=contact_email,
            contact_phone=job_data.get("contact_phone"),
            application_method=job_data.get("application_method"),
            application_instructions=job_data.get("application_instructions"),
            application_url=application_url,
            number_of_positions=job_data.get("number_of_positions"),
            tags=tags,
            job_link=job_link,
        )

        # Track latest job links/ids for each source
        source = job_data.get("source")
        if source == "effoysira" and job_data.get("job_link"):
            latest_effoysira = latest_effoysira or job_data.get("job_link")
        elif source == "ethiojobs" and job_data.get("job_link"):
            latest_ethiojobs = latest_ethiojobs or job_data.get("job_link")
        elif source == "hamerejobs" and job_data.get("job_link"):
            latest_hamerejobs = latest_hamerejobs or job_data.get("job_link")
        elif source == "hiring_cafe" and (job_data.get("job_hc_id") or job_data.get("job_link")):
            latest_hiring_cafe = latest_hiring_cafe or job_data.get("job_hc_id") or job_data.get("job_link")

    # Update ScraperState with latest scraped values
    if scraper_state:
        if latest_effoysira:
            scraper_state.effoysira_last_job_link = latest_effoysira
        if latest_ethiojobs:
            scraper_state.ethiojobs_last_job_link = latest_ethiojobs
        if latest_hamerejobs:
            scraper_state.hamerejobs_last_job_link = latest_hamerejobs
        if latest_hiring_cafe:
            scraper_state.hiring_cafe_last_job_id = latest_hiring_cafe
        scraper_state.save()

    # --- Embedding and Qdrant setup ---
    print("Connecting to Qdrant...")
    qdrant = QdrantClient(host="localhost", port=6333)
    collection_name = "jobs"

    print("Checking existing collections in Qdrant...")
    collections = qdrant.get_collections()
    print("Current collections:", [c.name for c in collections.collections])

    # Create collection if it doesn't exist
    if collection_name not in [c.name for c in collections.collections]:
        print(f"Collection '{collection_name}' does not exist. Creating...")
        qdrant.recreate_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)  # 384 for MiniLM
        )
        print(f"Collection '{collection_name}' created.")
    else:
        print(f"Collection '{collection_name}' already exists.")

    # Load embedding model
    print("Loading embedding model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Embedding model loaded.")

    # Fetch all jobs (or filter for new ones)
    jobs = Job.objects.all()
    print(f"Number of jobs to embed: {len(jobs)}")
    points = []
    for job in jobs:
        # Ensure tags and skills are lists (not QuerySets or None)
        tags = list(job.tags) if job.tags and not isinstance(job.tags, list) else (job.tags or [])
        skills = list(job.skills) if job.skills and not isinstance(job.skills, list) else (job.skills or [])

        print(f"Job ID: {job.id} (type: {type(job.id)}), tags type: {type(tags)}, skills type: {type(skills)}")

        text = f"{job.title or ''} {job.company or ''} {job.description or ''} {skills} {tags}"
        embedding = model.encode(text)
        points.append({
            "id": int(job.id),  # Use integer ID for Qdrant
            "vector": embedding.tolist(),
            "payload": {
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "tags": tags,
                "skills": skills,
            }
        })

    print(f"Prepared {len(points)} points for upsert.")
    # Upsert all points to Qdrant
    if points:
        print(f"Upserting {len(points)} points to Qdrant collection '{collection_name}'...")
        try:
            qdrant.upsert(
                collection_name=collection_name,
                points=points
            )
            print("Upsert complete.")
        except Exception as e:
            print("Qdrant upsert error:", e)
    else:
        print("No points to upsert.")

@shared_task
def remove_expired_jobs():
    """
    Removes jobs that are one week past their deadline.
    """
    now = datetime.now()
    one_week_ago = now - timedelta(days=7)
    expired_jobs = []

    for job in Job.objects.all():
        deadline_str = job.deadline
        if not deadline_str:
            continue
        try:
            # Try parsing deadline as date
            deadline_date = datetime.strptime(deadline_str, "%Y-%m-%d")
        except Exception:
            continue  # Skip if deadline format is invalid

        if deadline_date < one_week_ago:
            expired_jobs.append(job.id)
            job.delete()

    print(f"Removed {len(expired_jobs)} expired jobs: {expired_jobs}")