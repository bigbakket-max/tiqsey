import React, { useState, useMemo, useEffect } from 'react';
import { 
  Ticket, 
  DollarSign, 
  Activity, 
  Users, 
  Plus, 
  ArrowUpRight, 
  Box, 
  Sparkles, 
  FileText, 
  Globe, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { POPULAR_ATTRACTIONS } from '../../data/mockData';
import { getStoredBanners } from '../../utils/bannerStorage';
import { useBlog } from '../../contexts/BlogContext';

const TIME_RANGE_DATA: Record<'7d' | '30d' | '90d', Array<{ name: string; revenue: number; bookings: number }>> = {
  '7d': [
    { name: 'Mon', revenue: 420, bookings: 4 },
    { name: 'Tue', revenue: 380, bookings: 3 },
    { name: 'Wed', revenue: 520, bookings: 5 },
    { name: 'Thu', revenue: 680, bookings: 7 },
    { name: 'Fri', revenue: 950, bookings: 9 },
    { name: 'Sat', revenue: 1420, bookings: 14 },
    { name: 'Sun', revenue: 1100, bookings: 11 },
  ],
  '30d': [
    { name: 'Week 1', revenue: 3200, bookings: 28 },
    { name: 'Week 2', revenue: 4150, bookings: 36 },
    { name: 'Week 3', revenue: 4900, bookings: 42 },
    { name: 'Week 4', revenue: 5800, bookings: 51 },
  ],
  '90d': [
    { name: 'Month 1', revenue: 14200, bookings: 125 },
    { name: 'Month 2', revenue: 18600, bookings: 164 },
    { name: 'Month 3', revenue: 22400, bookings: 198 },
  ]
};

const RECENT_ACTIVITY = [
  {
    id: 'ord-10492',
    pnr: 'TIQ-882194',
    customer: 'Sarah Jenkins',
    email: 'sarah.j@gmail.com',
    item: '1-Hour Amsterdam Canal Cruise',
    amount: '€28.00',
    status: 'Confirmed',
    time: '12m ago'
  },
  {
    id: 'ord-10491',
    pnr: 'TIQ-551930',
    customer: 'Liam Van Der Beek',
    email: 'liam.vdb@outlook.com',
    item: 'Rijksmuseum Amsterdam Reserved Entry',
    amount: '€45.00',
    status: 'Confirmed',
    time: '42m ago'
  },
  {
    id: 'ord-10490',
    pnr: 'TIQ-449102',
    customer: 'Elena Rostova',
    email: 'elena.rostova@icloud.com',
    item: 'Van Gogh Museum Skip-the-Line',
    amount: '€52.50',
    status: 'Pending',
    time: '1h ago'
  },
  {
    id: 'ord-10489',
    pnr: 'TIQ-190284',
    customer: 'Mark Robinson',
    email: 'm.robinson@yahoo.com',
    item: 'Heineken Experience VIP Tour',
    amount: '€79.00',
    status: 'Confirmed',
    time: '2h ago'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { posts } = useBlog();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Initial smooth skeleton loading simulation to demonstrate fast, flicker-free rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  const metrics = useMemo(() => {
    const totalProducts = POPULAR_ATTRACTIONS.length;
    const banners = getStoredBanners();
    const activeBanners = banners.filter(b => b.isActive).length;

    return {
      totalProducts,
      activeBanners,
      totalPosts: posts.length,
      bookingsCount: timeRange === '7d' ? 53 : timeRange === '30d' ? 157 : 487,
      estimatedRevenue: timeRange === '7d' ? '€5,470' : timeRange === '30d' ? '€18,050' : '€55,200',
      conversionRate: '4.8%'
    };
  }, [posts, timeRange]);

  const activeChartData = TIME_RANGE_DATA[timeRange];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Admin Command Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time management for tour tickets, promotional campaigns, and customer reservations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/inventory/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Activity</span>
          </button>
          <button
            onClick={() => navigate('/promotional-banners/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Banner</span>
          </button>
        </div>
      </div>

      {/* Primary Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 h-32 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard 
              title="Total Products & Tours" 
              value={metrics.totalProducts.toString()} 
              subtitle="Active in Public Catalog" 
              trend="+3 this week"
              trendUp={true} 
              icon={<Box className="w-5 h-5 text-blue-600" />} 
              iconBg="bg-blue-50 dark:bg-blue-900/30"
              onClick={() => navigate('/inventory')}
            />
            <StatCard 
              title="Promotional Banners" 
              value={`${metrics.activeBanners} Active`} 
              subtitle="Homepage Hero & Deal Cards" 
              trend="100% Scheduled"
              trendUp={true} 
              icon={<Sparkles className="w-5 h-5 text-amber-500" />} 
              iconBg="bg-amber-50 dark:bg-amber-900/30"
              onClick={() => navigate('/promotional-banners')}
            />
            <StatCard 
              title="Total Blog Guides" 
              value={metrics.totalPosts.toString()} 
              subtitle="SEO Destination Articles" 
              trend="Updated Today"
              trendUp={true} 
              icon={<FileText className="w-5 h-5 text-emerald-600" />} 
              iconBg="bg-emerald-50 dark:bg-emerald-900/30"
              onClick={() => navigate('/blog')}
            />
            <StatCard 
              title="Total Bookings" 
              value={metrics.bookingsCount.toString()} 
              subtitle={`Est. Revenue: ${metrics.estimatedRevenue}`} 
              trend="+18.4% vs last period"
              trendUp={true} 
              icon={<Ticket className="w-5 h-5 text-purple-600" />} 
              iconBg="bg-purple-50 dark:bg-purple-900/30"
              onClick={() => navigate('/bookings')}
            />
          </>
        )}
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLaunchCard
          title="Manage Activities"
          description="Add tickets, edit variants, set pricing rules & upload media."
          icon={<Box className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          hoverColor="group-hover:text-blue-600"
          onClick={() => navigate('/inventory')}
        />

        <QuickLaunchCard
          title="Promotional Banners"
          description="Configure play passes, stadium deals, and water park coupons."
          icon={<Sparkles className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          hoverColor="group-hover:text-amber-500"
          onClick={() => navigate('/promotional-banners')}
        />

        <QuickLaunchCard
          title="Orders & Bookings"
          description="View customer tickets, order statuses, and generate vouchers."
          icon={<Ticket className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50 dark:bg-purple-900/30"
          hoverColor="group-hover:text-purple-600"
          onClick={() => navigate('/bookings')}
        />

        <QuickLaunchCard
          title="Travel Blog & Guides"
          description="Publish destination travel stories, itineraries, tips & SEO."
          icon={<FileText className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          hoverColor="group-hover:text-emerald-600"
          onClick={() => navigate('/blog')}
        />
      </div>

      {/* Interactive Analytics & Performance Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Revenue & Bookings Trend</h3>
              <span className="text-[11px] font-mono text-slate-400">· {timeRange.toUpperCase()} View</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Performance metrics across confirmed customer reservations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Bookings</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                <span>Revenue (€)</span>
              </div>
            </div>

            {/* Time Range Filter Buttons */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                    timeRange === range
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200/80 dark:text-slate-800/60" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} 
                dy={8}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} 
                tickCount={5}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} 
                tickCount={5}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#0284c7" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="bookings" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#bookingsGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Bookings Snapshot Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live incoming bookings with instant access to vouchers.</p>
          </div>
          <button
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">PNR / Order</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Tour Activity</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {RECENT_ACTIVITY.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => navigate(`/bookings?orderId=${order.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-sky-400 group-hover:underline">
                    {order.pnr}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{order.customer}</p>
                    <p className="text-[11px] text-slate-400">{order.email}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                    {order.item}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-white">
                    {order.amount}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      order.status === 'Confirmed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400 text-[11px]">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, trend, trendUp, icon, iconBg, onClick }: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-34 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group active:scale-[0.99]"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black font-mono text-slate-800 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-200 shadow-xs`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{subtitle}</span>
        <span className={`font-mono text-[11px] font-bold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function QuickLaunchCard({ title, description, icon, iconBg, hoverColor, onClick }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  hoverColor: string;
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group active:scale-[0.99] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-200 shadow-xs`}>
            {icon}
          </div>
          <ArrowRight className={`w-4 h-4 text-slate-400 ${hoverColor} group-hover:translate-x-1 transition-all duration-200`} />
        </div>
        <h3 className={`font-bold text-slate-800 dark:text-white ${hoverColor} transition-colors text-sm`}>
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
