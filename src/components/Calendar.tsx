import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isFuture, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { getTasks, deleteTask } from '../lib/firebase';
import { toast } from 'react-hot-toast';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTasks() {
      try {
        setLoading(true);
        const monthStr = format(currentDate, 'yyyy-MM');
        const fetchedTasks = await getTasks(monthStr);
        
        if (isMounted) {
          setTasks(fetchedTasks);
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
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Upcoming One-time Tasks</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
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
              className={`min-h-[80px] p-1 border border-gray-100 ${
                !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-right text-sm mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {format(date, 'd')}
              </div>
              {dayTasks.length > 0 && isFutureDay && (
                <div className="space-y-1">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className="group relative text-xs p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex justify-between items-center gap-1">
                        <span className="truncate flex-1" title={task.title}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deletingTaskId === task.id}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-200 rounded ${
                            deletingTaskId === task.id ? 'cursor-not-allowed' : ''
                          }`}
                          title="Delete task"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-[10px] text-blue-600 mt-0.5">
                        {formatTime(task.time)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">
          Loading tasks...
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No upcoming one-time tasks scheduled
        </div>
      )}
    </div>
  );
}