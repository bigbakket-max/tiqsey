import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AdminApp from './admin/AdminApp.tsx';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { HelmetProvider } from 'react-helmet-async';
import {
  fetchActiveFavicon,
  applyFaviconToDocument,
  FAVICON_STORAGE_KEY,
} from './utils/faviconManager';

function AdminRoot() {
  useEffect(() => {
    fetchActiveFavicon().then(applyFaviconToDocument).catch(() => {});

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
  }, []);

  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <BlogProvider>
            <AdminApp basename="/" />
          </BlogProvider>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminRoot />
  </StrictMode>
);
