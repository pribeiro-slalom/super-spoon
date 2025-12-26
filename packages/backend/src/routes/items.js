const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { createSchema, updateSchema, validate } = require('../validators/items');

// Helper to map DB row to API shape
function mapItem(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: !!row.completed,
    dueDate: row.due_date || null,
    tags: row.tags ? JSON.parse(row.tags) : [],
    ownerId: row.owner_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/items
router.get('/', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page) || 20));
    const offset = (page - 1) * per_page;

    const search = req.query.search;
    const completed = req.query.completed;
    const tags = req.query.tags; // comma separated

    let where = [];
    let params = [];

    if (search) {
      where.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (typeof completed !== 'undefined') {
      const val = completed === 'true' ? 1 : 0;
      where.push('completed = ?');
      params.push(val);
    }

    if (tags) {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagArr.length > 0) {
        // simple contains any tag
        where.push('(' + tagArr.map(() => "tags LIKE ?").join(' OR ') + ')');
        tagArr.forEach(t => params.push(`%\"${t}\"%`));
      }
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';

    const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM items ${whereClause}`);
    const total = totalStmt.get(...params).count;

    const stmt = db.prepare(`SELECT * FROM items ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`);
    const rows = stmt.all(...params, per_page, offset);

    const items = rows.map(mapItem);

    res.json({ data: items, meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) } });
  } catch (err) {
    console.error('Error listing items', err);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to list items' } });
  }
});

// GET /api/items/:id
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: { message: 'Valid item ID is required' } });

    const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: { message: 'Item not found' } });

    res.json({ data: mapItem(row) });
  } catch (err) {
    console.error('Error fetching item', err);
    res.status(500).json({ error: { message: 'Failed to fetch item' } });
  }
});

// POST /api/items
router.post('/', validate(createSchema), (req, res) => {
  try {
    const body = req.validatedBody;

    const tagsJson = body.tags ? JSON.stringify(body.tags) : null;
    const dueDate = body.dueDate || null;

    const insert = db.prepare(
      `INSERT INTO items (title, description, completed, due_date, tags, owner_id) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const result = insert.run(body.title, body.description || null, body.completed ? 1 : 0, dueDate, tagsJson, null);
    const id = result.lastInsertRowid;
    const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).location(`/api/items/${id}`).json({ data: mapItem(row) });
  } catch (err) {
    console.error('Error creating item', err);
    res.status(500).json({ error: { message: 'Failed to create item' } });
  }
});

// PUT /api/items/:id
router.put('/:id', validate(updateSchema), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: { message: 'Valid item ID is required' } });

    const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: { message: 'Item not found' } });

    const body = req.validatedBody;

    const updated = {
      title: body.title || existing.title,
      description: typeof body.description !== 'undefined' ? body.description : existing.description,
      completed: typeof body.completed !== 'undefined' ? (body.completed ? 1 : 0) : existing.completed,
      due_date: body.dueDate || existing.due_date,
      tags: body.tags ? JSON.stringify(body.tags) : existing.tags,
    };

    const updateStmt = db.prepare(
      `UPDATE items SET title = ?, description = ?, completed = ?, due_date = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    );
    updateStmt.run(updated.title, updated.description, updated.completed, updated.due_date, updated.tags, id);

    const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json({ data: mapItem(row) });
  } catch (err) {
    console.error('Error updating item', err);
    res.status(500).json({ error: { message: 'Failed to update item' } });
  }
});

// DELETE /api/items/:id
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: { message: 'Valid item ID is required' } });

    const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: { message: 'Item not found' } });

    const del = db.prepare('DELETE FROM items WHERE id = ?');
    const result = del.run(id);
    if (result.changes > 0) {
      return res.status(204).send();
    }
    res.status(404).json({ error: { message: 'Item not found' } });
  } catch (err) {
    console.error('Error deleting item', err);
    res.status(500).json({ error: { message: 'Failed to delete item' } });
  }
});

module.exports = router;