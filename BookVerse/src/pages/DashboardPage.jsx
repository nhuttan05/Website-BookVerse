// =====================================================
//  PAGE — DashboardPage.jsx
//  Trang cá nhân người dùng: Overview + Orders
//  Sidebar: Dashboard, Orders, Đăng xuất
// =====================================================

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { selectAuth, logout } from '@/redux/authSlice';
import { fetchOrderHistory, selectOrders, selectOrderLoading } from '@/redux/orderSlice';
import { selectCartItems, selectCartTotalAmount } from '@/redux/cartSlice';
import { formatPrice } from '@/utils/formatters';

const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xử lý',    icon: 'hourglass_empty', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  PROCESSING: { label: 'Đang xử lý',   icon: 'inventory_2',     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  SHIPPED:    { label: 'Đang giao',     icon: 'local_shipping',  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  DELIVERED:  { label: 'Đã giao hàng', icon: 'where_to_vote',   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  CANCELLED:  { label: 'Đã hủy',       icon: 'cancel',          color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
};

const IN_PROGRESS_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED'];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { user, isAuthenticated, loading } = useSelector(selectAuth);
  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrderLoading);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalAmount);

  useEffect(() => {
    if (!isAuthenticated && !loading) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrderHistory());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
      </div>
    );
  }

  const inProgressOrders = orders.filter(o => IN_PROGRESS_STATUSES.includes(o.status));
  const completedOrders  = orders.filter(o => o.status === 'DELIVERED');

  const SIDEBAR_ITEMS = [
    { key: 'overview', label: 'Tổng quan',    icon: 'dashboard' },
    { key: 'orders',   label: 'Đơn hàng',     icon: 'shopping_bag' },
  ];

  return (
    <div className="bg-surface min-h-screen flex">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="w-64 border-r border-outline-variant/10 px-6 py-10 hidden lg:flex flex-col gap-6">
        <div className="space-y-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.key
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-outline-variant/10 pt-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="font-bold text-sm">Trang chủ</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-error hover:bg-error/5 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-bold text-sm">Đăng xuất</span>
          </button>
        </div>

        {/* Premium card */}
        <div className="mt-auto bg-primary/5 p-6 rounded-[2rem] space-y-4 border border-primary/10">
          <h4 className="font-black text-sm text-primary tracking-tight">Premium Access</h4>
          <p className="text-[10px] text-on-surface-variant leading-relaxed font-bold uppercase tracking-wider">Mở khóa kho lưu trữ kỹ thuật số không giới hạn.</p>
          <button className="w-full py-3 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md hover:bg-primary-container transition-all active:scale-95">
            Nâng cấp Premium
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="flex-1 px-6 lg:px-10 py-10 space-y-10 overflow-y-auto">

        {/* Profile Card */}
        <div className="bg-surface-container-low p-8 rounded-[3rem] flex flex-col sm:flex-row items-center gap-8 border border-outline-variant/5">
          <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-xl ring-4 ring-white shrink-0">
            <img
              className="w-full h-full object-cover"
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt="User"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              Thành viên
            </span>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">{user?.fullName}</h1>
            <p className="text-sm text-on-surface-variant font-medium">{user?.email}</p>
          </div>
          <div className="sm:ml-auto flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{orders.length}</p>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest mt-1">Đơn hàng</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-amber-500">{inProgressOrders.length}</p>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest mt-1">Đang giao</p>
            </div>
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex lg:hidden gap-2 bg-surface-container-low p-1.5 rounded-2xl">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === item.key ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: OVERVIEW ══ */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-400">

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Tổng đơn hàng',  value: orders.length,          icon: 'shopping_bag',   color: 'text-primary',   bg: 'bg-primary/10' },
                { label: 'Đang giao',       value: inProgressOrders.length, icon: 'local_shipping', color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Đã hoàn thành',   value: completedOrders.length,  icon: 'check_circle',   color: 'text-green-600',  bg: 'bg-green-50' },
                { label: 'Trong giỏ hàng',  value: cartItems.length,        icon: 'shopping_cart',  color: 'text-amber-600',  bg: 'bg-amber-50' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-outline-variant/5 flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} shrink-0`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest leading-tight mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* In-progress orders preview */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-on-surface">Đơn đang giao</h2>
                <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-primary hover:underline">
                  Xem tất cả →
                </button>
              </div>
              <div className="space-y-3">
                {inProgressOrders.length > 0 ? inProgressOrders.slice(0, 3).map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  return (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-5 p-5 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors group no-underline"
                    >
                      <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined text-lg ${cfg.color}`}>{cfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-on-surface group-hover:text-primary transition-colors">Đơn hàng #{order.id}</p>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {new Date(order.orderDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-primary">{formatPrice(order.totalAmount)}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
                    </Link>
                  );
                }) : (
                  <div className="p-12 text-center bg-surface-container-low rounded-2xl text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-3 block text-outline-variant">local_shipping</span>
                    <p className="font-bold">Không có đơn hàng đang giao</p>
                  </div>
                )}
              </div>
            </section>

            {/* Cart summary */}
            {cartItems.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black tracking-tight text-on-surface">Giỏ hàng hiện tại</h2>
                  <Link to="/cart" className="text-sm font-bold text-primary hover:underline">Xem giỏ hàng →</Link>
                </div>
                <div className="bg-surface-container-low rounded-[2rem] p-6 space-y-3 border border-outline-variant/5">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors">
                      <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" src={item.coverImageUrl} alt={item.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-on-surface truncate text-sm">{item.title}</h4>
                        <p className="text-xs text-on-surface-variant">{item.author} · x{item.quantity}</p>
                      </div>
                      <p className="font-black text-primary shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <span className="font-black text-on-surface">Tổng giỏ hàng</span>
                    <span className="text-xl font-black text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                  <Link to="/checkout" className="block w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-center text-sm uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 no-underline">
                    Tiến hành thanh toán →
                  </Link>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ══ TAB: ORDERS ══ */}
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <h2 className="text-3xl font-black tracking-tight text-on-surface">Đơn hàng của tôi</h2>

            {/* Cart section */}
            {cartItems.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-500">shopping_cart</span>
                  <h3 className="text-lg font-black text-on-surface">Giỏ hàng chưa thanh toán</h3>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest">{cartItems.length} sản phẩm</span>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200/60 rounded-[2rem] p-6 space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/70">
                      <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" src={item.coverImageUrl} alt={item.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-on-surface truncate text-sm">{item.title}</h4>
                        <p className="text-xs text-on-surface-variant">{item.author}</p>
                        <p className="text-xs font-bold text-amber-600">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-black text-amber-700 shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-amber-200">
                    <span className="font-black text-on-surface">Tổng cộng</span>
                    <span className="text-xl font-black text-amber-600">{formatPrice(cartTotal)}</span>
                  </div>
                  <Link to="/checkout" className="block w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-center text-sm uppercase tracking-widest hover:bg-amber-600 transition-colors no-underline">
                    Thanh toán ngay →
                  </Link>
                </div>
              </section>
            )}

            {/* In-progress orders */}
            {inProgressOrders.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-600">local_shipping</span>
                  <h3 className="text-lg font-black text-on-surface">Đơn đang trong tiến độ giao</h3>
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black rounded-full uppercase tracking-widest">{inProgressOrders.length} đơn</span>
                </div>
                <div className="space-y-3">
                  {inProgressOrders.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    return (
                      <Link
                        key={order.id}
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-5 p-6 bg-white border-2 border-outline-variant/10 rounded-[2rem] hover:border-primary/20 hover:shadow-md transition-all group no-underline"
                      >
                        <div className={`w-14 h-14 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0 border-2 ${cfg.border}`}>
                          <span className={`material-symbols-outlined text-2xl ${cfg.color}`}>{cfg.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-black text-on-surface text-lg group-hover:text-primary transition-colors">Đơn #{order.id}</p>
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant">
                            Đặt ngày {new Date(order.orderDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          {order.items && (
                            <p className="text-xs text-outline mt-1">{order.items.length} sản phẩm</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-black text-primary">{formatPrice(order.totalAmount)}</p>
                          <p className="text-xs text-on-surface-variant mt-1">Xem chi tiết →</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All orders table */}
            <section className="space-y-4">
              <h3 className="text-lg font-black text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">history</span>
                Lịch sử tất cả đơn hàng
              </h3>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
                </div>
              ) : orders.length > 0 ? (
                <div className="bg-surface-container-low rounded-[2rem] border border-outline-variant/5 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] font-black text-outline uppercase tracking-[0.15em] border-b border-outline-variant/10 bg-surface-container">
                        <th className="text-left px-6 py-4">Mã đơn</th>
                        <th className="text-left px-6 py-4">Ngày đặt</th>
                        <th className="text-left px-6 py-4">Trạng thái</th>
                        <th className="text-right px-6 py-4">Tổng tiền</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                        return (
                          <tr key={order.id} className="border-b last:border-none border-outline-variant/5 hover:bg-surface-container/50 transition-colors group">
                            <td className="px-6 py-5 font-black text-on-surface group-hover:text-primary transition-colors">#{order.id}</td>
                            <td className="px-6 py-5 text-on-surface-variant font-medium">
                              {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                                <span className={`material-symbols-outlined text-xs`}>{cfg.icon}</span>
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-on-surface">{formatPrice(order.totalAmount)}</td>
                            <td className="px-6 py-5">
                              <Link
                                to={`/orders/${order.id}`}
                                className="px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-on-primary transition-all no-underline"
                              >
                                Chi tiết
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center bg-surface-container-low rounded-[2rem] border border-outline-variant/5">
                  <span className="material-symbols-outlined text-5xl text-outline-variant block mb-4">shopping_bag</span>
                  <p className="font-bold text-on-surface-variant text-lg">Bạn chưa có đơn hàng nào</p>
                  <Link to="/browse" className="inline-block mt-6 px-8 py-3 bg-primary text-on-primary rounded-2xl font-black text-sm hover:scale-105 transition-transform no-underline">
                    Khám phá sách ngay
                  </Link>
                </div>
              )}
            </section>
          </div>
        )}

      </main>
    </div>
  );
};

export default DashboardPage;
