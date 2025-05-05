export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  tags?: string[];
  status: 'Non Started' | 'In Progress' | 'Paused' | 'Late' | 'Finished';
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}
