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

  // Initialize alarm system
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
          // Sort tasks by time
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
      
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? { ...t, ...updateData } : t)
          .sort((a, b) => a.time.localeCompare(b.time))
      );
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
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <TaskForm 
                onTaskAdded={handleTaskAdded}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
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
          <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-red-600 flex items-center gap-2">
                <Bell className="h-5 w-5 animate-pulse" />
                Active Alarms
              </h3>
              <button
                onClick={stopAllAlarms}
                className="text-gray-500 hover:text-gray-700"
                title="Stop all alarms"
              >
                <BellOff className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {activeAlarms.map(alarm => (
                <div key={alarm.taskId} className="flex items-center justify-between gap-4">
                  <span className="text-sm">{alarm.title}</span>
                  <button
                    onClick={() => stopAlarm(alarm.taskId)}
                    className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
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