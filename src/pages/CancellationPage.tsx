import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Mail, Phone, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CancellationPage() {
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
            <RotateCcw className="h-6 w-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Cancellation and Refund Policy
            </h1>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Cancellation Policy
              </h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We want to ensure you have complete control over your subscription. Here's what 
                  you need to know about cancellations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    You can cancel your subscription at any time before the current billing cycle ends
                  </li>
                  <li>
                    To cancel, simply visit the subscription section in your app settings
                  </li>
                  <li>
                    Follow the cancellation prompts to complete the process
                  </li>
                  <li>
                    Your access to premium features will continue until the end of your current 
                    billing period
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Refund Policy
              </h2>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div className="text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium">Important Note</p>
                    <p className="mt-1 text-sm">
                      Due to the nominal subscription fee of INR 7, we do not offer refunds once 
                      a payment has been processed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-2">
                <p>
                  However, we understand that technical issues may arise. If you're experiencing 
                  problems accessing our service:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Contact our support team immediately
                  </li>
                  <li>
                    We will investigate the issue promptly
                  </li>
                  <li>
                    Our team will work to resolve any technical problems preventing access to the service
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Mail className="h-5 w-5 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">devaaman8@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Phone className="h-5 w-5 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+91 9026425459</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}