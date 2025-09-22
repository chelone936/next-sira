import os
import google.generativeai as genai
from dotenv import load_dotenv
from docx import Document
import PyPDF2
import json
import re
from xhtml2pdf import pisa
import tempfile
from jinja2 import Template
from fpdf import FPDF


load_dotenv()
API_KEY = os.getenv("API_KEY")


def read_pdf_fileobj(fileobj):
    pdf = PyPDF2.PdfReader(fileobj)
    text = ""
    for page in pdf.pages:
        text += page.extract_text() or ""
    return text


def read_docx_fileobj(fileobj):
    doc = Document(fileobj)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


def extract_json(text):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return None


def ask_gemini_resume_analysis(resume_text):
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = f"""
You are an expert career advisor and professional resume writer with extensive experience in optimizing resumes for clarity, impact, and ATS (Applicant Tracking Systems).

Your task:
1. Analyze the resume content below for clarity, impact, relevance, and ATS optimization.
2. Rewrite and enhance the resume, improving wording, quantifying achievements, and structuring it logically.
3. Optimize each section according to best practices (examples below).
4. Return the enhanced resume in the flexible JSON format described below.
5. Suggest actionable improvements with examples.

**Output requirements:**
- Return ONLY a single JSON object.
- Do NOT include any explanations, markdown, or HTML.
- The JSON must contain:
  - "resume": an object with:
    - "name": candidate's full name
    - "contact": object with "email", "phone", "linkedin" (if available)
    - "summary": a concise, compelling professional summary (3-5 sentences) highlighting key achievements, skills, and career goals
    - "sections": a list of sections (e.g., Experience, Education, Skills, Projects, Certifications, Awards, Languages, Publications, etc.). Each section should have:
      - "title": section name
      - "content": relevant data for the section. For specific sections, apply these rules:
        - Experience: 
            - List of jobs as objects with job title, company, location, dates, and achievements (list of strings)
            - Use strong action verbs and quantify achievements where possible (e.g., increased revenue by 20%)
            - Highlight leadership, collaboration, technical skills, and measurable impact
        - Education:
            - List of degrees as objects with degree, major, institution, graduation date, honors, relevant coursework, or GPA if notable
        - Skills:
            - **Return a dictionary where each key is a skill category (e.g., Backend, Frontend, Soft Skills) and the value is a list of skills in that category.**
            - Example: 
              {{
                "Backend": ["C++", "Python", "Java"],
                "Frontend": ["React", "Vue"],
                "Soft Skills": ["Leadership", "Communication"]
              }}
        - Projects:
            - List of projects as objects or strings, including project name, role, technologies used, and measurable outcomes
        - Certifications/Awards/Publications:
            - List of items as objects with title, institution or awarding body, and date
        - Languages:
            - List of languages with proficiency levels
  - "score": overall resume score (0-100)
  - "subscores": object with "ats", "keywords", "impact", "format" (each 0-100)
  - "improvements": list of suggested improvements. Each improvement should have:
    - "type": Critical, Important, Moderate, or Minor
    - "title": short summary
    - "description": actionable advice
    - "example": before/after example
    - "status": pending or applied

**Section flexibility:**
- Include all sections present in the original resume and add any additional relevant sections.
- Preserve and enhance all useful details.
- Ensure each section is clear, concise, and quantifiable where possible.

**Example output:**
{{
  "resume": {{
    "name": "Jane Doe",
    "contact": {{
      "email": "jane@example.com",
      "phone": "555-1234",
      "linkedin": "linkedin.com/in/janedoe"
    }},
    "summary": "Results-driven software engineer with 5+ years of experience building scalable web applications, leading cross-functional teams, and optimizing processes for efficiency.",
    "sections": [
      {{
        "title": "Experience",
        "content": [
          {{
            "title": "Senior Developer",
            "company": "TechCorp",
            "dates": "2021-2024",
            "achievements": [
              "Led migration to cloud, saving $50K annually",
              "Mentored 5 junior engineers, improving team productivity by 25%"
            ]
          }}
        ]
      }},
      {{
        "title": "Skills",
        "content": {{
          "Backend": ["C++", "Python", "Java"],
          "Frontend": ["React", "Vue"],
          "Soft Skills": ["Leadership", "Communication"]
        }}
      }},
      {{
        "title": "Projects",
        "content": [
          "Developed AI-powered resume analyzer used by 500+ users, improving job placement success by 15%"
        ]
      }}
    ]
  }},
  "score": 88,
  "subscores": {{
    "ats": 90,
    "keywords": 85,
    "impact": 80,
    "format": 95
  }},
  "improvements": [
    {{
      "type": "Critical",
      "title": "Add quantifiable achievements",
      "description": "Include specific numbers to show impact.",
      "example": "Improved efficiency → Improved efficiency by 30% (saved 10 hours/week)",
      "status": "pending"
    }}
  ]
}}

Resume content to enhance:
---
{resume_text}
---
"""

   
    response = model.generate_content([{"text": prompt}])
    if hasattr(response, "candidates") and response.candidates and response.candidates[0].content.parts:
        part = response.candidates[0].content.parts[0]
        if hasattr(part, 'text'):
            json_text = extract_json(part.text)
            if json_text:
                try:
                    result = json.loads(json_text)
                    return result, None
                except Exception:
                    return None, "AI response could not be parsed as JSON"
            else:
                return None, "No JSON found in AI response"
    return None, "No response from AI"


