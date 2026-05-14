import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import ScrollToTop from '@/components/ScrollToTop';

import { Navigate } from 'react-router-dom';
import AdminLayout from '@/layout/AdminLayout';

// =====================================================
//  LAZY LOADING PAGES
// =====================================================
const HomePage = lazy(() => import('@/pages/HomePage'));
const BrowsePage = lazy(() => import('@/pages/BrowsePage'));
const BookDetailPage = lazy(() => import('@/pages/BookDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const StaticPage = lazy(() => import('@/pages/StaticPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminBooksPage = lazy(() => import('@/pages/AdminBooksPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/AdminCategoriesPage'));
const AdminUsersPage = lazy(() => import('@/pages/AdminUsersPage'));
const AuthorsPage = lazy(() => import('@/pages/AuthorsPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const OrderTrackingPage = lazy(() => import('@/pages/OrderTrackingPage'));
const AdminOrdersPage = lazy(() => import('@/pages/AdminOrdersPage'));
const AdminCouponsPage = lazy(() => import('@/pages/AdminCouponsPage'));

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, getCurrentUser } from '@/redux/authSlice';

import toast from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading, token } = useSelector(selectAuth);
  
  // Nếu đang load hoặc có token nhưng chưa có user (đang fetch)
  if (loading || (token && !user)) return <PageLoader />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (role && !user?.roles?.includes(role)) {
    toast.error('Bạn không có quyền truy cập vào khu vực này!');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Placeholder pages (tạm thời cho các trang chưa build)
const PlaceholderPage = ({ title }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-surface">
    <h1 className="text-4xl font-black text-on-surface">{title}</h1>
    <p className="text-on-surface-variant font-medium">Trang này đang được phát triển theo Stitch design...</p>
    <a href="/" className="text-primary font-bold hover:underline">Quay về trang chủ</a>
  </div>
);

// Page Loading Skeleton
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
  </div>
);

import AIAssistant from '@/components/AIAssistant';
import { Toaster } from 'react-hot-toast';

// =====================================================
//  APP — Root Component
// =====================================================
function App() {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector(selectAuth);

  useEffect(() => {
    // Chỉ fetch user nếu có token, chưa có user và KHÔNG phải đang trong quá trình load (login)
    if (token && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Consumer Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/browse" element={<MainLayout><BrowsePage /></MainLayout>} />
            <Route path="/books/:slug" element={<MainLayout><BookDetailPage /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
            <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Account Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="ROLE_ADMIN"><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="books" element={<AdminBooksPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="analytics" element={<PlaceholderPage title="Thống kê chuyên sâu" />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
            
            {/* Other Placeholders */}
            <Route path="/authors" element={<MainLayout><AuthorsPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/categories" element={<MainLayout><CategoriesPage /></MainLayout>} />
            <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
            <Route path="/blog/:id" element={<MainLayout><BlogPostPage /></MainLayout>} />
            
            {/* Static Content Pages */}
            <Route path="/about" element={<MainLayout><StaticPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><StaticPage /></MainLayout>} />
            <Route path="/privacy-policy" element={<MainLayout><StaticPage /></MainLayout>} />
            <Route path="/terms-of-service" element={<MainLayout><StaticPage /></MainLayout>} />
            <Route path="/shipping-returns" element={<MainLayout><StaticPage /></MainLayout>} />
            <Route path="/faqs" element={<MainLayout><StaticPage /></MainLayout>} />

            {/* 404 */}
            <Route path="*" element={<MainLayout><PlaceholderPage title="404 — Không tìm thấy trang" /></MainLayout>} />
          </Routes>
          <AIAssistant />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
