import type React from "react"
import { useState, useRef } from "react"
import { Menu, Plus, X, Upload, Play } from "lucide-react"
import WelcomeSection from "./WelcomeSection"
import MessageInput from "./MessageInput"
import ActionButtons from "./ActionButtons"
import { type ConversationData, createConversation } from "@/api/conversation"

interface MainContentProps {
  activeTitle?: string
  onNewConversation: (newConv: ConversationData) => void
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onBackToHome?: () => void
}

const MainContent = ({
  activeTitle = "我是你的AI教师助理TeacherA，可以帮你备课",
  onNewConversation,
  sidebarCollapsed = false,
  onToggleSidebar,
  onBackToHome,
}: MainContentProps) => {
  console.log("🔍 MainContent 组件加载，sidebarCollapsed:", sidebarCollapsed, "onBackToHome:", !!onBackToHome)

  const [message, setMessage] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null) 
  const [uploadedFileName, setUploadedFileName] = useState<string>("") 
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      console.log(`发送消息: ${message}`)
      const newConv = await createConversation({
        title: "新对话",
      })
      onNewConversation(newConv)
      setMessage("")
    }
  }

  const handleNewChat = async () => {
    const newConv = await createConversation({
      title: "新对话",
    })
    onNewConversation(newConv)
    // 清空图片预览状态
    setUploadedImage(null)
    setUploadedFileName("")
  }

  const handleUpload = () => {
    console.log("打开上传试题界面")
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      console.error("文件输入框引用不存在")
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("已选择文件:", file.name, "文件类型:", file.type)
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        alert("请选择图片文件 (PNG, JPEG, JPG, GIF, WEBP)")
        return
      }
      // 检查文件大小
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert("文件大小不能超过10MB")
        return
      }
      // 创建图片预览
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setUploadedFileName(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReupload = () => {
    setUploadedImage(null)
    setUploadedFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // 重新触发文件选择
    handleUpload()
  }

  const handleStartAnalysis = async () => {
    if (uploadedImage) {
      const newConv = await createConversation({
        title: `试题分析: ${uploadedFileName}`,
      })
      onNewConversation(newConv)
      // 清空预览状态
      setUploadedImage(null)
      setUploadedFileName("")
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setUploadedFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleKnowledge = () => {
    console.log("打开知识点选择界面")
  }

  const handleMistakes = () => {
    console.log("打开高频错题选择界面")
  }

  return (
    <main className="flex-1 flex flex-col bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 h-full justify-center relative">
      {/* 当侧边栏收起时，在主内容区域显示汉堡菜单按钮 */}
      {sidebarCollapsed && (
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="展开侧边栏"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                console.log("按钮被点击了！")
                handleNewChat()
              }}
              className="bg-gradient-to-r from-primary to-accent text-white border-none px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-[0_4px_12px_rgba(67,97,238,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)] justify-center text-base"
              style={{ minWidth: "140px" }}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">发起新对话</span>
            </button>
          </div>
        </div>
      )}

      {/* 添加一个测试按钮 */}

      <WelcomeSection title={activeTitle === "新对话" ? "我是你的AI教师助理TeacherA，可以帮你备课" : activeTitle} />

      <MessageInput message={message} setMessage={setMessage} onSendMessage={handleSendMessage} />

      {uploadedImage && (
        <div className="-mt-6 mb-4 flex justify-center">
          <div className="w-full max-w-3xl bg-gray-50 border border-gray-200 rounded-lg p-6 relative">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="上传的图片预览"
                  className="max-w-full max-h-64 object-contain rounded-xl shadow-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors shadow-md"
                  title="移除图片"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleReupload}
                  className="flex items-center gap-2 px-6 py-2.5 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors font-medium"
                >
                  <Upload className="w-4 h-4" />
                  重新上传
                </button>
                <button
                  onClick={handleStartAnalysis}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  开始分析
                </button>
              </div>
              {/* 文件信息提示 */}
              <p className="text-sm text-gray-400 mt-4">支持PNG、JPG等图片格式，最大不超过10MB</p>
            </div>
          </div>
        </div>
      )}

      <ActionButtons onUpload={handleUpload} onKnowledge={handleKnowledge} onMistakes={handleMistakes} />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
        multiple={false}
      />
    </main>
  )
}

export default MainContent
