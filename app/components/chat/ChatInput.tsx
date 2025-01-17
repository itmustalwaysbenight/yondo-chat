// Path: app/components/chat/ChatInput.tsx
'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message Yondo..."
        className="w-full px-8 py-5 bg-[#2C2C2F] rounded-2xl
                   text-lg text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50
                   resize-none h-[68px] pr-28"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || isLoading}
        className={`absolute right-4 top-1/2 -translate-y-1/2
                   px-5 py-2.5 rounded-xl text-base
                   transition-all
                   ${message.trim() && !isLoading ?
                     'bg-blue-600 text-white hover:bg-blue-700' :
                     'bg-gray-700 text-gray-400'
                   }`}
      >
        {isLoading ? 
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
          'Send'
        }
      </button>
    </div>
  );
}