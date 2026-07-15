import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Operations & Analytics</h1>
          <p className="text-slate-500 mt-1">Manage specialized AI sub-agents handling platform operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AgentCard title="Inventory Agent" status="Active" load="32%" desc="Monitors stock levels, triggers low-stock alerts, and synchronizes with supplier APIs." />
        <AgentCard title="Pricing Agent" status="Active" load="84%" desc="Dynamic pricing based on demand, seasonality, and competitor analysis." />
        <AgentCard title="Availability Agent" status="Active" load="12%" desc="Manages time slots, capacity rules, and timezone normalizations (UTC)." />
        <AgentCard title="Policy Agent" status="Active" load="5%" desc="Auto-evaluates cancellations, refunds, and weather-related rules." />
        <AgentCard title="Content Agent" status="Training" load="--%" desc="Generates localized descriptions, SEO metadata, and FAQ auto-responses." />
        <AgentCard title="Support Agent" status="Active" load="67%" desc="First-line customer support for booking modifications and general inquiries." />
      </div>
    </div>
  );
}

function AgentCard({ title, status, load, desc }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 hover:shadow-lg transition-shadow shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
          'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">{desc}</p>
      
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-slate-400">System Load: <span className="text-slate-700 dark:text-slate-300">{load}</span></span>
        <button className="text-brand hover:underline">Configure</button>
      </div>
    </div>
  );
}
