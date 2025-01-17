// Path: app/lib/gemini/client.ts
'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createTravelPlan } from '../supabase/client';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const getCurrentDateInfo = () => {
  const now = new Date();
  return {
    currentDate: now.toISOString().split('T')[0],
    currentYear: now.getFullYear()
  };
};

const { currentDate, currentYear } = getCurrentDateInfo();

const SYSTEM_PROMPT = `You are a travel planning assistant. The current date is ${currentDate}.

Your task is to:
1. Ask "This is Yondo. Where are you going?"
2. Then ask "When would you like to visit [destination]?"
3. When you have both the destination and dates, respond with a JSON object in this exact format:

{
  "function": "storeTravelPlan",
  "parameters": {
    "destination": "berlin",
    "start_date": "2024-06-01",
    "end_date": "2024-06-05"
  }
}

If user mentions relative dates like "next year", use ${currentYear + 1} as the year.
Keep responses focused and concise. Do not provide any additional information.`;

export interface TravelPlan {
  destination: string;
  start_date: string;
  end_date: string;
  user_id?: string;
}

export const getTravelResponse = async (userInput: string, history: { role: string, content: string }[] = [], userId: string) => {
  console.log('\n=== PROCESSING MESSAGE ===');
  console.log('User input:', userInput);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 500,
    }
  });

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: "This is Yondo. Where are you going?" }]
      },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ]
  });

  try {
    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    console.log('Full response:', response);

    // Try to parse JSON from the response
    const text = response.text();
    console.log('Raw text response:', text);
    
    if (text) {
      try {
        console.log('Attempting to parse JSON from:', text);
        const parsed = JSON.parse(text);
        console.log('Successfully parsed JSON:', parsed);
        
        if (parsed.function === 'storeTravelPlan' && parsed.parameters) {
          console.log('✅ Valid function call detected');
          console.log('Function name:', parsed.function);
          console.log('Parameters:', parsed.parameters);
          
          const confirmation = await handleStoreTravelPlan(parsed.parameters, userId);
          console.log('Got confirmation:', confirmation);
          return confirmation;
        } else {
          console.log('❌ Not a valid function call:', parsed);
        }
      } catch (e) {
        // Not JSON or not in the expected format, just return the response
        console.log('❌ Failed to parse JSON:', e);
        console.log('Raw text was:', text);
      }
    } else {
      console.log('❌ No text in response');
    }
    
    return text || "I didn't understand that. Could you please try again?";
  } catch (error) {
    console.error('Error in getTravelResponse:', error);
    throw error;
  }
};

export const handleStoreTravelPlan = async (
  info: TravelPlan,
  userId: string
) => {
  console.log('🔥 handleStoreTravelPlan CALLED!');
  try {
    console.log('\n=== STORING TRAVEL PLAN ===');
    console.log('📍 Destination:', info.destination);
    console.log('📅 Start date:', info.start_date);
    console.log('📅 End date:', info.end_date);
    console.log('👤 User ID:', userId);
    
    const storedPlan = await createTravelPlan(
      userId,
      info.destination,
      info.start_date,
      info.end_date
    );
    
    console.log('\n✅ TRAVEL PLAN STORED SUCCESSFULLY');
    console.log('ID:', storedPlan.id);
    console.log('Created at:', storedPlan.created_at);
    console.log('===========================\n');
    
    return `Great! I've saved your trip to ${info.destination} from ${info.start_date} to ${info.end_date}.`;
  } catch (error) {
    console.log('\n❌ FAILED TO STORE TRAVEL PLAN');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('===========================\n');
    return `I've noted your trip to ${info.destination} from ${info.start_date} to ${info.end_date}, but there was an issue saving it.`;
  }
};