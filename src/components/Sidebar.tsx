"use client"
import { Plus, ChevronLeft } from "lucide-react"
import ConversationList from "./ConversationList"
import { type ConversationData, createConversation } from "@/api/conversation"
import { useRef } from "react"

interface SidebarProps {
  onNewChat: (newConv: ConversationData) => void
  onConversationClick: (conversation: ConversationData) => void
  onDeleteConversation: (id: number) => void
  onFavoriteConversation: (id: number) => void
  collapsed?: boolean
  onToggleSidebar?: () => void
}

const Sidebar = ({
  onNewChat,
  onConversationClick,
  onDeleteConversation,
  onFavoriteConversation,
  collapsed = false,
  onToggleSidebar,
}: SidebarProps) => {
  const conversationsList = useRef<any>(null)

  const handleNewChat = async () => {
    const newConv = await createConversation({
      title: "新对话",
    })
    await onNewChat(newConv)
    conversationsList.current?.fetchData()
  }

  const handleDeleteConversation = async (id: number) => {
    await onDeleteConversation(id)
    if (id === -1) {
      handleNewChat()
    }
    conversationsList.current?.fetchData()
  }

  // 如果侧边栏收起，不渲染内容
  if (collapsed) {
    return null
  }

  return (
    <aside className="w-full h-full bg-white flex flex-col" style={{ minWidth: "320px" }}>
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        {/* 按钮容器 - 新对话按钮和收起按钮 */}
        <div className="flex items-center gap-3">
          {/* 发起新对话按钮 - 固定宽度防止变形 */}
          <button
            onClick={handleNewChat}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white border-none px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-[0_4px_12px_rgba(67,97,238,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)] justify-center text-base"
            style={{ minWidth: "140px" }} // 固定最小宽度防止变形
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">发起新对话</span>
          </button>

          {/* 收起按钮 */}
          <div className="flex justify-end">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="收起侧边栏"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 pt-0">
        <ConversationList
          ref={conversationsList}
          onConversationClick={onConversationClick}
          onDeleteConversation={handleDeleteConversation}
          onFavoriteConversation={onFavoriteConversation}
        />
      </div>
    </aside>
  )
}

export default Sidebar
