import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLoaderProvider } from './contexts/AdminLoaderContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';
import Blog from './pages/Blog';
import BlogPostForm from './pages/BlogPostForm';
import PromotionalBanners from './pages/PromotionalBanners';
import PromotionalBannerForm from './pages/PromotionalBannerForm';
import GeminiLogoShowcase from './pages/GeminiLogoShowcase';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const isAdmin = user && (
    user.email.toLowerCase() === 'admin@tiqsey.com' ||
    user.email.toLowerCase() === 'bigbakket@gmail.com'
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F9] dark:bg-slate-950 p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#5fa6d9]/10 dark:bg-[#5fa6d9]/20 text-[#5fa6d9] rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">403 Forbidden</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Access Denied. Only authenticated administrators can access the admin dashboard.
            </p>
          </div>
          <div className="pt-2">
            <a 
              href="/" 
              className="inline-flex w-full justify-center items-center gap-2 py-3 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition-colors text-sm shadow-sm cursor-pointer"
              id="return-home-link"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <AdminLoaderProvider>
      <BrowserRouter basename="/admin">
        <Routes>
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
            <Route path="gemini-logo" element={<GeminiLogoShowcase />} />
            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminLoaderProvider>
  );
}
