import { useState } from 'react'
import type { Note as NoteType } from '../types/Note'

interface NoteProps {
  note: NoteType;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  index: number;
  onPlay: (startTime: number, endTime: number) => void;
}

export function Note({ note, onEdit, onDelete, index, onPlay }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(note.content);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = () => {
    setEditValue(note.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(note.id, editValue);
    setIsEditing(false);
  };

  return (
    <div className="note-item">
      <div className="note-content">
        {isEditing ? (
          <div>
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleSave}
              autoFocus
              rows={3}
              style={{ width: '100%' }}
            />
            <div>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div 
            className="note-text" 
            onClick={handleEdit}
            style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
          >
            {note.content}
          </div>
        )}
        <p className="timestamp">
          {formatTime(note.startTime)} - {formatTime(note.endTime)}
        </p>
      </div>
      <div className="note-actions">
        <button onClick={() => onPlay(note.startTime, note.endTime)}>Play</button>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
} 