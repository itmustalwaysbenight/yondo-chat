// Path: app/components/chat/ChatHeader.tsx
'use client';

interface ChatHeaderProps {
  onSignOut: () => Promise<void>;
}

export default function ChatHeader({ onSignOut }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-24 w-full border-b border-black/10 bg-[#343541] px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans">Yondo</h1>
      </div>
      <button
        onClick={onSignOut}
        className="text-gray-400 hover:text-gray-200 text-sm px-3 py-1.5 rounded-md hover:bg-gray-900 transition-colors"
      >
        Sign Out
      </button>
    </header>
  );
}