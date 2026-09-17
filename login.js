const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Login successful') {
      window.location.href = 'admin.html';
    } else {
      loginError.textContent = data.error || 'Login failed';
    }
  })
  .catch(error => {
    loginError.textContent = 'Something went wrong. Try again.';
  });
});