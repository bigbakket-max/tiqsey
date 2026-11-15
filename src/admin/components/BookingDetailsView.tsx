import React, { useState } from 'react';
import { 
  ArrowLeft, Copy, MoreVertical, AlertTriangle, User, Layers, Wallet, Receipt, Mail, Phone, MapPin, 
  Calendar, Clock, ChevronDown, ChevronUp, Plus, Ticket, Edit, CheckCircle2, 
  HelpCircle, FileText, Globe, Laptop, Info, ShieldCheck, X, RefreshCw, DollarSign, ExternalLink,
  CreditCard, Compass, Lightbulb, QrCode, Download, ShieldAlert, Check, Users, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EurToInrTooltip } from './EurToInrTooltip';
import { AllocateVendorModal } from './AllocateVendorModal';
import { downloadTicketVoucher } from '../../utils/ticketDownloader';

interface Passenger {
  name: string;
  type: 'Adult' | 'Child' | 'Youth' | 'Senior';
  id?: string;
  email?: string;
  phone?: string;
  phoneCode?: string;
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
  status?: string;
}

interface AdminBooking {
  id: string;
  bookingRef: string;
  orderId: string;
  order_number?: string;
  pnr_number?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  attractionId: string;
  attractionName: string;
  variant: string;
  vendorPayable: string;
  totalPrice: number;
  collectedAmount: number;
  travelers: number;
  bookingDate: string;
  timeslot?: string;
  children?: number;
  status: string;
  passengers: Passenger[];
  notes?: string;
  attractionImageUrl?: string;
  city?: string;
  paymentCurrency?: string;
  paymentPrice?: number;
  paymentSymbol?: string;
}

interface BookingDetailsViewProps {
  booking: AdminBooking;
  onBack: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateBooking: (updated: AdminBooking) => void;
}

