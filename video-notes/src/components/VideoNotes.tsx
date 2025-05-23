import { useState } from 'react'
import type { Note } from '../types/Note'
import { Note as NoteComponent } from './Note'

export function VideoNotes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Introduction to React',
      startTime: 0,
      endTime: 120
    },
    {
      id: '2',
      content: 'Components and Props',
      startTime: 120,
      endTime: 240
    }
  ]);

  const handleAddNote = (index: number) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: 'New Note',
      startTime: 0,
      endTime: 0
    };
    const newNotes = [...notes];
    newNotes.splice(index + 1, 0, newNote);
    setNotes(newNotes);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  return (
    <div className="video-notes">
      <div className="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="notes-container">
        <h2>Notes</h2>
        {notes.map((note, index) => (
          <NoteComponent
            key={note.id}
            note={note}
            index={index}
            onAdd={handleAddNote}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  );
} 