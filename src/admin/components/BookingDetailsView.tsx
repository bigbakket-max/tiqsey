import React, { useState } from 'react';
import { 
  ArrowLeft, Copy, MoreVertical, AlertTriangle, User, Layers, Wallet, Receipt, Mail, Phone, MapPin, 
  Calendar, Clock, ChevronDown, ChevronUp, Plus, Ticket, Edit, CheckCircle2, 
  HelpCircle, FileText, Globe, Laptop, Info, ShieldCheck, X, RefreshCw, DollarSign, ExternalLink,
  CreditCard, Compass, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EurToInrTooltip } from './EurToInrTooltip';
import { AllocateVendorModal } from './AllocateVendorModal';

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  passengers: Passenger[];
  notes?: string;
  attractionImageUrl?: string;
  city?: string;
}

interface BookingDetailsViewProps {
  booking: AdminBooking;
  onBack: () => void;
  onUpdateStatus: (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected') => void;
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

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copied to clipboard!`, 'success');
  };

  const toggleCollapse = (section: keyof typeof sectionsCollapsed) => {
    setSectionsCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Passenger data with fallback matching PDF exactly
  const [passengersList, setPassengersList] = useState<Passenger[]>(
    booking.passengers && booking.passengers.length >= 2 ? booking.passengers : [
      {
        name: 'Jacob davis',
        email: 'alyshaawaluddin@gmail.com',
        phone: '0459515313',
        phoneCode: '+61',
        firstName: 'Jacob',
        lastName: 'davis',
        gender: 'male',
        dob: '1999-09-29',
        type: 'Adult'
      },
      {
        name: 'Sarah davis',
        email: 'sarah@outlook.com',
        phone: '0459515313',
        phoneCode: '+61',
        firstName: 'Sarah',
        lastName: 'davis',
        gender: 'female',
        dob: '2001-05-12',
        type: 'Adult'
      }
    ]
  );

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
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-500/10 text-slate-600 border border-slate-200/50 uppercase tracking-wider">{status.toUpperCase()}</span>;
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
      className="space-y-6 w-full pb-16 px-4 md:px-6 font-sans text-slate-800 dark:text-slate-100"
    >
      
      {/* Toast alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-sans"
          >
            {toastType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toastType === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            {toastType === 'error' && <AlertTriangle className="w-5 h-5 text-brand" />}
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation / Header Area */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#5fa6d9] transition-colors cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings List
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
          Last updated: Just now
        </span>
      </div>

      {/* 1. ORDER SUMMARY CARD & PAYMENTS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-6">
        {/* Order Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-[15px] font-bold tracking-tight text-slate-800 dark:text-slate-200">Order Summary</h3>
          <button 
            onClick={() => setShowPayments(!showPayments)}
            className="self-start sm:self-auto border border-brand hover:bg-brand/5 dark:hover:bg-brand/10 text-brand px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer"
          >
            {showPayments ? 'Hide Payments' : 'View Payments'}
          </button>
        </div>

                {/* Order Summary Metrics */}
        <div className="flex flex-wrap gap-x-10 gap-y-6 pt-2">
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Order ID / Number</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 select-all">{booking.order_number || booking.orderId || 'OD822954911803214'}</span>
          </div>
          
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Booked By</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{booking.customerName || 'Arsalan F'}</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Created At</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{booking.createdAt || '12 Jul 2026'}</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Bookings</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">1</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Net Amount</span>
            </div>
            <span className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
              <EurToInrTooltip amount={booking.totalPrice || 40} bookingDate={booking.bookingDate} currency="USD">
                USD {booking.totalPrice || 40}
              </EurToInrTooltip>
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Gross Amount</span>
            </div>
            <span className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
              <EurToInrTooltip amount={booking.totalPrice || 40} bookingDate={booking.bookingDate} currency="USD">
                USD {booking.totalPrice || 40}
              </EurToInrTooltip>
            </span>
          </div>
        </div>

        {/* Payments Section */}
        {showPayments && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <h3 className="text-[15px] font-medium text-slate-700 dark:text-slate-300 mb-4">
              Payments
            </h3>

            <div className="w-full max-w-[320px] border border-slate-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-900 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-[#94a3b8]">Payment 1</span>
                <div className="flex items-center gap-1 text-[#94a3b8]">
                  <span className="text-[11px]">Date: 12 Jul 2026</span>
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[17px] font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                  <EurToInrTooltip amount={booking.totalPrice || 40} bookingDate={booking.bookingDate} currency="USD">
                    USD {booking.totalPrice || 40}
                  </EurToInrTooltip>
                </p>
                <span className="px-2.5 py-0.5 text-[10px] font-medium text-emerald-500 border border-emerald-500 rounded-full">
                  Successful
                </span>
              </div>

              {/* Stamp */}
              <div className="absolute right-4 top-12 -rotate-[20deg] z-10 pointer-events-none opacity-80">
                <div className="border-[2px] border-emerald-500 rounded-full px-3 py-2 text-emerald-500 text-[14px] font-black tracking-widest flex items-center justify-center transform scale-[0.85] origin-center">
                  PAID
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Payment Ref: </span>
                  <span className="text-slate-500 dark:text-slate-400">dUqvQdv95nm55sm</span>
                </div>
                
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Mode: </span>
                  <span className="text-slate-500 dark:text-slate-400">/TazapayV2</span>
                </div>

                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Transaction ID:</span>
                  <span className="text-slate-500 dark:text-slate-400 break-all">chk_d99p9h7hhjpr05ekuh80</span>
                </div>

                <AnimatePresence>
                  {showPaymentDetails && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-3 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Gateway: </span>
                        <span className="text-slate-500 dark:text-slate-400">Stripe</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Card Details:</span>
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          •••• •••• •••• 4242
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">IP Address: </span>
                        <span className="text-slate-500 dark:text-slate-400">192.168.1.1</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2 text-center">
                  <button 
                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                    className="text-brand text-[11px] font-medium hover:underline cursor-pointer"
                  >
                    {showPaymentDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. ACTIVE BOOKING CARD */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
        
        {/* Left Orange Tag Badge */}
        <div className={`absolute right-full top-6 w-11 h-14 ${statusColors.bgColor} rounded-tl-2xl rounded-bl-2xl rounded-tr-none rounded-br-none flex items-center justify-center shadow-md ${statusColors.shadowColor} z-10 translate-x-[1px]`}>
          {statusColors.icon}
        </div>

        {/* Header warning & Status badges */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {booking.attractionName || 'Acropolis of Athens Entry Tickets | Skip-The-Line Admission Tickets'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Variant: {booking.variant || 'Acropolis of Athens General Admission Tickets'}
            </p>
          </div>

            {/* Badges line & Actions buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={booking.status} />
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700/80">
                  Direct Booking
                </span>
              </div>
              
              <div className="flex gap-2">
                <button className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors shadow-sm">
                  Cancel Booking
                </button>
                <button 
                  onClick={() => {
                    onUpdateStatus(booking.id, 'confirmed');
                    triggerToast("Booking marked as CONFIRMED successfully!", "success");
                  }}
                  className="bg-brand hover:opacity-90 text-white px-4 py-1.5 rounded-md text-[11px] font-black transition-colors cursor-pointer shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>

          {/* Travel Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-4 font-semibold text-slate-700 dark:text-slate-300">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">PNR</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 select-all">{booking.pnr_number || booking.bookingRef || 'BKWDWDOLOCH7'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Travelers</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.travelers || 2}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Date of Travel</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.bookingDate || '30 Jun 2026'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Booking End Date</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.bookingDate || '30 Jun 2026'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Time Slot</p>
              <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-extrabold">
                {isEditingTimeSlot ? (
                  <input 
                    type="text" 
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    onBlur={() => setIsEditingTimeSlot(false)}
                    onKeyDown={e => e.key === 'Enter' && setIsEditingTimeSlot(false)}
                    className="w-16 border rounded bg-white dark:bg-slate-800 text-xs px-1 font-bold"
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{timeSlot}</span>
                    <button onClick={() => setIsEditingTimeSlot(true)} className="text-blue-500 hover:underline text-[10px] font-bold">
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Net Amount</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">
                <EurToInrTooltip amount={booking.totalPrice || 66} bookingDate={booking.bookingDate} currency="USD">
                  USD {booking.totalPrice || 66}
                </EurToInrTooltip>
              </p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Gross Amount</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">
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
                onClick={() => triggerToast("Directing to package configurations and inventory allocations edit panel...", "info")}
                className="text-orange-500 text-[11px] font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="overflow-x-auto">
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
                  {(() => {
                    const units = booking.travelers || 2;
                    const currentPrice = booking.totalPrice || 133.431;
                    const pricePerUnit = currentPrice / units;
                    const discountPercent = 6;
                    const struckThroughPrice = currentPrice * 1.060451;

                    return (
                      <tr className="bg-slate-50/60 dark:bg-slate-900/20 rounded-lg overflow-hidden">
                        <td className="py-4 pl-4 rounded-l-lg text-slate-600 dark:text-slate-400 text-xs font-normal text-left">Adult</td>
                        <td className="py-4 px-3 text-center text-slate-800 dark:text-slate-100 text-xs font-normal">{units}</td>
                        <td className="py-4 px-3 text-center text-slate-600 dark:text-slate-400 text-xs font-normal">CAD {pricePerUnit.toFixed(3)}</td>
                        <td className="py-4 pr-4 rounded-r-lg text-right">
                          <div className="inline-flex items-center gap-2.5 text-left">
                            <div className="flex flex-col">
                              <span className="line-through text-slate-400 dark:text-slate-500 text-[10px] font-normal leading-tight mb-0.5">
                                CAD {struckThroughPrice.toFixed(3)}
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 text-xs font-semibold leading-tight">
                                CAD {currentPrice.toFixed(3)}
                              </span>
                            </div>
                            <span className="bg-[#bbf7d0]/70 text-[#166534] dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold rounded-md leading-none">
                              {discountPercent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOOKING LEVEL INFORMATION CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Booking Level Information</h3>
          </div>
          
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 pt-px" />

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
            <span className="text-slate-400 dark:text-slate-500">State: <strong className="text-slate-800 dark:text-slate-200 font-semibold">NA</strong></span>
            <span className="text-slate-200 dark:text-slate-800">|</span>
            <span className="text-slate-400 dark:text-slate-500">Country: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{(() => {
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
            })()}</strong></span>
          </div>
        </div>

        {/* 4. CUSTOMER INFORMATION & PASSENGER DETAILS CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Customer Information & Passenger Details</h3>
          </div>
          
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

          {/* Customer Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
              <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                <User className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[9px] text-slate-400 uppercase">Travelers</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.travelers || 2}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
              <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                <User className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[9px] text-slate-400 uppercase">Name</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.customerName || 'Jacob davis'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800 min-w-0">
              <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase">Email</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">{booking.customerEmail || 'alyshaawaluddin@gmail.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
              <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[9px] text-slate-400 uppercase">Phone</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.customerPhone || '+6281381847386'}</p>
              </div>
            </div>
          </div>

          {/* Subsection Divider */}
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />

          {/* Subsection Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Passenger Details</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Total: {passengersList.length} Passengers</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setIsAddingPassenger(true)}
                className="flex items-center gap-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
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
                className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md border border-slate-200 dark:border-slate-700 mb-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold">Add New Passenger</h4>
                  <button onClick={() => setIsAddingPassenger(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={newPassengerName}
                      onChange={e => setNewPassengerName(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={newPassengerEmail}
                      onChange={e => setNewPassengerEmail(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Type</label>
                    <select 
                      value={newPassengerType}
                      onChange={e => setNewPassengerType(e.target.value as 'Adult' | 'Child')}
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="Adult">Adult</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAddingPassenger(false)} className="px-3 py-1 text-xs text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setPassengersList([...passengersList, {
                        id: Math.random().toString(),
                        name: newPassengerName,
                        email: newPassengerEmail,
                        type: newPassengerType,
                        status: 'Saved'
                      }]);
                      setNewPassengerName('');
                      setNewPassengerEmail('');
                      setIsAddingPassenger(false);
                      triggerToast("New traveler profile saved successfully!", "success");
                    }}
                    className="px-3 py-1 bg-[#5fa6d9] text-white rounded font-bold"
                  >
                    Save Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Passengers Table Grid Layout matching PDF exactly */}
          <div className="overflow-x-auto rounded-lg border border-slate-150 dark:border-slate-850">
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
                    <td className="py-3 px-3 break-all select-all">{pass.email || 'alyshaawaluddin@gmail.com'}</td>
                    <td className="py-3 px-3">{pass.phone || '0459515313'}</td>
                    <td className="py-3 px-3 text-center">{pass.phoneCode || '+61'}</td>
                    <td className="py-3 px-3">{pass.firstName || 'Jacob'}</td>
                    <td className="py-3 px-3">{pass.lastName || 'davis'}</td>
                    <td className="py-3 px-3 uppercase text-[10px]">{pass.gender || 'male'}</td>
                    <td className="py-3 px-3 font-mono">{pass.dob || '1999-09-29'}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#5fa6d9] dark:text-[#7da7c4] font-mono">
                      {(() => {
                        const dobString = pass.dob || '1999-09-29';
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Payment Information</h3>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

        {/* Payment Metrics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Total Amount */}
          <div className="bg-[#f8fafc] dark:bg-slate-950/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 min-h-[90px] flex flex-col justify-between">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">TOTAL AMOUNT</p>
              <p className="font-extrabold text-[#e3000f] text-base">
                <EurToInrTooltip amount={booking.totalPrice || 66} bookingDate={booking.bookingDate} currency="USD">
                  USD {booking.totalPrice || 66}
                </EurToInrTooltip>
              </p>
            </div>
          </div>

          {/* Collected */}
          <div className="relative bg-[#f8fafc] dark:bg-slate-950/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 min-h-[90px] flex flex-col justify-between">
            <span className="absolute top-3 right-3 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
              100.00%
            </span>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">COLLECTED</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                <EurToInrTooltip amount={booking.collectedAmount ?? booking.totalPrice ?? 66} bookingDate={booking.bookingDate} currency="USD">
                  USD {booking.collectedAmount ?? booking.totalPrice ?? 66}
                </EurToInrTooltip>
              </p>
            </div>
          </div>

          {/* Pending */}
          <div className="relative bg-[#f8fafc] dark:bg-slate-950/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 min-h-[90px] flex flex-col justify-between">
            <span className="absolute top-3 right-3 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
              0.00%
            </span>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">PENDING</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-base">USD 0</p>
            </div>
          </div>

          {/* Authorized Amount */}
          <div className="bg-[#f8fafc] dark:bg-slate-950/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 min-h-[90px] flex flex-col justify-between">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">AUTHORIZED AMOUNT</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-base">USD 0</p>
            </div>
          </div>

          {/* Refunded */}
          <div className="bg-[#f8fafc] dark:bg-slate-950/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 min-h-[90px] flex flex-col justify-between">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">REFUNDED</p>
              <p className="font-extrabold text-[#94a3b8] dark:text-slate-500 text-base">N.A.</p>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-slate-800 pt-px" />

        {/* Payment Parts List Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] pt-1">
            <CreditCard className="w-4 h-4 text-[#94a3b8]" />
            <span>PAYMENT PARTS</span>
          </div>

          <div className="overflow-x-auto">
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
                  <td className="py-4 pr-3 font-medium text-slate-600 dark:text-slate-400">1</td>
                  <td className="py-4 px-3 font-extrabold text-slate-900 dark:text-slate-100">
                    <EurToInrTooltip amount={booking.totalPrice || 66} bookingDate={booking.bookingDate} currency="USD">
                      USD {booking.totalPrice || 66}
                    </EurToInrTooltip>
                  </td>
                  <td className="py-4 px-3 font-medium text-slate-600 dark:text-slate-400">{booking.bookingDate || '30 Jun 2026'}</td>
                  <td className="py-4 px-3 font-medium text-slate-600 dark:text-slate-400">{booking.bookingDate || '30 Jun 2026'}</td>
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleCollapse('relatedBookings')}
          className="w-full flex items-center justify-between p-4 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>Related Bookings (0)</span>
          {sectionsCollapsed.relatedBookings ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!sectionsCollapsed.relatedBookings && (
          <div className="p-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/10">
            No related bookings found for this order.
          </div>
        )}
      </div>

      {/* 8. STARTING/MEETING POINT ALERT BANNER */}
      <div 
        onClick={() => triggerToast("Add custom GPS geo coordinates coordinates for meeting point...", "info")}
        className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/60 rounded-md p-3.5 flex items-center gap-2.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
      >
        <span className="p-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full shrink-0">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        </span>
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
          No starting point for booking. <strong className="underline text-brand cursor-pointer">Click here</strong> to add a starting point.
        </p>
      </div>

      {/* 9. BOOKING'S NET PROFIT STATS BOX */}
      {(() => {
        const paid = booking.totalPrice || 66;
        const pg = parseFloat((paid * 0.04).toFixed(2));
        const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';
        const refunded = isCancelled ? paid : 0;
        const refundPg = isCancelled ? pg : 0;
        const cancellation = 0;
        const net = isCancelled ? -pg : parseFloat((paid - pg).toFixed(2));
        const isProfit = net >= 0;

        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-6 shadow-sm">
            <div>
              <p className="text-[11px] font-medium text-[#94a3b8] mb-1">Booking's Net Profit</p>
              <p className={`text-2xl font-bold mb-6 ${
                isProfit 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                <EurToInrTooltip amount={net} bookingDate={booking.bookingDate} currency="USD">
                  {isProfit ? `USD ${net.toFixed(2)}` : `-USD ${Math.abs(net).toFixed(2)}`}
                </EurToInrTooltip>
              </p>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-y-6 gap-x-4 pt-6">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">GST:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">USD 0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">TCS:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">USD 0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Pg Charges:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">
                  <EurToInrTooltip amount={pg} bookingDate={booking.bookingDate} currency="USD">
                    USD {pg.toFixed(2)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Refund Pg Charges:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">
                  <EurToInrTooltip amount={refundPg} bookingDate={booking.bookingDate} currency="USD">
                    USD {refundPg.toFixed(2)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Vendor Payable:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">USD 0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Paid Amount:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">
                  <EurToInrTooltip amount={paid} bookingDate={booking.bookingDate} currency="USD">
                    USD {paid.toFixed(2)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Settled Amount:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">USD 0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Refunded Amount:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">
                  <EurToInrTooltip amount={refunded} bookingDate={booking.bookingDate} currency="USD">
                    USD {refunded.toFixed(2)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Cancellation Charges:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">
                  <EurToInrTooltip amount={cancellation} bookingDate={booking.bookingDate} currency="USD">
                    USD {cancellation.toFixed(2)}
                  </EurToInrTooltip>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-[#94a3b8]">Vendor Penalty:</span>
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-300">USD 0</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 10. VENDOR INFORMATION CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Vendor Information</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Total Vendor Payable: USD 0</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAllocateVendorModal(true)}
              className="border border-brand hover:bg-brand/5 dark:hover:bg-brand/10 px-3.5 py-1.5 rounded text-xs font-bold text-brand transition-colors cursor-pointer"
            >
              + Allocate New Vendor
            </button>
            <button 
              disabled 
              className="border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 px-3.5 py-1.5 rounded text-xs font-bold bg-slate-50 dark:bg-slate-950/20 cursor-not-allowed"
            >
              Freeze Vendors
            </button>
          </div>
        </div>

        <div className="p-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-950/10 border border-dashed border-slate-150 dark:border-slate-850 rounded-lg">
          No vendor information Found.<br />
          <span className="font-normal text-[11px] text-slate-400 mt-1 block">All services for this vendor have been removed or not allocated yet.</span>
        </div>
      </div>

      {/* 11. ALLOT VOUCHERS CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Allot Vouchers</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Manage and view voucher distribution details for travelers.</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => triggerToast("Registering new digital voucher distribution entry...", "info")}
              className="border border-brand hover:bg-brand/5 dark:hover:bg-brand/10 px-3.5 py-1.5 rounded text-xs font-bold text-brand transition-colors cursor-pointer"
            >
              + Allocate New Event
            </button>
            <button 
              disabled 
              className="border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 px-3.5 py-1.5 rounded text-xs font-bold bg-slate-50 dark:bg-slate-950/20 cursor-not-allowed"
            >
              Freeze Event
            </button>
          </div>
        </div>

        <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-950/10 border border-dashed border-slate-150 dark:border-slate-850 rounded-lg flex flex-col items-center justify-center space-y-2">
          <span className="p-2 bg-slate-100 dark:bg-slate-850 text-slate-400 rounded-full">
            <Ticket className="w-5 h-5 text-slate-400" />
          </span>
          <p className="text-xs font-bold text-slate-400">No Vouchers Allotted</p>
          <span className="font-normal text-[11px] text-slate-400 max-w-sm block">
            Click Manage Allotment to assign voucher or ticket codes to this booking.
          </span>
        </div>
      </div>

      {/* 12. METADATA COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleCollapse('metaData')}
          className="w-full flex items-center justify-between p-4 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>Meta Data</span>
          {sectionsCollapsed.metaData ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!sectionsCollapsed.metaData && (
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Ip Address</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">130.117.88.75</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Host</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">www.tiqsey.com</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Continent</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">Europe</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Country</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">Spain</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">City</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">Madrid</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Time Zone</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">Europe/Madrid</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Browser Name</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">Safari</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Browser Version</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">18</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Device Name</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">iPhone</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Device Type</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">mobile</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Platform Name</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">iOS (iPhone)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Platform Version</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">18.7</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Extra Data</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">[object Object]</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">User Preferred Languages</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">en-AU,en</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 13. UTM PARAMS COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleCollapse('utmParams')}
          className="w-full flex items-center justify-between p-4 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>UTM Parameters</span>
          {sectionsCollapsed.utmParams ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!sectionsCollapsed.utmParams && (
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">UTM Campaign</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">110622-100-Google-TTD-Referral</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">UTM Medium</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">110622-110-Google-TTD-Referral</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">UTM Source</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">110622-111-Google-TTD-Referral</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">UTM Term</span>
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">--</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">UTM Content</span>
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">--</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 14. RESELLER INFORMATION COLLAPSIBLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleCollapse('resellerInfo')}
          className="w-full flex items-center justify-between p-4 font-extrabold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>Reseller Information</span>
          {sectionsCollapsed.resellerInfo ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!sectionsCollapsed.resellerInfo && (
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex flex-wrap gap-x-24 gap-y-8">
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-[#94a3b8] mb-1">Reseller Name</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-slate-300">Tiqsey</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-[#94a3b8] mb-1">Reseller Email</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-slate-300">info@tiqsey.com</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-[#94a3b8] mb-1">Reseller Phone</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-slate-300">9916134180</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-[#94a3b8] mb-1">Invoice Ref</span>
                <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400">--</span>
              </div>
            </div>

            {/* Note box */}
            <div className="bg-sky-50 dark:bg-sky-950/25 border border-sky-200 dark:border-sky-800/60 rounded-md p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-sky-800 dark:text-sky-300 mb-0.5">Please Note</span>
                <span className="text-[12px] text-sky-700 dark:text-sky-400">This booking was sold by the reseller "Tiqsey".</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <AllocateVendorModal 
        isOpen={showAllocateVendorModal} 
        onClose={() => setShowAllocateVendorModal(false)} 
        booking={booking}
      />
    </div>
  );
}
