// ============================================
// tasks.test.js — API Integration Tests
// Tests every endpoint using supertest
// ============================================

const request = require('supertest');
const app     = require('../server');

// ── TEST SUITE ────────────────────────────────
describe('Task Manager API Tests', () => {

  let createdTaskId; // Store ID for use across tests

  // ── TEST: ROOT ENDPOINT ───────────────────
  describe('GET /', () => {
    it('should return API info', async () => {
      const res = await request(app).get('/');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Task Manager API is running!');
    });
  });

  // ── TEST: GET ALL TASKS ───────────────────
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app).get('/api/tasks?status=todo');

      expect(res.statusCode).toBe(200);
      // Every returned task must have status 'todo'
      res.body.data.forEach(task => {
        expect(task.status).toBe('todo');
      });
    });
  });

  // ── TEST: CREATE TASK ─────────────────────
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title       : 'Test Task from Jest',
        description : 'This is a test task',
        priority    : 'high',
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.id).toBeDefined();

      // Save the ID for later tests
      createdTaskId = res.body.data.id;
    });

    it('should fail if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ priority: 'low' }); // No title!

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail if priority is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'urgent' }); // Invalid priority

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── TEST: GET TASK BY ID ──────────────────
  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(createdTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/api/tasks/fake-id-999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── TEST: UPDATE TASK ─────────────────────
  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({ title: 'Updated Task Title', status: 'in-progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Updated Task Title');
      expect(res.body.data.status).toBe('in-progress');
    });
  });

  // ── TEST: DELETE TASK ─────────────────────
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 after deletion', async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);

      expect(res.statusCode).toBe(404);
    });
  });

});