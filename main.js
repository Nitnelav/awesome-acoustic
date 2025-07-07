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
      const techs = `<div class='techs text-start'>${getTechIconList(project.techs) || ''}</div>`;
      const createdAt = project.created_at ? `<span>Created: ${project.created_at.substring(0,4)}</span>` : '';
      const updatedAt = project.updated_at ? `<span>Updated: ${project.updated_at.substring(0,4)}</span>` : '';
      // const dates = `<div class='dates text-center flex-grow-2'>${createdAt}${updatedAt}</div>`;
      const dates = `<div class='dates text-center flex-grow-2'>${updatedAt}</div>`;
      const tags = Array.isArray(project.tags) && project.tags.length
        ? `<div class='mb-1'>${project.tags.map(tag => `<span class='tag badge bg-secondary me-1 mb-1' style='cursor:pointer;'>${tag}</span>`).join('')}</div>`
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
              ${techs}
              ${dates}
              ${stats}
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  });
  // Add click event to tags to set search filter
  const searchInput = document.getElementById('search');
  container.querySelectorAll('.tag').forEach(tagEl => {
    tagEl.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = this.textContent;
        // Trigger input event to filter
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  });
}

function getTechIcon(tech) {
  let size = 24; // Default size

  if (!tech) return '';

  if (tech === 'C++') {
    tech_lower = 'cplusplus';
  } else if (tech === 'Jupyter Notebook') {
    tech_lower = 'jupyter';
  } else if (tech === 'HTML') {
    tech_lower = 'html5';
  } else if (tech === 'CSS') {
    tech_lower = 'css3';
  } else if (tech === 'Dockerfile') {
    tech_lower = 'docker';
  } else if (tech === 'Shell') {
    tech_lower = 'bash';
  } else  {
    tech_lower = tech.toLowerCase();
  }
  // Instead of checking if the image exists, use onerror fallback in the <img> tag
  const deviconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech_lower}/${tech_lower}-original.svg`;
  // If the image fails to load, it will show the tech text instead
  return `<span style="position:relative;">
    <img height='${size}' width='${size}' src="${deviconUrl}" alt="${tech}" title="${tech}" 
      onerror="this.style.display='none'; this.parentNode.querySelector('span.fallback').style.display='inline';" />
    <span class="fallback" style="display:none;background:#e0e0e0; padding:2px 6px; border-radius:4px; font-size:0.95em;">${tech}</span>
  </span>`;
}

function getTechIconList(techs) {
  console.log(techs);
  if (!techs || !Array.isArray(techs) || !techs.length) return '';
  return techs.map(getTechIcon).join(' ');
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
    renderProjectsByCategory(projects.filter(p => {
        const nameMatch = p.name && p.name.toLowerCase().includes(value);
        const descMatch = p.description && p.description.toLowerCase().includes(value);
        const tagsMatch = Array.isArray(p.tags) && p.tags.some(tag => tag.toLowerCase().includes(value));
        return nameMatch || descMatch || tagsMatch;
      })
    );
  });
}
