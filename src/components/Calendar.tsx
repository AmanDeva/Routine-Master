import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isFuture, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2, Clock, Check, X } from 'lucide-react';
import { Task } from '../types';
import { getTasks, deleteTask, updateTask } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTasks() {
      try {
        setLoading(true);
        const monthStr = format(currentDate, 'yyyy-MM');
        const fetchedTasks = await getTasks(monthStr);
        
        if (isMounted) {
          // Filter out recurring tasks
          const nonRecurringTasks = fetchedTasks.filter(task => !task.isRecurring);
          setTasks(nonRecurringTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        if (isMounted) {
          toast.error('Unable to load tasks');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingTaskId(taskId);
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setSelectedTask(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await updateTask(task.id, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task uncompleted');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div className="glass-effect rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold dark:text-gray-100">One-time Tasks</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-medium dark:text-gray-200">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}

          {daysInMonth.map(date => {
            const dayTasks = getTasksForDay(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);
            const isFutureDay = isFuture(startOfDay(date));

            return (
              <div
                key={date.toString()}
                className={`min-h-[80px] p-1 border dark:border-purple-300/10 ${
                  !isCurrentMonth ? 'dark:bg-gray-800/30' : 'dark:bg-gray-800/50'
                } ${isCurrentDay ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className={`text-right text-sm mb-1 ${
                  isCurrentMonth ? 'dark:text-gray-200' : 'text-gray-500'
                }`}>
                  {format(date, 'd')}
                </div>
                {dayTasks.length > 0 && (
                  <div className="space-y-1">
                    {dayTasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={`group relative text-xs p-2 rounded transition-colors cursor-pointer
                          ${task.completed 
                            ? 'bg-green-900/30 text-green-200 hover:bg-green-800/40'
                            : 'bg-indigo-900/30 text-indigo-200 hover:bg-indigo-800/40'
                          }`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex justify-between items-center gap-1">
                          <span className="truncate flex-1" title={task.title}>
                            {task.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            disabled={deletingTaskId === task.id}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-700/50 rounded ${
                              deletingTaskId === task.id ? 'cursor-not-allowed' : ''
                            }`}
                            title="Delete task"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-indigo-300 mt-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTime(task.time)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-4 text-gray-400">
            Loading tasks...
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No one-time tasks scheduled
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="dark-card w-full max-w-md rounded-lg p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{selectedTask.title}</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(selectedTask.time)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleTask(selectedTask)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                      selectedTask.completed
                        ? 'bg-green-900/30 text-green-200 hover:bg-green-800/40'
                        : 'bg-indigo-900/30 text-indigo-200 hover:bg-indigo-800/40'
                    }`}
                  >
                    {selectedTask.completed ? (
                      <>
                        <Check className="h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    disabled={deletingTaskId === selectedTask.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-900/30 text-red-200 hover:bg-red-800/40 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}