import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  editingTask: Task | null;
  onEdit: (task: Task | null) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggle: (task: Task) => void;
}

export default function TaskList({
  tasks,
  loading,
  editingTask,
  onEdit,
  onUpdate,
  onDelete,
  onToggle
}: TaskListProps) {
  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center py-4">No tasks scheduled for today</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 border rounded-lg transition-colors ${
            task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
          }`}
        >
          <TaskItem
            task={task}
            editingTask={editingTask}
            onEdit={onEdit}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
}