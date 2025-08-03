
import { FileText, BookOpen, Plus } from "lucide-react";

interface ActionButtonsProps {
  onUpload: () => void;
  onKnowledge: () => void;
  onMistakes: () => void;
}

const ActionButtons = ({ onUpload, onKnowledge, onMistakes }: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div 
        onClick={onUpload}
        className=" aspect-[2/1] min-h-[140px] bg-white rounded-2xl justify-center transition-all duration-300 border border-gray-200 flex flex-col items-center text-center cursor-pointer animate-fade-in-delay-1 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:border-accent"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-400">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-medium mb-2 text-gray-900">上传一道试题</h3>
        <p className="text-gray-500 text-sm">支持PNG、JPG等图片格式</p>
      </div>
      
      <div 
        onClick={onKnowledge}
        className=" aspect-[2/1] min-h-[140px] bg-white rounded-2xl justify-center transition-all duration-300 border border-gray-200 flex flex-col items-center text-center cursor-pointer animate-fade-in-delay-1 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:border-accent"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-400">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-medium mb-2 text-gray-900">从知识点中选择</h3>
        <p className="text-gray-500 text-sm">按知识点生成合适的内容</p>
      </div>
      
      {/* <div 
        onClick={onMistakes}
        className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-200 flex flex-col items-center text-center cursor-pointer animate-fade-in-delay-3 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:border-accent"
      >
        <div className="w-16 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 text-3xl text-primary">
          <Plus className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900">从班级高频错题中选择</h3>
        <p className="text-gray-500 text-sm mb-5">针对性查看补缺</p>
      </div> */}
    </div>
  );
};

export default ActionButtons;
