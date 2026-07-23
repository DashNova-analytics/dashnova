import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import { useOrganization } from '@clerk/clerk-react';
import { MessageSquare, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';
import { getDbState } from '../services/dbStore';

export default function AIAssistant() {
  const { organization } = useOrganization();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbState, setDbState] = useState(null);
  const [history, setHistory] = useState([
    { id: 'h_1', title: 'Sales category query', active: false },
    { id: 'h_2', title: 'Inventory risk lookup', active: false },
  ]);

  useEffect(() => {
    setDbState(getDbState());
  }, []);

  const handleSendMessage = async (text) => {
    // 1. Add User message
    const userMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const currentDb = getDbState();

    // 2. Simulate AI response delay
    setTimeout(() => {
      let replyText = '';

      if (!currentDb.hasData) {
        replyText = `DashNova AI Agent: I've processed your question regarding "${text}" for ${organization?.name || 'your organization'}.\n\nCurrently, there is no synchronized business data in your PostgreSQL database instance. Because of this, I cannot inspect table rows, calculate margins, or run regressions.\n\nTo unlock complete AI-powered analytics, please visit the **Upload Data** page to import a standard CSV or Excel file and click **Synchronize Database**. Once synchronized, I'll instantly map your metrics and answer this query with precise data!`;

        if (text.toLowerCase().includes('category') || text.toLowerCase().includes('sales')) {
          replyText = `DashNova AI Agent: It looks like you're interested in sales performance and product categorizations!\n\nOnce you upload your transaction CSV (containing columns like Product, Quantity, Price, or Category), I'll automatically analyze sales velocity, rank top-performing lines, and forecast monthly demand using our Gemini model.\n\nPlease upload a file in the **Upload Data** tab and sync to begin!`;
        } else if (text.toLowerCase().includes('inventory') || text.toLowerCase().includes('stock')) {
          replyText = `DashNova AI Agent: I'll be happy to inspect stock levels, alert on low inventory thresholds, and advise on restocking timelines.\n\nCurrently, our database catalog contains 0 SKUs. Please upload your stock balance spreadsheet or inventory ledger in the **Upload Data** view and sync, and I will instantly outline product velocity trends.`;
        }
      } else {
        // We have active synchronized data!
        const query = text.toLowerCase();

        if (query.includes('category') || query.includes('sales') || query.includes('revenue')) {
          replyText = `DashNova AI Agent: I've analyzed your **Sales Ledger & Invoicing Records** in the SQL database:\n\n` +
            `• **Total Gross Revenue**: \`${currentDb.kpis.totalRevenue}\` across \`${currentDb.kpis.salesCount}\` transactions.\n` +
            `• **Top Selling Catalog SKU**: \`${currentDb.products[1].name}\` (SaaS Platform) with \`${currentDb.products[1].soldCount}\` sales generating \`${currentDb.products[1].revenue}\`.\n` +
            `• **Sales Channels**: Direct Enterprise sales make up the largest portion (72%), while Self-Serve SaaS constitutes 24%.\n` +
            `• **Profitability Trend**: Gross margins peaked at \`80%\` in July, driven by low COGS from SaaS products.\n\n` +
            `Would you like me to forecast sales for next month or draft an operational report?`;
        } else if (query.includes('inventory') || query.includes('stock') || query.includes('sku') || query.includes('product')) {
          const lowStockItem = currentDb.products.find(p => p.sku === 'SKU-V004') || currentDb.products[3];
          replyText = `DashNova AI Agent: Here is the **Catalog Inventory & Stock Velocity Analysis** compiled from the synchronized database:\n\n` +
            `• **Total Unique SKUs**: We are tracking \`${currentDb.products.length}\` active products.\n` +
            `• **Velocity Leader**: \`Flow Integration API\` is processing \`120 units/month\` with 8 days of depletion cover left.\n` +
            `• **CRITICAL STOCK ALERT**: \`${lowStockItem.name}\` (\`${lowStockItem.sku}\`) is currently down to \`${lowStockItem.stock}\` units. At our current depletion velocity, we forecast stock-out in \`3 days\`. I suggest placing a restock order immediately.\n\n` +
            `Let me know if you would like me to draft a purchase request order for these SKUs.`;
        } else if (query.includes('customer') || query.includes('client') || query.includes('user')) {
          const topCust = currentDb.customers[0];
          replyText = `DashNova AI Agent: Reviewing the active customer directories in your PostgreSQL database:\n\n` +
            `• **Total Unique Customers**: \`${currentDb.kpis.activeCustomers}\` accounts identified.\n` +
            `• **Key Enterprise Anchor**: \`${topCust.name}\` (\`${topCust.email}\`) has generated \`${topCust.sales}\` across \`${topCust.orders}\` orders.\n` +
            `• **Geographic Breakdown**: North America leads customer concentration at 76%, followed by Europe at 14%.\n` +
            `• **Active Engagement**: Zenith Corp was recently active within the last 24 hours (Status: Online).\n\n` +
            `I can compile email templates or draft customer retention reports if desired.`;
        } else {
          // General synchronized help reply
          replyText = `DashNova AI Agent: Hello! I've successfully grounded my analysis in your synchronized dataset (**${currentDb.uploadedFiles[0]?.name || 'Business Ledger'}**):\n\n` +
            `• **Financial Baseline**: Total Gross Revenue is \`${currentDb.kpis.totalRevenue}\` with an Average Order Value of \`${currentDb.kpis.averageOrderValue}\`.\n` +
            `• **Operational Volume**: \`${currentDb.kpis.salesCount}\` invoices have been successfully ingested.\n` +
            `• **Intelligence Insights**: Gross Margin reached \`80%\` in July; however, product \`${currentDb.products[3]?.name || 'Velocity Cache'}\` faces stock-out within 3 days.\n\n` +
            `Ask me anything about sales trends, low stock alerts, top customer accounts, or forecasting!`;
        }
      }

      const aiMsg = {
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);

      // Add to sidebar history if not already there
      const title = text.length > 25 ? text.substring(0, 25) + '...' : text;
      setHistory((prev) => [
        { id: `h_${Date.now()}`, title, active: true },
        ...prev.map(h => ({ ...h, active: false }))
      ]);
    }, 1000);
  };


  const handleSelectSuggestion = (title) => {
    handleSendMessage(title);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setHistory([]);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">AI Assistant</h1>
          <p className="text-xs text-gray-500 mt-1">
            Gemini-powered business advisor. Draft reports, query data collections, or predict growth strategies.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="h-8 px-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Trash2 size={13} />
            Reset Chat
          </button>
        )}
      </div>

      {/* Main Grid: History (Desktop) and Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* History Panel (Desktop only) */}
        <div className="hidden lg:flex flex-col border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition duration-150 self-stretch min-h-[600px] h-full justify-between">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={12} />
              Recent Dialogs
            </h3>

            {history.length > 0 ? (
              <div className="space-y-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full text-left h-8 px-2 rounded text-xs font-medium truncate block cursor-pointer transition-colors
                      ${item.active
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                      }
                    `}
                    onClick={() => {
                      if (item.title !== 'Sales category query' && item.title !== 'Inventory risk lookup') {
                        handleSelectSuggestion(item.title);
                      }
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-400 leading-normal">
                No recent conversation logs found. Ingest files to start analysis.
              </p>
            )}
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] text-gray-500 leading-normal flex gap-2 items-start">
            <ShieldAlert size={12} className="text-gray-400 shrink-0 mt-0.5" />
            <span>AI responses are grounded securely in your isolated workspace database. No public caching.</span>
          </div>
        </div>

        {/* Chat Window Panel */}
        <div className="lg:col-span-3">
          <ChatWindow
            messages={messages}
            loading={loading}
            onSendMessage={handleSendMessage}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </div>
      </div>
    </div>
  );
}
