import json
from pathlib import Path

README_HEADER = '''# Awesome Acoustic !

A list of awesome open-source Acoustic packages and resources.

> [!IMPORTANT]
> Contributions are more than welcome

- [General Tools](#general-tools)
- [Signal Processing](#signal-processing)
- [Room Acoustics](#room-acoustics)
- [Environment](#environment)
- [Soundscape](#soundscape)
- [Bioacoustics](#bioacoustics)
- [Databases](#databases)
'''

CATEGORY_ANCHORS = {
    'General Tools': 'general-tools',
    'Signal Processing': 'signal-processing',
    'Room Acoustics': 'room-acoustics',
    'Environment': 'environment',
    'Soundscape': 'soundscape',
    'Bioacoustics': 'bioacoustics',
    'Databases': 'databases',
}

TECH_ICON = {
    'py': '![Techs](https://skillicons.dev/icons?i=py)',
    'cpp': '![Techs](https://skillicons.dev/icons?i=cpp)',
    'java': '![Techs](https://skillicons.dev/icons?i=java)',
    'windows': '![Techs](https://skillicons.dev/icons?i=windows)',
    'raspberrypi': '![Techs](https://skillicons.dev/icons?i=raspberrypi)',
}

def techs_md(techs):
    return ' '.join(TECH_ICON.get(t, t) for t in techs)

def category_table(projects):
    lines = [
        '| Package | Description | Techs |',
        '|---------|-------------|-------|'
    ]
    for p in projects:
        lines.append(f"| [{p['name']}]({p['url']}) | {p['description']} | {techs_md(p['techs'])} |")
    return '\n'.join(lines)

def main():
    data = json.loads(Path('projects.json').read_text(encoding='utf-8'))
    out = [README_HEADER.strip() + '\n']
    for cat in data:
        anchor = CATEGORY_ANCHORS.get(cat['category'], cat['category'].lower().replace(' ', '-'))
        out.append(f"\n## {cat['category']}\n")
        out.append(category_table(cat['projects']))
        out.append('')
    Path('README.md').write_text('\n'.join(out), encoding='utf-8')

if __name__ == '__main__':
    main()
