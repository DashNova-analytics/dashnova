import React from 'react';
import { Sparkles, User } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex w-full gap-4 py-6 px-4 md:px-6 font-sans ${isAi ? 'bg-gray-50/50 border-y border-gray-100' : 'bg-white'}`}>
      {/* Avatar Icon */}
      <div className={`w-7 h-7 rounded border flex items-center justify-center shrink-0
        ${isAi ? 'bg-black border-black text-white' : 'bg-gray-100 border-gray-200 text-gray-700'}
      `}>
        {isAi ? <Sparkles size={13} /> : <User size={13} />}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-950">
            {isAi ? 'DashNova AI' : 'You'}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="text-sm text-gray-900 leading-relaxed font-normal whitespace-pre-wrap">
          {message.text}
        </div>
      </div>
    </div>
  );
}
