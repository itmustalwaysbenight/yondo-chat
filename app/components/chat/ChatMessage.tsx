// Path: app/components/chat/ChatMessage.tsx
'use client';

interface ChatMessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8`}>
      {!isUser && (
        <div className="w-8 h-8 bg-blue-600 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">Y</span>
        </div>
      )}
      <div className={`
        max-w-[80%] md:max-w-[70%] lg:max-w-[60%]
        rounded-2xl
        px-8 py-5
        transition-all
        ${isUser ? 
          'bg-blue-600 text-white' : 
          'bg-[#2C2C2F] text-white/90'
        }
      `}>
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}