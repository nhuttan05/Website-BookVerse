// =====================================================
//  PAGE — AdminOrdersPage.jsx
//  Quản lý và cập nhật trạng thái đơn hàng (Admin)
// =====================================================

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminFetchOrders, adminUpdateOrderStatus, selectAdminOrders, selectAdminOrdersTotal } from '@/redux/orderSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatters';
import { ShoppingBag, Eye, Edit2, X, Check, Truck, Package, PackageCheck, Ban } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

const STATUS_OPTIONS = [
  { value: 'PENDING',    label: 'Chờ xử lý',    icon: <Package size={16} />,      color: 'text-amber-600', bg: 'bg-amber-100' },
  { value: 'PROCESSING', label: 'Đang xử lý',   icon: <PackageCheck size={16} />, color: 'text-blue-600',  bg: 'bg-blue-100' },
  { value: 'SHIPPED',    label: 'Đang giao',     icon: <Truck size={16} />,        color: 'text-purple-600',bg: 'bg-purple-100' },
  { value: 'DELIVERED',  label: 'Đã giao',      icon: <Check size={16} />,        color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'CANCELLED',  label: 'Đã hủy',       icon: <Ban size={16} />,          color: 'text-red-600',   bg: 'bg-red-100' },
];

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const totalElements = useSelector(selectAdminOrdersTotal);
  
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', note: '' });
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    dispatch(adminFetchOrders({ page, size: 10 }));
  }, [dispatch, page]);

  const handleOpenDetail = async (orderId) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.ORDERS.BY_ID(orderId));
      setSelectedOrder(response.data);
      setUpdateData({ status: response.data.status, note: '' });
    } catch (error) {
      toast.error('Không thể tải chi tiết đơn hàng');
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await dispatch(adminUpdateOrderStatus({ 
        orderId: selectedOrder.id, 
        status: updateData.status, 
        note: updateData.note 
      })).unwrap();
      toast.success('Cập nhật trạng thái thành công');
      setIsModalOpen(false);
      dispatch(adminFetchOrders({ page, size: 10 })); // Reload list
    } catch (error) {
      toast.error(error || 'Lỗi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (statusValue) => {
    const cfg = STATUS_OPTIONS.find(s => s.value === statusValue) || STATUS_OPTIONS[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${cfg.color} ${cfg.bg}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-on-surface">Quản lý Đơn hàng</h1>
            <p className="text-sm font-medium text-on-surface-variant">Tổng cộng {totalElements} đơn hàng trong hệ thống</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Mã Đơn</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Ngày đặt</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">PTTT</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4 font-black text-primary">#{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">
                    {new Date(order.orderDate).toLocaleString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-on-surface">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{order.paymentMethod}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenDetail(order.id)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-2 font-bold text-sm">
                      <Eye size={18} /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant italic">Chưa có đơn hàng nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-6 border-t border-outline-variant/10 flex justify-between items-center">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 font-bold text-sm bg-surface-container rounded-xl disabled:opacity-50 hover:bg-surface-container-high transition-colors">Trước</button>
            <span className="text-sm font-bold text-on-surface-variant">Trang {page + 1}</span>
            <button disabled={orders.length < 10} onClick={() => setPage(p => p + 1)} className="px-4 py-2 font-bold text-sm bg-surface-container rounded-xl disabled:opacity-50 hover:bg-surface-container-high transition-colors">Sau</button>
        </div>
      </div>

      {/* Detail / Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low shrink-0">
              <h2 className="text-xl font-black text-on-surface flex items-center gap-3">
                Chi tiết đơn hàng <span className="text-primary">#{selectedOrder?.id || '...'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {loadingDetail || !selectedOrder ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Col: Info & Items */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-outline mb-4">Thông tin chung</h3>
                      <div className="bg-surface-container-low p-5 rounded-2xl space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-on-surface-variant">Ngày đặt:</span><span className="font-bold">{new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Khách hàng / SĐT:</span><span className="font-bold">{selectedOrder.phoneNumber}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Địa chỉ:</span><span className="font-medium text-right max-w-[200px]">{selectedOrder.shippingAddress}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Thanh toán:</span><span className="font-bold">{selectedOrder.paymentMethod}</span></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-outline mb-4">Sản phẩm ({selectedOrder.items?.length || 0})</h3>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-3 bg-surface-container-low p-3 rounded-2xl">
                            <img src={item.coverImageUrl} alt="" className="w-12 h-16 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{item.bookTitle}</p>
                              <p className="text-xs text-on-surface-variant">SL: {item.quantity}</p>
                              <p className="text-sm font-black text-primary mt-1">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 bg-primary/5 p-5 rounded-2xl space-y-2 text-sm border border-primary/10">
                         {selectedOrder.discountAmount > 0 && (
                           <div className="flex justify-between text-on-surface-variant">
                             <span>Giảm giá ({selectedOrder.couponCode})</span>
                             <span className="font-bold text-primary">-{formatPrice(selectedOrder.discountAmount)}</span>
                           </div>
                         )}
                         <div className="flex justify-between text-base font-black pt-2 border-t border-primary/10">
                           <span>Tổng thanh toán</span>
                           <span className="text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Status Update & History */}
                  <div className="space-y-8">
                    <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
                      <h3 className="text-lg font-black text-on-surface mb-4">Cập nhật trạng thái</h3>
                      <form onSubmit={handleUpdateStatus} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Trạng thái mới</label>
                          <select 
                            value={updateData.status} 
                            onChange={e => setUpdateData({...updateData, status: e.target.value})}
                            className="w-full px-4 py-3 bg-white rounded-xl border border-transparent focus:border-primary/30 outline-none font-bold transition-colors"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ghi chú (tùy chọn)</label>
                          <textarea 
                            value={updateData.note}
                            onChange={e => setUpdateData({...updateData, note: e.target.value})}
                            placeholder="Ghi chú nội bộ hoặc cho khách hàng xem..."
                            rows="3"
                            className="w-full px-4 py-3 bg-white rounded-xl border border-transparent focus:border-primary/30 outline-none resize-none transition-colors"
                          />
                        </div>
                        <button type="submit" disabled={updateData.status === selectedOrder.status && !updateData.note} className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                          <Edit2 size={18} /> Cập nhật đơn hàng
                        </button>
                      </form>
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-outline mb-4">Lịch sử trạng thái</h3>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-container-high before:to-transparent">
                        {[...(selectedOrder.statusHistory || [])].reverse().map((hist, i) => (
                          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-surface-container-high group-[.is-active]:bg-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                <span className="material-symbols-outlined text-sm">history</span>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-2xl shadow-sm border border-outline-variant/5">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-bold text-on-surface text-sm">{STATUS_OPTIONS.find(s => s.value === hist.status)?.label || hist.status}</div>
                                    <time className="text-[10px] font-bold text-outline">{new Date(hist.changedAt).toLocaleString('vi-VN')}</time>
                                </div>
                                <div className="text-xs text-on-surface-variant">{hist.note || 'Không có ghi chú'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
