'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getTravelResponse, handleStoreTravelPlan } from '../lib/gemini/client';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userId');
      if (stored) return stored;
      const newId = uuidv4();
      localStorage.setItem('userId', newId);
      return newId;
    }
    return uuidv4();
  });

  // Add initial greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: uuidv4(),
      content: "Hi! I'm your travel assistant. Where would you like to travel to?",
      role: 'assistant',
      created_at: new Date().toISOString()
    };
    setMessages([initialMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        content,
        role: 'user',
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Get chat history in the format expected by the API
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get AI response
      const response = await getTravelResponse(content, history, userId);
      
      if (response) {
        // Add AI response
        setMessages(prev => [...prev, {
          id: uuidv4(),
          content: response,
          role: 'assistant',
          created_at: new Date().toISOString(),
        }]);
      }

    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [messages, userId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
};