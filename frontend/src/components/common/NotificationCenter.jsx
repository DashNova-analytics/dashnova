import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  Package, 
  ShieldCheck, 
  FileSpreadsheet, 
  ArrowRight, 
  X, 
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'alerts'
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Load notifications from dbState + defaults
  const loadNotifications = () => {
    const dbState = getDbState();
    
    // Default system notifications
    const defaultList = [
      {
        id: 'n-sys-1',
        type: 'system',
        category: 'System',
        title: 'Workspace Initialized',
        message: 'DashNova AI engine connected & Clerk SSO authenticated.',
        time: 'Just now',
        read: false,
        actionUrl: '/dashboard',
        actionLabel: 'View Dashboard',
        icon: ShieldCheck,
        color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
      },
      {
        id: 'n-ai-1',
        type: 'ai',
        category: 'AI Assistant',
        title: 'Voice Copilot & Executive Briefing Ready',
        message: 'Ask AI Copilot for immediate revenue breakdowns and quarterly forecasts.',
        time: '10m ago',
        read: false,
        actionUrl: '/ai',
        actionLabel: 'Open AI Assistant',
        icon: Sparkles,
        color: 'text-purple-600 bg-purple-50 border-purple-200'
      }
    ];

    if (dbState?.hasData) {
      const datasetList = [
        {
          id: 'n-ds-1',
          type: 'data',
          category: 'Data Ingestion',
          title: 'Dataset Ingested & Parsed',
          message: `Ingested ${dbState.kpis?.salesCount || 0} invoice records totaling ${dbState.kpis?.totalRevenue || 'Rs 0'}.`,
          time: '2m ago',
          read: false,
          actionUrl: '/analytics',
          actionLabel: 'View Analytics',
          icon: FileSpreadsheet,
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        },
        {
          id: 'n-kpi-1',
          type: 'alert',
          category: 'KPI Signal',
          title: 'Average Order Value Computed',
          message: `Average Order Value established at ${dbState.kpis?.averageOrderValue || 'Rs 0'}.`,
          time: '5m ago',
          read: false,
          actionUrl: '/dashboard',
          actionLabel: 'Inspect Metrics',
          icon: TrendingUp,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
        }
      ];

      // Add inventory alert if products exist
      if (dbState.products && dbState.products.length > 0) {
        datasetList.push({
          id: 'n-inv-1',
          type: 'alert',
          category: 'Inventory',
          title: 'Catalog Health Telemetry',
          message: `${dbState.products.length} active SKUs indexed. Top product "${dbState.products[0]?.name}".`,
          time: '12m ago',
          read: true,
          actionUrl: '/products',
          actionLabel: 'View Catalog',
          icon: Package,
          color: 'text-amber-600 bg-amber-50 border-amber-200'
        });
      }

      setNotifications([...datasetList, ...defaultList]);
    } else {
      setNotifications(defaultList);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Listen for custom dataset upload events
    const handleStorageChange = () => loadNotifications();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.actionUrl) {
      navigate(item.actionUrl);
      setIsOpen(false);
    }
  };

  const handleAddSampleNotification = () => {
    const newNotif = {
      id: `n-${Date.now()}`,
      type: 'ai',
      category: 'Real-time Signal',
      title: 'AI Revenue Forecast Update',
      message: 'Monthly sales pacing projected to increase +14.2% next quarter.',
      time: 'Just now',
      read: false,
      actionUrl: '/forecast',
      actionLabel: 'View Forecast',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Filter list by active tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'alerts') return n.type === 'alert';
    return true;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button with Realistic Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-black flex items-center justify-center relative transition focus:outline-none cursor-pointer bg-white shadow-2xs"
        aria-label="System Notifications"
        title="Notifications & System Signals"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Drawer Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold">
                <Bell size={14} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                      {unreadCount} unread
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-gray-500">Live system telemetry & AI signals</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-200/60 rounded transition cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck size={15} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-gray-100 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                activeTab === 'all' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                activeTab === 'unread' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                activeTab === 'alerts' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Alerts ({notifications.filter((n) => n.type === 'alert').length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => {
                const IconComponent = item.icon || Info;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 hover:bg-gray-50/80 transition cursor-pointer relative group flex items-start gap-3 ${
                      !item.read ? 'bg-amber-50/30 font-medium' : 'bg-white'
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!item.read && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r" />
                    )}

                    {/* Icon Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${item.color}`}
                    >
                      <IconComponent size={14} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <Clock size={10} />
                          {item.time}
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-snug ${!item.read ? 'text-gray-950' : 'text-gray-800'}`}>
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-gray-500 mt-0.5 leading-normal line-clamp-2">
                        {item.message}
                      </p>

                      {/* Action Button */}
                      {item.actionLabel && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-black hover:underline">
                          <span>{item.actionLabel}</span>
                          <ArrowRight size={10} />
                        </div>
                      )}
                    </div>

                    {/* Dismiss Button */}
                    <button
                      onClick={(e) => handleDismiss(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-700 rounded transition cursor-pointer shrink-0"
                      title="Dismiss"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-10 px-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">You're all caught up!</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">No notifications match this filter criteria.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-gray-50 border-t border-gray-200/80 flex items-center justify-between text-[11px]">
            <button
              onClick={handleAddSampleNotification}
              className="text-gray-500 hover:text-black font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <Sparkles size={12} className="text-amber-500" />
              <span>Simulate AI Signal</span>
            </button>

            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-black font-medium transition cursor-pointer"
            >
              Configure Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
