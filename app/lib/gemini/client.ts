// Path: app/lib/gemini/client.ts
'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createTravelPlan, deleteTravelPlan, getCurrentUser, getTravelPlans } from '../supabase/client';

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

const SYSTEM_PROMPT = `You are Yondo, a travel assistant. You maintain a natural, ongoing conversation with the user.

When users mention a destination and dates, respond with this JSON structure:
{
  "function": "storeTravelPlan",
  "parameters": {
    "destination": "city",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  }
}

When users want to delete a trip, respond with:
{
  "function": "delete_trip",
  "parameters": {
    "destination": "city",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  }
}

For trip-related actions:
1. Only use JSON responses for storing or deleting trips
2. For relative dates, use dates from the next occurrence
3. When users ask about their trips, respond conversationally
4. Maintain conversation context - don't repeat greetings or introductions
5. Start with "This is Yondo. Where are you going?" only for the very first message

Keep the conversation flowing naturally as one continuous chat.`;

export interface TravelPlan {
  destination: string;
  start_date: string;
  end_date: string;
  user_id?: string;
}

const parseTravelPlanAction = (text: string): any => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const json = JSON.parse(jsonMatch[0]);
    if (json.function === 'delete_trip' && json.parameters) {
      return {
        type: 'delete',
        destination: json.parameters.destination,
        start_date: json.parameters.start_date,
        end_date: json.parameters.end_date
      };
    }
    return null;
  } catch (e) {
    console.log('Failed to parse travel plan action:', e);
    return null;
  }
};

const MODEL_NAME = "gemini-1.5-flash-latest";

export const getTravelResponse = async (
  userInput: string,
  history: { role: string; content: string }[],
  userId: string
): Promise<string> => {
  try {
    // Skip processing if the input looks like an error message or log
    if (userInput.includes('client.ts:') || 
        userInput.includes('Attempting to parse JSON from:') ||
        userInput.includes('❌ Failed to parse JSON:')) {
      return "I didn't quite understand that. Could you please tell me where you'd like to travel?";
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        ...(history.length === 0 ? [{
          role: 'model',
          parts: [{ text: "This is Yondo. Where are you going?" }]
        }] : []),
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    const text = response.text();
    console.log('Raw response:', text);

    // For trip listing requests, fetch and format trips
    if (userInput.toLowerCase().includes('trips') || userInput.toLowerCase().includes('plans')) {
      const user = await getCurrentUser();
      if (!user?.id) {
        throw new Error('No user ID found');
      }
      const trips = await getTravelPlans(user.id);
      return await formatTravelPlans(trips);
    }

    // Check for deletion request
    const action = parseTravelPlanAction(text);
    if (action?.type === 'delete') {
      try {
        await deleteTravelPlan(userId, action.destination, action.start_date, action.end_date);
        return `I've deleted your trip to ${action.destination} from ${action.start_date} to ${action.end_date}. Would you like to see your remaining trips?`;
      } catch (error) {
        return `I couldn't delete that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
      }
    }

    // Try to parse JSON from the response
    if (text) {
      try {
        console.log('Attempting to parse JSON from:', text);
        
        // Extract JSON block using regex - look for content between ```json and ``` or just {}
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```|(\{[\s\S]*\})/);
        if (!jsonMatch) {
          console.log('❌ No JSON block found in response');
          return text;
        }
        
        // Use the first matching group (between ``` ```) or second group (just {})
        const jsonString = (jsonMatch[1] || jsonMatch[2]).trim();
        console.log('Extracted JSON string:', jsonString);
        
        const parsed = JSON.parse(jsonString);
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
  console.log('\n🔍 HANDLING TRAVEL PLAN');
  console.log('Current User ID:', userId);
  console.log('Travel Info:', info);
  
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
    console.log('User ID:', storedPlan.user_id);
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

export const formatTravelPlans = async (plans: TravelPlan[]) => {
  if (plans.length === 0) {
    return "You don't have any trips planned yet. Would you like to plan one?";
  }

  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME
  });

  const prompt = `You're in the middle of a conversation. List the travel plans warmly but without greetings or unnecessary connectors (no "hey there", "hi", "oh", "and", etc). 
If there's only one trip, state it directly but warmly. If there are multiple trips, create a natural flow between them.

Current trips:
${plans.map(plan => `- ${plan.destination} from ${plan.start_date} to ${plan.end_date}`).join('\n')}

Example responses:
For one trip: "Your trip to Paris is set for June 1st to June 5th! The city of lights awaits."
For multiple: "You're heading to Paris from June 1st to 5th, then off to Rome from July 10th to 15th. What wonderful adventures ahead!"

Keep it warm but direct, and avoid any filler words or unnecessary connectors.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Error formatting your trips.";
  } catch (error) {
    console.error('Error formatting travel plans:', error);
    return "Sorry, I couldn't retrieve your trips right now.";
  }
};