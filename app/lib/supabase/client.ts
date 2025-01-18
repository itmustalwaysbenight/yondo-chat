// Path: app/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { getBaseUrl } from '../utils/url';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const checkUserTrips = async () => {
  try {
    console.log('\n=== CHECKING USER INFO ===');
    const user = await getCurrentUser();
    
    if (!user) {
      const error = 'No user logged in - please sign in first';
      console.error('❌', error);
      throw new Error(error);
    }

    console.log('✅ User found:');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('===============================\n');
    
    const trips = await getTravelPlans(user.id);
    
    if (!trips || trips.length === 0) {
      console.log('ℹ️ No trips found for this user');
      return [];
    }
    
    console.log('✅ Found', trips.length, 'trips:');
    trips.forEach((trip, index) => {
      console.log(`\nTrip ${index + 1}:`);
      console.log('🌍 Destination:', trip.destination);
      console.log('📅 Start:', trip.start_date);
      console.log('📅 End:', trip.end_date);
    });
    
    return trips;
  } catch (error) {
    console.error('\n❌ ERROR IN checkUserTrips');
    if (error instanceof Error) {
      console.error('Message:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    console.error('===============================\n');
    throw error;
  }
};

export interface TravelPlan {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const getTravelPlans = async (userId: string) => {
  try {
    console.log('\n=== FETCHING TRAVEL PLANS ===');
    console.log('User ID:', userId);

    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('\n❌ ERROR FETCHING TRAVEL PLANS');
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      throw error;
    }

    console.log('\n✅ TRAVEL PLANS FETCHED');
    console.log('Number of plans:', data?.length);
    console.log('Plans:', data);
    console.log('===============================\n');

    return data;
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR');
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('===============================\n');
    throw error;
  }
};

export const createTravelPlan = async (userId: string, destination: string, startDate: string, endDate: string) => {
  try {
    console.log('\n=== CREATING TRAVEL PLAN IN SUPABASE ===');
    console.log('User ID:', userId);
    console.log('Destination:', destination);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const { data, error } = await supabase
      .from('travel_plans')
      .insert([
        {
          user_id: userId,
          destination: destination.toLowerCase(),
          start_date: startDate,
          end_date: endDate,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('\n❌ SUPABASE ERROR');
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
      console.error('Code:', error.code);
      throw error;
    }

    console.log('\n✅ TRAVEL PLAN CREATED');
    console.log('Stored Data:', data);
    console.log('===============================\n');

    // Fetch and log all travel plans after creating a new one
    await getTravelPlans(userId);

    return data;
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR');
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('===============================\n');
    throw error;
  }
};

export const deleteTravelPlan = async (userId: string, destination: string, start_date: string, end_date: string) => {
  console.log('\n=== DELETING TRAVEL PLAN ===');
  console.log('User ID:', userId);
  console.log('Destination:', destination);
  console.log('Start Date:', start_date);
  console.log('End Date:', end_date);

  try {
    const { data, error } = await supabase
      .from('travel_plans')
      .delete()
      .match({
        user_id: userId,
        destination: destination.toLowerCase(),
        start_date,
        end_date
      })
      .select();

    if (error) throw error;

    console.log('\n✅ TRAVEL PLAN DELETED');
    console.log('Deleted Data:', data);
    console.log('===========================\n');
    
    return data;
  } catch (error) {
    console.log('\n❌ FAILED TO DELETE TRAVEL PLAN');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('===========================\n');
    throw error;
  }
};

export const updateTravelPlan = async (
  userId: string,
  oldTrip: { destination: string; start_date: string; end_date: string },
  newTrip: { destination: string; start_date: string; end_date: string }
) => {
  try {
    console.log('\n=== UPDATING TRAVEL PLAN ===');
    console.log('User ID:', userId);
    console.log('Old trip:', oldTrip);
    console.log('New trip:', newTrip);

    // Delete the old trip
    const { error: deleteError } = await supabase
      .from('travel_plans')
      .delete()
      .match({
        user_id: userId,
        destination: oldTrip.destination.toLowerCase(),
        start_date: oldTrip.start_date,
        end_date: oldTrip.end_date
      });

    if (deleteError) throw deleteError;

    // Create the new trip
    const { data, error: insertError } = await supabase
      .from('travel_plans')
      .insert([
        {
          user_id: userId,
          destination: newTrip.destination.toLowerCase(),
          start_date: newTrip.start_date,
          end_date: newTrip.end_date,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('\n✅ TRAVEL PLAN UPDATED');
    console.log('Updated Data:', data);
    console.log('===========================\n');

    return data;
  } catch (error) {
    console.error('\n❌ FAILED TO UPDATE TRAVEL PLAN');
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('===========================\n');
    throw error;
  }
};

export const deleteAllTravelPlans = async (userId: string) => {
  console.log('\n=== DELETING ALL TRAVEL PLANS ===');
  console.log('User ID:', userId);

  try {
    const { data, error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('user_id', userId)
      .select();

    if (error) throw error;

    console.log('\n✅ ALL TRAVEL PLANS DELETED');
    console.log('Number of trips deleted:', data?.length);
    console.log('===========================\n');
    
    return data;
  } catch (error) {
    console.log('\n❌ FAILED TO DELETE ALL TRAVEL PLANS');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('===========================\n');
    throw error;
  }
};