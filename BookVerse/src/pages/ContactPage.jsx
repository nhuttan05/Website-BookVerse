import { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  Instagram, 
  Twitter, 
  Linkedin,
  ChevronDown
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
  };

  return (
    <div className="bg-white min-h-screen pb-32 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h1 className="text-7xl font-black tracking-tighter text-on-surface mb-6 leading-none">Liên hệ</h1>
              <p className="text-on-surface-variant font-medium text-lg max-w-md leading-relaxed">
                Kết nối với những người giám tuyển tri thức. Chúng tôi luôn sẵn sàng lắng nghe mọi phản hồi từ bạn.
              </p>
            </div>

            <div className="bg-[#F8F9FA] p-10 rounded-[48px] border border-outline-variant/10 space-y-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Thông tin liên hệ</p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Email</p>
                      <p className="text-lg font-bold text-on-surface">contact@bookverse.vn</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Office Address</p>
                      <p className="text-lg font-bold text-on-surface">123 Đường Sách, Quận 1, TP. HCM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Social Links</p>
                <div className="flex gap-4">
                  {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all active:scale-90">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Atmospheric Image */}
            <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
                alt="BookVerse Office" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-12 lg:p-16 rounded-[60px] border border-outline-variant/10 shadow-2xl shadow-black/[0.02]">
              <h2 className="text-4xl font-black tracking-tighter mb-12">Gửi tin nhắn cho chúng tôi</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-4">Name</label>
                    <input 
                      type="text" 
                      placeholder="Họ và tên"
                      className="w-full bg-[#F8F9FA] px-8 py-5 rounded-[24px] border-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-4">Email</label>
                    <input 
                      type="email" 
                      placeholder="example@email.com"
                      className="w-full bg-[#F8F9FA] px-8 py-5 rounded-[24px] border-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-4">Subject</label>
                  <div className="relative">
                    <select className="w-full bg-[#F8F9FA] px-8 py-5 rounded-[24px] border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none cursor-pointer">
                      <option>General Inquiry</option>
                      <option>Support</option>
                      <option>Collaboration</option>
                      <option>Author Partnership</option>
                    </select>
                    <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-4">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Nội dung tin nhắn..."
                    className="w-full bg-[#F8F9FA] px-8 py-6 rounded-[32px] border-none focus:ring-2 focus:ring-primary/20 font-medium transition-all resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-primary text-on-primary rounded-[28px] font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4 group"
                >
                  GỬI TIN NHẮN
                  <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                </button>

                <p className="text-[10px] text-center text-on-surface-variant font-medium mt-6">
                  Cam kết bảo mật thông tin theo quy chuẩn <span className="text-primary font-black cursor-pointer hover:underline">Privacy Policy</span> của BookVerse.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
