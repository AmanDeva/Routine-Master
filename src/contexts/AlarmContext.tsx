import React, { createContext, useContext, useState, useEffect } from 'react';

interface AlarmContextType {
  alarmsEnabled: boolean;
  toggleAlarms: () => void;
}

const AlarmContext = createContext<AlarmContextType | null>(null);

export function useAlarmSettings() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarmSettings must be used within an AlarmProvider');
  }
  return context;
}

export function AlarmProvider({ children }: { children: React.ReactNode }) {
  const [alarmsEnabled, setAlarmsEnabled] = useState(() => {
    const stored = localStorage.getItem('alarmsEnabled');
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem('alarmsEnabled', JSON.stringify(alarmsEnabled));
  }, [alarmsEnabled]);

  const toggleAlarms = () => {
    setAlarmsEnabled(prev => !prev);
  };

  return (
    <AlarmContext.Provider value={{ alarmsEnabled, toggleAlarms }}>
      {children}
    </AlarmContext.Provider>
  );
}