def enhance_resume(fileobj, filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        resume_text = read_pdf_fileobj(fileobj)
    elif ext == ".docx":
        resume_text = read_docx_fileobj(fileobj)
    else:
        return None, "Unsupported file type"
    result, error = ask_gemini_resume_analysis(resume_text)
    if not result:
        return None, error
    return result, None


def html_to_pdf_bytes(html_text):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as pdf_file:
        pisa_status = pisa.CreatePDF(html_text, dest=pdf_file)
        pdf_file.seek(0)
        pdf_bytes = pdf_file.read()
    return pdf_bytes if not pisa_status.err else None


def generate_cover_letter(user_info, job_info):
    """
    Generate a custom cover letter using Gemini AI.
    Args:
        user_info (dict): {
            "name": str,
            "email": str,
            "phone": str,
            "education": str,
            "experience": str,
            "skills": list[str],
            "summary": str (optional)
        }
        job_info (dict): {
            "title": str,
            "company": str,
            "description": str,
            "requirements": str,
            "location": str (optional)
        }
    Returns:
        str: Generated cover letter text or error message.
    """
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = f"""
You are an expert career advisor and professional writer.
Write a custom cover letter for the following job application. The cover letter should be professional, concise (max 350 words), and tailored to the job and company. Highlight the candidate's relevant experience, skills, and motivation for applying. Use a modern, friendly, and confident tone.

Return ONLY the cover letter text. Do NOT include explanations, markdown, or any extra formatting.

Candidate Info:
Name: {user_info.get("name")}
Email: {user_info.get("email")}
Phone: {user_info.get("phone")}
Education: {user_info.get("education")}
Experience: {user_info.get("experience")}
Skills: {', '.join(user_info.get("skills", []))}
Summary: {user_info.get("summary", "")}

Job Info:
Title: {job_info.get("title")}
Company: {job_info.get("company")}
Description: {job_info.get("description")}
Requirements: {job_info.get("requirements")}
Location: {job_info.get("location", "")}
"""
    response = model.generate_content([{"text": prompt}])
    if hasattr(response, "candidates") and response.candidates and response.candidates[0].content.parts:
        part = response.candidates[0].content.parts[0]
        if hasattr(part, 'text'):
            cover_letter = part.text.strip()
            return cover_letter, None
    return None, "No response from AI"


def to_latin1(text):
    # Replace non-latin-1 characters with a space or remove them
    return text.encode("latin1", errors="ignore").decode("latin1")


def structured_resume_to_pdf_bytes(resume_json):
    resume = resume_json.get("resume", {})
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Times", "B", 14)
    pdf.cell(0, 12, to_latin1(resume.get("name", "")), ln=True, align="C")
    pdf.set_font("Times", "", 12)
    contact = resume.get("contact", {})
    y = pdf.get_y()
    page_width = pdf.w - 2 * pdf.l_margin
    # Email
    if contact.get("email"):
        email_text = f"Email: {contact['email']}"
        pdf.set_text_color(0, 0, 255)
        pdf.set_xy(pdf.l_margin, y)
        pdf.cell(page_width, 8, to_latin1(email_text), ln=True, align="C", link=f"mailto:{contact['email']}")
        y = pdf.get_y()
        pdf.set_text_color(0, 0, 0)
    # Phone
    if contact.get("phone"):
        phone_text = f"Phone: {contact['phone']}"
        pdf.set_text_color(0, 0, 255)
        pdf.set_xy(pdf.l_margin, y)
        pdf.cell(page_width, 8, to_latin1(phone_text), ln=True, align="C", link=f"tel:{contact['phone']}")
        y = pdf.get_y()
        pdf.set_text_color(0, 0, 0)
    # LinkedIn
    if contact.get("linkedin"):
        linkedin_text = f"LinkedIn: {contact['linkedin']}"
        pdf.set_text_color(0, 0, 255)
        pdf.set_xy(pdf.l_margin, y)
        pdf.cell(page_width, 8, to_latin1(linkedin_text), ln=True, align="C", link=contact['linkedin'])
        y = pdf.get_y()
        pdf.set_text_color(0, 0, 0)
    # Summary (left-aligned, italic)
    if resume.get("summary"):
        pdf.set_font("Times", "I", 12)
        pdf.multi_cell(0, 8, to_latin1(resume["summary"]))
        pdf.set_font("Times", "", 12)
    # Sections (left-aligned)
    for section in resume.get("sections", []):
        pdf.set_font("Times", "B", 14)
        # Use multi_cell for section title to wrap long titles
        pdf.multi_cell(0, 10, to_latin1(section.get("title", "")), align="L")
        # Draw underlined full line (horizontal rule)
        y = pdf.get_y()
        pdf.set_draw_color(0, 0, 0)
        pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
        pdf.set_font("Times", "", 12)
        content = section.get("content", [])
        # --- Skills section as dictionary ---
        if section.get("title", "").lower() == "skills" and isinstance(content, dict):
            for key, skills in content.items():
                skill_str = ", ".join(skills)
                pdf.multi_cell(0, 8, to_latin1(f"{key}: {skill_str}"), align="L")
        # --- Other sections ---
        elif isinstance(content, list):
            for item in content:
                if isinstance(item, dict):
                    line = ""
                    if item.get("title"): line += item["title"]
                    if item.get("degree"): line += item["degree"]
                    if item.get("company"): line += f" at {item['company']}"
                    if item.get("school"): line += f" - {item['school']}"
                    if item.get("dates"): line += f" ({item['dates']})"
                    if item.get("location"): line += f", {item['location']}"
                    for k, v in item.items():
                        if k not in ["title", "degree", "company", "school", "dates", "location", "achievements"] and v:
                            line += f" | {k.capitalize()}: {v}"
                    if line:
                        pdf.multi_cell(0, 8, to_latin1(line), align="L")
                    if item.get("achievements"):
                        for ach in item["achievements"]:
                            pdf.cell(10)
                            pdf.multi_cell(0, 8, to_latin1(f"- {ach}"), align="L")
                elif isinstance(item, str):
                    pdf.multi_cell(0, 8, to_latin1(item), align="L")
        elif isinstance(content, str):
            pdf.multi_cell(0, 8, to_latin1(content), align="L")
    return pdf.output(dest="S").encode("latin1")
