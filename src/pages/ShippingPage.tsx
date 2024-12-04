import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShippingPage() {
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
            <Truck className="h-6 w-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Shipping and Delivery Policy
            </h1>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Digital Service Delivery
              </h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  Routine Master is a fully digital service, designed to provide instant access 
                  to all features and functionality.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Upon successful signup and subscription, your account will be activated immediately
                  </li>
                  <li>
                    All premium features will be accessible instantly through your account
                  </li>
                  <li>
                    No physical products will be shipped as this is a digital-only service
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Activation Process
              </h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-2">
                <p>
                  The activation process is automatic and immediate. However, if you experience 
                  any delays or issues in accessing your premium features, please don't hesitate 
                  to contact our support team.
                </p>
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