export default function BookingDetailsView({ 
  booking, 
  onBack, 
  onUpdateStatus, 
  onUpdateBooking 
}: BookingDetailsViewProps) {
  // Collapsible sections state
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    relatedBookings: false,
    metaData: false,
    utmParams: false,
    resellerInfo: false,
  });

  // Local interactive states for demo capabilities
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [isEditingTimeSlot, setIsEditingTimeSlot] = useState(false);
  const [timeSlot, setTimeSlot] = useState(booking.timeslot || '11:30 AM');
  const [isAddingPassenger, setIsAddingPassenger] = useState(false);
  const [showPayments, setShowPayments] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [newPassengerName, setNewPassengerName] = useState('');
  const [newPassengerEmail, setNewPassengerEmail] = useState('');
  const [newPassengerType, setNewPassengerType] = useState<'Adult' | 'Child'>('Adult');
  const [showAllocateVendorModal, setShowAllocateVendorModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [adminNotes, setAdminNotes] = useState(booking.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; title: string; time: string; color: string }>>([
    { id: '1', title: 'Booking Created & Confirmed', time: booking.createdAt || '25 Jul 2026 02:45 PM', color: 'bg-emerald-500' },
    { id: '2', title: `Status synced: ${booking.status.toUpperCase()}`, time: 'Just now', color: 'bg-blue-500' }
  ]);
  const [showAllHistory, setShowAllHistory] = useState(true);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      triggerToast(`${label} copied to clipboard!`, 'success');
    } catch {
      triggerToast(`Could not copy ${label}.`, 'error');
    }
  };

  const handleDownload = async (b: AdminBooking) => {
    try {
      await downloadTicketVoucher({
        bookingId: b.id,
        bookingRef: b.bookingRef,
        order_number: b.order_number,
        pnr_number: b.pnr_number,
        attractionName: b.attractionName,
        attractionImageUrl: b.attractionImageUrl,
        city: b.city || 'Paris',
        bookingDate: b.bookingDate,
        timeSlot: b.timeslot || '11:15 AM - Standard Admission',
        passengerName: b.customerName,
        ticketsCount: b.travelers,
        totalPrice: b.totalPrice,
        additionalPassengers: b.passengers?.map(p => {
          const names = p.name.split(' ');
          return {
            firstName: names[0] || 'Passenger',
            lastName: names.slice(1).join(' ') || 'User',
            type: p.type || 'Adult'
          };
        }) || []
      });
      triggerToast(`Ticket Voucher downloaded successfully for ${b.bookingRef}!`, 'success');
    } catch (e) {
      console.error('Error generating ticket download', e);
      triggerToast('Error issuing voucher. Please try again.', 'error');
    }
  };

  const toggleCollapse = (section: keyof typeof sectionsCollapsed) => {
    setSectionsCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const deriveInitialPassengers = (b: AdminBooking): Passenger[] => {
    if (b.passengers && b.passengers.length > 0) {
      return b.passengers;
    }
    const fullName = (b.customerName || 'Lead Traveler').trim();
    const parts = fullName.split(/\s+/);
    return [
      {
        name: fullName,
        email: b.customerEmail || '',
        phone: b.customerPhone || '',
        firstName: parts[0] || fullName,
        lastName: parts.slice(1).join(' ') || '',
        type: 'Adult'
      }
    ];
  };

  const [passengersList, setPassengersList] = useState<Passenger[]>(() => deriveInitialPassengers(booking));

  React.useEffect(() => {
    setPassengersList(deriveInitialPassengers(booking));
    setTimeSlot(booking.timeslot || 'Flexible');
  }, [booking.id, booking.timeslot, booking.passengers]);

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 uppercase tracking-wider">CONFIRMED</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-orange-500/10 text-orange-600 border border-orange-200/50 uppercase tracking-wider">PENDING</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-sky-500/10 text-sky-600 border border-sky-200/50 uppercase tracking-wider">COMPLETED</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-red-500/10 text-red-600 border border-red-200/50 uppercase tracking-wider">CANCELLED</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-500/10 text-slate-500 border border-slate-200/50 uppercase tracking-wider">REJECTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-500/10 text-slate-600 border border-slate-200/50 uppercase tracking-wider">{status.replace(/_/g, ' ').toUpperCase()}</span>;
    }
  };

  const statusColors = {
    borderColor: booking.status === 'confirmed' ? 'border-emerald-500' 
      : booking.status === 'completed' ? 'border-sky-500'
      : booking.status === 'cancelled' ? 'border-red-500'
      : booking.status === 'rejected' ? 'border-slate-400'
      : 'border-[#ff9500]',
    bgColor: booking.status === 'confirmed' ? 'bg-emerald-500' 
      : booking.status === 'completed' ? 'bg-sky-500'
      : booking.status === 'cancelled' ? 'bg-red-500'
      : booking.status === 'rejected' ? 'bg-slate-400'
      : 'bg-[#ff9500]',
    shadowColor: booking.status === 'confirmed' ? 'shadow-emerald-500/10' 
      : booking.status === 'completed' ? 'shadow-sky-500/10'
      : booking.status === 'cancelled' ? 'shadow-red-500/10'
      : booking.status === 'rejected' ? 'shadow-slate-400/10'
      : 'shadow-orange-500/10',
    icon: <Lightbulb className="w-5 h-5 text-white" />
  };

  return (
    <div 
      style={{ '--color-brand': '#5fa6d9' } as React.CSSProperties}
      className="space-y-6 w-full pb-24 md:pb-16 px-1 sm:px-4 md:px-6 font-sans text-slate-800 dark:text-slate-100"
    >
      
      {/* Toast alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 md:top-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-sans"
          >
            {toastType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            {toastType === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
            {toastType === 'error' && <AlertTriangle className="w-5 h-5 text-brand shrink-0" />}
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation / Header Area */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#5fa6d9] transition-colors cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 min-h-[38px] shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings List
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
          Last updated: Just now
        </span>
      </div>

      {/* 1. ORDER SUMMARY CARD & PAYMENTS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        {/* Order Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-brand/10 text-brand">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">Order Summary</h3>
              <p className="text-xs text-slate-400">Financial overview and payment status</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setShowPayments(!showPayments)}
            className="self-start sm:self-auto border border-brand/40 hover:bg-brand/10 text-brand px-4 py-2 min-h-[38px] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>{showPayments ? 'Hide Payments' : 'View Payments'}</span>
          </button>
        </div>

        {/* Order Summary Metrics - Clean Responsive Grid Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Order ID</span>
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 select-all break-all tabular-nums">{booking.order_number || booking.orderId || 'OD8229'}</span>
          </div>
          
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Booked By</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{booking.customerName || 'Arsalan F'}</span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Created At</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{booking.createdAt || '12 Jul 2026'}</span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Bookings</span>
            </div>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">1</span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <Wallet className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Net Amount</span>
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              <EurToInrTooltip 
                amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 40)} 
                bookingDate={booking.bookingDate} 
                currency={booking.paymentCurrency || "USD"}
              >
                {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: booking.paymentCurrency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(booking.paymentPrice)
                ) : (
                  `USD ${booking.totalPrice || 40}`
                )}
              </EurToInrTooltip>
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <Wallet className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Gross Amount</span>
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              <EurToInrTooltip 
                amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 40)} 
                bookingDate={booking.bookingDate} 
                currency={booking.paymentCurrency || "USD"}
              >
                {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: booking.paymentCurrency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(booking.paymentPrice)
                ) : (
                  `USD ${booking.totalPrice || 40}`
                )}
              </EurToInrTooltip>
            </span>
          </div>
        </div>

        {/* Payments Section with Smooth AnimatePresence */}
        <AnimatePresence>
          {showPayments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 space-y-4"
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Payment Transactions
              </h4>

              <div className="w-full max-w-[340px] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 shadow-md relative overflow-hidden group hover:border-brand/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400">Payment 1</span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <span>12 Jul 2026</span>
                    <MoreVertical className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    <EurToInrTooltip 
                      amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 40)} 
                      bookingDate={booking.bookingDate} 
                      currency={booking.paymentCurrency || "USD"}
                    >
                      {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: booking.paymentCurrency,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(booking.paymentPrice)
                      ) : (
                        `USD ${booking.totalPrice || 40}`
                      )}
                    </EurToInrTooltip>
                  </p>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Successful
                  </span>
                </div>

                {/* PAID Stamp */}
                <div className="absolute right-4 top-14 -rotate-[15deg] z-10 pointer-events-none opacity-90">
                  <div className="border-[2.5px] border-emerald-500 rounded-xl px-3 py-1.5 text-emerald-500 text-xs font-black tracking-widest flex items-center justify-center shadow-xs">
                    PAID
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">Payment Ref:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 select-all">dUqvQdv95nm</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">Mode:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">/TazapayV2</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Transaction ID:</span>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all select-all">chk_d99p9h7hhjpr05ekuh80</span>
                  </div>

                  <AnimatePresence>
                    {showPaymentDetails && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-2.5 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-500">Gateway:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Stripe</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500 block mb-0.5">Card Details:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                            <CreditCard className="w-3.5 h-3.5 text-brand" />
                            •••• •••• •••• 4242
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-500">IP Address:</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">192.168.1.1</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 text-center">
                    <button 
                      type="button"
                      onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                      className="text-brand text-xs font-bold hover:underline cursor-pointer"
                    >
                      {showPaymentDetails ? 'Hide Payment Details' : 'Show Advanced Details'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. ACTIVE BOOKING CARD */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        
        {/* Left Status Tag Badge */}
        <div className={`absolute right-full top-6 w-6 sm:w-9 lg:w-11 h-10 sm:h-12 lg:h-14 ${statusColors.bgColor} rounded-tl-2xl rounded-bl-2xl rounded-tr-none rounded-br-none flex items-center justify-center shadow-md ${statusColors.shadowColor} z-10 translate-x-[1px]`}>
          {statusColors.icon}
        </div>

        {/* Header warning & Status badges */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {booking.attractionName || 'Acropolis of Athens Entry Tickets | Skip-The-Line Admission Tickets'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Variant: {booking.variant || 'Acropolis of Athens General Admission Tickets'}
              </p>
            </div>

            {/* Actions buttons Row */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={booking.status}
                onChange={(e) => {
                  const newSt = e.target.value;
                  onUpdateStatus(booking.id, newSt);
                  triggerToast(`Booking status updated to ${newSt.toUpperCase()}`, "success");
                }}
                className="min-h-[38px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand cursor-pointer shadow-xs"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
              {booking.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="min-h-[38px] border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
              )}
              {booking.status !== 'confirmed' && (
                <button 
                  type="button"
                  onClick={() => {
                    onUpdateStatus(booking.id, 'confirmed');
                    triggerToast("Booking marked as CONFIRMED successfully!", "success");
                  }}
                  className="min-h-[38px] bg-brand hover:opacity-90 text-white px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
              Direct Booking
            </span>
          </div>
        </div>

        {/* Travel Specs Grid - Clean Responsive Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">PNR</p>
            <p className="font-extrabold text-slate-800 dark:text-slate-200 select-all">{booking.pnr_number || booking.bookingRef || 'BKWDWDOLOCH7'}</p>
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Travelers</p>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.travelers || 2}</p>
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Date of Travel</p>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.bookingDate || '30 Jun 2026'}</p>
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">End Date</p>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.bookingDate || '30 Jun 2026'}</p>
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Time Slot</p>
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-extrabold">
              {isEditingTimeSlot ? (
                <input 
                  type="text" 
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  onBlur={() => {
                    setIsEditingTimeSlot(false);
                    const cleaned = timeSlot.trim() || 'Flexible';
                    setTimeSlot(cleaned);
                    if (cleaned !== (booking.timeslot || 'Flexible')) {
                      onUpdateBooking({ ...booking, timeslot: cleaned });
                      triggerToast('Time slot updated.', 'success');
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      (e.currentTarget as HTMLInputElement).blur();
                    }
                  }}
                  className="w-full border rounded bg-white dark:bg-slate-800 text-xs px-1.5 py-0.5 font-bold"
                  autoFocus
                />
              ) : (
                <>
                  <span>{timeSlot}</span>
                  <button type="button" onClick={() => setIsEditingTimeSlot(true)} className="text-brand hover:underline text-[10px] font-bold cursor-pointer">
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Net Amount</p>
            <p className="font-extrabold text-slate-900 dark:text-white">
              <EurToInrTooltip amount={booking.totalPrice || 66} bookingDate={booking.bookingDate} currency="USD">
                USD {booking.totalPrice || 66}
              </EurToInrTooltip>
            </p>
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Gross Amount</p>
            <p className="font-extrabold text-slate-900 dark:text-white">
              <EurToInrTooltip amount={booking.totalPrice || 66} bookingDate={booking.bookingDate} currency="USD">
                USD {booking.totalPrice || 66}
              </EurToInrTooltip>
            </p>
          </div>
        </div>

          {/* Booking Contents Embedded Section */}
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 pt-px" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">Booking Contents</h4>
              <button 
                type="button"
                onClick={() => triggerToast("Directing to package configurations and inventory allocations edit panel...", "info")}
                className="text-orange-500 text-[11px] font-bold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {(() => {
              const units = booking.travelers || 2;
              const currentPrice = booking.totalPrice || 133.431;
              const pricePerUnit = currentPrice / units;
              const discountPercent = 6;
              const struckThroughPrice = currentPrice * 1.060451;

              return (
                <>
                  {/* Mobile Stacked Card View (< lg) */}
                  <div className="lg:hidden bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Inventory Type</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">Adult</p>
                      </div>
                      <span className="bg-[#bbf7d0]/70 text-[#166534] dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-bold rounded-md">
                        -{discountPercent}% OFF
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Units</p>
                        <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5 tabular-nums">{units}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Price / Unit</p>
                        <p className="font-semibold text-slate-600 dark:text-slate-300 mt-0.5 tabular-nums">CAD {pricePerUnit.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-medium">Total Price</p>
                        <p className="line-through text-slate-400 text-[10px] tabular-nums">CAD {struckThroughPrice.toFixed(2)}</p>
                        <p className="font-extrabold text-slate-900 dark:text-white tabular-nums">CAD {currentPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table View (>= lg) */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="text-slate-400 dark:text-slate-500 font-normal">
                          <th className="pb-3 pl-4 font-normal text-left">Inventory Type</th>
                          <th className="pb-3 px-3 font-normal text-center">Units</th>
                          <th className="pb-3 px-3 font-normal text-center">Price per Unit</th>
                          <th className="pb-3 pr-4 font-normal text-right">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700 dark:text-slate-300">
                        <tr className="bg-slate-50/60 dark:bg-slate-900/20 rounded-lg overflow-hidden">
                          <td className="py-4 pl-4 rounded-l-lg text-slate-600 dark:text-slate-400 text-xs font-normal text-left">Adult</td>
                          <td className="py-4 px-3 text-center text-slate-800 dark:text-slate-100 text-xs font-normal tabular-nums">{units}</td>
                          <td className="py-4 px-3 text-center text-slate-600 dark:text-slate-400 text-xs font-normal tabular-nums">CAD {pricePerUnit.toFixed(3)}</td>
                          <td className="py-4 pr-4 rounded-r-lg text-right">
                            <div className="inline-flex items-center gap-2.5 text-left">
                              <div className="flex flex-col">
                                <span className="line-through text-slate-400 dark:text-slate-500 text-[10px] font-normal leading-tight mb-0.5 tabular-nums">
                                  CAD {struckThroughPrice.toFixed(3)}
                                </span>
                                <span className="text-slate-800 dark:text-slate-200 text-xs font-semibold leading-tight tabular-nums">
                                  CAD {currentPrice.toFixed(3)}
                                </span>
                              </div>
                              <span className="bg-[#bbf7d0]/70 text-[#166534] dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold rounded-md leading-none">
                                {discountPercent}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* BOOKING LEVEL INFORMATION CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Booking Level Information</h3>
              <p className="text-[11px] text-slate-400">Geographic jurisdiction and region data</p>
            </div>
          </div>
          
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px]">State</span>
              <strong className="text-slate-800 dark:text-slate-200 font-extrabold">NA</strong>
            </div>
            <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Country</span>
              <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{(() => {
                const city = booking.city?.toLowerCase() || '';
                if (city.includes('paris')) return 'France';
                if (city.includes('sydney')) return 'Australia';
                if (city.includes('singapore')) return 'Singapore';
                if (city.includes('tokyo') || city.includes('osaka')) return 'Japan';
                if (city.includes('barcelona') || city.includes('madrid')) return 'Spain';
                if (city.includes('amsterdam')) return 'Netherlands';
                if (city.includes('london')) return 'United Kingdom';
                if (city.includes('new york') || city.includes('usa') || city.includes('san diego')) return 'United States';
                return 'Canada';
              })()}</strong>
            </div>
          </div>
        </div>

        {/* 4. CUSTOMER INFORMATION & PASSENGER DETAILS CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-brand/10 text-brand">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Customer Information & Passenger Details</h3>
              <p className="text-xs text-slate-400">Primary guest contacts and passenger manifest</p>
            </div>
          </div>
          
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

          {/* Customer Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="p-2 bg-white dark:bg-slate-900 text-brand rounded-lg shadow-xs">
                <User className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Travelers</p>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{booking.travelers || 2}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="p-2 bg-white dark:bg-slate-900 text-brand rounded-lg shadow-xs">
                <User className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Name</p>
                <p className="font-extrabold text-slate-900 dark:text-white truncate mt-0.5">{booking.customerName || 'Jacob davis'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 min-w-0">
              <span className="p-2 bg-white dark:bg-slate-900 text-brand rounded-lg shadow-xs shrink-0">
                <Mail className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                <p className="font-extrabold text-slate-900 dark:text-white truncate mt-0.5">{booking.customerEmail || 'alyshaawaluddin@gmail.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="p-2 bg-white dark:bg-slate-900 text-brand rounded-lg shadow-xs">
                <Phone className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Phone</p>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{booking.customerPhone || '+6281381847386'}</p>
              </div>
            </div>
          </div>

          {/* Subsection Divider */}
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

          {/* Subsection Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Passenger Details Manifest</h4>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">Total Registered: {passengersList.length} Passengers</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                type="button"
                onClick={() => setIsAddingPassenger(true)}
                className="flex items-center gap-1.5 bg-brand hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Passenger
              </button>
            </div>
          </div>

          {/* Add passenger inline modal */}
          <AnimatePresence>
            {isAddingPassenger && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Add New Passenger Profile</h4>
                  <button type="button" onClick={() => setIsAddingPassenger(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={newPassengerName}
                      onChange={e => setNewPassengerName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={newPassengerEmail}
                      onChange={e => setNewPassengerEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Passenger Type</label>
                    <select 
                      value={newPassengerType}
                      onChange={e => setNewPassengerType(e.target.value as 'Adult' | 'Child')}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                    >
                      <option value="Adult">Adult</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button type="button" onClick={() => setIsAddingPassenger(false)} className="px-4 py-2 text-xs text-slate-600 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer">
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      const trimmedName = newPassengerName.trim();
                      if (!trimmedName) {
                        triggerToast('Please enter the traveler full name.', 'error');
                        return;
                      }
                      const parts = trimmedName.split(/\s+/);
                      const updatedPassengers: Passenger[] = [...passengersList, {
                        id: `pax-${Date.now()}`,
                        name: trimmedName,
                        email: newPassengerEmail.trim() || booking.customerEmail || '',
                        firstName: parts[0] || trimmedName,
                        lastName: parts.slice(1).join(' ') || '',
                        type: newPassengerType,
                        status: 'Saved'
                      }];
                      setPassengersList(updatedPassengers);
                      onUpdateBooking({
                        ...booking,
                        passengers: updatedPassengers,
                        travelers: Math.max(booking.travelers || 0, updatedPassengers.length)
                      });
                      setNewPassengerName('');
                      setNewPassengerEmail('');
                      setIsAddingPassenger(false);
                      triggerToast("New traveler profile saved successfully!", "success");
                    }}
                    className="px-4 py-2 bg-brand text-white rounded-xl font-bold cursor-pointer shadow-xs"
                  >
                    Save Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Passengers Mobile Cards (< lg) */}
          <div className="lg:hidden space-y-3">
            {passengersList.map((pass, index) => {
              const dobString = pass.dob || '';
              const dob = dobString ? new Date(dobString) : null;
              let computedAge: string | number = '-';
              if (dob && !isNaN(dob.getTime())) {
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                  age--;
                }
                computedAge = age >= 0 ? age : '-';
              }
              const nameParts = (pass.name || '').trim().split(/\s+/);
              return (
                <div key={index} className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">{pass.name}</span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-amber-950 tracking-wider shrink-0">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => triggerToast(`Passport details noted for passenger ${index+1}.`, "info")}
                      className="text-brand font-bold text-xs hover:underline cursor-pointer px-2.5 py-1.5 rounded-md bg-brand/5 border border-brand/20 min-h-[36px]"
                    >
                      + Add Passport
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Email</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 break-all select-all mt-0.5">{pass.email || (index === 0 ? booking.customerEmail : '') || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Phone</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums mt-0.5">{[pass.phoneCode, pass.phone || (index === 0 ? booking.customerPhone : '')].filter(Boolean).join(' ') || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Gender & Age</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 uppercase mt-0.5 tabular-nums">
                        {pass.gender || pass.type || 'Adult'} • <span className="text-[#5fa6d9]">{computedAge !== '-' ? `${computedAge} yrs` : '—'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">First / Last Name</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{pass.firstName || nameParts[0] || '—'} {pass.lastName || nameParts.slice(1).join(' ')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Date of Birth</p>
                      <p className="font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums mt-0.5">{pass.dob || '—'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Passengers Table Grid Layout Desktop (>= lg) */}
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5 px-3">Add Passport</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-center">Country Code</th>
                  <th className="py-2.5 px-3">First Name</th>
                  <th className="py-2.5 px-3">Last Name</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Date of Birth</th>
                  <th className="py-2.5 px-3 text-center">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                {passengersList.map((pass, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-3 px-3">
                      <button 
                        type="button"
                        onClick={() => triggerToast(`Uploading passport attachments for passenger ${index+1}...`, "info")}
                        className="text-brand font-bold hover:underline cursor-pointer"
                      >
                        + Add Passport
                      </button>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span>{pass.name}</span>
                        {index === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-400 text-amber-950 tracking-wider">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 break-all select-all">{pass.email || (index === 0 ? booking.customerEmail : '') || '—'}</td>
                    <td className="py-3 px-3 tabular-nums">{pass.phone || (index === 0 ? booking.customerPhone : '') || '—'}</td>
                    <td className="py-3 px-3 text-center tabular-nums">{pass.phoneCode || '—'}</td>
                    <td className="py-3 px-3">{pass.firstName || (pass.name || '').trim().split(/\s+/)[0] || '—'}</td>
                    <td className="py-3 px-3">{pass.lastName || (pass.name || '').trim().split(/\s+/).slice(1).join(' ') || '—'}</td>
                    <td className="py-3 px-3 uppercase text-[10px]">{pass.gender || pass.type || 'Adult'}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{pass.dob || '—'}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#5fa6d9] dark:text-[#7da7c4] font-mono tabular-nums">
                      {(() => {
                        const dobString = pass.dob || '';
                        if (!dobString) return '-';
                        const dob = new Date(dobString);
                        if (isNaN(dob.getTime())) return '-';
                        const today = new Date();
                        let age = today.getFullYear() - dob.getFullYear();
                        const m = today.getMonth() - dob.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                          age--;
                        }
                        return age >= 0 ? age : '-';
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* 5. PAYMENT INFORMATION CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Payment Information</h3>
            <p className="text-xs text-slate-400">Financial breakdown, collected amounts, and payment parts</p>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

        {/* Payment Metrics Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Total Amount */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">TOTAL AMOUNT</p>
            <p className="font-extrabold text-[#e3000f] text-base">
              <EurToInrTooltip 
                amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 66)} 
                bookingDate={booking.bookingDate} 
                currency={booking.paymentCurrency || "USD"}
              >
                {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: booking.paymentCurrency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(booking.paymentPrice)
                ) : (
                  `USD ${booking.totalPrice || 66}`
                )}
              </EurToInrTooltip>
            </p>
          </div>

          {/* Collected */}
          <div className="relative bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <span className="absolute top-3 right-3 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              100.00%
            </span>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">COLLECTED</p>
              <p className="font-extrabold text-slate-900 dark:text-white text-base">
                <EurToInrTooltip 
                  amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.collectedAmount ?? booking.totalPrice ?? 66)} 
                  bookingDate={booking.bookingDate} 
                  currency={booking.paymentCurrency || "USD"}
                >
                  {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: booking.paymentCurrency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(booking.paymentPrice)
                  ) : (
                    `USD ${booking.collectedAmount ?? booking.totalPrice ?? 66}`
                  )}
                </EurToInrTooltip>
              </p>
            </div>
          </div>

          {/* Pending */}
          <div className="relative bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <span className="absolute top-3 right-3 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              0.00%
            </span>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">PENDING</p>
              <p className="font-extrabold text-slate-900 dark:text-white text-base">{booking.paymentCurrency || "USD"} 0</p>
            </div>
          </div>

          {/* Authorized Amount */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">AUTHORIZED AMOUNT</p>
            <p className="font-extrabold text-slate-900 dark:text-white text-base">{booking.paymentCurrency || "USD"} 0</p>
          </div>

          {/* Refunded */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">REFUNDED</p>
            <p className="font-extrabold text-slate-400 text-base">N.A.</p>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

        {/* Payment Parts List Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] pt-1">
            <CreditCard className="w-4 h-4 text-[#94a3b8]" />
            <span>PAYMENT PARTS</span>
          </div>

          {/* Mobile Stacked Card for Payment Parts (< lg) */}
          <div className="lg:hidden bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Part #1</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-[10px] font-black tracking-wider uppercase">
                  PAID
                </span>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                <EurToInrTooltip 
                  amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 66)} 
                  bookingDate={booking.bookingDate} 
                  currency={booking.paymentCurrency || "USD"}
                >
                  {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: booking.paymentCurrency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(booking.paymentPrice)
                  ) : (
                    `USD ${booking.totalPrice || 66}`
                  )}
                </EurToInrTooltip>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Paid On</p>
                <p className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums mt-0.5">{booking.bookingDate || '30 Jun 2026'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Due Date</p>
                <p className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums mt-0.5">{booking.bookingDate || '30 Jun 2026'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Pay To</p>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">portal</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase text-slate-400">Collected in Payment</p>
                <p className="font-mono text-[#e3000f] font-bold select-all break-all mt-0.5">chk_d9119e3p124cb543ns8g</p>
              </div>
            </div>
          </div>

          {/* Desktop Table for Payment Parts (>= lg) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-[#94a3b8] dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800 pb-3">
                  <th className="pb-3 pr-3 font-bold">PART</th>
                  <th className="pb-3 px-3 font-bold">AMOUNT</th>
                  <th className="pb-3 px-3 font-bold">PAID ON</th>
                  <th className="pb-3 px-3 font-bold">DUE DATE</th>
                  <th className="pb-3 px-3 font-bold">STATUS</th>
                  <th className="pb-3 px-3 font-bold">PAY TO</th>
                  <th className="pb-3 pl-3 font-bold">COLLECTED IN PAYMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                  <td className="py-4 pr-3 font-medium text-slate-600 dark:text-slate-400 tabular-nums">1</td>
                  <td className="py-4 px-3 font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    <EurToInrTooltip 
                      amount={booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 66)} 
                      bookingDate={booking.bookingDate} 
                      currency={booking.paymentCurrency || "USD"}
                    >
                      {booking.paymentCurrency && booking.paymentPrice !== undefined ? (
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: booking.paymentCurrency,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(booking.paymentPrice)
                      ) : (
                        `USD ${booking.totalPrice || 66}`
                      )}
                    </EurToInrTooltip>
                  </td>
                  <td className="py-4 px-3 font-medium text-slate-600 dark:text-slate-400 tabular-nums">{booking.bookingDate || '30 Jun 2026'}</td>
                  <td className="py-4 px-3 font-medium text-slate-600 dark:text-slate-400 tabular-nums">{booking.bookingDate || '30 Jun 2026'}</td>
                  <td className="py-4 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-[10px] font-black tracking-wider uppercase">
                      PAID
                    </span>
                  </td>
                  <td className="py-4 px-3 font-medium text-slate-600 dark:text-slate-400">portal</td>
                  <td className="py-4 pl-3 font-mono text-[#e3000f] font-bold select-all">
                    chk_d9119e3p124cb543ns8g
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. RELATED BOOKINGS COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleCollapse('relatedBookings')}
          className="w-full flex items-center justify-between p-5 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Layers className="w-4 h-4" />
            </span>
            <span>Related Bookings (0)</span>
          </div>
          {sectionsCollapsed.relatedBookings ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        <AnimatePresence>
          {!sectionsCollapsed.relatedBookings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-8 text-center text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/20">
                No related bookings found for this order.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 8. STARTING/MEETING POINT ALERT BANNER */}
      <div 
        onClick={() => triggerToast("Add custom GPS geo coordinates coordinates for meeting point...", "info")}
        className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/60 rounded-2xl p-4 flex items-center gap-3 hover:bg-amber-500/20 transition-all cursor-pointer shadow-xs"
      >
        <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        </span>
        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
          No starting point for booking. <strong className="underline text-brand cursor-pointer">Click here</strong> to add a starting point.
        </p>
      </div>

      {/* 9. BOOKING'S NET PROFIT STATS BOX */}
      {(() => {
        const currencyToUse = booking.paymentCurrency || "USD";
        const paid = booking.paymentPrice !== undefined ? booking.paymentPrice : (booking.totalPrice || 66);
        const pg = parseFloat((paid * 0.04).toFixed(2));
        const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';
        const refunded = isCancelled ? paid : 0;
        const refundPg = isCancelled ? pg : 0;
        const cancellation = 0;
        const net = isCancelled ? -pg : parseFloat((paid - pg).toFixed(2));
        const isProfit = net >= 0;

        const formatValue = (val: number) => {
          if (booking.paymentCurrency) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: booking.paymentCurrency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(val);
          }
          return `USD ${val.toFixed(2)}`;
        };

        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Coins className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Booking's Net Profit</h3>
                <p className="text-xs text-slate-400">Calculated earnings, gateway deductions, and vendor breakdowns</p>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Net Profit Amount</p>
              <p className={`text-2xl font-black tracking-tight ${
                isProfit 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                <EurToInrTooltip amount={net} bookingDate={booking.bookingDate} currency={currencyToUse}>
                  {isProfit ? formatValue(net) : `-${formatValue(Math.abs(net))}`}
                </EurToInrTooltip>
              </p>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">GST</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currencyToUse} 0</span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">TCS</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currencyToUse} 0</span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Pg Charges</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  <EurToInrTooltip amount={pg} bookingDate={booking.bookingDate} currency={currencyToUse}>
                    {formatValue(pg)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Refund Pg Charges</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  <EurToInrTooltip amount={refundPg} bookingDate={booking.bookingDate} currency={currencyToUse}>
                    {formatValue(refundPg)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Vendor Payable</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currencyToUse} 0</span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Paid Amount</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  <EurToInrTooltip amount={paid} bookingDate={booking.bookingDate} currency={currencyToUse}>
                    {formatValue(paid)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Settled Amount</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currencyToUse} 0</span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Refunded Amount</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  <EurToInrTooltip amount={refunded} bookingDate={booking.bookingDate} currency={currencyToUse}>
                    {formatValue(refunded)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Cancellation Charges</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  <EurToInrTooltip amount={cancellation} bookingDate={booking.bookingDate} currency={currencyToUse}>
                    {formatValue(cancellation)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Vendor Penalty</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currencyToUse} 0</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 10. VENDOR INFORMATION CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Vendor Information</h3>
              <p className="text-xs text-slate-400">Total Vendor Payable: USD 0</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              type="button"
              onClick={() => setShowAllocateVendorModal(true)}
              className="min-h-[38px] border border-brand hover:bg-brand/10 px-4 py-2 rounded-xl text-xs font-bold text-brand transition-all cursor-pointer shadow-xs"
            >
              + Allocate New Vendor
            </button>
            <button 
              type="button"
              disabled 
              className="min-h-[38px] border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-950/20 cursor-not-allowed"
            >
              Freeze Vendors
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/80 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          No vendor information Found.<br />
          <span className="font-normal text-[11px] text-slate-400 mt-1 block">All services for this vendor have been removed or not allocated yet.</span>
        </div>
      </div>

      {/* 11. ALLOT VOUCHERS CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Ticket className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Allot Vouchers</h3>
              <p className="text-xs text-slate-400">Manage and view voucher distribution details for travelers.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              type="button"
              onClick={() => triggerToast("Registering new digital voucher distribution entry...", "info")}
              className="min-h-[38px] border border-brand hover:bg-brand/10 px-4 py-2 rounded-xl text-xs font-bold text-brand transition-all cursor-pointer shadow-xs"
            >
              + Allocate New Event
            </button>
            <button 
              type="button"
              disabled 
              className="min-h-[38px] border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-950/20 cursor-not-allowed"
            >
              Freeze Event
            </button>
          </div>
        </div>

        <div className="p-8 text-center bg-slate-50/80 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-2">
          <span className="p-3 bg-white dark:bg-slate-900 text-slate-400 rounded-2xl shadow-xs">
            <Ticket className="w-6 h-6 text-slate-400" />
          </span>
          <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">No Vouchers Allotted</p>
          <span className="font-medium text-[11px] text-slate-400 max-w-sm block">
            Click Manage Allotment to assign voucher or ticket codes to this booking.
          </span>
        </div>
      </div>

      {/* 12. METADATA COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm transition-all">
        <button
          type="button"
          onClick={() => toggleCollapse('metaData')}
          className="w-full flex items-center justify-between p-5 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Laptop className="w-4 h-4" />
            </span>
            <span>Meta Data</span>
          </div>
          {sectionsCollapsed.metaData ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        <AnimatePresence>
          {!sectionsCollapsed.metaData && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Ip Address', value: '130.117.88.75' },
                    { label: 'Host', value: 'www.tiqsey.com' },
                    { label: 'Continent', value: 'Europe' },
                    { label: 'Country', value: 'Spain' },
                    { label: 'City', value: 'Madrid' },
                    { label: 'Time Zone', value: 'Europe/Madrid' },
                    { label: 'Browser Name', value: 'Safari' },
                    { label: 'Browser Version', value: '18' },
                    { label: 'Device Name', value: 'iPhone' },
                    { label: 'Device Type', value: 'mobile' },
                    { label: 'Platform Name', value: 'iOS (iPhone)' },
                    { label: 'Platform Version', value: '18.7' },
                    { label: 'Extra Data', value: '[object Object]' },
                    { label: 'User Preferred Languages', value: 'en-AU,en' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-brand/40 transition-all cursor-pointer group"
                      title="Click to copy"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</span>
                        <Copy className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-brand transition-colors" />
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate select-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 13. UTM PARAMS COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm transition-all">
        <button
          type="button"
          onClick={() => toggleCollapse('utmParams')}
          className="w-full flex items-center justify-between p-5 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Globe className="w-4 h-4" />
            </span>
            <span>UTM Parameters</span>
          </div>
          {sectionsCollapsed.utmParams ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        <AnimatePresence>
          {!sectionsCollapsed.utmParams && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'UTM Campaign', value: '110622-100-Google-TTD-Referral' },
                    { label: 'UTM Medium', value: '110622-110-Google-TTD-Referral' },
                    { label: 'UTM Source', value: '110622-111-Google-TTD-Referral' },
                    { label: 'UTM Term', value: '--' },
                    { label: 'UTM Content', value: '--' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => item.value !== '--' && copyToClipboard(item.value, item.label)}
                      className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-brand/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</span>
                        {item.value !== '--' && <Copy className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-brand transition-colors" />}
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate select-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TICKET QR CODE & DIGITAL ACCESS PASS CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Ticket QR Code & Access Pass</h3>
              <p className="text-xs text-slate-400">Ready for gate validation and traveler presentation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDownload(booking as any)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            Download Voucher PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-32 h-32 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center p-2 mb-3 shadow-inner">
              <div className="grid grid-cols-4 gap-1 w-full h-full p-1.5 bg-slate-900 rounded-lg">
                <div className="bg-white rounded-xs animate-pulse"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs animate-pulse"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 uppercase tracking-widest">
              VERIFIED PASS
            </span>
          </div>

          <div className="md:col-span-2 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Booking Ref / PNR</p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 dark:text-white select-all">{booking.bookingRef || booking.pnr_number || 'BK-8829'}</span>
                  <button onClick={() => copyToClipboard(booking.bookingRef || 'BK-8829', 'Booking Ref')} className="text-brand hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Order Number</p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 dark:text-white select-all">{booking.order_number || booking.orderId || 'ORD-9912'}</span>
                  <button onClick={() => copyToClipboard(booking.order_number || booking.orderId || 'ORD-9912', 'Order ID')} className="text-brand hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Activity</span>
                <strong className="text-slate-800 dark:text-slate-200 text-right truncate max-w-[220px]">{booking.attractionName}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Variant</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.variant}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Travelers Count</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{booking.travelers || 1} Passengers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY SCHEDULE & MEETING POINT DETAILS CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Activity Schedule & Meeting Point</h3>
            <p className="text-[11px] text-slate-400">Time slots, location details, and venue instructions</p>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase text-slate-400">Scheduled Date</p>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand" />
              {booking.bookingDate || '30 Jun 2026'}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase text-slate-400">Time Slot</p>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand" />
              {timeSlot}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase text-slate-400">Destination / City</p>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              {booking.city || 'Paris, France'}
            </p>
          </div>
        </div>

        <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-lg p-3.5 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Meeting Point & Instructions:</span>
            <span>Please arrive at the main entrance 15 minutes prior to your scheduled slot. Present the digital QR voucher at the priority admission gate.</span>
          </div>
        </div>
      </div>

      {/* INTERNAL ADMIN NOTES & AUDIT TRAIL CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Internal Admin Notes & Audit Trail</h3>
            <p className="text-[11px] text-slate-400">Staff notes and system action history log</p>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Internal Staff Notes (Private)
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal staff notes regarding this booking (e.g. VIP guest, requested special seating, refunded via voucher)..."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!adminNotes.trim()) {
                  triggerToast("Please enter note text before saving.", "error");
                  return;
                }
                setIsSavingNotes(true);
                setTimeout(() => {
                  onUpdateBooking({ ...booking, notes: adminNotes });
                  const summaryText = adminNotes.length > 40 ? adminNotes.substring(0, 40) + '...' : adminNotes;
                  setAuditLogs(prev => [
                    { id: Date.now().toString(), title: `Note added: "${summaryText}"`, time: 'Just now', color: 'bg-amber-500' },
                    ...prev
                  ]);
                  setIsSavingNotes(false);
                  triggerToast("Internal admin notes saved & recorded in audit history!", "success");
                }, 300);
              }}
              disabled={isSavingNotes}
              className="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              {isSavingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Action History & Audit Log</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {auditLogs.length} Events recorded
              </span>
              <button
                type="button"
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-xs font-bold text-brand hover:underline cursor-pointer bg-brand/10 hover:bg-brand/20 px-3 py-1 rounded-lg transition-all"
              >
                {showAllHistory ? 'Hide History' : 'View All History'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showAllHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="max-h-[280px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full pt-1">
                  <div className="space-y-2.5 text-xs relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 pl-1">
                    <AnimatePresence initial={false}>
                      {auditLogs.map((log, idx) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: -10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: idx * 0.03 }}
                          className="relative pl-7 flex items-center justify-between p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand/40 transition-all group shadow-xs"
                        >
                          {/* Timeline dot / icon */}
                          <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${log.color} ring-4 ring-white dark:ring-slate-900 shadow-xs z-10`}></span>

                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand transition-colors">
                              {log.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                            {log.time}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 14. RESELLER INFORMATION COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
        <button
          type="button"
          onClick={() => toggleCollapse('resellerInfo')}
          className="w-full flex items-center justify-between p-5 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Globe className="w-4 h-4" />
            </span>
            <span>Reseller Information</span>
          </div>
          {sectionsCollapsed.resellerInfo ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        <AnimatePresence>
          {!sectionsCollapsed.resellerInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div 
                    onClick={() => copyToClipboard('Tiqsey', 'Reseller Name')}
                    className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-brand/40 transition-all cursor-pointer group"
                    title="Click to copy"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Reseller Name</span>
                      <Copy className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-brand transition-colors" />
                    </div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate select-all">Tiqsey</span>
                  </div>

                  <div 
                    onClick={() => copyToClipboard('info@tiqsey.com', 'Reseller Email')}
                    className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-brand/40 transition-all cursor-pointer group"
                    title="Click to copy"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Reseller Email</span>
                      <Copy className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-brand transition-colors" />
                    </div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate select-all">info@tiqsey.com</span>
                  </div>

                  <div 
                    onClick={() => copyToClipboard('+91 8058532840', 'Reseller Phone')}
                    className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-brand/40 transition-all cursor-pointer group"
                    title="Click to copy"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Reseller Phone</span>
                      <Copy className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-brand transition-colors" />
                    </div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate select-all tabular-nums">+91 8058532840</span>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Invoice Ref</span>
                    <span className="font-extrabold text-slate-400 dark:text-slate-500">--</span>
                  </div>
                </div>

                {/* Note box */}
                <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                  <div className="flex flex-col text-xs">
                    <span className="font-extrabold text-sky-900 dark:text-sky-200 mb-0.5">Please Note</span>
                    <span className="text-sky-800 dark:text-sky-300">This booking was sold by the reseller "Tiqsey".</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cancel Confirmation Modal (replaces window.confirm) */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full max-h-[90dvh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Cancel Booking?</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to cancel booking <strong className="font-bold text-slate-900 dark:text-white">{booking.bookingRef}</strong> for <strong className="font-bold text-slate-900 dark:text-white">{booking.customerName}</strong>?
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="min-h-[38px] px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(booking.id, 'cancelled');
                    setShowCancelConfirm(false);
                    triggerToast("Booking marked as CANCELLED.", "info");
                  }}
                  className="min-h-[38px] px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AllocateVendorModal 
        isOpen={showAllocateVendorModal} 
        onClose={() => setShowAllocateVendorModal(false)} 
        booking={booking}
      />
    </div>
  );
}
