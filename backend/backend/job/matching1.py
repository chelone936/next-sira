# from sentence_transformers import SentenceTransformer
# import numpy as np

# # Load the model once (global)
# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# def clean_text(text):
#     if not text:
#         return ""
#     return str(text).strip().replace("\n", " ").replace(",", " ")

# def profile_to_text(profile):
#     fields = [
#         clean_text(profile.skills),
#         clean_text(profile.experience),
#         clean_text(profile.job_title),
#         clean_text(profile.bio),
#         clean_text(profile.preferred_locations),
#         clean_text(profile.job_types),
#         clean_text(profile.linkedin_url),
#         clean_text(profile.portfolio_url),
#     ]
#     return " ".join([f for f in fields if f])

# def job_to_text(job):
#     fields = [
#         clean_text(job.skills if isinstance(job.skills, str) else ", ".join(job.skills or [])),
#         clean_text(job.experience_level),
#         clean_text(job.title),
#         clean_text(job.description),
#         clean_text(job.other_requirements),
#         clean_text(job.location if isinstance(job.location, str) else ", ".join(job.location or [])),
#         clean_text(job.country),
#         clean_text(job.city),
#         clean_text(job.job_type),
#         clean_text(job.degree_required),
#         clean_text(job.category),
#         clean_text(job.tags if isinstance(job.tags, str) else ", ".join(job.tags or [])),
#     ]
#     return " ".join([f for f in fields if f])

# def get_embedding(text):
#     # Use Hugging Face model for embeddings
#     emb = model.encode(text)
#     return emb

# def cosine_similarity(vec1, vec2):
#     if vec1 is None or vec2 is None:
#         return 0.0
#     dot = np.dot(vec1, vec2)
#     norm1 = np.linalg.norm(vec1)
#     norm2 = np.linalg.norm(vec2)
#     if norm1 == 0 or norm2 == 0:
#         return 0.0
#     return dot / (norm1 * norm2)

# def match_profile_to_job(profile, job):
#     user_text = profile_to_text(profile)
#     job_text = job_to_text(job)
#     user_emb = get_embedding(user_text)
#     job_emb = get_embedding(job_text)
#     score = cosine_similarity(user_emb, job_emb)
#     return score

# def match_jobs_to_user(user_profile, jobs):
#     class ProfileObj:
#         def __init__(self, d):
#             for k, v in d.items():
#                 setattr(self, k, v)
#     if isinstance(user_profile, dict):
#         user_profile = ProfileObj(user_profile)

#     results = []
#     for job in jobs:
#         class JobObj:
#             def __init__(self, d):
#                 for k, v in d.items():
#                     setattr(self, k, v)
#         job_obj = JobObj(job)
#         score = match_profile_to_job(user_profile, job_obj)
#         percentage = float(round(score * 100, 2))  # <-- Ensure native float
#         results.append({
#             "job_id": getattr(job_obj, "id", None),
#             "match_percentage": percentage
#         })
#     return results