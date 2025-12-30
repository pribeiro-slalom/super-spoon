const request = require('supertest');
const { app } = require('../src/app');

// Helper to create an item
const createItem = async (payload = { title: 'Temp Item' }) => {
  const response = await request(app).post('/api/items').send(payload).set('Accept', 'application/json');
  expect(response.status).toBe(201);
  return response.body.data;
};

describe('Items routes extra coverage', () => {
  describe('GET /api/items filtering', () => {
    it('should support search, completed and tags filters', async () => {
      // Create items with different properties
      const itemA = await createItem({ title: 'Alpha red', description: 'first', tags: ['red'], completed: true });
      const itemB = await createItem({ title: 'Beta blue', description: 'second', tags: ['blue'], completed: false });

      // Search by title
      const searchRes = await request(app).get('/api/items').query({ search: 'Alpha' });
      expect(searchRes.status).toBe(200);
      expect(searchRes.body.data.some(i => i.id === itemA.id)).toBe(true);
      expect(searchRes.body.data.some(i => i.id === itemB.id)).toBe(false);

      // Filter by completed=true
      const completedRes = await request(app).get('/api/items').query({ completed: 'true' });
      expect(completedRes.status).toBe(200);
      expect(completedRes.body.data.every(i => i.completed === true)).toBe(true);

      // Filter by tag
      const tagRes = await request(app).get('/api/items').query({ tags: 'red' });
      expect(tagRes.status).toBe(200);
      expect(tagRes.body.data.some(i => i.id === itemA.id)).toBe(true);
      expect(tagRes.body.data.some(i => i.id === itemB.id)).toBe(false);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return item by id and handle invalid/not-found ids', async () => {
      const item = await createItem({ title: 'Find Me' });

      const res = await request(app).get(`/api/items/${item.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(item.id);

      const invalid = await request(app).get('/api/items/abc');
      expect(invalid.status).toBe(400);
      expect(invalid.body).toHaveProperty('error');

      const notFound = await request(app).get('/api/items/9999999');
      expect(notFound.status).toBe(404);
      expect(notFound.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an item and return 400/404 for bad ids', async () => {
      const item = await createItem({ title: 'To Update', tags: ['orig'], completed: false });

      // Update title, completed and tags
      const updated = await request(app).put(`/api/items/${item.id}`).send({ title: 'Updated', completed: true, tags: ['new'] }).set('Accept', 'application/json');
      expect(updated.status).toBe(200);
      expect(updated.body.data.title).toBe('Updated');
      expect(updated.body.data.completed).toBe(true);
      expect(Array.isArray(updated.body.data.tags)).toBe(true);
      expect(updated.body.data.tags).toContain('new');

      // Invalid id
      const invalid = await request(app).put('/api/items/abc').send({ title: 'x' });
      expect(invalid.status).toBe(400);
      expect(invalid.body).toHaveProperty('error');

      // Not found
      const notFound = await request(app).put('/api/items/9999999').send({ title: 'x' });
      expect(notFound.status).toBe(404);
      expect(notFound.body).toHaveProperty('error');
    });
  });
});
