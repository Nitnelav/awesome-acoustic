# Contributing to Awesome Acoustic

Thanks for your interest in improving this list of open-source acoustics resources! Please read this guide before submitting changes so everything stays consistent and the automation does its job.

## 🔍 How the Repository Works
Certain files are **generated automatically**. You should only edit the source data file and let the scripts + GitHub Actions rebuild the derived artifacts.
You should only manually modify the `projects.json` data file; the other files are regenerated.

### Generation Pipeline
1. You add or modify an entry in `projects.json`.
2. The enrichment script (`scripts/update_projects.py`) fetches metadata (description, stars, languages, topics) for GitHub links and writes `detailed_projects.json`.
3. The README builder (`scripts/update_readme.py`) reads `detailed_projects.json` and regenerates `README.md`.
4. A GitHub Action (on push / PR) will run these scripts and commit updates if you did not run them locally.

### Project Entry Schema (`projects.json`)
Each entry is a JSON object:
```jsonc
{
  "name": "Required – display name",
  "url": "Optional but recommended (GitHub or external site)",
  "description": "Optional, short one-liner.",
  "category": "Required – used for grouping sections",
  "techs": ["Optional", "List", "Of", "Technologies"] // or a single string
}
```
Notes:
- `techs` may be a string or array; it will be normalized to an array.
- If the URL points to GitHub, additional metadata is fetched automatically.
- If no GitHub repo is provided, the entry is still kept as-is.

### Categories

Categories are not hard-coded here; they are derived from the `category` fields already present in `projects.json`.  
You may introduce a new category when adding a project if none of the existing ones fit.

Guidelines:
- Prefer reusing an existing category (check current entries first).
- Keep names concise (Title Case, no emojis, no trailing punctuation).
- Use broad, meaningful groupings (e.g., Signal Processing, Room Acoustics).
- Avoid overly narrow single-project categories.

### Running the scripts locally

To run the generation scripts locally, follow these steps:

1. Install the required Python packages:
   
   ```powershell
   pip install -r requirements.txt
   ```

2. Update the project metadata:
   
   ```powershell
   python scripts/update_projects.py
   ```

3. Regenerate the README:
   
   ```powershell
   python scripts/update_readme.py
   ```

## Website

The site is hosted via GitHub Pages: https://nitnelav.github.io/awesome-acoustic/

### How the Front-End Works
Files involved:
- `index.html` – Static shell, loads Bootstrap, Font Awesome, Devicon, and `main.js`.
- `main.js` – Fetches `detailed_projects.json`, randomizes order (simple shuffle), groups by `category`, builds cards + side menu + tag filters.
- `style.css` – Presentation tweaks (override or extend via standard CSS).
- `about.html` – Injected lazily into the modal when the Info button is clicked.
- `images/` – Logos and meta images used for branding / Open Graph.

Runtime data flow:
1. Browser requests `index.html`.
2. `main.js` fetches `detailed_projects.json` (already generated in the repo – no API call from the browser to GitHub).
3. Projects are shuffled, then iterated by unique `category` (order of first appearance in the shuffled list).
4. For each project a card is built: name (with repo icon), description, tags (GitHub topics), tech icons, year extracted from `updated_at`, and stats (stars / forks / issues or `-`).
5. Clicking a tag auto-fills the search box and triggers filtering.
6. The left category menu only shows categories currently visible after filtering.

### Category & Anchor Generation
Anchors are formed by lowercasing the category name and replacing whitespace with `-` (see `const categoryId = category.replace(/\s+/g, '-').toLowerCase();`). If you rename a category in `projects.json`, the anchor will change automatically—no manual TOC maintenance required.

### Tech Icon Mapping
`main.js` maps technology names to Devicon identifiers with a small normalization block (e.g. `C++ -> cplusplus`, `Jupyter Notebook -> jupyter`). Unknown icons fall back to a text badge via `onerror` handler. To support a new special case, extend the `getTechIcon` conditional chain.

### Local Preview (Recommended Before PR)
Because `fetch()` is used, open the site via a local HTTP server (not the `file://` protocol) to avoid CORS / fetch issues.

```powershell
python -m http.server 8000
# Then open http://localhost:8000
```

If you changed only `projects.json` and did not run the scripts, the local site will still show the *old* `detailed_projects.json`. Run the following script first if you want to preview the latest content:
```powershell
python scripts/update_projects.py
```

## 📝 Licensing
This list is provided under the repository license (see `LICENSE`). Make sure any added resource is publicly accessible.

## 🙌 Thanks
Your contribution helps the acoustics community find and use great tools. Thank you!

---
Feel free to suggest improvements to this guide via PR.
