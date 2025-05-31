import { Router, Request, Response } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} from '../services/noteService';

const router = Router();

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get('/', (req: Request, res: Response) => {
  const notes = getAllNotes();
  res.json(notes);
});

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes by text
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search text to find in note title or content
 *     responses:
 *       200:
 *         description: List of matching notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get('/search', (req: Request, res: Response) => {
  const searchText = req.query.q as string;
  if (!searchText) {
    return res.status(400).json({ message: 'Search query parameter "q" is required' });
  }
  const notes = searchNotes(searchText);
  res.json(notes);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const note = getNoteById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteDto'
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid input
 */
router.post('/', (req: Request, res: Response) => {
  const { title, content, startTime, endTime } = req.body;
  if (!title || !content || startTime === undefined || endTime === undefined) {
    return res.status(400).json({ message: 'Title, content, startTime, and endTime are required' });
  }
  const newNote = createNote({ title, content, startTime, endTime });
  res.status(201).json(newNote);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteDto'
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.put('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { title, content, startTime, endTime } = req.body;
  const updatedNote = updateNote(req.params.id, { title, content, startTime, endTime });
  if (!updatedNote) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(updatedNote);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       204:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  const success = deleteNote(req.params.id);
  if (!success) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.status(204).send();
});

export default router; 