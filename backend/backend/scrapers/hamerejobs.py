import requests
from bs4 import BeautifulSoup
import time
BASE_URL = "https://harmeejobs.com/jobs/page/{}/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/115.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

def get_job_links(html):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []
    # Each job is in <li> with a child <a> (job link)
    for li in soup.select("ul.job_listings li"):
        a = li.find("a", href=True)
        if a:
            job = {
                "title": None,
                "company": None,
                "location": None,
                "expires": None,
                "link": a["href"]
            }
            # Title
            h4 = a.select_one("div.listing-title h4")
            if h4:
                job["title"] = h4.contents[0].strip() if h4.contents else None
            # Company and location
            icons = a.select("ul.listing-icons li")
            for icon in icons:
                text = icon.get_text(strip=True)
                if "Expires:" in text:
                    job["expires"] = text.replace("Expires:", "").strip()
                elif icon.find("i", class_="icon-material-outline-business"):
                    job["company"] = text
                elif icon.find("i", class_="icon-material-outline-location-on"):
                    job["location"] = text
            jobs.append(job)
    return jobs

def parse_job_details(html):
    soup = BeautifulSoup(html, "html.parser")
    result = {}

    # Job Title (h1 inside .eleven.columns)
    title = None
    eleven_columns = soup.select_one("div.eleven.columns")
    if eleven_columns:
        h1 = eleven_columns.find("h1")
        if h1:
            title = h1.get_text(strip=True)
    result["title"] = title

    # Job Description
    job_description = soup.find("div", class_="job_description")
    result["job_description"] = job_description.get_text(separator="\n", strip=True) if job_description else None

    # Job Overview
    job_overview = soup.find("div", class_="job-overview")
    result["job_overview"] = job_overview.get_text(separator="\n", strip=True) if job_overview else None

    # Company Info (excluding logo)
    company_info = soup.find("div", class_="company-info")
    if company_info:
        # Remove the logo if present
        logo = company_info.find("div", class_="left-company-logo")
        if logo:
            logo.decompose()
        result["company_info"] = company_info.get_text(separator="\n", strip=True)
    else:
        result["company_info"] = None

    return result


def scrape_jobs_until_job(target_job_link=None, max_pages=100, num_jobs=None):
    """
    Scrape jobs page by page until a job with the given link is found,
    or until num_jobs jobs are scraped (if specified and target_job_link is not provided).
    Returns all jobs up to and including the target job, or up to the specified number of jobs.
    """
    all_jobs = []
    found = False
    for page in range(1, max_pages + 1):
        url = BASE_URL.format(page)
        print(f"Scraping page {page}: {url}")
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        jobs = get_job_links(response.text)
        for job in jobs:
            link = job.get("link")
            if not link:
                continue
            try:
                resp = requests.get(link, headers=HEADERS)
                resp.raise_for_status()
                job_info = parse_job_details(resp.text)
                job_info["url"] = link
                all_jobs.append(job_info)
                if target_job_link and link == target_job_link:
                    found = True
                    break
                if num_jobs and not target_job_link and len(all_jobs) >= num_jobs:
                    found = True
                    break
                time.sleep(1)
            except Exception as e:
                print(f"Failed to scrape {link}: {e}")
        if found:
            if target_job_link:
                print(f"Found target job: {target_job_link}")
            elif num_jobs:
                print(f"Scraped {num_jobs} jobs as requested.")
            break
    return all_jobs

def scrape_single_hamerejobs_job(details_url):
    """
    Scrape a single job details page from harmeejobs.com given its URL.
    Saves the HTML locally for testing.
    Returns a dictionary with the job details.
    """
    try:
        response = requests.get(details_url, headers=HEADERS)
        response.raise_for_status()
        # Save HTML locally
        filename = "hamerejobs_job_test.html"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(response.text)
        job_details = parse_job_details(response.text)
        job_details["url"] = details_url
        return job_details
    except Exception as e:
        print(f"Failed to scrape {details_url}: {e}")
        return None

# Example usage:
if __name__ == "__main__":
#     target_link = "https://harmeejobs.com/jobs/some-job-link/"
#     jobs = scrape_jobs_until_job(target_link)
#     print(f"Total jobs scraped: {len(jobs)}")
#     for job in jobs:
#         for k, v in job.items():
#             print(f"{k}: {v}")
#         print("\n")

    url = "https://harmeejobs.com/job/halalpay-financing-collection-follow-up-officer-ii/"
    job = scrape_single_hamerejobs_job(url)
    print(job)