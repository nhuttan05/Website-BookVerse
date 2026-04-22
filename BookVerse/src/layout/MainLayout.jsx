// =====================================================
//  LAYOUT — MainLayout.jsx
//  Theo đúng Stitch design: glassmorphism navbar
//  Nav: BookVerse logo, Trang chủ, Danh mục, Blog
//  Actions: Cart icon, Dark mode, User, Đăng nhập button
// =====================================================
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Moon, Menu, X } from 'lucide-react';
import { selectCartTotalQuantity } from '@/redux/cartSlice';
import { selectAuth, logout, getCurrentUser } from '@/redux/authSlice';
import { selectWishlistItems } from '@/redux/wishlistSlice';

const NAV_LINKS = [
  { path: '/',          label: 'Trang chủ', id: 'nav-home' },
  { path: '/categories', label: 'Danh mục',  id: 'nav-categories' },
  { path: '/blog',      label: 'Blog',       id: 'nav-blog' },
];

const MainLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const { user, isAuthenticated } = useSelector(selectAuth);
  const wishlistItems = useSelector(selectWishlistItems);

  useEffect(() => {
    // Khôi phục phiên làm việc nếu có token
    if (localStorage.getItem('bookverse_access_token') && !user) {
      dispatch(getCurrentUser());
    }

    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface">

      {/* ══════════ STICKY HEADER ══════════ */}
      <header
        id="main-header"
        className={`fixed top-0 w-full z-50 transition-shadow duration-300 ${
          isScrolled ? 'shadow-[0_1px_40px_rgba(27,28,26,0.07)]' : ''
        }`}
        style={{
          background: 'rgba(251,249,245,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link to="/" id="logo" className="text-2xl font-bold tracking-tighter text-primary no-underline">
            BookVerse
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.id}
                to={link.path}
                id={link.id}
                className={({ isActive }) =>
                  `font-medium tracking-tight transition-all duration-200 no-underline ${
                    isActive
                      ? 'text-primary font-bold border-b-2 border-primary pb-1'
                      : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link
              to="/wishlist"
              id="nav-wishlist"
              className="p-2 hover:bg-surface-container rounded-xl transition-colors text-on-surface-variant relative"
              title="Danh sách yêu thích"
            >
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              id="nav-cart"
              className="p-2 hover:bg-surface-container rounded-xl transition-colors text-on-surface-variant relative"
              title="Giỏ hàng"
            >
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-sm">
                  {totalQuantity}
                </span>
              )}
            </Link>
            
            <button
              className="p-2 hover:bg-surface-container rounded-xl transition-colors text-on-surface-variant hidden md:flex"
              title="Chế độ tối"
            >
              <Moon size={22} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  id="nav-user"
                  className="p-1 hover:bg-surface-container rounded-xl transition-colors hidden md:flex items-center gap-3 pr-4"
                  title="Tài khoản"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-outline-variant/20">
                    <img 
                      src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.email}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-on-surface hidden lg:block">{user?.fullName?.split(' ').pop()}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  title="Đăng xuất"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="nav-login"
                className="px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-container transition-colors active:scale-95"
              >
                Đăng nhập
              </Link>
            )}

            <button
              className="md:hidden p-2 hover:bg-surface-container rounded-xl transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/10 px-6 pb-4">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.id}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3 font-medium no-underline ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="pt-[72px]">
        {children}
      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-surface-container mt-20 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tighter text-primary">BookVerse</span>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Hệ sinh thái tri thức hiện đại, nơi mỗi cuốn sách là một hành trình khám phá mới.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold">f</a>
              <a href="#" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold">@</a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-on-surface mb-5">Về chúng tôi</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant">
              {['About us', 'Privacy Policy', 'Terms of Service'].map(t => (
                <li key={t}><a href="#" className="hover:text-primary hover:underline transition-colors">{t}</a></li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-on-surface mb-5">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant">
              {['Shipping & Returns', 'Contact', 'FAQs'].map(t => (
                <li key={t}><a href="#" className="hover:text-primary hover:underline transition-colors">{t}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-on-surface mb-5">Đăng ký bản tin</h4>
            <p className="text-sm text-on-surface-variant mb-4">Nhận thông báo về sách mới và ưu đãi độc quyền hàng tuần.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="bg-surface px-4 py-2 rounded-xl text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-container transition-colors active:scale-95">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/10 text-center">
          <p className="text-sm text-on-surface-variant">© 2024 BookVerse Archive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
