import time
import google.generativeai as genai
from scrapers.kebenajobs import scrape_jobs_until_page as scrape_kebenajobs
from scrapers.effoysira import scrape_jobs_until_page as scrape_effoysira
from scrapers.hamerejobs import scrape_jobs_until_page as scrape_hamerejobs
from scrapers.ethiojobs import scrape_jobs_until_page as scrape_ethiojobs
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import re
import codecs
import unicodedata
from dotenv import load_dotenv
from enum import Enum
load_dotenv()
API_KEY = os.getenv("API_KEY")

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
    skills: Optional[List[str]] = None

class Job(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: str  # Not nullable
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
    category: str  # Not nullable
    posted_date: Optional[str] = None
    experience_level: ExperienceLevel
    education_level: Optional[EducationLevel] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    application_method: ApplicationMethod
    application_instructions: Optional[str] = None
    application_url: Optional[str] = None
    number_of_positions: Optional[int] = None
    tags: Optional[List[str]] = None

class Jobs(BaseModel):
    jobs: Optional[List[Job]] = None

def ask_gemini(prompt):
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    parts = [{"text": prompt}]
    response = model.generate_content(parts)
    if hasattr(response, "candidates") and response.candidates and response.candidates[0].content.parts:
        part = response.candidates[0].content.parts[0]
        if hasattr(part, 'text'):
            return part.text
    return "Sorry, I couldn't generate a response."

def append_to_json_file(data, filename):
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            try:
                existing = json.load(f)
            except Exception:
                existing = {}
    else:
        existing = {}

    if "jobs" in existing and "jobs" in data:
        existing["jobs"].extend(data["jobs"])
    else:
        existing = data

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

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
    # Remove control characters
    text = ''.join(ch for ch in text if unicodedata.category(ch)[0] != 'C' or ch in '\n\r\t')
    # Remove any stray backslashes not part of escape sequences
    text = re.sub(r'\\(?!["\\/bfnrtu])', r'', text)
    return text

def batch_jobs(jobs, batch_size):
    for i in range(0, len(jobs), batch_size):
        yield jobs[i:i+batch_size]

if __name__ == "__main__":
    PAGE_COUNT = 10  # Change this to scrape more or fewer pages
    BATCH_SIZE = 5 # Number of jobs per batch
    RATE_LIMIT_SECONDS = 4

    # Uncomment to slcrape and save jobs
    print("Scraping Kebenajobs...")
    kebenajobs_data = scrape_kebenajobs(PAGE_COUNT)
    print(f"Kebenajobs: {len(kebenajobs_data)} jobs scraped.")
    with open("jobs_raw_kebenajobs.json", "w", encoding="utf-8") as f:
        json.dump({"jobs": kebenajobs_data}, f, ensure_ascii=False, indent=2)
    print("Kebenajobs raw jobs saved to jobs_raw_kebenajobs.json")

    print("Scraping Effoysira...")
    effoysira_data = scrape_effoysira(PAGE_COUNT)
    print(f"Effoysira: {len(effoysira_data)} jobs scraped.")
    with open("jobs_raw_effoysira.json", "w", encoding="utf-8") as f:
        json.dump({"jobs": effoysira_data}, f, ensure_ascii=False, indent=2)
    print("Effoysira raw jobs saved to jobs_raw_effoysira.json")

    print("Scraping Hamerejobs...")
    hamerejobs_data = scrape_hamerejobs(PAGE_COUNT)
    print(f"Hamerejobs: {len(hamerejobs_data)} jobs scraped.")
    with open("jobs_raw_hamerejobs.json", "w", encoding="utf-8") as f:
        json.dump({"jobs": hamerejobs_data}, f, ensure_ascii=False, indent=2)
    print("Hamerejobs raw jobs saved to jobs_raw_hamerejobs.json")

    print("Scraping Ethiojobs...")
    ethiojobs_data = scrape_ethiojobs(PAGE_COUNT)
    print(f"Ethiojobs: {len(ethiojobs_data)} jobs scraped.")
    with open("jobs_raw_ethiojobs.json", "w", encoding="utf-8") as f:
        json.dump({"jobs": ethiojobs_data}, f, ensure_ascii=False, indent=2)
    print("Ethiojobs raw jobs saved to jobs_raw_ethiojobs.json")

    # Save all raw scraped jobs to a combined file for backup
    raw_jobs = (
        kebenajobs_data
        + effoysira_data
        + hamerejobs_data
        + ethiojobs_data
    )
    print(f"Total jobs scraped: {len(raw_jobs)}")
    with open("jobs_raw_backup.json", "w", encoding="utf-8") as f:
        json.dump({"jobs": raw_jobs}, f, ensure_ascii=False, indent=2)
    print("Raw scraped jobs saved to jobs_raw_backup.json")

    # # Load jobs from saved JSON files instead
    # raw_jobs = []
    # for fname in [
    #     "jobs_raw_kebenajobs.json",
    #     "jobs_raw_effoysira.json",
    #     "jobs_raw_hamerejobs.json",
    #     "jobs_raw_ethiojobs.json",
    # ]:
    #     if os.path.exists(fname):
    #         with open(fname, "r", encoding="utf-8") as f:
    #             data = json.load(f)
    #             raw_jobs.extend(data.get("jobs", []))
    # print(f"Loaded {len(raw_jobs)} jobs from saved JSON files.")

    for batch_num, jobs_batch in enumerate(batch_jobs(raw_jobs, BATCH_SIZE), start=1):
        print(f"Processing batch {batch_num} with {len(jobs_batch)} jobs...")

        # Add index and job_link to each job in the batch
        indexed_batch = []
        for idx, job in enumerate(jobs_batch):
            job_with_index = dict(job)
            job_with_index["index"] = idx
            # Ensure job_link is present in indexed_batch for matching
            job_with_index["job_link"] = job.get("job_link")
            indexed_batch.append(job_with_index)

        prompt = f"""
You are an expert AI job data structurer. Your job is to take a list of raw job postings (as Python dicts) and convert them into a JSON object with a single key 'jobs', whose value is a list of job objects.

Each job object should have the following fields (with their meaning):

- index: The index of the job in the batch (integer, starting from 0). This is used for matching.
- title: The job title or position name DON'T PUT THE COMPANY NAME HERE.
- company: The name of the hiring company or organization.
- description: A summary or description of the job. This field is REQUIRED and must not be null.
- requirements: An object with the following fields:
    - gender: Gender requirement, must be one of "M" (Male), "F" (Female), or "B" (Both).
    - agemax: Maximum age allowed, if specified.
    - agemin: Minimum age required, if specified.
    - other: Any other requirements not covered by the above.
    - skills: List of required skills.
- isOnline: true if the application is online, false if in person.
- is_remote: true if the job can be done remotely, false otherwise.
- location: Array of strings representing the general location(s) or area(s) of the job.
- country: Country where the job is located.
- city: City where the job is located.
- address: Full address if available.
- salary: Salary information as a string (e.g., "Negotiable", "ETB 10,000/month").
- salary_min: Minimum salary if specified.
- salary_max: Maximum salary if specified.
- deadline: Application deadline.
- job_type: Type of job, must be one of ["Full-time", "Part-time", "Contract", "Internship", "Temporary"].
- category: Job category or field (e.g., IT, Engineering, Healthcare). This field is REQUIRED and must not be null.
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
- tags: List of tags or keywords for the job.

Fill missing fields with null, except for 'category' and 'description' which must always be present and not null.

ONLY return your response as a JSON object in the following format. Do NOT include any other explanation, breakdown, or text outside the JSON.

{{
  "jobs": [
    {{
      "index": ...,
      "title": ...,
      "company": ...,
      "description": ...,
      "requirements": {{"gender": ..., "agemax": ..., "agemin": ..., "other": ..., "skills": [...]}},
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
      "tags": [...]
    }}
    // ...more job objects as needed
  ]
}}

Here is the data:
{indexed_batch}
Return only a valid JSON string, with no code block, no Python code, and no variable assignment.
"""
        structured = ask_gemini(prompt)
        print("Structured data for batch", batch_num)
        print(structured)

        try:
            json_str = extract_json(structured)
            json_str = clean_json_string(json_str)
            json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
            structured_json = json.loads(json_str)
            # Attach job links to structured output using index
            for job in structured_json.get("jobs", []):
                idx = job.get("index")
                if idx is not None and idx < len(indexed_batch):
                    job["job_link"] = indexed_batch[idx].get("job_link")

            append_to_json_file(structured_json, "jobs_output.json")
            print(f"Appended batch {batch_num} to jobs_output.json")
        except Exception as e:
            print(f"Failed to parse or append structured data for batch {batch_num}:", e)
            with open(f"gemini_raw_batch_{batch_num}.txt", "w", encoding="utf-8") as f:
                f.write(structured)

        print(f"Waiting {RATE_LIMIT_SECONDS} seconds before next batch...")
        time.sleep(RATE_LIMIT_SECONDS)
