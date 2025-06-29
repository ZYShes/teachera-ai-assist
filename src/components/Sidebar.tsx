
import { Plus } from "lucide-react";
import ConversationList from "./ConversationList";
import { ConversationData, createConversation } from "@/api/conversation";
import { useEffect, useRef } from "react";

interface SidebarProps {
  onNewChat: (newConv) => void;
  onConversationClick: (conversation: ConversationData) => void;
  onDeleteConversation: (id: number) => void;
  onFavoriteConversation: (id: number) => void;
}

const Sidebar = ({  
  onNewChat, 
  onConversationClick, 
  onDeleteConversation, 
  onFavoriteConversation 
}: SidebarProps) => {

  const conversationsList =  useRef(null)
  const handleNewChat = async () => {
    const newConv = await createConversation({
      title: '新对话',
    });
    await onNewChat(newConv);
    conversationsList.current.fetchData()
    // onSetConversations
  }
  const handleDeleteConversation = async (id: number) => {
    await onDeleteConversation(id);
    if(id === -1){
      handleNewChat();
    }
    conversationsList.current.fetchData()
  }
  return (
    <aside className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex flex-col gap-5 pb-5 border-b border-gray-200">
        {/* <div className="text-lg font-semibold text-primary flex items-center gap-2.5">
          <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div> 
          <span>与TeacherA对话</span> 
        </div> */}
        <button 
          onClick={handleNewChat}
          className="bg-gradient-to-r from-primary to-accent text-white border-none px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-[0_4px_12px_rgba(67,97,238,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)] flex items-center justify-center gap-2 text-base"
        >
          <Plus className="w-5 h-5" />
          <span>发起新对话</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ConversationList 
          ref={conversationsList}
          onConversationClick={onConversationClick}
          onDeleteConversation={handleDeleteConversation}
          onFavoriteConversation={onFavoriteConversation}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
