import { del, get, post, put } from "@/utils/request"

// 新增消息模型接口
export interface Message {
  id: number
  conversation_id: number
  user_id: number
  role: 'user' | 'assistant' | 'thinking'
  content: string
  created_at: string
  
}

export interface MessageData {
  id: number;
  type: 'user' | 'assistant';
  reasoning?: string;
  answer: string;
  htmlContent?: string;
  isStreaming?: boolean;
  timestamp: string;
  image?: string;
  // chunks?: string[];
  durationInSeconds?: number // 新增：思考耗时（秒），可选字段
}
export interface ConversationContentProps {
  conversationId: number;
  title: string;
  onDelete: (id: number) => void;
  onFavorite: (id: number) => void;
  isFavorited: boolean;
  onToggleHtmlPanel?: () => void // 新增：切换HTML预览面板的回调函数
}

export interface MessageQuery {
  conversation_id: number
//   last_id?: number
//   limit?: number
}

// 获取消息列表
export function getMessageList(conversationId: number) {
  return get(`/api/chat/${conversationId}`).then(res => {
    return res.data.map((msg: any) => ({
      id: msg.id,
      type: msg.role,
      content: msg.content,
      htmlContent: msg.html_content,
      image: msg.attachment_url,
      timestamp: new Date(msg.created_at).toLocaleTimeString('zh-CN', { 
        hour: '2-digit',
        minute: '2-digit'
      }),
      isStreaming: msg.is_streaming
    }));
  })
  .catch(error => {
    console.error('获取消息失败:', error);
    return [];
  });
}

// 创建消息
export function chat(data: {
  conversation_id: number
  role: 'user'
  content: string
}) {
  return post('/api/chat', data)
}

// 更新消息
export function updateMessage(id: number, data: Partial<Message>) {
  return put(`/api/chat/${id}`, data)
}

// 删除消息
export function deleteMessage(id: number) {
  return del(`/api/chat/${id}`)
}