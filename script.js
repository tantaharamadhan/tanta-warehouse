// Fade-in animation saat scroll
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));

// Dark/Light mode toggle
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }
});

// Fetch projects dari GitHub API
const container = document.getElementById('project-container');
const projectCount = document.getElementById('project-count');

fetch('https://api.github.com/users/tantaharamadhan/repos?sort=updated')
  .then(response => response.json())
  .then(repos => {
    projectCount.textContent = `Total Projects: ${repos.length}`;
container.innerHTML = ''; // hapus loading text

    repos.forEach(repo => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available.'}</p>
        <a href="${repo.html_url}" target="_blank">
          <i class="fa-brands fa-github"></i> Lihat di GitHub
        </a>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    container.innerHTML = '<p>Gagal memuat projects. Coba refresh halaman.</p>';
    console.error('Error fetching repos:', error);
  });

  const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let isValid = true;

  // Reset error state
  [name, email, message].forEach(field => {
    field.classList.remove('invalid');
    document.getElementById(`${field.id}-error`).textContent = '';
  });

  // Validasi name
  if (name.value.trim().length < 2) {
    name.classList.add('invalid');
    document.getElementById('name-error').textContent = 'Name must be at least 2 characters.';
    isValid = false;
  }

  // Validasi email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    email.classList.add('invalid');
    document.getElementById('email-error').textContent = 'Please enter a valid email.';
    isValid = false;
  }

  // Validasi message
  if (message.value.trim().length < 10) {
    message.classList.add('invalid');
    document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
    isValid = false;
  }

  if (!isValid) return;

  // Kalau semua valid, lanjut submit ke Formspree
  const formData = new FormData(contactForm);

  fetch(contactForm.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      contactForm.innerHTML = '<p>Thanks! Your message has been sent.</p>';
    } else {
      alert('Oops! Something went wrong. Please try again.');
    }
  })
  .catch(error => {
    alert('Oops! Something went wrong. Please try again.');
  });
});