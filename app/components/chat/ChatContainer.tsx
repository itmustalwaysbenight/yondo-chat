// Path: app/components/chat/ChatContainer.tsx
'use client';

import { useChat } from '../../hooks/useChat';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useEffect, useRef } from 'react';

interface Message {
  content: string;
  role: string;
}

export default function ChatContainer() {
  const { messages, isLoading, error, sendMessage, addMessage: hookAddMessage } = useChat();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }
    router.push('/login');
  };

  const addMessage = (content: string) => {
    console.log('ChatContainer: Adding message:', content);
    hookAddMessage(content);
  };

  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#343541]">
      <ChatHeader onSignOut={handleSignOut} addMessage={addMessage} />
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto" id="chat-messages">
          <div className="max-w-2xl mx-auto px-4">
            {error && (
              <div className="mt-4 p-4 bg-red-900/10 border border-red-900/20 text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-6 pb-32 pt-8">
              {messages.map((message: Message, index: number) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              <div ref={messagesEndRef} /> {/* Scroll anchor */}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-[#343541]/0 to-[#343541] pt-32 pb-8">
          <div className="max-w-2xl mx-auto px-4">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}