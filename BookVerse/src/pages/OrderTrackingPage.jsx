// =====================================================
//  PAGE — OrderTrackingPage.jsx
//  Theo dõi đơn hàng thời gian thực với timeline đẹp
// =====================================================

import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetail, selectCurrentOrder, selectOrderLoading, selectOrderError } from '@/redux/orderSlice';
import { formatPrice } from '@/utils/formatters';

const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xử lý',    icon: 'hourglass_empty', color: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-200',  step: 0 },
  PROCESSING: { label: 'Đang xử lý',   icon: 'inventory_2',     color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200',   step: 1 },
  SHIPPED:    { label: 'Đang giao',     icon: 'local_shipping',  color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', step: 2 },
  DELIVERED:  { label: 'Đã giao hàng', icon: 'where_to_vote',   color: 'text-green-500',  bg: 'bg-green-50',  border: 'border-green-200',  step: 3 },
  CANCELLED:  { label: 'Đã hủy',       icon: 'cancel',          color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    step: -1 },
};

const TIMELINE_STEPS = [
  { key: 'PENDING',    label: 'Đặt hàng',     icon: 'receipt_long' },
  { key: 'PROCESSING', label: 'Đang đóng gói', icon: 'inventory_2' },
  { key: 'SHIPPED',   label: 'Đang vận chuyển', icon: 'local_shipping' },
  { key: 'DELIVERED', label: 'Đã giao hàng',  icon: 'where_to_vote' },
];

const PAYMENT_LABELS = {
  COD:   'Thanh toán khi nhận hàng',
  VNPAY: 'VNPay',
  MOMO:  'Ví MoMo',
  BANK:  'Chuyển khoản ngân hàng',
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order   = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);
  const error   = useSelector(selectOrderError);

  useEffect(() => {
    if (id) dispatch(fetchOrderDetail(id));
  }, [dispatch, id]);

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full border-4 border-surface-container-high border-t-primary animate-spin mx-auto" />
        <p className="text-on-surface-variant font-bold">Đang tải thông tin đơn hàng...</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-error text-4xl">error_outline</span>
        </div>
        <h1 className="text-3xl font-black text-on-surface">Không tìm thấy đơn hàng</h1>
        <p className="text-on-surface-variant">{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền xem.'}</p>
        <button onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black hover:scale-105 transition-transform">
          Quay về Dashboard
        </button>
      </div>
    </div>
  );

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const isCancelled = order.status === 'CANCELLED';
  const currentStep = cfg.step;

  return (
    <div className="bg-surface min-h-screen pt-10 pb-24">
      <div className="max-w-5xl mx-auto px-6">

        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors mb-8 group">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Quay lại Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Theo dõi đơn hàng</p>
            <h1 className="text-4xl font-black tracking-tight text-on-surface">Đơn hàng #{order.id}</h1>
            <p className="text-on-surface-variant text-sm mt-1 font-medium">
              Đặt ngày {new Date(order.orderDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${cfg.bg} ${cfg.border}`}>
            <span className={`material-symbols-outlined text-2xl ${cfg.color}`}>{cfg.icon}</span>
            <span className={`font-black text-sm ${cfg.color}`}>{cfg.label}</span>
          </div>
        </div>

        {/* Progress Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-[2.5rem] p-8 mb-8 border border-outline-variant/10 shadow-sm">
            <h2 className="font-black text-on-surface mb-8 text-lg">Trạng thái vận chuyển</h2>
            <div className="relative flex justify-between items-start">
              {/* Progress bar */}
              <div className="absolute top-6 left-0 w-full h-1 bg-surface-container-high rounded-full -z-0">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: currentStep === 0 ? '0%' : `${(currentStep / 3) * 100}%` }}
                />
              </div>
              {TIMELINE_STEPS.map((step, idx) => {
                const done = idx <= currentStep;
                const active = idx === currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-3 z-10 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                      done ? 'bg-primary shadow-primary/20 shadow-lg' : 'bg-surface-container-high'
                    } ${active ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                      <span className={`material-symbols-outlined text-xl ${done ? 'text-white' : 'text-outline'}`}>
                        {step.icon}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider text-center leading-tight max-w-[80px] ${
                      done ? 'text-primary' : 'text-outline'
                    }`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-8 flex gap-4 items-center">
            <span className="material-symbols-outlined text-red-500 text-3xl">cancel</span>
            <div>
              <p className="font-black text-red-800">Đơn hàng đã bị hủy</p>
              <p className="text-sm text-red-600 mt-0.5">Nếu bạn đã thanh toán, tiền sẽ được hoàn trả trong 3-5 ngày làm việc.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Status History Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm">
              <h2 className="font-black text-on-surface mb-6 text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Lịch sử cập nhật
              </h2>
              {order.statusHistory && order.statusHistory.length > 0 ? (
                <div className="relative space-y-0">
                  {[...order.statusHistory].reverse().map((h, idx, arr) => {
                    const hcfg = STATUS_CONFIG[h.status] || STATUS_CONFIG.PENDING;
                    const isLast = idx === arr.length - 1;
                    return (
                      <div key={idx} className="flex gap-5 pb-6 relative">
                        {!isLast && (
                          <div className="absolute left-5 top-10 w-0.5 h-full bg-surface-container-high" />
                        )}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? hcfg.bg : 'bg-surface-container-low'} border-2 ${idx === 0 ? hcfg.border : 'border-transparent'}`}>
                          <span className={`material-symbols-outlined text-base ${idx === 0 ? hcfg.color : 'text-outline'}`}>{hcfg.icon}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-black text-sm ${idx === 0 ? 'text-on-surface' : 'text-on-surface-variant'}`}>{hcfg.label}</p>
                            <p className="text-[10px] text-outline font-bold">
                              {new Date(h.changedAt).toLocaleString('vi-VN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {h.note && <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{h.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-on-surface-variant italic text-sm">Chưa có cập nhật nào.</p>
              )}
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm">
              <h2 className="font-black text-on-surface mb-6 text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                Sản phẩm đã đặt
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-surface-container/40 transition-colors group">
                    <div className="w-14 aspect-[2/3] rounded-xl overflow-hidden shadow-md shrink-0">
                      {item.coverImageUrl
                        ? <img src={item.coverImageUrl} alt={item.bookTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">menu_book</span>
                          </div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-on-surface truncate">{item.bookTitle}</h4>
                      <p className="text-xs text-on-surface-variant">{item.bookAuthor}</p>
                      <p className="text-xs text-outline mt-0.5">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-black text-primary shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-[2.5rem] p-7 border border-outline-variant/10 shadow-sm">
              <h3 className="font-black text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt</span>
                Thanh toán
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Tạm tính</span>
                  <span>{formatPrice((order.totalAmount || 0) + (order.discountAmount || 0))}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between font-bold text-primary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">sell</span>
                      {order.couponCode}
                    </span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Vận chuyển</span><span>Miễn phí</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-outline-variant/20 font-black text-on-surface text-base">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-outline-variant/20">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2">Phương thức</p>
                <p className="font-bold text-on-surface text-sm">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-[2.5rem] p-7 border border-outline-variant/10 shadow-sm">
              <h3 className="font-black text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Giao hàng
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">SĐT</p>
                  <p className="font-bold text-on-surface">{order.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Địa chỉ</p>
                  <p className="font-medium text-on-surface-variant leading-relaxed">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
