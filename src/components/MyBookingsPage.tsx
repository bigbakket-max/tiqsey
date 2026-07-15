import React, { useState, useMemo } from "react";
import {
  Calendar,
  Ticket,
  ArrowLeft,
  Compass,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Star,
  Download,
  AlertTriangle,
  QrCode,
  Printer,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { Booking } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { downloadTicketVoucher } from "../utils/ticketDownloader";

interface MyBookingsPageProps {
  onBackToHome: () => void;
  onNavigateToAttractions: () => void;
  onNavigateToSignIn: () => void;
}

export default function MyBookingsPage({
  onBackToHome,
  onNavigateToAttractions,
  onNavigateToSignIn,
}: MyBookingsPageProps) {
  const { user, bookings, submitReview, addBooking, cancelBooking } = useAuth();
  const { formatPrice } = useSettings();
  
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState<Booking | null>(null);
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [ratingHover, setRatingHover] = useState<number>(0);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>("");
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Parse dates and categorize bookings
  const categorizedBookings = useMemo(() => {
    const today = new Date("2026-07-07"); // Base relative to metadata current local time
    
    const pending: Booking[] = [];
    const upcoming: Booking[] = [];
    const completed: Booking[] = [];
    const cancelled: Booking[] = [];
    const rejected: Booking[] = [];

    bookings.forEach((booking) => {
      if (booking.status === "pending") {
        pending.push(booking);
      } else if (booking.status === "confirmed") {
        upcoming.push(booking);
      } else if (booking.status === "completed") {
        completed.push(booking);
      } else if (booking.status === "cancelled") {
        cancelled.push(booking);
      } else if (booking.status === "rejected") {
        rejected.push(booking);
      } else {
        const bookingDate = new Date(booking.bookingDate);
        if (bookingDate >= today) {
          upcoming.push(booking);
        } else {
          completed.push(booking);
        }
      }
    });

    // Sort: upcoming/pending soonest first; completed/cancelled/rejected newest first
    pending.sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
    upcoming.sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
    completed.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    cancelled.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    rejected.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    return { pending, upcoming, completed, cancelled, rejected };
  }, [bookings]);

  // Handle mock cancellation
  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    try {
      await cancelBooking(bookingId);
    } catch (e) {
      console.error("Failed to cancel booking", e);
    }
  };

  const currentList = useMemo(() => {
    if (activeTab === "upcoming") {
      const combined = [...categorizedBookings.pending, ...categorizedBookings.upcoming];
      combined.sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
      return combined;
    } else {
      const combined = [
        ...categorizedBookings.completed,
        ...categorizedBookings.cancelled,
        ...categorizedBookings.rejected
      ];
      combined.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
      return combined;
    }
  }, [activeTab, categorizedBookings]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] dark:bg-slate-950 transition-colors duration-300 font-sans pb-16 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand/5 dark:bg-brand/10 text-brand rounded-full flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In Required
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Please sign in to view your bookings, download ticket vouchers, and manage your upcoming reservations.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={onNavigateToSignIn}
              className="w-full py-3 px-5 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors text-sm shadow-sm cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onBackToHome}
              className="w-full py-3 px-5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-slate-950 transition-colors duration-300 font-sans pb-16">
      {/* Header section with ambient glow */}
      <div className="relative bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 pt-8 pb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-[300px] h-[200px] bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-10">
          {/* Back Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToHome}
              className="group flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 uppercase tracking-widest transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to home</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-xl border border-brand/20 dark:border-brand/30">
                  <Ticket className="w-5 h-5 text-brand" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-brand bg-brand/5 dark:bg-brand/10 px-2.5 py-1 rounded-md">
                  Reservation Hub
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                My tickets
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                These tickets were either purchased with the same email used in your Tiqets account or when you were signed in.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-slate-50 dark:bg-slate-950 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-850 select-none">
              <div className="flex flex-col items-end pr-4 border-r border-slate-200 dark:border-slate-850">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Upcoming
                </span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {categorizedBookings.pending.length + categorizedBookings.upcoming.length} Active
                </span>
              </div>
              <div className="flex flex-col pl-1.5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Completed
                </span>
                <span className="text-xl font-black text-emerald-500">
                  {categorizedBookings.completed.length} Done
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-10">
        <div className="space-y-8">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/80 pb-px overflow-x-auto scrollbar-none">
            {[
              { id: "upcoming", label: "Upcoming", count: categorizedBookings.pending.length + categorizedBookings.upcoming.length },
              { id: "completed", label: "Completed", count: categorizedBookings.completed.length + categorizedBookings.cancelled.length + categorizedBookings.rejected.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative py-3.5 px-4 sm:px-6 text-sm font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer outline-none ${
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-bookings-tab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bookings List / Empty State */}
          <div className="space-y-4 w-full">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 capitalize">
              {activeTab === "upcoming" ? "Upcoming" : "Completed"} ({currentList.length})
            </h3>

            {currentList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-850 flex flex-col items-center max-w-xl mx-auto mt-2"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 mb-5">
                  <Ticket className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight capitalize">
                  No {activeTab === "upcoming" ? "confirmed/upcoming" : activeTab} tickets found
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {activeTab === "upcoming"
                    ? "Looks like you don't have any upcoming trips scheduled. Time to plan your next adventure!"
                    : "Your completed journeys and ticket history will show up here once you have taken them."}
                </p>
                {activeTab === "upcoming" && (
                  <button
                    onClick={onNavigateToAttractions}
                    className="mt-6 px-6 h-11 bg-brand hover:bg-brand-dark text-white text-[13px] font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Browse Attractions</span>
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-5 w-full">
                {currentList.map((booking) => {
                  const isPending = booking.status === "pending";
                  const isUpcoming = booking.status === "confirmed" || (!booking.status && new Date(booking.bookingDate) >= new Date("2026-07-07"));
                  const isCompleted = booking.status === "completed" || (!booking.status && new Date(booking.bookingDate) < new Date("2026-07-07"));
                  const isCancelled = booking.status === "cancelled";
                  const isRejected = booking.status === "rejected";

                  return (
                    <motion.div
                      key={booking.id}
                      layoutId={`booking-card-${booking.id}`}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-3xs hover:shadow-2xs transition-all flex flex-col gap-4 relative"
                    >
                      {/* Top Section: Image on left, Content on right */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                        {/* Image Block */}
                        <div className="w-full sm:w-28 sm:h-28 h-32 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-slate-150 dark:border-slate-800 relative">
                          <img
                            src={booking.attractionImageUrl}
                            alt={booking.attractionName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {booking.city && (
                            <div className="absolute top-1.5 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-black text-white uppercase tracking-wider">
                              {booking.city}
                            </div>
                          )}
                        </div>

                        {/* Content Block */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* IDs & Badge Row */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              <span>PNR: <strong className="text-slate-600 dark:text-slate-350 font-extrabold">{booking.pnr_number || booking.bookingRef}</strong></span>
                              <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                              <span>Order: <strong className="text-slate-600 dark:text-slate-350 font-extrabold">{booking.order_number || booking.orderId || booking.id.replace('book-', 'OD')}</strong></span>
                            </div>

                            {/* Badges */}
                            {booking.status === 'pending' && (
                              <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-150 dark:border-amber-900/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Pending
                              </span>
                            )}
                            {booking.status === 'confirmed' && (
                              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#0070bc] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-150/30 dark:border-blue-900/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Confirmed
                              </span>
                            )}
                            {booking.status === 'completed' && (
                              <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-150/50 dark:border-emerald-900/30">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Completed
                              </span>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="flex items-center gap-1 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-rose-150/50 dark:border-rose-900/30">
                                <XCircle className="w-3 h-3 text-rose-500" />
                                Cancelled
                              </span>
                            )}
                            {booking.status === 'rejected' && (
                              <span className="flex items-center gap-1 text-[10px] font-extrabold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-800/30">
                                <XCircle className="w-3 h-3 text-slate-500" />
                                Rejected
                              </span>
                            )}
                          </div>

                          {/* Attraction Title */}
                          <h4 className="text-base sm:text-[17px] font-bold text-[#0a3560] dark:text-white tracking-tight leading-snug line-clamp-2">
                            {booking.attractionName}
                          </h4>

                          {/* Details Row: Tickets badge + Date + Price */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-xs text-slate-500 dark:text-slate-400">
                            {/* Tickets badge */}
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-[#5fa6d9]/15 dark:bg-[#5fa6d9]/25 text-[#0a3560] dark:text-slate-350 flex items-center justify-center text-[10px] font-black">
                                {booking.ticketsCount}
                              </div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {booking.ticketsCount === 1 ? "Ticket" : "Tickets"}
                              </span>
                            </div>

                            <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>

                            {/* Date */}
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                              <span>
                                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                            </div>

                            <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>

                            {/* Price */}
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {formatPrice(booking.totalPrice)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Actions with a dividing border */}
                      <div className="border-t border-slate-150 dark:border-slate-800/80 pt-3 flex items-center justify-between gap-3">
                        {/* Left Actions: Download PDF Voucher */}
                        <button
                          onClick={() => setSelectedBookingForTicket(booking)}
                          className="text-[#0070bc] hover:text-[#005c9e] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>↓</span>
                          <span>Download PDF voucher</span>
                        </button>

                        {/* Right Actions: Rate or Cancel */}
                        <div className="flex items-center gap-2">
                          {(isUpcoming || isPending) && (
                            <button
                              onClick={() => setCancellingBookingId(booking.id)}
                              className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}

                           {isCompleted && (
                            <div className="flex items-center gap-2">
                              {booking.rating ? (
                                <>
                                  <div className="flex items-center gap-1 text-xs font-bold text-[#0a3560] dark:text-amber-400">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                                    <span>Rated {booking.rating}/5</span>
                                  </div>
                                  <button
                                    onClick={async () => {
                                      setRatingBookingId(booking.id);
                                      setReviewComment("");
                                      setReviewError("");
                                      try {
                                        const res = await fetch(`/api/reviews/booking/${booking.id}`);
                                        const data = await res.json();
                                        if (data.success && data.review) {
                                          setRatingValue(data.review.rating);
                                          setReviewComment(data.review.comment);
                                        } else {
                                          setRatingValue(booking.rating || 5);
                                        }
                                      } catch (e) {
                                        setRatingValue(booking.rating || 5);
                                      }
                                      setRatingHover(0);
                                    }}
                                    className="text-xs font-bold text-[#0070bc] hover:text-[#005c9e] hover:underline cursor-pointer ml-1"
                                  >
                                    Edit Review
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setRatingBookingId(booking.id);
                                    setRatingValue(5);
                                    setReviewComment("");
                                    setReviewError("");
                                    setRatingHover(0);
                                  }}
                                  className="text-xs font-bold text-[#0070bc] hover:text-[#005c9e] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>Rate Experience</span>
                                </button>
                              )}
                            </div>
                          )}

                          {isCancelled && (
                            <span className="text-[10px] font-semibold text-slate-400 italic">
                              Cancelled
                            </span>
                          )}

                          {isRejected && (
                            <span className="text-[10px] font-semibold text-rose-500 italic">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Pass Modal (with simulated QR code and barcode) */}
      <AnimatePresence>
        {selectedBookingForTicket && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingForTicket(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col font-sans z-10 animate-fadeIn"
            >
              {/* Top Cover Block with Image */}
              <div className="h-32 bg-slate-100 relative shrink-0">
                <img
                  src={selectedBookingForTicket.attractionImageUrl}
                  alt={selectedBookingForTicket.attractionName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-brand px-2 py-0.5 rounded-full select-none">
                    Boarding Pass
                  </span>
                  <h3 className="text-base font-black tracking-tight mt-1 truncate">
                    {selectedBookingForTicket.attractionName}
                  </h3>
                </div>
              </div>

              {/* Scalloped ticket cutouts divider */}
              <div className="relative h-4 bg-white dark:bg-slate-900 flex items-center justify-between px-3 shrink-0 select-none">
                <div className="w-5 h-5 rounded-full bg-black/60 absolute -left-2.5" />
                <div className="w-full border-b border-dashed border-slate-200 dark:border-slate-800 mx-2" />
                <div className="w-5 h-5 rounded-full bg-black/60 absolute -right-2.5" />
              </div>

              {/* Ticket Details */}
              <div className="p-6 space-y-6 flex-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      BOOKING REF (PNR)
                    </span>
                    <span className="text-sm font-mono font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedBookingForTicket.pnr_number || selectedBookingForTicket.bookingRef}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      ORDER NUMBER
                    </span>
                    <span className="text-sm font-mono font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedBookingForTicket.order_number || selectedBookingForTicket.orderId || selectedBookingForTicket.id.replace('book-', 'OD')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      CITY / REGION
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedBookingForTicket.city}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      VISIT DATE
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {new Date(selectedBookingForTicket.bookingDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      PASSENGER(S)
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedBookingForTicket.ticketsCount} {selectedBookingForTicket.ticketsCount === 1 ? "Person" : "People"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      TICKET STATUS
                    </span>
                    {selectedBookingForTicket.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-100 dark:border-amber-900/30 shadow-2xs animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Confirmation Pending
                      </span>
                    )}
                    {selectedBookingForTicket.status === "confirmed" && (
                      <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100 dark:border-blue-900/30 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Confirmed
                      </span>
                    )}
                    {selectedBookingForTicket.status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100/50 dark:border-emerald-900/30 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                        Completed
                      </span>
                    )}
                    {selectedBookingForTicket.status === "cancelled" && (
                      <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-100 dark:border-rose-900/30 shadow-2xs">
                        <XCircle className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                        Cancelled
                      </span>
                    )}
                    {selectedBookingForTicket.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-800/30 shadow-2xs">
                        <XCircle className="w-3 h-3 text-slate-500" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center select-none">
                    <QrCode className="w-full h-full text-slate-900" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-3 uppercase tracking-wider">
                    Scan At Gate Entrance
                  </span>
                </div>

                {/* Barcode line */}
                <div className="flex flex-col items-center select-none pt-2">
                  <div className="h-8 w-full flex items-center justify-between gap-0.5 opacity-85">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const widthClass = i % 3 === 0 ? "w-1" : i % 5 === 0 ? "w-1.5" : "w-0.5";
                      return (
                        <div
                          key={i}
                          className={`h-full bg-slate-800 dark:bg-slate-200 ${widthClass}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 mt-2 select-all">
                    *{selectedBookingForTicket.id.toUpperCase()}*
                  </span>
                </div>
              </div>

              {/* Print / Action Footer */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center gap-3 shrink-0 select-none">
                <button
                  onClick={() => {
                    downloadTicketVoucher({
                      bookingId: selectedBookingForTicket.id,
                      bookingRef: selectedBookingForTicket.bookingRef,
                      order_number: selectedBookingForTicket.order_number,
                      pnr_number: selectedBookingForTicket.pnr_number,
                      attractionName: selectedBookingForTicket.attractionName,
                      attractionImageUrl: selectedBookingForTicket.attractionImageUrl,
                      city: selectedBookingForTicket.city,
                      bookingDate: selectedBookingForTicket.bookingDate,
                      passengerName: selectedBookingForTicket.guestInfo?.name || user?.name || "Valued Explorer",
                      ticketsCount: selectedBookingForTicket.ticketsCount,
                      totalPrice: selectedBookingForTicket.totalPrice,
                      additionalPassengers: selectedBookingForTicket.passengers || selectedBookingForTicket.guestInfo?.passengers,
                    });
                  }}
                  className="flex-1 h-11 bg-brand text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-opacity-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-12 h-11 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  title="Print Ticket"
                >
                  <Printer className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setSelectedBookingForTicket(null)}
                  className="h-11 px-4 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write Experience Review Modal */}
      <AnimatePresence>
        {ratingBookingId && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmittingReview) setRatingBookingId(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 font-sans z-10"
            >
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>
                  {bookings.find(b => b.id === ratingBookingId)?.rating ? "Edit Your Review" : "Rate & Review Experience"}
                </span>
              </h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-wider">
                {bookings.find(b => b.id === ratingBookingId)?.attractionName}
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                We'd love to hear about your adventure! Give a star rating and describe your experience to help other travelers.
              </p>

              {/* Star interactive array */}
              <div className="flex flex-col items-center gap-2 py-4 my-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tap to Rate
                </span>
                <div className="flex items-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (ratingHover || ratingValue);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setRatingHover(star)}
                        onMouseLeave={() => setRatingHover(0)}
                        onClick={() => setRatingValue(star)}
                        className="text-slate-300 dark:text-slate-700 hover:scale-125 hover:rotate-6 transition-all cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-all ${
                            isFilled
                              ? "text-amber-500 fill-amber-500 drop-shadow-sm"
                              : "text-slate-300 dark:text-slate-800"
                          }`}
                          strokeWidth={isFilled ? 0 : 2}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Comment Text Area */}
              <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                  Write Your Review
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your experience: what did you love, what could be improved? Help other travelers make informed choices!"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold outline-hidden focus:border-brand focus:ring-1 focus:ring-brand text-slate-800 dark:text-neutral-100 placeholder-slate-450"
                />
              </div>

              {reviewError && (
                <div className="mt-3 text-xs font-bold text-red-500 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                  {reviewError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => setRatingBookingId(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (ratingValue === 0) {
                      setReviewError("Please choose a rating (1-5 stars)");
                      return;
                    }
                    if (!reviewComment.trim()) {
                      setReviewError("Please write a review comment");
                      return;
                    }

                    setIsSubmittingReview(true);
                    setReviewError("");
                    try {
                      const booking = bookings.find(b => b.id === ratingBookingId);
                      if (!booking) {
                        throw new Error("Booking not found");
                      }
                      await submitReview(ratingBookingId, booking.attractionId, ratingValue, reviewComment.trim());
                      setRatingBookingId(null);
                    } catch (err: any) {
                      setReviewError(err.message || "Failed to submit review. Please try again.");
                    } finally {
                      setIsSubmittingReview(false);
                    }
                  }}
                  disabled={ratingValue === 0 || !reviewComment.trim() || isSubmittingReview}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all ${
                    ratingValue > 0 && reviewComment.trim() && !isSubmittingReview
                      ? "bg-brand hover:bg-brand-dark cursor-pointer active:scale-95"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mock Cancel Confirmation Dialog */}
      <AnimatePresence>
        {cancellingBookingId && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingBookingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 font-sans z-10"
            >
              <div className="flex items-center gap-3 text-[#e3000f]">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight">
                  Cancel Booking?
                </h3>
              </div>
              
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3.5 leading-relaxed">
                Are you sure you want to cancel this booking? This will cancel your ticket vouchers. Refund policies apply based on cancellation notice hours.
              </p>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setCancellingBookingId(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => {
                    handleCancelBooking(cancellingBookingId);
                    setCancellingBookingId(null);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#e3000f] hover:bg-opacity-90 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  Confirm Cancellation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
