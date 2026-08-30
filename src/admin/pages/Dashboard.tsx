import React, { useMemo } from 'react';
import { Ticket, DollarSign, Activity, Users, Plus, ArrowUpRight, Box, Sparkles, FileText, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { POPULAR_ATTRACTIONS } from '../../data/mockData';
import { getStoredBanners } from '../../utils/bannerStorage';
import { useBlog } from '../../contexts/BlogContext';

const weeklyData = [
  { name: 'Mon', revenue: 400, bookings: 4 },
  { name: 'Tue', revenue: 300, bookings: 3 },
  { name: 'Wed', revenue: 200, bookings: 2 },
  { name: 'Thu', revenue: 600, bookings: 6 },
  { name: 'Fri', revenue: 800, bookings: 8 },
  { name: 'Sat', revenue: 1240, bookings: 12 },
  { name: 'Sun', revenue: 900, bookings: 9 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { posts } = useBlog();

  const metrics = useMemo(() => {
    let localSaved: any[] = [];
    try {
      const savedStr = localStorage.getItem('custom_attractions');
      if (savedStr) localSaved = JSON.parse(savedStr);
    } catch {
      localSaved = [];
    }

    const totalProducts = POPULAR_ATTRACTIONS.length + localSaved.length;
    const banners = getStoredBanners();
    const activeBanners = banners.filter(b => b.isActive).length;

    return {
      totalProducts,
      activeBanners,
      totalPosts: posts.length,
      bookingsCount: 8,
      estimatedRevenue: 1420
    };
  }, [posts]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time overview of ticket inventory, promotional campaigns, and orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/inventory/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Activity</span>
          </button>
          <button
            onClick={() => navigate('/promotional-banners/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Banner</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products & Tours" 
          value={metrics.totalProducts.toString()} 
          trend="Live in Catalog" 
          trendUp={true} 
          icon={<Box className="w-5 h-5 text-blue-600" />} 
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => navigate('/inventory')}
        />
        <StatCard 
          title="Promotional Banners" 
          value={`${metrics.activeBanners} Active`} 
          trend="Homepage Campaigns" 
          trendUp={true} 
          icon={<Sparkles className="w-5 h-5 text-amber-500" />} 
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          onClick={() => navigate('/promotional-banners')}
        />
        <StatCard 
          title="Total Blog Guides" 
          value={metrics.totalPosts.toString()} 
          trend="Published Articles" 
          trendUp={true} 
          icon={<FileText className="w-5 h-5 text-emerald-600" />} 
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          onClick={() => navigate('/blog')}
        />
        <StatCard 
          title="Total Bookings" 
          value={metrics.bookingsCount.toString()} 
          trend="+18% this month" 
          trendUp={true} 
          icon={<Ticket className="w-5 h-5 text-purple-600" />} 
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          onClick={() => navigate('/bookings')}
        />
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => navigate('/inventory')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600">
              <Box className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">Manage Activities</h3>
          <p className="text-xs text-slate-500 mt-1">Add tickets, edit variants, set price tiers, and manage gallery images.</p>
        </div>

        <div 
          onClick={() => navigate('/promotional-banners')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-amber-600 transition-colors">Promotional Banners</h3>
          <p className="text-xs text-slate-500 mt-1">Configure ready-made cards, play passes, stadium pass, and water park coupons.</p>
        </div>

        <div 
          onClick={() => navigate('/bookings')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600">
              <Ticket className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-purple-600 transition-colors">Orders & Bookings</h3>
          <p className="text-xs text-slate-500 mt-1">View customer tickets, manage reservation statuses, and generate vouchers.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Revenue & Bookings Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">7-day performance analytics across customer reservations.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Bookings</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-500">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>Revenue ($)</span>
            </div>
          </div>
        </div>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickCount={5}
                domain={[0, 15]}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickCount={5}
                domain={[0, 1500]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="bookings" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#f43f5e' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon, iconBg, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between h-32 ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className={`font-semibold ${trendUp ? 'text-emerald-500' : 'text-slate-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
