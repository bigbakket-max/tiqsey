import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  Copy,
  Edit3,
  Trash2,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Sparkles,
  Power,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { AdminModalShell, AdminStatusBadge, TableSkeleton } from '../components/AdminMotion';
import {
  MarketingCoupon,
  DEFAULT_COUPONS,
  loadAdminConfig,
  saveAdminConfig,
} from '../../utils/adminConfigClient';

const EMPTY_FORM: Omit<MarketingCoupon, 'id' | 'usedCount' | 'createdAt'> = {
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: 10,
  minOrderValue: 0,
  maxUses: 100,
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  status: 'active',
};

export default function CouponsManager() {
  const { user } = useAuth();
  const { notify } = useAdminToast();

  const [coupons, setCoupons] = useState<MarketingCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await loadAdminConfig<MarketingCoupon[]>(
        'marketing_coupons',
        user?.email,
        DEFAULT_COUPONS
      );
      if (active) {
        setCoupons(Array.isArray(res.data) ? res.data : DEFAULT_COUPONS);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const persistCoupons = async (next: MarketingCoupon[], successMessage: string) => {
    setSaving(true);
    setCoupons(next);
    const res = await saveAdminConfig('marketing_coupons', next, user?.email);
    setSaving(false);
    if (!res.ok) {
      notify('error', res.error || 'Could not save coupon changes.');
      return false;
    }
    notify('success', successMessage);
    return true;
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (coupon: MarketingCoupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt,
      status: coupon.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedCode = form.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (cleanedCode.length < 3) {
      notify('warning', 'Promo code must be at least 3 alphanumeric characters.');
      return;
    }
    if (form.discountValue <= 0 || (form.discountType === 'percent' && form.discountValue > 95)) {
      notify('warning', 'Enter a valid discount value (1–95% for percentage or >0 for fixed).');
      return;
    }
    const duplicate = coupons.find((c) => c.code === cleanedCode && c.id !== editingId);
    if (duplicate) {
      notify('error', `Promo code "${cleanedCode}" already exists.`);
      return;
    }

    if (editingId) {
      const next = coupons.map((c) =>
        c.id === editingId
          ? { ...c, ...form, code: cleanedCode }
          : c
      );
      const ok = await persistCoupons(next, `Updated promo code ${cleanedCode}.`);
      if (ok) setModalOpen(false);
    } else {
      const created: MarketingCoupon = {
        ...form,
        id: `cpn_${Date.now()}`,
        code: cleanedCode,
        usedCount: 0,
        createdAt: new Date().toISOString(),
      };
      const ok = await persistCoupons([created, ...coupons], `Created promo code ${cleanedCode}.`);
      if (ok) setModalOpen(false);
    }
  };

  const handleToggleStatus = async (coupon: MarketingCoupon) => {
    const nextStatus: MarketingCoupon['status'] = coupon.status === 'active' ? 'inactive' : 'active';
    const next: MarketingCoupon[] = coupons.map((c) => (c.id === coupon.id ? { ...c, status: nextStatus } : c));
    await persistCoupons(next, `${coupon.code} is now ${nextStatus}.`);
  };

  const handleDelete = async (coupon: MarketingCoupon) => {
    const next = coupons.filter((c) => c.id !== coupon.id);
    await persistCoupons(next, `Deleted promo code ${coupon.code}.`);
  };

  const handleCopyCode = async (coupon: MarketingCoupon) => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopiedId(coupon.id);
      notify('info', `Copied "${coupon.code}" to clipboard.`);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      notify('error', 'Clipboard copy blocked by browser permissions.');
    }
  };

  const computedCoupons = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return coupons.map((c) => ({
      ...c,
      effectiveStatus: c.expiresAt && c.expiresAt < today ? ('expired' as const) : c.status,
    }));
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return computedCoupons.filter((c) => {
      if (statusFilter !== 'all' && c.effectiveStatus !== statusFilter) return false;
      if (!q) return true;
      return c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    });
  }, [computedCoupons, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const activeCount = computedCoupons.filter((c) => c.effectiveStatus === 'active').length;
    const totalRedemptions = computedCoupons.reduce((s, c) => s + (Number(c.usedCount) || 0), 0);
    const totalCapacity = computedCoupons.reduce((s, c) => s + (Number(c.maxUses) || 0), 0);
    return { total: computedCoupons.length, activeCount, totalRedemptions, totalCapacity };
  }, [computedCoupons]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Coupons & Promos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create discount codes, configure minimum order thresholds, and monitor promo redemptions.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Promo Code
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Active Campaigns</span>
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {stats.activeCount} <span className="text-sm font-normal text-slate-400">/ {stats.total}</span>
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Redemptions</span>
            <Tag className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {stats.totalRedemptions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Allocation Utilization</span>
            <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {stats.totalCapacity > 0 ? `${Math.round((stats.totalRedemptions / stats.totalCapacity) * 100)}%` : '0%'}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start">
            {(['all', 'active', 'inactive', 'expired'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or description..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : filteredCoupons.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No promo codes match this filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create your first coupon code to boost checkout conversions.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Promo Code
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/60">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredCoupons.map((c) => {
                  const pct = c.maxUses > 0 ? Math.min(100, Math.round((c.usedCount / c.maxUses) * 100)) : 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                            {c.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(c)}
                            title="Copy code"
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs truncate">
                          {c.description || 'Storewide discount offer'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `€${c.discountValue} OFF`}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {c.minOrderValue > 0 ? `Min €${c.minOrderValue}` : 'No minimum'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300 mb-1">
                          <span>{c.usedCount} / {c.maxUses}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-blue-600 dark:bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {c.expiresAt || 'No expiry'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <AdminStatusBadge status={c.effectiveStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleToggleStatus(c)}
                            title={c.status === 'active' ? 'Pause coupon' : 'Activate coupon'}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => openEditModal(c)}
                            title="Edit coupon"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleDelete(c)}
                            title="Delete coupon"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AdminModalShell open={modalOpen} onClose={() => setModalOpen(false)} maxWidthClass="max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Promo Code' : 'Create Promo Code'}
            </h2>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Promo Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER20"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as MarketingCoupon['status'] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Summer weekend museum bundle discount"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Discount Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, discountType: 'percent' })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-semibold cursor-pointer ${
                      form.discountType === 'percent'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" /> Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, discountType: 'fixed' })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-semibold cursor-pointer ${
                      form.discountType === 'fixed'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Fixed (€)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Discount Value ({form.discountType === 'percent' ? '%' : '€'})
                </label>
                <input
                  type="number"
                  min={1}
                  max={form.discountType === 'percent' ? 95 : 10000}
                  step="any"
                  required
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Min Order (€)</label>
                <input
                  type="number"
                  min={0}
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Max Uses</label>
                <input
                  type="number"
                  min={1}
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/70 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Code'}
            </button>
          </div>
        </form>
      </AdminModalShell>
    </div>
  );
}
