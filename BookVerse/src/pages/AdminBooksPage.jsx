import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { adminFetchBooks, adminDeleteBook, adminFetchCategories } from '@/services/bookService';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchBooks = async (page = 0) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pagination.size,
        sortBy: 'id',
        direction: 'desc'
      };
      const data = await adminFetchBooks(params);
      setBooks(data.content);
      setPagination({
        ...pagination,
        page: data.number,
        totalElements: data.totalElements,
        totalPages: data.totalPages
      });
    } catch (error) {
      toast.error('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const fetchCats = async () => {
    try {
      const data = await adminFetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCats();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) return;
    
    setIsDeleting(id);
    try {
      await adminDeleteBook(id);
      toast.success('Đã xóa sách thành công');
      fetchBooks(pagination.page);
    } catch (error) {
      toast.error('Lỗi khi xóa sách');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Quản lý sách</h1>
          <p className="text-on-surface-variant font-medium">Danh sách toàn bộ sách trong hệ thống BookVerse.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
          <Plus size={18} />
          Thêm sách mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={16} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-2xl py-3 pl-10 pr-8 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Tất cả thể loại</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button className="p-3 bg-surface-container-high rounded-2xl text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/5">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Table Container */}
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
                      <span className="text-sm font-bold text-on-surface">124</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-xs font-bold text-success">Còn hàng</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary rounded-xl transition-all" title="Xem chi tiết">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-violet-500/10 hover:text-violet-500 rounded-xl transition-all" title="Chỉnh sửa">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(book.id)}
                          disabled={isDeleting === book.id}
                          className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-all disabled:opacity-50" 
                          title="Xóa"
                        >
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
              <button 
                disabled={pagination.page === 0}
                onClick={() => fetchBooks(pagination.page - 1)}
                className="p-2 rounded-xl hover:bg-surface-container transition-all disabled:opacity-20"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchBooks(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                      pagination.page === i 
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                        : 'text-outline-variant hover:bg-surface-container'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={pagination.page === pagination.totalPages - 1}
                onClick={() => fetchBooks(pagination.page + 1)}
                className="p-2 rounded-xl hover:bg-surface-container transition-all disabled:opacity-20"
              >
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
