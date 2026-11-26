import React, { useState, useEffect, useMemo } from 'react';
import {
  Headphones,
  Plus,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  Save,
  Mail,
  Ticket,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import {
  ADMIN_EASE,
  AdminModalShell,
  AdminStatusBadge,
  TableSkeleton,
} from '../components/AdminMotion';
import {
  SupportTicket,
  loadSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
} from '../../utils/adminConfigClient';

const PRIORITY_TONE: Record<SupportTicket['priority'], string> = {
  low: 'text-slate-500 dark:text-slate-400',
  medium: 'text-blue-600 dark:text-sky-400',
  high: 'text-amber-600 dark:text-amber-400',
  urgent: 'text-rose-600 dark:text-rose-400 font-bold',
};

const EMPTY_TICKET = {
  customerName: '',
  customerEmail: '',
  bookingRef: '',
  subject: '',
  category: 'Booking' as SupportTicket['category'],
  priority: 'medium' as SupportTicket['priority'],
  status: 'open' as SupportTicket['status'],
  message: '',
  internalNotes: '',
};

export default function Support() {
  const { user } = useAuth();
  const { notify } = useAdminToast();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_TICKET);

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [drawerStatus, setDrawerStatus] = useState<SupportTicket['status']>('open');
  const [drawerPriority, setDrawerPriority] = useState<SupportTicket['priority']>('medium');
  const [drawerNotes, setDrawerNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAll = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await loadSupportTickets(user?.email);
      setTickets(res.tickets);
    } catch {
      notify('error', 'Failed to load support tickets.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user?.email]);

  const openTicketDrawer = (t: SupportTicket) => {
    setActiveTicket(t);
    setDrawerStatus(t.status);
    setDrawerPriority(t.priority);
    setDrawerNotes(t.internalNotes || '');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.subject.trim() || !form.message.trim()) {
      notify('warning', 'Please fill in customer name, email, subject, and message.');
      return;
    }
    setCreating(true);
    const res = await createSupportTicket(form, user?.email);
    setCreating(false);
    if (!res.ok || !res.ticket) {
      notify('error', res.error || 'Could not create support ticket.');
      return;
    }
    setTickets((prev) => [res.ticket!, ...prev]);
    setForm(EMPTY_TICKET);
    setCreateOpen(false);
    notify('success', `Created support ticket ${res.ticket.ticketNumber}.`);
  };

  const handleSaveDrawer = async () => {
    if (!activeTicket) return;
    setUpdating(true);
    const res = await updateSupportTicket(
      activeTicket.id,
      {
        status: drawerStatus,
        priority: drawerPriority,
        internalNotes: drawerNotes,
      },
      user?.email
    );
    setUpdating(false);
    if (!res.ok || !res.ticket) {
      notify('error', res.error || 'Failed to update ticket.');
      return;
    }
    setTickets((prev) => prev.map((t) => (t.id === res.ticket!.id ? res.ticket! : t)));
    setActiveTicket(res.ticket);
    notify('success', `Updated ${res.ticket.ticketNumber}.`);
  };

  const handleDelete = async (ticket: SupportTicket) => {
    const res = await deleteSupportTicket(ticket.id, user?.email);
    if (!res.ok) {
      notify('error', res.error || 'Failed to delete ticket.');
      return;
    }
    setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
    if (activeTicket?.id === ticket.id) setActiveTicket(null);
    notify('info', `Deleted ticket ${ticket.ticketNumber}.`);
  };

  const counts = useMemo(() => {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;
    for (const t of tickets) {
      if (t.status === 'open') open++;
      else if (t.status === 'in_progress') inProgress++;
      else resolved++;
    }
    return { open, inProgress, resolved };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        (t.bookingRef || '').toLowerCase().includes(q)
      );
    });
  }, [tickets, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Support</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track traveler inquiries, booking assistance requests, refund follow-ups, and internal resolution notes.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Open Queue</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">{counts.open}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {counts.inProgress}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {counts.resolved}
          </p>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start">
            {(
              [
                { id: 'all', label: 'All Tickets' },
                { id: 'open', label: 'Open' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
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
              placeholder="Search ticket #, customer, ref..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Support queue is clear</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Log a customer inquiry or booking follow-up ticket to track resolution status across your team.
            </p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Support Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/60">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => openTicketDrawer(t)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{t.subject}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {t.ticketNumber}
                        {t.bookingRef ? ` · ${t.bookingRef}` : ''}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{t.customerName}</p>
                      <p className="text-[11px] text-slate-400">{t.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{t.category}</td>
                    <td className={`py-3.5 px-4 capitalize font-semibold ${PRIORITY_TONE[t.priority]}`}>
                      {t.priority}
                    </td>
                    <td className="py-3.5 px-4">
                      <AdminStatusBadge
                        status={t.status === 'resolved' ? 'completed' : t.status === 'in_progress' ? 'pending' : 'failed'}
                        label={t.status === 'in_progress' ? 'In Progress' : t.status === 'resolved' ? 'Resolved' : 'Open'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTicketDrawer(t);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-sky-950/40 cursor-pointer"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t);
                          }}
                          title="Delete ticket"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <AdminModalShell open={createOpen} onClose={() => setCreateOpen(false)} maxWidthClass="max-w-lg">
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Create Support Ticket</h2>
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Elena Rostova"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="elena@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Booking Ref (optional)</label>
                <input
                  type="text"
                  value={form.bookingRef}
                  onChange={(e) => setForm({ ...form, bookingRef: e.target.value })}
                  placeholder="TIQ-1042"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as SupportTicket['category'] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Booking">Booking</option>
                  <option value="Tickets">Tickets</option>
                  <option value="Refund">Refund</option>
                  <option value="Account">Account</option>
                  <option value="Technical">Technical</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as SupportTicket['priority'] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Reschedule museum entry timeslot"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Details</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe the customer request or issue..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/70 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </AdminModalShell>

      {/* Ticket Resolution Drawer */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 z-[95] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTicket(null)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: ADMIN_EASE }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-slate-400">{activeTicket.ticketNumber}</p>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{activeTicket.subject}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                <div className="space-y-1.5 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">{activeTicket.customerName}</p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {activeTicket.customerEmail}
                  </p>
                  {activeTicket.bookingRef && (
                    <p className="text-slate-500 font-mono flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5" /> {activeTicket.bookingRef}
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Customer Message</p>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeTicket.message}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                    <select
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value as SupportTicket['status'])}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                    <select
                      value={drawerPriority}
                      onChange={(e) => setDrawerPriority(e.target.value as SupportTicket['priority'])}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Internal Resolution Notes</label>
                  <textarea
                    rows={5}
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="Record actions taken, voucher re-issue details, or refund confirmations..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(activeTicket)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSaveDrawer}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  {updating ? 'Saving...' : 'Save Update'}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
