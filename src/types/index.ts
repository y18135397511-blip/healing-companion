// 情绪类型
export type EmotionType = 
  | 'anxious'    // 焦虑
  | 'sad'        // 难过
  | 'calm'       // 平静
  | 'happy'      // 开心
  | 'empty'      // 空虚
  | 'excited'    // 兴奋
  | 'confused'   // 困惑
  | 'tired';     // 疲惫

// 情绪标签配置
export const EMOTION_CONFIG: Record<EmotionType, { label: string; emoji: string; color: string }> = {
  anxious: { label: '有点焦虑', emoji: '😰', color: '#E8D5B7' },
  sad: { label: '难过', emoji: '😢', color: '#B8C5D6' },
  calm: { label: '平静', emoji: '😌', color: '#C5E8D0' },
  happy: { label: '开心', emoji: '😊', color: '#FFE5B4' },
  empty: { label: '空虚', emoji: '😐', color: '#D4C4B0' },
  excited: { label: '兴奋', emoji: '🤩', color: '#FFCBA4' },
  confused: { label: '困惑', emoji: '😕', color: '#C9B8D9' },
  tired: { label: '疲惫', emoji: '😴', color: '#C4B7A6' },
};

// 用户回答
export interface UserAnswer {
  questionId: number;
  answer: string;
  timestamp: number;
}

// 对话消息
export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: number;
}

// 签到记录
export interface CheckInRecord {
  id: string;
  date: string;
  emotion: EmotionType;
  answers: UserAnswer[];
  microActions: MicroAction[];
  timestamp: number;
}

// 微行动
export interface MicroAction {
  id: string;
  title: string;
  description: string;
  completed: boolean | null; // null: 未做, true: 完成了, false: 没做
}

// 每日签到状态
export interface DailyCheckIn {
  hasCheckedIn: boolean;
  lastCheckIn?: CheckInRecord;
}
