import { useState, useCallback } from 'react'
import type { Note } from '../types/Note'
import { Note as NoteComponent } from './Note'
import { VideoPlayer } from './VideoPlayer'
import { ScreenCapture } from './ScreenCapture'

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
      content: 'Risk Astley shuffle',
      startTime: 77,
      endTime: 120
    },
    {
      id: '2',
      content: 'Components and Props',
      startTime: 120,
      endTime: 140
    },
    {
        id: '3',
        content: 'Back flip dude',
        startTime: 146,
        endTime: 159
    }
  ]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<((time: number) => void) | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState(0);
  const [selectedEndTime, setSelectedEndTime] = useState(0);

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

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

  const playNote = (startTime: number, endTime: number) => {
    console.log('playNote called with:', startTime, endTime);
    if (seekTo) {
      seekTo(startTime);
    }
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  };

  const handleRecordingComplete = (blob: Blob) => {
    // You can handle the recorded video blob here
    // For example, you could save it to a file or upload it to a server
    console.log('Recording completed, blob size:', blob.size);
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
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
        />
        <ScreenCapture onRecordingComplete={handleRecordingComplete} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button className="create-note-button" onClick={handleCreateNote}>
          Create Note
        </button>
      </div>
      <div className="notes-container">
        <h2>Notes</h2>
        {notes.map((note) => (
          <NoteComponent
            key={note.id}
            note={{ ...note, startTime: note.startTime, endTime: note.endTime }}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onPlay={playNote}
          />
        ))}
      </div>
    </div>
  );
} 