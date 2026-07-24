import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import { useOrganization } from '@clerk/clerk-react';
import { MessageSquare, RefreshCw, Trash2, ShieldAlert, Sparkles, Lightbulb, Database, ArrowRight } from 'lucide-react';
import { getDbState } from '../services/dbStore';
import { chatService } from '../services/chatService';
import { Link } from 'react-router-dom';

export default function AIAssistant() {
  const { organization } = useOrganization();
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbState, setDbState] = useState(() => getDbState());

  useEffect(() => {
    const currentState = getDbState();
    setDbState(currentState);

    try {
      const savedMsgs = localStorage.getItem('dashnova_ai_messages');
      if (savedMsgs) setMessages(JSON.parse(savedMsgs));

      const savedHist = localStorage.getItem('dashnova_ai_history');
      if (savedHist) setHistory(JSON.parse(savedHist));
    } catch (e) {
      console.error("Failed to parse saved chat history:", e);
    }
  }, []);

  const saveStateToStorage = (newMsgs, newHist) => {
    try {
      localStorage.setItem('dashnova_ai_messages', JSON.stringify(newMsgs));
      localStorage.setItem('dashnova_ai_history', JSON.stringify(newHist));
    } catch (e) {
      console.error("Failed to persist chat:", e);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

    // 1. Add User message
    const userMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    const currentDb = getDbState();

    try {
      const response = await chatService.sendMessage(text, updatedMessages, currentDb);

      const aiMsg = {
        sender: 'ai',
        text: response.reply || "I've processed your query based on current organizational metrics.",
        timestamp: response.timestamp || new Date().toISOString()
      };

      const finalMsgs = [...updatedMessages, aiMsg];
      setMessages(finalMsgs);

      // Add to sidebar history
      const title = text.length > 28 ? text.substring(0, 28) + '...' : text;
      const newHist = [
        { id: `h_${Date.now()}`, title, active: true },
        ...history.map(h => ({ ...h, active: false }))
      ];
      setHistory(newHist);

      saveStateToStorage(finalMsgs, newHist);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        sender: 'ai',
        text: "I experienced a temporary communication glitch, but I remain available. Please ask your question again.",
        timestamp: new Date().toISOString()
      };
      const finalMsgs = [...updatedMessages, errorMsg];
      setMessages(finalMsgs);
      saveStateToStorage(finalMsgs, history);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (title) => {
    handleSendMessage(title);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setHistory([]);
    try {
      localStorage.removeItem('dashnova_ai_messages');
      localStorage.removeItem('dashnova_ai_history');
    } catch (e) {
      console.error("Error clearing chat storage:", e);
    }
  };

  const hasCustomData = Boolean(dbState?.hasData);

  return (
    <div className="space-y-4 sm:space-y-6 font-sans pb-12">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">AI Business Intelligence & Strategy Assistant</h1>
            <span className="bg-black text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
              Gemini 3.6 Flash
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${
              hasCustomData 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasCustomData ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {hasCustomData ? 'Ingested Dataset Active' : 'Sample Business Mode'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Grounded AI intelligence advisor for {organization?.name || 'DashNova Workspace'}. Ask for future enhancement analytics ideas, revenue expansion levers, and strategic roadmaps.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="h-8 px-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Trash2 size={13} />
            Reset Chat
          </button>
        )}
      </div>

      {!hasCustomData && (
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Database className="text-gray-700 shrink-0" size={16} />
            <span>
              <strong className="text-gray-900">Sample Dataset Active:</strong> AI Assistant is answering using built-in enterprise sample data. You can upload custom transaction spreadsheets anytime.
            </span>
          </div>
          <Link
            to="/upload"
            className="text-[11px] font-semibold text-black hover:underline shrink-0 flex items-center gap-1"
          >
            Upload Data <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Mobile Recent Dialogs Bar (Visible on mobile/tablet < lg) */}
      {history.length > 0 && (
        <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={11} />
              Recent Dialogs
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Tap to select</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectSuggestion(item.title)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap shrink-0 border transition cursor-pointer ${
                  item.active
                    ? 'bg-black text-white border-black font-semibold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: History (Desktop) and Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
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
                      handleSelectSuggestion(item.title);
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-400 leading-normal">
                No recent conversation logs found. Ask a question to begin.
              </p>
            )}
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] text-gray-500 leading-normal flex gap-2 items-start">
            <ShieldAlert size={12} className="text-gray-400 shrink-0 mt-0.5" />
            <span>Grounded securely in your isolated organization workspace. No external data leakage.</span>
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

