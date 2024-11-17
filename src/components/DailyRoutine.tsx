import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Task } from '../types';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Navigation from './Navigation';
import { useAlarms } from '../lib/useAlarms';
import { Bell, BellOff } from 'lucide-react';

export default function DailyRoutine() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const auth = useAuth();

  const { activeAlarms, stopAlarm, stopAllAlarms } = useAlarms(tasks);

  useEffect(() => {
    let mounted = true;

    async function fetchTasks() {
      if (!auth?.currentUser?.uid) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const loadedTasks = await getTasks(today);
        if (mounted) {
          const sortedTasks = loadedTasks.sort((a, b) => a.time.localeCompare(b.time));
          setTasks(sortedTasks);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error loading tasks:', error);
          toast.error('Unable to load tasks. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (auth?.currentUser) {
      fetchTasks();
      // Refresh tasks at midnight
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const midnightTimeout = setTimeout(() => {
        fetchTasks();
      }, timeUntilMidnight);

      return () => {
        clearTimeout(midnightTimeout);
      };
    }

    return () => {
      mounted = false;
      stopAllAlarms();
    };
  }, [auth?.currentUser]);

  async function handleUpdateTask(task: Task) {
    if (!task.id) {
      toast.error('Invalid task data');
      return;
    }

    try {
      const { id, userId, ...updateData } = task;
      await updateTask(task.id, updateData);
      
      if (task.completed && !task.isRecurring) {
        // Remove completed one-time tasks from the list
        setTasks(prevTasks => 
          prevTasks.filter(t => t.id !== task.id)
            .sort((a, b) => a.time.localeCompare(b.time))
        );
      } else {
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === task.id ? { ...t, ...updateData } : t)
            .sort((a, b) => a.time.localeCompare(b.time))
        );
      }
      
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  }

  async function handleToggleTask(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      if (updatedTask.completed && !task.isRecurring) {
        // Remove completed one-time tasks immediately
        setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
      } else {
        setTasks(prevTasks =>
          prevTasks.map(t => t.id === task.id ? updatedTask : t)
        );
      }
      
      if (updatedTask.completed) {
        stopAlarm(task.id);
      }
      await handleUpdateTask(updatedTask);
    } catch (error) {
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? task : t)
      );
      toast.error('Failed to update task status');
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!taskId) {
      toast.error('Invalid task ID');
      return;
    }

    try {
      await deleteTask(taskId);
      stopAlarm(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  }

  function handleTaskAdded(newTask: Task) {
    setTasks(prevTasks => 
      [...prevTasks, newTask].sort((a, b) => a.time.localeCompare(b.time))
    );
    setShowTaskForm(false);
  }

  if (!auth?.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Please log in to manage your tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Navigation onNewTask={() => setShowTaskForm(true)} />
      
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="dark-card w-full max-w-md rounded-lg">
            <div className="p-6">
              <TaskForm 
                onTaskAdded={handleTaskAdded}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Today's Tasks</h2>
        <TaskList
          tasks={tasks}
          loading={loading}
          editingTask={editingTask}
          onEdit={setEditingTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
        />
      </div>

      {activeAlarms.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="dark-panel rounded-lg shadow-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-red-400 flex items-center gap-2">
                <Bell className="h-5 w-5 animate-pulse" />
                Active Alarms
              </h3>
              <button
                onClick={stopAllAlarms}
                className="text-gray-400 hover:text-gray-200"
                title="Stop all alarms"
              >
                <BellOff className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {activeAlarms.map(alarm => (
                <div key={alarm.taskId} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-200">{alarm.title}</span>
                  <button
                    onClick={() => stopAlarm(alarm.taskId)}
                    className="px-2 py-1 text-sm bg-red-900/50 text-red-300 rounded hover:bg-red-800/50"
                  >
                    Stop
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}