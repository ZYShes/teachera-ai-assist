"use client"

import { useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import MainContent from "../components/MainContent"
import ConversationContent from "../components/ConversationContent"
import HtmlContent from "../components/HtmlContent"
import { type ConversationData, getConversation, createConversation } from "@/api/conversation"
import { toast } from "@/hooks/use-toast"
import useHtmlStore from "@/store/store"

export type ViewMode = "welcome" | "conversation"

const Index = () => {
  const [isLoggedIn] = useState(true)
  const [activeTitle, setActiveTitle] = useState("我是你的AI教师助理TeacherA，可以帮你备课")
  const [viewMode, setViewMode] = useState<ViewMode>("welcome")
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null)

  // 侧边栏展开/收起状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const { htmlCode } = useHtmlStore()
  const [showHtmlPanel, setShowHtmlPanel] = useState<boolean>(false)

  // 切换侧边栏展开/收起
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleHtmlPanel = () => {
    const newShowHtmlPanel = !showHtmlPanel
    setShowHtmlPanel(newShowHtmlPanel)

    // 当HTML面板展开时，自动收起侧边栏
    if (newShowHtmlPanel) {
      setSidebarCollapsed(true)
    }
  }

  const handleNewChat = async (newConv: ConversationData) => {
    try {
      //setActiveTitle(newConv.title)
      //setViewMode("conversation")
      setActiveTitle("我是你的AI教师助理TeacherA，可以帮你备课")
      setViewMode("welcome") // 设置为welcome模式显示首页
      setSelectedConversationId(null) // 清空选中的对话ID
      setSelectedConversation(null) // 清空选中的对话
      setShowHtmlPanel(false) // 关闭HTML预览面板
      setSidebarCollapsed(false)
      //setSelectedConversationId(newConv.id)
      //const selectedConversation = await getConversation(newConv.id)
      //setSelectedConversation(selectedConversation)
      toast({ title: "对话创建成功", description: "已准备就绪" })
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "网络异常",
        variant: "destructive",
      })
    }
  }

  // 新增：专门处理跳转到首页的函数
  const handleBackToHome = () => {
    setActiveTitle("我是你的AI教师助理TeacherA，可以帮你备课")
    setViewMode("welcome")
    setSelectedConversationId(null)
    setSelectedConversation(null)
    setShowHtmlPanel(false)
    setSidebarCollapsed(false)
    toast({ title: "已返回首页", description: "可以开始新的对话" })
  }

  //新增：从首页创建新对话的处理函数
  const handleNewConversationFromHome = async (newConv: ConversationData) => {
    try {
      setActiveTitle(newConv.title)
      setViewMode("conversation")
      setSelectedConversationId(newConv.id)
      const selectedConversation = await getConversation(newConv.id)
      setSelectedConversation(selectedConversation)
      toast({ title: "新对话已创建", description: "正在处理您的问题..." })
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
        {/* 左侧边栏 - 可展开收起 */}
        {isLoggedIn && (
          <div
            className={`bg-slate-100 border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? "w-0" : "w-80"
            }`}
            style={{
              // 使用 style 确保宽度变化时不影响内部元素
              overflow: sidebarCollapsed ? "hidden" : "visible",
            }}
          >
            <Sidebar
              onNewChat={handleNewChat}
              onConversationClick={handleConversationClick}
              onDeleteConversation={handleDeleteConversation}
              onFavoriteConversation={handleFavoriteConversation}
              collapsed={sidebarCollapsed}
              onToggleSidebar={toggleSidebar}
            />
          </div>
        )}

        {/* 中间内容区域 - 动态宽度 */}
        <div className={`bg-white min-h-full transition-all duration-300 flex-shrink-0 ${
            showHtmlPanel
              ? "flex-[2]" // 有HTML预览时
              : "flex-1" // 无HTML预览时
          }`}>
          {viewMode === "welcome" ? (
            <MainContent
              activeTitle={activeTitle}
              //onNewConversation={handleNewChat}
              onNewConversation={handleNewConversationFromHome} // 传入从首页创建对话的处理函数
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={toggleSidebar}
              onBackToHome={handleBackToHome} // 传入跳转首页的处理函数
            />
          ) : (
            selectedConversation && (
              <ConversationContent
                conversationId={selectedConversationId}
                title={selectedConversation.title}
                onDelete={handleDeleteConversation}
                onFavorite={handleFavoriteConversation}
                isFavorited={selectedConversation.favorited || false}
                onToggleHtmlPanel={toggleHtmlPanel}
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={toggleSidebar}
              />
            )
          )}
        </div>

        {/* 右侧 HTML 预览面板 - 条件渲染 */}
        {isLoggedIn && showHtmlPanel && (
          <div className="flex-[3] bg-white border-l border-gray-200 transition-all duration-300 min-w-0">
            <HtmlContent onClose={() => setShowHtmlPanel(false)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
