// =====================================================
//  PAGE — CartPage.jsx
//  Quản lý giỏ hàng (Stitch-aligned)
//  Aether Verse: Clean layout, tonal summary card
// =====================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '@/data/mockBooks';
import { formatPrice } from '@/utils/formatters';

import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectCartTotalAmount, 
  updateQuantity as updateQtyAction, 
  removeItem as removeAction 
} from '@/redux/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux cart state
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotalAmount);

  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 35000;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      dispatch(updateQtyAction({ id, quantity: newQty }));
    }
  };

  const handleRemoveItem = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      dispatch(removeAction(id));
    }
  };

  return (
    <div className="bg-surface min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black tracking-tight text-on-surface mb-12">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ══════════ LEFT: ITEMS LIST ══════════ */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Free Shipping Progress */}
            <div className="bg-surface-container-low p-6 rounded-3xl space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-on-surface-variant">Mua thêm để được miễn phí vận chuyển</span>
                <span className="text-primary">Còn {Math.max(0, 500000 - subtotal).toLocaleString()}đ</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${Math.min(100, (subtotal / 500000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-surface-container-low p-6 rounded-3xl flex items-center gap-8 group">
                  <div className="w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-md">
                    <img className="w-full h-full object-cover" src={item.coverImageUrl} alt={item.title} />
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-on-surface leading-tight">{item.title}</h3>
                      <p className="text-sm text-on-surface-variant">{item.author.name}</p>
                      <p className="text-xs font-bold text-outline uppercase tracking-wider mt-2">Đơn giá: {formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="flex items-center bg-surface-container-lowest rounded-2xl p-1 shadow-sm border border-outline-variant/10">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-xl transition-colors">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-xl transition-colors">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      
                      <div className="text-right min-w-[120px]">
                        <p className="text-xl font-black text-on-surface">{formatPrice(item.price * item.quantity)}</p>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs font-bold text-error uppercase tracking-widest mt-1 hover:underline flex items-center gap-1 ml-auto"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="py-20 text-center bg-surface-container-low rounded-[3rem] border-2 border-dashed border-outline-variant/20">
                  <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_cart_off</span>
                  <p className="text-xl font-bold text-on-surface-variant">Giỏ hàng của bạn đang trống.</p>
                  <Link to="/browse" className="text-primary font-bold hover:underline mt-4 inline-block">Khám phá sách ngay</Link>
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/browse')}
              className="flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span> Tiếp tục mua sắm
            </button>
          </div>

          {/* ══════════ RIGHT: SUMMARY ══════════ */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-surface-container-low p-10 rounded-[3rem] shadow-xl shadow-surface-container-high/20 border border-outline-variant/10">
              <h2 className="text-2xl font-black tracking-tight mb-8">Tổng đơn hàng</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Phí vận chuyển</span>
                  <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Giảm giá</span>
                  <span className="text-error">-0đ</span>
                </div>
                
                <div className="pt-6 border-t border-outline-variant/20">
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="text-xs font-black uppercase tracking-widest text-outline">Tổng cộng</span>
                    <span className="text-4xl font-black text-primary">{formatPrice(total)}</span>
                  </div>
                  
                  <button 
                    disabled={cartItems.length === 0}
                    onClick={() => navigate('/checkout')}
                    className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                  >
                    THANH TOÁN NGAY <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>

                <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Giao dịch an toàn & bảo mật. Cam kết hoàn tiền trong 7 ngày nếu có lỗi từ nhà xuất bản.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
