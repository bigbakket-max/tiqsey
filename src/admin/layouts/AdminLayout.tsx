import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Calendar, 
  Users, 
  Globe, 
  LogOut,
  X,
  Search,
  Bell,
  ChevronRight,
  Box,
  FileText,
  Text,
  PlaneTakeoff,
  Menu,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminLoader } from '../contexts/AdminLoaderContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { showLoader, hideLoader } = useAdminLoader();

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => hideLoader(), 300);
    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, [location.pathname]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isCollapsed = sidebarCollapsed;

  // Global keyboard shortcut for search (Cmd+K or Ctrl+K) & Escape to close popovers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setShowNotifications(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = globalSearch.trim();
    if (!query) return;

    if (query.toLowerCase().startsWith('tiq-') || query.toLowerCase().startsWith('ord-') || query.toLowerCase().startsWith('pnr')) {
      navigate(`/bookings?search=${encodeURIComponent(query)}`);
    } else if (query.toLowerCase().includes('banner') || query.toLowerCase().includes('promo')) {
      navigate(`/promotional-banners`);
    } else if (query.toLowerCase().includes('favicon') || query.toLowerCase().includes('icon')) {
      navigate(`/favicon`);
    } else if (query.toLowerCase().includes('blog') || query.toLowerCase().includes('post')) {
      navigate(`/blog`);
    } else {
      navigate(`/inventory?search=${encodeURIComponent(query)}`);
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard' || path === '') {
      return [{ name: 'Home', icon: Home, path: '/' }];
    }
    const crumbs = [{ name: 'Home', icon: Home, path: '/' }];
    if (path.includes('/inventory') || path.includes('/activities') || path.includes('/products')) {
      crumbs.push({ name: 'Activities', icon: undefined, path: '/inventory' });
      if (path.includes('/inventory')) {
        crumbs.push({ name: 'Products', icon: undefined, path: '/inventory' });
        if (path.includes('/edit/')) {
          crumbs.push({ name: 'Edit Product', icon: undefined, path: path });
        } else if (path.includes('/new')) {
          crumbs.push({ name: 'New Product', icon: undefined, path: path });
        }
      }
    } else if (path.includes('/bookings') || path.includes('/orders')) {
      crumbs.push({ name: 'Bookings', icon: undefined, path: '/bookings' });
      crumbs.push({ name: 'Orders', icon: undefined, path: '/bookings' });
      const searchParams = new URLSearchParams(location.search);
      const orderId = searchParams.get('orderId');
      if (orderId) {
        crumbs.push({ name: orderId, icon: undefined, path: `/bookings?orderId=${orderId}` });
      }
    } else if (path.includes('/analytics') || path.includes('/agents')) {
      crumbs.push({ name: 'Agents', icon: undefined, path: '/analytics' });
    } else if (path.includes('/blog') || path.includes('/promotional-banners') || path.includes('/favicon') || path.includes('/website')) {
      crumbs.push({ name: 'Website', icon: undefined, path: '/blog' });
      if (path.includes('/blog')) {
        crumbs.push({ name: 'Blog', icon: undefined, path: '/blog' });
        if (path.includes('/new')) {
          crumbs.push({ name: 'New Post', icon: undefined, path: '/blog/new' });
        } else if (path.match(/\/blog\/[a-zA-Z0-9-]+$/)) {
          crumbs.push({ name: 'Edit Post', icon: undefined, path: path });
        }
      } else if (path.includes('/promotional-banners')) {
        crumbs.push({ name: 'Promotional Banners', icon: undefined, path: '/promotional-banners' });
        if (path.includes('/new')) {
          crumbs.push({ name: 'New Banner', icon: undefined, path: '/promotional-banners/new' });
        } else if (path.includes('/edit/')) {
          crumbs.push({ name: 'Edit Banner', icon: undefined, path: path });
        }
      } else if (path.includes('/favicon')) {
        crumbs.push({ name: 'Favicon', icon: undefined, path: '/favicon' });
      }
    }
    return crumbs;
  };

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    activities: true,
    bookings: true,
    website: true
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = window.location.hostname.includes('tiqsey.com') ? 'https://tiqsey.com' : '/';
  };

  const renderSidebarContent = (collapsed: boolean, isMobile: boolean) => (
    <div className="flex-1 flex flex-col min-h-0 select-none">
      <nav className="flex-1 px-2.5 py-3 space-y-1.5 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#0b1120]/40 via-transparent to-[#020617]/50">
        {/* Home Nav */}
        <NavLink
          to="/"
          end
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Home" : undefined}
          className={({ isActive }) =>
            `flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'w-full gap-2.5 px-3 py-2 rounded-xl'
            } ${
              isActive 
                ? 'bg-sky-500/20 text-white font-bold border border-sky-400/40 shadow-xs shadow-sky-500/10' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          <Home className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
          <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
            Home
          </span>
        </NavLink>

        {/* Activities Menu */}
        <div>
          <button 
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, activities: true }));
              } else {
                toggleMenu('activities');
              }
            }}
            title={collapsed ? "Activities" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.activities && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Map className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Activities
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.activities ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedMenus.activities && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-8 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/inventory"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'bg-sky-500/20 text-white font-bold border-l-2 border-sky-400 pl-2.5' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  <Box className="w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                  <span>Products</span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookings Menu */}
        <div>
          <button 
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, bookings: true }));
              } else {
                toggleMenu('bookings');
              }
            }}
            title={collapsed ? "Bookings" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.bookings && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Bookings
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.bookings ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedMenus.bookings && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-8 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'bg-sky-500/20 text-white font-bold border-l-2 border-sky-400 pl-2.5' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                  <span>Orders</span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agents Link */}
        <NavLink
          to="/analytics"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Agents" : undefined}
          className={({ isActive }) =>
            `flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'w-full gap-2.5 px-3 py-2 rounded-xl'
            } ${
              isActive 
                ? 'bg-sky-500/20 text-white font-bold border border-sky-400/40 shadow-xs shadow-sky-500/10' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          <Users className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
          <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
            Agents
          </span>
        </NavLink>

        {/* Website Menu */}
        <div>
          <button 
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, website: true }));
              } else {
                toggleMenu('website');
              }
            }}
            title={collapsed ? "Website" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.website && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Website
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.website ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedMenus.website && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-8 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'bg-sky-500/20 text-white font-bold border-l-2 border-sky-400 pl-2.5' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  <Text className="w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                  <span>Blog</span>
                </NavLink>

                <NavLink
                  to="/promotional-banners"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'bg-amber-500/20 text-amber-200 font-bold border-l-2 border-amber-400 pl-2.5' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Promotional Banners</span>
                </NavLink>

                <NavLink
                  to="/favicon"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'bg-sky-500/20 text-white font-bold border-l-2 border-sky-400 pl-2.5' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Favicon</span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Logout button */}
      <div className="p-2 border-t border-slate-800/60">
        <button 
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center transition-all duration-150 text-sm cursor-pointer group ${
            collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'w-full gap-2.5 px-3 py-2 rounded-xl'
          } text-slate-300 hover:bg-rose-500/10 hover:text-rose-300 font-medium active:scale-[0.98]`}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
          <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
            Logout
          </span>
        </button>
      </div>

      {/* User profile capsule */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
            title={collapsed ? `${user?.name || 'Administrator'} (Super Admin)` : undefined}
          >
            {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'AD'}
          </div>
          <div className={`flex-1 min-w-0 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10.5px] text-slate-400 truncate flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FC] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Top Header */}
      <header className="h-13 bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#0284c7] dark:from-[#0f172a] dark:via-[#1e3a5f] dark:to-[#0284c7] border-b border-white/20 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 z-30 shrink-0 relative shadow-sm">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-white shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs shadow-inner">
              <PlaneTakeoff className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-wider text-white">TIQSEY</span>
          </div>

          {/* Desktop Sidebar Toggle */}
          <button 
            onClick={() => setSidebarCollapsed(!isCollapsed)}
            className="p-1.5 text-blue-100 hover:text-white hidden md:flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-150 shrink-0 cursor-pointer active:scale-95"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" strokeWidth={2.2} />
          </button>

          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-blue-100 md:hidden hover:bg-white/10 rounded-lg shrink-0 cursor-pointer active:scale-95"
          >
            <Menu className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 max-w-md w-full hidden md:block px-4">
          <form onSubmit={handleGlobalSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="block w-full pl-9 pr-14 py-1.5 border border-white/25 rounded-xl leading-5 bg-white/95 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white text-xs transition-all duration-150 shadow-xs group-hover:bg-white"
              placeholder="Search PNR, order ID, product name, or blogs..."
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 relative">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-white/15 hover:bg-white/25 transition-all duration-150 border border-white/25 shadow-xs hover:shadow-sm active:scale-95"
            title="Open Live Public Website in New Tab"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150 cursor-pointer active:scale-95"
              title="Notifications"
            >
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#2563eb]" />
              <Bell className="w-4.5 h-4.5" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 w-84 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      System Updates & Alerts
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 font-mono">
                      3 Active
                    </span>
                  </div>
                  <div className="py-2.5 space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 transition-colors">
                      <p className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        Promotional Banners Live
                      </p>
                      <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-1">Ready-made graphics and interactive coupons are active on the storefront.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 transition-colors">
                      <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Inventory Catalog Synced
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">All tour products, variants, and pricing tiers synchronized with storage.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Shell Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Smooth Collapsible Sidebar */}
        <aside 
          className={`bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#020617] dark:from-[#020617] dark:via-[#0b1120] dark:to-[#020617] hidden md:flex flex-col h-full shrink-0 shadow-lg border-r border-slate-800/60 transition-[width] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCollapsed ? 'w-18' : 'w-56'
          }`}
        >
          {renderSidebarContent(isCollapsed, false)}
        </aside>

        {/* Mobile Sidebar Overlay with Smooth Slide & Fade */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
                onClick={() => setMobileMenuOpen(false)} 
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-64 max-w-[85%] h-full bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#020617] flex flex-col shadow-2xl z-10"
              >
                <div className="flex items-center justify-between p-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-sky-400" />
                    <span className="font-extrabold text-white text-base">TIQSEY ADMIN</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {renderSidebarContent(false, true)}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#F8F9FC] dark:bg-slate-950">
          {/* Breadcrumbs Bar */}
          <div className="h-9 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-xs">
            <nav className="flex text-xs font-medium text-slate-500" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-1.5">
                {getBreadcrumbs().map((crumb, index) => (
                  <li key={crumb.name} className="inline-flex items-center">
                    {index > 0 && <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />}
                    <NavLink 
                      to={crumb.path}
                      className={`flex items-center gap-1 transition-colors duration-150 ${
                        index === getBreadcrumbs().length - 1 
                          ? 'text-slate-900 dark:text-white font-semibold pointer-events-none' 
                          : 'hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer'
                      }`}
                    >
                      {crumb.icon && <crumb.icon className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="capitalize">{crumb.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Catalog Active</span>
            </div>
          </div>

          {/* Page Content with Smooth Animated Route Transitions */}
          <main className="flex-1 overflow-y-auto p-4 lg:pt-5 lg:pb-8 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
