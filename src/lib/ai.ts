interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// 系统提示词
const SYSTEM_PROMPT = `你是一个温暖治愈的AI疗愈助手，专门帮助20岁左右的大学生缓解日常焦虑和空虚感。

你的特点：
1. 温暖、理解、亲切，像朋友一样对话
2. 语言简洁自然，不说教
3. 关心用户的真实感受
4. 每次回复控制在50字以内（除了最后总结）

签到对话流程：
1. 先问候，询问用户今天的状态
2. 询问1-2个关于情绪的问题
3. 询问是否有具体的事情困扰
4. 根据用户回答，总结情绪状态，给出1-3个简单的微行动建议

微行动示例：
- "去散散步，呼吸一下新鲜空气"
- "给朋友打个电话聊聊"
- "写下3件今天让你感恩的事"
- "泡一杯热饮，慢慢喝"
- "听一首喜欢的歌"
- "深呼吸5次"

记住：不要给用户压力，语句温柔，让他们感到被理解。`;

// 模拟回复（当API不可用时使用）
const MOCK_RESPONSES = [
  "嗨，你好呀~今天感觉怎么样？有什么想和我聊聊的吗？",
  "谢谢你告诉我这些。能多说一点吗？比如今天发生了什么让你有这样的感受？",
  "我理解你的心情。还有什么想说的吗？或者今天有没有什么特别的事情？",
  "好的，我感受到你的情绪了。这些小建议或许能帮到你~",
];

// 发送消息给 AI（使用本地 API 路由）
export async function sendToAI(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '抱歉，我暂时无法回应你...';
  } catch (error) {
    // API 失败时使用模拟响应
    console.warn('API Error, using mock response:', error);
    const messageIndex = Math.min(messages.length - 1, MOCK_RESPONSES.length - 1);
    return MOCK_RESPONSES[messageIndex];
  }
}

// 判断情绪类型
export function detectEmotion(answers: { answer: string }[]): string {
  const combinedText = answers.map(a => a.answer).join('').toLowerCase();
  
  if (combinedText.includes('焦虑') || combinedText.includes('紧张') || combinedText.includes('担心') || combinedText.includes('慌')) {
    return 'anxious';
  } else if (combinedText.includes('难过') || combinedText.includes('伤心') || combinedText.includes('哭') || combinedText.includes('悲伤')) {
    return 'sad';
  } else if (combinedText.includes('开心') || combinedText.includes('高兴') || combinedText.includes('快乐')) {
    return 'happy';
  } else if (combinedText.includes('平静') || combinedText.includes('放松') || combinedText.includes('舒服')) {
    return 'calm';
  } else if (combinedText.includes('空虚') || combinedText.includes('无聊') || combinedText.includes('迷茫') || combinedText.includes('无所事事')) {
    return 'empty';
  } else if (combinedText.includes('累') || combinedText.includes('疲惫') || combinedText.includes('困') || combinedText.includes('没精神')) {
    return 'tired';
  } else if (combinedText.includes('困惑') || combinedText.includes('迷茫') || combinedText.includes('不懂') || combinedText.includes('不知道')) {
    return 'confused';
  } else if (combinedText.includes('兴奋') || combinedText.includes('激动') || combinedText.includes('开心') || combinedText.includes('亢奋')) {
    return 'excited';
  }
  
  return 'calm'; // 默认
}

// 根据情绪生成微行动
export function generateMicroActions(emotion: string): { title: string; description: string }[] {
  const actionTemplates: Record<string, { title: string; description: string }[]> = {
    anxious: [
      { title: '深呼吸5次', description: '慢慢吸气，慢慢呼气，让身体放松下来' },
      { title: '出门散散步', description: '到户外呼吸一下新鲜空气，短暂离开让你焦虑的环境' },
      { title: '给朋友打个电话', description: '和信任的人聊聊天，倾诉一下心情' },
    ],
    sad: [
      { title: '泡一杯热饮', description: '可以是热牛奶、姜茶或热巧克力，温暖的液体能抚慰心情' },
      { title: '听一首喜欢的歌', description: '找一首能触动你心的歌，让情绪自然流动' },
      { title: '写下此刻的感受', description: '把心情写下来，不需要修饰，只是如实记录' },
    ],
    empty: [
      { title: '整理一下房间', description: '动手整理环境，让空间变得有序，心情也会跟着清爽' },
      { title: '制定一个小目标', description: '想一件今天可以完成的小事，比如读几页书' },
      { title: '出门见见阳光', description: '哪怕只是到楼下站几分钟，阳光会让你感觉好一点' },
    ],
    tired: [
      { title: '小睡15分钟', description: '短暂的休息能帮你恢复精力' },
      { title: '泡个热水澡', description: '温热的水可以放松身体，舒缓疲劳' },
      { title: '早点睡觉', description: '今天就早点休息吧，身体需要恢复' },
    ],
    calm: [
      { title: '记录一下此刻', description: '用几句话写下现在的心情，留住这份平静' },
      { title: '感谢一下自己', description: '对自己说一声谢谢，辛苦了' },
      { title: '做个简单的伸展', description: '活动一下身体，感受身体的舒展' },
    ],
    happy: [
      { title: '记录这个时刻', description: '把这份开心写下来，以后翻看会想起今天的美好' },
      { title: '和小伙伴分享', description: '把快乐传递给身边的人吧' },
      { title: '做点喜欢的事', description: '趁心情好多做点让自己开心的事' },
    ],
    confused: [
      { title: '写下你的困惑', description: '把迷茫的地方写下来，思路会更清晰' },
      { title: '找信任的人聊聊', description: '有时候聊一聊，答案自然就出来了' },
      { title: '先睡一觉再说', description: '有时候休息够了，困惑就没那么困扰了' },
    ],
    excited: [
      { title: '记录这个时刻', description: '把这份激动的心情记下来' },
      { title: '分享给朋友', description: '快乐分享出去会加倍哦' },
      { title: '做点有意义的事', description: '把这份能量用在你想做的事上吧' },
    ],
  };

  return actionTemplates[emotion] || actionTemplates.calm;
}
