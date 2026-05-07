// =====================================================
//  PAGE — CheckoutPage.jsx
//  Luồng thanh toán 3 bước (Stitch-aligned)
//  Aether Verse: High-fidelity forms, progress stepper
// =====================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';

import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotalAmount, clearCart } from '@/redux/cartSlice';
import { selectAuth } from '@/redux/authSlice';
import { createOrder, selectOrderLoading, selectOrderSuccess, resetOrderState } from '@/redux/orderSlice';
import { useEffect } from 'react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: '',
    paymentMethod: 'COD'
  });
  
  // Redux state
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotalAmount);
  const { user } = useSelector(selectAuth);
  const isLoading = useSelector(selectOrderLoading);
  const isSuccess = useSelector(selectOrderSuccess);
  const [orderId, setOrderId] = useState(null);

  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 35000;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!user) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán.');
      navigate('/login?redirect=/checkout');
    } else if (cartItems.length === 0 && step === 1) {
      navigate('/cart');
    }
  }, [user, navigate, cartItems.length, step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!form.fullName || !form.phone || !form.address) {
        alert('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const orderData = {
        shippingAddress: `${form.address}, ${form.district}, ${form.city}. Ghi chú: ${form.note}`,
        phoneNumber: form.phone,
        paymentMethod: form.paymentMethod,
        items: cartItems.map(item => ({
          bookId: item.id,
          quantity: item.quantity
        }))
      };
      
      const resultAction = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(resultAction)) {
        setOrderId(resultAction.payload.id);
        dispatch(clearCart());
        setStep(3);
      } else {
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-on-surface">Thông tin giao hàng</h1>
        <p className="text-on-surface-variant mt-2">Vui lòng cung cấp chi tiết địa chỉ để chúng tôi vận chuyển đơn hàng đến bạn sớm nhất.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Họ tên</label>
          <input 
            type="text" 
            name="fullName"
            value={form.fullName}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên người nhận" 
            className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Số điện thoại</label>
          <input 
            type="text" 
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="Ví dụ: 0912345678" 
            className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium" 
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Địa chỉ chi tiết</label>
        <input 
          type="text" 
          name="address"
          value={form.address}
          onChange={handleInputChange}
          placeholder="Số nhà, tên đường, phường/xã..." 
          className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Tỉnh / Thành phố</label>
          <div className="relative">
            <select 
              name="city"
              value={form.city}
              onChange={handleInputChange}
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium appearance-none"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Quận / Huyện</label>
          <div className="relative">
            <input 
              type="text"
              name="district"
              value={form.district}
              onChange={handleInputChange}
              placeholder="Nhập Quận/Huyện"
              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-outline uppercase tracking-widest px-4">Ghi chú giao hàng (Tùy chọn)</label>
        <textarea 
          name="note"
          value={form.note}
          onChange={handleInputChange}
          rows="4" 
          placeholder="Ví dụ: Giao vào giờ hành chính, gọi điện trước khi tới..." 
          className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
        ></textarea>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-on-surface">Phương thức thanh toán</h1>
        <p className="text-on-surface-variant mt-2">Chọn phương thức thanh toán phù hợp nhất với bạn.</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: 'payments' },
          { id: 'BANK', label: 'Chuyển khoản ngân hàng', icon: 'account_balance' },
          { id: 'MOMO', label: 'Ví MoMo', icon: 'account_balance_wallet' },
        ].map(method => (
          <label key={method.id} className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl cursor-pointer border-2 border-transparent hover:border-primary/20 has-[:checked]:border-primary transition-all">
            <input 
              type="radio" 
              name="paymentMethod" 
              value={method.id} 
              checked={form.paymentMethod === method.id}
              onChange={handleInputChange}
              className="w-6 h-6 border-2 border-outline-variant rounded-full appearance-none checked:border-primary checked:border-[7px] transition-all" 
            />
            <span className="material-symbols-outlined text-primary text-3xl">{method.icon}</span>
            <span className="text-lg font-bold text-on-surface">{method.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center py-20 space-y-8 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20">
        <span className="material-symbols-outlined text-5xl">check_circle</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-on-surface">Đặt hàng thành công!</h1>
        <p className="text-on-surface-variant text-lg">Mã đơn hàng của bạn là <span className="font-bold text-primary">#BV-{orderId}</span>. Cảm ơn bạn đã tin tưởng BookVerse.</p>
      </div>
      <button onClick={() => navigate('/')} className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95">
        Quay về trang chủ
      </button>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Progress Stepper */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-20 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-surface-container -z-10"></div>
          {[
            { n: 1, label: 'Giao hàng' },
            { n: 2, label: 'Thanh toán' },
            { n: 3, label: 'Xác nhận' }
          ].map(s => (
            <div key={s.n} className="flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s.n ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-outline'
              }`}>
                {s.n}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                step >= s.n ? 'text-primary' : 'text-outline'
              }`}>{s.label}</span>
            </div>
          ))}
        </div>

        {step === 3 ? renderStep3() : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Col: Step Form */}
            <div className="lg:col-span-7">
              {step === 1 ? renderStep1() : renderStep2()}
            </div>

            {/* Right Col: Summary */}
            <div className="lg:col-span-5 sticky top-32">
              <div className="bg-surface-container-low p-10 rounded-[3rem] shadow-xl border border-outline-variant/10">
                <h2 className="text-2xl font-black tracking-tight mb-8">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-6 mb-8">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" src={item.coverImageUrl} alt={item.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-on-surface truncate">{item.title}</h4>
                        <p className="text-xs text-on-surface-variant">Số lượng: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length === 0 && <p className="text-sm text-outline-variant font-bold italic">Giỏ hàng trống</p>}
                </div>

                <div className="space-y-4 pt-6 border-t border-outline-variant/20">
                  <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                    <span>Phí vận chuyển</span>
                    <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4">
                    <span className="text-xs font-black uppercase tracking-widest text-outline">Tổng cộng</span>
                    <span className="text-3xl font-black text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <button 
                  disabled={cartItems.length === 0 || isLoading}
                  onClick={handleNextStep}
                  className="w-full mt-10 py-5 bg-primary text-on-primary rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {step === 1 ? 'TIẾP TỤC' : 'HOÀN TẤT ĐẶT HÀNG'}
                </button>
                
                <p className="text-center text-[10px] font-bold text-outline uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span> Thanh toán bảo mật chuẩn SSL
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
