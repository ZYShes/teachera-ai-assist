
import { useState, useRef } from "react";
import WelcomeSection from "./WelcomeSection";
import MessageInput from "./MessageInput";
import ActionButtons from "./ActionButtons";
import { ConversationData, createConversation } from "@/api/conversation";
import { X, Upload, Play } from "lucide-react"


interface MainContentProps {
  activeTitle?: string;
  onNewConversation:(newConv) => void;
}

const MainContent = ({ 
  activeTitle = "我是你的AI教师助理TeacherA，可以帮你备课",
  onNewConversation
}: MainContentProps) => {
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null) 

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      console.log(`发送消息: ${message}`);
      const newConv = await createConversation({
        title: '新对话',
      });
      onNewConversation(newConv);
      setMessage('');
    }
  };

  const handleUpload = () => {
    console.log("打开上传试题界面");
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      console.error("文件输入框引用不存在")
    }
  };

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
    console.log("打开知识点选择界面");
  };

  const handleMistakes = () => {
    console.log("打开高频错题选择界面");
  };



  return (
    <main className="flex-1 flex flex-col h-full justify-center p-8">
      <WelcomeSection title={activeTitle === '新对话'? '我是你的AI教师助理TeacherA，可以帮你备课':activeTitle} />

      <MessageInput 
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
      />

      {uploadedImage && (
        <div className="-mt-6 mb-4 flex justify-center">
          <div className="w-full max-w-3xl bg-gray-50 border border-gray-200 rounded-lg p-6 relative">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="上传的图片预览"
                  className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                  title="移除图片"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleReupload}
                  className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
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
              <p className="text-sm text-gray-500 mt-3">支持PNG、JPG等图片格式，最大不超过10MB</p>
            </div>
          </div>
        </div>
      )}
      
      <ActionButtons 
        onUpload={handleUpload}
        onKnowledge={handleKnowledge}
        onMistakes={handleMistakes}
      />


      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
        multiple={false}
      />
    </main>
  );
};

export default MainContent;
