import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { BlogProvider } from './contexts/BlogContext';
import { HelmetProvider } from 'react-helmet-async';
import {
  fetchActiveFavicon,
  applyFaviconToDocument,
  FAVICON_STORAGE_KEY,
} from './utils/faviconManager';
import { syncPublicSiteConfigFromServer } from './utils/adminConfigClient';
import ErrorBoundary from './components/ErrorBoundary';

function PublicRoot() {
  const isBlockedAdminPath = /^\/(admin|secure-panel)(\/|$)/i.test(window.location.pathname);

  useEffect(() => {
    if (isBlockedAdminPath) {
      document.title = '404 Not Found';
    }
  }, [isBlockedAdminPath]);

  useEffect(() => {
    if (isBlockedAdminPath) return;
    fetchActiveFavicon().then(applyFaviconToDocument).catch(() => {});
    syncPublicSiteConfigFromServer().catch(() => {});

    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVICON_STORAGE_KEY && e.newValue) {
        try {
          applyFaviconToDocument(JSON.parse(e.newValue));
        } catch {
          // Ignore malformed storage updates
        }
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
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </BlogProvider>
          </WishlistProvider>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PublicRoot />
  </StrictMode>
);
