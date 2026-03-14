'use client';

import { EMOTION_CONFIG, EmotionType } from '@/types';

interface EmotionDisplayProps {
  emotion: EmotionType;
  size?: 'sm' | 'md' | 'lg';
}

export default function EmotionDisplay({ emotion, size = 'md' }: EmotionDisplayProps) {
  const config = EMOTION_CONFIG[emotion];
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-xl px-6 py-3',
  };
  
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: config.color + '40',
        color: '#4A4A4A',
      }}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
