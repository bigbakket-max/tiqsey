import React from 'react';
import { Ticket, DollarSign, Activity, Users } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 400, bookings: 4 },
  { name: 'Tue', revenue: 300, bookings: 3 },
  { name: 'Wed', revenue: 200, bookings: 2 },
  { name: 'Thu', revenue: 600, bookings: 6 },
  { name: 'Fri', revenue: 800, bookings: 8 },
  { name: 'Sat', revenue: 1240, bookings: 12 },
  { name: 'Sun', revenue: 900, bookings: 9 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Track your bookings, revenue, and live activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Bookings" 
          value="5" 
          trend="+12%" 
          trendUp={true} 
          icon={<Ticket className="w-5 h-5 text-blue-500" />} 
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          title="Revenue" 
          value="$805" 
          trend="+8%" 
          trendUp={true} 
          icon={<DollarSign className="w-5 h-5 text-blue-500" />} 
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          title="Today's Tours" 
          value="2" 
          trend="0%" 
          trendUp={true} 
          icon={<Activity className="w-5 h-5 text-blue-500" />} 
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          title="Live Visitors" 
          value="1,432" 
          trend="+24%" 
          trendUp={true} 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-6">Revenue & Bookings Overview</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
                domain={[0, 12]}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickCount={5}
                domain={[0, 1200]}
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

function StatCard({ title, value, trend, trendUp, icon, iconBg }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className={`font-semibold ${trendUp ? 'text-emerald-500' : 'text-slate-500'}`}>
          {trend}
        </span>
        <span className="text-slate-400 dark:text-slate-500">from last week</span>
      </div>
    </div>
  );
}
