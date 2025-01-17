'use client';

import { useState, useEffect } from 'react';
import { getTravelResponse } from '../lib/gemini/client';
import { supabase, createTravelPlan } from '../lib/supabase/client';
import { useRouter } from 'next/navigation';

export const useChat = () => {
  const [messages, setMessages] = useState<{ content: string; role: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);

        // Set initial greeting
        const greeting = 'This is Yondo. Where are you going?';
        setMessages([{ content: greeting, role: 'assistant' }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to initialize chat');
      }
    };

    initializeChat();
  }, [router]);

  const sendMessage = async (content: string) => {
    if (!userId) {
      setError('Chat not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to state
      const userMessage = { content, role: 'user' };
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const aiResponse = await getTravelResponse(content, messages, userId);
      
      // Add AI response to state
      const assistantMessage = { content: aiResponse, role: 'assistant' };
      setMessages(prev => [...prev, assistantMessage]);

      // If the response contains travel plan data, store it in Supabase
      try {
        const travelPlan = JSON.parse(aiResponse);
        if (travelPlan.travel_plan) {
          await createTravelPlan(
            userId,
            travelPlan.travel_plan.destination,
            travelPlan.travel_plan.start_date,
            travelPlan.travel_plan.end_date
          );
        }
      } catch (e) {
        // Not a travel plan JSON response, ignore
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};