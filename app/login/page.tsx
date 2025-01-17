'use client';

import { signInWithGoogle } from '../lib/supabase/client';

export default function LoginPage() {
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
        <div>
          <button
            onClick={signInWithGoogle}
            className="w-full flex justify-center py-4 px-4 border border-gray-600/50 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors"
          >
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.332-1.459,2.379-2.799,2.379h-2.545c-1.39,0-2.545-1.155-2.545-2.545v-2.545c0-1.39,1.155-2.545,2.545-2.545h2.545c1.34,0,2.432,1.047,2.799,2.379h-3.536C13.4,10.242,12.545,11.097,12.545,12.151z" />
              </svg>
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 