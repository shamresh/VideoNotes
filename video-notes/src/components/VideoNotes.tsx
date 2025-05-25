import { useState, useCallback, useEffect } from 'react'
import type { Note } from '../types/Note'
import { Note as NoteComponent } from './Note'
import { VideoPlayer } from './VideoPlayer'
import { ScreenCapture } from './ScreenCapture'

interface VideoSession {
  id: string;
  videoId: string;
  notes: Note[];
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoNotes() {
  const [videoSessions, setVideoSessions] = useState<VideoSession[]>([
    {
      id: '1',
      videoId: 'dQw4w9WgXcQ',
      notes: [
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
      ]
    },
    {
      id: '2',
      videoId: 'iIToSVlFjBk',
      notes: [
        {
          id: '1',
          content: 'Introduction to the video',
          startTime: 0,
          endTime: 30
        },
        {
          id: '2',
          content: 'Main topic discussion',
          startTime: 30,
          endTime: 120
        }
      ]
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('1');
  const [videoDuration, setVideoDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<((time: number) => void) | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState(0);
  const [selectedEndTime, setSelectedEndTime] = useState(0);

  const showScreenCapture = import.meta.env.VITE_SHOW_SCREEN_CAPTURE === 'true';
  const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development';

  const currentSession = videoSessions.find(session => session.id === currentSessionId);

  // Reset time selection when session changes
  useEffect(() => {
    if (currentSession) {
      setSelectedStartTime(0);
      setSelectedEndTime(0);
    }
  }, [currentSessionId]);

  const handleDeleteNote = (id: string) => {
    setVideoSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? {
            ...session,
            notes: session.notes.filter(note => note.id !== id)
          }
        : session
    ));
  };

  const handleEditNote = (id: string, content: string) => {
    setVideoSessions(prev => prev.map(session =>
      session.id === currentSessionId
        ? {
            ...session,
            notes: session.notes.map(note =>
              note.id === id ? { ...note, content } : note
            )
          }
        : session
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
    if (!currentSession) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: 'New Note',
      startTime: selectedStartTime,
      endTime: selectedEndTime
    };
    
    setVideoSessions(prev => prev.map(session =>
      session.id === currentSessionId
        ? {
            ...session,
            notes: [...session.notes, newNote].sort((a, b) => a.startTime - b.startTime)
          }
        : session
    ));
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
    console.log('Recording completed, blob size:', blob.size);
  };

  const handleSessionChange = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // Reset video states when switching sessions
    setVideoDuration(0);
    setSelectedStartTime(0);
    setSelectedEndTime(0);
    setSeekTo(null);
  };

  if (!currentSession) return null;

  return (
    <div className="video-notes">
      <div className="session-selector" style={{ marginBottom: '1rem' }}>
        <select 
          value={currentSessionId} 
          onChange={(e) => handleSessionChange(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        >
          {videoSessions.map(session => (
            <option key={session.id} value={session.id}>
              Video Session {session.id}
            </option>
          ))}
        </select>
      </div>
      <div className="video-section">
        <VideoPlayer
          videoId={currentSession.videoId}
          onDurationChange={handleDurationChange}
          onTimeChange={handleSeekToChange}
          videoDuration={videoDuration}
          onTimeRangeChange={handleTimeRangeChange}
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
        />
        {showScreenCapture && (
          <div style={{ marginTop: '20px' }}>
            <h2>Screen Capture Section</h2>
            <ScreenCapture onRecordingComplete={handleRecordingComplete} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button className="create-note-button" onClick={handleCreateNote}>
          Create Note
        </button>
      </div>
      <div className="notes-container">
        <h2>Notes for Video {currentSession.id}</h2>
        {currentSession.notes.map((note) => (
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