'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserAnswer, MicroAction, EmotionType } from '@/types';
import { sendToAI, detectEmotion, generateMicroActions } from '@/lib/ai';
import { saveCheckInRecord, generateId, getTodayCheckIn } from '@/lib/storage';
import ChatBubble from './ChatBubble';
import MicroActionCard from './MicroActionCard';
import EmotionDisplay from './EmotionDisplay';

interface CheckInChatProps {
  onComplete: () => void;
}

export default function CheckInChat({ onComplete }: CheckInChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showMicroActions, setShowMicroActions] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionType>('calm');
  const [microActions, setMicroActions] = useState<MicroAction[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 开始签到时发送第一条消息
  useEffect(() => {
    const startCheckIn = async () => {
      setIsLoading(true);
      try {
        const aiResponse = await sendToAI(
          [{ role: 'user', content: '我想开始今天的情绪签到' }]
        );
        
        setMessages([
          {
            id: generateId(),
            type: 'ai',
            content: aiResponse,
            timestamp: Date.now(),
          },
        ]);
      } catch (error) {
        console.error('AI Error:', error);
        setMessages([
          {
            id: generateId(),
            type: 'ai',
            content: '嗨，你好呀~今天感觉怎么样？',
            timestamp: Date.now(),
          },
        ]);
      }
      setIsLoading(false);
    };
    
    startCheckIn();
  }, []);
  
  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: generateId(),
      type: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setAnswers(prev => [...prev, {
      questionId: answers.length,
      answer: input.trim(),
      timestamp: Date.now(),
    }]);
    
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    
    try {
      // 准备对话历史
      const history = messages.map(m => ({
        role: m.type === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));
      history.push({ role: 'user', content: currentInput });
      
      const aiResponse = await sendToAI(history);
      
      // 如果已经回答了3个以上问题，就结束对话并给出结果
      if (answers.length >= 2) {
        const emotion = detectEmotion([...answers, { questionId: answers.length, answer: currentInput, timestamp: Date.now() }]);
        setDetectedEmotion(emotion as EmotionType);
        const actions = generateMicroActions(emotion);
        setMicroActions(actions.map(a => ({
          id: generateId(),
          ...a,
          completed: null,
        })));
        setShowMicroActions(true);
        
        // 保存签到记录
        const record = {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          emotion: emotion as EmotionType,
          answers: [...answers, { questionId: answers.length, answer: currentInput, timestamp: Date.now() }],
          microActions: actions.map(a => ({
            id: generateId(),
            ...a,
            completed: null,
          })),
          timestamp: Date.now(),
        };
        saveCheckInRecord(record);
        
        // 添加总结消息
        const summaryMessage = `好的，我感受到你今天${emotion === 'anxious' ? '有点焦虑' : emotion === 'sad' ? '有点难过' : emotion === 'empty' ? '有些空虚' : emotion === 'tired' ? '比较疲惫' : '总体来说是' + emotion}。这些小建议或许能帮到你：`;
        
        setMessages(prev => [...prev, 
          {
            id: generateId(),
            type: 'ai',
            content: aiResponse,
            timestamp: Date.now(),
          },
          {
            id: generateId(),
            type: 'ai',
            content: summaryMessage,
            timestamp: Date.now(),
          }
        ]);
      } else {
        setMessages(prev => [...prev, 
          {
            id: generateId(),
            type: 'ai',
            content: aiResponse,
            timestamp: Date.now(),
          }
        ]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, 
        {
          id: generateId(),
          type: 'ai',
          content: '谢谢你告诉我这些。还有什么想说的吗？',
          timestamp: Date.now(),
        }
      ]);
    }
    
    setIsLoading(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleActionComplete = (actionId: string, completed: boolean) => {
    setMicroActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, completed } : action
    ));
  };
  
  const handleFinish = () => {
    // 更新存储中的完成状态
    const today = getTodayCheckIn();
    if (today.lastCheckIn) {
      today.lastCheckIn.microActions = microActions;
      saveCheckInRecord(today.lastCheckIn);
    }
    onComplete();
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#F5EDE4] px-5 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        {showMicroActions && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-center gap-2 py-2">
              <EmotionDisplay emotion={detectedEmotion} size="lg" />
            </div>
            
            <p className="text-center text-gray-600 mb-4">试试这些小行动：</p>
            
            {microActions.map(action => (
              <MicroActionCard 
                key={action.id} 
                action={action} 
                onComplete={(completed) => handleActionComplete(action.id, completed)}
              />
            ))}
            
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-[#E8D5B7] text-gray-800 font-medium rounded-xl hover:bg-[#DCC5A7] transition-colors mt-4"
            >
              完成签到
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      {!showMicroActions && (
        <div className="border-t border-[#E8D5B7]/30 px-4 py-4 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="写下你的想法..."
              className="flex-1 px-5 py-3 bg-[#F5F5F5] rounded-2xl border-none outline-none text-gray-800 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-[#E8D5B7] text-gray-800 font-medium rounded-2xl hover:bg-[#DCC5A7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
