import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search,
  Edit2, 
  Trash2, 
  Loader2,
  Layers
} from 'lucide-react';
import { adminFetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/services/bookService';
import { toast } from 'react-hot-toast';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCats = async () => {
    setLoading(true);
    try {
      const data = await adminFetchCategories();
      // Backend có thể trả về array hoặc Page object { content: [...] }
      setCategories(Array.isArray(data) ? data : (data?.content ?? []));
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await adminUpdateCategory(isEditing.id, { name: newCatName });
        toast.success('Đã cập nhật danh mục');
      } else {
        await adminCreateCategory({ name: newCatName });
        toast.success('Đã thêm danh mục mới');
      }
      setNewCatName('');
      setIsEditing(null);
      fetchCats();
    } catch (error) {
      toast.error('Lỗi khi lưu danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này có thể ảnh hưởng đến các sách thuộc danh mục. Bạn có chắc chắn?')) return;
    
    try {
      await adminDeleteCategory(id);
      toast.success('Đã xóa danh mục');
      fetchCats();
    } catch (error) {
      toast.error('Lỗi khi xóa danh mục');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Quản lý danh mục</h1>
        <p className="text-on-surface-variant font-medium">Tổ chức và phân loại các cuốn sách trong Archive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <div className="md:col-span-5 sticky top-8">
          <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
              <Layers className="text-primary" size={24} />
              {isEditing ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-outline uppercase tracking-widest px-1">Tên danh mục</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="VD: Khoa học viễn tưởng"
                  className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isEditing ? 'Cập nhật' : 'Thêm ngay')}
                </button>
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(null); setNewCatName(''); }}
                    className="w-full py-4 bg-surface-container-high text-on-surface-variant rounded-2xl text-sm font-black hover:bg-surface-container transition-all"
                  >
                    Hủy bỏ
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="md:col-span-7">
          <div className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/5 bg-surface-container-high/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={16} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm nhanh danh mục..."
                  className="w-full bg-surface-container border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="divide-y divide-outline-variant/5 max-h-[600px] overflow-y-auto custom-scrollbar">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse flex justify-between items-center">
                    <div className="h-4 bg-surface-container-high rounded w-32"></div>
                    <div className="h-4 bg-surface-container-high rounded w-20"></div>
                  </div>
                ))
              ) : categories.length > 0 ? (
                categories
                  .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((cat) => (
                  <div key={cat.id} className="p-6 hover:bg-surface-container-high/30 transition-all flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="font-black text-on-surface group-hover:text-primary transition-colors">{cat.name}</span>
                      <span className="text-[10px] text-outline font-bold uppercase tracking-widest">Slug: {cat.slug}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => { setIsEditing(cat); setNewCatName(cat.name); }}
                        className="p-2 text-on-surface-variant hover:bg-violet-500/10 hover:text-violet-500 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-on-surface-variant font-bold">Chưa có danh mục nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
