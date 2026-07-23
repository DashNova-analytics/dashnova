import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import PromptSuggestions from './PromptSuggestions';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function ChatWindow({
  messages = [],
  loading = false,
  onSendMessage,
  onSelectSuggestion
}) {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg bg-white overflow-hidden font-sans hover:border-gray-300 transition duration-150">
      {/* Chat header */}
      <div className="h-14 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
            <Sparkles size={11} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 tracking-tight">AI Analytical Assistant</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Powered by DashNova (Context: Active Business Ledger)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Engine Online</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {messages && messages.length > 0 ? (
          <div className="flex flex-col">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex w-full gap-4 py-6 px-4 md:px-6 bg-gray-50/50 border-t border-gray-100">
                <div className="w-7 h-7 rounded border border-black bg-black text-white flex items-center justify-center shrink-0">
                  <Sparkles size={13} />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold text-gray-950">DashNova AI</p>
                  <div className="flex items-center gap-1.5 h-6">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center px-6 py-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={18} className="text-gray-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">AI Assistant Chat</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-2 max-w-sm mx-auto">
                Ask specific questions about your sales trends, customer behavior, regional distribution, or forecasting predictions.
              </p>
            </div>
            
            <PromptSuggestions onSelect={onSelectSuggestion} />
          </div>
        )}
      </div>

      {/* Input panel */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <ChatInput onSendMessage={onSendMessage} disabled={loading} />
      </div>
    </div>
  );
}
