import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  BookOpen,
  ShoppingBag,
  ArrowUpRight,
  Download,
  Calendar,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from 'recharts';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatters';
import { adminFetchStats } from '@/services/bookService';
import axiosInstance from '@/api/axiosInstance';

// ── Color palette for category pie ──────────────────────────────────────────
const PALETTE = [
  { fill: '#6366f1', light: '#eef2ff' },
  { fill: '#8b5cf6', light: '#f5f3ff' },
  { fill: '#ec4899', light: '#fdf2f8' },
  { fill: '#f43f5e', light: '#fff1f2' },
  { fill: '#f59e0b', light: '#fffbeb' },
  { fill: '#10b981', light: '#ecfdf5' },
];

// ── Time range options ────────────────────────────────────────────────────────
const TIME_RANGES = [
  { key: '7d',   label: '7 ngày qua' },
  { key: '30d',  label: '30 ngày qua' },
  { key: '90d',  label: '90 ngày qua' },
  { key: 'year', label: `Năm ${new Date().getFullYear()}` },
];

// ── Custom Pie Legend (không dùng recharts Legend để tránh lỗi font) ────────
const CategoryLegend = ({ data }) => (
  <div className="space-y-2.5 mt-6">
    {data.map((item, i) => {
      const total = data.reduce((s, d) => s + d.value, 0);
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      const color = PALETTE[i % PALETTE.length];
      return (
        <div key={item.name} className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: color.fill }}
          />
          <span
            className="flex-1 text-sm font-semibold text-on-surface truncate"
            title={item.name}
          >
            {item.name}
          </span>
          <span className="text-xs font-black text-on-surface-variant tabular-nums">
            {pct}%
          </span>
          <span
            className="text-xs font-black px-2 py-0.5 rounded-full tabular-nums"
            style={{ background: color.light, color: color.fill }}
          >
            {item.value.toLocaleString()}
          </span>
        </div>
      );
    })}
  </div>
);

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color, bg, trend }) => (
  <div className={`${bg} rounded-[2.5rem] p-7 flex items-start justify-between gap-4 border border-white/60 shadow-sm`}>
    <div className="space-y-2">
      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black tracking-tight" style={{ color }}>{value}</p>
      {sub && <p className="text-xs font-semibold text-on-surface-variant">{sub}</p>}
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color + '20' }}>
        <Icon size={22} style={{ color }} />
      </div>
      {trend != null && (
        <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight size={10} />
          {trend}
        </span>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');
  const [rangeOpen, setRangeOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminFetchStats();
        setDashboardData(data);
        if (data.lowStockAlerts?.length > 0) {
          data.lowStockAlerts.forEach(book =>
            toast.error(`Sắp hết hàng: ${book.title} (còn ${book.stock})`, {
              duration: 5000,
              style: { borderRadius: '16px', fontWeight: 'bold' },
            })
          );
        }
      } catch {
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filter monthly data by time range ───────────────────────────────────
  const filterByRange = (map) => {
    if (!map) return [];
    const now = new Date();
    const entries = Object.entries(map).map(([m, v]) => ({
      month: parseInt(m),
      value: v,
    }));

    if (timeRange === 'year') {
      return entries
        .sort((a, b) => a.month - b.month)
        .map(e => ({ name: `T${e.month}`, amount: e.value, users: e.value }));
    }

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - Math.ceil(days / 30), 1);
    return entries
      .filter(e => {
        const d = new Date(now.getFullYear(), e.month - 1, 1);
        return d >= cutoff;
      })
      .sort((a, b) => a.month - b.month)
      .map(e => ({ name: `T${e.month}`, amount: e.value, users: e.value }));
  };

  const revenueData = useMemo(() => filterByRange(dashboardData?.monthlyRevenue), [dashboardData, timeRange]);
  const userData    = useMemo(() => filterByRange(dashboardData?.monthlyUsers),   [dashboardData, timeRange]);

  const categoryData = useMemo(() => {
    if (!dashboardData?.categorySales) return [];
    return Object.entries(dashboardData.categorySales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [dashboardData]);

  const handleExport = async () => {
    try {
      toast.loading('Đang xuất báo cáo...', { id: 'exp' });
      const res = await axiosInstance.get('/admin/orders', { params: { size: 1000 } });
      const orders = res.data.content || [];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          orders.map(o => ({
            'Mã đơn': o.id,
            'Ngày đặt': new Date(o.orderDate).toLocaleDateString('vi-VN'),
            'Khách hàng': o.userEmail || 'Khách vãng lai',
            'Tổng tiền': o.totalAmount,
            'Trạng thái': o.status,
            'Địa chỉ': o.shippingAddress,
            'SĐT': o.phoneNumber,
          }))
        ),
        'Đơn hàng'
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(revenueData.map(r => ({ Tháng: r.name, 'Doanh thu (VNĐ)': r.amount }))),
        'Doanh thu'
      );
      XLSX.writeFile(wb, `BookVerse_Bao_cao_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Xuất thành công!', { id: 'exp' });
    } catch {
      toast.error('Lỗi khi xuất báo cáo', { id: 'exp' });
    }
  };

  const selectedLabel = TIME_RANGES.find(r => r.key === timeRange)?.label;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-1">Thống kê &amp; Báo cáo</h1>
          <p className="text-on-surface-variant font-medium text-sm">Theo dõi các chỉ số quan trọng của BookVerse.</p>
        </div>

        {/* Time-range filter + Export */}
        <div className="flex items-center gap-3">
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRangeOpen(p => !p)}
              className="flex items-center gap-2 bg-surface-container-high px-5 py-3 rounded-2xl font-bold text-sm hover:bg-surface-container transition-colors border border-outline-variant/10 shadow-sm"
            >
              <Calendar size={16} className="text-primary" />
              <span>{selectedLabel}</span>
              <ChevronDown size={14} className={`transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
            </button>
            {rangeOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-outline-variant/10 rounded-2xl shadow-xl z-50 min-w-[180px] overflow-hidden">
                {TIME_RANGES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => { setTimeRange(r.key); setRangeOpen(false); }}
                    className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-colors hover:bg-surface-container ${
                      timeRange === r.key ? 'text-primary bg-primary/5' : 'text-on-surface-variant'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Download size={16} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Tổng doanh thu"
          value={formatPrice(dashboardData?.totalRevenue || 0)}
          sub="Tất cả thời gian"
          icon={TrendingUp}
          color="#6366f1"
          bg="bg-indigo-50"
          trend="+12.5%"
        />
        <StatCard
          label="Tổng đơn hàng"
          value={(dashboardData?.totalOrders || 0).toLocaleString()}
          sub={`Trong ${selectedLabel.toLowerCase()}`}
          icon={ShoppingBag}
          color="#8b5cf6"
          bg="bg-violet-50"
          trend="+8.3%"
        />
        <StatCard
          label="Người dùng"
          value={(dashboardData?.totalUsers || 0).toLocaleString()}
          sub="Tài khoản đã đăng ký"
          icon={Users}
          color="#ec4899"
          bg="bg-pink-50"
          trend="+5.1%"
        />
        <StatCard
          label="Tổng đầu sách"
          value={(dashboardData?.totalBooks || 0).toLocaleString()}
          sub="Trong kho"
          icon={BookOpen}
          color="#10b981"
          bg="bg-emerald-50"
          trend="+2.4%"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Revenue + User Growth */}
        <div className="lg:col-span-8 space-y-8">

          {/* Revenue Bar Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight text-on-surface">Doanh thu theo tháng</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                  Đơn vị: VNĐ &nbsp;·&nbsp; Kỳ: {selectedLabel}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                <TrendingUp size={12} /> Tăng trưởng ổn định
              </span>
            </div>
            {revenueData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                      tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc', radius: 8 }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                      formatter={v => [formatPrice(v), 'Doanh thu']}
                    />
                    <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                      {revenueData.map((_, i) => (
                        <Cell key={i} fill={i === revenueData.length - 1 ? '#6366f1' : '#c7d2fe'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-on-surface-variant italic">
                Không có dữ liệu cho khoảng thời gian này
              </div>
            )}
          </div>

          {/* User Growth Line Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight text-on-surface">Người dùng mới theo tháng</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Tăng trưởng cộng đồng BookVerse</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
                <Users size={12} /> Tổng: {(dashboardData?.totalUsers || 0).toLocaleString()}
              </span>
            </div>
            {userData.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                      formatter={v => [v.toLocaleString(), 'Người dùng mới']}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-on-surface-variant italic">
                Không có dữ liệu cho khoảng thời gian này
              </div>
            )}
          </div>
        </div>

        {/* Right: Pie + Low Stock */}
        <div className="lg:col-span-4 space-y-8">

          {/* Category Pie Chart — custom legend, no recharts Legend */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <h3 className="text-lg font-black tracking-tight text-on-surface">Danh mục bán chạy</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1 mb-6">
              Tỷ lệ đơn hàng theo thể loại
            </p>

            {categoryData.length > 0 ? (
              <>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={56}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={PALETTE[i % PALETTE.length].fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', fontFamily: 'inherit', fontSize: 13 }}
                        formatter={(v, name) => [v.toLocaleString() + ' đơn', name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom legend — pure JSX, zero font issues */}
                <CategoryLegend data={categoryData} />
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-on-surface-variant italic">
                Chưa có dữ liệu
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight text-on-surface">Cảnh báo hết hàng</h3>
              <span className="bg-error/10 text-error px-3 py-1 rounded-full text-xs font-black">
                {dashboardData?.lowStockAlerts?.length || 0} sách
              </span>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {dashboardData?.lowStockAlerts?.length > 0 ? (
                dashboardData.lowStockAlerts.map(book => (
                  <div
                    key={book.id}
                    className="flex items-center gap-4 p-4 bg-error/5 border border-error/10 rounded-2xl"
                  >
                    <div className="w-9 h-9 bg-error/10 rounded-xl flex items-center justify-center shrink-0">
                      <AlertTriangle size={16} className="text-error" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{book.title}</p>
                      <p className="text-[10px] font-black text-outline uppercase tracking-wider">ID #{book.id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-error">Còn {book.stock}</p>
                      <p className="text-[10px] text-on-surface-variant">Cần nhập kho</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface-variant">Tất cả sản phẩm đủ tồn kho</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
