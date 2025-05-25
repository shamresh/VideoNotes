import { useState } from 'react'
import type { Note as NoteType } from '../types/Note'
import { RichTextEditor } from './RichTextEditor'

interface NoteProps {
  note: NoteType;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  index: number;
  onPlay: (startTime: number, endTime: number) => void;
}

export function Note({ note, onEdit, onDelete, index, onPlay }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (content: string) => {
    onEdit(note.id, content);
    setIsEditing(false);
  };

  return (
    <div className="note-item">
      <div className="note-content">
        {isEditing ? (
          <RichTextEditor
            content={note.content}
            onChange={handleSave}
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <div 
            className="note-text" 
            dangerouslySetInnerHTML={{ __html: note.content }}
            onClick={handleEdit}
          />
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