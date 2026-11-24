import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { AdminLoaderProvider } from './contexts/AdminLoaderContext';
import { AdminToastProvider } from './contexts/AdminToastContext';
import { DiamondDotsSpinner } from './components/AdminMotion';
import AdminLayout from './layouts/AdminLayout';
import AdminSignInPage from './pages/AdminSignInPage';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';
import Blog from './pages/Blog';
import BlogPostForm from './pages/BlogPostForm';
import PromotionalBanners from './pages/PromotionalBanners';
import PromotionalBannerForm from './pages/PromotionalBannerForm';
import GeminiLogoShowcase from './pages/GeminiLogoShowcase';
import FaviconManagement from './pages/FaviconManagement';
import StorageManager from './pages/StorageManager';
import ErrorBoundary from '../components/ErrorBoundary';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#0f172a] flex flex-col items-center justify-center gap-3.5">
        <DiamondDotsSpinner size="lg" tone="amber" label="Restoring admin session" />
        <p className="text-xs font-medium text-slate-400 tracking-wide">Restoring admin session...</p>
      </div>
    );
  }

  const isAdmin = user && (
    user.email.toLowerCase() === 'admin@tiqsey.com' ||
    user.email.toLowerCase() === 'superadmin@tiqsey.com' ||
    user.email.toLowerCase() === 'bigbakket@gmail.com' ||
    user.role === 'admin'
  );

  if (!isAdmin) {
    return <AdminSignInPage />;
  }

  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <MotionConfig reducedMotion="user">
      <AdminLoaderProvider>
        <AdminToastProvider>
          <BrowserRouter basename="/secure-panel">
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<RequireAdmin><Navigate to="/" replace /></RequireAdmin>} />
                <Route path="/" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                  <Route index element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="inventory/edit/:id" element={<Inventory />} />
                  <Route path="inventory/new" element={<Inventory />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/new" element={<BlogPostForm />} />
                  <Route path="blog/:id" element={<BlogPostForm />} />
                  <Route path="promotional-banners" element={<PromotionalBanners />} />
                  <Route path="promotional-banners/new" element={<PromotionalBannerForm />} />
                  <Route path="promotional-banners/edit/:id" element={<PromotionalBannerForm />} />
                  <Route path="favicon" element={<FaviconManagement />} />
                  <Route path="storage" element={<StorageManager />} />
                  <Route path="custom-domain" element={<Navigate to="/" replace />} />
                  <Route path="website/domain" element={<Navigate to="/" replace />} />
                  <Route path="gemini-logo" element={<GeminiLogoShowcase />} />
                  {/* Catch-all redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AdminToastProvider>
      </AdminLoaderProvider>
    </MotionConfig>
  );
}
