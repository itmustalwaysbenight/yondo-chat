'use client';

import { signInWithGoogle } from '../lib/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we're already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      if (session) {
        console.log('User is already logged in, redirecting to home');
        router.replace('/');
      }
    };
    
    checkSession();
  }, [router]);

  const handleSignIn = async () => {
    try {
      console.log('Login button clicked');
      setIsLoading(true);
      setError(null);
      
      const result = await signInWithGoogle();
      console.log('Sign-in result:', result);
      
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#343541]">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans text-center">
            Yondo
          </h1>
          <p className="mt-4 text-center text-gray-400">
            Your AI travel companion
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-gray-600/50 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.332-1.459,2.379-2.799,2.379h-2.545c-1.39,0-2.545-1.155-2.545-2.545v-2.545c0-1.39,1.155-2.545,2.545-2.545h2.545c1.34,0,2.432,1.047,2.799,2.379h-3.536C13.4,10.242,12.545,11.097,12.545,12.151z" />
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 