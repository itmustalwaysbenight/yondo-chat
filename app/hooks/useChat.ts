'use client';

import { useState, useEffect } from 'react';
import { getTravelResponse } from '../lib/gemini/client';
import { supabase, createTravelPlan, getCurrentUser } from '../lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Message {
  content: string;
  role: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'This is Yondo. Where are you going?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addMessage = (content: string) => {
    console.log('Adding message:', content);
    setMessages(prevMessages => {
      console.log('Previous messages:', prevMessages);
      const newMessages = [...prevMessages, {
        role: 'assistant',
        content
      }];
      console.log('New messages:', newMessages);
      return newMessages;
    });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() && !isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user?.id) {
        throw new Error('No user ID found');
      }

      const newMessages = [...messages, { role: 'user', content }];
      setMessages(newMessages);

      const response = await getTravelResponse(content, messages, user.id);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (e) {
      console.error('Error in sendMessage:', e);
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage
  };
};