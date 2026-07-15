import React, { useState, useEffect } from 'react';
import { useBackendAuth } from '../BackendApp';
import { 
  History, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  UserMinus, 
  UserPlus, 
  UserCheck, 
  LogOut, 
  Key, 
  Loader2 
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  ip: string;
  details: string;
}

export default function AuditLogs() {
  const { token } = useBackendAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/backend/logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve security audit logs');
      }
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadgeAndIcon = (action: string) => {
    switch(action) {
      case 'login_success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
          label: 'Login Success',
          style: 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
        };
      case 'login_failed':
        return {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          label: 'Login Failed',
          style: 'bg-red-50 text-red-700 border-red-200/50'
        };
      case 'login_rate_limited':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
          label: 'Rate Limited',
          style: 'bg-amber-50 text-amber-700 border-amber-200/50'
        };
      case 'logout':
        return {
          icon: <LogOut className="w-4 h-4 text-blue-500" />,
          label: 'Logout',
          style: 'bg-blue-50 text-blue-700 border-blue-200/50'
        };
      case 'user_created':
        return {
          icon: <UserPlus className="w-4 h-4 text-indigo-500" />,
          label: 'Account Created',
          style: 'bg-indigo-50 text-indigo-700 border-indigo-200/50'
        };
      case 'user_updated':
        return {
          icon: <UserCheck className="w-4 h-4 text-purple-500" />,
          label: 'Account Updated',
          style: 'bg-purple-50 text-purple-700 border-purple-200/50'
        };
      case 'user_deleted':
        return {
          icon: <UserMinus className="w-4 h-4 text-rose-500" />,
          label: 'Account Deleted',
          style: 'bg-rose-50 text-rose-700 border-rose-200/50'
        };
      case '2fa_toggled':
        return {
          icon: <Key className="w-4 h-4 text-teal-500" />,
          label: '2FA Modified',
          style: 'bg-teal-50 text-teal-700 border-teal-200/50'
        };
      default:
        return {
          icon: <History className="w-4 h-4 text-slate-500" />,
          label: action,
          style: 'bg-slate-50 text-slate-700 border-slate-200/50'
        };
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.ip.includes(searchTerm);
    
    if (actionFilter === 'all') return matchesSearch;
    return matchesSearch && log.action === actionFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Upper Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security Audit Logging</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Review authentication events, rate-limiting triggers, and staff modifications
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-bold rounded-2xl transition-colors cursor-pointer text-sm shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Audit Trail
        </button>
      </div>

      {/* Query Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
        
        {/* Text Search */}
        <div className="relative sm:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-medium"
            placeholder="Search by username, IP address, or details..."
          />
        </div>

        {/* Action Dropdown filter */}
        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-semibold cursor-pointer"
          >
            <option value="all">All Security Events</option>
            <option value="login_success">Login Success</option>
            <option value="login_failed">Login Failed</option>
            <option value="login_rate_limited">Rate Limited</option>
            <option value="logout">Logout</option>
            <option value="user_created">User Created</option>
            <option value="user_updated">User Updated</option>
            <option value="user_deleted">User Deleted</option>
            <option value="2fa_toggled">2FA Changes</option>
          </select>
        </div>

      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Logging entries table view */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#5fa6d9] animate-spin" />
            <p className="text-sm text-slate-500 font-semibold">Retrieving system security logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <History className="w-12 h-12 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No matching audit events found</p>
            <p className="text-xs">Adjust search parameters or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Event Timestamp</th>
                  <th className="px-6 py-4.5">Username</th>
                  <th className="px-6 py-4.5">Security Event</th>
                  <th className="px-6 py-4.5">IP Address</th>
                  <th className="px-6 py-4.5">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {filteredLogs.map((log) => {
                  const badge = getActionBadgeAndIcon(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      {/* Timestamp */}
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        @{log.username}
                      </td>

                      {/* Event Type Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.style}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>

                      {/* IP Address */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                        {log.ip}
                      </td>

                      {/* Details text */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium max-w-sm truncate md:max-w-md lg:max-w-lg" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
