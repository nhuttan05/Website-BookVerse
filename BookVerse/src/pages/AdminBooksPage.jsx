import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  BookOpen
} from 'lucide-react';
import {
  adminFetchBooks,
  adminDeleteBook,
  adminFetchCategories,
  adminCreateBook,
  adminUpdateBook
} from '@/services/bookService';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

// =====================================================
//  BookFormModal — Modal Thêm / Sửa sách
// =====================================================
const EMPTY_FORM = {
  title: '', author: '', price: '', originalPrice: '',
  discountPercent: 0, categoryId: '', coverImageUrl: '',
  description: '', stockQuantity: 100, featured: false,
  language: 'Tiếng Việt', pageCount: '', publisher: ''
};

const BookFormModal = ({ book, categories, onClose, onSaved }) => {
  const isEdit = !!book;
  const [form, setForm] = useState(isEdit ? {
    title: book.title || '',
    author: book.author || '',
    price: book.price || '',
    originalPrice: book.originalPrice || '',
    discountPercent: book.discountPercent || 0,
    categoryId: book.categoryId || '',
    coverImageUrl: book.coverImageUrl || '',
    description: book.description || '',
    stockQuantity: book.stockQuantity ?? 100,
    featured: book.isFeatured || false,
    language: book.language || 'Tiếng Việt',
    pageCount: book.pageCount || '',
    publisher: book.publisher || ''
  } : { ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.price) {
      toast.error('Vui lòng điền đầy đủ: Tên sách, Tác giả, Giá');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price),
        discountPercent: parseInt(form.discountPercent) || 0,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        pageCount: form.pageCount ? parseInt(form.pageCount) : null,
      };
      if (isEdit) {
        await adminUpdateBook(book.id, payload);
        toast.success('Đã cập nhật sách thành công!');
      } else {
        await adminCreateBook(payload);
        toast.success('Đã thêm sách mới thành công!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(isEdit ? 'Lỗi khi cập nhật sách' : 'Lỗi khi thêm sách');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-black text-on-surface">
              {isEdit ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors">
            <X size={20} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-8 py-6 space-y-5">
          {/* Tên sách & Tác giả */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Tên sách *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Nhập tên sách..." required
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Tác giả *</label>
              <input name="author" value={form.author} onChange={handleChange}
                placeholder="Tên tác giả..." required
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>

          {/* Giá & Giá gốc & Giảm giá */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Giá bán (VNĐ) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange}
                placeholder="250000" required min="0"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Giá gốc (VNĐ)</label>
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange}
                placeholder="300000" min="0"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Giảm giá (%)</label>
              <input name="discountPercent" type="number" value={form.discountPercent} onChange={handleChange}
                placeholder="0" min="0" max="100"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>

          {/* Danh mục & Kho & Trang */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Danh mục</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Tồn kho</label>
              <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange}
                placeholder="100" min="0"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Số trang</label>
              <input name="pageCount" type="number" value={form.pageCount} onChange={handleChange}
                placeholder="320" min="1"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>

          {/* Ngôn ngữ & NXB */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Ngôn ngữ</label>
              <select name="language" value={form.language} onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                <option>Tiếng Việt</option>
                <option>English</option>
                <option>Tiếng Nhật</option>
                <option>Tiếng Trung</option>
                <option>Tiếng Pháp</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-outline uppercase tracking-widest">Nhà xuất bản</label>
              <input name="publisher" value={form.publisher} onChange={handleChange}
                placeholder="NXB Kim Đồng..."
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>

          {/* Ảnh bìa */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-outline uppercase tracking-widest">URL ảnh bìa</label>
            <div className="flex gap-3">
              <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              {form.coverImageUrl && (
                <img src={form.coverImageUrl} alt="preview"
                  className="w-12 h-16 object-cover rounded-lg border border-outline-variant/20 shrink-0"
                  onError={(e) => e.target.style.display = 'none'} />
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-outline uppercase tracking-widest">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Mô tả ngắn về cuốn sách..."
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
          </div>

          {/* Nổi bật */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
              className="w-5 h-5 rounded-md border-2 border-outline-variant accent-primary" />
            <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">
              Đánh dấu là sách <span className="text-primary">Nổi bật</span> (hiển thị trên trang chủ)
            </span>
          </label>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-outline-variant/10 shrink-0 bg-surface-container-low/50">
          <button onClick={onClose} type="button"
            className="px-6 py-3 rounded-2xl text-sm font-black text-on-surface-variant hover:bg-surface-container-high transition-all">
            Hủy bỏ
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-8 py-3 bg-primary text-on-primary rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isEdit ? 'Lưu thay đổi' : 'Thêm sách'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
//  AdminBooksPage
// =====================================================
const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async (page = 0) => {
    setLoading(true);
    try {
      const data = await adminFetchBooks({ page, size: pagination.size, sortBy: 'id', direction: 'desc' });
      setBooks(data.content);
      setPagination(prev => ({ ...prev, page: data.number, totalElements: data.totalElements, totalPages: data.totalPages }));
    } catch {
      toast.error('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const fetchCats = async () => {
    try {
      const data = await adminFetchCategories();
      setCategories(Array.isArray(data) ? data : (data?.content ?? []));
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => { fetchBooks(); fetchCats(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) return;
    setIsDeleting(id);
    try {
      await adminDeleteBook(id);
      toast.success('Đã xóa sách thành công');
      fetchBooks(pagination.page);
    } catch {
      toast.error('Lỗi khi xóa sách');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleOpenAdd = () => { setEditingBook(null); setShowModal(true); };
  const handleOpenEdit = (book) => { setEditingBook(book); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditingBook(null); };
  const handleSaved = () => fetchBooks(pagination.page);

  return (
    <div className="space-y-8">
      {/* Modal */}
      {showModal && (
        <BookFormModal
          book={editingBook}
          categories={categories}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Quản lý sách</h1>
          <p className="text-on-surface-variant font-medium">Danh sách toàn bộ sách trong hệ thống BookVerse.</p>
        </div>
        <button onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
          <Plus size={18} />
          Thêm sách mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input type="text" placeholder="Tìm kiếm theo tên sách, tác giả..."
            className="w-full bg-surface-container-high border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={16} />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-2xl py-3 pl-10 pr-8 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20">
            <option value="">Tất cả thể loại</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                <th className="px-6 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Sách</th>
                <th className="px-6 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Thể loại</th>
                <th className="px-6 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Giá</th>
                <th className="px-6 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Kho</th>
                <th className="px-6 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-5 text-[10px] font-black text-outline uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="h-12 bg-surface-container-high rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-surface-container-high/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/10 shrink-0 shadow-sm">
                          <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-on-surface text-sm truncate group-hover:text-primary transition-colors">{book.title}</p>
                          <p className="text-xs text-outline-variant font-medium">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-black text-on-surface-variant uppercase tracking-wider border border-outline-variant/10">
                        {book.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-on-surface">{formatPrice(book.price)}</span>
                        {book.discountPercent > 0 && (
                          <span className="text-[10px] text-outline-variant line-through">{formatPrice(book.originalPrice)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-on-surface">{book.stockQuantity ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${(book.stockQuantity ?? 1) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs font-bold ${(book.stockQuantity ?? 1) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {(book.stockQuantity ?? 1) > 0 ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(book)}
                          className="p-2 text-on-surface-variant hover:bg-violet-500/10 hover:text-violet-500 rounded-xl transition-all" title="Chỉnh sửa">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(book.id)} disabled={isDeleting === book.id}
                          className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-all disabled:opacity-50" title="Xóa">
                          {isDeleting === book.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <p className="text-on-surface-variant font-bold">Không tìm thấy cuốn sách nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-8 py-6 bg-surface-container-high/30 border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-xs font-bold text-outline-variant">
              Hiển thị <span className="text-on-surface">{books.length}</span> trên <span className="text-on-surface">{pagination.totalElements}</span> cuốn sách
            </p>
            <div className="flex items-center gap-2">
              <button disabled={pagination.page === 0} onClick={() => fetchBooks(pagination.page - 1)}
                className="p-2 rounded-xl hover:bg-surface-container transition-all disabled:opacity-20">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }).map((_, i) => (
                  <button key={i} onClick={() => fetchBooks(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${pagination.page === i ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-outline-variant hover:bg-surface-container'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button disabled={pagination.page === pagination.totalPages - 1} onClick={() => fetchBooks(pagination.page + 1)}
                className="p-2 rounded-xl hover:bg-surface-container transition-all disabled:opacity-20">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooksPage;
