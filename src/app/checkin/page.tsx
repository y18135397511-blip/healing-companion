'use client';

import { useRouter } from 'next/navigation';
import CheckInChat from '@/components/CheckInChat';

export default function CheckInPage() {
  const router = useRouter();
  
  const handleComplete = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      {/* 顶部导航 */}
      <div className="sticky top-0 px-4 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
        <button
          onClick={handleComplete}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回
        </button>
        <h1 className="text-lg font-medium text-gray-800">情绪签到</h1>
        <div className="w-12" /> {/* 占位保持居中 */}
      </div>
      
      {/* 聊天内容 */}
      <CheckInChat onComplete={handleComplete} />
    </div>
  );
}
