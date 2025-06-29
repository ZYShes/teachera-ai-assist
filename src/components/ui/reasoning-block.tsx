import * as React from "react"
import { ChevronDown, Sparkles} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"

interface ReasoningBlockProps {
  reasoning: string
  isStreaming: boolean
  durationInSeconds?: number
}

export function ReasoningBlock({ reasoning, isStreaming, durationInSeconds }: ReasoningBlockProps) {
  // 使用 React State 来管理折叠面板的展开/收起状态，默认为展开
  const [isOpen, setIsOpen] = React.useState(true)

  // 动态生成时间或占位符的函数
  const renderTimeInfo = () => {
    if (isStreaming) {
      return <span className="text-slate-500">(思考中...)</span>
    }
    if (durationInSeconds !== undefined) {
      return <span className="text-slate-500">(用时 {durationInSeconds} 秒)</span>
    }
    return null // 如果不处于流式传输且没有时间，则不显示任何内容
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
      {/* 折叠器的触发器部分，即用户点击的标题栏 */}
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/80">
          <div className="flex items-center gap-2">
            {/* 使用新的 Sparkles 图标 */}
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>已深度思考</span>
            {/* 调用函数来渲染时间信息 */}
            {renderTimeInfo()}
          </div>
          {/* 根据展开状态动态旋转的向下箭头图标 */}
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>

      {/* 折叠器的内容部分 */}
      <CollapsibleContent>
        <div className="border-l-2 border-slate-200 pl-4 py-2 text-sm text-slate-800 whitespace-pre-wrap">
          {reasoning}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
