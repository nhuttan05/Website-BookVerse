// =====================================================
//  PAGE — LoginPage.jsx
//  Giao diện đăng nhập (Stitch-aligned)
//  Aether Verse: Centered card, premium inputs, social auth
// =====================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth, clearError } from '@/redux/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl relative z-10 border border-outline-variant/10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Welcome back</h1>
          <p className="text-on-surface-variant font-medium">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error/10 p-4 rounded-2xl border border-error/20 text-error text-xs font-bold animate-in fade-in duration-300">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@bookverse.com" 
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-outline-variant"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-on-surface">Mật khẩu</label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">Quên mật khẩu?</button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-outline-variant"
              required
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group px-1">
            <input type="checkbox" className="w-5 h-5 border-2 border-outline-variant rounded-md appearance-none checked:bg-primary checked:border-primary transition-all" />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Remember for 30 days</span>
          </label>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : 'Đăng nhập'}
          </button>
        </form>

        <div className="relative my-10 text-center">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/20 -z-10"></div>
          <span className="bg-white px-4 text-xs font-bold text-outline uppercase tracking-widest">Or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:bg-surface-container transition-colors">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            <span className="text-sm font-bold">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">apple</span>
            <span className="text-sm font-bold">Apple</span>
          </button>
        </div>

        <p className="text-center mt-10 text-sm font-medium text-on-surface-variant">
          Bạn chưa có tài khoản? <Link to="/register" className="text-primary font-black hover:underline">Tạo tài khoản mới</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
