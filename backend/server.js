const cors = require('cors');
const express = require('express');
const db = require('./database.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 jam
}));

// Middleware auth
function requireAuth(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized. Please login first.' });
  }
  next();
}

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH, (err, match) => {
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.isAdmin = true;
    res.json({ message: 'Login successful' });
  });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Cek status login
app.get('/api/check-auth', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// GET - ambil semua projects (publik)
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET - ambil 1 project by id (publik)
app.get('/api/projects/:id', (req, res) => {
  db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Project not found' });
    res.json(row);
  });
});

// POST - tambah project baru (butuh login)
app.post('/api/projects', requireAuth, (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  db.run('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, description });
  });
});

// PUT - update project (butuh login)
app.put('/api/projects/:id', requireAuth, (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  db.run('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ id: req.params.id, name, description });
  });
});

// DELETE - hapus project (butuh login)
app.delete('/api/projects/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});