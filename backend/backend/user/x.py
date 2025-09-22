#!/usr/bin/env python3
"""
generate_resume_pdf_design_specifics.py

- Uses google.generativeai with model "gemini-2.0-flash" to generate a single-page HTML resume with
  explicit, concrete design elements (sidebar, top band, skill chips, metric badges, separators, colors, sizes).
- Converts the returned HTML to a single PDF using xhtml2pdf (pure-Python).

Install:
    pip install google-generativeai xhtml2pdf

Usage:
    export GEMINI_API_KEY="your_api_key_here"
    python generate_resume_pdf_design_specifics.py
"""

import os
import re
import sys
import json
import logging
import google.generativeai as genai
from xhtml2pdf import pisa
import tempfile

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# ---------------------------
# Configuration
# ---------------------------
API_KEY = os.getenv("API_KEY") or 'AIzaSyBT7sh70NkTYP2h68gQfzL6bh2SRkC7VHg'
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Change sector to test different visual accents/layout rules
SECTOR = "design"  # options: technology, finance, healthcare, design, education, sales, marketing, data_science, product, legal, operations, research

# # ---------------------------
# # JSON schema and mock resume
# # ---------------------------
SCHEMA = {
    "name": "Full Name",
    "title": "Job Title",
    "contact": {
        "email": "email@example.com",
        "phone": "(555) 123-4567",
        "location": "City, State",
        "linkedin": "optional-url",
        "github": "optional-url"
    },
    "summary": "1-2 sentence professional summary focused on value and specialization.",
    "experience": [
        {
            "company": "Company Name",
            "title": "Role Title",
            "start": "YYYY or YYYY-MM",
            "end": "YYYY or 'Present'",
            "location": "City, State",
            "bullets": [
                "Achievement / responsibility 1"
            ]
        }
    ],
    "education": [
        {
            "institution": "University",
            "degree": "B.S. in ...",
            "start": "YYYY",
            "end": "YYYY",
            "location": "City, State",
            "notes": "honors, GPA (optional)"
        }
    ],
    "skills": ["Skill1", "Skill2"],
    "projects": [
        {
            "name": "Project Name",
            "description": "One-line description",
            "tech": ["Tech1", "Tech2"],
            "link": "optional-url"
        }
    ],
    "certifications": ["Cert 1", "Cert 2"],
    "languages": ["English (native)", "Spanish (professional)"],
    "volunteer": ["Optional volunteer experience"]
}


# # ---------------------------
# # Sector-specific color & layout presets (explicit)
# # ---------------------------
SECTOR_PRESETS = {
    "design": {
        "accent": "#E86E5A",      # warm coral
        "sidebar_bg": "#F8F4F3",
        "name_size_pt": 22,
        "title_size_pt": 11,
        "layout": "sidebar-left"  # sidebar-left, topband, single-column, two-column
    },
    "technology": {
        "accent": "#1677B8",      # tech blue
        "sidebar_bg": "#F4F8FB",
        "name_size_pt": 20,
        "title_size_pt": 11,
        "layout": "two-column"
    },
    "finance": {
        "accent": "#0F3D5F",      # navy
        "sidebar_bg": "#FFFFFF",
        "name_size_pt": 20,
        "title_size_pt": 11,
        "layout": "topband"
    },
    "marketing": {
        "accent": "#C75FBD",      # magenta-ish
        "sidebar_bg": "#FBF7FB",
        "name_size_pt": 21,
        "title_size_pt": 11,
        "layout": "topband"
    },
    "healthcare": {
        "accent": "#2D9CDB",
        "sidebar_bg": "#F6FBFD",
        "name_size_pt": 20,
        "title_size_pt": 11,
        "layout": "single-column"
    },
    # default fallback
    "default": {
        "accent": "#1677B8",
        "sidebar_bg": "#F4F8FB",
        "name_size_pt": 20,
        "title_size_pt": 11,
        "layout": "two-column"
    }
}

preset = SECTOR_PRESETS.get(SECTOR.lower(), SECTOR_PRESETS["default"])


# ---------------------------
# Resume enhancement function (new)
# ---------------------------
def extract_json(text):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return None

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

