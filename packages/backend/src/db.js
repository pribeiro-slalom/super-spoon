const Database = require('better-sqlite3');

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    due_date TEXT,
    tags TEXT,
    owner_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialItems = [
  { title: 'Item 1', description: 'First item' },
  { title: 'Item 2', description: 'Second item' },
  { title: 'Item 3', description: 'Third item' }
];

const insertStmt = db.prepare(
  `INSERT INTO items (title, description, completed, due_date, tags, owner_id) VALUES (?, ?, ?, ?, ?, ?)`
);

initialItems.forEach(item => {
  insertStmt.run(item.title, item.description || null, 0, null, null, null);
});

console.log('In-memory database initialized with sample data');

module.exports = { db, insertStmt };