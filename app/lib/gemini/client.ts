// Path: app/lib/gemini/client.ts
'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

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

const SYSTEM_PROMPT = `You are a travel planning assistant. The current date is ${currentDate} (YYYY-MM-DD format).

When destination and dates are provided, output in this exact format:

\`\`\`json {
  "travel_plan": {
    "destination": "[place]",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  }
}
\`\`\`

Keep responses focused on collecting:
1. Ask "Hi! I'm your travel assistant. Where would you like to travel to?"
2. Then ask "When would you like to visit [destination]?"
3. Output JSON when both are provided

If user mentions relative dates like "next year", use ${currentYear + 1} as the year.
Do not ask about or discuss anything else.`;

export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.1,
    candidateCount: 1,
    maxOutputTokens: 1000,
  }
});

export interface TravelPlan {
  destination: string;
  start_date: string;
  end_date: string;
}

export const parseTravelInfo = (response: string): TravelPlan | null => {
  try {
    // Find JSON between backticks
    const jsonMatch = response.match(/```json\s*({[\s\S]*?})\s*```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return parsed.travel_plan;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse travel info:', error);
    return null;
  }
};

export const handleStoreTravelPlan = async (info: TravelPlan) => {
  console.log('Storing travel plan:', info);
  return `Great! I've saved your trip to ${info.destination} from ${info.start_date} to ${info.end_date}.`;
};

export const getTravelResponse = async (userInput: string, history: { role: string, content: string }[] = []) => {
  // Always include system prompt as first message in history
  const fullHistory = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: "Hi! I'm your travel assistant. Where would you like to travel to?" }]
    },
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  ];

  const chat = geminiModel.startChat({
    history: fullHistory,
    generationConfig: {
      temperature: 0.1,
      candidateCount: 1,
      maxOutputTokens: 1000,
    }
  });

  const result = await chat.sendMessage([{ text: userInput }]);
  const response = await result.response;
  return response.text();
};