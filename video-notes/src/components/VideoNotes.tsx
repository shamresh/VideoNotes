import { useState, useCallback } from 'react'
import type { Note } from '../types/Note'
import { Note as NoteComponent } from './Note'
import { VideoPlayer } from './VideoPlayer'

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
  const [videoDuration, setVideoDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<((time: number) => void) | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState(0);
  const [selectedEndTime, setSelectedEndTime] = useState(0);

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

  const handleTimeChange = useCallback((startTime: number, endTime: number) => {
    if (seekTo) {
      seekTo(startTime);
    }
  }, [seekTo]);

  const handleDurationChange = useCallback((duration: number) => {
    setVideoDuration(duration);
  }, []);

  const handleSeekToChange = useCallback((newSeekTo: (time: number) => void) => {
    setSeekTo(() => newSeekTo);
  }, []);

  const handleTimeRangeChange = (startTime: number, endTime: number) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: 'New Note',
      startTime: selectedStartTime,
      endTime: selectedEndTime
    };
    const updatedNotes = [...notes, newNote];

    updatedNotes.sort((a, b) => a.startTime - b.startTime);
  
    setNotes(updatedNotes);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-notes">
      <div className="video-section">
        <VideoPlayer
          videoId="dQw4w9WgXcQ"
          onDurationChange={handleDurationChange}
          onTimeChange={handleSeekToChange}
          videoDuration={videoDuration}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button className="create-note-button" onClick={handleCreateNote}>
          Create Note
        </button>
      </div>
      <div className="notes-container">
        <h2>Notes</h2>
        {notes.map((note, index) => (
          <NoteComponent
            key={note.id}
            note={{ ...note, startTime: note.startTime, endTime: note.endTime }}
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