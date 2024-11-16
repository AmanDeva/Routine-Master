import React, { useState } from 'react';
import { Menu, X, Calendar, Plus, LogOut, Settings, User, Bell, BellOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAlarmSettings } from '../contexts/AlarmContext';
import CalendarView from './Calendar';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  onNewTask: () => void;
}

export default function Navigation({ onNewTask }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const auth = useAuth();
  const { alarmsEnabled, toggleAlarms } = useAlarmSettings();
  const userName = auth?.currentUser?.displayName || 'User';

  return (
    <>
      {/* Overlay */}
      {(isOpen || showCalendar) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            setIsOpen(false);
            setShowCalendar(false);
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Routine Master
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <User className="h-5 w-5" />
            <span className="font-medium">{userName}</span>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CalendarView />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg 
                      transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{userName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {auth?.currentUser?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                onNewTask();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Task
            </button>

            <button
              onClick={() => {
                setShowCalendar(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Calendar className="h-5 w-5" />
              View Calendar
            </button>

            <button
              onClick={() => {
                toggleAlarms();
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full p-3 text-left text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                {alarmsEnabled ? (
                  <Bell className="h-5 w-5" />
                ) : (
                  <BellOff className="h-5 w-5" />
                )}
                <span>Task Alarms</span>
              </div>
              <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                alarmsEnabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                  alarmsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </button>

            <Link
              to="/profile"
              className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-5 w-5" />
              Profile Settings
            </Link>

            <button
              onClick={() => {
                auth?.logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}