import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Bell, CheckCircle, ArrowRight } from 'lucide-react';

export default function IntroductionPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-primary-500" />,
      title: "Daily Routine Management",
      description: "Easily create, update, and organize your daily routines. Recurrent tasks are saved and displayed automatically."
    },
    {
      icon: <Clock className="h-8 w-8 text-accent-orange" />,
      title: "One-Time Task Management",
      description: "Add tasks with specific deadlines, visualize them on a sleek calendar, and stay on track effortlessly."
    },
    {
      icon: <Bell className="h-8 w-8 text-accent-purple" />,
      title: "Smart Alarms",
      description: "Set customizable alarms for routines and one-time tasks. Enjoy snooze options tailored to your preferences."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-accent-teal" />,
      title: "Secure Authentication",
      description: "Log in safely using Firebase Authentication. Also support Google login."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-purple-950">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary-600 to-accent-purple dark:from-primary-400 dark:to-accent-purple bg-clip-text text-transparent tracking-tight">
            Welcome to Routine Master
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empower your day with smarter task management. Organize, focus, and achieve more using our intuitive productivity tool.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-6 shadow-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white/70 to-gray-100/50 dark:from-gray-800/70 dark:to-gray-700/50"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div>{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-500 to-accent-purple text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            Pricing Details
          </h2>
          <div className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              <span className="text-accent-purple font-extrabold text-2xl">₹7</span> per month after a 1-month free trial.
            </p>
            <p>No hidden charges.</p>
            <p>Supports UPI, cards, and net banking for payments.</p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Why Choose Routine Master?
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              In today's fast-paced world, staying organized is essential. Routine Master gives you control over your time and boosts your productivity with features designed for convenience and efficiency.
            </p>
            <p>
              Whether you're a student, professional, or anyone looking to optimize their schedule, our app combines simplicity and functionality to help you succeed.
            </p>
            <p>
              Start your journey toward enhanced productivity today. Try our 30-day free trial and see the difference!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
