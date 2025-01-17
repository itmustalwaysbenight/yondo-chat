// Path: app/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { TravelPlan } from '../gemini/client';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const createTravelPlan = async (plan: TravelPlan) => {
  const { data, error } = await supabase
    .from('travel_plans')
    .insert(plan)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTravelPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from('travel_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};