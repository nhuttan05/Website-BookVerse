import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { toast } from 'react-hot-toast';
import {
  Search, Edit2, Trash2, CheckCircle, Filter,
  ChevronLeft, ChevronRight, Shield, User as UserIcon, X, Loader2, Save
} from 'lucide-react';

// =====================================================
//  EditUserModal — Modal chỉnh sửa thông tin người dùng
// =====================================================
const EditUserModal = ({ user, onClose, onSaved }) => {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) { toast.error('Họ tên không được để trống'); return; }
    setSubmitting(true);
    try {
      await axiosInstance.put(`/admin/users/${user.id}`, { fullName });
      toast.success('Đã cập nhật thông tin người dùng!');
      onSaved();
      onClose();
    } catch {
      toast.error('Lỗi khi cập nhật người dùng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <UserIcon size={18} className="text-primary" />
            </div>
            <h2 className="text-lg font-black text-on-surface">Chỉnh sửa người dùng</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors">
            <X size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Avatar + Email (readonly) */}
          <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
              {user.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">{user.email}</p>
              <p className="text-xs text-on-surface-variant">
                {user.roles?.map(r => r.name?.replace('ROLE_', '')).join(', ')}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-outline uppercase tracking-widest">Họ và tên</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Nhập họ tên..."
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-black text-on-surface-variant bg-surface-container-high hover:bg-surface-container transition-all">
              Hủy bỏ
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 bg-primary text-on-primary rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
//  AdminUsersPage
// =====================================================
const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Mọi vai trò');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Xóa người dùng "${user.fullName || user.email}"? Hành động này không thể hoàn tác!`)) return;
    setDeletingId(user.id);
    try {
      await axiosInstance.delete(`/admin/users/${user.id}`);
      toast.success('Đã xóa người dùng thành công');
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch {
      toast.error('Lỗi khi xóa người dùng');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const name = (user.fullName || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = name.includes(term) || email.includes(term);

    const roles = user.roles || [];
    const hasRole = (roleName) => roles.some(r => r.name === roleName);
    if (selectedRole === 'Quản trị viên') return matchesSearch && hasRole('ROLE_ADMIN');
    if (selectedRole === 'Người dùng') return matchesSearch && hasRole('ROLE_USER');
    return matchesSearch;
  });

  const adminCount = users.filter(u => u.roles?.some(r => r.name === 'ROLE_ADMIN')).length;
  const userCount = users.filter(u => u.roles?.some(r => r.name === 'ROLE_USER')).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={fetchUsers}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">Quản lý Người dùng</h1>
        <p className="text-on-surface-variant font-medium">Giám sát và điều phối cộng đồng học giả trong hệ thống lưu trữ số BookVerse.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tổng số tài khoản', value: users.length, color: 'bg-primary', pct: 100 },
          { label: 'Quản trị viên (Admin)', value: adminCount, color: 'bg-secondary', pct: users.length ? (adminCount / users.length * 100) : 0 },
          { label: 'Khách hàng (Users)', value: userCount, color: 'bg-tertiary', pct: users.length ? (userCount / users.length * 100) : 0 },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">{stat.label}</p>
            <span className="text-4xl font-black text-on-surface leading-none">{stat.value}</span>
            <div className="mt-4 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className={`h-full ${stat.color} rounded-full transition-all duration-700`} style={{ width: `${stat.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low p-4 rounded-[28px] border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text" placeholder="Tìm theo tên hoặc email..."
            className="w-full bg-surface-container px-12 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="bg-surface-container px-6 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold min-w-[160px]"
            value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
          >
            <option>Mọi vai trò</option>
            <option>Quản trị viên</option>
            <option>Người dùng</option>
          </select>
          <button className="p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-colors text-on-surface-variant">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-low rounded-[32px] border border-outline-variant/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-outline">Người dùng</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-outline">Vai trò</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-outline">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-outline text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-on-surface-variant">Đang tải danh sách người dùng...</p>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-on-surface-variant font-medium">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="group hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/5 last:border-0">
                  {/* Người dùng */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                        {user.avatarUrl
                          ? <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                          : <span>{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
                        }
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{user.fullName || 'Người dùng mới'}</p>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Vai trò */}
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(role => (
                        <span key={role.id} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 ${
                          role.name === 'ROLE_ADMIN'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {role.name === 'ROLE_ADMIN' ? <Shield size={10} /> : <UserIcon size={10} />}
                          {role.name?.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.enabled !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-bold text-on-surface-variant">
                        {user.enabled !== false ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 hover:bg-primary/10 rounded-xl text-on-surface-variant hover:text-primary transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={deletingId === user.id}
                        className="p-2 hover:bg-error/10 rounded-xl text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
                        title="Xóa người dùng"
                      >
                        {deletingId === user.id
                          ? <Loader2 size={18} className="animate-spin" />
                          : <Trash2 size={18} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer count */}
        <div className="px-8 py-5 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs font-bold text-on-surface-variant">
            Hiển thị <span className="text-on-surface">{filteredUsers.length}</span> trên <span className="text-on-surface">{users.length}</span> người dùng
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <X size={12} /> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
