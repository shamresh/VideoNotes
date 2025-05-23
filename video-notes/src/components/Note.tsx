import type { Note as NoteType } from '../types/Note'

interface NoteProps {
  note: NoteType;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onAdd: (index: number) => void;
  index: number;
}

export function Note({ note, onEdit, onDelete, onAdd, index }: NoteProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="note-item">
      <div className="note-content">
        <p>{note.content}</p>
        <p className="timestamp">
          {formatTime(note.startTime)} - {formatTime(note.endTime)}
        </p>
      </div>
      <div className="note-actions">
        <button onClick={() => onAdd(index)}>Add</button>
        <button onClick={() => onEdit(note.id, prompt('Edit note:', note.content) || note.content)}>
          Edit
        </button>
        <button onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
} 