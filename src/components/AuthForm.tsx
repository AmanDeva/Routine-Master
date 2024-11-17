import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Calendar, User, Mail, Lock } from 'lucide-react';
import Spline from '@splinetool/react-spline';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const auth = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await auth?.login(formData.email, formData.password);
        toast.success('Logged in successfully!');
      } else {
        await auth?.signup(formData.email, formData.password, formData.username);
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Spline Animation Background */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/UQcvpOAXwv5K6H2T/scene.splinecode" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-gradient-to-br from-white/90 to-white/95 dark:from-gray-800/90 dark:to-indigo-900/90 
                    backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 dark:border-purple-300/10">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Routine Master</h1>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 w-full px-4 py-2 bg-white/70 dark:bg-gray-800/70 
                           border border-gray-200 dark:border-gray-700 rounded-xl
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:text-gray-100 dark:placeholder-gray-500"
                    placeholder="Enter your username"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full px-4 py-2 bg-white/70 dark:bg-gray-800/70 
                         border border-gray-200 dark:border-gray-700 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full px-4 py-2 bg-white/70 dark:bg-gray-800/70 
                         border border-gray-200 dark:border-gray-700 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700
                     text-white rounded-xl focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}