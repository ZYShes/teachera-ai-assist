
import { Heart, Trash2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { ConversationData, deleteConversation, getConversationList } from '../api/conversation'
import { toast } from "@/hooks/use-toast";

interface ConversationListProps {
  ref;
  onConversationClick: (conversation: ConversationData) => void;
  onDeleteConversation: (id: number) => void;
  onFavoriteConversation: (id: number) => void;
}

const ConversationList = forwardRef(({ 
  onConversationClick,
  onDeleteConversation,
  onFavoriteConversation 
}: ConversationListProps, ref) => {
  useImperativeHandle(ref, () => ({
    fetchData
  }))
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    try {
      const data = await getConversationList({
        skip: 0,
        limit: 100
      })
      console.info('获取会话列表:', data)
      setConversations(data.map((conv) => ({ ...conv, active: false })))
    } catch (error) {
      console.error('获取会话列表失败:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  // useEffect(() => {
  //   console.info('会话列表变化:', conversations)
  // }, [conversations])

  if (loading) return <div className='p-3 text-gray-500'>加载中...</div>
  if (!conversations.length) return <div className='p-3 text-gray-500'>暂无会话记录</div>

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个对话吗？')) {
      
      const del = async (id) => {
        try {
          await deleteConversation(id);
          await fetchData();
          if(conversations && conversations.length === 0){
            onDeleteConversation(-100);
          }
          const nextConv = conversations.find(conv => conv.id !== id);
          await onDeleteConversation(nextConv?.id || -1);
          toast({ title: '对话删除成功', description: '已删除' });
          
        } catch (error) {
          toast({
            title: '删除失败',
            description: error instanceof Error? error.message : '网络异常',
            variant: 'destructive'
          });
        } finally {
          
        }
      }
      await del(id);
      
    }
  };

  const handleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onFavoriteConversation(id);
  };
  const handleConversationClick = (conversation: ConversationData) => {
    onConversationClick(conversation);
    setConversations(prev => 
      prev.map(conv => ({ 
        ...conv, 
        active: conv.id === conversation.id 
      }))
    );
  };

  return (
    //加滚动条
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#4DABF7] scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          onClick={() => handleConversationClick(conversation)}
          className={`p-3.5 rounded-xl mb-2.5 cursor-pointer transition-all duration-300 border-l-4 animate-fade-in group relative ${
            conversation.active
              ? 'bg-primary/10 border-l-primary'
              : 'border-l-transparent hover:bg-gray-100'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="font-medium mb-1 text-gray-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {conversation.title}
              {conversation.favorited && (
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              )}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => handleFavorite(e, conversation.id)}
                className={`p-1 rounded hover:bg-gray-200 ${
                  conversation.favorited ? 'text-red-500' : 'text-gray-400'
                }`}
                title={conversation.favorited ? '取消收藏' : '收藏'}
              >
                <Heart className={`w-3 h-3 ${conversation.favorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => handleDelete(e, conversation.id)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                title="删除对话"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            {conversation.subject}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>{conversation.date}</span>
            <span>{conversation.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ConversationList;
