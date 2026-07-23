import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Box,
  FileText,
  Text,
  PlaneTakeoff,
  Menu,
  AlignLeft,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminLoader } from '../contexts/AdminLoaderContext';
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isLoading, showLoader, hideLoader } = useAdminLoader();

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => hideLoader(), 400);
    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, [location.pathname]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isCollapsed = sidebarCollapsed;
  const getBreadcrumbs = () => {
    const path = location.pathname;
    // Default breadcrumb for root
    if (path === '/' || path === '/dashboard' || path === '') {
      return [{ name: 'Home', icon: Home, path: '/' }];
    }
    const crumbs = [{ name: 'Home', icon: Home, path: '/' }];
    // Mapping for common routes
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
    } else if (path.includes('/blog') || path.includes('/website')) {
      crumbs.push({ name: 'Website', icon: undefined, path: '/blog' });
      if (path.includes('/blog')) {
        crumbs.push({ name: 'Blog', icon: undefined, path: '/blog' });
        if (path.includes('/new')) {
          crumbs.push({ name: 'New Post', icon: undefined, path: '/blog/new' });
        } else if (path.match(/\/blog\/[a-zA-Z0-9-]+$/)) {
          crumbs.push({ name: 'Edit Post', icon: undefined, path: path });
        }
      }
    }
    return crumbs;
  };
  // State for collapsible menus
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
    window.location.href = '/';
  };
  const renderSidebarContent = (isCollapsed: boolean, isMobile: boolean) => (
    <>
      <div className={`flex-1 flex flex-col min-h-0 ${!isMobile ? 'border-r border-zinc-800/60' : ''}`}>
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          end
          onClick={() => setMobileMenuOpen(false)}
          title={isCollapsed ? "Home" : undefined}
          className={({ isActive }) =>
            `flex items-center transition-all text-sm group ${
              isCollapsed ? 'justify-center mx-auto w-9 h-9 rounded-md' : 'w-full gap-2.5 px-3 py-2 rounded-lg'
            } ${
              isActive 
                ? 'bg-white/15 text-white font-bold' 
                : 'text-slate-200 hover:bg-white/10 hover:text-white font-medium'
            }`
          }
        >
          <Home className="w-4.5 h-4.5 shrink-0 text-current group-hover:scale-105 transition-transform" />
          {!isCollapsed && <span>Home</span>}
        </NavLink>
        {/* Activities Menu */}
        <div>
          <button 
            onClick={() => {
              if (isCollapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, activities: true }));
              } else {
                toggleMenu('activities');
              }
            }}
            title={isCollapsed ? "Activities" : undefined}
            className={`flex items-center transition-all text-sm cursor-pointer w-full group ${
              isCollapsed ? 'justify-center mx-auto w-9 h-9 rounded-md' : 'justify-between px-3 py-2 rounded-lg'
            } ${
              expandedMenus.activities
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-200 hover:bg-white/10 hover:text-white font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Map className="w-4.5 h-4.5 shrink-0 text-current group-hover:scale-105 transition-transform" />
              {!isCollapsed && <span>Activities</span>}
            </div>
            {!isCollapsed && (expandedMenus.activities ? <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-white" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />)}
          </button>
          {expandedMenus.activities && !isCollapsed && (
            <div className="pl-9 pr-2 py-0.5 space-y-0.5">
              <NavLink
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13.5px] transition-colors group ${
                    isActive 
                      ? 'bg-white/10 text-white font-bold' 
                      : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                  }`
                }
              >
                <Box className="w-4 h-4 shrink-0 text-current group-hover:scale-105 transition-transform" />
                Products
              </NavLink>
            </div>
          )}
        </div>
        {/* Bookings Menu */}
        <div>
          <button 
            onClick={() => {
              if (isCollapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, bookings: true }));
              } else {
                toggleMenu('bookings');
              }
            }}
            title={isCollapsed ? "Bookings" : undefined}
            className={`flex items-center transition-all text-sm cursor-pointer w-full group ${
              isCollapsed ? 'justify-center mx-auto w-9 h-9 rounded-md' : 'justify-between px-3 py-2 rounded-lg'
            } ${
              expandedMenus.bookings
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-200 hover:bg-white/10 hover:text-white font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4.5 h-4.5 shrink-0 text-current group-hover:scale-105 transition-transform" />
              {!isCollapsed && <span>Bookings</span>}
            </div>
            {!isCollapsed && (expandedMenus.bookings ? <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-white" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />)}
          </button>
          {expandedMenus.bookings && !isCollapsed && (
            <div className="pl-9 pr-2 py-0.5 space-y-0.5">
              <NavLink
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13.5px] transition-colors group ${
                    isActive 
                      ? 'bg-white/10 text-white font-bold' 
                      : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                  }`
                }
              >
                <FileText className="w-4 h-4 shrink-0 text-current group-hover:scale-105 transition-transform" />
                Orders
              </NavLink>
            </div>
          )}
        </div>
        <NavLink
          to="/analytics"
          onClick={() => setMobileMenuOpen(false)}
          title={isCollapsed ? "Agents" : undefined}
          className={({ isActive }) =>
            `flex items-center transition-all text-sm group ${
              isCollapsed ? 'justify-center mx-auto w-9 h-9 rounded-md' : 'w-full gap-2.5 px-3 py-2 rounded-lg'
            } ${
              isActive 
                ? 'bg-white/15 text-white font-bold' 
                : 'text-slate-200 hover:bg-white/10 hover:text-white font-medium'
            }`
          }
        >
          <Users className="w-4.5 h-4.5 shrink-0 text-current group-hover:scale-105 transition-transform" />
          {!isCollapsed && <span>Agents</span>}
        </NavLink>
        {/* Website Menu */}
        <div>
          <button 
            onClick={() => {
              if (isCollapsed) {
                setSidebarCollapsed(false);
                setExpandedMenus(prev => ({ ...prev, website: true }));
              } else {
                toggleMenu('website');
              }
            }}
            title={isCollapsed ? "Website" : undefined}
            className={`flex items-center transition-all text-sm cursor-pointer w-full group ${
              isCollapsed ? 'justify-center mx-auto w-9 h-9 rounded-md' : 'justify-between px-3 py-2 rounded-lg'
            } ${
              expandedMenus.website
                ? 'text-white bg-white/10 font-bold'
                : 'text-slate-200 hover:bg-white/10 hover:text-white font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4.5 h-4.5 shrink-0 text-current group-hover:scale-105 transition-transform" />
              {!isCollapsed && <span>Website</span>}
            </div>
            {!isCollapsed && (expandedMenus.website ? <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-white" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />)}
          </button>
          {expandedMenus.website && !isCollapsed && (
            <div className="pl-9 pr-2 py-0.5 space-y-0.5">
              <NavLink
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13.5px] transition-colors group ${
                    isActive 
                      ? 'bg-white/10 text-white font-bold' 
                      : 'text-slate-300 hover:text-white font-medium hover:bg-white/5'
                  }`
                }
              >
                <Text className="w-4 h-4 shrink-0 text-current group-hover:scale-105 transition-transform" />
                Blog
              </NavLink>
            </div>
          )}
        </div>
      </nav>
      <div className="p-2.5">
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center transition-all text-sm cursor-pointer group ${
            isCollapsed ? 'justify-center mx-auto w-9 h-9 rounded-md' : 'w-full gap-2.5 px-3 py-2 rounded-lg'
          } text-slate-300 hover:bg-white/10 hover:text-white font-medium`}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 text-current group-hover:scale-105 transition-transform" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
      <div className="p-3 border-t border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded-full bg-[#5fa6d9]/20 text-[#5fa6d9] flex items-center justify-center font-bold text-xs shrink-0"
            title={isCollapsed ? `${user?.name || 'Jane Doe'} (Super Admin)` : undefined}
          >
            {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'JD'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Jane Doe'}</p>
              <p className="text-[10.5px] text-slate-400 truncate">Super Admin</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
  return (
    <div className="flex flex-col h-screen bg-[#F8F9FC] dark:bg-slate-950 font-sans">
      {/* Top Header */}
      <header className="h-12 bg-[#5fa6d9] dark:bg-[#5fa6d9] border-b border-[#5fa6d9]/80 flex items-center justify-between px-4 lg:px-6 z-20 shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-white shrink-0 flex items-center gap-1.5">
              <PlaneTakeoff className="w-5.5 h-5.5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">TIQSEY</span>
          </div>
          {/* Desktop Sidebar Toggle */}
          <button 
            onClick={() => setSidebarCollapsed(!isCollapsed)}
            className="p-1.5 text-blue-50 hover:text-white hidden md:flex items-center justify-center hover:bg-white/10 rounded-md transition-all shrink-0 ml-1"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-blue-50 md:hidden hover:bg-white/10 rounded-md shrink-0 ml-1"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
        {/* Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 max-w-sm w-full hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-3 py-1 border border-slate-200/60 rounded-md leading-5 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition-colors shadow-sm"
              placeholder="Search PNR, order ID, name, email or phone..."
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-1.5 text-blue-50 hover:text-white transition-colors">
            <span className="absolute top-1.5 right-1.5 block h-1.5 w-1.5 rounded-full bg-white ring-2 ring-[#5fa6d9]" />
            <Bell className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside 
          className={`bg-black dark:bg-black hidden md:flex flex-col h-full transition-all duration-300 shrink-0 ${
            isCollapsed ? 'w-20' : 'w-56'
          }`}
        >
          {renderSidebarContent(isCollapsed, false)}
        </aside>
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative w-56 max-w-[80%] h-full bg-black dark:bg-black flex flex-col shadow-2xl">
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 bg-slate-100 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderSidebarContent(false, true)}
            </div>
          </div>
        )}
        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col h-full overflow-hidden">
          {/* Breadcrumbs Bar */}
          <div className="h-9 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 lg:px-6 shrink-0">
            <nav className="flex text-xs font-medium text-slate-500" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-1.5">
                {getBreadcrumbs().map((crumb, index) => (
                  <li key={crumb.name} className="inline-flex items-center">
                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 mx-0.5 text-slate-400" />}
                    <NavLink 
                      to={crumb.path}
                      className={`flex items-center gap-1 ${index === getBreadcrumbs().length - 1 ? 'text-slate-900 dark:text-white font-semibold pointer-events-none' : 'hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer'}`}
                    >
                      {crumb.icon && <crumb.icon className="w-3.5 h-3.5" />}
                      <span className="capitalize">{crumb.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:pt-5 lg:pb-8 lg:px-8">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
