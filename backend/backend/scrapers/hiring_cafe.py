import requests
import time

url = "https://hiring.cafe/api/search-jobs"
headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "origin": "https://hiring.cafe",
    "priority": "u=1, i",
    "referer": "https://hiring.cafe/?searchState=%7B%22defaultToUserLocation%22%3Afalse%2C%22workplaceTypes%22%3A%5B%22Remote%22%5D%7D",
    "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36"
}
cookies = {
    "ph_phc_PF366Udfg1etPsVw8cx8tlB6ePhBp7KO6E7ncWcXKtd_posthog": '{"distinct_id":"01994a28-ddf0-7652-ab05-3cc88bbd5e79","$sesid":[null,null,null]}'
}
data = {
    "size": 40,
    "page": 0,
    "searchState": {
        "locations": [],
        "workplaceTypes": ["Remote"],
        "defaultToUserLocation": False,
        "userLocation": None,
        "physicalEnvironments": ["Office", "Outdoor", "Vehicle", "Industrial", "Customer-Facing"],
        "physicalLaborIntensity": ["Low", "Medium", "High"],
        "physicalPositions": ["Sitting", "Standing"],
        "oralCommunicationLevels": ["Low", "Medium", "High"],
        "computerUsageLevels": ["Low", "Medium", "High"],
        "cognitiveDemandLevels": ["Low", "Medium", "High"],
        "currency": {"label": "Any", "value": None},
        "frequency": {"label": "Any", "value": None},
        "minCompensationLowEnd": None,
        "minCompensationHighEnd": None,
        "maxCompensationLowEnd": None,
        "maxCompensationHighEnd": None,
        "restrictJobsToTransparentSalaries": False,
        "calcFrequency": "Yearly",
        "commitmentTypes": ["Full Time", "Part Time", "Contract", "Internship", "Temporary", "Seasonal", "Volunteer"],
        "jobTitleQuery": "",
        "jobDescriptionQuery": "",
        "associatesDegreeFieldsOfStudy": [],
        "excludedAssociatesDegreeFieldsOfStudy": [],
        "bachelorsDegreeFieldsOfStudy": [],
        "excludedBachelorsDegreeFieldsOfStudy": [],
        "mastersDegreeFieldsOfStudy": [],
        "excludedMastersDegreeFieldsOfStudy": [],
        "doctorateDegreeFieldsOfStudy": [],
        "excludedDoctorateDegreeFieldsOfStudy": [],
        "associatesDegreeRequirements": [],
        "bachelorsDegreeRequirements": [],
        "mastersDegreeRequirements": [],
        "doctorateDegreeRequirements": [],
        "licensesAndCertifications": [],
        "excludedLicensesAndCertifications": [],
        "excludeAllLicensesAndCertifications": False,
        "seniorityLevel": ["No Prior Experience Required", "Entry Level", "Mid Level", "Senior Level"],
        "roleTypes": ["Individual Contributor", "People Manager"],
        "roleYoeRange": [0, 20],
        "excludeIfRoleYoeIsNotSpecified": False,
        "managementYoeRange": [0, 20],
        "excludeIfManagementYoeIsNotSpecified": False,
        "securityClearances": ["None", "Confidential", "Secret", "Top Secret", "Top Secret/SCI", "Public Trust", "Interim Clearances", "Other"],
        "languageRequirements": [],
        "excludedLanguageRequirements": [],
        "languageRequirementsOperator": "OR",
        "excludeJobsWithAdditionalLanguageRequirements": False,
        "airTravelRequirement": ["None", "Minimal", "Moderate", "Extensive"],
        "landTravelRequirement": ["None", "Minimal", "Moderate", "Extensive"],
        "morningShiftWork": [],
        "eveningShiftWork": [],
        "overnightShiftWork": [],
        "weekendAvailabilityRequired": "Doesn't Matter",
        "holidayAvailabilityRequired": "Doesn't Matter",
        "overtimeRequired": "Doesn't Matter",
        "onCallRequirements": ["None", "Occasional (once a month or less)", "Regular (once a week or more)"],
        "benefitsAndPerks": [],
        "applicationFormEase": [],
        "companyNames": [],
        "excludedCompanyNames": [],
        "usaGovPref": None,
        "industries": [],
        "excludedIndustries": [],
        "companyKeywords": [],
        "companyKeywordsBooleanOperator": "OR",
        "excludedCompanyKeywords": [],
        "hideJobTypes": [],
        "encouragedToApply": [],
        "searchQuery": "",
        "dateFetchedPastNDays": 121,
        "hiddenCompanies": [],
        "user": None,
        "searchModeSelectedCompany": None,
        "departments": [],
        "restrictedSearchAttributes": [],
        "sortBy": "default",
        "technologyKeywordsQuery": "",
        "requirementsKeywordsQuery": "",
        "companyPublicOrPrivate": "all",
        "latestInvestmentYearRange": [None, None],
        "latestInvestmentSeries": [],
        "latestInvestmentAmount": None,
        "latestInvestmentCurrency": [],
        "investors": [],
        "excludedInvestors": [],
        "isNonProfit": "all",
        "companySizeRanges": [],
        "minYearFounded": None,
        "maxYearFounded": None,
        "excludedLatestInvestmentSeries": []
    }
}

