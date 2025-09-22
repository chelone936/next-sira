from dotenv import load_dotenv
import os
import sys
import asyncio

load_dotenv()
api_key = os.getenv("API_KEY")
if not api_key:
    print("ERROR: API_KEY not found in environment. Put API_KEY=... in your .env", file=sys.stderr)
    raise RuntimeError("API_KEY not found in environment")
os.environ["GOOGLE_API_KEY"] = api_key

from browser_use import Agent, Browser, ChatGoogle

def format_context(context_dict):
    return "\n".join(f"{k}: {v}" for k, v in context_dict.items() if v is not None)

async def fill_google_form(form_url, job_info=None, user_info=None):
    browser = Browser(
        headless=False,
        window_size={"width": 1920, "height": 1080}
    )
    llm = ChatGoogle(model="gemini-2.0-flash")
    job_context = format_context(job_info or {})
    user_context = format_context(user_info or {})
    context = ""
    if job_context:
        context += f"\n\nJob Info:\n{job_context}"
    if user_context:
        context += f"\n\nUser Info:\n{user_context}"
    task = (
        "YOU ARE AN EXPERT GOOGLE FORMS FILLER. "
        f"Your job is to fill out the Google Form at the following URL: {form_url} "
        "following these rules:\n\n"
        "1. Fill in all visible fields (text, multiple choice, checkboxes, dropdowns) with reasonable mock data "
        "that resembles realistic responses.\n"
        "2. Do NOT submit the form; stop after filling in all fields.\n"
        "3. If any field is optional, fill it with plausible data, but prioritize required fields first.\n"
        "4. If you are asked to sign in, encounter a CAPTCHA, or cannot access the form, immediately stop "
        "and mark the task as FAILED.\n"
        "5. Do NOT navigate to unrelated pages, click unrelated buttons, or perform any actions outside of "
        "filling the form fields.\n"
        "6. Ensure that your input respects typical Google Form field types (text fields, paragraph text, "
        "multiple choice, checkboxes, dropdowns) and provide values appropriate to the type.\n"
        "7. Record the filled values internally but do NOT expose any sensitive or real user data.\n"
        "8. After completion, return a summary of the filled fields without submitting the form.\n"
        "9. If you encounter any of the following situations, return a code and message in this format:\n"
        "   - FORM_EXPIRED: The form is expired or no longer accepting responses.\n"
        "   - FORM_PRIVATE: The form requires sign-in or is private.\n"
        "   - CAPTCHA: A CAPTCHA is present and cannot be bypassed.\n"
        "   - FORM_NOT_FOUND: The form URL is invalid or not found.\n"
        "   - SUCCESS: The form was filled successfully (but not submitted).\n"
        "   - UNKNOWN_ERROR: Any other error.\n"
        "Return your result as: CODE: <code>\nMESSAGE: <message>\nSUMMARY: <summary of filled fields if any>."
        f"{context}"
    )
    agent = Agent(task=task, llm=llm, browser=browser)
    result = await agent.run(max_steps=100)
    return result