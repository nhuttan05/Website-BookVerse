// =====================================================
//  PAGE — HomePage.jsx
//  Đồng bộ 100% với Stitch design system (Aether Verse)
//  Tính năng: Hero decor, Smart Search, AI Recommendations, 
//            Bestsellers carousel, Editorial Blog.
// =====================================================

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import { 
  getBestsellers, 
  getNewArrivals, 
  getFeaturedBooks,
  getPersonalizedRecommendations,
  selectBestsellers,
  selectNewArrivals,
  selectFeaturedBooks,
  selectPersonalized,
  selectBooksLoading
} from '@/redux/bookSlice';

// ============================================================
//  HERO SECTION — Với hiệu ứng Asymmetric Book Grid
// ============================================================
const HeroSection = () => {
  return (
    <section className="relative min-h-[800px] flex items-center overflow-hidden">
      {/* Background with noise and gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-surface z-0 opacity-10"></div>
      <div className="absolute inset-0 noise-texture z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1]">
            Khám phá tri thức. <br/>
            <span className="text-primary-container">Mua sách thông minh hơn.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed font-light">
            BookVerse giúp bạn tìm, lưu và sở hữu những cuốn sách giá trị chỉ trong vài giây với sự trợ giúp của tuyển tập chuyên gia.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              Bắt đầu khám phá
            </button>
            <button className="px-8 py-4 bg-white/50 backdrop-blur-md border border-outline-variant/30 text-on-surface rounded-2xl font-bold text-lg hover:bg-white/80 transition-all active:scale-95">
              Xem Best-sellers
            </button>
          </div>
        </div>

        {/* Asymmetric Book Grid Decor */}
        <div className="hidden lg:grid grid-cols-3 gap-6 transform rotate-6 translate-x-12 opacity-90">
          <div className="space-y-6 -translate-y-12">
            <div className="aspect-[2/3] bg-surface-container-lowest rounded-xl shadow-2xl p-2 transform hover:-rotate-3 transition-transform duration-500">
              <img className="w-full h-full object-cover rounded-lg" src="https://covers.openlibrary.org/b/id/8739161-L.jpg" alt="Book 1" />
            </div>
            <div className="aspect-[2/3] bg-surface-container-lowest rounded-xl shadow-2xl p-2 transform hover:rotate-2 transition-transform duration-500">
              <img className="w-full h-full object-cover rounded-lg" src="https://covers.openlibrary.org/b/id/8739162-L.jpg" alt="Book 2" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="aspect-[2/3] bg-surface-container-lowest rounded-xl shadow-2xl p-2 transform hover:rotate-6 transition-transform duration-500">
              <img className="w-full h-full object-cover rounded-lg" src="https://covers.openlibrary.org/b/id/8739163-L.jpg" alt="Book 3" />
            </div>
            <div className="aspect-[2/3] bg-surface-container-lowest rounded-xl shadow-2xl p-2 transform hover:-rotate-1 transition-transform duration-500">
              <img className="w-full h-full object-cover rounded-lg" src="https://covers.openlibrary.org/b/id/8739164-L.jpg" alt="Book 4" />
            </div>
          </div>
          <div className="space-y-6 translate-y-12">
            <div className="aspect-[2/3] bg-surface-container-lowest rounded-xl shadow-2xl p-2 transform hover:-rotate-6 transition-transform duration-500">
              <img className="w-full h-full object-cover rounded-lg" src="https://covers.openlibrary.org/b/id/8739165-L.jpg" alt="Book 5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
//  SMART SEARCH BAR — Sticky
// ============================================================
const SmartSearch = () => {
  return (
    <div className="sticky top-[80px] z-40 max-w-5xl mx-auto px-6 -mt-10">
      <div className="bg-surface-container-lowest/90 p-4 rounded-3xl shadow-2xl border border-outline-variant/10 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 flex items-center bg-surface-container-high px-5 py-3 rounded-2xl group transition-all focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined text-outline">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-medium placeholder:text-outline-variant px-3 outline-none" 
              placeholder="Tìm tên sách, tác giả hoặc ISBN..." 
              type="text"
            />
          </div>
          <div className="md:col-span-2">
            <select className="w-full bg-surface-container px-4 py-3 rounded-2xl border-none text-sm font-semibold text-on-surface-variant focus:ring-primary/20 cursor-pointer outline-none">
              <option>Thể loại</option>
              <option>Kinh tế</option>
              <option>Tâm lý</option>
              <option>Văn học</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full bg-surface-container px-4 py-3 rounded-2xl border-none text-sm font-semibold text-on-surface-variant focus:ring-primary/20 cursor-pointer outline-none">
              <option>Giá bán</option>
              <option>Dưới 100k</option>
              <option>100k - 300k</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button className="w-full bg-primary py-3 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95">
              <span className="material-symbols-outlined text-sm">tune</span>
              Tìm kiếm ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
//  MAIN COMPONENT Assembly
// ============================================================
const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const bestsellers = useSelector(selectBestsellers);
  const newArrivals = useSelector(selectNewArrivals);
  const personalized = useSelector(selectPersonalized);
  const isNewArrivalsLoading = useSelector(selectBooksLoading('newArrivals'));
  const isBestsellersLoading = useSelector(selectBooksLoading('bestsellers'));
  const isPersonalizedLoading = useSelector(selectBooksLoading('personalized'));

  useEffect(() => {
    dispatch(getBestsellers(10));
    dispatch(getNewArrivals(8));
    dispatch(getFeaturedBooks());
    dispatch(getPersonalizedRecommendations());
  }, [dispatch]);

  return (
    <div className="bg-surface min-h-screen">
      <HeroSection />
      <SmartSearch />

      {/* Sách Mới Cập Nhật */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Sách Mới Cập Nhật</h2>
            <p className="text-on-surface-variant">Những đầu sách vừa cập bến kho của BookVerse hôm nay.</p>
          </div>
          <button 
            onClick={() => navigate('/browse')}
            className="group flex items-center gap-2 text-primary font-bold hover:translate-x-1 transition-all"
          >
            Xem tất cả <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isNewArrivalsLoading ? (
            Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="aspect-[2/3] bg-surface-container-low animate-pulse rounded-3xl"></div>
            ))
          ) : (
            newArrivals.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
      </section>

      {/* AI Recommendations Carousel */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Gợi ý dành riêng cho bạn</h2>
          </div>
          <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-8 snap-x">
            {isPersonalizedLoading ? (
              Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="flex-none w-[350px] aspect-[2/1] bg-surface-container animate-pulse rounded-3xl"></div>
              ))
            ) : personalized.length > 0 ? (
              personalized.map(book => (
                <div key={book.id} className="flex-none w-[350px] snap-start bg-surface-container-lowest p-6 rounded-3xl flex gap-6 shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/books/${book.slug}`} className="w-24 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-lg">
                    <img className="w-full h-full object-cover" src={book.coverImageUrl} alt={book.title} />
                  </Link>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-lg leading-tight line-clamp-2">{book.title}</h4>
                      <p className="text-sm text-on-surface-variant mt-1">{book.author}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-bold text-primary">{(book.price / 1000).toFixed(0)}k</span>
                      <button className="text-xs font-bold text-primary-container hover:underline text-left italic opacity-60">Dựa trên lịch sử của bạn</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant italic">Hãy bắt đầu khám phá để nhận gợi ý từ AI của chúng tôi.</p>
            )}
          </div>
        </div>
      </section>

      {/* Bestsellers: Horizontal Scroll with Hot Tags */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">Best-sellers Tuần Qua</h2>
          <p className="text-on-surface-variant">Top 10 cuốn sách được đặt mua nhiều nhất hệ thống.</p>
        </div>
        <div className="flex gap-8 overflow-x-auto hide-scrollbar snap-x py-4">
          {isBestsellersLoading ? (
             Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="flex-none w-48 aspect-[2/3] bg-surface-container-low animate-pulse rounded-2xl"></div>
            ))
          ) : (
            bestsellers.map((book, idx) => (
              <div key={book.id} className="flex-none w-48 snap-start group relative">
                {idx === 0 && <div className="absolute -top-2 -right-2 z-10 bg-error text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl shadow-error/20 transform rotate-12">HOT</div>}
                {idx === 1 && <div className="absolute -top-2 -right-2 z-10 bg-error text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl shadow-error/20 transform -rotate-6">TRENDING</div>}
                <Link to={`/books/${book.slug}`} className="block aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl group-hover:shadow-primary/20 group-hover:scale-105 transition-all">
                  <img className="w-full h-full object-cover" src={book.coverImageUrl} alt={book.title} />
                </Link>
                <div className="text-center">
                  <h4 className="font-bold text-on-surface truncate px-2">{book.title}</h4>
                  <p className="text-xs text-on-surface-variant">{book.author.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Nhật Ký BookVerse (Blog) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Nhật Ký BookVerse</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Chia sẻ kiến thức, review sách và những câu chuyện truyền cảm hứng từ các mọt sách chính hiệu.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tag: 'Sự kiện', title: 'Tại sao việc đọc sách giấy vẫn chưa bao giờ lỗi thời?', desc: 'Khám phá lý do tại sao trong thời đại số, những trang sách thơm mùi giấy vẫn có sức hút mãnh liệt...', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800' },
            { tag: 'Top Books', title: 'Top 10 cuốn sách thay đổi tư duy tài chính của bạn', desc: 'Những kiến thức cơ bản đến nâng cao về quản lý tài chính cá nhân mà bạn không nên bỏ lỡ...', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800' },
            { tag: 'Review', title: 'Review: Khi Hơi Thở Hóa Thinh Không', desc: 'Một cuốn hồi ký đầy xúc động về cuộc đời, cái chết và ý nghĩa của việc được sống thực thụ...', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800' }
          ].map((post, idx) => (
            <article key={idx} className="group cursor-pointer">
              <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={post.img} alt={post.title} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase">
                  <span>{post.tag}</span>
                  <span>•</span>
                  <span>5 phút đọc</span>
                </div>
                <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-on-surface-variant line-clamp-2">{post.desc}</p>
                <button className="pt-4 flex items-center gap-2 font-bold text-on-surface group/btn">
                  Đọc thêm 
                  <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_right_alt</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
