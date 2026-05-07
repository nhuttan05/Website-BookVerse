import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  BarChart3, 
  ArrowUpRight, 
  Download,
  Calendar,
  Eye,
  PieChart
} from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { adminFetchStats } from '@/services/bookService';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await adminFetchStats();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">Thống kê & Báo cáo</h1>
          <p className="text-on-surface-variant font-medium">Theo dõi các chỉ số quan trọng của kho tàng tri thức BookVerse.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-surface-container-high px-6 py-3 rounded-2xl font-bold text-sm hover:bg-surface-container transition-colors border border-outline-variant/10">
            <Calendar size={18} />
            <span>Năm 2024</span>
          </button>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
            <Download size={18} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Revenue Chart & Traffic */}
        <div className="lg:col-span-8 space-y-8">
          {/* Revenue Chart Card */}
          <div className="bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-xl font-black tracking-tighter">Doanh thu hàng tháng</h3>
                <p className="text-xs font-medium text-on-surface-variant">Thống kê dữ liệu thực tế từ hệ thống thanh toán</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-bold text-on-surface-variant">2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-surface-container-high" />
                  <span className="text-xs font-bold text-on-surface-variant">2023</span>
                </div>
              </div>
            </div>
            
            {/* Mock Line Chart */}
            <div className="h-64 flex items-end justify-between px-2 relative z-10">
              {[40, 25, 60, 45, 90, 70, 85, 60, 95, 80, 110, 100].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-4 w-full">
                  <div className="w-1.5 bg-primary/10 rounded-full h-full relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-1000 delay-300"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase text-outline">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Web Traffic Card */}
          <div className="bg-primary p-12 rounded-[48px] text-on-primary shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-4">Lượt truy cập trang web</p>
              <p className="text-sm font-bold opacity-80 mb-6">Tăng trưởng ổn định +12.4% tháng này</p>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black tracking-tighter">42,851</span>
                <span className="text-lg font-bold opacity-70 italic">views</span>
              </div>
            </div>
            {/* Wave effect at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 group-hover:scale-y-110 transition-transform duration-700">
               <svg viewBox="0 0 1000 100" className="w-full h-full preserve-3d">
                 <path d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1000,50 L1000,100 L0,100 Z" fill="white" />
               </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Distribution & Performance */}
        <div className="lg:col-span-4 space-y-8">
          {/* Category Distribution Card */}
          <div className="bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-black tracking-tighter mb-2">Phân bổ theo thể loại</h3>
            <p className="text-xs font-medium text-on-surface-variant mb-10">Tỷ lệ đầu sách hiện có trong kho</p>
            
            <div className="relative w-48 h-48 mx-auto mb-10">
              {/* Mock Donut Chart */}
              <div className="absolute inset-0 rounded-full border-[16px] border-surface-container-high" />
              <div className="absolute inset-0 rounded-full border-[16px] border-primary border-r-transparent border-b-transparent -rotate-12" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-black text-on-surface">2.4k</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-outline">Đầu sách</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4">
              {[
                { label: 'Fiction', value: '35%', color: 'bg-primary' },
                { label: 'Non-fiction', value: '25%', color: 'bg-secondary' },
                { label: 'Science', value: '20%', color: 'bg-tertiary' },
                { label: 'Art', value: '20%', color: 'bg-surface-container-high' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-[10px] font-bold text-on-surface-variant">{item.label} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance Table Card */}
          <div className="bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-sm">
            <h3 className="text-lg font-black tracking-tighter mb-8">Hiệu suất thể loại</h3>
            <div className="space-y-6">
              {[
                { name: 'Văn học giả tưởng', sold: '1,240', revenue: '350.0M đ', trend: '+18%', color: 'text-success' },
                { name: 'Kinh tế & Quản trị', sold: '856', revenue: '210.5M đ', trend: '+5%', color: 'text-success' },
                { name: 'Khoa học - Kỹ thuật', sold: '420', revenue: '125.0M đ', trend: '-2%', color: 'text-error' },
                { name: 'Nghệ thuật & Thiết kế', sold: '184', revenue: '89.2M đ', trend: '+12%', color: 'text-success' },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-surface-container/30 p-2 rounded-xl transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-on-surface">{cat.name}</p>
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">{cat.sold} Đã bán</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-on-surface">{cat.revenue}</p>
                    <p className={`text-[10px] font-black ${cat.color} flex items-center justify-end gap-1`}>
                       <TrendingUp size={10} /> {cat.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
