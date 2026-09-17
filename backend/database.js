const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('warehouse.db');

db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  )
`);

module.exports = db;