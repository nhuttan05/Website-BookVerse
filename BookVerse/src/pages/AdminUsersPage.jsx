import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Edit2, 
  Slash, 
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
  UserCheck
} from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Mọi vai trò');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const roles = user.roles || [];
    const hasRole = (roleName) => roles.some(r => r.name === roleName);
    
    if (selectedRole === 'Quản trị viên') return matchesSearch && hasRole('ROLE_ADMIN');
    if (selectedRole === 'Người dùng') return matchesSearch && hasRole('ROLE_USER');
    if (selectedRole === 'Người giám tuyển') return matchesSearch && hasRole('ROLE_MODERATOR');
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">Quản lý Người dùng</h1>
          <p className="text-on-surface-variant font-medium max-w-2xl">
            Giám sát và điều phối cộng đồng học giả trong hệ thống lưu trữ số BookVerse.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20">
          <UserPlus size={20} />
          <span>Thêm Người dùng Mới</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Tổng số tài khoản</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface leading-none">{users.length}</span>
            <span className="text-xs font-bold text-success mb-1 flex items-center gap-1">
              Hệ thống thật
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Quản trị viên (Admin)</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface leading-none">
              {users.filter(u => u.roles?.some(r => r.name === 'ROLE_ADMIN')).length}
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: `${(users.filter(u => u.roles?.some(r => r.name === 'ROLE_ADMIN')).length / users.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Khách hàng (Users)</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface leading-none">
              {users.filter(u => u.roles?.some(r => r.name === 'ROLE_USER')).length}
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-tertiary" style={{ width: `${(users.filter(u => u.roles?.some(r => r.name === 'ROLE_USER')).length / users.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low p-4 rounded-[28px] border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email..."
            className="w-full bg-surface-container px-12 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="bg-surface-container px-6 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold min-w-[160px]"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option>Mọi vai trò</option>
            <option>Quản trị viên</option>
            <option>Người giám tuyển</option>
            <option>Người dùng</option>
          </select>
          
          <button className="p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-colors text-on-surface-variant">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table Section */}
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
                    <p className="text-sm font-bold text-on-surface-variant italic">Đang tải danh sách học giả...</p>
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
              filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/5 last:border-0">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.fullName?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{user.fullName || 'Người dùng mới'}</p>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(role => (
                        <span key={role.id} className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                          role.name === 'ROLE_ADMIN' ? 'bg-primary/10 text-primary' :
                          role.name === 'ROLE_MODERATOR' ? 'bg-secondary/10 text-secondary' :
                          'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {role.name?.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.enabled !== false ? 'bg-success' : 'bg-error'}`} />
                      <span className="text-sm font-bold text-on-surface-variant">
                        {user.enabled !== false ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors group/btn">
                        <Edit2 size={18} className="group-hover/btn:text-primary" />
                      </button>
                      <button className="p-2 hover:bg-error/10 rounded-xl text-on-surface-variant transition-colors group/btn">
                        <Slash size={18} className="group-hover/btn:text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs font-bold text-on-surface-variant">
            Hiển thị 1-5 trên 1,284 người dùng
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant disabled:opacity-30" disabled>
              <ChevronLeft size={20} />
            </button>
            {[1, 2, 3, '...', 129].map((page, idx) => (
              <button 
                key={idx}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  page === 1 ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
