import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, CreateOrganization } from '@clerk/clerk-react';
import { ToastProvider } from './components/ui/ToastContext';
import OnboardingTour from './components/common/OnboardingTour';

import LandingPage from "./pages/LandingPage";

// Layout shell
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Main Dashboard Pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';
import Forecasting from './pages/Forecasting';
import UploadData from './pages/UploadData';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Settings from './pages/Settings';
import BusinessMapPage from './pages/BusinessMapPage';
import TimelinePage from './pages/TimelinePage';
import DocumentationPage from './pages/DocumentationPage';
import ApiReferencePage from './pages/ApiReferencePage';
import HelpCenterPage from './pages/HelpCenterPage';
import StatusPage from './pages/StatusPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';


function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();
  const wasAuthed = useRef(false);
  const [waitingForClerk, setWaitingForClerk] = useState(false);

  useEffect(() => {
    if (userId) {
      wasAuthed.current = true;
      setWaitingForClerk(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) return;
    if (userId) return; // still signed in, nothing to do

    if (wasAuthed.current) {
      // userId just went null — might be re-issuing the token
      setWaitingForClerk(true);
      const timer = setTimeout(() => {
        setWaitingForClerk(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, userId]);

  if (!isLoaded) {
    return (
      <div id="loading-spinner" className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider animate-pulse">Loading...</span>
      </div>
    );
  }

  // User is signed in — render normally
  if (userId) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // userId is null but we're still in the stabilisation window — show spinner
  if (waitingForClerk) {
    return (
      <div id="loading-spinner" className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider animate-pulse">Updating session...</span>
      </div>
    );
  }

  // Genuinely not signed in
  return <Navigate to="/signin" replace />;
}


function GuestRoute({ children }) {
  const { isLoaded, userId, orgId } = useAuth();

  if (!isLoaded) {
    return (
      <div id="loading-spinner" className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider animate-pulse">Loading...</span>
      </div>
    );
  }

  if (userId) {
    return <Navigate to={orgId ? "/dashboard" : "/create-organization"} replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashnova_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <ToastProvider>
      <ScrollToTop />
      <OnboardingTour />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Guest Auth Routes */}
        <Route
          path="/signin/*"
          element={
            <GuestRoute>
              <SignInPage />
            </GuestRoute>
          }
        />
        <Route
          path="/create-organization"
          element={
            <CreateOrganizationPage />
          }
        />
        <Route
          path="/signup/*"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />

        {/* Secure Portal Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <Forecasting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <BusinessMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <ProtectedRoute>
              <TimelinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <ProtectedRoute>
              <DocumentationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/api-docs"
          element={
            <ProtectedRoute>
              <ApiReferencePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute>
              <StatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <ProtectedRoute>
              <PrivacyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <ProtectedRoute>
              <TermsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

function CreateOrganizationPage() {
  const { isLoaded, userId, orgId } = useAuth();
  const wasAuthed = useRef(false);
  const [waitingForClerk, setWaitingForClerk] = useState(false);

  useEffect(() => {
    if (userId) {
      wasAuthed.current = true;
      setWaitingForClerk(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) return;
    if (userId) return;

    if (wasAuthed.current) {
      setWaitingForClerk(true);
      const timer = setTimeout(() => {
        setWaitingForClerk(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, userId]);

  if (!isLoaded) {
    return (
      <div id="loading-spinner" className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider animate-pulse">Loading...</span>
      </div>
    );
  }

  // Still signed in with an active org → go to dashboard
  if (userId && orgId) {
    return <Navigate to="/dashboard" replace />;
  }

  // Signed in, no org → show the create form (this is the happy path after deleting last org)
  if (userId && !orgId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 font-sans">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-white rotate-45" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Create Your Organization</h1>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">
            Set up a workspace to unlock your DashNova analytics dashboard.
          </p>
        </div>
        <div className="w-full max-w-md">
          <CreateOrganization
            afterCreateOrganizationUrl="/dashboard"
            routing="hash"
          />
        </div>
      </div>
    );
  }

  if (waitingForClerk) {
    return (
      <div id="loading-spinner" className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider animate-pulse">Updating session...</span>
      </div>
    );
  }

  // Genuinely not signed in
  return <Navigate to="/signin" replace />;
}
