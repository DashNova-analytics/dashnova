import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser, useOrganization, UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
import { syncClerkUser } from '../../services/authService';
import GlobalSearch from '../common/GlobalSearch';
import NotificationCenter from '../common/NotificationCenter';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  FileText,
  TrendingUp,
  Upload,
  Users,
  Package,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Network,
  Clock,
  Mic
} from 'lucide-react';
import VoiceAssistantModal from '../common/VoiceAssistantModal';

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { organization } = useOrganization();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  const handleNavClick = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  useEffect(() => {
    if (!user) return;

    const clerkUserId = user.id;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.fullName || user.primaryEmailAddress?.emailAddress || user.identifier;
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || user.identifier;
    const organizationName = organization?.name || undefined;

    if (!email) return;

    syncClerkUser({
      clerkUserId,
      name,
      email,
      organizationName,
    }).catch((err) => {
      console.warn('Clerk user sync offline status:', err);
    });
  }, [user, organization?.name]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'Intelligence' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, section: 'Intelligence' },
    { name: 'AI Assistant', href: '/ai', icon: MessageSquare, section: 'Intelligence' },
    { name: 'Business Map', href: '/map', icon: Network, section: 'Intelligence' },
    { name: 'AI Timeline', href: '/timeline', icon: Clock, section: 'Intelligence' },
    { name: 'Forecasting', href: '/forecast', icon: TrendingUp, section: 'Intelligence' },
    { name: 'Upload Data', href: '/upload', icon: Upload, section: 'Operations' },
    { name: 'Reports', href: '/reports', icon: FileText, section: 'Operations' },
    { name: 'Customers', href: '/customers', icon: Users, section: 'Operations' },
    { name: 'Products', href: '/products', icon: Package, section: 'Operations' },
    { name: 'Settings', href: '/settings', icon: Settings, section: 'Operations' },
  ];
  const appearance = {

};

  return (
    <div className="min-h-screen bg-white flex text-gray-900 font-sans antialiased">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-50 border-r border-gray-200 z-40 transition-all duration-200 flex flex-col
          ${mobileOpen ? 'translate-x-0 w-64 shadow-xl' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-white rotate-45" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <span
                onClick={() => {
                  navigate('/dashboard');
                  setMobileOpen(false);
                }}
                className="font-bold text-base tracking-tight cursor-pointer text-gray-900"
              >
                DashNova
              </span>
            )}
          </div>

          {/* Collapse toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-5 h-5 items-center justify-center border border-gray-200 rounded hover:border-gray-400 text-gray-500 hover:text-black focus:outline-none cursor-pointer bg-white"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          {/* Close trigger (Mobile only) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-black rounded-md hover:bg-gray-200/60 focus:outline-none cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mobile-only Organization Switcher inside drawer */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-200 sm:hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Active Workspace
          </div>
          <OrganizationSwitcher
            hidePersonal={false}
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* Intelligence Section */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-2 pb-2">
                Intelligence
              </div>
            )}
            <div className="space-y-1">
              {navigation
                .filter((item) => item.section === 'Intelligence')
                .map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      id={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all
                        ${isActive
                          ? 'bg-white border border-gray-200 text-black shadow-sm font-semibold'
                          : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        }
                      `}
                      onClick={handleNavClick}
                    >
                      <item.icon size={14} className={isActive ? 'text-black' : 'text-gray-400'} />
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </NavLink>
                  );
                })}
            </div>
          </div>

          {/* Operations Section */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-2 pb-2">
                Operations
              </div>
            )}
            <div className="space-y-1">
              {navigation
                .filter((item) => item.section === 'Operations')
                .map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      id={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all
                        ${isActive
                          ? 'bg-white border border-gray-200 text-black shadow-sm font-semibold'
                          : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        }
                      `}
                      onClick={handleNavClick}
                    >
                      <item.icon size={14} className={isActive ? 'text-black' : 'text-gray-400'} />
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </NavLink>
                  );
                })}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer with Active Org details */}
        {(!isCollapsed || mobileOpen) && (
          <div className="p-4 border-t border-gray-200 bg-gray-100/40 flex flex-col gap-1 text-[10px] text-gray-400">
            <div className="flex justify-between">
              <span>Environment</span>
              <span className="font-mono text-[9px] text-gray-500 uppercase">Development</span>
            </div>
            <div className="flex justify-between">
              <span>Version Number</span>
              <span className="font-mono text-[9px] text-gray-500">v1.0.0</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200
          ${isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-64'}
        `}
      >
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-30 px-3 sm:px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md focus:outline-none cursor-pointer shrink-0 transition"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            {/* Organization Switcher (Desktop/Tablet - hidden on mobile to avoid layout collision) */}
            <div className="hidden sm:block max-w-[150px] md:max-w-none truncate shrink-0">
              <OrganizationSwitcher
                hidePersonal={false}
                afterCreateOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
              />
            </div>

            {/* Context-aware Back button */}
            {location.pathname !== '/dashboard' && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-100 px-2 py-1.5 rounded transition cursor-pointer border border-gray-100 hover:border-gray-200 focus:outline-none shrink-0"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Global Search Component */}
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 ml-2">
            {/* Voice CEO Copilot Trigger Button */}
            <button
              onClick={() => setShowVoiceModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded-md shadow-xs transition cursor-pointer"
              title="Voice CEO Assistant"
            >
              <Mic size={14} className="text-white animate-pulse" />
              <span className="hidden sm:inline">Voice Copilot</span>
            </button>

            {/* Notifications Popover */}
            <NotificationCenter />

            {/* Separator line */}
            <div className="w-px h-5 bg-gray-200 hidden xs:block" />

            {/* User Button (module) */}
            <UserButton
              userProfileUrl="/settings"
              appearance={appearance}
            />
          </div>
        </header>

        {/* Content Panel */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer Section */}
        <footer className="mt-auto border-t border-gray-200 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2.5">
                  {/* Same logo mark as sidebar */}
                  <div className="w-7 h-7 bg-black rounded flex items-center justify-center shrink-0">
                    <div className="w-3.5 h-3.5 bg-white rotate-45" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-gray-900 tracking-tight">DashNova</h2>
                    <p className="text-[10px] text-gray-400 tracking-wide">Intelligence Beyond Dashboards</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500 leading-relaxed max-w-xs">
                  Transform raw data into meaningful insights with AI‑powered analytics,
                  forecasting, and intelligent reporting.
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Product</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Analytics', path: '/analytics' },
                    { label: 'Forecasting', path: '/forecast' },
                    { label: 'Reports', path: '/reports' },
                    { label: 'Business Map', path: '/map' },
                    { label: 'AI Timeline', path: '/timeline' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link to={item.path} onClick={handleNavClick} className="hover:text-gray-900 transition-colors">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Resources</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {[
                    { label: 'Documentation', path: '/docs' },
                    { label: 'API Reference', path: '/api-docs' },
                    { label: 'Help Center', path: '/help' },
                    { label: 'System Status', path: '/status' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link to={item.path} onClick={handleNavClick} className="hover:text-gray-900 transition-colors">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Company</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {[
                    { label: 'About Us', path: '/about' },
                    { label: 'Privacy Policy', path: '/privacy' },
                    { label: 'Terms of Service', path: '/terms' },
                    { label: 'Contact Support', path: '/contact' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link to={item.path} onClick={handleNavClick} className="hover:text-gray-900 transition-colors">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Divider + Bottom bar */}
            <div className="border-t border-gray-200 mt-8 pt-5 flex flex-col md:flex-row items-center justify-between gap-3">

              <span className="text-[11px] text-gray-400">
                © {new Date().getFullYear()} DashNova Technologies. All rights reserved.
              </span>

              <div className="flex items-center gap-2.5 text-[11px]">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-gray-200 bg-white text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Operational
                </span>
                <span className="text-gray-300">·</span>
                <span className="font-mono text-[10px] text-gray-400">v1.0.0</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400">Powered by DashNova</span>
              </div>

            </div>

          </div>
        </footer>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onNavigate={(path) => navigate(path)}
      />
    </div>
  );
}
