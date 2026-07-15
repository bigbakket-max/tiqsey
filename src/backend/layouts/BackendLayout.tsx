import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Calendar, 
  Users, 
  Globe, 
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  Box,
  FileText,
  Text,
  PlaneTakeoff,
  Menu,
  ShieldCheck,
  History,
  Lock,
  Database
} from 'lucide-react';
import { useBackendAuth } from '../BackendApp';

export default function BackendLayout() {
  const { user, logout } = useBackendAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isCollapsed = sidebarCollapsed;

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      return [{ name: 'Dashboard', icon: Home, path: '/backend/dashboard' }];
    }
    const crumbs = [{ name: 'Dashboard', icon: Home, path: '/backend/dashboard' }];
    if (path.includes('/inventory')) {
      crumbs.push({ name: 'Products', icon: Box, path: '/backend/inventory' });
    } else if (path.includes('/bookings')) {
      crumbs.push({ name: 'Orders', icon: FileText, path: '/backend/bookings' });
    } else if (path.includes('/analytics')) {
      crumbs.push({ name: 'Agents / Analytics', icon: Users, path: '/backend/analytics' });
    } else if (path.includes('/blog')) {
      crumbs.push({ name: 'Website Blog', icon: Text, path: '/backend/blog' });
    } else if (path.includes('/users')) {
      crumbs.push({ name: 'Staff Management', icon: ShieldCheck, path: '/backend/users' });
    } else if (path.includes('/logs')) {
      crumbs.push({ name: 'Audit Logs', icon: History, path: '/backend/logs' });
    } else if (path.includes('/sql')) {
      crumbs.push({ name: 'SQL Database Editor', icon: Database, path: '/backend/sql' });
    }
    return crumbs;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/backend/login');
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      case 'employee': return 'Employee';
      default: return role;
    }
  };

  const hasAccess = (itemRoleRequired?: string[]) => {
    if (!itemRoleRequired) return true;
    if (!user) return false;
    return itemRoleRequired.includes(user.role);
  };

  const navItems = [
    { name: 'Dashboard', path: '/backend/dashboard', icon: Home },
    { name: 'Products', path: '/backend/inventory', icon: Box, roles: ['super_admin', 'admin', 'manager', 'employee'] },
    { name: 'Orders', path: '/backend/bookings', icon: FileText, roles: ['super_admin', 'admin', 'manager', 'employee'] },
    { name: 'Agents', path: '/backend/analytics', icon: Users, roles: ['super_admin', 'admin', 'manager'] },
    { name: 'Website Blog', path: '/backend/blog', icon: Text, roles: ['super_admin', 'admin', 'manager', 'employee'] },
    { name: 'Staff Accounts', path: '/backend/users', icon: ShieldCheck, roles: ['super_admin', 'admin'] },
    { name: 'Audit Logs', path: '/backend/logs', icon: History, roles: ['super_admin', 'admin'] },
    { name: 'SQL Editor', path: '/backend/sql', icon: Database, roles: ['super_admin', 'admin'] },
  ];

  const renderSidebarContent = (isCollapsed: boolean, isMobile: boolean) => (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Brand area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <PlaneTakeoff className="w-6 h-6 text-[#5fa6d9]" />
        {!isCollapsed && (
          <span className="font-extrabold text-lg text-white tracking-tight">
            TIQSEY <span className="text-[#5fa6d9]">PORTAL</span>
          </span>
        )}
      </div>

      {/* Nav Link list */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.filter(item => hasAccess(item.roles)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center transition-all text-sm group ${
                isCollapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'w-full gap-3 px-4 py-2.5 rounded-xl'
              } ${
                isActive 
                  ? 'bg-slate-800 text-white font-bold border-l-4 border-[#5fa6d9]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white font-semibold'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center transition-all text-sm cursor-pointer group ${
            isCollapsed ? 'justify-center mx-auto w-10 h-10 rounded-xl' : 'w-full gap-3 px-4 py-2.5 rounded-xl'
          } text-slate-400 hover:bg-red-950/20 hover:text-red-400 font-semibold`}
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* User profile bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl bg-[#5fa6d9]/10 text-[#5fa6d9] flex items-center justify-center font-bold text-sm shrink-0 border border-[#5fa6d9]/20"
            title={isCollapsed ? `${user?.full_name} (${getRoleBadge(user?.role || '')})` : undefined}
          >
            {user?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">{getRoleBadge(user?.role || '')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      
      {/* Mobile Top Header */}
      <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="w-5 h-5 text-[#5fa6d9]" />
          <span className="font-extrabold text-base text-white tracking-tight">TIQSEY STAFF</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col shrink-0 transition-all duration-300 h-full ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {renderSidebarContent(isCollapsed, false)}
      </aside>

      {/* Mobile Sidebar overlay menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 h-full shadow-2xl">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent(false, true)}
          </div>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top bar for desktop */}
        <header className="hidden md:flex h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarCollapsed(!isCollapsed)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <span>Staff Portal</span>
              {getBreadcrumbs().map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  <span className={idx === getBreadcrumbs().length - 1 ? "text-slate-700 dark:text-slate-200 font-bold" : ""}>
                    {crumb.name}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/30 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURE SESSION ACTIVE
            </div>
          </div>
        </header>

        {/* Dynamic page contents scroll frame */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
