import React, { useState } from 'react';
import { Menu, X, Calendar, Plus, LogOut, Settings, User, Bell, BellOff, Shield, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAlarmSettings } from '../contexts/AlarmContext';
import CalendarView from './Calendar';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

interface NavigationProps {
  onNewTask: () => void;
}

export default function Navigation({ onNewTask }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const auth = useAuth();
  const { alarmsEnabled, toggleAlarms } = useAlarmSettings();
  const userName = auth?.currentUser?.displayName || 'User';

  const iconButtonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const menuIconClass = "transition-colors duration-300 w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400";
  const menuItemClass = "flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 group";

  return (
    <>
      {(isOpen || showCalendar) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            setIsOpen(false);
            setShowCalendar(false);
          }}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <motion.button
            variants={iconButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 group"
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Calendar className="h-8 w-8 text-primary-500 dark:text-primary-400" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              Routine Master
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <User className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            <span className="font-medium">{userName}</span>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="p-4">
              <div className="flex justify-end">
                <motion.button
                  variants={iconButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowCalendar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>
              <CalendarView />
            </div>
          </motion.div>
        </div>
      )}

      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg 
                      transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>

          <div className="mb-6 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600 rounded-full shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{userName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {auth?.currentUser?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                onNewTask();
                setIsOpen(false);
              }}
              className={menuItemClass}
            >
              <Plus className={menuIconClass} />
              Add New Task
            </motion.button>

            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setShowCalendar(true);
                setIsOpen(false);
              }}
              className={menuItemClass}
            >
              <Calendar className={menuIconClass} />
              View Calendar
            </motion.button>

            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                toggleAlarms();
                setIsOpen(false);
              }}
              className={menuItemClass}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {alarmsEnabled ? (
                    <Bell className={`${menuIconClass} ${alarmsEnabled ? 'animate-pulse' : ''}`} />
                  ) : (
                    <BellOff className={menuIconClass} />
                  )}
                  <span>Task Alarms</span>
                </div>
                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  alarmsEnabled ? 'bg-primary-500 dark:bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <motion.div
                    animate={{ x: alarmsEnabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                  />
                </div>
              </div>
            </motion.button>

            <Link
              to="/subscription"
              className={menuItemClass}
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className={menuIconClass} />
              Subscription
            </Link>

            <Link
              to="/profile"
              className={menuItemClass}
              onClick={() => setIsOpen(false)}
            >
              <Settings className={`${menuIconClass} group-hover:rotate-90 transition-transform duration-300`} />
              Profile Settings
            </Link>

            <Link
              to="/policies"
              className={menuItemClass}
              onClick={() => setIsOpen(false)}
            >
              <Shield className={menuIconClass} />
              Policies & Terms
            </Link>

            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                auth?.logout();
                setIsOpen(false);
              }}
              className={`${menuItemClass} hover:bg-red-50 dark:hover:bg-red-900/20`}
            >
              <LogOut className={`${menuIconClass} group-hover:text-red-500 dark:group-hover:text-red-400`} />
              <span className="group-hover:text-red-500 dark:group-hover:text-red-400">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}