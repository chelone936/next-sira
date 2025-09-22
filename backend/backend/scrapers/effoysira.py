import requests
from bs4 import BeautifulSoup
import time
BASE_URL = "https://effoysira.com/page/{}/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/115.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

def get_job_links(html):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []
    # Each job is in <article class="wp-block-post ...">
    for article in soup.select("article.wp-block-post"):
        job = {}
        # Title and link
        h2 = article.find("h2")
        a = h2.find("a") if h2 else None
        job["title"] = a.get_text(strip=True) if a else None
        job["link"] = a["href"] if a and a.has_attr("href") else None
        # Date
        date_div = article.find("div", class_="ct-dynamic-data")
        job["date"] = date_div.get_text(strip=True) if date_div else None
        jobs.append(job)
    return jobs

def get_job_links_from_page(page_num):
    url = BASE_URL.format(page_num)
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return get_job_links(response.text)

def parse_job_details(html):
    soup = BeautifulSoup(html, "html.parser")
    content_divs = soup.find_all("div", class_="entry-content is-layout-flow")
    all_text = []
    all_links = []
    for div in content_divs:
        # Get all visible text from the specific div
        text = div.get_text(separator="\n", strip=True)
        if text:
            all_text.append(text)
        # Get all links (anchor tags) from the specific div
        for a in div.find_all("a", href=True):
            link_text = a.get_text(strip=True)
            href = a["href"]
            all_links.append({"text": link_text, "href": href})
    return {
        "text": "\n\n".join(all_text),
        "links": all_links
    }

def scrape_jobs_until_job(target_job_link=None, max_pages=100, num_jobs=None):
    """
    Scrape jobs page by page until a job with the given link is found,
    or until num_jobs jobs are scraped (if specified and target_job_link is not provided).
    Returns all jobs up to and including the target job, or up to the specified number of jobs.
    """
    all_jobs = []
    found = False
    for page in range(1, max_pages + 1):
        print(f"Scraping page {page}: {BASE_URL.format(page)}")
        jobs = get_job_links_from_page(page)
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

def scrape_single_effoysira_job(details_url):
    """
    Scrape a single job details page from effoysira.com given its URL.
    Saves the HTML locally for testing.
    Returns a dictionary with the job details.
    """
    try:
        response = requests.get(details_url, headers=HEADERS)
        response.raise_for_status()
        # Save HTML locally
        filename = "effoysira_job_test.html"
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
    url = "https://effoysira.com/shabelle-bank-job-vacancy-2025/"
    job = scrape_single_effoysira_job(url)
    print(job)