
import { Send } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ message, setMessage, onSendMessage }: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-5 rounded-xl border border-gray-200 font-roboto text-base transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
          placeholder="输入你想要讲解的知识点或试题，自动生成对应的可视化内容"
        />
        <button
          onClick={onSendMessage}
          className="absolute right-4 bottom-4 bg-gradient-to-r from-primary to-accent text-white border-none w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center text-xl shadow-[0_4px_10px_rgba(67,97,238,0.3)] hover:scale-105"
        >
          <Send className=""/>
        </button>
      </div>
      {/* <p className="text-center mt-3 text-sm text-gray-500">
        支持上传PNG、JPG等格式图片，自动识别试题内容
      </p> */}
    </div>
  );
};

export default MessageInput;
