const API = 'http://localhost:3000/api/projects';
const form = document.getElementById('project-form');
const projectIdInput = document.getElementById('project-id');
const nameInput = document.getElementById('name');
const descInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const listContainer = document.getElementById('admin-project-list');

// Cek auth dulu sebelum tampilin dashboard
fetch('http://localhost:3000/api/check-auth', { credentials: 'include' })
  .then(res => res.json())
  .then(data => {
    if (!data.isAdmin) window.location.href = 'login.html';
  });

// Load semua projects
function loadProjects() {
  fetch(API)
    .then(res => res.json())
    .then(projects => {
      listContainer.innerHTML = '';
      projects.forEach(p => {
        const item = document.createElement('div');
        item.classList.add('admin-project-item');
        item.innerHTML = `
          <div>
            <strong>${p.name}</strong>
            <p>${p.description}</p>
          </div>
          <div class="actions">
            <button class="edit-btn" onclick="editProject(${p.id}, '${p.name}', '${p.description}')">Edit</button>
            <button class="delete-btn" onclick="deleteProject(${p.id})">Delete</button>
          </div>
        `;
        listContainer.appendChild(item);
      });
    });
}

// Submit form (create/update)
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = projectIdInput.value;
  const name = nameInput.value;
  const description = descInput.value;

  const options = {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, description })
  };

  fetch(id ? `${API}/${id}` : API, options)
    .then(res => res.json())
    .then(() => {
      form.reset();
      projectIdInput.value = '';
      submitBtn.textContent = 'Add Project';
      loadProjects();
    });
});

// Edit project - isi form dengan data yang mau diedit
function editProject(id, name, description) {
  projectIdInput.value = id;
  nameInput.value = name;
  descInput.value = description;
  submitBtn.textContent = 'Update Project';
}

// Delete project
function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  fetch(`${API}/${id}`, { method: 'DELETE', credentials: 'include' })
    .then(() => loadProjects());
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  fetch('http://localhost:3000/api/logout', { method: 'POST', credentials: 'include' })
    .then(() => window.location.href = 'login.html');
});

loadProjects();