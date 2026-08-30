import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  Play, 
  Pause, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  Settings2,
  X
} from 'lucide-react';

interface SubAgent {
  id: string;
  title: string;
  status: 'Active' | 'Idle' | 'Training' | 'Paused';
  load: string;
  latency: string;
  uptime: string;
  tasksCompleted: string;
  desc: string;
  lastAction: string;
}

const INITIAL_AGENTS: SubAgent[] = [
  {
    id: 'inventory',
    title: "Inventory Agent",
    status: "Active",
    load: "32%",
    latency: "18ms",
    uptime: "99.98%",
    tasksCompleted: "14,280",
    desc: "Monitors stock levels, triggers low-stock alerts, and synchronizes real-time tickets with global supplier APIs.",
    lastAction: "Synced 42 variants for Eiffel Tower & Louvre"
  },
  {
    id: 'pricing',
    title: "Pricing Agent",
    status: "Active",
    load: "84%",
    latency: "34ms",
    uptime: "99.95%",
    tasksCompleted: "8,920",
    desc: "Calculates dynamic price adjustments based on seasonal demand, competitor trends, and exchange rates.",
    lastAction: "Adjusted weekend tier pricing for Colosseum Pass"
  },
  {
    id: 'availability',
    title: "Availability Agent",
    status: "Active",
    load: "12%",
    latency: "14ms",
    uptime: "100%",
    tasksCompleted: "29,410",
    desc: "Validates time slots, enforces group capacities, and standardizes multi-region timezones to UTC standard.",
    lastAction: "Regenerated 15-min interval slots for London Eye"
  },
  {
    id: 'policy',
    title: "Policy & Refund Agent",
    status: "Active",
    load: "5%",
    latency: "22ms",
    uptime: "99.99%",
    tasksCompleted: "1,240",
    desc: "Evaluates cancellation requests, weather guarantees, automated voucher re-issues, and refund rules.",
    lastAction: "Processed instant rain guarantee credit check"
  },
  {
    id: 'content',
    title: "Content & SEO Agent",
    status: "Active",
    load: "45%",
    latency: "120ms",
    uptime: "99.90%",
    tasksCompleted: "6,150",
    desc: "Generates localized descriptions, highlights, FAQ items, meta tags, and structured schemas.",
    lastAction: "Synthesized JSON-LD Schema for 12 new destinations"
  },
  {
    id: 'support',
    title: "Customer Support Agent",
    status: "Active",
    load: "67%",
    latency: "45ms",
    uptime: "99.97%",
    tasksCompleted: "19,800",
    desc: "First-line customer support for booking confirmations, ticket queries, directions, and modification requests.",
    lastAction: "Resolved 4 traveler ticket retrieval inquiries"
  }
];

export default function Analytics() {
  const [agents, setAgents] = useState<SubAgent[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(ag => {
      if (ag.id === id) {
        const nextStatus = ag.status === 'Active' ? 'Paused' : 'Active';
        showToast(`${ag.title} is now ${nextStatus}`);
        return { ...ag, status: nextStatus };
      }
      return ag;
    }));
  };

  const triggerManualSync = (id: string) => {
    const ag = agents.find(a => a.id === id);
    showToast(`Triggered manual execution for ${ag?.title || 'Agent'}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Operations & Autonomous Sub-Agents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and orchestrate automated sub-agents handling catalog, pricing, and orders.</p>
        </div>
        <button
          onClick={() => {
            showToast("All AI Sub-Agents synchronized successfully.");
          }}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync All Agents</span>
        </button>
      </div>

      {/* Global Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Fleet Health</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-2">100% Operational</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">6/6 Services Online</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Average Latency</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-2">26.5 ms</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Sub-50ms target met</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tasks Processed Today</span>
            <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-2">79,800</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-0.5">+14% vs yesterday</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Average System Load</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-2">40.8%</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Optimal capacity</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{agent.title}</h3>
                    <p className="text-[11px] text-slate-400">Uptime: {agent.uptime}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  agent.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  agent.status === 'Training' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4 line-clamp-2 leading-relaxed">
                {agent.desc}
              </p>

              <div className="bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 mb-4 text-[11px]">
                <span className="text-slate-400 block font-medium">Last automated action:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block truncate">
                  {agent.lastAction}
                </span>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold py-2 border-t border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-slate-400">System Load: <span className="text-slate-800 dark:text-slate-200">{agent.load}</span></span>
                <span className="text-slate-400">Latency: <span className="text-slate-800 dark:text-slate-200">{agent.latency}</span></span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                    agent.status === 'Active'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {agent.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{agent.status === 'Active' ? 'Pause' : 'Resume'}</span>
                </button>
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Configure Agent"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Details / Configuration Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">{selectedAgent.title} Settings</h3>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Autonomous Status:</span>
                  <span className="font-bold text-emerald-600">{selectedAgent.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Executed Operations:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAgent.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Response Time:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAgent.latency}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Trigger Frequency</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none">
                  <option>Real-Time Event Driven (Instant)</option>
                  <option>Periodic Polling (Every 5 Minutes)</option>
                  <option>Scheduled Daily Batch (Midnight UTC)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Concurrency Limit</label>
                <input 
                  type="number" 
                  defaultValue={25}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast(`Saved configuration for ${selectedAgent.title}`);
                  setSelectedAgent(null);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
