import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import BackendLogin from './pages/BackendLogin';
import BackendLayout from './layouts/BackendLayout';
import StaffManagement from './pages/StaffManagement';
import AuditLogs from './pages/AuditLogs';
import SqlEditor from './pages/SqlEditor';

// Reuse existing admin pages
import Dashboard from '../admin/pages/Dashboard';
import Inventory from '../admin/pages/Inventory';
import Bookings from '../admin/pages/Bookings';
import Analytics from '../admin/pages/Analytics';
import Blog from '../admin/pages/Blog';
import BlogPostForm from '../admin/pages/BlogPostForm';
import GeminiLogoShowcase from '../admin/pages/GeminiLogoShowcase';

export interface BackendUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'employee';
  department: string;
  status: string;
  last_login: string;
  created_at: string;
  two_factor_enabled: boolean;
}

interface BackendAuthContextType {
  token: string | null;
  user: BackendUser | null;
  loading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const BackendAuthContext = createContext<BackendAuthContextType | null>(null);

export function useBackendAuth() {
  const context = useContext(BackendAuthContext);
  if (!context) {
    throw new Error('useBackendAuth must be used within a BackendAuthProvider');
  }
  return context;
}

export function BackendAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('backend_token'));
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch('/api/backend/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token invalid or expired
        localStorage.removeItem('backend_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load backend profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    const res = await fetch('/api/backend/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Authentication failed');
    }

    const data = await res.json();
    if (rememberMe) {
      localStorage.setItem('backend_token', data.token);
    } else {
      // Store in standard session storage style, but React state manages it. 
      // For sandbox convenience, we keep it in localStorage but can clear on tab close or simply handle here.
      localStorage.setItem('backend_token', data.token);
    }
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/backend/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        console.error('Logout request error:', e);
      }
    }
    localStorage.removeItem('backend_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <BackendAuthContext.Provider value={{ token, user, loading, login, logout, refreshUser }}>
      {children}
    </BackendAuthContext.Provider>
  );
}

function RequireBackendAuth({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading, token } = useBackendAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] dark:bg-slate-950 p-4 select-none">
        <div className="relative bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center gap-3.5 min-w-[150px]">
          <div className="grid grid-cols-2 gap-2.5 p-1 animate-spin" style={{ animationDuration: '3.2s' }}>
            <div className="w-3.5 h-3.5 rounded-full bg-[#5fa6d9] shadow-sm shadow-[#5fa6d9]/60 animate-pulse" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#5fa6d9] shadow-sm shadow-[#5fa6d9]/60 animate-pulse [animation-delay:200ms]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#5fa6d9] shadow-sm shadow-[#5fa6d9]/60 animate-pulse [animation-delay:600ms]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#5fa6d9] shadow-sm shadow-[#5fa6d9]/60 animate-pulse [animation-delay:400ms]" />
          </div>
          <p className="text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/backend/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F9] dark:bg-slate-950 p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tight">403 Forbidden</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Access Denied. You do not have permissions to access this specific backend module.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={() => window.location.href = '/backend/dashboard'}
              className="inline-flex w-full justify-center items-center gap-2 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-sm shadow-sm cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function BackendApp() {
  return (
    <BackendAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect to backend dashboard from root if accessed */}
          <Route path="/" element={<Navigate to="/backend/dashboard" replace />} />

          {/* Secure Backend Login Page */}
          <Route path="/backend/login" element={<BackendLogin />} />

          {/* Secure staff portal layout */}
          <Route path="/backend" element={<RequireBackendAuth><BackendLayout /></RequireBackendAuth>}>
            <Route index element={<Navigate to="/backend/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Products (Inventory) Route - Super Admin, Admin, Manager, Employee */}
            <Route path="inventory" element={<Inventory />} />
            
            {/* Orders (Bookings) Route - Super Admin, Admin, Manager, Employee */}
            <Route path="bookings" element={<Bookings />} />
            
            {/* Analytics (Agents) Route - Super Admin, Admin, Manager */}
            <Route 
              path="analytics" 
              element={
                <RequireBackendAuth allowedRoles={['super_admin', 'admin', 'manager']}>
                  <Analytics />
                </RequireBackendAuth>
              } 
            />
            
            {/* Blog Posts - Super Admin, Admin, Manager, Employee */}
            <Route path="blog" element={<Blog />} />
            <Route path="blog/new" element={<BlogPostForm />} />
            <Route path="blog/:id" element={<BlogPostForm />} />
            <Route path="gemini-logo" element={<GeminiLogoShowcase />} />

            {/* Staff Management panel - Super Admin & Admin only */}
            <Route 
              path="users" 
              element={
                <RequireBackendAuth allowedRoles={['super_admin', 'admin']}>
                  <StaffManagement />
                </RequireBackendAuth>
              } 
            />

            {/* Audit Logs and Event Logs - Super Admin & Admin only */}
            <Route 
              path="logs" 
              element={
                <RequireBackendAuth allowedRoles={['super_admin', 'admin']}>
                  <AuditLogs />
                </RequireBackendAuth>
              } 
            />

            {/* SQL Editor - Super Admin & Admin only */}
            <Route 
              path="sql" 
              element={
                <RequireBackendAuth allowedRoles={['super_admin', 'admin']}>
                  <SqlEditor />
                </RequireBackendAuth>
              } 
            />
          </Route>

          {/* Catch all other backend paths and redirect to dashboard */}
          <Route path="*" element={<Navigate to="/backend/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </BackendAuthProvider>
  );
}
