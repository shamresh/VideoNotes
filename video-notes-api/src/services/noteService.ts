import fs from 'fs';
import path from 'path';
import { Note, CreateNoteDto, UpdateNoteDto } from '../types/note';

const DATA_FILE = path.join(__dirname, '../../data/notes.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const readNotes = (): Note[] => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeNotes = (notes: Note[]): void => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
};

export const getAllNotes = (): Note[] => {
  return readNotes();
};

export const getNoteById = (id: string): Note | undefined => {
  const notes = readNotes();
  return notes.find(note => note.id === id);
};

export const createNote = (noteData: CreateNoteDto): Note => {
  const notes = readNotes();
  const newNote: Note = {
    id: Date.now().toString(),
    ...noteData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  writeNotes(notes);
  return newNote;
};

export const updateNote = (id: string, noteData: UpdateNoteDto): Note | undefined => {
  const notes = readNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return undefined;

  const updatedNote = {
    ...notes[noteIndex],
    ...noteData,
    updatedAt: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;
  writeNotes(notes);
  return updatedNote;
};

export const deleteNote = (id: string): boolean => {
  const notes = readNotes();
  const initialLength = notes.length;
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === initialLength) return false;
  
  writeNotes(filteredNotes);
  return true;
}; 