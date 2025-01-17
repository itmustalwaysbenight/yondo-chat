// Path: app/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export const createMessage = async ({ 
  content, 
  role 
}: { 
  content: string; 
  role: 'user' | 'assistant' 
}): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content, role }])
    .select()
    .single();

  if (error) throw error;
  return data;
};