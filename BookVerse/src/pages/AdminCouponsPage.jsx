// =====================================================
//  PAGE — AdminCouponsPage.jsx
//  Quản lý mã giảm giá
// =====================================================

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminFetchCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon, selectCoupons } from '@/redux/orderSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatters';
import { Tag, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const AdminCouponsPage = () => {
  const dispatch = useDispatch();
  const coupons = useSelector(selectCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    maxUses: '',
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(adminFetchCoupons());
  }, [dispatch]);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        ...coupon,
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 16) : ''
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
        minOrderAmount: '', maxDiscountAmount: '', maxUses: '', expiryDate: '', isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.minOrderAmount) delete dataToSubmit.minOrderAmount;
      if (!dataToSubmit.maxDiscountAmount) delete dataToSubmit.maxDiscountAmount;
      if (!dataToSubmit.maxUses) delete dataToSubmit.maxUses;
      if (!dataToSubmit.expiryDate) delete dataToSubmit.expiryDate;

      if (editingCoupon) {
        await dispatch(adminUpdateCoupon({ id: editingCoupon.id, data: dataToSubmit })).unwrap();
        toast.success('Cập nhật mã giảm giá thành công');
      } else {
        await dispatch(adminCreateCoupon(dataToSubmit)).unwrap();
        toast.success('Thêm mã giảm giá thành công');
      }
      handleCloseModal();
      dispatch(adminFetchCoupons());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      try {
        await dispatch(adminDeleteCoupon(id)).unwrap();
        toast.success('Đã xóa mã giảm giá');
        dispatch(adminFetchCoupons());
      } catch (error) {
        toast.error(error || 'Không thể xóa mã giảm giá');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Tag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-on-surface">Mã giảm giá</h1>
            <p className="text-sm font-medium text-on-surface-variant">Quản lý các chương trình khuyến mãi</p>
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
          <Plus size={20} />
          <span>Thêm mã mới</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Mã code</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Giá trị</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Đã dùng / Giới hạn</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Hạn sử dụng</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">{coupon.code}</span>
                    <p className="text-xs text-on-surface-variant mt-2 max-w-[200px] truncate">{coupon.description}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-on-surface">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">
                    <span className="text-on-surface font-bold">{coupon.usedCount || 0}</span>
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / ∞'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${coupon.isActive ? 'bg-success/10 text-success' : 'bg-outline/10 text-outline'}`}>
                      {coupon.isActive ? 'Hoạt động' : 'Đã tắt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(coupon)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant italic">
                    Chưa có mã giảm giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-on-surface">{editingCoupon ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h2>
              <button onClick={handleCloseModal} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mã Code <span className="text-error">*</span></label>
                  <input required type="text" name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="VD: SUMMER100" disabled={!!editingCoupon} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none font-bold uppercase transition-colors disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Trạng thái</label>
                  <label className="flex items-center gap-3 h-12 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                    <span className="font-medium text-sm">Kích hoạt</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mô tả ngắn</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Loại giảm giá</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none font-medium transition-colors">
                    <option value="PERCENTAGE">Theo phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Giá trị giảm <span className="text-error">*</span></label>
                  <input required type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} min="0" step={formData.discountType === 'PERCENTAGE' ? "0.1" : "1000"} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Đơn tối thiểu (VNĐ)</label>
                  <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleChange} min="0" step="1000" className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Giảm tối đa (VNĐ)</label>
                  <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleChange} min="0" step="1000" disabled={formData.discountType === 'FIXED'} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none transition-colors disabled:opacity-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Giới hạn số lần dùng</label>
                  <input type="number" name="maxUses" value={formData.maxUses} onChange={handleChange} min="1" placeholder="Để trống = Không giới hạn" className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ngày hết hạn</label>
                  <input type="datetime-local" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary/30 outline-none transition-colors" />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-outline-variant/10">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
                <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-primary text-white hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
                  <Check size={18} /> Lưu mã giảm giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
