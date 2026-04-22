// =====================================================
//  PAGE — ContactPage.jsx
//  Trang liên hệ (Stitch-aligned)
//  Aether Verse: Minimalist form, floating info cards
// =====================================================

const ContactPage = () => {
  return (
    <div className="bg-surface min-h-screen">
      
      {/* Header */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h1 className="text-5xl font-black tracking-tight text-on-surface">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-on-surface-variant font-medium">Bạn có câu hỏi, góp ý hay chỉ muốn nói lời chào? Đội ngũ BookVerse luôn sẵn sàng lắng nghe.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 space-y-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <h3 className="text-xl font-bold">Email hỗ trợ</h3>
              <p className="text-on-surface-variant">hello@bookverse.com</p>
              <p className="text-xs text-outline font-medium tracking-wide uppercase">Phản hồi trong vòng 24h làm việc</p>
            </div>

            <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 space-y-4">
              <div className="w-12 h-12 bg-tertiary rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined">call</span>
              </div>
              <h3 className="text-xl font-bold">Hotline</h3>
              <p className="text-on-surface-variant">1900 6789 (8:00 - 22:00)</p>
              <p className="text-xs text-outline font-medium tracking-wide uppercase">Hỗ trợ nhanh mọi vấn đề đơn hàng</p>
            </div>

            <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 space-y-4">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <h3 className="text-xl font-bold">Văn phòng chính</h3>
              <p className="text-on-surface-variant">Tầng 12, Tòa nhà Techno, Quận Cầu Giấy, Hà Nội</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[3rem] p-12 shadow-2xl border border-outline-variant/5">
            <h2 className="text-3xl font-bold mb-10">Gửi tin nhắn cho chúng tôi</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Họ và tên</label>
                <input 
                  type="text" 
                  placeholder="Nguyễn Văn A" 
                  className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  placeholder="example@mail.com" 
                  className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Chủ đề</label>
                <select className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium">
                  <option>Hỗ trợ đơn hàng</option>
                  <option>Hợp tác kinh doanh</option>
                  <option>Góp ý sản phẩm</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-on-surface ml-1 uppercase tracking-widest">Nội dung</label>
                <textarea 
                  rows="5"
                  placeholder="Nhập nội dung bạn muốn chia sẻ..." 
                  className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
                ></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                  Gửi yêu cầu ngay
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Map Placeholder */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="w-full h-[400px] bg-surface-container-low rounded-[3rem] overflow-hidden grayscale border border-outline-variant/10">
          <img 
            className="w-full h-full object-cover opacity-50" 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
            alt="Map" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="px-6 py-3 bg-white rounded-full shadow-xl font-bold flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">location_on</span>
               Xem trên Google Maps
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
