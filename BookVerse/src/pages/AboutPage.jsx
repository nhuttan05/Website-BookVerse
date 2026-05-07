import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Quote
} from 'lucide-react';

const TEAM = [
  {
    name: 'Dr. Anh Nguyễn',
    role: 'Founder & CEO',
    bio: 'Cựu chuyên gia dữ liệu với hơn 15 năm kinh nghiệm trong việc xây dựng hệ thống quản lý tri thức toàn cầu.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Minh Tú',
    role: 'Chief Curator',
    bio: 'Nhà nghiên cứu văn hóa, người đảm bảo mỗi cuốn sách trong Archive đều mang một thông điệp ý nghĩa.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Lê Hoàng',
    role: 'Design Director',
    bio: 'Người thổi hồn cho ngôn ngữ hình ảnh và trải nghiệm người dùng tại BookVerse.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Elena Phạm',
    role: 'AI Strategy Lead',
    bio: 'Tiến sĩ khoa học máy tính, chuyên gia về xử lý ngôn ngữ tự nhiên và hệ thống gợi ý.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  }
];

const AboutPage = () => {
  return (
    <div className="bg-white animate-in fade-in duration-700">
      
      {/* ══════════ HERO SECTION ══════════ */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-7xl font-black tracking-tighter text-on-surface mb-8 leading-[0.9]">
              Lưu trữ tinh hoa <br />
              <span className="text-primary italic">tri thức nhân loại</span>
            </h1>
            <p className="text-on-surface-variant font-medium text-lg max-w-lg mb-10 leading-relaxed">
              Chào mừng bạn đến với BookVerse — nơi mỗi tác phẩm không chỉ là một cuốn sách, mà là một hành trình khám phá trí tuệ được tuyển chọn khắt khe.
            </p>
            <Link 
              to="/browse" 
              className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-2xl font-black hover:bg-primary-container transition-all shadow-xl shadow-primary/20"
            >
              Khám phá Archive
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000" 
                alt="Library" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Floating Quote */}
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-2xl border border-outline-variant/10 max-w-xs animate-bounce-subtle">
              <p className="text-sm font-medium italic text-on-surface mb-4">
                "Trí thức là ngọn hải đăng giữa đại dương thông tin."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">BookVerse Curator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ MISSION SECTION ══════════ */}
      <section className="bg-[#F8F9FA] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Sứ mệnh của chúng tôi</p>
              <h2 className="text-3xl font-black tracking-tighter text-on-surface leading-tight">Định nghĩa lại trải nghiệm đọc số</h2>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="text-xl font-medium text-on-surface-variant leading-relaxed">
                <span className="text-7xl font-black text-primary float-left mr-6 leading-[0.7] mt-2">C</span>
                húng tôi tin rằng trong kỷ nguyên số, thách thức lớn nhất không phải là sự thiếu hụt thông tin mà là sự dư thừa của những thứ tầm thường. Sứ mệnh của BookVerse là trở thành một màng lọc tinh tế, giúp độc giả tiếp cận những giá trị nguyên bản nhất của tri thức. Chúng tôi không chỉ bán sách; chúng tôi kiến tạo một không gian văn hóa.
              </div>
              
              <div className="relative py-12 px-16 bg-white rounded-[40px] border border-outline-variant/5 shadow-sm">
                <Quote className="absolute top-8 left-8 text-primary/10 w-20 h-20 -scale-x-100" />
                <p className="text-3xl font-black text-on-surface italic leading-tight relative z-10">
                  "BookVerse ra đời để bảo tồn sự tập trung. Trong thế giới của những cú click chuột vội vã, chúng tôi mời bạn dừng lại và chiêm nghiệm."
                </p>
              </div>

              <p className="text-lg font-medium text-on-surface-variant leading-relaxed">
                Mỗi đầu sách trong thư viện của chúng tôi đều trải qua một quy trình thẩm định đa tầng, từ giá trị học thuật đến tính ứng dụng thực tiễn, đảm bảo rằng mỗi giờ phút bạn bỏ ra đều mang lại sự chuyển hóa thực sự.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ VISION & VALUES ══════════ */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Tầm nhìn: The Curated Intelligence</p>
            <h2 className="text-4xl font-black tracking-tighter text-on-surface">Sự kết hợp giữa trí tuệ nhân loại và công nghệ tinh lọc</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-surface-container-low p-12 rounded-[48px] border border-outline-variant/10 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tighter mb-6">Trí tuệ tuyển chọn</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed max-w-md">
                  Chúng tôi áp dụng các thuật toán phân tích ngữ nghĩa tiên tiến để nhận diện những kết nối tư duy sâu sắc nhất giữa các tác phẩm thuộc nhiều lĩnh vực khác nhau.
                </p>
              </div>
              <Sparkles className="absolute -right-12 -bottom-12 w-64 h-64 text-primary/5 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="bg-primary p-12 rounded-[48px] text-on-primary flex flex-col justify-between shadow-2xl shadow-primary/20">
              <div className="space-y-2">
                <p className="text-6xl font-black tracking-tighter">10k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Tác phẩm tinh hoa</p>
              </div>
              <div className="space-y-2 mt-12">
                <p className="text-6xl font-black tracking-tighter">50+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Chuyên gia giám tuyển</p>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[48px] border border-outline-variant/10 shadow-sm flex flex-col justify-between group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:rotate-12 transition-transform">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter mb-4">Đề xuất cá nhân hóa</h3>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  Hệ thống AI của chúng tôi thấu hiểu gu thẩm mỹ và trình độ chuyên môn của bạn để gợi ý những hành trình đọc phù hợp nhất.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-[#D1D5FF] p-12 rounded-[48px] border border-primary/10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-3xl font-black tracking-tighter mb-6">Khai phóng tiềm năng</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  Mục tiêu cuối cùng là rút ngắn khoảng cách giữa tò mò và thấu hiểu, giúp bạn trở thành phiên bản thông tuệ nhất của chính mình.
                </p>
              </div>
              <div className="w-full lg:w-64 aspect-video lg:aspect-square bg-white rounded-3xl flex items-center justify-center shadow-lg group">
                <Lightbulb size={64} className="text-primary group-hover:scale-125 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TEAM SECTION ══════════ */}
      <section className="bg-white py-32 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Đội ngũ</p>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface">Những người dẫn đường</h2>
            </div>
            <p className="text-on-surface-variant font-medium max-w-sm text-right">
              Gặp gỡ những bộ óc đứng sau cuộc cách mạng tri thức tại BookVerse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, idx) => (
              <div key={idx} className="group">
                <div className="aspect-[3/4] rounded-[32px] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-black text-on-surface mb-1 tracking-tight">{member.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">{member.role}</p>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-primary p-20 rounded-[60px] text-center text-on-primary relative overflow-hidden shadow-2xl shadow-primary/30 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h2 className="text-6xl font-black tracking-tighter mb-8 relative z-10 leading-tight">
            Bắt đầu hành trình <br /> tri tuệ của bạn
          </h2>
          <p className="text-on-primary/70 font-medium text-lg max-w-2xl mx-auto mb-12 relative z-10">
            Tham gia cùng cộng đồng những người khao khát kiến thức và sở hữu quyền truy cập vào Archive độc quyền.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link 
              to="/register" 
              className="px-10 py-5 bg-white text-primary rounded-[28px] font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
              GIA NHẬP NGAY
            </Link>
            <Link 
              to="/browse" 
              className="px-10 py-5 bg-white/10 text-white rounded-[28px] font-black text-lg hover:bg-white/20 transition-all active:scale-95 border border-white/20"
            >
              TÌM HIỂU THÊM
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
