import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: auth?.currentUser?.displayName || '',
    email: auth?.currentUser?.email || '',
    password: ''
  });

  const iconButtonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.username !== auth?.currentUser?.displayName) {
        await auth?.updateUserProfile(formData.username);
      }

      if (formData.email !== auth?.currentUser?.email) {
        await auth?.updateUserEmail(formData.email);
      }

      if (formData.password) {
        await auth?.updateUserPassword(formData.password);
        setFormData(prev => ({ ...prev, password: '' }));
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 
                     hover:text-primary-500 dark:hover:text-primary-400 mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <div className="glass-card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-500 
                          dark:from-primary-500 dark:to-primary-600 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                         dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Profile Settings
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
                                text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-primary pl-10"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
                                text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-primary pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                  <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                    (leave blank to keep current)
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
                                text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-primary pl-10"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <motion.button
                variants={iconButtonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 
                         bg-gradient-to-r from-primary-500 to-primary-600 
                         dark:from-primary-600 dark:to-primary-700
                         hover:from-primary-600 hover:to-primary-700
                         dark:hover:from-primary-500 dark:hover:to-primary-600
                         text-white rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-primary-500 focus:ring-offset-2 
                         dark:focus:ring-offset-gray-900
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Save className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Updating...' : 'Save Changes'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}