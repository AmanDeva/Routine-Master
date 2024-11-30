import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Calendar, User, Mail, Lock, Shield, X, Phone, MapPin, Clock } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const auth = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isLogin && !acceptedPolicies) {
      toast.error('Please accept the terms and policies to create an account');
      return;
    }

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

  async function handleGoogleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    
    if (!isLogin && !acceptedPolicies) {
      toast.error('Please accept the terms and policies to create an account');
      return;
    }

    try {
      const user = await auth?.loginWithGoogle();
      if (user) {
        toast.success('Signed in with Google successfully!');
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
  }

  const PoliciesModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowPolicies(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms & Policies
              </h2>
            </div>
            <button
              onClick={() => setShowPolicies(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <section>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Terms and Conditions</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Free trial for one month</li>
                <li>INR 7 monthly subscription after trial</li>
                <li>Login credential sharing is prohibited</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy Policy</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>We collect signup information and usage analytics</li>
                <li>Data is encrypted and never sold to third parties</li>
                <li>Cookies are used for session management</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment & Refunds</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Supports UPI, cards, and net banking</li>
                <li>No hidden charges</li>
                <li>Refunds processed within 7-10 business days</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-primary-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>+91 9026425459</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-primary-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>devaaman8@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-primary-500" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p>Rafiganj, Aurangabad, Bihar 824125</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-1 text-primary-500" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p>Mon-Fri, 10:00 AM to 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
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

            {!isLogin && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="acceptPolicies"
                  checked={acceptedPolicies}
                  onChange={(e) => setAcceptedPolicies(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 
                         focus:ring-blue-500 dark:border-gray-600 
                         dark:focus:ring-offset-gray-800"
                />
                <label htmlFor="acceptPolicies" className="text-sm text-gray-600 dark:text-gray-300">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => setShowPolicies(true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    terms and policies
                  </button>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!isLogin && !acceptedPolicies)}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700
                     text-white rounded-xl focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || (!isLogin && !acceptedPolicies)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                       border border-gray-300 dark:border-gray-600 rounded-xl
                       hover:bg-gray-50 dark:hover:bg-gray-600
                       focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-gray-500 dark:focus:ring-offset-gray-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                   alt="Google" 
                   className="w-5 h-5" />
              Sign {isLogin ? 'in' : 'up'} with Google
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setAcceptedPolicies(false);
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showPolicies && <PoliciesModal />}
      </AnimatePresence>
    </div>
  );
}