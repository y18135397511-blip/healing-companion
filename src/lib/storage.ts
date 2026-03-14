import { CheckInRecord, DailyCheckIn, EmotionType, UserAnswer, MicroAction } from '@/types';

const STORAGE_KEYS = {
  CHECK_IN_RECORDS: 'healing_companion_records',
  USER_MEMORIES: 'healing_companion_memories',
} as const;

// 获取所有签到记录
export function getCheckInRecords(): CheckInRecord[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CHECK_IN_RECORDS);
  return data ? JSON.parse(data) : [];
}

// 保存签到记录
export function saveCheckInRecord(record: CheckInRecord): void {
  const records = getCheckInRecords();
  // 检查今天是否已有记录，有则更新
  const todayIndex = records.findIndex(r => r.date === record.date);
  if (todayIndex >= 0) {
    records[todayIndex] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(STORAGE_KEYS.CHECK_IN_RECORDS, JSON.stringify(records));
}

// 获取今日签到状态
export function getTodayCheckIn(): DailyCheckIn {
  const records = getCheckInRecords();
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(r => r.date === today);
  
  return {
    hasCheckedIn: !!todayRecord,
    lastCheckIn: todayRecord,
  };
}

// 获取过去7天的情绪记录（用于周回顾）
export function getWeekRecords(): CheckInRecord[] {
  const records = getCheckInRecords();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return records
    .filter(r => new Date(r.date) >= weekAgo)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 获取用户记忆（跨会话）
export function getUserMemories(): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.USER_MEMORIES);
  return data ? JSON.parse(data) : [];
}

// 保存用户记忆
export function saveUserMemory(memory: string): void {
  const memories = getUserMemories();
  if (!memories.includes(memory)) {
    memories.push(memory);
    localStorage.setItem(STORAGE_KEYS.USER_MEMORIES, JSON.stringify(memories));
  }
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 格式化日期
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return '今天';
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return '昨天';
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
}

// 获取星期几
export function getWeekday(dateStr: string): string {
  const date = new Date(dateStr);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
}
