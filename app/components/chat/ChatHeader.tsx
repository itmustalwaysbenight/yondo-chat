// Path: app/components/chat/ChatHeader.tsx
'use client';

export default function ChatHeader() {
  return (
    <div className="border-b border-white/10 bg-[#1C1C1F]/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-32 py-4">
        <div className="flex items-center">
          <span className="text-lg font-semibold text-white tracking-tight">Yondo</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium 
                     text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Share"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="ml-2">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}