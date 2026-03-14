'use client';

import { CheckInRecord } from '@/types';
import { EMOTION_CONFIG, EmotionType } from '@/types';
import { getWeekday } from '@/lib/storage';

interface WeekReviewProps {
  records: CheckInRecord[];
}

export default function WeekReview({ records }: WeekReviewProps) {
  // 生成过去7天的数据（包括没有记录的日期）
  const today = new Date();
  const weekDays: { date: string; record?: CheckInRecord }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const record = records.find(r => r.date === dateStr);
    weekDays.push({ date: dateStr, record });
  }
  
  // 统计本周情绪
  const emotionCounts = records.reduce((acc, r) => {
    acc[r.emotion] = (acc[r.emotion] || 0) + 1;
    return acc;
  }, {} as Record<EmotionType, number>);
  
  const dominantEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as EmotionType | undefined;
  
  return (
    <div className="space-y-6">
      {/* 情绪曲线 - Emoji + 渐变色块 */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">本周情绪曲线</h3>
        <div className="flex justify-between items-end gap-2 h-24">
          {weekDays.map(({ date, record }) => {
            const config = record ? EMOTION_CONFIG[record.emotion] : null;
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t-lg flex items-center justify-center text-xl transition-all duration-300 hover:scale-105"
                  style={{ 
                    height: record ? '60px' : '20px',
                    backgroundColor: config ? config.color + '60' : '#F0F0F0',
                  }}
                >
                  {record && <span>{config?.emoji}</span>}
                </div>
                <span className="text-xs text-gray-400">{getWeekday(date)}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 本周总结 */}
      {dominantEmotion && (
        <div className="bg-[#F5EDE4] rounded-2xl p-5">
          <p className="text-gray-700">
            这周你Mostly感受到 
            <span className="mx-1 font-medium">
              {EMOTION_CONFIG[dominantEmotion].emoji} {EMOTION_CONFIG[dominantEmotion].label}
            </span>
            共有 
            <span className="mx-1 font-medium">{records.length}</span> 
            次签到记录
          </p>
        </div>
      )}
      
      {/* 没有记录时 */}
      {records.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>这周还没有签到记录</p>
          <p className="text-sm mt-1">开始你的第一次签到吧</p>
        </div>
      )}
    </div>
  );
}