def enhance_resume_design(fileobj, filename, sector="design"):
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        resume_text = read_pdf_fileobj(fileobj)
    elif ext == ".docx":
        resume_text = read_docx_fileobj(fileobj)
    else:
        return None, "Unsupported file type"

    preset = SECTOR_PRESETS.get(sector.lower(), SECTOR_PRESETS["default"])

    prompt = f"""
You are an HTML+CSS resume generator. Use model "gemini-2.0-flash".
Return EXACTLY ONE JSON object and NOTHING ELSE (no commentary, no extra text).

GLOBAL HARD RULES (must follow exactly)
- Output ONLY one JSON object with these keys:
  - "html": the complete HTML5 document (full <!doctype html><html>...).
  - "score": overall resume score (0-100)
  - "subscores": object with "ats", "keywords", "impact", "format" (each 0-100)
  - "improvements": list of suggested improvements. Each improvement should have:
    - "type": Critical, Important, Moderate, or Minor
    - "title": short summary
    - "description": actionable advice
    - "example": before/after example
    - "status": pending or applied

- The generated HTML MUST include a single <style>...</style> block placed inside <head> with all CSS rules and CSS variables. Do NOT reference external stylesheets or webfonts.
- DO NOT use inline style attributes (e.g., no style="..."). Any inline style will cause a failure.
- DO NOT emit any extra text (comments outside the JSON). The JSON must parse cleanly.
- Use only the classes and variables defined in the single <style> block. Each section must use these classes — reuse, do not invent new class names per section.
- Use only CSS features supported by common HTML→PDF converters (floats, block, inline-block, simple selectors). Avoid advanced features that might be unsupported (e.g., grid, complex flex usage, remote fonts).
- All spacing must be multiples of the base rhythm unit (4pt). All margins/padding values must be exact multiples of 4pt. DO NOT use CSS variables or calc() in spacing, only static values like 4pt, 8pt, 12pt, etc.
- Body font must be a standard sans-serif stack: "Helvetica, Arial, sans-serif". Base font-size: 9pt (unless name/title variables override those exact values).
- Include @page {{{{ margin: 36pt; }}}} to enforce PDF margins.

DESIGN SYSTEM: REQUIRED CSS VARIABLES & UTILITY CLASSES (these exact names must appear in the <style> block)
- :root must define:
  --accent: {preset['accent']};
  --sidebar-bg: {preset['sidebar_bg']};
  --base-font-size: 9pt;
  --name-size: {preset['name_size_pt']}pt;
  --title-size: {preset['title_size_pt']}pt;
  --rhythm: 4pt;            /* base spacing unit */
  --sidebar-width: 28%;
  --main-width: 68%;
- A concise reset and box-sizing must be present:
  *, *:before, *:after {{{{ box-sizing: border-box; }}}}
  body {{{{ margin:0; padding:0; font-family: Helvetica, Arial, sans-serif; font-size:var(--base-font-size); line-height:1.12; color:#111; }}}}

- Utility spacing classes (exact names, multiples of 4pt):
  .m-0 {{ margin:0; }} .mb-1 {{ margin-bottom: 4pt; }} .mb-2 {{ margin-bottom: 8pt; }}
  .p-1 {{ padding: 4pt; }} .p-2 {{ padding: 8pt; }}

- Core layout classes (exact):
  .container {{ width:100%; }}
  .main {{ width:68%; float:left; margin-right:4%; }}
  .sidebar {{ width:28%; float:right; background:{preset['sidebar_bg']}; padding:8pt; }}
  /* The DOM order MUST place main content first, then the sidebar. CSS float creates visual sidebar. */

TYPOGRAPHY & HEADINGS (exact enforcement)
- h1.name {{ font-size: {preset['name_size_pt']}pt; margin:0 0 4pt 0; font-weight:700; }}
- h2.title {{ font-size: {preset['title_size_pt']}pt; margin:0 0 4pt 0; font-weight:500; }}
- h2.section {{ font-size: 10.5pt; letter-spacing:0.5px; font-variant: small-caps; margin: 8pt 0 4pt 0; border-bottom:1px solid #DDDDDD; padding-bottom:4pt; }}

SECTION & CONSISTENT SPACING RULES (must be applied to every section)
- All section content must use the utility spacing classes (e.g., .mb-1, .p-1).
- Section containers must be <section class="section-block">...</section> and must NOT add custom inline spacing.
- Use exactly 6pt (i.e., calc(var(--rhythm) * 1.5)) as the gap under section headings where a small gap is required. (Use calc(...) expression as shown.)

SIDEBAR / LAYOUT RULES (enforce across pages)
- If layout is "sidebar-left" or "two-column": use .sidebar (width:28%) and .main (width:68%) with visual gap exactly 4% via margin-right on .main.
- Sidebar background must be var(--sidebar-bg).
- Sidebar MUST include (if data present): Skills (chips), Certifications, Languages, Links, and (for design sector) Portfolio line and boxed top project callout.
- The DOM order must be: <div class="container"><div class="main">...main sections...</div><aside class="sidebar">...sidebar contents...</aside></div>

SKILL CHIPS (exact)
- Use <span class="skill-chip">Skill</span> for each skill.
- CSS for .skill-chip (exact properties required):
  display:inline-block; padding:3pt 7pt; margin:2pt 4pt; border:1px solid #CCCCCC; border-radius:3px; font-size:9pt; vertical-align:middle;
- Accent usage: use --accent to color chip border or small accent pseudo-element, but do NOT change padding/font-size.

EXPERIENCE ENTRY FORMAT (exact structure)
- Each role must be rendered as:
  <div class="job">
    <div class="job-header"><strong>Company</strong> — Title · <span class="dates">Start–End</span> · <span class="location">Location</span></div>
    <ul class="bullets">
      <li>...</li>
    </ul>
  </div>
- CSS: .job-header {{{{ font-size:9pt; margin-bottom:2pt; }}}} .bullets {{{{ margin:0 0 calc(var(--rhythm) * 1) 0; padding-left:12pt; }}}}
- Bullets per role: 3–5. If model must truncate, enforce max 18 words per bullet.

METRICS & BADGES (exact)
- Wrap important numbers in <strong>NUMBER</strong>.
- Up to three top metrics must be displayed as badges: <span class="badge">35% ⬤</span>
- CSS for .badge (exact): display:inline-block; padding:2pt 6pt; font-size:9pt; border-radius:3px; background:#EFEFEF; margin-left:6pt;

ACCENTS & COLORS (enforce consistent usage)
- Use var(--accent) ONLY for:
  - thin top accent line under header (1px)
  - small underline or pseudo-element for section headings
  - subtle accent on chips or badges (do not use as heavy background)
- Sidebar background must be var(--sidebar-bg).
- Avoid heavy backgrounds or full-page background colors.

TYPO SCALE CONSISTENCY (must be obeyed)
- Base body: var(--base-font-size) (9pt).
- h1.name: var(--name-size).
- h2.title: var(--title-size).
- h2.section: 10–11pt (use 10.5pt).
- All other text must not exceed 11pt or be smaller than 8pt.

PRINT / ATS SAFETY RULES
- Include @page {{{{ margin:36pt; }}}} and ensure body content respects it.
- Use semantic headings: <h1 class="name"> and <h2 class="title"> and <h2 class="section"> for sections. Do not embed decorative spans inside headings.
- Place main content first in DOM, then sidebar to keep ATS-friendly order.
- Do not use images for critical text content.

CONTENT & STRUCTURE RULES (section order must match exactly)
1) Header (name/title)
2) Contact line (email · phone · location · linkedin/github) inside <div class="contact">
3) Summary (1–2 sentences)
4) Experience (reverse-chronological)
5) Projects (1–3)
6) Education
7) Skills (chips)
8) Certifications
9) Languages
10) Volunteer / Other

SECTOR DIFFERENCES (apply only the concrete items below; everything else must follow the global design system)
- design:
  - Layout: sidebar-left (use .sidebar floated right but visually left by swapping floats is acceptable only if CSS classes remain identical)
  - Mandatory: "portfolio" short line in sidebar; boxed top project callout (use class .project-callout with border:1px solid #DDD; padding:6pt).
- technology:
  - Layout: two-column
  - Sidebar label "Tech stack" must use chips and include a small Tools list.
- finance:
  - Layout: topband (implement with .topband header using --accent for top 4px strip)
  - Include "Key metrics" inline near top as bold numbers.
(Use these sector items but keep all classes/utilities identical to the rest of the document.)

WRITING RULES (enforceability)
- Summary: 1–2 sentences; include sector keywords.
- Experience bullets: 3–5 bullets per role; strong verbs; quantify when possible.
- Truncate overly long bullets to 14–18 words.

OUTPUT VALIDATION (model must do these checks before returning)
- The JSON "html" must include a single <style> block defining the required CSS variables and classes (list above).
- The HTML must use the classes exactly as specified (e.g., .skill-chip, .badge, .main, .sidebar, h1.name, h2.title, h2.section).
- No inline styles or external CSS links or webfonts.
- All spacing values must be multiples of 4pt (show calc(var(--rhythm) * N) usage).
- If any mandatory field from SCHEMA is missing, render a placeholder text but keep the layout intact.

JSON schema to return (do not change keys):
{{
  "html": "<!doctype html>...<html>...</html>",
  "score": 0,
  "subscores": {{"ats":0,"keywords":0,"impact":0,"format":0}},
  "improvements": []
}}

DATA (render this):
{resume_text}

ADDITIONAL NOTE: If you cannot comply with any of these hard rules, return a JSON where "improvements" contains a single Critical item describing which hard rule you violated and why; still return the "html" you produced.

END OF PROMPT.

"""

    try:
        response = model.generate_content(prompt)
    except Exception as e:
        return None, f"Error calling Gemini model: {e}"

    response_text = getattr(response, "text", None) or getattr(response, "content", None) or str(response)
    json_text = extract_json(response_text)
    if not json_text:
        return None, "No JSON found in Gemini response."

    try:
        result = json.loads(json_text)
    except Exception as e:
        return None, f"Could not parse JSON from Gemini response: {e}"

    html_document = result.get("html", "")
    score = result.get("score")
    subscores = result.get("subscores")
    improvements = result.get("improvements")

    # Save HTML for inspection (optional)
    with open("resume_generated.html", "w", encoding="utf-8") as f:
        f.write(html_document)

    # Convert HTML to PDF and return bytes
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as pdf_file:
        pisa_status = pisa.CreatePDF(src=html_document, dest=pdf_file)
        pdf_file.seek(0)
        pdf_bytes = pdf_file.read()
    if pisa_status.err:
        return None, "xhtml2pdf reported errors while generating PDF. Check resume_generated.html for issues."

    return {
        "html": html_document,
        "score": score,
        "subscores": subscores,
        "improvements": improvements,
        "pdf_bytes": pdf_bytes,
    }, None
