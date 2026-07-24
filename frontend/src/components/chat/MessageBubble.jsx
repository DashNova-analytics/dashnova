import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MessageBubble({ message }) {
  const isAi = message.sender === 'ai';
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render simple formatted text with bold, code badges, and bullet points
  const formatText = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, lIdx) => {
      // Subheading
      if (line.startsWith('### ')) {
        return (
          <h4 key={lIdx} className="font-bold text-gray-900 text-sm mt-2 mb-1">
            {line.replace('### ', '').replace(/\*\*/g, '')}
          </h4>
        );
      }

      // Bullet line
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, '') : line;

      // Inline formatting helper
      const parts = cleanLine.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={pIdx} className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-xs font-mono font-semibold border border-gray-200">
              {part.slice(1, -1)}
            </code>
          );
        } else if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-gray-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-gray-400 text-xs font-bold shrink-0 mt-0.5">•</span>
            <span className="text-sm text-gray-800 leading-relaxed flex-1">{renderedLine}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }

      return (
        <p key={lIdx} className="text-sm text-gray-800 leading-relaxed">
          {renderedLine}
        </p>
      );
    });
  };

  // Detect navigation suggestions in AI messages
  const navPills = [];
  if (isAi && message.text) {
    const textLower = message.text.toLowerCase();
    if (textLower.includes('upload') || textLower.includes('synchronize')) {
      navPills.push({ label: 'Go to Upload Data', href: '/upload' });
    }
    if (textLower.includes('forecast') || textLower.includes('predict')) {
      navPills.push({ label: 'View Forecasting', href: '/forecast' });
    }
    if (textLower.includes('product') || textLower.includes('stock') || textLower.includes('sku')) {
      navPills.push({ label: 'Check Products', href: '/products' });
    }
    if (textLower.includes('customer') || textLower.includes('churn')) {
      navPills.push({ label: 'Customer Analytics', href: '/customers' });
    }
    if (textLower.includes('report')) {
      navPills.push({ label: 'Generated Reports', href: '/reports' });
    }
  }

  return (
    <div className={`flex w-full gap-3 sm:gap-4 py-3.5 sm:py-5 px-3 md:px-6 font-sans ${isAi ? 'bg-gray-50/60 border-y border-gray-100' : 'bg-white'}`}>
      {/* Avatar Icon */}
      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded border flex items-center justify-center shrink-0 mt-0.5
        ${isAi ? 'bg-black border-black text-white shadow-xs' : 'bg-gray-100 border-gray-200 text-gray-700'}
      `}>
        {isAi ? <Sparkles size={12} className="sm:w-[13px] sm:h-[13px]" /> : <User size={12} className="sm:w-[13px] sm:h-[13px]" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-950">
              {isAi ? 'DashNova AI' : 'You'}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>

          {isAi && (
            <button
              onClick={handleCopy}
              className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-1 transition px-1.5 py-0.5 rounded border border-transparent hover:border-gray-200 cursor-pointer"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-green-600" />
                  <span className="text-green-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="space-y-1 overflow-x-auto max-w-full">
          {formatText(message.text)}
        </div>

        {/* Action navigation pills */}
        {navPills.length > 0 && (
          <div className="pt-3 flex flex-wrap gap-2 border-t border-gray-200/60 mt-3">
            {navPills.map((pill, pIdx) => (
              <button
                key={pIdx}
                onClick={() => navigate(pill.href)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-xs font-semibold text-gray-800 transition cursor-pointer shadow-2xs"
              >
                <span>{pill.label}</span>
                <ArrowRight size={11} className="text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

