// Path: app/components/chat/ChatMessage.tsx
'use client';

interface ChatMessageProps {
  role: string;
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`group w-full text-gray-100 border-b border-black/10 ${isUser ? 'bg-[#343541]' : 'bg-[#444654]'}`}>
      <div className="max-w-2xl mx-auto flex gap-6 p-6 text-lg">
        <div className="min-w-[40px] text-right font-semibold">
          {isUser ? 'You' : 'AI'}
        </div>
        <div className="prose prose-invert prose-lg flex-1">
          <p className="whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}