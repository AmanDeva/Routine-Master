import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 
                   hover:text-primary-500 dark:hover:text-primary-400 mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="h-6 w-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Pricing & Products
            </h1>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 
                          dark:from-primary-500/20 dark:to-primary-600/20 
                          border border-primary-200 dark:border-primary-500/30">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Monthly Subscription
              </h2>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹7</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-primary-500" />
                    Full access to all premium features
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-primary-500" />
                    1-month free trial for new users
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-primary-500" />
                    Advanced AI-powered tools
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-primary-500" />
                    Personalized schedules
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-primary-500" />
                    Productivity insights
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Free Trial Details
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                New users get to explore all premium features with a 1-month free trial. 
                Experience the full potential of Routine Master before committing to a subscription.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Why Choose Routine Master?
              </h3>
              <div className="text-gray-600 dark:text-gray-300 space-y-2">
                <p>
                  Our app is designed to enhance your productivity through intelligent task management 
                  and routine optimization. With advanced AI-powered tools, you'll be able to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create and manage daily routines effortlessly</li>
                  <li>Get personalized schedule recommendations</li>
                  <li>Track your productivity patterns</li>
                  <li>Set smart reminders and notifications</li>
                  <li>Access detailed productivity insights</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}