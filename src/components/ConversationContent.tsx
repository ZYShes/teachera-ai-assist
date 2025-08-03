"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Heart, Trash2, MoreVertical, Send, Code, Eye, Loader2, Paperclip, Menu, Plus, Upload, BookOpen, FileImage, CheckSquare, PackageCheck, MailCheck, BadgeCheck, Inbox } from "lucide-react"
import type { ConversationContentProps, MessageData } from "../api/chat"
import { ScrollArea } from "./ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import useHtmlStore from "@/store/store"
import { ReasoningBlock } from "./ui/reasoning-block"
import FileModal from "./ui/file-modal"
import { createConversation } from "@/api/conversation"

// 扩展 ConversationContentProps 接口
interface ExtendedConversationContentProps extends ConversationContentProps {
  onHtmlContentUpdate?: (content: string) => void
  hasHtmlContent?: boolean
  showHtmlPreview?: boolean
  onToggleHtmlPreview?: () => void
  onBackToHome?: () => void //新增prop接收跳转首页的回调
}

const test_data: MessageData[] = [
  {
    id: 1,
    type: "user",
    answer: "请帮我讲解二次函数的基本性质",
    timestamp: "14:30",
  },
  {
    id: 2,
    type: "assistant",
    reasoning:
      "好的，我们来复习一下二次函数的基本性质。二次函数的一般形式是 f(x) = ax² + bx + c (a ≠ 0)。\n\n主要性质包括：\n1. 开口方向：当a > 0时开口向上，当a < 0时开口向下\n2. 对称轴：x = -b/(2a)\n3. 顶点坐标：(-b/(2a), (4ac-b²)/(4a))\n4. 最值：当a > 0时有最小值，当a < 0时有最大值",
    answer: "以上数据均为前端mock数据，正式数据请从后端获取。",
    timestamp: "14:31",
    htmlContent: `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>函数图像分析工具</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                background-color: #f5f5f5;
            }
            
            .container {
                display: flex;
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .ggb-container {
                width: 800px;
                height: 600px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .control-panel {
                flex: 1;
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            h1 {
                color: #333;
                margin-bottom: 20px;
            }

            .control-group {
                margin-bottom: 20px;
            }

            .control-group h3 {
                margin-top: 0;
                color: #444;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            }

            button {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 15px;
                margin: 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }

            button:hover {
                background-color: #45a049;
            }

            button.toggle {
                background-color: #2196F3;
            }

            button.toggle:hover {
                background-color: #0b7dda;
            }

            button.reset {
                background-color: #f44336;
            }

            button.reset:hover {
                background-color: #d32f2f;
            }

            .slider-container {
                margin: 15px 0;
            }

            .slider-container label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }

            input[type="range"] {
                width: 100%;
            }

            .value-display {
                font-size: 14px;
                color: #666;
                margin-top: 5px;
            }
        </style>
    </head>
    <body>
        <h1>函数图像分析工具</h1>
        <div class="container">
            <div class="ggb-container" id="ggb-element"></div>
            <div class="control-panel">
                <div class="control-group">
                    <h3>主函数控制</h3>
                    <button id="toggleMainFunction">显示/隐藏主函数</button>
                    <button id="toggleDerivative">显示/隐藏导数函数</button>
                    <button class="reset" id="resetAll">重置所有</button>
                </div>

                <div class="control-group">
                    <h3>参数控制</h3>
                    <div class="slider-container">
                        <label for="kSlider">k 值 (0 < k < 1/3)</label>
                        <input type="range" id="kSlider" min="0.01" max="0.33" step="0.01" value="0.1">
                        <div class="value-display">当前值: <span id="kValue">0.1</span></div>
                    </div>
                </div>

                <div class="control-group">
                    <h3>点控制</h3>
                    <button id="toggleP1">显示/隐藏极值点 P1</button>
                    <button id="toggleP2">显示/隐藏零点 P2</button>
                </div>

                <div class="control-group">
                    <h3>辅助函数控制</h3>
                    <button id="toggleGfunc">显示/隐藏 g_func(x)</button>
                    <button id="toggleGt">显示/隐藏 g_t(t)</button>
                </div>
            </div>
        </div>

        <script src="https://cdn.geogebra.org/apps/deployggb.js"></script>
        <script>
            // GeoGebra parameters
            const parameters = {
                "id": "ggbApplet",
                "appName": "classic",
                "width": 800,
                "height": 600,
                "showMenuBar": true,
                "showAlgebraInput": true,
                "showToolBar": true,
                "showToolBarHelp": true,
                "showResetIcon": true,
                "enableLabelDrags": true,
                "enableShiftDragZoom": true,
                "enableRightClick": true,
                "errorDialogsActive": false,
                "useBrowserForJS": false,
                "allowStyleBar": false,
                "preventFocus": false,
                "showZoomButtons": true,
                "capturingThreshold": 3,
                "showFullscreenButton": true,
                "scale": 1,
                "disableAutoScale": false,
                "allowUpscale": false,
                "clickToLoad": false,
                "buttonRounding": 0.7,
                "buttonShadows": false,
                "language": "zh-CN",
                "appletOnLoad": function(api) {
                    window.ggbApp = api;
                    initializeGeoGebra();
                }
            };

            // Initialize GeoGebra
            window.addEventListener('load', function() {
                var applet = new GGBApplet(parameters, true);
                applet.inject('ggb-element');
            });

            // Initialize GeoGebra objects
            function initializeGeoGebra() {
                // Create slider for k
                ggbApp.evalCommand('k=Slider(0.01,0.33,0.01,1,140,false,true,false,false)');
                ggbApp.evalCommand('SetValue(k,0.1)');

                // Main function
                ggbApp.evalCommand('f(x)=ln(1+x)-x+0.5x^2-kx^3');

                // Derivative function (hidden by default)
                ggbApp.evalCommand('f_prime(x)=x^2(1/(1+x)-3k)');
                ggbApp.evalCommand('SetVisibleInView(f_prime,1,false)');
                ggbApp.evalCommand('SetLabel(f_prime,"derivative")');

                // Helper function g_func (hidden)
                ggbApp.evalCommand('g_func(x)=1/(1+x)-3k');
                ggbApp.evalCommand('SetVisibleInView(g_func,1,false)');
                ggbApp.evalCommand('SetLabel(g_func,"g_function")');

                // x1 value (hidden)
                ggbApp.evalCommand('x1_val=1/(3k)-1');
                ggbApp.evalCommand('SetVisibleInView(x1_val,1,false)');
                ggbApp.evalCommand('SetLabel(x1_val,"x1_value")');

                // Point P1 (visible)
                ggbApp.evalCommand('P1=(x1_val,f(x1_val))');
                ggbApp.evalCommand('SetLabel(P1,"P1_extreme_point")');

                // x2 value (hidden)
                ggbApp.evalCommand('x2_val=NSolve(f(x)=0,x,x1_val+0.1,100)');
                ggbApp.evalCommand('SetVisibleInView(x2_val,1,false)');
                ggbApp.evalCommand('SetLabel(x2_val,"x2_root")');

                // Point P2 (visible)
                ggbApp.evalCommand('P2=(x2_val,0)');
                ggbApp.evalCommand('SetLabel(P2,"P2_zero_point")');

                // Helper function g_t (hidden)
                ggbApp.evalCommand('g_t(t)=f(x1_val+t)-f(x1_val-t)');
                ggbApp.evalCommand('SetVisibleInView(g_t,1,false)');
                ggbApp.evalCommand('SetLabel(g_t,"g_t_function")');

                // Update k value display
                updateKValue();
            }

            // UI Controls
            document.getElementById('toggleMainFunction').addEventListener('click', function() {
                const visible = ggbApp.getVisible('f', 1);
                ggbApp.setVisible('f', 1, !visible);
            });

            document.getElementById('toggleDerivative').addEventListener('click', function() {
                const visible = ggbApp.getVisible('f_prime', 1);
                ggbApp.setVisible('f_prime', 1, !visible);
            });

            document.getElementById('toggleP1').addEventListener('click', function() {
                const visible = ggbApp.getVisible('P1', 1);
                ggbApp.setVisible('P1', 1, !visible);
            });

            document.getElementById('toggleP2').addEventListener('click', function() {
                const visible = ggbApp.getVisible('P2', 1);
                ggbApp.setVisible('P2', 1, !visible);
            });

            document.getElementById('toggleGfunc').addEventListener('click', function() {
                const visible = ggbApp.getVisible('g_func', 1);
                ggbApp.setVisible('g_func', 1, !visible);
            });

            document.getElementById('toggleGt').addEventListener('click', function() {
                const visible = ggbApp.getVisible('g_t', 1);
                ggbApp.setVisible('g_t', 1, !visible);
            });

            document.getElementById('resetAll').addEventListener('click', function() {
                ggbApp.reset();
                initializeGeoGebra();
            });

            // Slider control for k
            const kSlider = document.getElementById('kSlider');
            kSlider.addEventListener('input', function() {
                const value = parseFloat(this.value).toFixed(2);
                ggbApp.evalCommand('SetValue(k,' + value + ')');
                updateKValue();

                // Update dependent objects
                ggbApp.evalCommand('UpdateConstruction()');
            });

            function updateKValue() {
                const kValue = ggbApp.getValue('k');
                document.getElementById('kValue').textContent = kValue.toFixed(2);
            }

            // Handle window resize
            window.addEventListener('resize', function() {
                if (typeof ggbApp !== 'undefined' && typeof ggbApp.recalculateEnvironments === 'function') {
                    ggbApp.setSize(800, 600);
                }
            });
        </script>
    </body>
    </html>
    `,
    durationInSeconds: 19, // 模拟思考耗时
  },
  {
    id: 3,
    type: "user",
    answer: "能给我一个具体的例子吗？",
    timestamp: "14:32",
  },
  {
    id: 4,
    type: "assistant",
    answer: "当然可以！让我们看一个具体例子：f(x) = 2x² - 4x + 1",
    timestamp: "14:33",
    durationInSeconds: 19, //test
  },
]

