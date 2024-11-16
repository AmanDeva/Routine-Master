import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 
                 dark:from-gray-700 dark:to-gray-800 shadow-lg hover:shadow-xl
                 transition-all duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative w-14 h-7 rounded-full bg-white/50 dark:bg-gray-600/50 backdrop-blur-sm">
        <motion.div
          initial={false}
          animate={{
            x: theme === 'light' ? 2 : 28,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="absolute top-1 left-0 w-5 h-5 rounded-full 
                     bg-gradient-to-br from-primary-500 to-primary-600
                     dark:from-accent-purple dark:to-accent-pink
                     shadow-md"
        />
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <Sun className="h-4 w-4 text-amber-500" />
          <Moon className="h-4 w-4 text-indigo-300" />
        </div>
      </div>
    </motion.button>
  );
}