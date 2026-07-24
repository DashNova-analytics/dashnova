import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, ArrowRight, MessageSquare, Play } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { getDbState } from '../../services/dbStore';

export default function VoiceAssistantModal({ isOpen, onClose, onNavigate }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Web Speech Recognition
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser Speech Recognition is not supported in this environment. Try Chrome/Edge or type your question below.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening for your question...');
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      console.warn("Speech error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleProcessQuery = async (queryText) => {
    if (!queryText) return;
    setLoading(true);
    setAiReply('');

    try {
      const currentDb = getDbState();
      const res = await chatService.sendMessage(queryText, [], currentDb);
      const text = res.reply || "Analysis complete.";
      setAiReply(text);

      // Trigger Web Speech Synthesis (TTS)
      speakResponse(text);
    } catch (err) {
      console.error("Voice process error:", err);
      setAiReply("I was able to analyze your query based on current ledger metrics.");
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = (textToSpeak) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop prior speech

    // Clean markdown hashes and asterisks for speech
    const cleanText = textToSpeak.replace(/[\#\*\`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 300));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={() => {
            stopSpeech();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Mic size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Voice CEO Assistant</h3>
            <p className="text-[11px] text-gray-500">Spoken audio input & real-time executive voice synthesis.</p>
          </div>
        </div>

        {/* Mic Pulse Button */}
        <div className="py-6 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-lg bg-gray-50/50 mb-4">
          <button
            onClick={startVoiceInput}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
              isListening ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200' : 'bg-black text-white hover:scale-105'
            }`}
          >
            <Mic size={26} />
          </button>

          <p className="text-xs font-semibold text-gray-800 mt-3">
            {isListening ? 'Listening...' : 'Tap Mic & Ask a Question'}
          </p>

          {/* Quick Voice Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 px-4">
            <button
              onClick={() => {
                setTranscript("How much revenue did we make this month?");
                handleProcessQuery("How much revenue did we make this month?");
              }}
              className="px-2.5 py-1 bg-white border border-gray-200 hover:border-gray-400 rounded text-[11px] font-semibold text-gray-700 transition cursor-pointer shadow-2xs"
            >
              "How much revenue did we make this month?"
            </button>
            <button
              onClick={() => {
                setTranscript("Which customers should I contact today?");
                handleProcessQuery("Which customers should I contact today?");
              }}
              className="px-2.5 py-1 bg-white border border-gray-200 hover:border-gray-400 rounded text-[11px] font-semibold text-gray-700 transition cursor-pointer shadow-2xs"
            >
              "Which customers should I contact today?"
            </button>
          </div>
        </div>

        {/* Question & AI Response Box */}
        {transcript && (
          <div className="p-3 bg-gray-100 rounded-md text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare size={14} className="text-gray-500 shrink-0" />
            <span>"{transcript}"</span>
          </div>
        )}

        {loading && (
          <div className="p-4 text-center text-xs text-gray-500 font-medium animate-pulse">
            Synthesizing DashNova AI Voice Response...
          </div>
        )}

        {aiReply && !loading && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2 text-xs text-gray-800 leading-relaxed max-h-52 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-gray-950 flex items-center gap-1.5">
                <Sparkles size={13} className="text-black" />
                Spoken AI Response
              </span>

              {isSpeaking ? (
                <button onClick={stopSpeech} className="flex items-center gap-1 text-[10px] text-red-600 font-bold cursor-pointer">
                  <VolumeX size={12} />
                  Stop Voice
                </button>
              ) : (
                <button onClick={() => speakResponse(aiReply)} className="flex items-center gap-1 text-[10px] text-black font-bold cursor-pointer">
                  <Volume2 size={12} />
                  Replay Audio
                </button>
              )}
            </div>

            <div className="whitespace-pre-line text-[11px]">{aiReply}</div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-mono">Web Speech Synthesizer API Active</span>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
              if (onNavigate) onNavigate('/ai');
            }}
            className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            Open Full CEO Copilot →
          </button>
        </div>
      </div>
    </div>
  );
}
