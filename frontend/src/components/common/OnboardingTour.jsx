import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useUser, useOrganization, useOrganizationList } from "@clerk/clerk-react";
import { HelpCircle, ChevronLeft, ChevronRight, X, Play, RefreshCw, Sparkles } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

export default function OnboardingTour() {
  const { isSignedIn } = useAuth();
  const { organization } = useOrganization();
  const { userMemberships } = useOrganizationList({ userMemberships: { infinite: true } });
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Define steps
  const steps = [
    {
      id: 'create-org-container',
      title: 'Create Your Workspace',
      description: 'Welcome to DashNova! Start by creating your first business workspace. This sets up your isolated ledger dashboard.',
      path: '/dashboard',
      placement: 'bottom',
      highlightId: 'create-org-container',
      actionText: 'Next',
    },
    {
      id: 'org-switcher-button',
      title: 'Manage Your Workspaces',
      description: 'This is your active organization switcher. Click here to create additional workspaces or jump between different company profiles.',
      path: '/dashboard',
      placement: 'bottom',
      highlightId: 'org-switcher-button',
      actionText: 'Next',
    },
    {
      id: 'sync-ledger-button',
      title: 'Sync Ledger Data',
      description: 'Let\'s bring in your business files. Click this sync button to navigate to the data uploader and import spreadsheet logs.',
      path: '/dashboard',
      placement: 'top',
      highlightId: 'sync-ledger-button',
      actionText: 'Take me there',
      onAction: () => navigate('/upload'),
    },
    {
      id: 'sidebar-link-analytics',
      title: 'Interactive Analytics',
      description: 'Once data is synced, visit Analytics. It unlocks deep-dive profit charts, volume channels, and regional shipping maps.',
      path: '/analytics',
      placement: 'right',
      highlightId: 'sidebar-link-analytics',
      actionText: 'View Reports',
      onAction: () => navigate('/analytics'),
    },
    {
      id: 'sidebar-link-ai-assistant',
      title: 'Ask Gemini Advisor',
      description: 'Have strategic questions about your margins? Ask Gemini in the AI Assistant tab for advice customized to your logs.',
      path: '/ai',
      placement: 'right',
      highlightId: 'sidebar-link-ai-assistant',
      actionText: 'Complete Tour',
    }
  ];

  // Initialize tour state from localStorage on mount
  useEffect(() => {
    if (!isSignedIn) {
      setIsVisible(false);
      return;
    }

    const hasCompleted = localStorage.getItem('dashnova_tour_completed');
    const savedStep = localStorage.getItem('dashnova_tour_step');

    if (hasCompleted === 'true') {
      setIsVisible(false);
      return;
    }

    // Determine initial step
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    } else {
      // First run: if no active org, start at step 0, else start at step 1
      if (!organization || !userMemberships?.data?.length) {
        setCurrentStep(0);
      } else {
        setCurrentStep(1);
      }
    }
    setIsVisible(true);
  }, [isSignedIn, organization, userMemberships?.data?.length]);

  // Persist current step to localStorage
  useEffect(() => {
    if (currentStep >= 0) {
      localStorage.setItem('dashnova_tour_step', currentStep.toString());
    }
  }, [currentStep]);

  // Track target element positions
  useEffect(() => {
    if (!isVisible || currentStep < 0 || currentStep >= steps.length || isMinimized) {
      setTargetRect(null);
      return;
    }

    const activeStep = steps[currentStep];

    // Periodically search for element to handle delayed renders or navigation delays
    let attempts = 0;
    const findElement = () => {
      const el = document.getElementById(activeStep.highlightId);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Only update state if position actually changed
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      } else {
        setTargetRect(null);
        if (attempts < 10) {
          attempts++;
          setTimeout(findElement, 250);
        }
      }
    };

    findElement();

    // Listen to resize and scroll
    const handleUpdate = () => {
      const el = document.getElementById(activeStep.highlightId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, [currentStep, isVisible, location.pathname, isMinimized]);

  // Auto-navigate user to correct page for the step if they aren't on it
  useEffect(() => {
    if (!isVisible || currentStep < 0 || currentStep >= steps.length || isMinimized) return;

    const activeStep = steps[currentStep];
    if (activeStep.path && location.pathname !== activeStep.path) {
      // If user navigated away from the correct page, auto-adjust or nudge
      // Let's allow manual overrides, but if they click Next we navigate.
    }
  }, [currentStep, isVisible, location.pathname]);

  // Auto-adjust step if user creates their first organization
  useEffect(() => {
    if (isVisible && currentStep === 0 && organization && userMemberships?.data?.length > 0) {
      // User successfully created an organization!
      // Let's congratulate them and move to step 1
      toast.success('Congratulations! Your workspace is ready.');
      setCurrentStep(1);
    }
  }, [organization, userMemberships?.data?.length, isVisible, currentStep]);

  if (!isSignedIn || !isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={restartTour}
          title="Restart guided tutorial"
          className="w-9 h-9 bg-black hover:bg-neutral-800 text-white border border-neutral-700 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer hover:scale-105"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    );
  }

  function restartTour() {
    localStorage.removeItem('dashnova_tour_completed');
    if (!organization || !userMemberships?.data?.length) {
      setCurrentStep(0);
    } else {
      setCurrentStep(1);
    }
    setIsMinimized(false);
    setIsVisible(true);
    toast.success('Guided tutorial restarted! Let\'s begin.');
  }

  const handleNext = () => {
    const activeStep = steps[currentStep];

    if (activeStep.onAction) {
      activeStep.onAction();
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      // Auto-navigate if the next step requires a specific page
      const nextPath = steps[nextStep].path;
      if (nextPath && location.pathname !== nextPath) {
        navigate(nextPath);
      }
      setCurrentStep(nextStep);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const prevPath = steps[prevStep].path;
      if (prevPath && location.pathname !== prevPath) {
        navigate(prevPath);
      }
      setCurrentStep(prevStep);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('dashnova_tour_completed', 'true');
    localStorage.removeItem('dashnova_tour_step');
    toast.success('Onboarding complete! Enjoy exploring DashNova.');
  };

  const activeStep = steps[currentStep];
  if (!activeStep) return null;

  // Calculate coordinates
  let tooltipStyle = {
    position: 'fixed',
    zIndex: 50,
  };

  const hasTarget = !!targetRect;

  if (hasTarget) {
    const space = 12;
    const widthEstimate = 320;
    const heightEstimate = 185;

    // Default positioning center screen fallback
    let top = window.innerHeight / 2 - heightEstimate / 2;
    let left = window.innerWidth / 2 - widthEstimate / 2;

    switch (activeStep.placement) {
      case 'bottom':
        top = targetRect.bottom + space;
        left = targetRect.left + (targetRect.width / 2) - (widthEstimate / 2);
        break;
      case 'top':
        top = targetRect.top - heightEstimate - space;
        left = targetRect.left + (targetRect.width / 2) - (widthEstimate / 2);
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (heightEstimate / 2);
        left = targetRect.right + space;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (heightEstimate / 2);
        left = targetRect.left - widthEstimate - space;
        break;
      default:
        break;
    }

    // Bound constraints to viewport
    const padding = 16;
    if (left < padding) left = padding;
    if (left + widthEstimate > window.innerWidth - padding) {
      left = window.innerWidth - widthEstimate - padding;
    }
    if (top < padding) top = padding;
    if (top + heightEstimate > window.innerHeight - padding) {
      top = window.innerHeight - heightEstimate - padding;
    }

    tooltipStyle.top = `${top}px`;
    tooltipStyle.left = `${left}px`;
  } else {
    // Companion widget position if target not visible/found or wrong page
    tooltipStyle.bottom = '24px';
    tooltipStyle.right = '24px';
  }

  return (
    <>
      {/* Target Focus Ring Spotlight Portal Overlay */}
      {hasTarget && !isMinimized && (
        <AnimatePresence>
          <motion.div
            key={`highlight-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              pointerEvents: 'none',
              zIndex: 45,
            }}
            className="border-[2px] border-black rounded ring-8 ring-black/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]"
          />
        </AnimatePresence>
      )}

      {/* Main Tour Card Container */}
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            style={tooltipStyle}
            className="w-[320px] bg-white border border-neutral-200 rounded-lg shadow-xl p-5 font-sans flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-gray-950 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Guided Tour • Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(true)}
                  title="Minimize Tour"
                  className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition cursor-pointer"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={handleSkip}
                  title="Close Guide"
                  className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Content body */}
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-950 flex items-center gap-1.5 mb-1.5">
                {activeStep.title}
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                {activeStep.description}
              </p>

              {/* Page Redirect Prompt */}
              {activeStep.path && location.pathname !== activeStep.path && (
                <div className="bg-neutral-50 border border-neutral-150 rounded px-2.5 py-1.5 text-[10px] text-neutral-600 mb-4 flex items-center justify-between">
                  <span>Needs page: <strong className="font-semibold">{activeStep.path}</strong></span>
                  <button
                    onClick={() => navigate(activeStep.path)}
                    className="font-bold text-black underline hover:text-gray-600"
                  >
                    Go Now
                  </button>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-50">
              <button
                onClick={handleSkip}
                className="text-[10px] text-gray-400 hover:text-black font-semibold transition cursor-pointer"
              >
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="h-7 px-2.5 border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    Back
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="h-7 px-3 bg-black hover:bg-neutral-800 text-white rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{activeStep.actionText}</span>
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Minimized Companion Bubble */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 z-40 bg-white border border-neutral-200 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-3 font-sans"
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span className="font-semibold text-gray-800">
                Tour paused (Step {currentStep + 1}/{steps.length})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="text-[10px] bg-black text-white px-2.5 py-1 rounded-full font-bold hover:bg-neutral-800 cursor-pointer transition"
              >
                Resume
              </button>
              <button
                onClick={handleSkip}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-full cursor-pointer transition"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
