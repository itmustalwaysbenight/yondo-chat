// Path: app/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface TravelPlan {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const createTravelPlan = async (userId: string, destination: string, startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('travel_plans')
      .insert([
        {
          user_id: userId,
          destination,
          start_date: startDate,
          end_date: endDate,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating travel plan:', error.message, error.details, error.hint, error.code);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createTravelPlan:', error);
    throw error;
  }
};