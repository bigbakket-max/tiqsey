import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Globe, 
  LogOut,
  X,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Box,
  FileText,
  Text,
  PlaneTakeoff,
  Menu,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  HardDrive,
  Ticket,
  Megaphone,
  Palette,
  CreditCard,
  BarChart3,
  Headphones,
  Settings,
  Tag,
  Sliders,
  LayoutList,
  LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { ADMIN_EASE } from '../components/AdminMotion';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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
        setShowUserMenu(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close header popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showUserMenu]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = globalSearch.trim();
    if (!query) return;

    const lower = query.toLowerCase();
    if (
      lower.startsWith('tiq-') ||
      lower.startsWith('ord-') ||
      lower.startsWith('od') ||
      lower.startsWith('bk') ||
      lower.startsWith('pnr') ||
      lower.startsWith('tqx-')
    ) {
      navigate(`/bookings?search=${encodeURIComponent(query)}`);
    } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('code')) {
      navigate(`/marketing/coupons`);
    } else if (lower.includes('banner') || lower.includes('promo')) {
      navigate(`/promotional-banners`);
    } else if (lower.includes('customer') || lower.includes('guest')) {
      navigate(`/customers`);
    } else if (lower.includes('favicon') || lower.includes('logo') || lower.includes('icon')) {
      navigate(`/favicon`);
    } else if (lower.includes('theme')) {
      navigate(`/appearance/theme`);
    } else if (lower.includes('menu') || lower.includes('nav')) {
      navigate(`/appearance/menus`);
    } else if (lower.includes('website') || lower.includes('seo')) {
      navigate(`/appearance/website`);
    } else if (lower.includes('payment') || lower.includes('receipt') || lower.includes('payout')) {
      navigate(`/payments`);
    } else if (lower.includes('report') || lower.includes('revenue')) {
      navigate(`/reports`);
    } else if (lower.includes('agent') || lower.includes('analytic')) {
      navigate(`/analytics`);
    } else if (lower.includes('support') || lower.includes('ticket') || lower.includes('help')) {
      navigate(`/support`);
    } else if (lower.includes('setting') || lower.includes('currency') || lower.includes('tax')) {
      navigate(`/settings`);
    } else if (lower.includes('storage') || lower.includes('bucket') || lower.includes('media')) {
      navigate(`/storage`);
    } else if (lower.includes('blog') || lower.includes('post')) {
      navigate(`/blog`);
    } else {
      navigate(`/inventory?search=${encodeURIComponent(query)}`);
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard' || path === '') {
      return [{ name: 'Dashboard', icon: Home, path: '/' }];
    }
    const crumbs: Array<{ name: string; icon: typeof Home | undefined; path: string }> = [
      { name: 'Dashboard', icon: Home, path: '/' },
    ];
    if (path.includes('/bookings') || path.includes('/orders')) {
      crumbs.push({ name: 'Bookings', icon: undefined, path: '/bookings' });
      const searchParams = new URLSearchParams(location.search);
      const orderId = searchParams.get('orderId');
      if (orderId) {
        crumbs.push({ name: orderId, icon: undefined, path: `/bookings?orderId=${orderId}` });
      }
    } else if (path.includes('/inventory') || path.includes('/activities') || path.includes('/products')) {
      crumbs.push({ name: 'Activities', icon: undefined, path: '/inventory' });
      if (path.includes('/edit/')) {
        crumbs.push({ name: 'Edit Activity', icon: undefined, path });
      } else if (path.includes('/new')) {
        crumbs.push({ name: 'New Activity', icon: undefined, path });
      }
    } else if (path.includes('/customers')) {
      crumbs.push({ name: 'Customers', icon: undefined, path: '/customers' });
    } else if (path.includes('/promotional-banners') || path.includes('/marketing')) {
      crumbs.push({ name: 'Marketing', icon: undefined, path: '/promotional-banners' });
      if (path.includes('/marketing/coupons')) {
        crumbs.push({ name: 'Coupons & Promos', icon: undefined, path: '/marketing/coupons' });
      } else if (path.includes('/promotional-banners')) {
        crumbs.push({ name: 'Promotional Banners', icon: undefined, path: '/promotional-banners' });
        if (path.includes('/new')) {
          crumbs.push({ name: 'New Banner', icon: undefined, path: '/promotional-banners/new' });
        } else if (path.includes('/edit/')) {
          crumbs.push({ name: 'Edit Banner', icon: undefined, path });
        }
      }
    } else if (path.includes('/blog') || path.includes('/storage')) {
      crumbs.push({ name: 'Content', icon: undefined, path: '/blog' });
      if (path.includes('/blog')) {
        crumbs.push({ name: 'Blog', icon: undefined, path: '/blog' });
        if (path.includes('/new')) {
          crumbs.push({ name: 'New Post', icon: undefined, path: '/blog/new' });
        } else if (path.match(/\/blog\/[^/]+$/)) {
          crumbs.push({ name: 'Edit Post', icon: undefined, path });
        }
      } else if (path.includes('/storage')) {
        crumbs.push({ name: 'Storage', icon: undefined, path: '/storage' });
      }
    } else if (path.includes('/appearance') || path.includes('/favicon')) {
      crumbs.push({ name: 'Appearance', icon: undefined, path: '/appearance/website' });
      if (path.includes('/favicon')) {
        crumbs.push({ name: 'Logo & Favicon', icon: undefined, path: '/favicon' });
      } else if (path.includes('/appearance/theme')) {
        crumbs.push({ name: 'Theme Settings', icon: undefined, path: '/appearance/theme' });
      } else if (path.includes('/appearance/menus')) {
        crumbs.push({ name: 'Menus', icon: undefined, path: '/appearance/menus' });
      } else {
        crumbs.push({ name: 'Website Settings', icon: undefined, path: '/appearance/website' });
      }
    } else if (path.includes('/payments')) {
      crumbs.push({ name: 'Payments', icon: undefined, path: '/payments' });
    } else if (path.includes('/reports') || path.includes('/analytics')) {
      crumbs.push({ name: 'Reports', icon: undefined, path: '/reports' });
      if (path.includes('/analytics')) {
        crumbs.push({ name: 'Agents & Analytics', icon: undefined, path: '/analytics' });
      } else {
        crumbs.push({ name: 'Business Reports', icon: undefined, path: '/reports' });
      }
    } else if (path.includes('/support')) {
      crumbs.push({ name: 'Support', icon: undefined, path: '/support' });
    } else if (path.includes('/settings')) {
      crumbs.push({ name: 'Settings', icon: undefined, path: '/settings' });
    } else if (path.includes('/gemini-logo')) {
      crumbs.push({ name: 'Brand Assets', icon: undefined, path: '/gemini-logo' });
    }
    return crumbs;
  };

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    marketing: false,
    content: false,
    appearance: true,
    reports: false,
  });

  // Auto-expand the matching sidebar section when navigating to a nested route
  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith('/promotional-banners') || p.startsWith('/marketing')) {
      setExpandedMenus((prev) => (prev.marketing ? prev : { ...prev, marketing: true }));
    } else if (p.startsWith('/blog') || p.startsWith('/storage')) {
      setExpandedMenus((prev) => (prev.content ? prev : { ...prev, content: true }));
    } else if (p.startsWith('/appearance') || p.startsWith('/favicon')) {
      setExpandedMenus((prev) => (prev.appearance ? prev : { ...prev, appearance: true }));
    } else if (p.startsWith('/reports') || p.startsWith('/analytics')) {
      setExpandedMenus((prev) => (prev.reports ? prev : { ...prev, reports: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = window.location.hostname.includes('tiqsey.com') ? 'https://tiqsey.com' : '/';
  };

  const renderSidebarContent = (collapsed: boolean, isMobile: boolean) => (
    <div className="flex-1 flex flex-col min-h-0 select-none">
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#0b1120]/40 via-transparent to-[#020617]/50">
        {/* 1. Dashboard */}
        <NavLink
          to="/"
          end
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Dashboard" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <Home className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Dashboard
              </span>
            </>
          )}
        </NavLink>

        {/* 2. Bookings */}
        <NavLink
          to="/bookings"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Bookings" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <Calendar className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Bookings
              </span>
            </>
          )}
        </NavLink>

        {/* 3. Activities */}
        <NavLink
          to="/inventory"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Activities" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <Ticket className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Activities
              </span>
            </>
          )}
        </NavLink>

        {/* 4. Customers */}
        <NavLink
          to="/customers"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Customers" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <Users className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Customers
              </span>
            </>
          )}
        </NavLink>

        {/* 5. Marketing (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, marketing: true }));
              } else {
                toggleMenu('marketing');
              }
            }}
            title={collapsed ? "Marketing" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.marketing && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Megaphone className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Marketing
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.marketing ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>

          <AnimatePresence initial={false}>
            {expandedMenus.marketing && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-7 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/promotional-banners"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-amber-200 font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-amber-500/20 border border-amber-400/35 pointer-events-none"
                        />
                      )}
                      <Sparkles className="relative z-10 w-3.5 h-3.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Promotional Banners</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/marketing/coupons"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <Tag className="relative z-10 w-3.5 h-3.5 shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Coupons & Promos</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Content (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, content: true }));
              } else {
                toggleMenu('content');
              }
            }}
            title={collapsed ? "Content" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.content && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Content
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.content ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>

          <AnimatePresence initial={false}>
            {expandedMenus.content && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-7 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <Text className="relative z-10 w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">Blog</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/storage"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-emerald-200 font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-emerald-500/20 border border-emerald-400/35 pointer-events-none"
                        />
                      )}
                      <HardDrive className="relative z-10 w-3.5 h-3.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">Storage</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 7. Appearance (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, appearance: true }));
              } else {
                toggleMenu('appearance');
              }
            }}
            title={collapsed ? "Appearance" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.appearance && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Palette className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Appearance
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.appearance ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>

          <AnimatePresence initial={false}>
            {expandedMenus.appearance && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-7 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/appearance/website"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <Globe className="relative z-10 w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Website Settings</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/favicon"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <ImageIcon className="relative z-10 w-3.5 h-3.5 shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Logo & Favicon</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/appearance/theme"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <Sliders className="relative z-10 w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Theme Settings</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/appearance/menus"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <LayoutList className="relative z-10 w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">Menus</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 8. Payments */}
        <NavLink
          to="/payments"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Payments" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <CreditCard className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Payments
              </span>
            </>
          )}
        </NavLink>

        {/* 9. Reports (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, reports: true }));
              } else {
                toggleMenu('reports');
              }
            }}
            title={collapsed ? "Reports" : undefined}
            className={`flex items-center transition-all duration-150 text-sm cursor-pointer w-full group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'justify-between px-3 py-2 rounded-xl'
            } ${
              expandedMenus.reports && !collapsed
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BarChart3 className="w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Reports
              </span>
            </div>
            {!collapsed && (
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${expandedMenus.reports ? 'rotate-90' : 'rotate-0'}`} />
            )}
          </button>

          <AnimatePresence initial={false}>
            {expandedMenus.reports && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-7 pr-1 py-0.5 space-y-0.5"
              >
                <NavLink
                  to="/reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <BarChart3 className="relative z-10 w-3.5 h-3.5 shrink-0 text-current group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Business Reports</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/35 pointer-events-none"
                        />
                      )}
                      <LineChart className="relative z-10 w-3.5 h-3.5 shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 truncate">Agents & Analytics</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 10. Support */}
        <NavLink
          to="/support"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Support" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <Headphones className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Support
              </span>
            </>
          )}
        </NavLink>

        {/* 11. Settings */}
        <NavLink
          to="/settings"
          onClick={() => setMobileMenuOpen(false)}
          title={collapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `relative flex items-center transition-all duration-150 text-sm group ${
              collapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : `w-full gap-2.5 px-3 ${isMobile ? 'py-2.5' : 'py-2'} rounded-xl`
            } ${
              isActive 
                ? 'text-white font-bold' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium active:scale-[0.98]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'admin-mobile-active-nav' : 'admin-desktop-active-nav'}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-sky-500/20 border border-sky-400/40 shadow-xs shadow-sky-500/10 pointer-events-none"
                />
              )}
              <Settings className="relative z-10 w-4.5 h-4.5 shrink-0 text-current transition-transform duration-150 group-hover:scale-110" />
              <span className={`relative z-10 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                Settings
              </span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );

  return (
    <div className="tiqsey-admin-shell flex flex-col h-[100dvh] bg-[#F8F9FC] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 md:h-13 bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#0284c7] dark:from-[#0f172a] dark:via-[#1e3a5f] dark:to-[#0284c7] border-b border-white/20 dark:border-slate-800 flex items-center justify-between px-3 sm:px-4 lg:px-6 z-30 shrink-0 relative shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="w-10 h-10 flex items-center justify-center text-blue-100 hover:text-white md:hidden hover:bg-white/10 rounded-xl shrink-0 cursor-pointer active:scale-95"
          >
            <Menu className="w-5 h-5" strokeWidth={2.2} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-white shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs shadow-inner">
              <PlaneTakeoff className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>
            <span className="text-base sm:text-lg font-black tracking-wider text-white">TIQSEY</span>
          </div>

          {/* Desktop Sidebar Toggle */}
          <button 
            onClick={() => setSidebarCollapsed(!isCollapsed)}
            className="p-1.5 text-blue-100 hover:text-white hidden md:flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-150 shrink-0 cursor-pointer active:scale-95"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Global Search Bar (Desktop) */}
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
        <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !mobileSearchOpen;
              setMobileSearchOpen(next);
              if (next) {
                setTimeout(() => mobileSearchInputRef.current?.focus(), 60);
              }
            }}
            aria-label="Toggle search"
            className="md:hidden w-10 h-10 flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer active:scale-95"
          >
            {mobileSearchOpen ? <X className="w-4.5 h-4.5" /> : <Search className="w-4.5 h-4.5" />}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 min-h-[38px] rounded-xl text-xs font-bold text-white bg-white/15 hover:bg-white/25 transition-all duration-150 border border-white/25 shadow-xs hover:shadow-sm active:scale-95"
            title="Open Live Public Website in New Tab"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="w-3 h-3 opacity-70 hidden sm:inline" />
          </a>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              type="button"
              onClick={() => {
                setShowUserMenu(false);
                setShowNotifications(!showNotifications);
              }}
              aria-label="Notifications"
              className="relative w-10 h-10 flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150 cursor-pointer active:scale-95"
              title="Notifications"
            >
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#2563eb]" />
              <Bell className="w-4.5 h-4.5" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] max-w-[340px] sm:w-84 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      System Updates & Alerts
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 font-mono">
                      2 Active
                    </span>
                  </div>
                  <div className="py-2.5 space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 transition-colors">
                      <p className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        Promotional Banners Live
                      </p>
                      <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-1">Ready-made graphics and interactive coupons are active on the storefront.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 transition-colors">
                      <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Inventory Catalog Synced
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">All tour products, variants, and pricing tiers synchronized with storage.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Account & Logout Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications(false);
                setShowUserMenu(!showUserMenu);
              }}
              aria-label="Admin account menu"
              aria-expanded={showUserMenu}
              className="inline-flex items-center gap-2 pl-1.5 pr-2 sm:pr-2.5 min-h-[38px] rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all duration-150 shadow-xs hover:shadow-sm cursor-pointer active:scale-95"
              title={`${user?.name || 'System Admin'} (Super Admin)`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 ring-1 ring-white/30 shadow-xs">
                {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SA'}
              </div>
              <div className="hidden lg:flex flex-col items-start leading-tight text-left max-w-[120px]">
                <span className="text-xs font-bold text-white truncate w-full">
                  {user?.name || 'System Admin'}
                </span>
                <span className="text-[10px] text-blue-100/90 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Super Admin
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/80 transition-transform duration-150 shrink-0 ${
                  showUserMenu ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] max-w-[260px] sm:w-60 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5 bg-slate-50/70 dark:bg-slate-800/40">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SA'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user?.name || 'System Admin'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'admin@tiqsey.com'}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Super Admin
                      </p>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Account Settings</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Expandable Mobile Global Search Bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2.5 z-20 overflow-hidden shrink-0"
          >
            <form
              onSubmit={(e) => {
                handleGlobalSearch(e);
                setMobileSearchOpen(false);
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Search PNR, order, product, blog..."
                />
              </div>
              <button
                type="submit"
                className="min-h-[42px] px-4 bg-blue-600 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
              >
                Go
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="min-h-[36px] py-1.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 px-3 sm:px-4 lg:px-8 shrink-0 shadow-xs">
            <nav className="flex text-xs font-medium text-slate-500 overflow-x-auto no-scrollbar min-w-0" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-1.5 whitespace-nowrap">
                {getBreadcrumbs().map((crumb, index) => (
                  <li key={crumb.name} className="inline-flex items-center">
                    {index > 0 && <ChevronRight className="w-3 h-3 mx-1 text-slate-400 shrink-0" />}
                    <NavLink 
                      to={crumb.path}
                      className={`flex items-center gap-1 transition-colors duration-150 ${
                        index === getBreadcrumbs().length - 1 
                          ? 'text-slate-900 dark:text-white font-semibold pointer-events-none' 
                          : 'hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer'
                      }`}
                    >
                      {crumb.icon && <crumb.icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      <span className="capitalize">{crumb.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Catalog Active</span>
            </div>
          </div>

          {/* Page Content with Smooth Animated Route Transitions */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 pb-24 md:pb-8 lg:pt-5 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: ADMIN_EASE }}
                className="w-full min-w-0"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Admin Mobile Bottom Quick-Nav Bar */}
          <nav
            aria-label="Admin mobile quick navigation"
            className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="grid grid-cols-5 h-16 px-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl text-[10px] font-bold transition-colors ${
                    isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl text-[10px] font-bold transition-colors ${
                    isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <Box className="w-5 h-5" />
                <span>Products</span>
              </NavLink>
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl text-[10px] font-bold transition-colors ${
                    isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <FileText className="w-5 h-5" />
                <span>Bookings</span>
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl text-[10px] font-bold transition-colors ${
                    isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <Text className="w-5 h-5" />
                <span>Blog</span>
              </NavLink>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <Menu className="w-5 h-5" />
                <span>Menu</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
