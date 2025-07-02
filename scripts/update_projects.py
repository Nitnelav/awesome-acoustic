import json
import requests
from datetime import datetime
from dotenv import load_dotenv
import os

GITHUB_API_URL = "https://api.github.com/repos/"

def get_github_repo_data(repo_full_name, github_token=None):
    headers = {}
    if github_token:
        headers["Authorization"] = f"token {github_token}"
    repo_url = GITHUB_API_URL + repo_full_name
    repo_resp = requests.get(repo_url, headers=headers)
    if repo_resp.status_code != 200:
        print(f"Failed to fetch {repo_full_name}: {repo_resp.status_code}")
        return None

    repo_data = repo_resp.json()
    
    # Get languages
    langs_resp = requests.get(repo_url + "/languages", headers=headers)
    languages = langs_resp.json() if langs_resp.status_code == 200 else {}
    sum_languages = sum(languages.values())
    lang_threshold = 0.01
    languages = {lang: languages[lang] / sum_languages for lang in languages if languages[lang] / sum_languages > lang_threshold}  # Keep languages that are more than 1% of the codebase

    return {
        "description": repo_data.get("description"),
        "tags": repo_data.get("topics", []),
        "stars": repo_data.get("stargazers_count"),
        "forks": repo_data.get("forks_count"),
        "issues": repo_data.get("open_issues_count"),
        "language": repo_data.get("language"),
        "language_list": languages,
        "homepage": repo_data.get("homepage"),
        "created_at": repo_data.get("created_at"),
        "updated_at": repo_data.get("updated_at"),
    }

def main():
    # Optionally set your GitHub token for higher rate limits
    load_dotenv()
    GITHUB_API_TOKEN = os.environ.get("GH_API_TOKEN")

    with open("projects.json", "r", encoding="utf-8") as f:
        projects = json.load(f)

    enriched_projects = []
    for project in projects:
        repo_full_name = None
        url = project.get("url")
        if url and "github.com" in url:
            try:
                # Extract owner/repo from URL
                parts = url.split("github.com/")[-1].split("/")
                if len(parts) >= 2:
                    repo_full_name = f"{parts[0]}/{parts[1].replace('.git','')}"
            except Exception:
                pass
        if not repo_full_name:
            print(f"Skipping project without github repo: {project.get('name')}")
            enriched_projects.append(project)
            continue

        data = get_github_repo_data(repo_full_name, GITHUB_API_TOKEN)
        if data:
            project.update(data)
        enriched_projects.append(project)

    with open("projects.json", "w", encoding="utf-8") as f:
        json.dump(enriched_projects, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()