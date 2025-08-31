# GitHub Copilot Contribution Instructions

This repository auto-generates certain files. When adding or modifying projects, follow these rules so automation stays consistent.

## Source of Truth
- The ONLY file you should edit manually to add or adjust a project entry is `projects.json`.
- Do **NOT** manually edit:
  - `README.md` (auto-generated)
  - `detailed_projects.json` (auto-generated)

## Automation Flow
1. You add or update entries in `projects.json`.
2. A GitHub Action runs the Python scripts in `scripts/`:
   - `scripts/update_projects.py` enriches each project (GitHub metadata, languages) and writes `detailed_projects.json`.
   - `scripts/update_readme.py` builds the tables and rewrites `README.md` from `detailed_projects.json`.
3. The Action commits the regenerated artifacts.

## Editing Guidelines
- Keep the JSON array ordered roughly by category & relevance (no strict requirement, just readability).
- Each project object may contain:
  - `name` (required)
  - `url` (recommended)
  - `description` (optional but encouraged)
  - `category` (required – used for README sections)
  - `techs` (string or array; optional – will be normalized/enriched)
- If a project has no GitHub repository, it will be kept without enrichment.
- Use valid JSON (double quotes, commas, etc.).

## Examples
```jsonc
{
  "name": "ExampleLib",
  "url": "https://github.com/example/examplelib",
  "description": "Short one-line summary.",
  "category": "Signal Processing",
  "techs": ["Python"]
}
```
You can also use a single string for `techs`:
```jsonc
{
  "name": "AnotherTool",
  "url": "https://github.com/org/another-tool",
  "category": "Room Acoustics",
  "techs": "C++"
}
```
The automation will normalize it to an array.

## Common Mistakes to Avoid
- Editing `README.md` directly → those changes will be overwritten.
- Adding trailing comments inside pure JSON (the file is parsed with `json.load`).
- Using single quotes instead of double quotes.
- Forgetting a comma between objects.

## Copilot Hints
- When suggesting additions, modify only the `projects.json` file.
- If asked to "add a project", do not touch `README.md`.
- If asked to "regenerate README", run the scripts instead of manual edits.

## Questions
If unsure, open an issue or start a discussion rather than editing generated files.

Thanks for keeping the list clean and automated!
