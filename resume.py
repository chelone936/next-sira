import os
import google.generativeai as genai
from dotenv import load_dotenv

import docx
from docx import Document
import PyPDF2
from xhtml2pdf import pisa

# ----------------- Load API Key ---------------- #
load_dotenv()
API_KEY = os.getenv("API_KEY")


# ----------------- File Reading ----------------- #
def read_pdf(file_path):
    pdf = PyPDF2.PdfReader(file_path)
    text = ""
    for page in pdf.pages:
        text += page.extract_text() or ""
    return text


def read_docx(file_path):
    doc = Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


# ----------------- Gemini AI HTML Resume ----------------- #
def ask_gemini_resume_html(resume_text):
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""
You are an expert career advisor, professional resume writer, and UX-focused designer. Rewrite and **enhance the following resume content**, and return a **fully formatted HTML document** (including <html>, <head>, <style>, <body>) with a **modern, minimalist, and professional design** ready to render in a browser or convert to PDF.

Important: The resume **must fit on a single A4 page**. Adjust formatting, font sizes, spacing, and alignments to ensure all content fits neatly without overflowing, while keeping readability and visual appeal. Design should be **minimalist yet attractive**: not overly flashy, but not too dull—clean typography, subtle colors, and clear section separation.

Your goals:
1. **Maximize resume impact**:
   - Use action verbs, quantify achievements with numbers/percentages wherever possible.
   - Focus on measurable results, promotions, awards, and skills that show value.
   - Turn responsibilities into results-driven accomplishments.
2. **Design & readability**:
   - Use clear headings: Experience, Education, Skills, Projects, Certifications, etc.
   - Use bullet points for responsibilities and achievements.
   - Include inline CSS with professional fonts, spacing, subtle colors.
   - Ensure layout, margins, and line heights are optimized for a single-page A4 PDF.
   - Make it visually appealing, minimalist, and ATS-friendly.
3. **Do’s**:
   - Keep formatting clean and consistent.
   - Keep content relevant to career goals.
   - Highlight technical skills, certifications, and impactful projects.
   - Condense or summarize content if needed to fit one page.
4. **Don’ts**:
   - Do NOT add fluff or unverifiable claims.
   - Do NOT include explanations, instructions, or comments outside HTML.
   - Do NOT invent job titles or dates.
   - Avoid generic adjectives like “hardworking,” “excellent,” “team player” without evidence.
   
Return **only** the HTML document with embedded CSS.

Resume content to enhance:
---
{resume_text}
---
"""

    response = model.generate_content([{"text": prompt}])
    if hasattr(response, "candidates") and response.candidates and response.candidates[0].content.parts:
        part = response.candidates[0].content.parts[0]
        if hasattr(part, "text"):
            return part.text
    return None


# ----------------- Save HTML & Convert to PDF ----------------- #
def save_html(html_text, html_file):
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_text)
    print(f"✅ HTML resume saved to {html_file}")


def html_to_pdf_xhtml2pdf(html_file, pdf_file):
    with open(html_file, "r", encoding="utf-8") as f:
        html_content = f.read()
    result = pisa.CreatePDF(src=html_content, dest=open(pdf_file, "wb"))
    if result.err:
        print("❌ Error generating PDF!")
    else:
        print(f"✅ PDF resume generated at {pdf_file}")


# ----------------- Main Function ----------------- #
def main():
    input_file = r"C:\Users\HP\Documents\Resume.pdf"
    html_output_file = r"C:\Users\HP\Documents\jobsai\enhanced_resume5.html"
    pdf_output_file = r"C:\Users\HP\Documents\jobsai\enhanced_resume5.pdf"

    ext = os.path.splitext(input_file)[1].lower()
    if ext == ".pdf":
        resume_text = read_pdf(input_file)
    elif ext == ".docx":
        resume_text = read_docx(input_file)
    else:
        print("Unsupported file type. Please provide a PDF or DOCX file.")
        return

    print("⚡ Generating HTML resume with Gemini AI...")
    html_resume = ask_gemini_resume_html(resume_text)
    if not html_resume:
        print("❌ Failed to generate HTML resume from Gemini AI.")
        return

    save_html(html_resume, html_output_file)
    html_to_pdf_xhtml2pdf(html_output_file, pdf_output_file)


if __name__ == "__main__":
    main()
