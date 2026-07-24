import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Upload, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  HelpCircle,
  Clock,
  ChevronRight,
  Database,
  Tag,
  FolderOpen,
  Filter,
  X
} from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [items, setItems] = useState([]);

  useEffect(() => {
    // 1. Core pages and analytics views
    const staticItems = [
      { id: 'dashboard', title: 'Dashboard Overview', category: 'Pages', path: '/dashboard', description: 'Business KPIs, synchronization details, and active logs overview.', icon: LayoutDashboard },
      { id: 'analytics', title: 'Analytics Panel', category: 'Pages', path: '/analytics', description: 'Deep-dive profit margins, sales channels, customer trends, and stock velocity.', icon: BarChart3 },
      { id: 'revenue', title: 'Revenue & Margin Analytics', category: 'Analytics', path: '/analytics?tab=revenue', description: 'Gross profit margins and monthly comparison charts.', icon: BarChart3 },
      { id: 'sales', title: 'Sales Analytics', category: 'Analytics', path: '/analytics?tab=sales', description: 'Sales volume channels and average invoice order values.', icon: BarChart3 },
      { id: 'customer-trends', title: 'Customer Behavior & Retention', category: 'Analytics', path: '/analytics?tab=customer', description: 'New versus recurring customer loyalty trends and lifetime value (LTV).', icon: Users },
      { id: 'inventory-analytics', title: 'Inventory Velocity & Depletion', category: 'Analytics', path: '/analytics?tab=inventory', description: 'Stock velocities, unit consumption speeds, and stockout dates.', icon: Package },
      { id: 'regional-analytics', title: 'Regional Shipping & Sales Corridors', category: 'Analytics', path: '/analytics?tab=regional', description: 'Geographical sales distributions and shipping corridors.', icon: TrendingUp },
      { id: 'ai-assistant', title: 'AI Assistant', category: 'Pages', path: '/ai', description: 'Strategic business insights powered by Gemini 3.6 Flash.', icon: MessageSquare },
      { id: 'forecast', title: 'AI Forecasting', category: 'Pages', path: '/forecast', description: 'Predicted revenue curves and seasonal sales projections.', icon: TrendingUp },
      { id: 'upload', title: 'Upload Ledger Data', category: 'Pages', path: '/upload', description: 'Sync Excel, CSV, or spreadsheet files with the database.', icon: Upload },
      { id: 'reports', title: 'Custom Query & Reports', category: 'Reports', path: '/reports', description: 'Review transaction sheets and search ledger items.', icon: FileText },
      { id: 'customers-page', title: 'Customers Directory', category: 'Customers', path: '/customers', description: 'Enterprise user listings and invoice histories.', icon: Users },
      { id: 'products-page', title: 'Products Catalog', category: 'Products', path: '/products', description: 'Manage SKU listings, unit values, and categories.', icon: Package },
      { id: 'settings', title: 'Settings', category: 'Settings', path: '/settings', description: 'Workspace configuration and account profile details.', icon: Settings },
      { id: 'profile-settings', title: 'User Profile Settings', category: 'Settings', path: '/settings?tab=profile', description: 'Change name, profile email, and update passwords.', icon: Settings },
      { id: 'organization-settings', title: 'Organization Profile Settings', category: 'Settings', path: '/settings?tab=organization', description: 'Workspace identifiers, member listings, and billing info.', icon: Settings },
      { id: 'security-settings', title: 'Security & Access Control', category: 'Settings', path: '/settings?tab=security', description: 'Audit access logs and activate multi-factor auth.', icon: Settings },
      { id: 'api-keys-settings', title: 'Developer API Keys', category: 'Settings', path: '/settings?tab=api-keys', description: 'Create and revoke platform service tokens.', icon: Settings },
      { id: 'onboarding-tutorial', title: 'Guided Tutorial Onboarding', category: 'Settings', path: '/settings?tab=onboarding-tour', description: 'Launch the interactive overlay step tutorial.', icon: HelpCircle }
    ];

    // 2. Fetch dynamic items from dbStore
    const dbState = getDbState();
    const dynamicItems = [];

    if (dbState && dbState.hasData) {
      if (dbState.products && dbState.products.length > 0) {
        dbState.products.forEach(prod => {
          dynamicItems.push({
            id: `prod-${prod.sku}`,
            title: `${prod.name} (${prod.sku})`,
            category: 'Products',
            path: '/products',
            description: `Product SKU in ${prod.category}. Stock: ${prod.stock} units, price: ${prod.price}.`,
            icon: Tag
          });
        });
      }

      if (dbState.customers && dbState.customers.length > 0) {
        dbState.customers.forEach(cust => {
          dynamicItems.push({
            id: `cust-${cust.id}`,
            title: cust.name,
            category: 'Customers',
            path: '/customers',
            description: `Enterprise Account from ${cust.region}. Active email: ${cust.email}. Total sales: ${cust.sales}`,
            icon: Users
          });
        });
      }

      if (dbState.uploadedFiles && dbState.uploadedFiles.length > 0) {
        dbState.uploadedFiles.forEach((file, index) => {
          dynamicItems.push({
            id: `file-${index}`,
            title: file.name,
            category: 'Datasets',
            path: '/upload',
            description: `Synced ledger database file. Size: ${file.size} KB, rows discovered: ${file.recordsDiscovered || '—'}.`,
            icon: Database
          });
        });
      }
    }

    setItems([...staticItems, ...dynamicItems]);
  }, [isOpen]);

  // Handle Ctrl+K / Cmd+K global listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Construct search items list with optional "Ask AI" option
  let filteredItems = items.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
    if (!matchesCat) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  if (!query.trim()) {
    filteredItems = filteredItems.slice(0, 6);
  }

  // Prepend "Ask AI" option if user typed something
  const displayItems = query.trim().length > 1
    ? [
        {
          id: 'ask-ai-prompt',
          title: `Ask AI Assistant: "${query}"`,
          category: 'AI Assistant',
          path: `/ai`,
          description: `Query Gemini 3.6 Flash assistant regarding "${query}" for live data analysis.`,
          icon: Sparkles,
          isAiAction: true
        },
        ...filteredItems
      ]
    : filteredItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % displayItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + displayItems.length) % displayItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayItems[selectedIndex]) {
        handleSelect(displayItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    navigate(item.path);
    setIsOpen(false);
    setQuery('');
  };

  const categoryChips = ['All', 'Pages', 'Analytics', 'Products', 'Customers', 'Reports', 'Settings'];

  return (
    <>
      {/* Desktop Search Trigger Bar */}
      <div className="relative hidden md:flex items-center w-full max-w-md font-sans">
        <Search className="absolute left-3 text-gray-400" size={13} />
        <input
          type="text"
          readOnly
          onClick={() => setIsOpen(true)}
          placeholder="Search pages, customers, products, reports... (Cntrl+K)"
          className="w-full bg-gray-50 hover:bg-gray-100/80 border border-gray-200 hover:border-gray-300 rounded-md py-1.5 pl-9 pr-14 text-xs cursor-pointer focus:outline-none transition shadow-2xs"
        />
        <div className="absolute right-2 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] text-gray-400 font-bold font-mono shadow-2xs select-none pointer-events-none">
          Cntrl + K
        </div>
      </div>

      {/* Mobile Search Button Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition cursor-pointer"
        title="Global Search"
      >
        <Search size={14} />
      </button>

      {/* Full Screen Command Palette Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start justify-center pt-[8vh] px-4 font-sans"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop click */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Container */}
          <div 
            ref={searchRef}
            className="bg-white w-full max-w-2xl rounded-xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden max-h-[75vh] z-10 animate-fade-in relative"
          >
            {/* Modal Search Bar Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-white">
              <Search className="text-gray-400 shrink-0" size={16} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across entire app: customers, products, analytics, settings..."
                className="w-full text-sm font-semibold text-gray-900 focus:outline-none placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                >
                  <X size={14} />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 font-bold cursor-pointer transition shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Filter Category Chips */}
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-bold uppercase text-gray-400 mr-1 flex items-center gap-1 shrink-0">
                <Filter size={10} /> Filter:
              </span>
              {categoryChips.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition cursor-pointer shrink-0 border ${
                      isActive 
                        ? 'bg-black border-black text-white shadow-2xs' 
                        : 'bg-white border-gray-200 text-gray-600 hover:text-black hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Results Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2 space-y-0.5">
              {displayItems.length > 0 ? (
                displayItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon || FolderOpen;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-start gap-3.5 px-3.5 py-3 rounded-lg cursor-pointer transition duration-100
                        ${isSelected 
                          ? 'bg-gray-100/80 border border-gray-200 shadow-2xs' 
                          : 'border border-transparent hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5
                        ${item.isAiAction 
                          ? 'bg-black text-white shadow-xs' 
                          : isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}
                      `}>
                        <Icon size={14} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate ${item.isAiAction ? 'text-black' : 'text-gray-900'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                            item.isAiAction ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 truncate max-w-lg">
                          {item.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 self-center shrink-0">
                          <span>Jump</span>
                          <ChevronRight size={12} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto border border-gray-200 text-gray-400">
                    <Search size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">No results found for "{query}"</h4>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Try searching for <strong className="font-semibold text-gray-700">revenue</strong>, <strong className="font-semibold text-gray-700">customers</strong>, <strong className="font-semibold text-gray-700">products</strong>, or <strong className="font-semibold text-gray-700">settings</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer with Keyboard Navigation shortcuts */}
            <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="border border-gray-200 bg-white px-1.5 py-0.5 rounded font-mono font-bold text-gray-500">↑↓</span>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="border border-gray-200 bg-white px-1.5 py-0.5 rounded font-mono font-bold text-gray-500">Enter</span>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <span className="border border-gray-200 bg-white px-1.5 py-0.5 rounded font-mono font-bold text-gray-500">Esc</span>
                  Close
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-gray-400">
                <Sparkles size={11} className="text-black" />
                Global Search Active
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

