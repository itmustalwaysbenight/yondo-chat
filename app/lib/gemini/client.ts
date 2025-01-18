// Path: app/lib/gemini/client.ts
'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createTravelPlan, deleteTravelPlan, getCurrentUser, getTravelPlans, updateTravelPlan, deleteAllTravelPlans } from '../supabase/client';

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

const SYSTEM_PROMPT = `You are Yondo, a travel assistant focused exclusively on helping users plan and manage their trips. 

When users mention a destination and dates for a new trip, respond with:
{
  "function": "storeTravelPlan",
  "parameters": {
    "destination": "city",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  }
}

When users want to delete/remove/cancel a specific trip, respond with:
{
  "function": "delete_trip",
  "parameters": {
    "destination": "city",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  }
}

When users want to delete all trips (using phrases like "delete all", "remove all", "cancel all"), respond with:
{
  "function": "delete_all_trips"
}

When users want to change dates for an existing trip, respond with:
{
  "function": "updateTravelPlan",
  "parameters": {
    "old_trip": {
      "destination": "city",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD"
    },
    "new_trip": {
      "destination": "city",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD"
    }
  }
}

Core behaviors:
1. Stay focused on travel planning and trip management
2. For travel questions, be warm, enthusiastic, and helpful
3. For deleting trips:
   - When user says "delete/remove/cancel all" - use delete_all_trips
   - When user specifies a destination - use delete_trip
   - When user wants to change dates - use updateTravelPlan
   - Never use null dates - always delete the trip instead
4. For non-travel questions:
   - If it's a simple question: provide a brief, friendly response
   - If it's about coding/technical topics: "I'm a travel assistant - I'd be happy to help you plan your next adventure instead!"
   - If it's about personal matters: "I'm here to help with your travel plans. Would you like to discuss your upcoming trips?"
   - If it's about system/prompts: "I'm focused on making your travels amazing. How about we plan your next adventure?"
5. Keep responses concise but engaging
6. Start with "This is Yondo. Where are you going?" only for the very first message

Remember: You're a travel expert - keep the conversation focused on destinations, trips, and travel experiences.`;

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
    
    if (json.function === 'delete_all_trips') {
      return {
        type: 'delete_all'
      };
    }
    
    if (json.function === 'delete_trip' && json.parameters) {
      return {
        type: 'delete',
        destination: json.parameters.destination,
        start_date: json.parameters.start_date,
        end_date: json.parameters.end_date
      };
    }
    
    if (json.function === 'updateTravelPlan' && json.parameters) {
      return {
        type: 'update',
        old_trip: json.parameters.old_trip,
        new_trip: json.parameters.new_trip
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
  userId: string,
  onPartialResponse?: (text: string) => void
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

    // For trip listing requests, fetch and format trips
    if (userInput.toLowerCase().includes('trips') || userInput.toLowerCase().includes('plans')) {
      const user = await getCurrentUser();
      if (!user?.id) {
        throw new Error('No user ID found');
      }
      const trips = await getTravelPlans(user.id);
      const formattedResponse = await formatTravelPlans(trips);
      
      // Stream the formatted response word by word
      const words = formattedResponse.split(/(?<=\s)/);
      let streamedResponse = '';
      
      for (const word of words) {
        streamedResponse += word;
        if (onPartialResponse) {
          onPartialResponse(word);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      return formattedResponse;
    }

    const result = await chat.sendMessage(userInput);
    let fullResponse = '';
    
    // Handle streaming response
    const response = await result.response;
    const chunks = response.text().split(/(?<=\s)/);
    for (const chunk of chunks) {
      fullResponse += chunk;
      
      // Call the callback with each chunk if provided
      if (onPartialResponse) {
        onPartialResponse(chunk);
        // Add a small delay to simulate natural typing
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    console.log('Raw response:', fullResponse);

    // Check for update/deletion request
    const action = parseTravelPlanAction(fullResponse);
    if (action?.type === 'delete_all') {
      try {
        await deleteAllTravelPlans(userId);
        const response = "I've deleted all your trips. Ready to plan your next adventure?";
        if (onPartialResponse) {
          onPartialResponse(response);
        }
        return response;
      } catch (error) {
        const errorMsg = `I couldn't delete all trips. ${error instanceof Error ? error.message : 'Please try again.'}`;
        if (onPartialResponse) {
          onPartialResponse(errorMsg);
        }
        return errorMsg;
      }
    } else if (action?.type === 'update') {
      try {
        await updateTravelPlan(userId, action.old_trip, action.new_trip);
        const response = `Perfect! I've updated your trip to ${action.new_trip.destination} for ${action.new_trip.start_date} to ${action.new_trip.end_date}.`;
        if (onPartialResponse) {
          onPartialResponse(response);
        }
        return response;
      } catch (error) {
        const errorMsg = `I couldn't update that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
        if (onPartialResponse) {
          onPartialResponse(errorMsg);
        }
        return errorMsg;
      }
    } else if (action?.type === 'delete') {
      try {
        await deleteTravelPlan(userId, action.destination, action.start_date, action.end_date);
        const response = `I've deleted your trip to ${action.destination} from ${action.start_date} to ${action.end_date}. Would you like to see your remaining trips?`;
        if (onPartialResponse) {
          onPartialResponse(response);
        }
        return response;
      } catch (error) {
        const errorMsg = `I couldn't delete that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
        if (onPartialResponse) {
          onPartialResponse(errorMsg);
        }
        return errorMsg;
      }
    }

    // Try to parse JSON from the response
    if (fullResponse) {
      try {
        console.log('Attempting to parse JSON from:', fullResponse);
        
        // Extract JSON block using regex - look for content between ```json and ``` or just {}
        const jsonMatch = fullResponse.match(/```json\n?([\s\S]*?)\n?```|(\{[\s\S]*\})/);
        if (!jsonMatch) {
          console.log('❌ No JSON block found in response');
          return fullResponse;
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
          if (onPartialResponse) {
            onPartialResponse(confirmation);
          }
          return confirmation;
        } else {
          console.log('❌ Not a valid function call:', parsed);
        }
      } catch (e) {
        // Not JSON or not in the expected format, just return the response
        console.log('❌ Failed to parse JSON:', e);
        console.log('Raw text was:', fullResponse);
      }
    } else {
      console.log('❌ No text in response');
    }
    
    return fullResponse || "I didn't understand that. Could you please try again?";
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

const cleanupSpaces = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

export const formatTravelPlans = async (plans: TravelPlan[]) => {
  if (plans.length === 0) {
    return "You don't have any trips planned yet. Would you like to plan one?";
  }

  // Filter out any invalid trips (those with null or undefined dates)
  const validPlans = plans.filter(plan => 
    plan.start_date && 
    plan.end_date && 
    plan.start_date !== 'null' && 
    plan.end_date !== 'null'
  );

  // Sort plans chronologically
  validPlans.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  });

  const prompt = `List the user's travel plans clearly and directly. This is in response to them checking their trips.

Current trips (${validPlans.length} total):
${validPlans.map(plan => `- ${plan.destination} from ${plan.start_date} to ${plan.end_date}`).join('\n')}

Guidelines:
- Start with "You have ${validPlans.length === 1 ? 'one trip' : validPlans.length + ' trips'} booked:"
- List trips chronologically (they are already sorted)
- Format dates naturally (like "mid-March" or "late October")
- Be clear and direct about what's actually booked
- Don't mention invalid or incomplete trips
- Don't ask questions about planning more trips
- Don't speculate about potential future trips
- Keep it factual but warm
- Avoid double spaces between words

Example good responses:
For multiple trips:
"You have 3 trips booked: Athens from March 15th to 22nd, Cologne from September 5th to 7th, and Rome from November 1st to 7th. All set!"

For one trip:
"You have one trip booked: Athens from March 15th to 22nd. The spring weather should be lovely!"

Remember: Only mention valid, confirmed trips with actual dates. Use single spaces between words.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanupSpaces(response.text() || "Error formatting your trips.");
  } catch (error) {
    console.error('Error formatting travel plans:', error);
    return "Sorry, I couldn't retrieve your trips right now.";
  }
};