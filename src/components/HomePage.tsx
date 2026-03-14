'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DailyCheckIn, CheckInRecord } from '@/types';
import { getTodayCheckIn, getWeekRecords } from '@/lib/storage';
import EmotionDisplay from './EmotionDisplay';
import WeekReview from './WeekReview';
import Link from 'next/link';

export default function HomePage() {
  const [dailyCheckIn, setDailyCheckIn] = useState<DailyCheckIn>({ hasCheckedIn: false });
  const [weekRecords, setWeekRecords] = useState<CheckInRecord[]>([]);
  const [showWeekReview, setShowWeekReview] = useState(false);
  const pathname = usePathname();
  
  // 每次路由变化时刷新数据
  useEffect(() => {
    setDailyCheckIn(getTodayCheckIn());
    setWeekRecords(getWeekRecords());
  }, [pathname]);
  
  return (
    <div className="min-h-screen px-6 py-8" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-md mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-gray-800">疗愈助手</h1>
          <p className="text-gray-400 text-sm">今天也要好好照顾自己</p>
        </div>
        
        {/* 今日状态卡片 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ backgroundColor: '#FEFDFB' }}>
          {dailyCheckIn.hasCheckedIn && dailyCheckIn.lastCheckIn ? (
            <div className="text-center space-y-4">
              <p className="text-gray-500">今日签到已完成</p>
              <div className="flex justify-center">
                <EmotionDisplay emotion={dailyCheckIn.lastCheckIn.emotion} size="lg" />
              </div>
              <p className="text-sm text-gray-400">
                {new Date(dailyCheckIn.lastCheckIn.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} 完成
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-500">今天还没有签到</p>
              <p className="text-sm text-gray-400">花5分钟和自己对话吧</p>
            </div>
          )}
        </div>
        
        {/* 签到按钮 */}
        <Link href="/checkin">
          <button 
            className="w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              backgroundColor: dailyCheckIn.hasCheckedIn ? '#C5E8D0' : '#E8D5B7',
              color: '#4A4A4A',
            }}
          >
            {dailyCheckIn.hasCheckedIn ? '再次签到' : '开始签到'}
          </button>
        </Link>
        
        {/* 周回顾入口 */}
        <button
          onClick={() => setShowWeekReview(!showWeekReview)}
          className="w-full py-4 bg-white rounded-2xl text-lg font-medium shadow-sm hover:shadow-md transition-all"
          style={{ backgroundColor: '#FEFDFB', color: '#4A4A4A' }}
        >
          {showWeekReview ? '收起回顾' : '本周回顾'}
        </button>
        
        {/* 周回顾内容 */}
        {showWeekReview && (
          <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ backgroundColor: '#FEFDFB' }}>
            <WeekReview records={weekRecords} />
          </div>
        )}
        
        {/* 底部提示 */}
        <p className="text-center text-xs text-gray-300 pt-4">
          不保存任何数据到云端 · 你的隐私很安全
        </p>
      </div>
    </div>
  );
}
