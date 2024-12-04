import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Bell, CheckCircle2, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export default function IntroductionPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary-500" />,
      title: "Daily Routine Management",
      description: "Create, update, and organize your daily routines with ease. Recurrent tasks are automatically saved and displayed daily."
    },
    {
      icon: <Clock className="h-6 w-6 text-accent-orange" />,
      title: "One-Time Task Management",
      description: "Add tasks with specific deadlines, visualize them on an interactive calendar, and stay on top of your schedule."
    },
    {
      icon: <Bell className="h-6 w-6 text-accent-purple" />,
      title: "Intelligent Alarms",
      description: "Set alarms for both routines and one-time tasks. Enjoy customizable tones and snooze options to match your preferences."
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-accent-teal" />,
      title: "User Authentication",
      description: "Secure sign-in with email/password using Firebase Authentication. Also support OAuth for Google."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-purple dark:from-primary-400 dark:to-accent-purple bg-clip-text text-transparent">
            Welcome to Routine Master
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your daily routine into a productivity powerhouse. Stay organized, focused, and accomplish more with our intelligent task management system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
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
          className="text-center"
        >
          <button
            onClick={() => navigate('/auth')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-purple 
                     hover:from-primary-600 hover:to-accent-purple/90
                     text-white rounded-xl text-lg font-semibold
                     transform transition-all duration-300
                     hover:scale-105 focus:outline-none focus:ring-2 
                     focus:ring-primary-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-900"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
            Pricing Details
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-600 dark:text-gray-300 text-center">
            <p className="text-lg">
              <span className="text-accent-purple font-bold">₹</span> 7 per month after a 1-month free trial.
            </p>
            <p>No hidden charges.</p>
            <p>Supports UPI, cards, and net banking for payments.</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Why Choose Routine Master?
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              In today's fast-paced world, staying organized is key to success. Routine Master helps you take control of your time and boost your productivity with smart features designed around your needs.
            </p>
            <p>
              Whether you're a student, professional, or anyone looking to optimize their daily routine, our app provides the perfect balance of simplicity and functionality.
            </p>
            <p>
              Start your journey to enhanced productivity today with our 30-day free trial!
            </p>
          </div>
        </div>

        <footer className="mt-24 border-t border-gray-200 dark:border-gray-700 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/policies" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/policies" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/policies" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Products & Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Pricing & Products
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Shipping and Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/cancellation" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Cancellation and Refund
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/policies" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/policies" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/policies" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Contact Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary-500 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    devaaman8@gmail.com
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-500 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    +91 9026425459
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Rafiganj, Aurangabad<br />
                    Bihar 824125
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Routine Master. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}