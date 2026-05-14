import { useState, useEffect, useMemo } from 'react';
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
  PieChart as PieChartIcon,
  AlertTriangle
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
  Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatters';
import { adminFetchStats, adminFetchBooks } from '@/services/bookService';
import axiosInstance from '@/api/axiosInstance';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await adminFetchStats();
        setDashboardData(data);
        
        // Show alerts for low stock
        if (data.lowStockAlerts && data.lowStockAlerts.length > 0) {
          data.lowStockAlerts.forEach(book => {
            toast.error(`Sách sắp hết hàng: ${book.title} (Còn ${book.stock})`, {
              duration: 5000,
              icon: <AlertTriangle className="text-error" size={20} />,
              style: {
                borderRadius: '16px',
                background: '#fff',
                color: '#1a1c1e',
                border: '1px solid #f8d7da',
                fontWeight: 'bold'
              }
            });
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const revenueData = useMemo(() => {
    if (!dashboardData?.monthlyRevenue) return [];
    return Object.entries(dashboardData.monthlyRevenue).map(([month, amount]) => ({
      name: `T${month}`,
      amount: amount
    })).sort((a, b) => parseInt(a.name.slice(1)) - parseInt(b.name.slice(1)));
  }, [dashboardData]);

  const categoryData = useMemo(() => {
    if (!dashboardData?.categorySales) return [];
    return Object.entries(dashboardData.categorySales).map(([name, value]) => ({
      name,
      value
    }));
  }, [dashboardData]);

  const userData = useMemo(() => {
    if (!dashboardData?.monthlyUsers) return [];
    return Object.entries(dashboardData.monthlyUsers).map(([month, count]) => ({
      name: `T${month}`,
      users: count
    })).sort((a, b) => parseInt(a.name.slice(1)) - parseInt(b.name.slice(1)));
  }, [dashboardData]);

  const handleExportData = async () => {
    try {
      toast.loading('Đang chuẩn bị dữ liệu báo cáo...', { id: 'export' });
      
      // Fetch all orders for export
      const ordersResponse = await axiosInstance.get('/admin/orders', { params: { size: 1000 } });
      const orders = ordersResponse.data.content || [];
      
      // Prepare Order Data
      const orderSheetData = orders.map(order => ({
        'Mã đơn hàng': order.id,
        'Ngày đặt': new Date(order.orderDate).toLocaleDateString('vi-VN'),
        'Khách hàng': order.userEmail || 'Khách vãng lai',
        'Tổng tiền': order.totalAmount,
        'Trạng thái': order.status,
        'Địa chỉ': order.shippingAddress,
        'Số điện thoại': order.phoneNumber
      }));

      // Prepare Revenue Data (Monthly)
      const revenueSheetData = revenueData.map(item => ({
        'Tháng': item.name,
        'Doanh thu (VNĐ)': item.amount
      }));

      // Create Workbook
      const wb = XLSX.utils.book_new();
      const wsOrders = XLSX.utils.json_to_sheet(orderSheetData);
      const wsRevenue = XLSX.utils.json_to_sheet(revenueSheetData);
      
      XLSX.utils.book_append_sheet(wb, wsOrders, "Danh sách đơn hàng");
      XLSX.utils.book_append_sheet(wb, wsRevenue, "Báo cáo doanh thu");
      
      // Export File
      XLSX.writeFile(wb, `Bao_cao_BookVerse_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Xuất báo cáo thành công!', { id: 'export' });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Lỗi khi xuất báo cáo', { id: 'export' });
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">Thống kê & Báo cáo</h1>
          <p className="text-on-surface-variant font-medium">Theo dõi các chỉ số quan trọng của kho tàng tri thức BookVerse.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-surface-container-high px-6 py-3 rounded-2xl font-bold text-sm hover:bg-surface-container transition-colors border border-outline-variant/10">
            <Calendar size={18} />
            <span>Năm {new Date().getFullYear()}</span>
          </button>
          <button 
            onClick={handleExportData}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Download size={18} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Revenue Chart & User Growth */}
        <div className="lg:col-span-8 space-y-8">
          {/* Revenue Chart Card */}
          <div className="bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black tracking-tighter">Doanh thu hàng tháng</h3>
                <p className="text-xs font-medium text-on-surface-variant">Dữ liệu doanh thu thực tế tính bằng VNĐ</p>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <TrendingUp size={16} />
                <span className="text-xs font-bold">Tăng trưởng ổn định</span>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [formatPrice(value), 'Doanh thu']}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tighter">Lượng người dùng mới</h3>
                <p className="text-xs font-medium text-on-surface-variant">Sự tăng trưởng cộng đồng BookVerse</p>
              </div>
              <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full flex items-center gap-2">
                <Users size={16} />
                <span className="text-xs font-bold">Tổng: {dashboardData?.totalUsers}</span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution & Performance */}
        <div className="lg:col-span-4 space-y-8">
          {/* Category Distribution Card */}
          <div className="bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-black tracking-tighter mb-2">Danh mục bán chạy</h3>
            <p className="text-xs font-medium text-on-surface-variant mb-10">Tỷ lệ đơn hàng theo thể loại</p>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alerts Card */}
          <div className="bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black tracking-tighter">Cảnh báo hết hàng</h3>
              <span className="bg-error/10 text-error px-3 py-1 rounded-full text-xs font-bold">
                {dashboardData?.lowStockAlerts?.length || 0} sách
              </span>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {dashboardData?.lowStockAlerts?.length > 0 ? (
                dashboardData.lowStockAlerts.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-3 bg-surface-container/30 rounded-2xl">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-bold text-on-surface truncate">{book.title}</p>
                      <p className="text-[10px] font-black text-outline uppercase">ID: {book.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-error">Stock: {book.stock}</p>
                      <p className="text-[10px] font-black text-on-surface-variant italic">Cần nhập kho</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-on-surface-variant">Tất cả sản phẩm đều đủ tồn kho.</p>
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
