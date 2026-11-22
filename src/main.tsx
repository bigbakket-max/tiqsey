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
  const isLegacyAdmin = window.location.pathname.startsWith('/admin');
  const isAdminRoute = window.location.pathname.startsWith('/secure-panel');

  // If navigating to old /admin, smoothly redirect to /secure-panel
  useEffect(() => {
    if (isLegacyAdmin) {
      const newPath = window.location.pathname.replace(/^\/admin/, '/secure-panel') + window.location.search + window.location.hash;
      window.location.replace(newPath);
    }
  }, [isLegacyAdmin]);

  // Synchronize and apply live dynamic favicon across the entire application and tabs
  useEffect(() => {
    if (isLegacyAdmin) return;
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
  }, [isLegacyAdmin]);

  if (isLegacyAdmin) {
    return null;
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
