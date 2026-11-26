import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Receipt,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { AdminModalShell, AdminStatusBadge, TableSkeleton } from '../components/AdminMotion';
import {
  fetchAdminLiveBookings,
  exportRowsToCsv,
  LiveBookingRecord,
} from '../../utils/adminConfigClient';

type PaymentState = 'settled' | 'pending' | 'refunded';

interface PaymentTransaction {
  id: string;
  txRef: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  attractionName: string;
  amount: number;
  currency: string;
  symbol: string;
  state: PaymentState;
  method: string;
  createdAt: string;
  booking: LiveBookingRecord;
}

function derivePaymentState(status: string): PaymentState {
  const s = status.toLowerCase();
  if (s === 'cancelled' || s === 'canceled' || s === 'refunded' || s === 'rejected') return 'refunded';
  if (s === 'pending' || s === 'processing') return 'pending';
  return 'settled';
}

export default function Payments() {
  const { user } = useAuth();
  const { notify } = useAdminToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<LiveBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentState>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const loadLedger = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const rows = await fetchAdminLiveBookings(user?.email);
      setBookings(rows);
    } catch {
      notify('error', 'Failed to refresh payment transactions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, [user?.email]);

  const transactions = useMemo<PaymentTransaction[]>(() => {
    return bookings.map((b) => {
      const state = derivePaymentState(b.status);
      const cleanRef = (b.orderId || b.bookingRef || b.id).replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
      return {
        id: b.id,
        txRef: `PAY-${cleanRef.slice(-8) || '000001'}`,
        bookingRef: b.bookingRef,
        customerName: b.customerName,
        customerEmail: b.customerEmail || '—',
        attractionName: b.attractionName,
        amount: Number(b.collectedAmount || b.totalPrice || 0),
        currency: b.paymentCurrency || 'EUR',
        symbol: b.paymentSymbol || '€',
        state,
        method: b.source && b.source !== 'Direct Website' ? b.source : 'Card / Online Checkout',
        createdAt: b.createdAt,
        booking: b,
      };
    });
  }, [bookings]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (statusFilter !== 'all' && tx.state !== statusFilter) return false;
      if (!q) return true;
      return (
        tx.txRef.toLowerCase().includes(q) ||
        tx.bookingRef.toLowerCase().includes(q) ||
        tx.customerName.toLowerCase().includes(q) ||
        tx.customerEmail.toLowerCase().includes(q) ||
        tx.attractionName.toLowerCase().includes(q)
      );
    });
  }, [transactions, statusFilter, searchQuery]);

  const totals = useMemo(() => {
    let gross = 0;
    let settled = 0;
    let pending = 0;
    let refunded = 0;
    for (const tx of transactions) {
      gross += tx.amount;
      if (tx.state === 'settled') settled += tx.amount;
      else if (tx.state === 'pending') pending += tx.amount;
      else refunded += tx.amount;
    }
    return { gross, settled, pending, refunded };
  }, [transactions]);

  const handleExportCsv = () => {
    exportRowsToCsv(
      `tiqsey-payments-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Transaction ID', 'Booking Ref', 'Customer', 'Email', 'Activity', 'Channel', 'Currency', 'Amount', 'Status', 'Timestamp'],
      filteredTransactions.map((tx) => [
        tx.txRef,
        tx.bookingRef,
        tx.customerName,
        tx.customerEmail,
        tx.attractionName,
        tx.method,
        tx.currency,
        tx.amount.toFixed(2),
        tx.state,
        new Date(tx.createdAt).toISOString(),
      ])
    );
    notify('success', `Exported ${filteredTransactions.length} payment ledger rows to CSV.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Payments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Live settlement ledger, booking revenue reconciliation, and downloadable transaction receipts.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadLedger(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Gross Volume</span>
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{totals.gross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
            {transactions.length} transactions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Settled Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{totals.settled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Confirmed & completed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Pending Capture</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{totals.pending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Refunded / Cancelled</span>
            <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            €{totals.refunded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Voided or returned</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'settled', label: 'Settled' },
                { id: 'pending', label: 'Pending' },
                { id: 'refunded', label: 'Refunded' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === tab.id
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
              placeholder="Search transaction, ref, customer..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No payment records found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {transactions.length === 0
                ? 'Payment transactions appear automatically when travelers complete checkout.'
                : 'No transactions matched your current search or status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/60">
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{tx.txRef}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{tx.bookingRef}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{tx.customerName}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{tx.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{tx.attractionName}</p>
                      <p className="text-[11px] text-slate-400">{tx.method}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={tx.state} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      {tx.symbol}
                      {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <AdminModalShell open={Boolean(selectedTx)} onClose={() => setSelectedTx(null)} maxWidthClass="max-w-md">
        {selectedTx && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Payment Receipt</h2>
                <p className="text-[11px] text-slate-500 font-mono">{selectedTx.txRef}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Amount Charged</p>
                  <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {selectedTx.symbol}
                    {selectedTx.amount.toFixed(2)} <span className="text-xs font-normal text-slate-400">{selectedTx.currency}</span>
                  </p>
                </div>
                <AdminStatusBadge status={selectedTx.state} />
              </div>

              <dl className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-slate-500">Booking Reference</dt>
                  <dd className="font-mono font-semibold text-slate-900 dark:text-white">{selectedTx.bookingRef}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-slate-500">Customer</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white text-right">{selectedTx.customerName}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="text-slate-800 dark:text-slate-200 text-right">{selectedTx.attractionName}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-slate-500">Channel</dt>
                  <dd className="text-slate-800 dark:text-slate-200">{selectedTx.method}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-slate-500">Recorded At</dt>
                  <dd className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {new Date(selectedTx.createdAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/70 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const ref = selectedTx.bookingRef;
                  setSelectedTx(null);
                  navigate(`/bookings?search=${encodeURIComponent(ref)}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                View Booking
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </AdminModalShell>
    </div>
  );
}
