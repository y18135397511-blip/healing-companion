'use client';

import { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.type === 'ai';
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl ${
          isAI
            ? 'bg-[#F5EDE4] text-gray-800 rounded-bl-md'
            : 'bg-[#E8D5B7] text-gray-800 rounded-br-md'
        }`}
        style={{ 
          backgroundColor: isAI ? '#F5EDE4' : '#E8D5B7',
        }}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs text-gray-400 mt-2 block">
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}
