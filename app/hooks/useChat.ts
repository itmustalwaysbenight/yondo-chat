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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setUserId(user.id);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };
    checkUser();
  }, []);

  const addMessage = (content: string) => {
    console.log('Previous messages:', messages);
    setMessages(prev => {
      const newMessages = [...prev, { content, role: 'assistant' }];
      console.log('New messages:', newMessages);
      return newMessages;
    });
  };

  const updateLastMessage = (content: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: newMessages[newMessages.length - 1].content + content
        };
      }
      return newMessages;
    });
  };

  const sendMessage = async (content: string) => {
    if (!userId) {
      setError('Chat not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = { content, role: 'user' };
      setMessages(prev => [...prev, userMessage]);

      // Add empty assistant message that will be updated
      setMessages(prev => [...prev, { content: '', role: 'assistant' }]);

      // Get streaming response
      await getTravelResponse(
        content,
        messages,
        userId,
        (partialResponse) => {
          updateLastMessage(partialResponse);
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
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