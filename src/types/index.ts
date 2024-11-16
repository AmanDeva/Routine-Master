export interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  userId: string;
  date: string;
  isRecurring: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}