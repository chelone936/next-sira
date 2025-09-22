#!/usr/bin/env python3
"""
generate_resume_html_template_based.py

- Uses google.generativeai with model "gemini-2.0-flash" to extract structured resume data and suggestions.
- Fills an HTML template (Jinja2) with this data.
- Returns the rendered HTML and AI scores for frontend display.

Install:
    pip install google-generativeai jinja2 python-docx PyPDF2

Usage:
    export GEMINI_API_KEY="your_api_key_here"
    # Import and call enhance_resume_with_template(fileobj, filename, sector)
"""

import os
import re
import json
import logging
import google.generativeai as genai
from jinja2 import Environment, FileSystemLoader
import ast

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# ---------------------------
# Configuration
# ---------------------------
API_KEY = os.getenv("API_KEY") or 'AIzaSyBT7sh70NkTYP2h68gQfzL6bh2SRkC7VHg'
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

TEMPLATE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../templates"))
TEMPLATE_NAME = "7.html"

SECTOR = "design"

# ---------------------------
# File Reading Helpers
# ---------------------------
def read_pdf_fileobj(fileobj):
    import PyPDF2
    pdf = PyPDF2.PdfReader(fileobj)
    text = ""
    for page in pdf.pages:
        text += page.extract_text() or ""
    return text

def read_docx_fileobj(fileobj):
    from docx import Document
    doc = Document(fileobj)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

# ---------------------------
# Jinja2 Template Setup
# ---------------------------
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def extract_json(text):
    """
    Extracts the first valid JSON object from a string, even if surrounded by extra text,
    triple backticks, or a 'json' label.
    Handles nested braces and ignores HTML or other content.
    """
    # Remove triple backticks and 'json' label if present
    text = text.strip()
    # Remove leading and trailing triple backticks
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    # Remove leading 'json' label if present
    if text.lower().startswith("json"):
        text = text[4:].strip()
    # Find the first '{' and try to match braces
    start = text.find('{')
    if start == -1:
        return None
    brace_count = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                candidate = text[start:i+1]
                # Try to parse as JSON
                try:
                    json.loads(candidate)
                    return candidate
                except Exception:
                    continue
    return None

def get_structured_resume(resume_text, sector="design"):
    # Robust prompt for resume enhancement and structuring (no design instructions)
    prompt = f"""
You are a resume enhancer and structurer using model "gemini-2.0-flash".
Your job is to extract, clean, and improve resume data from the provided text, following best practices for modern resumes in ANY sector (technology, healthcare, education, finance, design, sales, marketing, etc.).

Return EXACTLY ONE JSON object and NOTHING ELSE.

JSON FORMAT (output must match this structure, only include fields if present in the input):
{{
  "name": string,
  "title": string,
  "contact": {{
    "email": string,
    "phone": string,
    "location": string,
    "linkedin": string,
    "github": string
  }},
  "summary": string,
  "experience": [
    {{
      "company": string,
      "title": string,
      "start": string,
      "end": string,
      "location": string,
      "bullets": [string]
    }}
  ],
  "education": [
    {{
      "institution": string,
      "degree": string,
      "start": string,
      "end": string,
      "location": string,
      "notes": string,
      "bullets": [string]
    }}
  ],
  "skills": [string],  # Can be technical, soft, or sector-specific skills
  "projects": [
    {{
      "name": string,
      "description": string,
      "tech": [string] or string,  # Can be any relevant tools, methods, or approaches
      "link": string,
      "bullets": [string]
    }}
  ],
  "certifications": [string],
  "languages": [string],
  "volunteer": [string],
  "score": integer,
  "subscores": {{
    "ats": integer,
    "keywords": integer,
    "impact": integer,
    "format": integer
  }},
  "improvements": [
    {{
      "type": string,
      "title": string,
      "description": string,
      "example": string,
      "status": string
    }}
  ]
}}

NON-JSON INSTRUCTIONS (for the AI, do NOT include in output):
- Only include fields and entries if they are clearly present or can be reasonably inferred from the input.
- For "name", "title", and "contact", use only valid, clearly present information.
- For "experience", and "projects", always include 2-3 bullet points per entry summarizing achievements, responsibilities, or highlights.
- Quantify achievements and use strong action verbs where possible.
- For "skills", "certifications", "languages", and "volunteer", only include if clearly present.
- For "score" and "subscores", analyze the resume for ATS compatibility, keyword usage, impact, and formatting.

IMPORTANT: Always include the following fields in your output JSON, even if you must estimate:
- "score": Overall resume score (0-100)
- "subscores": ATS compatibility, keywords, impact, format (each 0-100)
- "improvements": List of actionable suggestions (type, title, description, example, status)

- For "improvements", provide actionable suggestions with before/after examples and status ("pending" or "applied").
- If any key is missing in the input, OMIT it from the JSON (do not use null, "None", or empty strings).
- Do NOT hallucinate data. Do NOT invent information that is not present or reasonably inferred.
- Do not include design, layout, or style instructions.
- Do not include any HTML, only structured data in JSON.

DATA:
{resume_text}
"""
    try:
        response = model.generate_content(prompt)
    except Exception as e:
        return None, f"Error calling Gemini model: {e}"

    response_text = getattr(response, "text", None) or getattr(response, "content", None) or str(response)
    print(response_text)
    json_text = extract_json(response_text)
    if not json_text:
        return None, "No JSON found in Gemini response."

    try:
        result = json.loads(json_text)
    except Exception as e:
        # Try to parse with ast.literal_eval as fallback
        try:
            result = ast.literal_eval(json_text)
        except Exception:
            return None, f"Could not parse JSON from Gemini response: {e}"

    # Ensure keys exist even if missing
    result.setdefault("score", None)
    result.setdefault("subscores", None)
    result.setdefault("improvements", None)

    return result, None

def render_resume_html(data, template_name=TEMPLATE_NAME):
    print("Rendering template:", template_name)
    template = env.get_template(template_name)
    html = template.render(**data)
    return html

def enhance_resume_with_template(fileobj, filename, sector=SECTOR):
    # Step 1: Extract resume text from file
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        resume_text = read_pdf_fileobj(fileobj)
    elif ext == ".docx":
        resume_text = read_docx_fileobj(fileobj)
    elif ext in [".txt"]:
        resume_text = fileobj.read().decode("utf-8")
    else:
        return None, "Unsupported file type"

    # Step 2: Get structured resume data from Gemini
    resume_data, err = get_structured_resume(resume_text, sector=sector)
    if err:
        logging.error(err)
        return None, err

    # Step 3: Render HTML template with resume data (exclude scores/improvements from HTML)
    html_document = render_resume_html({
        "name": resume_data.get("name"),
        "title": resume_data.get("title"),
        "contact": resume_data.get("contact"),
        "summary": resume_data.get("summary"),
        "experience": resume_data.get("experience"),
        "education": resume_data.get("education"),
        "skills": resume_data.get("skills"),
        "projects": resume_data.get("projects"),
        "certifications": resume_data.get("certifications"),
        "languages": resume_data.get("languages"),
        "volunteer": resume_data.get("volunteer"),
    })

    # Step 4: Return HTML and scores to view function
    return {
        "html": html_document,
        "score": resume_data.get("score"),
        "subscores": resume_data.get("subscores"),
        "improvements": resume_data.get("improvements"),
    }, None

# Example usage in a view function:
# result, err = enhance_resume_with_template(fileobj, filename, sector="design")
# if err:
#     # handle error
# html = result["html"]
# score = result["score"]
# subscores = result["subscores"]
# improvements = result["improvements"]