import json
from pathlib import Path

README_HEADER = '''[![Awesome Acoustics](images/logo_1280x640.png)](#)

A list of awesome open-source Acoustic packages and resources.

> [!IMPORTANT]
> Contributions are more than welcome
'''

def category_table(projects):
    lines = [
        '| Package | Description | Language |',
        '|---------|-------------|----------|'
    ]
    for p in projects:
        lines.append(f"| [{p['name']}]({p['url']}) | {p.get('description', '')} | {p.get('language', '')} |")
    return '\n'.join(lines)

def main():
    data = json.loads(Path('projects.json').read_text(encoding='utf-8'))
    # Get unique categories in order of appearance
    categories = []
    for p in data:
        cat = p.get('category')
        if cat and cat not in categories:
            categories.append(cat)
    # Build dynamic categories list for header
    cat_links = [f"- [{cat}](#{cat.lower().replace(' ', '-')})" for cat in categories]
    header = README_HEADER.strip() + '\n' + '\n'.join(cat_links) + '\n'
    out = [header]
    for cat in categories:
        cat_projects = [p for p in data if p.get('category') == cat]
        out.append(f"\n## {cat}\n")
        out.append(category_table(cat_projects))
        out.append('')
    Path('README.md').write_text('\n'.join(out), encoding='utf-8')

if __name__ == '__main__':
    main()
