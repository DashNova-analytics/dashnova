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
  Briefcase,
  ChevronRight,
  Database,
  Tag,
  FolderOpen
} from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Load static and dynamic items
  const [items, setItems] = useState([]);

  useEffect(() => {
    // 1. Static items
    const staticItems = [
      { id: 'dashboard', title: 'Dashboard Overview', category: 'Pages', path: '/dashboard', description: 'Business KPIs, synchronization details, and active logs overview.', icon: LayoutDashboard },
      { id: 'analytics', title: 'Analytics Panel', category: 'Pages', path: '/analytics', description: 'Deep-dive profit margins, sales channels, customer trends, and stock velocity.', icon: BarChart3 },
      { id: 'revenue', title: 'Revenue & Margin Analytics', category: 'Analytics Tabs', path: '/analytics?tab=revenue', description: 'Gross profit margins and monthly comparison charts.', icon: BarChart3 },
      { id: 'sales', title: 'Sales Analytics', category: 'Analytics Tabs', path: '/analytics?tab=sales', description: 'Sales volume channels and average invoice order values.', icon: BarChart3 },
      { id: 'customer-trends', title: 'Customer Behavior & Retention', category: 'Analytics Tabs', path: '/analytics?tab=customer', description: 'New versus recurring customer loyalty trends and lifetime value (LTV).', icon: Users },
      { id: 'inventory-analytics', title: 'Inventory Velocity & Depletion', category: 'Analytics Tabs', path: '/analytics?tab=inventory', description: 'Stock velocities, unit consumption speeds, and stockout dates.', icon: Package },
      { id: 'regional-analytics', title: 'Regional shipping matrices', category: 'Analytics Tabs', path: '/analytics?tab=regional', description: 'Geographical sales distributions and shipping corridors.', icon: TrendingUp },
      { id: 'ai-assistant', title: 'AI Assistant', category: 'Pages', path: '/ai', description: 'Strategic insights powered by DashNova, ledger recommendations.', icon: MessageSquare },
      { id: 'forecast', title: 'AI Forecasting', category: 'Pages', path: '/forecast', description: 'Predicted revenue curves and seasonal sales projections.', icon: TrendingUp },
      { id: 'upload', title: 'Upload Ledger Data', category: 'Pages', path: '/upload', description: 'Sync Excel, CSV, or spreadsheet files with the ledger database.', icon: Upload },
      { id: 'reports', title: 'Custom Query & Reports', category: 'Pages', path: '/reports', description: 'Review transaction sheets and search ledger items.', icon: FileText },
      { id: 'customers-page', title: 'Customers Directory', category: 'Pages', path: '/customers', description: 'Enterprise user listings and invoice histories.', icon: Users },
      { id: 'products-page', title: 'Products Catalog', category: 'Pages', path: '/products', description: 'Manage SKU listings, unit values, and categories.', icon: Package },
      { id: 'settings', title: 'Settings', category: 'Pages', path: '/settings', description: 'Workspace configuration and account profile details.', icon: Settings },
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
      // Index products
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

      // Index customers
      if (dbState.customers && dbState.customers.length > 0) {
        dbState.customers.forEach(cust => {
          dynamicItems.push({
            id: `cust-${cust.id}`,
            title: cust.name,
            category: 'Customers',
            path: '/customers',
            description: `Enterprise Account from ${cust.region}. Active email: ${cust.email}.`,
            icon: Users
          });
        });
      }

      // Index synced files
      if (dbState.uploadedFiles && dbState.uploadedFiles.length > 0) {
        dbState.uploadedFiles.forEach((file, index) => {
          dynamicItems.push({
            id: `file-${index}`,
            title: file.name,
            category: 'Synced Datasets',
            path: '/upload',
            description: `Synced ledger database file. Size: ${file.size} KB, rows discovered: ${file.recordsDiscovered || '—'}.`,
            icon: Database
          });
        });
      }

      // Index AI insights
      if (dbState.aiInsights && dbState.aiInsights.length > 0) {
        dbState.aiInsights.forEach((insight, index) => {
          dynamicItems.push({
            id: `insight-${index}`,
            title: `AI Insight: ${insight.title}`,
            category: 'AI Assistant',
            path: '/dashboard',
            description: insight.detail,
            icon: Sparkles
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

  // Filter items based on user query
  const filteredItems = query.trim() === '' 
    ? items.slice(0, 5) // Show top 5 recommended items if query is empty
    : items.filter(item => {
        const queryLower = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(queryLower) ||
          item.category.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower)
        );
      });

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
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

  return (
    <>
      {/* Search Input Trigger in Navbar */}
      <div className="relative flex items-center w-full max-w-sm font-sans">
        <Search className="absolute left-3 text-gray-400" size={13} />
        <input
          type="text"
          readOnly
          onClick={() => setIsOpen(true)}
          placeholder="Search reports, datasets, settings... (Ctrl+K)"
          className="w-full bg-gray-50 hover:bg-gray-100/70 border border-gray-200 hover:border-gray-300 rounded-md py-1.5 pl-9 pr-14 text-xs cursor-pointer focus:outline-none transition"
        />
        <div className="absolute right-2 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] text-gray-400 font-bold font-mono shadow-xs select-none pointer-events-none">
          ⌘K
        </div>
      </div>

      {/* Full Screen Command Palette Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start justify-center pt-[10vh] px-4 font-sans"
          onKeyDown={handleKeyDown}
        >
          {/* Click away backdrop */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Container */}
          <div 
            ref={searchRef}
            className="bg-white w-full max-w-2xl rounded-xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden max-h-[70vh] z-10 animate-fade-in relative"
          >
            {/* Modal Input Search Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="text-gray-400 shrink-0" size={16} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search pages, database files, settings tab, customers..."
                className="w-full text-sm font-medium text-gray-900 focus:outline-none placeholder-gray-400"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-500 font-bold cursor-pointer transition"
              >
                ESC
              </button>
            </div>

            {/* Results Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50/50 p-2 space-y-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon || FolderOpen;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-start gap-3.5 px-3.5 py-3 rounded-lg cursor-pointer transition duration-100
                        ${isSelected 
                          ? 'bg-neutral-50 border border-neutral-150 shadow-xs' 
                          : 'border border-transparent'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0
                        ${isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}
                      `}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate
                            ${isSelected ? 'text-black font-extrabold' : 'text-gray-900'}
                          `}>
                            {item.title}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wider shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 truncate max-w-lg">
                          {item.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 self-center">
                          <span>Open</span>
                          <ChevronRight size={12} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center mx-auto border border-neutral-100 text-gray-400">
                    <Search size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">No results found for "{query}"</h4>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Check your spelling or try search queries like <strong className="font-semibold text-gray-600">revenue</strong>, <strong className="font-semibold text-gray-600">api keys</strong>, or SKU codes.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Keyboard Shortcuts Footer */}
            <div className="px-4 py-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
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
                DashNova Global Search Engine
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
