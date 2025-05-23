import React, { useState } from 'react'
import type { Note } from './types/Note'
import './App.css'

function App() {
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
    <div className="app">
      <h1>React Video Notes</h1>
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
          <div key={note.id} className="note-item">
            <div className="note-content">
              <p>{note.content}</p>
              <p className="timestamp">
                {Math.floor(note.startTime / 60)}:{(note.startTime % 60).toString().padStart(2, '0')} - 
                {Math.floor(note.endTime / 60)}:{(note.endTime % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <div className="note-actions">
              <button onClick={() => handleAddNote(index)}>Add</button>
              <button onClick={() => handleEditNote(note.id, prompt('Edit note:', note.content) || note.content)}>
                Edit
              </button>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
