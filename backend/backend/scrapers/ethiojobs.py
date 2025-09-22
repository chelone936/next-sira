import requests
from bs4 import BeautifulSoup
import time
BASE_URL = "https://ethiojobs.com.et/?page={}"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/115.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

def get_job_posts(html):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []
    for post in soup.select("div.job-post-item"):
        job = {}
        # Title and link
        title_tag = post.select_one("h3.job-title a")
        job["title"] = title_tag.get_text(strip=True) if title_tag else None
        job["link"] = title_tag["href"] if title_tag and title_tag.has_attr("href") else None
        # Company (from logo alt or None)
        logo = post.select_one(".company-logo")
        job["company"] = logo["alt"].strip() if logo and logo.has_attr("alt") else None
        # Author
        author_tag = post.select_one("span.author a")
        job["author"] = author_tag.get_text(strip=True) if author_tag else None
        # Date
        date_tag = post.select_one("span.date time")
        job["date"] = date_tag.get_text(strip=True) if date_tag else None
        jobs.append(job)
    return jobs

def parse_job_details(html):
    soup = BeautifulSoup(html, "html.parser")
    content_divs = soup.find_all("div", class_="post-content")
    all_text = []
    for div in content_divs:
        text = div.get_text(separator="\n", strip=True)
        if text:
            all_text.append(text)
    return {"text": "\n\n".join(all_text)}

def scrape_jobs_until_page(last_page):
    all_jobs = []
    for page in range(1, last_page + 1):
        url = BASE_URL.format(page)
        print(f"Scraping page {page}: {url}")
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        jobs = get_job_posts(response.text)
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
                time.sleep(1)
            except Exception as e:
                print(f"Failed to scrape {link}: {e}")
    return all_jobs

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
        jobs = get_job_posts(response.text)
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

def scrape_single_ethiojobs_job(details_url):
    """
    Scrape a single job details page from ethiojobs.com.et given its URL.
    Saves the HTML locally for testing.
    Returns a dictionary with the job details.
    """
    try:
        response = requests.get(details_url, headers=HEADERS)
        response.raise_for_status()
        # Save HTML locally
        filename = "ethiojobs_job_test.html"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(response.text)
        job_details = parse_job_details(response.text)
        job_details["url"] = details_url
        return job_details
    except Exception as e:
        print(f"Failed to scrape {details_url}: {e}")
        return None

# # Example usage:

if __name__ == "__main__":
    url = "https://ethiojobs.com.et/internal-auditor-ethio-resort-plc"
    job = scrape_single_ethiojobs_job(url)
    print(job)