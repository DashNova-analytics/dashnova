import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled = false, placeholder = 'Ask DashNova AI to analyze files, forecast, or generate summaries...' }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white max-w-3xl mx-auto flex items-center font-sans overflow-hidden">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-12 px-4 border-0 rounded-l text-sm focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-900 bg-transparent"
      />
      
      <div className="flex items-center gap-2 pr-3 shrink-0">
        <span className="hidden sm:inline text-[9px] text-gray-400 font-medium font-mono flex items-center gap-0.5 border border-gray-100 rounded px-1.5 py-0.5 bg-gray-50">
          Enter <CornerDownLeft size={8} />
        </span>
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="w-8 h-8 rounded bg-black hover:bg-gray-800 disabled:bg-gray-100 text-white disabled:text-gray-400 flex items-center justify-center transition cursor-pointer"
        >
          <Send size={13} />
        </button>
      </div>
    </form>
  );
}
