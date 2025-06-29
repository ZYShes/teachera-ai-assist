"use client"

import { useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import MainContent from "../components/MainContent"
import ConversationContent from "../components/ConversationContent"
import HtmlContent from "../components/HtmlContent"
import { type ConversationData, getConversation } from "@/api/conversation"
import { toast } from "@/hooks/use-toast"
import useHtmlStore from "@/store/store" // 保留您的原有store

export type ViewMode = "welcome" | "conversation"

const Index = () => {
  const [isLoggedIn] = useState(true)
  const [activeTitle, setActiveTitle] = useState("我是你的AI教师助理TeacherA，可以帮你备课")
  const [viewMode, setViewMode] = useState<ViewMode>("welcome")
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null)

  // 从您的原有store获取HTML内容
  const { htmlCode } = useHtmlStore()

  // HTML 预览面板显示控制
  const [showHtmlPanel, setShowHtmlPanel] = useState<boolean>(false)

  // 删除这个useEffect，不要自动显示面板
  // useEffect(() => {
  //   if (htmlCode.trim()) {
  //     setShowHtmlPanel(true)
  //   } else {
  //     setShowHtmlPanel(false)
  //   }
  // }, [htmlCode])

  // 切换 HTML 面板显示/隐藏
  const toggleHtmlPanel = () => {
    setShowHtmlPanel(!showHtmlPanel)
  }

  const handleNewChat = async (newConv: ConversationData) => {
    try {
      setActiveTitle(newConv.title)
      setViewMode("conversation")
      setSelectedConversationId(newConv.id)
      const selectedConversation = await getConversation(newConv.id)
      setSelectedConversation(selectedConversation)
      toast({ title: "对话创建成功", description: "已准备就绪" })
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "网络异常",
        variant: "destructive",
      })
    }
  }

  const handleConversationClick = async (conversation: ConversationData) => {
    setActiveTitle(conversation.title)
    setViewMode("conversation")
    setSelectedConversationId(conversation.id)
    const selectedConversation = await getConversation(conversation.id)
    setSelectedConversation(selectedConversation)
  }

  const handleDeleteConversation = async (id: number) => {
    if (-1 !== id) {
      setSelectedConversationId(id)
      const selectedConversation = await getConversation(id)
      setSelectedConversation(selectedConversation)
    }
  }

  const handleFavoriteConversation = (id: number) => {
    // 收藏逻辑
  }

  return (
    <div className="h-screen flex flex-col font-roboto overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 左侧边栏 固定宽度，独立滚动*/}
        {isLoggedIn && (
          <div className="w-80 bg-slate-100 border-r border-gray-200 flex-shrink-0 flex flex-col">
            <Sidebar
              onNewChat={handleNewChat}
              onConversationClick={handleConversationClick}
              onDeleteConversation={handleDeleteConversation}
              onFavoriteConversation={handleFavoriteConversation}
            />
          </div>
        )}

        {/* 中间内容区域 - 动态宽度 */}
        <div
          className={`flex-1 bg-white min-h-full transition-all duration-300 ${showHtmlPanel ? "max-w-[90%]" : ""}`}
        >
          {viewMode === "welcome" ? (
            <MainContent activeTitle={activeTitle} onNewConversation={handleNewChat} />
          ) : (
            selectedConversation && (
              <ConversationContent
                conversationId={selectedConversationId}
                title={selectedConversation.title}
                onDelete={handleDeleteConversation}
                onFavorite={handleFavoriteConversation}
                isFavorited={selectedConversation.favorited || false}
                onToggleHtmlPanel={toggleHtmlPanel} // 

              />
            )
          )}
        </div>

        {/* 右侧 HTML 预览面板 - 条件渲染 */}
        {isLoggedIn && showHtmlPanel && (
          <div className="w-[46%] p-4 bg-gray-50 transition-all duration-300 flex-shrink-0">
            <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
              <HtmlContent onClose={() => setShowHtmlPanel(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index;
