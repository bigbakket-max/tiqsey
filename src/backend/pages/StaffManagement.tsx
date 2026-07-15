import React, { useState, useEffect } from 'react';
import { useBackendAuth, BackendUser } from '../BackendApp';
import { 
  Users, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Key, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  X, 
  Loader2, 
  ToggleLeft, 
  ToggleRight, 
  RefreshCw 
} from 'lucide-react';

export default function StaffManagement() {
  const { user: currentUser, token } = useBackendAuth();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [selectedId, setSelectedId] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'manager' | 'employee'>('employee');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Active');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/backend/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch backend staff accounts');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load staff accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedId('');
    setFullName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('employee');
    setDepartment('Operations');
    setStatus('Active');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: BackendUser) => {
    setModalMode('edit');
    setSelectedId(u.id);
    setFullName(u.full_name);
    setUsername(u.username);
    setEmail(u.email || '');
    setPassword(''); // Empty for editing (only changes if filled)
    setRole(u.role);
    setDepartment(u.department || 'Operations');
    setStatus(u.status as any);
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !department.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (modalMode === 'create' && !password.trim()) {
      setError('Password is required for new accounts.');
      return;
    }

    setModalLoading(true);
    setError('');

    try {
      const body: any = {
        full_name: fullName,
        username: username,
        email: email,
        role: role,
        department: department,
        status: status,
      };

      if (modalMode === 'edit') {
        body.id = selectedId;
      }

      if (password) {
        body.password = password;
      }

      const res = await fetch('/api/backend/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save staff account');
      }

      setSuccess(`Account for ${fullName} saved successfully!`);
      setIsModalOpen(false);
      fetchUsers();
      
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving user');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (u: BackendUser) => {
    if (currentUser?.role !== 'super_admin') {
      setError('Only Super Administrators are authorized to delete staff accounts.');
      return;
    }

    if (u.id === currentUser.id) {
      setError('You cannot delete your own account.');
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to permanently delete the staff account for ${u.full_name} (${u.username})? This operation is irreversible.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/backend/users/${u.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      setSuccess(`Account deleted successfully.`);
      fetchUsers();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleToggle2FA = async (u: BackendUser) => {
    try {
      const res = await fetch(`/api/backend/users/${u.id}/toggle-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: !u.two_factor_enabled })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to toggle 2FA');
      }

      setSuccess(`Two-Factor Authentication modified for ${u.full_name}.`);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error updating 2FA');
    }
  };

  const getStatusBadge = (s: string) => {
    switch(s) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Suspended
          </span>
        );
      case 'Inactive':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactive
          </span>
        );
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      case 'employee': return 'Employee';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header Cards */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Staff Account Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Control system administrators, managers, and employee credentials
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="p-3 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Refresh Account List"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-bold rounded-2xl transition-all cursor-pointer text-sm shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Staff Account Grid List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#5fa6d9] animate-spin" />
            <p className="text-sm text-slate-500 font-semibold">Loading backend accounts database...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No staff members found</p>
            <p className="text-xs">Create a staff account to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Full Name & Username</th>
                  <th className="px-6 py-4.5">Email</th>
                  <th className="px-6 py-4.5">Role / Department</th>
                  <th className="px-6 py-4.5">Account Status</th>
                  <th className="px-6 py-4.5">Security / 2FA</th>
                  <th className="px-6 py-4.5">Last Login</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Full Name & Username */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                        <p className="text-xs text-[#5fa6d9] font-bold mt-0.5">@{u.username}</p>
                      </div>
                    </td>
                    
                    {/* Email */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {u.email || <span className="text-slate-300 italic">No email</span>}
                    </td>

                    {/* Role & Department */}
                    <td className="px-6 py-4">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'super_admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/50' :
                          u.role === 'admin' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/50' :
                          u.role === 'manager' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400'
                        }`}>
                          {getRoleLabel(u.role)}
                        </span>
                        <p className="text-xs text-slate-400 font-medium mt-1">{u.department || 'Operations'}</p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(u.status)}
                    </td>

                    {/* 2FA Toggle */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggle2FA(u)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#5fa6d9] transition-colors cursor-pointer select-none"
                        title={u.two_factor_enabled ? "Click to Disable Two-Factor" : "Click to Enable Two-Factor"}
                      >
                        {u.two_factor_enabled ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">2FA Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-slate-400" />
                            <span className="text-slate-400">2FA Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Last Login */}
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {u.last_login ? new Date(u.last_login).toLocaleString() : <span className="text-slate-300">Never</span>}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                          title="Edit Account / Reset Password"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {currentUser?.role === 'super_admin' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-2 border border-red-100 dark:border-red-950/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                            disabled={u.id === currentUser.id}
                            title="Delete Staff Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {modalMode === 'create' ? 'Create Staff Member' : 'Edit Staff Account'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error Alert */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="space-y-4 text-left">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-medium"
                  placeholder="John Doe"
                  disabled={modalLoading}
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-medium"
                  placeholder="johndoe"
                  disabled={modalLoading || modalMode === 'edit'} // Username cannot be changed for stability
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-medium"
                  placeholder="john.doe@tiqsey.com"
                  disabled={modalLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password {modalMode === 'edit' ? '(Leave empty to keep current)' : '*'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-medium"
                    placeholder={modalMode === 'edit' ? "Enter new password to reset" : "••••••••"}
                    disabled={modalLoading}
                  />
                </div>
              </div>

              {/* Grid for Role & Department */}
              <div className="grid grid-cols-2 gap-3">
                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Access Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-semibold"
                    disabled={modalLoading || (modalMode === 'edit' && selectedId === currentUser?.id)} // Prevent editing your own role
                  >
                    {/* Admins can only assign Manager or Employee role. SuperAdmins can assign any. */}
                    {currentUser?.role === 'super_admin' && (
                      <option value="super_admin">Super Admin</option>
                    )}
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-medium"
                    placeholder="Operations"
                    disabled={modalLoading}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Status *
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5fa6d9]/30 focus:border-[#5fa6d9] text-sm font-semibold"
                  disabled={modalLoading || selectedId === currentUser?.id} // Prevent editing your own status
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-bold rounded-xl text-sm cursor-pointer flex justify-center items-center gap-1.5"
                  disabled={modalLoading}
                >
                  {modalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Member
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
