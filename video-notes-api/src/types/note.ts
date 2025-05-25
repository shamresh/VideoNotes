export interface Note {
  id: string;
  title: string;
  content: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  startTime: number;
  endTime: number;
}

export type UpdateNoteDto = Partial<CreateNoteDto>; 