import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '@/redux/authSlice';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  LogOut, 
  Bell,
  Search,
  Settings
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminNavLinks = [
    { path: '/admin/analytics',  label: 'Thống kê',      icon: <BarChart3 size={20} /> },
    { path: '/admin/books',      label: 'Quản lý sách', icon: <BookOpen size={20} /> },
    { path: '/admin/categories', label: 'Danh mục',    icon: <Layers size={20} /> },
    { path: '/admin/orders',     label: 'Đơn hàng',    icon: <ShoppingBag size={20} /> },
    { path: '/admin/coupons',    label: 'Mã giảm giá', icon: <Layers size={20} /> },
    { path: '/admin/users',      label: 'Người dùng',  icon: <Users size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`bg-surface-container-low border-r border-outline-variant/10 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-8 flex items-center gap-4 overflow-hidden">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white">shield_person</span>
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-black tracking-tighter text-primary whitespace-nowrap">Admin Portal</span>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="px-4 mb-4">
          <NavLink 
            to="/" 
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all no-underline border border-transparent hover:border-primary/10"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            {isSidebarOpen && <span className="text-sm font-bold">Xem trang chủ</span>}
          </NavLink>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {adminNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group no-underline ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-xl shadow-primary/20 font-black' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`
              }
            >
              <span className="shrink-0">{link.icon}</span>
              {isSidebarOpen && <span className="text-sm tracking-tight">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-on-surface-variant hover:text-error hover:bg-error/5 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8 z-30">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-surface-container-high px-4 py-2 rounded-xl border border-outline-variant/10 min-w-[300px]">
              <Search size={18} className="text-outline" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full px-3"
              />
            </div>

            <div className="flex items-center gap-4 border-l border-outline-variant/10 pl-6">
              <button className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-3 ml-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-on-surface leading-tight">Admin Master</p>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm ring-2 ring-primary/10">
                  <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} alt="Admin" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
