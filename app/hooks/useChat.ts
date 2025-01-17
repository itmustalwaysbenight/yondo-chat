'use client';

import { useState, useCallback, useEffect } from 'react';
import { getTravelResponse, parseTravelInfo, handleStoreTravelPlan } from '../lib/gemini/client';

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

  // Add initial greeting without adding it to Gemini history
  useEffect(() => {
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      content: "Hi! I'm your travel assistant. Where would you like to travel to?",
      role: 'assistant',
      created_at: new Date().toISOString()
    };
    setMessages([initialMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Convert messages to history format
      const history = messages
        .filter(msg => msg.role === 'user' || messages.some(m => m.role === 'user' && m.created_at < msg.created_at))
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          content: msg.content
        }));

      // Get response using new chat approach
      const aiResponse = await getTravelResponse(content, history);
      
      // Check for travel info
      const travelInfo = parseTravelInfo(aiResponse);
      
      if (travelInfo) {
        const confirmationMessage = await handleStoreTravelPlan(travelInfo);
        
        // Add AI response without the STORE_TRAVEL_PLAN part
        const cleanResponse = aiResponse.split('STORE_TRAVEL_PLAN')[0].trim();
        if (cleanResponse) {
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            content: cleanResponse,
            role: 'assistant',
            created_at: new Date().toISOString()
          }]);
        }
        
        // Add confirmation message
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          content: confirmationMessage,
          role: 'assistant',
          created_at: new Date().toISOString()
        }]);
      } else {
        // Normal response
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          content: aiResponse,
          role: 'assistant',
          created_at: new Date().toISOString()
        }]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, sendMessage, isLoading, error };
};