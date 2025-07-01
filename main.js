async function fetchProjects() {
  const res = await fetch('projects.json');
  return res.json();
}

function createProjectHTML(project) {
  const techs = project.techs.map(t => `<span class="tech">${t}</span>`).join(', ');
  return `
    <li class="project-item">
      <div class="project-title"><a href="${project.url}" target="_blank">${project.name}</a></div>
      <div class="project-desc">${project.description}</div>
      <div class="techs">${techs}</div>
    </li>
  `;
}

function renderProjects(data, filter = '') {
  const container = document.getElementById('projects');
  container.innerHTML = '';
  filter = filter.toLowerCase();
  data.forEach(cat => {
    const filtered = cat.projects.filter(p =>
      p.name.toLowerCase().includes(filter) ||
      p.description.toLowerCase().includes(filter) ||
      (p.techs && p.techs.join(' ').toLowerCase().includes(filter))
    );
    if (filtered.length > 0) {
      const section = document.createElement('section');
      section.className = 'category';
      section.innerHTML = `<h2>${cat.category}</h2><ul class="project-list">${filtered.map(createProjectHTML).join('')}</ul>`;
      container.appendChild(section);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchProjects();
  renderProjects(data);
  document.getElementById('search').addEventListener('input', e => {
    renderProjects(data, e.target.value);
  });
});