const ConversationContent = ({
  conversationId,
  title,
  onDelete,
  onFavorite,
  isFavorited,
  onToggleHtmlPanel, 
  sidebarCollapsed, 
  onToggleSidebar, 
  onBackToHome, // 新增：跳转首页的回调
}:ExtendedConversationContentProps) => {
  const [showActions, setShowActions] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showHtmlSource, setShowHtmlSource] = useState<{ [key: number]: boolean }>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [enableDeepThinking, setEnableDeepThinking] = useState(true)

  // 在现有的 useRef 声明后添加
  const prevHtmlContentRef = useRef<string>("")

  // 从 store 获取状态和方法
  const { htmlCode, reset } = useHtmlStore()

  // 示例重置函数
  const handleReset = (val: string) => {
    // 调用 reset 并传入新的 HTML 字符串
    reset(val)
  }

  // 模拟对话消息数据
  const [messages, setMessages] = useState<MessageData[]>(test_data)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // const fetchData = async () => {
    //   if (!conversationId) return;
    //   setMessages([])
    //   try {
    //     var data = await getMessageList(conversationId)
    //     console.info('获取会话消息列表:', data)
    //     if (!data) {
    //       data = []
    //     }
    //     setMessages(data)
    //   } catch (error) {
    //     console.error('获取会话消息列表失败:', error)
    //   } finally {
    //     // setLoading(false)
    //   }
    // }
    // fetchData()
  }, [conversationId])

  const handleDelete = async () => {
    if (window.confirm("确定要删除这个对话吗？")) {
      await onDelete(conversationId)
    }
    setShowActions(false)
  }

  const handleFavorite = () => {
    onFavorite(conversationId)
    setShowActions(false)
  }

  const [abortController, setAbortController] = useState<AbortController | null>(null)

  // 新建对话处理函数
  // const handleNewChat = async () => {
  //   try {
  //     const newConv = await createConversation({
  //       title: "新对话",
  //     })
  //     // 这里需要调用父组件的新对话处理函数
  //     // 由于当前组件没有这个回调，可能需要从父组件传递
  //     console.log("创建新对话:", newConv)
  //   } catch (error) {
  //     console.error("创建新对话失败:", error)
  //   }
  // }

  // 修改：新建对话处理函数 - 调用跳转首页的函数
  const handleNewChat = () => {
    console.log("ConversationContent handleNewChat 函数被调用了！")
    if (onBackToHome) {
      console.log("ConversationContent 正在调用 onBackToHome")
      onBackToHome()
    } else {
      console.log("ConversationContent onBackToHome 未定义")
    }
  }



  // 删除重复的handleSendMessage函数
  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return

    setNewMessage("")
    setSelectedImage(null)
    // 创建临时消息
    const tempId = Date.now()
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        type: "user",
        answer: newMessage,
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
    ])

    try {
      const controller = new AbortController()
      setAbortController(controller)

      // 流式请求
      const response = await fetch("/api/v2/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          prompt: newMessage,
          deep_thinking: enableDeepThinking, // 使用状态值控制是否开启深度思考
        }),
        signal: controller.signal,
      })

      // 创建assistant消息
      const assistantId = Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          type: "assistant",
          reasoning: "",
          answer: "",
          htmlContent: "",
          timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          isStreaming: true,
        },
      ])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let answer = ""
      let reasoning = ""
      let htmlContent = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)

        // 处理可能包含多个 JSON 对象的情况（以 "data: " 分隔）
        const dataLines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of dataLines) {
          try {
            // 确保是以 "data: " 开头的有效行
            if (!line.startsWith("data: ")) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue
            const data = JSON.parse(jsonStr)
            // 处理 type 为 think 的消息
            if (data.type === "reasoning") {
              reasoning += data.content // 累积完整内容
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, reasoning: reasoning } // 直接使用累积的完整内容
                    : msg,
                ),
              )
            }
            // 处理 type 为 html_code 的消息
            if (data.type === "html_code") {
              htmlContent += data.content // 累积完整内容
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, htmlContent: htmlContent } // 直接使用累积的完整内容
                    : msg,
                ),
              )
            }
            // 处理 type 为 text 的消息
            if (data.type === "answer") {
              answer += data.content // 累积完整内容
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, answer: answer } // 直接使用累积的完整内容
                    : msg,
                ),
              )
            }
          } catch (error) {
            console.error("Error parsing line:", error, line)
          }
        }
      }

      // 更新完成状态
      setMessages((prev) => prev.map((msg) => (msg.id === assistantId ? { ...msg, isStreaming: false } : msg)))
      handleReset(htmlContent)
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("流式请求异常:", error)
        // setMessages(prev => prev.filter(msg => msg.id !== tempId));
      }
    } finally {
      setAbortController(null)
      // setMessages(prev => prev.map(msg => {
      //   if (msg.id === tempId) {
      //     return { ...msg, isStreaming: false };
      //   }
      //   return msg;
      // }));
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleHtmlSource = (messageId: number) => {
    setShowHtmlSource((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  // 监听HTML内容变化，自动显示预览面板
  useEffect(() => {
    const latestMessage = messages.filter((msg) => msg.type === "assistant" && msg.htmlContent).pop()
    const currentHtmlContent = latestMessage?.htmlContent || ""

    // 如果有新的HTML内容生成（之前没有，现在有了）
    if (currentHtmlContent && currentHtmlContent !== prevHtmlContentRef.current) {
      // 更新store中的HTML内容
      handleReset(currentHtmlContent)

      // 自动打开HTML预览面板
      if (onToggleHtmlPanel) {
        onToggleHtmlPanel()
      }

      // 更新ref中的值
      prevHtmlContentRef.current = currentHtmlContent
    }
  }, [messages, onToggleHtmlPanel])

  //计算html大小
  const formatHtmlSize = (html: string): string => {
    const sizeInBytes = new Blob([html]).size
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
    }
  }

  //显示所有文件
  const [fileModalOpen, setFileModalOpen] = useState(false)
  //例子
  const exampleFiles: {
    name: string
    type: "code" | "image" | "document" | "link"
    date?: string
  }[] = [
    {
      name: "trigonometric_functions.html",
      type: "code",
      date: "Thursday",
    },
  ]

  return (
    <div className="flex flex-col h-full relative">
      {/* 新增：当侧边栏收起时，显示汉堡菜单按钮和新对话按钮，添加背景遮盖 */}
      {sidebarCollapsed && (
        <div className="absolute top-6 left-6 z-10">
          {/* 添加背景遮罩 */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl -m-2"></div>
          <div className="relative flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 bg-white shadow-sm border border-gray-200"
              title="展开侧边栏"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                console.log("ConversationContent 按钮被点击了！")
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

      {/* 对话标题和操作按钮 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          {/* 移除HTML预览切换按钮 */}

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
                <button
                  onClick={handleFavorite}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 rounded-t-lg ${
                    isFavorited ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "取消收藏" : "收藏"}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-50 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 对话内容 */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages &&
              messages.map(
                (message) =>
                  message && (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* 用户消息 */}
                      {message.type === "user" ? (
                        <div className="max-w-[80%]">
                          {/* 用户上传的图片 */}
                          {message.image && (
                            <img
                              src={message.image || "/placeholder.svg"}
                              alt="上传的图片"
                              className="max-w-full h-auto rounded-lg mb-2"
                            />
                          )}
                          <div className="p-4 rounded-lg relative bg-primary text-white shadow-sm">
                            {message.answer}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          {/* 深度思考部分 */}
                          {message.reasoning && (
                            <div className="max-w-[95%] w-full mb-3">
                              <ReasoningBlock
                                reasoning={message.reasoning}
                                isStreaming={!!message.isStreaming}
                                durationInSeconds={message.durationInSeconds}
                              />
                            </div>
                          )}
                          <div className="max-w-[95%] order-1 mt-2">
                            <div className="p-4 rounded-lg relative bg-white text-gray-900 shadow-sm">
                              {message.isStreaming && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                </div>
                              )}

                              {/* HTML内容渲染或源码显示*/}
                              {message.htmlContent && message.type === "assistant" && (
                                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                  {/* 左边：HTML 文件卡片 + 预览按钮 */}
                                  <div className="flex flex-wrap justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 w-full sm:w-[48%]">
                                    <div className="flex items-center gap-2 text-blue-700">
                                      <Code className="w-5 h-5" />
                                      <div className="flex flex-col">
                                        <span className="font-medium text-sm">生成文件.html</span>
                                        <span className="text-xs text-blue-500">
                                          Code · {message.htmlContent ? formatHtmlSize(message.htmlContent) : "0 B"}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={onToggleHtmlPanel}
                                      className="text-xs text-blue-600 hover:text-blue-800 underline px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                                    >
                                      <Eye className="w-3 h-3" />
                                      展开预览
                                    </button>
                                  </div>

                                  {/* 右边：查看所有文件按钮 */}
                                  <button
                                    onClick={() => setFileModalOpen(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors w-full sm:w-[48%]"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                                      />
                                    </svg>
                                    查看所有文件
                                  </button>
                                </div>
                              )}

                              <div className="markdown-content whitespace-pre-wrap break-words">
                                <ReactMarkdown
                                  remarkPlugins={[remarkMath, remarkGfm]}
                                  rehypePlugins={[rehypeKatex]}
                                  components={{
                                    a: ({ node, ...props }) => (
                                      <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      />
                                    ),
                                    code: ({ node, className, children, ...props }) => {
                                      return (
                                        <div className="bg-gray-100 dark:bg-gray-900 rounded-md my-1 overflow-x-auto">
                                          <code className="block p-2 text-sm text-black-100" {...props}>
                                            {children}
                                          </code>
                                        </div>
                                      )
                                    },
                                  }}
                                >
                                  {message.answer}
                                </ReactMarkdown>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-left">{message.timestamp}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ),
              )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* 新增：输入区域 */}
      <div className="px-6 pb-6 pt-4 max-w-4xl mx-auto w-full">
        {/* 主输入容器 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full">
          {/* 顶部工具栏 */}
          <div className="flex items-center gap-6 p-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              title="上传试题"
            >
              <FileImage className="w-4 h-4"/>
              上传试题
            </button>

            <button
              onClick={() => {
                console.log("选择知识点")
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              title="选择知识点"
            >
              <Inbox className="w-4 h-4" />
              选择知识点
            </button>
          </div>

          {/* 分割线 */}
          <div className="h-px bg-gray-200"></div>

          {/* 输入框和发送按钮 */}
          <div className="flex items-end gap-3 p-4">
            {/* 输入框 */}
            <div className="flex-1 min-w-0">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你想要讨论的问题或者话题，直接开始对话或者的问题化分析"
                className="w-full px-0 py-2 border-0 outline-none resize-none bg-transparent text-gray-900 placeholder-gray-400 text-sm leading-normal min-h-[40px] max-h-32"
                rows={2}
                style={{
                  height: "40px",
                  lineHeight: "1.4",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = "40px"
                  target.style.height = Math.min(target.scrollHeight, 128) + "px"
                }}
              />
            </div>


            {/* 右侧按钮组 */}
            <div className="flex items-center flex-shrink-0">
              {abortController ? (
                <button
                  onClick={() => abortController.abort()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  停止
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() && !selectedImage}
                  className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <FileModal isOpen={fileModalOpen} onClose={() => setFileModalOpen(false)} files={exampleFiles} />
      </div>
    </div>
  )
}

export default ConversationContent
