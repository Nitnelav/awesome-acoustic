// Fetch and render projects
let projects = [];
fetch('detailed_projects.json')
  .then(response => response.json())
  .then(data => {
    // Shuffle projects randomly
    projects = data.sort(() => Math.random() - 0.5);
    // projects = data.sort((a, b) => a.name.localeCompare(b.name));
    // projects = data;
    renderProjectsByCategory(projects);
  });

function renderProjectsByCategory(list) {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<div class="col-12"><p class="text-center">No projects found.</p></div>';
    return;
  }
  // Get unique categories
  const categories = [...new Set(list.map(p => p.category).filter(Boolean))];
  categories.forEach(category => {
    const catProjects = list.filter(p => p.category === category);
    // Category header
    container.innerHTML += `<div class='col-12'><h4 class='mt-4 mb-3'>${category}</h4></div>`;
    catProjects.forEach(project => {
      const stats = `<div class=\"d-flex gap-4 justify-content-end align-items-center\" style=\"min-width:110px;\">
        <span title='Stars'><i class='fa-solid fa-star' style='color:#424242;'></i> ${project.stars !== undefined ? project.stars : '-'}</span>
        <span title='Forks'><i class='fa-solid fa-code-fork' style='color:#424242;'></i> ${project.forks !== undefined ? project.forks : '-'}</span>
        <span title='Issues'><i class='fa-regular fa-circle-dot' style='color:#424242;'></i> ${project.issues !== undefined ? project.issues : '-'}</span>
      </div>`;
      const lang = `<div class='lang text-start'>${getLanguageIcon(project.language) || ''}</div>`;
      const createdAt = project.created_at ? `<span>Created: ${project.created_at.substring(0,4)}</span>` : '';
      const updatedAt = project.updated_at ? `<span>Updated: ${project.updated_at.substring(0,4)}</span>` : '';
      const dates = `<div class='dates text-center flex-grow-2'>${createdAt}${updatedAt}</div>`;
      const tags = Array.isArray(project.tags) && project.tags.length
        ? `<div class='mb-1'>${project.tags.map(tag => `<span class='badge bg-secondary me-1 mb-1'>${tag}</span>`).join('')}</div>`
        : '';
      const card = `
        <div class=\"col-12 mb-4\">
          <div class=\"card project-card shadow-sm\">
            <div class=\"card-body\">
              <h5 class=\"card-title\"><a class=\"link-body-emphasis\" href=\"${project.url}\" target=\"_blank\">${getRepoIcon(project.url)}${project.name}</a></h5>
              <p class=\"card-text\">${project.description || ''}</p>
              ${tags}
            </div>
            <div class=\"card-footer d-flex align-items-center justify-content-between bg-white\">
              ${lang}
              ${dates}
              ${stats}
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  });
}

function getLanguageIcon(lang) {
  switch ((lang || '').toLowerCase()) {
    case 'python':
      return "<i class='fa-brands fa-python' style='color:#3776ab;' title='Python'></i> ";
    case 'java':
      return "<i class='fa-brands fa-java' style='color:#b07219;' title='Java'></i> ";
    case 'c++':
        return "<img height='16' width='16' src='https://cdn.simpleicons.org/cplusplus/00599c' alt='C++' title='C++' />";
    case 'php':
      return "<i class='fa-brands fa-php' style='color:#777bb4;' title='PHP'></i> ";
    case 'javascript':
      return "<i class='fa-brands fa-js' style='color:#f7df1e;' title='JavaScript'></i> ";
    default:
      return lang;
  }
}

function getRepoIcon(url) {
  if (!url) return '';
  if (url.match(/^https?:\/\/(www\.)?github\.com\//i)) {
    return "<i class='fa-brands fa-github' style='color:#24292f;' title='GitHub'></i> ";
  }
  if (url.match(/^https?:\/\/(www\.)?gitlab\.com\//i)) {
    return "<i class='fa-brands fa-gitlab' style='color:#fc6d26;' title='GitLab'></i> ";
  }
  return "<i class='fa-solid fa-arrow-up-right-from-square' style='color:#424242;' title='Repository'></i> ";
}

// Filter by name
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const value = this.value.trim().toLowerCase();
    // Filter and re-render by category
    renderProjectsByCategory(
      projects.filter(p => p.name.toLowerCase().includes(value))
    );
  });
}
