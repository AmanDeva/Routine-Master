import { useEffect, useRef, useState } from 'react';
import { Task } from '../types';
import { useAlarmSettings } from '../contexts/AlarmContext';

interface ActiveAlarm {
  taskId: string;
  title: string;
  intervalId: number;
  startTime: number;
}

export function useAlarms(tasks: Task[]) {
  const audioRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [activeAlarms, setActiveAlarms] = useState<ActiveAlarm[]>([]);
  const { alarmsEnabled } = useAlarmSettings();

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    return () => {
      stopAllAlarms();
      if (audioRef.current) {
        audioRef.current.close();
      }
    };
  }, []);

  const stopAlarm = (taskId: string) => {
    setActiveAlarms(prev => {
      const alarmToStop = prev.find(a => a.taskId === taskId);
      if (alarmToStop) {
        clearInterval(alarmToStop.intervalId);
      }
      return prev.filter(alarm => alarm.taskId !== taskId);
    });
  };

  const stopAllAlarms = () => {
    activeAlarms.forEach(alarm => {
      clearInterval(alarm.intervalId);
    });
    setActiveAlarms([]);
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const startAlarm = (task: Task) => {
    if (!alarmsEnabled) return;
    
    if (!audioRef.current) {
      audioRef.current = new AudioContext();
    }

    // Check if alarm is already active for this task
    if (activeAlarms.some(alarm => alarm.taskId === task.id)) {
      return;
    }

    const oscillator = audioRef.current.createOscillator();
    const gainNode = audioRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioRef.current.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioRef.current.destination);
    
    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Create beeping pattern
    const intervalId = window.setInterval(() => {
      const currentTime = audioRef.current!.currentTime;
      gainNode.gain.setValueAtTime(1, currentTime);
      gainNode.gain.setValueAtTime(0, currentTime + 0.1);
    }, 200);

    // Add to active alarms
    setActiveAlarms(prev => [...prev, {
      taskId: task.id,
      title: task.title,
      intervalId,
      startTime: Date.now()
    }]);

    // Auto-stop after 2 minutes
    setTimeout(() => {
      stopAlarm(task.id);
    }, 120000); // 2 minutes in milliseconds
  };

  const showNotification = (task: Task) => {
    if (!alarmsEnabled) return;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: `Time to do: ${task.title}`,
        icon: '/notification-icon.png',
        badge: '/notification-badge.png',
        vibrate: [200, 100, 200],
        actions: [
          { action: 'stop', title: 'Stop Alarm' }
        ]
      });
    }
  };

  useEffect(() => {
    if (!alarmsEnabled) {
      stopAllAlarms();
      return;
    }

    const checkTasks = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const currentDate = now.toISOString().split('T')[0];

      tasks.forEach(task => {
        if (!task.completed && 
            (task.isRecurring || task.date === currentDate) && 
            task.time === currentTime) {
          startAlarm(task);
          showNotification(task);
        }
      });
    };

    const interval = setInterval(checkTasks, 60000);
    checkTasks();

    return () => clearInterval(interval);
  }, [tasks, alarmsEnabled]);

  return { activeAlarms, stopAlarm, stopAllAlarms };
}