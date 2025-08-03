import { useState } from "react";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ message, setMessage, onSendMessage }: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
          rows={1}
          className="w-full pl-4 py-3 rounded-xl border border-gray-300 font-roboto text-base text-gray-700 placeholder:text-gray-400 shadow-sm resize-none focus:outline-none focus:border-blue-500"
          placeholder="输入你想要讲解的知识点或试题，自动生成对应的可视化内容"
        />
        <button
          onClick={onSendMessage}
          className="absolute right-3 top-0 bottom-0 flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="#2196F3"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
