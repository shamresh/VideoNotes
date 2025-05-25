import request from 'supertest';
import express from 'express';
import noteRoutes from '../routes/noteRoutes';
import { createNote, deleteNote } from '../services/noteService';

const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

describe('Note API Endpoints', () => {
  let testNoteId: string;

  // Clean up after all tests
  afterAll(() => {
    if (testNoteId) {
      deleteNote(testNoteId);
    }
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note'
      };

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(noteData.title);
      expect(response.body.content).toBe(noteData.content);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      testNoteId = response.body.id;
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ content: 'This is a test note' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a specific note', async () => {
      const response = await request(app)
        .get(`/api/notes/${testNoteId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id', testNoteId);
    });

    it('should return 404 for non-existent note', async () => {
      await request(app)
        .get('/api/notes/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const updateData = {
        title: 'Updated Test Note',
        content: 'This is an updated test note'
      };

      const response = await request(app)
        .put(`/api/notes/${testNoteId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    it('should return 404 for non-existent note', async () => {
      await request(app)
        .put('/api/notes/nonexistent')
        .send({ title: 'Updated Note' })
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      await request(app)
        .delete(`/api/notes/${testNoteId}`)
        .expect(204);
    });

    it('should return 404 for non-existent note', async () => {
      await request(app)
        .delete('/api/notes/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
}); 