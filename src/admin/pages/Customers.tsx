import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Ticket,
  DollarSign,
  ArrowUpRight,
  X,
  UserCheck,
  Repeat,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import {
  ADMIN_EASE,
  AdminStatusBadge,
  TableSkeleton,
} from '../components/AdminMotion';
import {
  fetchAdminLiveBookings,
  exportRowsToCsv,
  parseSafeTimestamp,
  formatSafeDate,
  LiveBookingRecord,
} from '../../utils/adminConfigClient';

interface CustomerAggregate {
  key: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  totalSpent: number;
  totalTravelers: number;
  lastBookingDate: string;
  lastAttraction: string;
  bookings: LiveBookingRecord[];
  tier: 'VIP' | 'Repeat' | 'New';
}

export default function Customers() {
  const { user } = useAuth();
  const { notify } = useAdminToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<LiveBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [segment, setSegment] = useState<'all' | 'repeat' | 'high_value' | 'recent'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAggregate | null>(null);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const rows = await fetchAdminLiveBookings(user?.email);
      setBookings(rows);
    } catch {
      notify('error', 'Failed to refresh customer directory.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.email]);

  const customers = useMemo<CustomerAggregate[]>(() => {
    const map = new Map<string, CustomerAggregate>();
    for (const b of bookings) {
      const emailKey = (b.customerEmail || '').trim().toLowerCase();
      const nameKey = (b.customerName || 'Guest Customer').trim().toLowerCase();
      const key = emailKey || `name:${nameKey}`;
      const isCancelled = b.status === 'cancelled' || b.status === 'rejected' || b.status === 'refunded';
      const spend = isCancelled ? 0 : Number(b.collectedAmount || b.totalPrice || 0);

      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          key,
          name: b.customerName || 'Guest Customer',
          email: b.customerEmail || '—',
          phone: b.customerPhone || '—',
          bookingsCount: 1,
          totalSpent: spend,
          totalTravelers: Number(b.travelers || 1),
          lastBookingDate: b.createdAt,
          lastAttraction: b.attractionName,
          bookings: [b],
          tier: 'New',
        });
      } else {
        existing.bookingsCount += 1;
        existing.totalSpent += spend;
        existing.totalTravelers += Number(b.travelers || 1);
        if (b.customerPhone && existing.phone === '—') existing.phone = b.customerPhone;
        if (parseSafeTimestamp(b.createdAt) > parseSafeTimestamp(existing.lastBookingDate)) {
          existing.lastBookingDate = b.createdAt;
          existing.lastAttraction = b.attractionName;
        }
        existing.bookings.push(b);
      }
    }

    const list = Array.from(map.values()).map((c) => ({
      ...c,
      tier: c.totalSpent >= 300 || c.bookingsCount >= 3 ? 'VIP' : c.bookingsCount >= 2 ? 'Repeat' : 'New',
    })) as CustomerAggregate[];

    return list.sort((a, b) => b.totalSpent - a.totalSpent || b.bookingsCount - a.bookingsCount);
  }, [bookings]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    return customers.filter((c) => {
      if (segment === 'repeat' && c.bookingsCount < 2) return false;
      if (segment === 'high_value' && c.totalSpent < 200) return false;
      if (segment === 'recent' && parseSafeTimestamp(c.lastBookingDate) < thirtyDaysAgo) return false;

      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.lastAttraction.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery, segment]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter((c) => c.bookingsCount >= 2).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgLtv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    return { totalCustomers, repeatCustomers, totalRevenue, avgLtv };
  }, [customers]);

  const handleExportCsv = () => {
    exportRowsToCsv(
      `tiqsey-customers-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Customer Name', 'Email', 'Phone', 'Tier', 'Bookings', 'Travelers', 'Lifetime Spend (EUR)', 'Last Activity', 'Last Booking Date'],
      filteredCustomers.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.tier,
        c.bookingsCount,
        c.totalTravelers,
        c.totalSpent.toFixed(2),
        c.lastAttraction,
        formatSafeDate(c.lastBookingDate),
      ])
    );
    notify('success', `Exported ${filteredCustomers.length} customer records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Live traveler directory aggregated from confirmed bookings, lifetime value, and repeat activity.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredCustomers.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {stats.totalCustomers.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unique booking contacts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Repeat Travelers</span>
            <Repeat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {stats.repeatCustomers.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {stats.totalCustomers > 0
              ? `${Math.round((stats.repeatCustomers / stats.totalCustomers) * 100)}% retention rate`
              : '2+ completed orders'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Cumulative Spend</span>
            <DollarSign className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Net active booking value</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Avg. Lifetime Value</span>
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{stats.avgLtv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per unique customer</p>
        </div>
      </div>

      {/* Filters & Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start">
            {(
              [
                { id: 'all', label: 'All Customers' },
                { id: 'repeat', label: 'Repeat (2+)' },
                { id: 'high_value', label: 'High Value (€200+)' },
                { id: 'recent', label: 'Last 30 Days' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSegment(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  segment === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No matching customers found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {bookings.length === 0
                ? 'Customer profiles are created automatically as soon as travelers place bookings on Tiqsey.'
                : 'Try adjusting your search query or switching to the All Customers segment.'}
            </p>
            {bookings.length === 0 && (
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                View Bookings
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/60">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Segment</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredCustomers.map((c) => {
                  const initials = c.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr
                      key={c.key}
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-sky-500/15 text-blue-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials || 'GU'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">{c.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                              {c.totalTravelers} {c.totalTravelers === 1 ? 'traveler' : 'travelers'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{c.email}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{c.phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold ${
                            c.tier === 'VIP'
                              ? 'text-blue-700 dark:text-sky-300'
                              : c.tier === 'Repeat'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {c.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {c.bookingsCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                        €{c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{c.lastAttraction}</p>
                        <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {formatSafeDate(c.lastBookingDate)}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(c);
                          }}
                          className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Customer Detail Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[95] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: ADMIN_EASE }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedCustomer.tier} Customer · {selectedCustomer.bookingsCount} total orders
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Lifetime Spend</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
                      €{selectedCustomer.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Travelers Booked</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
                      {selectedCustomer.totalTravelers}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-b border-slate-200/80 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{selectedCustomer.phone}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Booking History ({selectedCustomer.bookings.length})
                  </h3>
                  <div className="space-y-2.5">
                    {selectedCustomer.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-sky-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {b.attractionName}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              {b.bookingRef} · {b.travelers} pax
                            </p>
                          </div>
                          <AdminStatusBadge status={b.status} />
                        </div>
                        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                            <Calendar className="w-3 h-3" />
                            {b.bookingDate || formatSafeDate(b.createdAt)}
                          </span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                            {b.paymentSymbol || '€'}
                            {Number(b.totalPrice || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const q = selectedCustomer.email !== '—' ? selectedCustomer.email : selectedCustomer.name;
                    setSelectedCustomer(null);
                    navigate(`/bookings?search=${encodeURIComponent(q)}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Open Orders in Bookings
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
