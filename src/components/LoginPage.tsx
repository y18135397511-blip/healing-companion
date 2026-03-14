'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    // 保存用户名
    localStorage.setItem('healing_user', username.trim());
    onLogin(username.trim());
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen px-6 py-8 flex items-center justify-center" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-md w-full space-y-8">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-gray-800">疗愈助手</h1>
          <p className="text-gray-400 text-sm">你好，欢迎回来</p>
        </div>
        
        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入你的名字"
              className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-[#E8D5B7] outline-none text-gray-800 placeholder-gray-400 text-center text-lg"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              backgroundColor: '#E8D5B7',
              color: '#4A4A4A',
            }}
          >
            进入
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-300 pt-4">
          数据保存在本地浏览器中
        </p>
      </div>
    </div>
  );
}
