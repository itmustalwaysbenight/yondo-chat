// Path: app/components/chat/ChatContainer.tsx
'use client';

import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useChat } from '../../hooks/useChat';

export default function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isLoading, error } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#1C1C1F] text-white">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-32 py-6 space-y-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg" role="alert">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="px-4 md:px-8 lg:px-32 pb-6 flex justify-center">
        <div className="w-full max-w-3xl">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}