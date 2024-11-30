import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 
                   hover:text-primary-500 dark:hover:text-primary-400 mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Policies & Terms
              </h1>
            </div>

            <div className="space-y-8">
              {/* Terms and Conditions */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Terms and Conditions
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <h3 className="font-medium mb-2">User Agreements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>By signing up, users agree to the terms outlined here</li>
                      <li>Free trial for one month, followed by INR 7 monthly subscription</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Usage Restrictions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No unlawful activity permitted</li>
                      <li>Login credential sharing is prohibited</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy Policy */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Privacy Policy
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <h3 className="font-medium mb-2">Data Collection & Usage</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>We collect signup information and app usage analytics</li>
                      <li>Data is encrypted and never sold to third parties</li>
                      <li>Cookies are used for session management</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Pricing Details
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <h3 className="font-medium mb-2">Subscription</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>INR 7 per month after free trial</li>
                      <li>No hidden charges</li>
                      <li>Supports UPI, cards, and net banking</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Phone className="h-5 w-5 text-primary-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">+91 9026425459</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Mail className="h-5 w-5 text-primary-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">devaaman8@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <MapPin className="h-5 w-5 text-primary-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Rafiganj, Aurangabad, Bihar 824125
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Clock className="h-5 w-5 text-primary-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Business Hours</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Monday to Friday, 10:00 AM to 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}