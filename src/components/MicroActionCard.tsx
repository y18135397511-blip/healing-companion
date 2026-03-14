'use client';

import { MicroAction } from '@/types';

interface MicroActionCardProps {
  action: MicroAction;
  onComplete?: (completed: boolean) => void;
}

export default function MicroActionCard({ action, onComplete }: MicroActionCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5B7]/30"
      style={{ backgroundColor: '#FEFDFB' }}
    >
      <h3 className="text-base font-medium text-gray-800 mb-2">{action.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{action.description}</p>
      
      {onComplete && action.completed === null && (
        <div className="flex gap-3">
          <button
            onClick={() => onComplete(true)}
            className="flex-1 py-2 px-4 bg-[#C5E8D0] text-gray-700 rounded-xl text-sm font-medium hover:bg-[#B5D8C0] transition-colors"
          >
            完成了
          </button>
          <button
            onClick={() => onComplete(false)}
            className="flex-1 py-2 px-4 bg-[#E8E8E8] text-gray-600 rounded-xl text-sm font-medium hover:bg-[#D8D8D8] transition-colors"
          >
            没做
          </button>
        </div>
      )}
      
      {action.completed === true && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <span>✓</span>
          <span>已完成</span>
        </div>
      )}
      
      {action.completed === false && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>○</span>
          <span>没做，没关系</span>
        </div>
      )}
    </div>
  );
}
