import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlarmProvider } from './contexts/AlarmContext';
import { ThemeProvider } from './contexts/ThemeContext';
import IntroductionPage from './components/IntroductionPage';
import AuthForm from './components/AuthForm';
import ProfilePage from './components/ProfilePage';
import PoliciesPage from './components/PoliciesPage';
import SubscriptionPage from './components/SubscriptionPage';
import DailyRoutine from './components/DailyRoutine';
import PricingPage from './pages/PricingPage';
import ShippingPage from './pages/ShippingPage';
import CancellationPage from './pages/CancellationPage';
import { Toaster } from 'react-hot-toast';

function Dashboard() {
  const auth = useAuth();
  
  if (!auth?.currentUser) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <DailyRoutine />
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return auth?.currentUser ? <>{children}</> : <Navigate to="/auth" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return !auth?.currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AlarmProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 
                          dark:from-gray-900 dark:to-gray-800 
                          text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <Routes>
                <Route path="/" element={
                  <PublicRoute>
                    <IntroductionPage />
                  </PublicRoute>
                } />
                <Route path="/auth" element={
                  <PublicRoute>
                    <div className="min-h-screen flex items-center justify-center p-4">
                      <AuthForm />
                    </div>
                  </PublicRoute>
                } />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } />
                <Route path="/subscription" element={
                  <PrivateRoute>
                    <SubscriptionPage />
                  </PrivateRoute>
                } />
                <Route path="/policies" element={<PoliciesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/cancellation" element={<CancellationPage />} />
                {/* Redirect any unknown route to / */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </AlarmProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}