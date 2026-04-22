// =====================================================
//  PAGE — DashboardPage.jsx
//  Bảng điều khiển người dùng (Stitch-aligned)
//  Aether Verse: Sidebar layout, profile metrics, reading progress
// =====================================================

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuth } from '@/redux/authSlice';
import { MOCK_BOOKS } from '@/data/mockBooks';
import { formatPrice } from '@/utils/formatters';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector(selectAuth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
      </div>
    );
  }
  return (
    <div className="bg-surface min-h-screen flex">
      
      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="w-64 border-r border-outline-variant/10 px-6 py-10 hidden lg:flex flex-col gap-10">
        <div className="space-y-2">
          {[
            { label: 'Dashboard', icon: 'dashboard', active: true },
            { label: 'My Library', icon: 'auto_stories' },
            { label: 'Wishlist', icon: 'favorite' },
            { label: 'Orders', icon: 'shopping_bag' },
            { label: 'Settings', icon: 'settings' }
          ].map(item => (
            <button key={item.label} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
              item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container'
            }`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto bg-primary-container/20 p-6 rounded-[2rem] space-y-4">
          <h4 className="font-black text-sm text-primary tracking-tight">Premium Access</h4>
          <p className="text-[10px] text-on-surface-variant leading-relaxed font-bold uppercase tracking-wider">Unlock unlimited digital archive access.</p>
          <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow">
            Upgrade to Premium
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="flex-1 px-10 py-10 space-y-12 overflow-y-auto">
        
        {/* Profile & Stats Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-surface-container-low p-10 rounded-[3rem] flex items-center gap-10 border border-outline-variant/5">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white">
              <img 
                className="w-full h-full object-cover" 
                src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.email}`} 
                alt="User" 
              />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Curator Level 4</span>
              <h1 className="text-4xl font-black tracking-tight text-on-surface">{user?.fullName}</h1>
              <p className="text-sm text-on-surface-variant font-medium">Thành viên từ {new Date(user?.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/5 flex items-center gap-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <div>
                <p className="text-3xl font-black text-on-surface">12</p>
                <p className="text-xs font-bold text-outline-variant uppercase tracking-widest">Sách đã đọc</p>
              </div>
            </div>
            <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/5 flex items-center gap-6">
              <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">star</span>
              </div>
              <div>
                <p className="text-3xl font-black text-on-surface">48</p>
                <p className="text-xs font-bold text-outline-variant uppercase tracking-widest">Đánh giá</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-on-surface">Đang đọc</h2>
              <p className="text-on-surface-variant text-sm mt-1">Tiếp tục hành trình khám phá kiến thức của bạn.</p>
            </div>
            <button className="text-sm font-bold text-primary hover:underline flex items-center gap-2">Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Tư Duy Hệ Thống', author: 'Donella Meadows', progress: 65, img: 'https://covers.openlibrary.org/b/id/8739161-L.jpg' },
              { title: 'Sapiens', author: 'Yuval Noah Harari', progress: 22, img: 'https://covers.openlibrary.org/b/id/8739162-L.jpg' },
              { title: 'Deep Work', author: 'Cal Newport', progress: 88, img: 'https://covers.openlibrary.org/b/id/8739163-L.jpg' }
            ].map(book => (
              <div key={book.title} className="bg-surface-container-low p-6 rounded-[2.5rem] space-y-6 group hover:shadow-xl transition-all border border-outline-variant/5">
                <div className="flex gap-4">
                  <div className="w-20 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                    <img className="w-full h-full object-cover" src={book.img} alt={book.title} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-on-surface line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-on-surface-variant">{book.author}</p>
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest pt-2">Kinh doanh</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-outline uppercase tracking-widest">
                    <span>{book.progress}% Hoàn thành</span>
                    <button className="text-primary hover:underline">Đọc ngay</button>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${book.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Wishlist */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight text-on-surface">Danh sách mong muốn</h2>
            <div className="bg-surface-container-low p-4 rounded-[2.5rem] space-y-2 border border-outline-variant/5">
              {MOCK_BOOKS.slice(0, 3).map(book => (
                <div key={book.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container transition-colors">
                  <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm">
                    <img className="w-full h-full object-cover" src={book.coverImageUrl} alt={book.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-on-surface truncate">{book.title}</h4>
                    <p className="text-xs text-on-surface-variant">{book.author.name}</p>
                  </div>
                  <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">Mua ngay</button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Orders */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight text-on-surface">Đơn hàng gần đây</h2>
            <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-black text-outline uppercase tracking-[0.2em] border-b border-outline-variant/10">
                    <th className="text-left pb-4">ID Đơn</th>
                    <th className="text-left pb-4">Ngày đặt</th>
                    <th className="text-left pb-4">Trạng thái</th>
                    <th className="text-right pb-4">Tổng</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  {[
                    { id: '#BV9921', date: '12/10/2023', status: 'Hoàn thành', total: '450.000đ' },
                    { id: '#BV9854', date: '05/10/2023', status: 'Hoàn thành', total: '210.000đ' },
                    { id: '#BV9712', date: '28/09/2023', status: 'Đang xử lý', total: '890.000đ' }
                  ].map(order => (
                    <tr key={order.id} className="border-b last:border-none border-outline-variant/5 group">
                      <td className="py-5 text-on-surface group-hover:text-primary transition-colors">{order.id}</td>
                      <td className="py-5 text-on-surface-variant">{order.date}</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Hoàn thành' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                        }`}>{order.status}</span>
                      </td>
                      <td className="py-5 text-right text-on-surface">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
};

export default DashboardPage;
