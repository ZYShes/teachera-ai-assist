
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const formData = isLogin 
        ? { username, password }
        : { username, password, email, invite_code: inviteCode };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.access_token);
          // localStorage.setItem('refresh_token', data.refresh_token);
          toast({
            title: "登录成功",
            description: "欢迎回来！"
          });
          navigate("/");
        } else {
          toast({
            title: "注册成功",
            description: "请使用新账号登录"
          });
          setIsLogin(true);
        }
      } else {
        throw new Error(data.detail || '操作失败');
      }
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : '网络错误，请重试',
        variant: "destructive"
      });
    }
  };

  const handleWeChatLogin = () => {
    console.log("微信登录")
    // 这里可以添加微信登录逻辑
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo和返回按钮 */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="public\logo.png" 
              alt="TeacherA Logo"
              width={60}
              height={60}
              className="rounded-full" 
            />
            <div className="text-2xl font-bold text-primary">TeacherA</div>
          </div>
          <p className="text-gray-500">智能教师助手平台</p>
        </div>

        {/* 登录/注册表单 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${
                isLogin ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setIsLogin(true)}
            >
              登录
            </button>
            <button
              className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${
                !isLogin ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setIsLogin(false)}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="请输入用户名"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  placeholder="请输入邮箱地址（可选）"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="请输入密码"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邀请码
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  placeholder="请输入邀请码"
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary" />
                  <span className="ml-2 text-gray-600">记住我</span>
                </label>
                <a href="#" className="text-primary hover:underline">忘记密码？</a>
              </div>
            )}

            <Button type="submit" className="w-full">
              {isLogin ? '登录' : '注册'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者</span>
              </div>
            </div>

           <button
              onClick={handleWeChatLogin}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#07C160">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.932 7.621-.72-.292-.032-.586-.108-.88-.108C14.611 9.53 10.720 6.242 10.720 2.188zm-3.639 5.165c0-.523.424-.947.947-.947s.947.424.947.947a.95.95 0 0 1-.947.947.95.95 0 0 1-.947-.947zm7.357 0c0-.523.424-.947.947-.947s.947.424.947.947a.95.95 0 0 1-.947.947.95.95 0 0 1-.947-.947z" />
                <path d="M16.785 8.322c-3.623 0-6.532 2.24-6.532 5.032 0 1.684 1.175 3.215 2.951 4.22a.423.423 0 0 1 .151.474l-.272 1.026c-.014.05-.034.1-.034.151 0 .116.092.21.206.21a.23.23 0 0 0 .118-.038l1.35-.79a.613.613 0 0 1 .509-.07 7.2 7.2 0 0 0 2.013.286c3.623 0 6.532-2.24 6.532-5.032s-2.909-5.032-6.532-5.032zm-2.406 3.76c0-.372.301-.673.673-.673s.673.301.673.673a.675.675 0 0 1-.673.673.675.675 0 0 1-.673-.673zm4.812 0c0-.372.301-.673.673-.673s.673.301.673.673a.675.675 0 0 1-.673.673.675.675 0 0 1-.673-.673z" />
              </svg>
              使用微信账号{isLogin ? "登录" : "注册"}
    
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
