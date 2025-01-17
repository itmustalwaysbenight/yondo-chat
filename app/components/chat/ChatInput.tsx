// Path: app/components/chat/ChatInput.tsx
'use client';

import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row lg:max-w-4xl lg:mx-auto md:mx-4 mx-2">
      <div className="relative flex flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Send a message"
          rows={1}
          className="w-full resize-none bg-[#3a3b42] border border-gray-600/50 p-4 pr-12 text-white focus:ring-0 focus-visible:ring-0 focus:outline-none focus:border-gray-400 rounded-xl transition-colors text-base"
          style={{ maxHeight: '200px', height: '60px', overflowY: 'hidden' }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="absolute right-3 bottom-3.5 p-1 text-gray-400 hover:text-gray-200 disabled:hover:bg-transparent disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </form>
  );
}