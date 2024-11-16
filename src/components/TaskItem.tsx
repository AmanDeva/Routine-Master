import React from 'react';
import { Edit2, Trash2, Save, X, Clock, Repeat, Calendar, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  editingTask: Task | null;
  onEdit: (task: Task | null) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggle: (task: Task) => void;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
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

export default function TaskItem({
  task,
  editingTask,
  onEdit,
  onUpdate,
  onDelete,
  onToggle
}: TaskItemProps) {
  const [period, setPeriod] = React.useState(() => {
    if (editingTask?.id === task.id) {
      return convertTo12Hour(editingTask.time).period;
    }
    return 'AM';
  });

  const taskItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (editingTask?.id === task.id) {
    const { time } = convertTo12Hour(editingTask.time);
    return (
      <motion.div 
        variants={taskItemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass-card space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => onEdit({ ...editingTask, title: e.target.value })}
            className="input-primary"
            maxLength={100}
            placeholder="Task title"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => onEdit({ 
                ...editingTask, 
                time: convertTo24Hour(e.target.value, period)
              })}
              className="flex-1 input-primary"
            />
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                onEdit({
                  ...editingTask,
                  time: convertTo24Hour(time, e.target.value)
                });
              }}
              className="input-primary w-24"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUpdate(editingTask)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-dark to-success text-white rounded-xl"
          >
            <Save className="h-4 w-4" />
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl"
          >
            <X className="h-4 w-4" />
            Cancel
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={taskItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="task-item p-4 group"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(task)}
            className={`p-1 rounded-full transition-all duration-300 ${
              task.completed 
                ? 'text-success hover:text-success-dark' 
                : 'text-gray-400 hover:text-primary-500'
            }`}
          >
            <CheckCircle2 
              className={`h-6 w-6 ${task.completed ? 'fill-current' : ''}`}
            />
          </motion.button>
          <div className={`transition-all duration-300 ${task.completed ? 'opacity-50' : ''}`}>
            <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(task.time)}
              </span>
              {task.isRecurring ? (
                <span className="flex items-center gap-1 gradient-text from-accent-purple to-accent-pink">
                  <Repeat className="h-4 w-4" />
                  Daily
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(task.date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="icon-button text-gray-600 hover:text-primary-600 hover:bg-primary-50"
            aria-label="Edit task"
          >
            <Edit2 className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="icon-button text-gray-600 hover:text-error hover:bg-error-light/20"
            aria-label="Delete task"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}