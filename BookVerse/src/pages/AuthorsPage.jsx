import { useState } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Library,
  ChevronDown,
  Filter
} from 'lucide-react';

const MOCK_AUTHORS = [
  { 
    id: 1, 
    name: 'Thạch Lam', 
    bio: 'Cây bút tinh tế nhất của Tự Lực văn đoàn, nổi tiếng với những truyện ngắn nhẹ nhàng mà sâu sắc.',
    worksCount: 12,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 2, 
    name: 'Xuân Diệu', 
    bio: '"Ông hoàng thơ tình", người mang luồng sinh khí mới mẻ và nồng cháy vào phong trào Thơ Mới.',
    worksCount: 45,
    image: 'https://images.unsplash.com/photo-1476067897447-d0c5df27b5df?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 3, 
    name: 'Tô Hoài', 
    bio: 'Bậc thầy về ngôn ngữ đời thường, người đã đưa chú Dế Mèn đi khắp thế giới trong suốt gần một thế kỷ.',
    worksCount: 88,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 4, 
    name: 'Nguyễn Tuân', 
    bio: 'Người nghệ sĩ của cái đẹp cầu kỳ, tài hoa và uyên bác trong từng nét bút tùy bút.',
    worksCount: 24,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 5, 
    name: 'Huy Cận', 
    bio: 'Nỗi buồn vạn cổ và tầm vóc vũ trụ trong thơ ca, một hồn thơ ảo não bậc nhất thời đại.',
    worksCount: 32,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 6, 
    name: 'Vũ Trọng Phụng', 
    bio: '"Ông vua phóng sự đất Bắc", người lột trần sự giả dối của xã hội đương thời bằng ngòi bút trào phúng.',
    worksCount: 19,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' 
  }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AuthorsPage = () => {
  const [activeLetter, setActiveLetter] = useState('A');

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <h1 className="text-6xl font-black tracking-tighter text-on-surface mb-4">Danh Mục Tác Giả.</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl leading-relaxed">
          Khám phá những trí tuệ vĩ đại đã định hình nên kho tàng tri thức nhân loại. Mỗi tác giả là một hành trình, mỗi trang sách là một thế giới chờ được khai mở.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Author Banner */}
        <div className="lg:col-span-2 relative group rounded-[48px] overflow-hidden aspect-[16/9] shadow-2xl shadow-black/5">
          <img 
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=1200" 
            alt="Nam Cao" 
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
            <span className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full w-fit mb-4">
              Tác giả tiêu biểu
            </span>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Nam Cao</h2>
            <p className="text-white/80 max-w-lg font-medium leading-relaxed mb-6">
              Đại diện tiêu biểu nhất của trào lưu văn học hiện thực vị nhân sinh Việt Nam thế kỷ 20, với cái nhìn nhân đạo sâu sắc về con người.
            </p>
            <button className="flex items-center gap-2 text-white font-black group/link">
              <span>Xem kho lưu trữ</span>
              <ArrowRight className="group-hover/link:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Archive Stats */}
          <div className="bg-primary p-10 rounded-[48px] text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden group">
            <Library className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-2xl font-black tracking-tighter mb-2">Thống kê lưu trữ</h3>
            <p className="text-on-primary/70 text-sm font-medium mb-8">Cập nhật mới nhất từ hệ thống BookVerse.</p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black mb-1">1.2k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Tác giả</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-1">15k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Tác phẩm</p>
              </div>
            </div>
          </div>

          {/* Alphabet Search */}
          <div className="bg-surface-container-low p-10 rounded-[48px] border border-outline-variant/10">
            <h3 className="text-xl font-black tracking-tighter mb-6">Tìm tác giả theo bảng chữ cái</h3>
            <div className="flex flex-wrap gap-2">
              {['A', 'B', 'C', 'D', 'H', 'L', 'N', 'T'].map(letter => (
                <button 
                  key={letter}
                  onClick={() => setActiveLetter(letter)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    activeLetter === letter 
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/10' 
                      : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Author Grid Header */}
      <div className="max-w-7xl mx-auto px-6 mt-24 mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-on-surface mb-2">Danh sách nghệ sĩ từ ngữ</h2>
          <p className="text-on-surface-variant font-medium italic">Sắp xếp theo thứ tự phổ biến trong tuần</p>
        </div>
        <button className="flex items-center gap-2 bg-surface-container px-6 py-3 rounded-2xl font-bold text-sm hover:bg-surface-container-high transition-colors">
          <Filter size={18} />
          <span>Lọc theo thời kỳ</span>
        </button>
      </div>

      {/* Author Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {MOCK_AUTHORS.map((author) => (
          <div key={author.id} className="group cursor-pointer">
            <div className="aspect-[3/4] rounded-[32px] overflow-hidden mb-6 relative shadow-lg shadow-black/5">
              <img 
                src={author.image} 
                alt={author.name} 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">
              {author.name}
            </h3>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed line-clamp-3 mb-4">
              {author.bio}
            </p>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              {author.worksCount} Tác phẩm
            </span>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="flex flex-col items-center mt-24">
        <button className="flex flex-col items-center gap-2 group">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary transition-colors">
            Xem thêm trí tuệ
          </span>
          <ChevronDown className="text-primary group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default AuthorsPage;
