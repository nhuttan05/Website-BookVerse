import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { 
  selectCartItems, 
  selectCartTotalAmount, 
  updateQuantity as updateQtyAction, 
  removeItem as removeAction 
} from '@/redux/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotalAmount);

  const shippingLimit = 500000;
  const shippingFee = 35000;
  const shipping = subtotal >= shippingLimit || subtotal === 0 ? 0 : shippingFee;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      dispatch(updateQtyAction({ id, quantity: newQty }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeAction(id));
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-12">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ══════════ LEFT: ITEMS ══════════ */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Free Shipping Progress */}
            {cartItems.length > 0 && (
              <div className="bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-bold text-primary">
                    {subtotal >= shippingLimit 
                      ? 'Chúc mừng! Bạn đã được miễn phí vận chuyển' 
                      : 'Mua thêm để được miễn phí vận chuyển'}
                  </p>
                  <span className="text-sm font-bold text-on-surface-variant">
                    {subtotal >= shippingLimit ? '' : `Còn ${formatPrice(shippingLimit - subtotal)}`}
                  </span>
                </div>
                <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-700 ease-out" 
                    style={{ width: `${Math.min(100, (subtotal / shippingLimit) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex items-center gap-10 group hover:shadow-md transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="w-28 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img className="w-full h-full object-cover" src={item.coverImageUrl} alt={item.title} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-on-surface tracking-tight leading-tight">{item.title}</h3>
                      <p className="text-on-surface-variant font-medium">{item.author.name}</p>
                      <p className="text-xs font-black text-outline uppercase tracking-widest mt-4">
                        Đơn giá: <span className="text-on-surface">{formatPrice(item.price)}</span>
                      </p>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center gap-12">
                      <div className="flex items-center bg-surface-container/50 rounded-2xl p-1.5 border border-outline-variant/10">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      
                      <div className="text-right min-w-[140px] relative">
                        <p className="text-2xl font-black text-on-surface tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute -top-12 -right-2 p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="py-24 text-center bg-white rounded-[48px] border border-outline-variant/10 shadow-sm">
                  <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-outline" />
                  </div>
                  <h2 className="text-2xl font-black text-on-surface mb-2">Giỏ hàng của bạn đang trống</h2>
                  <p className="text-on-surface-variant font-medium mb-8">Hãy khám phá kho tri thức và chọn cho mình những cuốn sách ưng ý.</p>
                  <Link to="/browse" className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black hover:bg-primary-container transition-all active:scale-95 inline-block shadow-lg shadow-primary/10">
                    Khám phá kho sách
                  </Link>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <button 
                onClick={() => navigate('/browse')}
                className="flex items-center gap-3 text-primary font-black group px-2"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                <span>Tiếp tục mua sắm</span>
              </button>
            )}
          </div>

          {/* ══════════ RIGHT: SUMMARY ══════════ */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-4 sticky top-32">
              <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-black/[0.03] border border-outline-variant/10">
                <h2 className="text-3xl font-black tracking-tighter mb-10">Tổng đơn hàng</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between text-on-surface-variant font-bold">
                    <span>Tạm tính</span>
                    <span className="text-on-surface">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-bold">
                    <span>Phí vận chuyển</span>
                    <span className="text-on-surface">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-bold">
                    <span>Giảm giá</span>
                    <span className="text-error">-0đ</span>
                  </div>
                  
                  <div className="pt-8 mt-4 border-t-2 border-dashed border-outline-variant/10">
                    <div className="flex flex-col gap-2 mb-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Tổng cộng</span>
                      <span className="text-5xl font-black text-primary tracking-tighter">{formatPrice(total)}</span>
                    </div>
                    
                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full py-6 bg-primary text-on-primary rounded-[28px] font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4 group"
                    >
                      Thanh toán ngay
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>

                  <div className="flex gap-4 p-5 bg-[#F8F9FA] rounded-[24px] border border-outline-variant/5">
                    <ShieldCheck size={24} className="text-primary shrink-0" />
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                      Giao dịch an toàn & bảo mật. Cam kết hoàn tiền trong 7 ngày nếu có bất kỳ lỗi nào từ nhà xuất bản.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartPage;
