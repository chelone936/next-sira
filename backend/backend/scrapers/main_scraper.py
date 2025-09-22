import time
import os
import re
import json
import unicodedata
from dotenv import load_dotenv

from .effoysira import scrape_jobs_until_job as effoysira_scrape
from .ethiojobs import scrape_jobs_until_job as ethiojobs_scrape
from .hamerejobs import scrape_jobs_until_job as hamerejobs_scrape
from .hiring_cafe import scrape_jobs_until_job as hiring_cafe_scrape

import google.generativeai as genai

# --- Data Models ---
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, validator

class Gender(str, Enum):
    M = "M"
    F = "F"
    B = "B"

class DegreeRequired(str, Enum):
    BACHELOR = "Bachelor"
    MASTER = "Master"
    DIPLOMA = "Diploma"
    PHD = "PhD"
    OTHER = "Other"

class ExperienceLevel(str, Enum):
    ENTRY = "Entry"
    MID = "Mid"
    SENIOR = "Senior"
    DIRECTOR = "Director"
    INTERN = "Intern"

class ApplicationMethod(str, Enum):
    ONLINE = "Online"
    IN_PERSON = "In-person"
    EMAIL = "Email"
    PHONE = "Phone"

class JobType(str, Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"
    TEMPORARY = "Temporary"

class EducationLevel(BaseModel):
    degree_required: DegreeRequired
    cgpa: Optional[float] = None

class Requirements(BaseModel):
    gender: Optional[Gender] = None
    agemax: Optional[int] = None
    agemin: Optional[int] = None
    other: Optional[str] = None
    skills: List[str] = []

class Job(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: str = ""  # Not nullable, default to empty string
    requirements: Optional[Requirements] = None
    isOnline: Optional[bool] = None
    is_remote: Optional[bool] = None
    location: List[str] = []
    country: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    salary: Optional[str] = None
    salary_min: Optional[str] = None
    salary_max: Optional[str] = None
    deadline: Optional[str] = None
    job_type: JobType
    category: str = "Others"  # Not nullable, default to 'Others'
    posted_date: Optional[str] = None
    experience_level: ExperienceLevel
    education_level: Optional[EducationLevel] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    application_method: ApplicationMethod
    application_instructions: Optional[str] = None
    application_url: Optional[str] = None
    number_of_positions: Optional[int] = None
    tags: List[str] = []
    job_link: Optional[str] = None
    job_hc_id: Optional[str] = None
    source: Optional[str] = None


class Jobs(BaseModel):
    jobs: Optional[List[Job]] = None

# --- Utility Functions ---
def extract_json(text):
    text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
    text = re.sub(r"```$", "", text)
    text = re.sub(r"^\s*//.*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^.*?=\s*", "", text, count=1)
    text = re.sub(r"^import.*\n", "", text)
    text = re.sub(r",(\s*[}\]])", r"\1", text)
    text = re.sub(r'\\(?!["\\/bfnrtu])', r"\\\\", text)
    text = text.replace("\\xa0", " ")
    return text.strip()

def clean_json_string(text):
    text = ''.join(ch for ch in text if unicodedata.category(ch)[0] != 'C' or ch in '\n\r\t')
    text = re.sub(r'\\(?!["\\/bfnrtu])', r'', text)
    return text

def batch_jobs(jobs, batch_size):
    for i in range(0, len(jobs), batch_size):
        yield jobs[i:i+batch_size]

def ask_gemini(prompt):
    api_key = os.getenv("API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    parts = [{"text": prompt}]
    response = model.generate_content(parts)
    if hasattr(response, "candidates") and response.candidates and response.candidates[0].content.parts:
        part = response.candidates[0].content.parts[0]
        if hasattr(part, 'text'):
            return part.text
    return "Sorry, I couldn't generate a response."

# --- Main Scraper Class ---
class MainScraper:
    """
    Scrapes multiple job sites until the last scraped value for each,
    then enhances/structures the jobs using Gemini LLM.
    """

    def scrape_all(self, last_scraped_dict, max_pages=10, batch_size=5, rate_limit_seconds=4, num_jobs=None):
        """
        Scrapes all jobs, enhances them with Gemini, and returns structured jobs as a dict.
        Does NOT save to any file.
        """
        # Step 1: Scrape raw jobs
        results = {}

        # Scrape from each source
        results["effoysira"] = effoysira_scrape(num_jobs=num_jobs)
        results["ethiojobs"] = ethiojobs_scrape(num_jobs=num_jobs)
        results["hamerejobs"] = hamerejobs_scrape(num_jobs=num_jobs)
        results["hiring_cafe"] = hiring_cafe_scrape(None, max_pages, pages_to_fetch=1)[:num_jobs]

        # Separate hiring_cafe jobs for special processing
        hiring_cafe_jobs = results.pop("hiring_cafe", [])
        # Combine all other jobs into one flat list
        raw_jobs = []
        for jobs in results.values():
            if isinstance(jobs, list):
                for job in jobs:
                    if isinstance(job, list):
                        raw_jobs.extend(job)
                    else:
                        raw_jobs.append(job)
            else:
                raw_jobs.append(jobs)
        print(f"Total jobs scraped (excluding hiring_cafe): {len(raw_jobs)}")
        print(f"Total hiring_cafe jobs scraped: {len(hiring_cafe_jobs)}")

        all_structured_jobs = []

        # --- Process non-hiring_cafe jobs ---
        for batch_num, jobs_batch in enumerate(batch_jobs(raw_jobs, batch_size), start=1):
            print(f"Processing batch {batch_num} (non-hiring_cafe) with {len(jobs_batch)} jobs...")

            indexed_batch = []
            for idx, job in enumerate(jobs_batch):
                job_with_index = dict(job)
                job_with_index["index"] = idx
                job_with_index["job_link"] = job.get("job_link") or job.get("url")
                job_with_index["source"] = job.get("source", "other")
                indexed_batch.append(job_with_index)

            prompt = """
You are an expert AI job data structurer and editor. Your job is to take a list of raw job postings (as Python dicts) and convert them into a JSON object with a single key 'jobs', whose value is a list of job objects.

For each job:
- REWRITE and ENRICH all text fields (including 'description', 'skills', 'tags', 'requirements.other', etc.) to ensure:
    - Correct grammar, spelling, and punctuation.
    - Consistent, professional, and concise writing style.
    - Neutral tone, clear and easy to understand.
    - Use complete sentences and avoid passive voice where possible.
    - Avoid jargon, abbreviations, or overly technical language unless necessary for the job.
    - Do NOT copy the original text verbatim; always rewrite for clarity and consistency.
- The 'description' field must contain all job responsibilities and other job-related information (such as duties, tasks, benefits, company info, etc.), rewritten as a single, well-structured section. DO NOT include requirements here.
- The 'requirements.other' field must contain ALL requirements for the job (including experience, education, and any other requirements), rewritten for clarity and consistency. DO NOT include responsibilities or job-related information here.
- For the 'skills' field, list both the required skills mentioned in the job posting AND any additional skills that a qualified applicant should have for this job, even if not explicitly listed. Rewrite each skill for clarity and consistency.
- The 'description' field should contain only the content of the job description, ready to display to users. DO NOT include any section headers or titles like "About the Job", "Role Description", "Role Summary", etc. Only provide the main content, rewritten as described above.
- Ensure all fields are well-structured, consistently formatted, and look professional.
- Do not merge or split jobs; keep the original job count and structure.

If a job requires payment to get considered for hiring don't put it in this list.

IMPORTANT: Sometimes a single web page may contain multiple different job postings. If you see multiple jobs in the same page, you must return EACH job as a separate entry in the output list. Do NOT merge multiple jobs from the same page into one job object. Each job, even if scraped from the same page, must be a separate object in the 'jobs' list.

Each job object should have the following fields (with their meaning):

- index: The index of the job in the batch (integer, starting from 0). This is used for matching.
- title: The job title or position name (DO NOT include the company name here).
- company: The name of the hiring company or organization.
- description: The main content of the job description, ready to display to users, with NO section headers or titles. MUST include all responsibilities and job-related information, but NOT requirements.
- requirements: An object with the following fields:
    - gender: Gender requirement, must be one of "M" (Male), "F" (Female), or "B" (Both).
    - agemax: Maximum age allowed, if specified.
    - agemin: Minimum age required, if specified.
    - other: ALL requirements for the job (including experience, education, and any other requirements) should be included here as a single string. MUST NOT include responsibilities or job-related information.
    - skills: List of required skills AND additional skills a qualified applicant should have. ENRICH each skill for clarity, grammar, and capitalization. Always return a list, never a string or null.
- isOnline: true if the application is online, false if in person.
- is_remote: true if the job can be done remotely, false otherwise.
- location: Array of strings representing the general location(s) or area(s) of the job. ENRICH for clarity and formatting. Always return a list, never a string or null.
- country: Country where the job is located.
- city: City where the job is located.
- address: Full address if available.
- salary: Salary information as a string (e.g., "Negotiable", "ETB 10,000/month").
- salary_min: Minimum salary if specified.
- salary_max: Maximum salary if specified.
- deadline: Application deadline.
- job_type: Type of job, must be one of ["Full-time", "Part-time", "Contract", "Internship", "Temporary"].
- category: Job category or field (e.g., IT, Engineering, Healthcare). ENRICH for clarity and formatting. This field is REQUIRED and must not be null. If missing, set to 'Others'.
- posted_date: The date the job was posted.
- experience_level: Required experience level, must be one of ["Entry", "Mid", "Senior", "Director", "Intern"].
- education_level: An object with:
    - degree_required: Must be one of ["Bachelor", "Master", "Diploma", "PhD", "Other"].
    - cgpa: CGPA required (float), if specified.
- contact_email: Email address for application or inquiries.
- contact_phone: Phone number for application or inquiries.
- application_method: How to apply, must be one of ["Online", "In-person", "Email", "Phone"]. Do NOT invent other values. If not clear, set to null.
- application_instructions: Any special instructions for applying.
- application_url: Direct link to apply online (if online).
- number_of_positions: How many people are being hired.
- tags: List of tags or keywords for the job. ENRICH each tag for clarity, grammar, and capitalization, but do not invent new tags. Always return a list, never a string or null.
- source: The source of the job (e.g., "effoysira", "ethiojobs", "hamerejobs", "hiring_cafe", or "other").

Fill missing fields with null, except for 'category' and 'description' which must always be present and not null as described above.
ALWAYS return a list for 'skills', 'tags', and 'location' fields, even if empty.

ONLY use the allowed values for all enum/choice fields, exactly as listed above.

ONLY return your response as a JSON object in the following format. Do NOT include any other explanation, breakdown, or text outside the JSON.

{{
  "jobs": [
    {{
      "index": ...,
      "title": ...,
      "company": ...,
      "description": ...,
      "requirements": {{"gender": ..., "agemax": ..., "agemin": ..., "other": ..., "skills": [...] }},
      "isOnline": ...,
      "is_remote": ...,
      "location": [...],
      "country": ...,
      "city": ...,
      "address": ...,
      "salary": ...,
      "salary_min": ...,
      "salary_max": ...,
      "deadline": ...,
      "job_type": ...,
      "category": ...,
      "posted_date": ...,
      "experience_level": ...,
      "education_level": {{"degree_required": ..., "cgpa": ...}},
      "contact_email": ...,
      "contact_phone": ...,
      "application_method": ...,
      "application_instructions": ...,
      "application_url": ...,
      "number_of_positions": ...,
      "tags": [...],
      "source": ...
    }}
    // ...more job objects as needed
  ]
}}

Here is the data:
{indexed_batch}
Return only a valid JSON string, with no code block, no Python code, and no variable assignment.
"""
            structured = ask_gemini(prompt.format(indexed_batch=indexed_batch))
            print("Structured data for batch", batch_num)
            # print(structured)

            try:
                json_str = extract_json(structured)
                json_str = clean_json_string(json_str)
                json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
                structured_json = json.loads(json_str)
                for job in structured_json.get("jobs", []):
                    idx = job.get("index")
                    if idx is not None and idx < len(indexed_batch):
                        job["job_link"] = indexed_batch[idx].get("job_link")
                all_structured_jobs.extend(structured_json.get("jobs", []))
            except Exception as e:
                print(f"Failed to parse structured data for batch {batch_num}:", e)

            print(f"Waiting {rate_limit_seconds} seconds before next batch...")
            time.sleep(rate_limit_seconds)

        # --- Process hiring_cafe jobs with remote-only prompt ---
        for batch_num, jobs_batch in enumerate(batch_jobs(hiring_cafe_jobs, batch_size), start=1):
            print(f"Processing batch {batch_num} (hiring_cafe) with {len(jobs_batch)} jobs...")

            indexed_batch = []
            for idx, job in enumerate(jobs_batch):
                job_with_index = dict(job)
                job_with_index["index"] = idx
                job_with_index["job_hc_id"] = job.get("id")  # Store the hiring cafe job id
                indexed_batch.append(job_with_index)

            remote_prompt = """
You are an expert AI job data structurer and editor. Take a list of raw job postings (as Python dicts) and convert them into a JSON object with a single key 'jobs', whose value is a list of job objects.

For each job:
- REWRITE and ENRICH all text fields (including 'description', 'skills', 'tags', 'requirements.other', etc.) to ensure:
    - Correct grammar, spelling, and punctuation.
    - Consistent, professional, and concise writing style.
    - Neutral tone, clear and easy to understand.
    - Use complete sentences and avoid passive voice where possible.
    - Avoid jargon, abbreviations, or overly technical language unless necessary for the job.
    - Do NOT copy the original text verbatim; always rewrite for clarity and consistency.
- The 'description' field must contain all job responsibilities and other job-related information (such as duties, tasks, benefits, company info, etc.), rewritten as a single, well-structured section. DO NOT include requirements here.
- The 'requirements.other' field must contain ALL requirements for the job (including experience, education, and any other requirements), rewritten for clarity and consistency. DO NOT include responsibilities or job-related information here.
- For the 'skills' field, list both the required skills mentioned in the job posting AND any additional skills that a qualified applicant should have for this job, even if not explicitly listed. Rewrite each skill for clarity and consistency.
- The 'description' field should contain only the content of the job description, ready to display to users. DO NOT include any section headers or titles like "About the Job", "Role Description", "Role Summary", etc. Only provide the main content, rewritten as described above.
- Ensure all fields are well-structured, consistently formatted, and look professional.
- Do not merge or split jobs; keep the original job count and structure.

IMPORTANT: Only include jobs that are REMOTE (can be done from anywhere, not location-bound). If a job is not remote AND ALSO IF THE JOB CAN'T BE DONE FROM ETHIOPIA, do NOT include it in the output list. REJECT JOBS THAT ARE REMOTE BUT ONLY IN CERTAIN COUNTRIES. CHECK IF THE JOBS CAN BE DONE IN ETHIOPIA.
If a job requires payment to get considered for hiring don't put it in this list.

Each job object should have the following fields (with their meaning):

- index: The index of the job in the batch (integer, starting from 0). This is used for matching.
- title: The job title or position name (DO NOT include the company name here).
- company: The name of the hiring company or organization.
- description: The main content of the job description, ready to display to users, with NO section headers or titles. MUST include all responsibilities and job-related information, but NOT requirements.
- requirements: An object with the following fields:
    - gender: Gender requirement, must be one of "M" (Male), "F" (Female), or "B" (Both).
    - agemax: Maximum age allowed, if specified.
    - agemin: Minimum age required, if specified.
    - other: ALL requirements for the job (including experience, education, and any other requirements) should be included here as a single string. MUST NOT include responsibilities or job-related information.
    - skills: List of required skills AND additional skills a qualified applicant should have. ENRICH each skill for clarity, grammar, and capitalization. Always return a list, never a string or null.
- isOnline: true if the application is online, false if in person.
- is_remote: true if the job can be done remotely, false otherwise.
- location: Array of strings representing the general location(s) or area(s) of the job. ENRICH for clarity and formatting. Always return a list, never a string or null.
- country: Country where the job is located.
- city: City where the job is located.
- address: Full address if available.
- salary: Salary information as a string (e.g., "Negotiable", "ETB 10,000/month").
- salary_min: Minimum salary if specified.
- salary_max: Maximum salary if specified.
- deadline: Application deadline.
- job_type: Type of job, must be one of ["Full-time", "Part-time", "Contract", "Internship", "Temporary"].
- category: Job category or field (e.g., IT, Engineering, Healthcare). ENRICH for clarity and formatting. This field is REQUIRED and must not be null. If missing, set to 'Others'.
- posted_date: The date the job was posted.
- experience_level: Required experience level, must be one of ["Entry", "Mid", "Senior", "Director", "Intern"].
- education_level: An object with:
    - degree_required: Must be one of ["Bachelor", "Master", "Diploma", "PhD", "Other"].
    - cgpa: CGPA required (float), if specified.
- contact_email: Email address for application or inquiries.
- contact_phone: Phone number for application or inquiries.
- application_method: How to apply, must be one of ["Online", "In-person", "Email", "Phone"]. Do NOT invent other values. If not clear, set to null.
- application_instructions: Any special instructions for applying.
- application_url: Direct link to apply online (if online).
- number_of_positions: How many people are being hired.
- tags: List of tags or keywords for the job. ENRICH each tag for clarity, grammar, and capitalization, but do not invent new tags. Always return a list, never a string or null.
- job_hc_id: The unique job id from hiring_cafe.
- job_link: The job link. ALWAYS set this to "https://hiringcafe.com/{{job_hc_id}}" for hiring_cafe jobs.
- source: The source of the job, always "hiring_cafe" for these jobs.

Fill missing fields with null, except for 'category' and 'description' which must always be present and not null as described above.
ALWAYS return a list for 'skills', 'tags', and 'location' fields, even if empty.
ALWAYS set 'job_link' to "https://hiringcafe.com/{{job_hc_id}}" for hiring_cafe jobs.

ONLY use the allowed values for all enum/choice fields, exactly as listed above.

ONLY return your response as a JSON object in the following format. Do NOT include any other explanation, breakdown, or text outside the JSON.

{{
  "jobs": [
    {{
      "index": ...,
      "title": ...,
      "company": ...,
      "description": ...,
      "requirements": {{"gender": ..., "agemax": ..., "agemin": ..., "other": ..., "skills": [...] }},
      "isOnline": ...,
      "is_remote": ...,
      "location": [...],
      "country": ...,
      "city": ...,
      "address": ...,
      "salary": ...,
      "salary_min": ...,
      "salary_max": ...,
      "deadline": ...,
      "job_type": ...,
      "category": ...,
      "posted_date": ...,
      "experience_level": ...,
      "education_level": {{"degree_required": ..., "cgpa": ...}},
      "contact_email": ...,
      "contact_phone": ...,
      "application_method": ...,
      "application_instructions": ...,
      "application_url": ...,
      "number_of_positions": ...,
      "tags": [...],
      "job_hc_id": ...,
      "job_link": ...,
      "source": ...
    }}
    // ...more job objects as needed
  ]
}}

Here is the data:
{indexed_batch}
Return only a valid JSON string, with no code block, no Python code, and no variable assignment.
"""
            structured = ask_gemini(remote_prompt)
            print("Structured data for hiring_cafe batch", batch_num)
            # print(structured)

            try:
                json_str = extract_json(structured)
                json_str = clean_json_string(json_str)
                json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
                structured_json = json.loads(json_str)
                for job in structured_json.get("jobs", []):
                    idx = job.get("index")
                    if idx is not None and idx < len(indexed_batch):
                        job["job_hc_id"] = indexed_batch[idx].get("job_hc_id")
                all_structured_jobs.extend(structured_json.get("jobs", []))
            except Exception as e:
                print(f"Failed to parse structured data for hiring_cafe batch {batch_num}:", e)

            print(f"Waiting {rate_limit_seconds} seconds before next batch...")
            time.sleep(rate_limit_seconds)

        return {"jobs": all_structured_jobs}

# --- Example Usage ---
if __name__ == "__main__":
    load_dotenv()
    PAGE_COUNT = 10
    BATCH_SIZE = 3
    RATE_LIMIT_SECONDS = 4
    NUM_JOBS = 5  # <--- Set how many jobs to scrape from each source

    last_scraped = {
        "effoysira": "https://effoysira.com/edge-communication-vacancy-2025/",
        "ethiojobs": "https://ethiojobs.com.et/mechanical-engineering-for-trust-manufacturing-plc--droga-pharma-plc-",
        "hamerejobs": "https://harmeejobs.com/job/national-project-coordinator-2/",
        "hiring_cafe": "some-job-id"
    }

    scraper = MainScraper()
    all_structured = scraper.scrape_all(
        last_scraped,
        max_pages=PAGE_COUNT,
        batch_size=BATCH_SIZE,
        rate_limit_seconds=RATE_LIMIT_SECONDS,
        num_jobs=NUM_JOBS  # <--- Pass it here!
    )
    print(f"Total structured jobs: {len(all_structured['jobs'])}")

    # Save structured jobs to a local JSON file
    with open("structured_jobs.json", "w", encoding="utf-8") as f:
        json.dump(all_structured, f, ensure_ascii=False, indent=2)
    print("Structured jobs saved to structured_jobs.json")