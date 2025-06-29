
import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(localStorage.getItem("token")?true:false); // 模拟登录状态，可以后续连接到真实的认证系统
  
  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-primary to-accent px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img
            src="public\logo.png" 
            alt="TeacherA Logo"
            width={40}
            height={40}
            className="rounded-full" 
        />
        <div className="text-xl font-bold text-white tracking-tight">
          TeacherA
        </div>
      </div>
      
      <div className="flex gap-3">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="bg-white text-primary border-none px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-[0_4px_12px_rgba(67,97,238,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)]"
          >
            <User className="w-4 h-4" />
            退出
          </button>
        )
        :
        (
          <button 
          onClick={handleLogin}
          className="bg-gradient-to-r from-primary to-accent text-white border-none px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-[0_4px_12px_rgba(67,97,238,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)]"
        >
          <User className="w-4 h-4" />
          <span>登录 / 注册</span>
        </button>
        )}
      
      </div>
    </header>
  );
};

export default Header;
