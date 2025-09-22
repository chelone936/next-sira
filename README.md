Got it! You want **everything, including headings and text, inside proper Markdown** for a `README.md`. Here’s the full version in proper Markdown format:

````markdown
# NextSira

NextSira is an AI-powered job search platform that matches candidates to jobs, automates applications, and provides career insights. The project uses Django for the backend and Next.js for the frontend, with PostgreSQL and Cloudinary integration.

---

## Features

- **AI Job Matching:** Get personalized job recommendations based on your profile.
- **Auto-Apply Agents:** AI agents apply to jobs for you, customizing each application.
- **Resume Optimizer:** Automatically tailor your resume for every job.
- **Interview Prep:** Personalized interview questions and feedback.
- **Salary Insights:** Market-based salary negotiation strategies.
- **Career Path Analysis:** Discover skill gaps and growth opportunities.

---

## Project Structure

```plaintext
backend/
  backend/
    job/
    user/
    ...
frontend/
  app/
  components/
  hooks/
  lib/
scrapers/
  effoysira.py
  ethiojobs.py
agents/
.env
````

---

## Getting Started

### Prerequisites

```markdown
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Cloudinary account
```

### Backend Setup

```bash
# Install dependencies
cd backend
pip install -r requirements.txt
```

```markdown
# Configure environment
# Copy .env.example to .env and set your secrets
SECRET_KEY=your_secret
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install
```

```markdown
# Configure environment
# Set NEXT_PUBLIC_API_BASE in .env to your backend URL
```

```bash
# Start frontend
npm run dev
```

---

## API Reference

```markdown
- Auth:
  /api/user/register/
  /api/user/token/
  /api/user/token/refresh/

- Jobs:
  /api/job/feed/
  /api/job/details/<id>/
  /api/job/apply/<id>/

- Profile:
  /api/user/profile/
```

---

## Scrapers

```markdown
Job scrapers are in `scrapers/` and can be run independently to update job data.
```

---

## License

```markdown
MIT
```

---

```markdown
For more details, see the source files in backend/backend/settings.py and frontend/app/page.tsx.
```

```

✅ This ensures **all text, code, commands, and notes are properly inside Markdown blocks** for a `README.md`.  

If you want, I can also **condense it into a super clean professional README with badges, TOC, and better formatting** so it’s ready for GitHub. Do you want me to do that?
```
