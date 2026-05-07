import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  FileText, 
  Truck, 
  ArrowLeft, 
  ShoppingBag 
} from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

const OrderSuccessPage = () => {
  // Mock order data
  const orderInfo = {
    id: '#BV-88294-2024',
    deliveryDate: '15 tháng 10, 2024',
    total: 1250000,
    items: [
      { id: 1, title: 'Thiết kế Của Sự Sống', author: 'Adrian Bejan', price: 450000, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200' },
      { id: 2, title: 'Lịch Sử Vạn Vật', author: 'Bill Bryson', price: 520000, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200' },
      { id: 3, title: 'Trí Tuệ Kỹ Thuật Số', author: 'Kevin Kelly', price: 280000, image: 'https://images.unsplash.com/photo-1532012197367-2d5970d2c5d0?auto=format&fit=crop&q=80&w=200' },
    ]
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24 pt-12 animate-in fade-in zoom-in duration-500">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 shrink-0">
            <CheckCircle2 size={48} className="text-on-primary" />
          </div>
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-on-surface mb-2 leading-none">Đặt hàng thành công</h1>
            <p className="text-on-surface-variant font-medium text-lg">
              Cảm ơn bạn đã tin tưởng BookVerse. Những khám phá mới của bạn đang được chuẩn bị để gửi tới tận tay.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Details Card */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Mã đơn hàng</p>
                <p className="text-3xl font-black text-on-surface">{orderInfo.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Dự kiến giao hàng</p>
                <p className="text-3xl font-black text-on-surface">{orderInfo.deliveryDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-surface-container/30 rounded-2xl border border-outline-variant/5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Truck size={20} />
              </div>
              <p className="text-sm font-bold text-on-surface-variant italic">
                Đơn hàng đang được đóng gói tại kho trung tâm.
              </p>
            </div>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-10 rounded-[48px] border border-outline-variant/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-4">Tổng thanh toán</p>
            <p className="text-5xl font-black text-on-surface tracking-tighter mb-2">{formatPrice(orderInfo.total)}</p>
            <p className="text-xs font-bold text-on-surface-variant mb-10">Đã thanh toán qua thẻ tín dụng</p>
            
            <button className="w-full py-5 bg-primary text-on-primary rounded-[24px] font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-primary/20">
              <FileText size={20} />
              TẢI HÓA ĐƠN
            </button>
          </div>
        </div>

        {/* Collection Summary */}
        <div className="mt-20">
          <h2 className="text-3xl font-black tracking-tighter text-on-surface mb-10">Tóm tắt bộ sưu tập</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {orderInfo.items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border border-outline-variant/10 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow">
                <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-on-surface tracking-tight mb-1 truncate">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant font-medium mb-2">{item.author}</p>
                  <p className="text-sm font-black text-primary">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-20 flex flex-col items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-on-surface font-black group px-6 py-3 hover:bg-surface-container rounded-2xl transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span>Trở về trang chủ</span>
          </Link>
          <p className="text-xs font-medium text-on-surface-variant italic">Một xác nhận chi tiết đã được gửi đến email của bạn.</p>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