def safe_get(d, *keys):
    """Safely get nested dictionary values."""
    for key in keys:
        if d is None or key not in d:
            return ""
        d = d[key]
    return d

def fetch_jobs(page):
    data["page"] = page
    response = requests.post(url, headers=headers, cookies=cookies, json=data)
    response_json = response.json()
    results = response_json.get("results", [])
    jobs = []
    for job in results:
        job_info = job.get("job_information", {})
        job_data = job.get("v5_processed_job_data", {})
        company_data = job.get("v5_processed_company_data", {})
        title = safe_get(job_info, "title")
        print(title)
        jobs.append({
            "id": job.get("id", ""),
            "title": title,
            "job_title_raw": safe_get(job_info, "job_title_raw"),
            "core_job_title": safe_get(job_data, "core_job_title"),
            "requirements_summary": safe_get(job_data, "requirements_summary"),
            "apply_url": job.get("apply_url", ""),
            "company_name": company_data.get("name", ""),
            "company_website": company_data.get("website", ""),
            "company_tagline": company_data.get("tagline", ""),
            "job_category": job_data.get("job_category", ""),
            "role_type": job_data.get("role_type", ""),
            "seniority_level": job_data.get("seniority_level", ""),
            "commitment": ", ".join(job_data.get("commitment", [])),
            "workplace_type": job_data.get("workplace_type", ""),
            "formatted_workplace_location": job_data.get("formatted_workplace_location", ""),
            "description": job_info.get("description", ""),
            "technical_tools": ", ".join(job_data.get("technical_tools", [])),
            "language_requirements": ", ".join(job_data.get("language_requirements", [])),
            "yearly_min_compensation": job_data.get("yearly_min_compensation", ""),
            "yearly_max_compensation": job_data.get("yearly_max_compensation", ""),
            "listed_compensation_currency": job_data.get("listed_compensation_currency", ""),
            "listed_compensation_frequency": job_data.get("listed_compensation_frequency", ""),
            "estimated_publish_date": job_data.get("estimated_publish_date", "")
        })
    return jobs

def scrape_jobs_until_job(target_job_id, max_pages=100, pages_to_fetch=None):
    """
    Scrape jobs page by page until a job with the given id is found,
    or until pages_to_fetch pages are scraped (if specified).
    Returns all jobs up to and including the target job, or up to the specified number of pages.
    """
    all_jobs = []
    found = False
    for page in range(max_pages):
        if pages_to_fetch is not None and page >= pages_to_fetch:
            break
        print(f"Scraping page {page}")
        jobs = fetch_jobs(page)
        for job in jobs:
            all_jobs.append(job)
            if job.get("id") == target_job_id:
                found = True
                break
        if found:
            print(f"Found target job id: {target_job_id}")
            break
        time.sleep(2)
    return all_jobs

# Example usage:
# if __name__ == "__main__":
#     target_id = "some-job-id"
#     jobs = scrape_jobs_until_job(target_id)
#     print(f"Total jobs scraped: {len(jobs)}")
#     for job in jobs:
#         print(job)