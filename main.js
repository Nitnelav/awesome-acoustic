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
  const categoryMenu = document.querySelector('#category-list ul');
  container.innerHTML = '';
  categoryMenu.innerHTML = '';

  if (!list.length) {
    container.innerHTML = '<div class="col-12"><p class="text-center">No projects found.</p></div>';
    return;
  }
  // Get unique categories
  const categories = [...new Set(list.map(p => p.category).filter(Boolean))];
  categories.forEach(category => {
    const catProjects = list.filter(p => p.category === category);
    const categoryId = category.replace(/\s+/g, '-').toLowerCase();
    // Category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'col-12 category-header';
    categoryHeader.innerHTML = `<h4 id="${categoryId}" class='mt-4 mb-3'>${category}</h4>`;
    container.appendChild(categoryHeader);
    
    // Add to menu
    const menuItem = document.createElement('li');
    menuItem.className = 'nav-item category-menu-item';
    menuItem.dataset.category = category;
    menuItem.innerHTML = `<a class="nav-link" href="#${categoryId}">${category}</a>`;
    categoryMenu.appendChild(menuItem);

    catProjects.forEach(project => {
      const stats = `<div class="d-flex gap-4 justify-content-end align-items-center" style="min-width:110px;">
        <span title='Stars'><i class='fa-solid fa-star' style='color:#424242;'></i> ${project.stars !== undefined ? project.stars : '-'}</span>
        <span title='Forks'><i class='fa-solid fa-code-fork' style='color:#424242;'></i> ${project.forks !== undefined ? project.forks : '-'}</span>
        <span title='Issues'><i class='fa-regular fa-circle-dot' style='color:#424242;'></i> ${project.issues !== undefined ? project.issues : '-'}</span>
      </div>`;
      const techs = `<div class='techs text-start'>${getTechIconList(project.techs) || ''}</div>`;
      const updatedAt = project.updated_at ? `<span>Updated: ${project.updated_at.substring(0,4)}</span>` : '';
      const dates = `<div class='dates text-center flex-grow-2'>${updatedAt}</div>`;
      const tags = Array.isArray(project.tags) && project.tags.length
        ? `<div class='mb-1'>${project.tags.map(tag => `<span class='tag badge bg-secondary me-1 mb-1' style='cursor:pointer;'>${tag}</span>`).join('')}</div>`
        : '';
      
      const projectCardContainer = document.createElement('div');
      projectCardContainer.className = 'col-12 mb-4 project-container';
      // Add data attributes for filtering
      projectCardContainer.dataset.name = project.name || '';
      projectCardContainer.dataset.description = project.description || '';
      projectCardContainer.dataset.tags = (project.tags || []).join(' ');
      projectCardContainer.dataset.category = project.category || '';

      projectCardContainer.innerHTML = `
          <div class="card project-card shadow-sm">
            <div class="card-body">
              <h5 class="card-title"><a class="link-body-emphasis" href="${project.url}" target="_blank">${getRepoIcon(project.url)}${project.name}</a></h5>
              <p class="card-text">${project.description || ''}</p>
              ${tags}
            </div>
            <div class="card-footer d-flex align-items-center justify-content-between bg-white">
              ${techs}
              ${dates}
              ${stats}
            </div>
          </div>
      `;
      container.appendChild(projectCardContainer);
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
  } else if (tech === 'C#') {
    tech_lower = 'csharp';
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
  let deviconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech_lower}/${tech_lower}-original.svg`;

  if (tech_lower === "book") {
    deviconUrl = "https://www.svgrepo.com/download/528057/book-2.svg";
  }

  // If the image fails to load, it will show the tech text instead
  return `<span style="position:relative;">
    <img height='${size}' width='${size}' src="${deviconUrl}" alt="${tech}" title="${tech}" 
      onerror="this.style.display='none'; this.parentNode.querySelector('span.fallback').style.display='inline';" />
    <span class="fallback" style="display:none;background:#e0e0e0; padding:2px 6px; border-radius:4px; font-size:0.95em;">${tech}</span>
  </span>`;
}

function getTechIconList(techs) {
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
    const projectCards = document.querySelectorAll('.project-container');
    const categoryHeaders = document.querySelectorAll('.category-header');
    const categoryMenuItems = document.querySelectorAll('.category-menu-item');
    let visibleCategories = new Set();

    projectCards.forEach(card => {
      const nameMatch = card.dataset.name.toLowerCase().includes(value);
      const descMatch = card.dataset.description.toLowerCase().includes(value);
      const tagsMatch = card.dataset.tags.toLowerCase().includes(value);
      const categoryMatch = card.dataset.category.toLowerCase().includes(value);
      
      if (nameMatch || descMatch || tagsMatch || categoryMatch) {
        card.style.display = '';
        visibleCategories.add(card.dataset.category);
      } else {
        card.style.display = 'none';
      }
    });

    categoryHeaders.forEach(header => {
      const categoryName = header.querySelector('h4').textContent;
      if (visibleCategories.has(categoryName)) {
        header.style.display = '';
      } else {
        header.style.display = 'none';
      }
    });

    categoryMenuItems.forEach(menuItem => {
      const categoryName = menuItem.dataset.category;
      if (visibleCategories.has(categoryName)) {
        menuItem.style.display = '';
      } else {
        menuItem.style.display = 'none';
      }
    });
  });
}

// Focus on search with Ctrl+F
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'f') {
    event.preventDefault();
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.focus();
    }
  }
});
