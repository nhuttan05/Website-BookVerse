// =====================================================
//  PAGE — BookDetailPage.jsx
//  Chi tiết cuốn sách (Stitch-aligned)
//  Aether Verse: Editorial layout, high-fidelity typography
// =====================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getBookBySlug, 
  getSimilarBooks,
  selectSelectedBook, 
  selectSimilarBooks,
  selectBooksLoading, 
  clearSelectedBook 
} from '@/redux/bookSlice';
import { addItem } from '@/redux/cartSlice';
import { formatPrice } from '@/utils/formatters';
import BookCard from '@/components/BookCard';
import LazyImage from '@/components/ui/LazyImage';

const BookDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const book = useSelector(selectSelectedBook);
  const similarBooks = useSelector(selectSimilarBooks);
  const isLoading = useSelector(selectBooksLoading('selectedBook'));
  
  const [activeTab, setActiveTab] = useState('desc');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(getBookBySlug(slug));
      dispatch(getSimilarBooks(slug));
    }
    return () => dispatch(clearSelectedBook());
  }, [dispatch, slug]);

  // Cập nhật ảnh chính khi book data thay đổi
  useEffect(() => {
    if (book?.coverImageUrl) {
      setMainImage(book.coverImageUrl);
    }
  }, [book]);

  const handleAddToCart = () => {
    if (!book) return;
    setIsAdding(true);
    dispatch(addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      coverImageUrl: book.coverImageUrl,
      author: book.author,
      quantity: quantity
    }));
    
    // Visual feedback
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center space-y-4">
        <span className="material-symbols-outlined text-6xl text-outline-variant">menu_book</span>
        <h2 className="text-2xl font-bold text-on-surface">Không tìm thấy sách</h2>
        <button onClick={() => navigate('/browse')} className="text-primary font-bold hover:underline">Quay lại Archive</button>
      </div>
    );
  }

  // Chuẩn bị danh sách ảnh gallery (cover + 4 ảnh góc độ)
  const galleryImages = book.images && book.images.length > 0 
    ? [book.coverImageUrl, ...book.images.slice(0, 3)] 
    : [book.coverImageUrl, book.coverImageUrl, book.coverImageUrl, book.coverImageUrl];

  return (
    <div className="bg-surface min-h-screen pb-20">
      
      {/* ══════════ BREADCRUMBS ══════════ */}
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/browse" className="hover:text-primary transition-colors">Archive</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface-variant truncate max-w-[200px]">{book.title}</span>
        </div>
      </nav>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Col: Cover and Gallery */}
        <div className="lg:col-span-5 space-y-8">
          <div className="aspect-[2/3] bg-surface-container-low rounded-[2rem] overflow-hidden shadow-float group">
            <LazyImage className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={mainImage} alt={book.title} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setMainImage(img)}
                className={`aspect-square bg-surface-container-low rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
                  mainImage === img ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-primary/20'
                }`}
              >
                <LazyImage className={`w-full h-full object-cover transition-opacity ${mainImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} src={img} alt={`Angle ${i+1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Info */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            {book.isEditorChoice && (
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Editor's Choice</span>
            )}
            <h1 className="text-5xl font-black tracking-tighter text-on-surface leading-tight">{book.title}</h1>
            <div className="flex items-center gap-4">
              <p className="text-lg font-medium text-on-surface-variant">by <span className="text-primary font-bold cursor-pointer hover:underline">{book.author}</span></p>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <div className="flex items-center gap-1">
                <div className="flex text-tertiary">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${i <= Math.floor(book.rating || 0) ? 1 : 0}` }}>star</span>
                  ))}
                </div>
                <span className="text-sm font-bold text-on-surface">{(book.rating || 0).toFixed(1)}</span>
                <span className="text-xs text-outline-variant">({(book.reviewCount || 0).toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface-container-low rounded-[2rem] flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-primary">{formatPrice(book.price)}</span>
                {book.originalPrice && <span className="text-lg text-outline-variant line-through">{formatPrice(book.originalPrice)}</span>}
              </div>
              {book.discountPercent > 0 && <span className="text-xs font-black text-error uppercase tracking-widest">Tiết kiệm {book.discountPercent}%</span>}
            </div>
            <div className="flex items-center bg-surface-container-lowest rounded-2xl p-1 shadow-sm">
              <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-xl transition-colors">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity+1)} className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-xl transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>

          <p className="text-lg text-on-surface-variant leading-relaxed font-light">
            {book.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-8 py-5 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">bolt</span> MUA NGAY
            </button>
            <button 
              onClick={handleAddToCart}
              className={`flex-1 px-8 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isAdding ? 'bg-success text-white' : 'bg-white border-2 border-primary/10 text-primary hover:bg-primary/5'
              }`}
            >
              <span className="material-symbols-outlined">{isAdding ? 'done' : 'shopping_cart'}</span> 
              {isAdding ? 'ĐÃ THÊM' : 'THÊM VÀO GIỎ HÀNG'}
            </button>
          </div>

          {book.previewUrl && (
            <button 
              onClick={() => setShowPreview(true)}
              className="w-full py-4 bg-tertiary/10 text-tertiary rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-tertiary/20 transition-all border-2 border-tertiary/5"
            >
              <span className="material-symbols-outlined">visibility</span> Đọc thử chương đầu (Look Inside)
            </button>
          )}

          <div className="grid grid-cols-3 gap-8 pt-6">
            <div>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Giao hàng</p>
              <p className="text-sm font-bold text-on-surface">Miễn phí toàn quốc</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Đổi trả</p>
              <p className="text-sm font-bold text-on-surface">Trong vòng 30 ngày</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Tình trạng</p>
              <p className="text-sm font-bold text-primary">Còn hàng</p>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════ TABS SECTION ══════════ */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex border-b border-outline-variant/20 gap-12 mb-12">
          {[
            { id: 'desc', label: 'Giới thiệu nội dung' },
            { id: 'info', label: 'Thông tin chi tiết' },
            { id: 'author', label: 'Về tác giả' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-primary' : 'text-outline hover:text-on-surface'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            {activeTab === 'desc' && (
              <div className="prose prose-slate max-w-none text-on-surface-variant leading-loose space-y-6">
                <p>{book.description}</p>
                <p>Cuốn sách này không chỉ đơn thuần là một tác phẩm văn học, nó là một hành trình khám phá tâm hồn con người. Tác giả đã khéo léo đan xen những triết lý sâu sắc vào cốt truyện hấp dẫn, khiến người đọc không thể rời mắt từ trang đầu tiên đến trang cuối cùng.</p>
                <ul className="space-y-4 list-none pl-0">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Tư duy đột phá về cách tiếp cận vấn đề trong cuộc sống hiện đại.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Xây dựng thói quen tích cực để thay đổi vận mệnh bản thân.</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <p className="text-on-surface-variant">Chi tiết về thông số kỹ thuật, bản in và các thông tin liên quan khác của cuốn sách.</p>
              </div>
            )}
            {activeTab === 'author' && (
              <div className="flex items-start gap-8 p-8 bg-surface-container-low rounded-3xl">
                <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src={`https://i.pravatar.cc/150?u=${book.author}`} alt="Author" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-on-surface">{book.author}</h4>
                  <p className="text-on-surface-variant leading-relaxed italic">"Tri thức là chìa khóa duy nhất để mở ra cánh cửa tự do."</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Nhà văn, diễn giả và chuyên gia hàng đầu trong lĩnh vực nghiên cứu hành vi con người với hơn 20 năm kinh nghiệm.</p>
                </div>
              </div>
            )}
          </div>

          {/* Technical Info Card */}
          <div className="lg:col-span-4">
            <div className="p-8 bg-surface-container-low rounded-[2rem] space-y-6 border border-outline-variant/10">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Thông tin chi tiết</h3>
              <div className="space-y-4 text-sm">
                {[
                  { label: 'Nhà cung cấp', value: book.supplier },
                  { label: 'Tác giả', value: book.author },
                  { label: 'Nhà xuất bản', value: book.publisher },
                  { label: 'ISBN', value: book.isbn },
                  { label: 'Ngôn ngữ', value: book.language },
                  { label: 'Độ tuổi', value: book.ageRange || 'Mọi độ tuổi' },
                  { label: 'Số trang', value: `${book.pageCount} trang` },
                  { label: 'Năm XB', value: book.publishedDate ? book.publishedDate.split('-')[0] : '2023' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-start gap-4">
                    <span className="text-outline shrink-0">{item.label}</span>
                    <span className="font-bold text-on-surface text-right">{item.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ REVIEWS SECTION ══════════ */}
      <section className="max-w-7xl mx-auto px-6 mt-32 bg-surface-container-low/50 py-24 rounded-[3rem]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tight text-on-surface mb-2">Đánh giá từ độc giả</h2>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="text-5xl font-black text-primary">{book.rating.toFixed(1)}</span>
              <div className="text-left">
                <div className="flex text-tertiary">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider">Dựa trên {book.reviewCount.toLocaleString()} đánh giá</p>
              </div>
            </div>
          </div>
          <button className="px-8 py-4 bg-on-surface text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-primary transition-colors">
            <span className="material-symbols-outlined">edit_note</span> VIẾT ĐÁNH GIÁ
          </button>
        </div>

        <div className="space-y-6">
          {[
            { name: 'Minh Hoàng', date: '2 ngày trước', text: 'Một cuốn sách tuyệt vời giúp tôi cân bằng lại cuộc sống. Cách hành văn rất nhẹ nhàng nhưng đầy sức nặng. Giao hàng cực nhanh!' },
            { name: 'Linh Chi', date: '1 tuần trước', text: 'Sách rất đẹp, giấy xịn cầm rất thích tay. Nội dung cực kỳ hữu ích cho những ai đang gặp stress.' }
          ].map((rev, i) => (
            <div key={i} className="p-8 bg-surface-container-lowest rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img className="w-10 h-10 rounded-full" src={`https://i.pravatar.cc/150?u=${rev.name}`} alt="Avatar" />
                  <div>
                    <p className="font-bold text-on-surface">{rev.name}</p>
                    <p className="text-xs text-outline-variant">{rev.date}</p>
                  </div>
                </div>
                <div className="flex text-tertiary">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{rev.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ RECOMMENDATIONS ══════════ */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black tracking-tight text-on-surface">Có thể bạn sẽ thích</h2>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {similarBooks && similarBooks.slice(0, 5).map(b => (
            <div key={b.id} className="space-y-4 group cursor-pointer" onClick={() => navigate(`/books/${b.slug}`)}>
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                <LazyImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={b.coverImageUrl} alt={b.title} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface line-clamp-1">{b.title}</h4>
                <p className="text-xs text-on-surface-variant mb-2">{b.author?.name || b.author}</p>
                <p className="font-black text-primary">{formatPrice(b.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ SIMILAR BOOKS ══════════ */}
      {similarBooks && similarBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">AI Recommendations</span>
              <h2 className="text-4xl font-black tracking-tight text-on-surface">Khám phá tương tự</h2>
            </div>
            <Link to="/browse" className="text-sm font-bold text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {similarBooks.slice(0, 4).map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
      
      {/* ══════════ PREVIEW MODAL ══════════ */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>
          <div className="relative bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="p-6 border-b flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">auto_stories</span>
                </div>
                <div>
                  <h3 className="font-black tracking-tight">Đọc thử: {book.title}</h3>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Chương 1 (Xem trước)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-surface-container-lowest p-10">
              {book.previewType === 'PDF' ? (
                <iframe 
                  src={`${book.previewUrl}#toolbar=0`} 
                  className="w-full h-full border-none rounded-xl"
                  title="PDF Preview"
                />
              ) : (
                <div className="max-w-2xl mx-auto prose prose-slate">
                   <h1 className="text-center mb-10">Chương 1</h1>
                   <div className="text-lg leading-loose text-on-surface-variant whitespace-pre-wrap">
                     {book.previewUrl || "Nội dung đang được cập nhật..."}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
