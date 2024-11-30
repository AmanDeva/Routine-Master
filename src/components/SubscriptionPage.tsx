import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getSubscriptionStatus, SubscriptionStatus } from '../lib/subscription';
import { initializePayment } from '../lib/payment';
import { toast } from 'react-hot-toast';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    async function fetchSubscription() {
      if (!auth?.currentUser?.uid) return;
      try {
        const status = await getSubscriptionStatus(auth.currentUser.uid);
        setSubscription(status);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error('Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [auth?.currentUser]);

  const handleSubscribe = async () => {
    if (!auth?.currentUser) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setProcessingPayment(true);
    try {
      await initializePayment(auth.currentUser);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              <CreditCard className="h-6 w-6 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Subscription Management
              </h1>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading subscription details...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Subscription Status */}
                <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    {subscription?.isActive ? (
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {subscription?.isActive ? 'Active Subscription' : 'No Active Subscription'}
                      </h3>
                      {subscription?.isActive && (
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                          {subscription.trialEnd && new Date() < subscription.trialEnd && (
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Trial ends on {formatDate(subscription.trialEnd)}
                            </p>
                          )}
                          <p className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Next billing date: {formatDate(subscription.currentPeriodEnd)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subscription Plan */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 border border-primary-200 dark:border-primary-500/30">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Monthly Plan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹7</span>
                      <span className="text-gray-600 dark:text-gray-300">/month</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-primary-500" />
                        Full access to all features
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-primary-500" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-primary-500" />
                        1-month free trial
                      </li>
                    </ul>
                    {!subscription?.isActive && (
                      <button
                        onClick={handleSubscribe}
                        disabled={processingPayment}
                        className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-primary-500 to-primary-600 
                                 hover:from-primary-600 hover:to-primary-700
                                 text-white rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-primary-500 focus:ring-offset-2 
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        {processingPayment ? 'Processing...' : 'Subscribe Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}