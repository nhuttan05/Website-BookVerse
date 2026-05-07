// =====================================================
//  PAGE — RegisterPage.jsx
//  Giao diện đăng ký (Stitch-aligned)
//  Aether Verse: Centered card, terms checkbox, clean flow
// =====================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, selectAuth, clearError } from '@/redux/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    }));
    
    if (register.fulfilled.match(result)) {
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/10 to-transparent z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl relative z-10 border border-outline-variant/10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Bắt đầu hành trình</h1>
          <p className="text-on-surface-variant font-medium">Gia nhập thư viện số BookVerse.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Họ và tên</label>
            <input 
              name="fullName"
              type="text" 
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A" 
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-outline-variant"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Email</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="example@bookverse.com" 
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-outline-variant"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Mật khẩu</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-outline-variant"
              required
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group px-1 pt-2">
            <input 
              name="agreeTerms"
              type="checkbox" 
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 border-2 border-outline-variant rounded-md appearance-none checked:bg-primary checked:border-primary transition-all shrink-0" 
              required 
            />
            <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface leading-relaxed">
              Tôi đồng ý với các <Link className="text-primary font-bold">Điều khoản Dịch vụ</Link> và <Link className="text-primary font-bold">Chính sách Bảo mật</Link>.
            </span>
          </label>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-on-primary rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 mt-6 disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-10 text-sm font-medium text-on-surface-variant">
          Đã có tài khoản? <Link to="/login" className="text-primary font-black hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
