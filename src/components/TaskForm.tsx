import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createTask } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface TaskFormProps {
  onTaskAdded: (task: any) => void;
  onCancel: () => void;
}

function convertTo24Hour(time: string, period: string): string {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
}

function convertTo12Hour(time: string): { time: string; period: string } {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  let period = 'AM';
  
  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  } else if (hour === 0) {
    hour = 12;
  }
  
  return {
    time: `${hour.toString().padStart(2, '0')}:${minutes}`,
    period
  };
}

export default function TaskForm({ onTaskAdded, onCancel }: TaskFormProps) {
  const [newTask, setNewTask] = useState({ 
    title: '', 
    time: '', 
    date: new Date().toISOString().split('T')[0],
    isRecurring: false 
  });
  const [period, setPeriod] = useState('AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth?.currentUser?.uid) {
      toast.error('Please log in to add tasks');
      return;
    }

    if (!newTask.title.trim() || !newTask.time) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        title: newTask.title.trim(),
        time: convertTo24Hour(newTask.time, period),
        completed: false,
        date: newTask.date,
        isRecurring: newTask.isRecurring
      };

      const createdTask = await createTask(taskData);
      onTaskAdded(createdTask);
      setNewTask({ title: '', time: '', date: new Date().toISOString().split('T')[0], isRecurring: false });
      setPeriod('AM');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Task creation error:', error);
      toast.error('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, time: e.target.value });
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Task</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100
                     border border-gray-300 dark:border-gray-600 
                     rounded-md focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent placeholder-gray-400 
                     dark:placeholder-gray-500"
            placeholder="Enter task title"
            maxLength={100}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              value={newTask.time}
              onChange={handleTimeChange}
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       border border-gray-300 dark:border-gray-600 
                       rounded-md focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
              disabled={isSubmitting}
            />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       border border-gray-300 dark:border-gray-600 
                       rounded-md focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {!newTask.isRecurring && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={newTask.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       border border-gray-300 dark:border-gray-600 
                       rounded-md focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isRecurring"
            checked={newTask.isRecurring}
            onChange={(e) => setNewTask({ ...newTask, isRecurring: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 
                     text-blue-600 focus:ring-blue-500 
                     dark:bg-gray-800 dark:checked:bg-blue-500"
          />
          <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
            Repeat daily
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                     bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 
                     text-gray-700 dark:text-gray-300 rounded-md 
                     hover:bg-gray-200 dark:hover:bg-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 
                     focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                     transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}