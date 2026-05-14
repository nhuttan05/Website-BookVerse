// =====================================================
//  PAGE — CheckoutPage.jsx
//  Luồng thanh toán 3 bước với Mã Giảm Giá
// =====================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotalAmount, clearCart } from '@/redux/cartSlice';
import { selectAuth } from '@/redux/authSlice';
import {
  createOrder, selectOrderLoading, selectOrderSuccess,
  validateCoupon, selectCouponResult, selectCouponLoading, clearCouponResult
} from '@/redux/orderSlice';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'COD',    label: 'Thanh toán khi nhận hàng (COD)', icon: 'payments',               desc: 'Thanh toán bằng tiền mặt khi nhận hàng.' },
  { id: 'VNPAY',  label: 'VNPay',                          icon: 'credit_card',             desc: 'Thanh toán qua cổng VNPay (ATM/QR).' },
  { id: 'MOMO',   label: 'Ví MoMo',                        icon: 'account_balance_wallet',  desc: 'Thanh toán qua ví điện tử MoMo.' },
  { id: 'BANK',   label: 'Chuyển khoản ngân hàng',         icon: 'account_balance',         desc: 'Chuyển khoản qua tài khoản ngân hàng.' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', phone: '', address: '', city: '', district: '', note: '', paymentMethod: 'COD'
  });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const cartItems   = useSelector(selectCartItems);
  const subtotal    = useSelector(selectCartTotalAmount);
  const { user }    = useSelector(selectAuth);
  const isLoading   = useSelector(selectOrderLoading);
  const isSuccess   = useSelector(selectOrderSuccess);
  const couponResult  = useSelector(selectCouponResult);
  const couponLoading = useSelector(selectCouponLoading);

  const shipping  = subtotal > 500000 || subtotal === 0 ? 0 : 35000;
  const discount  = appliedCoupon?.discountAmount || 0;
  const total     = subtotal + shipping - discount;

  useEffect(() => {
    if (!user) { navigate('/login?redirect=/checkout'); return; }
    if (cartItems.length === 0 && step === 1) navigate('/cart');
  }, [user, navigate, cartItems.length, step]);

  useEffect(() => {
    if (couponResult) {
      if (couponResult.valid) {
        setAppliedCoupon(couponResult);
        toast.success(`🎉 ${couponResult.message}`);
      } else {
        toast.error(couponResult.message);
        setAppliedCoupon(null);
      }
    }
  }, [couponResult]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    dispatch(validateCoupon({ code: couponInput.trim(), orderAmount: subtotal + shipping }));
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    dispatch(clearCouponResult());
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!form.fullName || !form.phone || !form.address) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng'); return;
      }
      setStep(2);
    } else if (step === 2) {
      const orderData = {
        shippingAddress: `${form.address}, ${form.district ? form.district + ', ' : ''}${form.city}. Ghi chú: ${form.note}`,
        phoneNumber: form.phone,
        paymentMethod: form.paymentMethod,
        couponCode: appliedCoupon?.code || null,
        items: cartItems.map(item => ({ bookId: item.id, quantity: item.quantity }))
      };
      const resultAction = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(resultAction)) {
        setOrderId(resultAction.payload.id);
        dispatch(clearCart());
        setStep(3);
      } else {
        toast.error(resultAction.payload || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  /* ─────── Step 1: Shipping Info ─────── */
  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-on-surface">Thông tin giao hàng</h1>
        <p className="text-on-surface-variant mt-2">Vui lòng cung cấp chi tiết địa chỉ để chúng tôi vận chuyển đơn hàng.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'fullName', label: 'Họ tên', placeholder: 'Nhập họ và tên người nhận', type: 'text' },
          { name: 'phone',    label: 'Số điện thoại', placeholder: 'Ví dụ: 0912 345 678', type: 'text' },
        ].map(f => (
          <div key={f.name} className="space-y-2">
            <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">{f.label}</label>
            <input type={f.type} name={f.name} value={form[f.name]} onChange={handleInputChange}
              placeholder={f.placeholder}
              className="w-full bg-surface-container-low px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary/30 focus:ring-0 outline-none font-medium transition-colors" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Địa chỉ chi tiết</label>
        <input type="text" name="address" value={form.address} onChange={handleInputChange}
          placeholder="Số nhà, tên đường, phường/xã..."
          className="w-full bg-surface-container-low px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none font-medium transition-colors" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Tỉnh / Thành phố</label>
          <div className="relative">
            <select name="city" value={form.city} onChange={handleInputChange}
              className="w-full bg-surface-container-low px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none font-medium appearance-none transition-colors">
              <option value="">Chọn Tỉnh/Thành phố</option>
              {['Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương','Đồng Nai','An Giang','Bà Rịa - Vũng Tàu','Huế'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Quận / Huyện</label>
          <input type="text" name="district" value={form.district} onChange={handleInputChange}
            placeholder="Nhập Quận/Huyện"
            className="w-full bg-surface-container-low px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none font-medium transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Ghi chú giao hàng (Tùy chọn)</label>
        <textarea name="note" value={form.note} onChange={handleInputChange} rows="3"
          placeholder="Giao vào giờ hành chính, gọi điện trước khi tới..."
          className="w-full bg-surface-container-low px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none font-medium resize-none transition-colors" />
      </div>
    </div>
  );

  /* ─────── Step 2: Payment ─────── */
  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-on-surface">Phương thức thanh toán</h1>
        <p className="text-on-surface-variant mt-2">Chọn phương thức phù hợp và nhập mã giảm giá nếu có.</p>
      </div>

      <div className="space-y-3">
        {PAYMENT_METHODS.map(method => (
          <label key={method.id}
            className={`flex items-center gap-5 p-5 rounded-3xl cursor-pointer border-2 transition-all ${
              form.paymentMethod === method.id
                ? 'bg-primary/5 border-primary shadow-sm shadow-primary/10'
                : 'bg-surface-container-low border-transparent hover:border-outline-variant/30'
            }`}>
            <input type="radio" name="paymentMethod" value={method.id}
              checked={form.paymentMethod === method.id} onChange={handleInputChange}
              className="w-5 h-5 border-2 border-outline-variant rounded-full appearance-none checked:border-primary checked:border-[6px] transition-all shrink-0" />
            <span className={`material-symbols-outlined text-3xl ${form.paymentMethod === method.id ? 'text-primary' : 'text-on-surface-variant'}`}>
              {method.icon}
            </span>
            <div className="flex-1">
              <p className={`font-bold ${form.paymentMethod === method.id ? 'text-primary' : 'text-on-surface'}`}>{method.label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{method.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {/* VNPay QR Notice */}
      {form.paymentMethod === 'VNPAY' && (
        <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl flex gap-4 items-start animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-blue-500 text-2xl shrink-0">qr_code_2</span>
          <div>
            <p className="font-bold text-blue-800 text-sm">Thanh toán qua VNPay</p>
            <p className="text-xs text-blue-600 mt-1">Sau khi đặt hàng, bạn sẽ nhận được mã QR để thanh toán. Đơn hàng sẽ được xác nhận tự động sau khi thanh toán thành công.</p>
          </div>
        </div>
      )}
      {form.paymentMethod === 'MOMO' && (
        <div className="p-5 bg-pink-50 border border-pink-200 rounded-2xl flex gap-4 items-start animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-pink-500 text-2xl shrink-0">account_balance_wallet</span>
          <div>
            <p className="font-bold text-pink-800 text-sm">Thanh toán qua MoMo</p>
            <p className="text-xs text-pink-600 mt-1">Quét mã QR bằng ứng dụng MoMo hoặc chuyển khoản theo thông tin sau khi đặt hàng.</p>
          </div>
        </div>
      )}

      {/* Coupon Section */}
      <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary">confirmation_number</span>
          <h3 className="font-black text-on-surface text-sm uppercase tracking-widest">Mã giảm giá</h3>
        </div>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-4 bg-primary/5 border-2 border-primary/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">sell</span>
              <div>
                <p className="font-black text-primary text-sm">{appliedCoupon.code}</p>
                <p className="text-xs text-on-surface-variant">Giảm {formatPrice(appliedCoupon.discountAmount)}</p>
              </div>
            </div>
            <button onClick={handleRemoveCoupon}
              className="p-2 rounded-xl hover:bg-error/10 text-error transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
              placeholder="Nhập mã giảm giá (vd: WELCOME10)"
              className="flex-1 bg-surface px-5 py-3 rounded-2xl border-2 border-outline-variant/20 focus:border-primary/40 outline-none font-mono font-bold text-sm uppercase tracking-widest transition-colors" />
            <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput}
              className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-black text-sm hover:scale-105 transition-transform active:scale-95 disabled:opacity-40 flex items-center gap-2">
              {couponLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <span className="material-symbols-outlined text-lg">check</span>}
              Áp dụng
            </button>
          </div>
        )}
        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">
          Thử: WELCOME10 · SAVE50K · BOOKS20 · SUMMER100K
        </p>
      </div>
    </div>
  );

  /* ─────── Step 3: Confirm ─────── */
  const renderStep3 = () => (
    <div className="text-center py-16 space-y-8 animate-in zoom-in duration-500">
      <div className="relative mx-auto w-28 h-28">
        <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mx-auto">
          <span className="material-symbols-outlined text-6xl text-white">check_circle</span>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <span className="material-symbols-outlined text-sm text-white">star</span>
        </div>
      </div>
      <div className="space-y-3">
        <h1 className="text-5xl font-black tracking-tight text-on-surface">Đặt hàng thành công!</h1>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto">
          Mã đơn hàng của bạn là <span className="font-black text-primary">#{orderId}</span>.
          Cảm ơn bạn đã tin tưởng BookVerse!
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate(`/orders/${orderId}`)}
          className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 justify-center">
          <span className="material-symbols-outlined">local_shipping</span>
          Theo dõi đơn hàng
        </button>
        <button onClick={() => navigate('/')}
          className="px-8 py-4 bg-surface-container text-on-surface rounded-2xl font-black hover:scale-105 transition-transform active:scale-95">
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );

  /* ─────── Order Summary Sidebar ─────── */
  const renderSummary = () => (
    <div className="bg-surface-container-low p-8 rounded-[3rem] shadow-xl border border-outline-variant/10">
      <h2 className="text-2xl font-black tracking-tight mb-6">Tóm tắt đơn hàng</h2>
      <div className="space-y-4 mb-6 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
        {cartItems.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-sm">
              <img className="w-full h-full object-cover" src={item.coverImageUrl} alt={item.title} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-on-surface truncate text-sm">{item.title}</h4>
              <p className="text-xs text-on-surface-variant">x{item.quantity}</p>
              <p className="text-sm font-bold text-primary mt-0.5">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-5 border-t border-outline-variant/20">
        <div className="flex justify-between text-sm font-medium text-on-surface-variant">
          <span>Tạm tính</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium text-on-surface-variant">
          <span>Phí vận chuyển</span>
          <span className={shipping === 0 ? 'text-primary font-bold' : ''}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm font-bold text-primary animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">sell</span>
              Giảm giá ({appliedCoupon?.code})
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-3 border-t border-outline-variant/20">
          <span className="text-xs font-black uppercase tracking-widest text-outline">Tổng cộng</span>
          <span className="text-3xl font-black text-primary">{formatPrice(Math.max(0, total))}</span>
        </div>
      </div>

      <button disabled={cartItems.length === 0 || isLoading} onClick={handleNextStep}
        className="w-full mt-8 py-5 bg-primary text-on-primary rounded-3xl font-black text-base shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50">
        {isLoading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {step === 1 ? 'TIẾP TỤC →' : 'HOÀN TẤT ĐẶT HÀNG'}
      </button>
      <p className="text-center text-[10px] font-bold text-outline uppercase tracking-widest mt-5 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm">lock</span> Thanh toán bảo mật SSL
      </p>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Progress Stepper */}
        <div className="flex justify-between items-center max-w-sm mx-auto mb-16 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-surface-container -z-10" />
          {[{ n: 1, label: 'Giao hàng' }, { n: 2, label: 'Thanh toán' }, { n: 3, label: 'Xác nhận' }].map(s => (
            <div key={s.n} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                step > s.n
                  ? 'bg-primary text-white shadow-lg'
                  : step === s.n
                  ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20'
                  : 'bg-surface-container text-outline'
              }`}>
                {step > s.n ? <span className="material-symbols-outlined text-base">check</span> : s.n}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.n ? 'text-primary' : 'text-outline'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {step === 3 ? renderStep3() : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              {step === 1 ? renderStep1() : renderStep2()}
            </div>
            <div className="lg:col-span-5 sticky top-28">
              {renderSummary()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
