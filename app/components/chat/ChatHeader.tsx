// Path: app/components/chat/ChatHeader.tsx
'use client';

import { supabase, checkUserTrips } from '../../lib/supabase/client';

export default function ChatHeader() {
  const handleCheckTrips = () => {
    alert('Checking trips...');
    console.log('🔍 Check Trips button clicked');
    checkUserTrips()
      .then(trips => {
        console.log('✅ Trips fetched successfully:', trips);
        alert('Check console for trips!');
      })
      .catch(error => {
        console.error('❌ Error fetching trips:', error);
        alert('Error fetching trips. Check console.');
      });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between p-8 bg-[#343541]">
      <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans">
        Yondo
      </h1>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleCheckTrips}
          className="px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors border border-gray-600/50"
        >
          Check Trips
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors border border-gray-600/50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}