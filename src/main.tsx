import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './admin/AdminApp.tsx';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { BlogProvider } from './contexts/BlogContext';
import { HelmetProvider } from 'react-helmet-async';
import { fetchActiveFavicon, applyFaviconToDocument, FAVICON_STORAGE_KEY } from './utils/faviconManager';
import ErrorBoundary from './components/ErrorBoundary';

function Root() {
  const isBlockedAdminPath = /^\/admin(\/|$)/i.test(window.location.pathname);
  const isAdminRoute = window.location.pathname.startsWith('/secure-panel');

  // Set page title to 404 Not Found when accessing blocked /admin paths
  useEffect(() => {
    if (isBlockedAdminPath) {
      document.title = '404 Not Found';
    }
  }, [isBlockedAdminPath]);

  // Synchronize and apply live dynamic favicon across the entire application and tabs
  useEffect(() => {
    if (isBlockedAdminPath) return;
    fetchActiveFavicon().then(applyFaviconToDocument).catch(() => {});

    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVICON_STORAGE_KEY && e.newValue) {
        try {
          applyFaviconToDocument(JSON.parse(e.newValue));
        } catch (_) {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isBlockedAdminPath]);

  if (isBlockedAdminPath) {
    return (
      <div className="min-h-screen w-full bg-white text-[#444444] flex flex-col items-center justify-center text-center px-6 font-sans">
        <h1 className="text-[120px] sm:text-[150px] leading-none font-bold tracking-tight text-[#444444]">
          404
        </h1>
        <h2 className="mt-5 mb-3 text-[26px] sm:text-[30px] font-bold text-[#444444]">
          Not Found
        </h2>
        <p className="text-sm text-[#555555]">
          The resource requested could not be found on this server!
        </p>
      </div>
    );
  }
  
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <WishlistProvider>
            <BlogProvider>
              {isAdminRoute ? <AdminApp /> : <ErrorBoundary><App /></ErrorBoundary>}
            </BlogProvider>
          </WishlistProvider>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
