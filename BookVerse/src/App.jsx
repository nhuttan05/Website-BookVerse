import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import MainLayout from '@/layout/MainLayout';

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

// =====================================================
//  APP — Root Component
// =====================================================
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Consumer Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/browse" element={<MainLayout><BrowsePage /></MainLayout>} />
            <Route path="/books/:slug" element={<MainLayout><BookDetailPage /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
            <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
            <Route path="/checkout" element={<CheckoutPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Account Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Other Placeholders */}
            <Route path="/categories" element={<MainLayout><CategoriesPage /></MainLayout>} />
            <Route path="/blog" element={<MainLayout><PlaceholderPage title="Nhật ký BookVerse" /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

            {/* 404 */}
            <Route path="*" element={<MainLayout><PlaceholderPage title="404 — Không tìm thấy trang" /></MainLayout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
