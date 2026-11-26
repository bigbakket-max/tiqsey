import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Download,
  RefreshCw,
  DollarSign,
  Ticket,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { DashboardSkeleton } from '../components/AdminMotion';
import {
  fetchAdminLiveBookings,
  fetchAdminLiveAttractions,
  exportRowsToCsv,
  LiveBookingRecord,
} from '../../utils/adminConfigClient';

export default function Reports() {
  const { user } = useAuth();
  const { notify } = useAdminToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<LiveBookingRecord[]>([]);
  const [attractions, setAttractions] = useState<
    Array<{ id: string; name: string; city: string; category: string; price: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('all');

  const loadReports = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const [bRows, aRows] = await Promise.all([
        fetchAdminLiveBookings(user?.email),
        fetchAdminLiveAttractions(),
      ]);
      setBookings(bRows);
      setAttractions(aRows);
    } catch {
      notify('error', 'Failed to refresh business reports.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user?.email]);

  const scopedBookings = useMemo(() => {
    if (range === 'all') return bookings;
    const days = range === '7d' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return bookings.filter((b) => new Date(b.createdAt).getTime() >= cutoff);
  }, [bookings, range]);

  const metrics = useMemo(() => {
    const valid = scopedBookings.filter(
      (b) => b.status !== 'cancelled' && b.status !== 'rejected' && b.status !== 'refunded'
    );
    const totalRevenue = valid.reduce((sum, b) => sum + Number(b.collectedAmount || b.totalPrice || 0), 0);
    const totalOrders = scopedBookings.length;
    const totalTravelers = valid.reduce((sum, b) => sum + Number(b.travelers || 1), 0);
    const aov = valid.length > 0 ? totalRevenue / valid.length : 0;

    // Top Activities
    const activityMap = new Map<string, { name: string; orders: number; revenue: number; travelers: number }>();
    for (const b of valid) {
      const key = b.attractionName || 'Tiqsey Experience';
      const cur = activityMap.get(key) || { name: key, orders: 0, revenue: 0, travelers: 0 };
      cur.orders += 1;
      cur.revenue += Number(b.collectedAmount || b.totalPrice || 0);
      cur.travelers += Number(b.travelers || 1);
      activityMap.set(key, cur);
    }
    const topActivities = Array.from(activityMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    // City breakdown (cross-referenced with attractions if city missing on booking)
    const attractionCityLookup = new Map<string, string>();
    for (const a of attractions) {
      if (a.id) attractionCityLookup.set(a.id, a.city);
      if (a.name) attractionCityLookup.set(a.name.toLowerCase(), a.city);
    }
    const cityMap = new Map<string, { city: string; orders: number; revenue: number }>();
    for (const b of valid) {
      const resolvedCity =
        b.city ||
        attractionCityLookup.get(b.attractionId) ||
        attractionCityLookup.get(b.attractionName.toLowerCase()) ||
        'International';
      const cur = cityMap.get(resolvedCity) || { city: resolvedCity, orders: 0, revenue: 0 };
      cur.orders += 1;
      cur.revenue += Number(b.collectedAmount || b.totalPrice || 0);
      cityMap.set(resolvedCity, cur);
    }
    const topCities = Array.from(cityMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    // Status distribution
    const statusMap = new Map<string, number>();
    for (const b of scopedBookings) {
      const st = b.status || 'confirmed';
      statusMap.set(st, (statusMap.get(st) || 0) + 1);
    }
    const statusBreakdown = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    return { totalRevenue, totalOrders, totalTravelers, aov, topActivities, topCities, statusBreakdown };
  }, [scopedBookings, attractions]);

  const handleExportReport = () => {
    exportRowsToCsv(
      `tiqsey-business-report-${range}-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Activity Name', 'Orders', 'Travelers', 'Revenue (EUR)'],
      metrics.topActivities.map((a) => [a.name, a.orders, a.travelers, a.revenue.toFixed(2)])
    );
    notify('success', 'Business summary report exported to CSV.');
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const maxActivityRevenue = metrics.topActivities[0]?.revenue || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Business Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Live revenue performance, top-grossing experiences, and destination analytics across Tiqsey.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {(
              [
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: 'all', label: 'All Time' },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  range === r.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => loadReports(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleExportReport}
            disabled={metrics.topActivities.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
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
            <span>Net Revenue</span>
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Excluding cancelled orders</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Bookings</span>
            <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {metrics.totalOrders.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
            {metrics.totalTravelers.toLocaleString()} travelers served
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Avg. Order Value</span>
            <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{metrics.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per confirmed booking</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Active Catalog</span>
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {attractions.length.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Published experiences</p>
        </div>
      </div>

      {/* Main Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Activities Bar Chart */}
        <section className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Revenue by Top Activities</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Agents & Analytics
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {metrics.topActivities.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No confirmed bookings recorded in this period yet. Revenue bars will populate automatically as orders arrive.
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.topActivities.map((act) => {
                const widthPct = Math.max(6, Math.round((act.revenue / maxActivityRevenue) * 100));
                return (
                  <div key={act.name} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{act.name}</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white shrink-0">
                        €{act.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="font-normal text-slate-400 ml-2">({act.orders} orders)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#0284c7]"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Destination & Status Side Column */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Destination Breakdown</h2>
            </div>
            {metrics.topCities.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No city booking metrics yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {metrics.topCities.map((c) => (
                  <div key={c.city} className="py-2.5 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{c.city}</p>
                      <p className="text-[11px] text-slate-400 font-mono tabular-nums">{c.orders} bookings</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      €{c.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Order Status Mix</h2>
            {metrics.statusBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No order statuses recorded in this range.</p>
            ) : (
              <div className="space-y-2.5 text-xs">
                {metrics.statusBreakdown.map((item) => {
                  const share = metrics.totalOrders > 0 ? Math.round((item.count / metrics.totalOrders) * 100) : 0;
                  return (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{item.status}</span>
                      <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">
                        {item.count} <span className="text-slate-400 font-normal">({share}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
