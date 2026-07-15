import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  RefreshCw, 
  SlidersHorizontal, 
  Ticket, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  Tag, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  Undo2, 
  Check, 
  Trash2, 
  ChevronRight, 
  Lock, 
  Coins, 
  Phone, 
  Mail, 
  Plus, 
  MapPin,
  X,
  Sparkles,
  Lightbulb,
  ExternalLink,
  PenTool,
  Wallet
} from 'lucide-react';
import { downloadTicketVoucher } from '../../utils/ticketDownloader';
import { motion, AnimatePresence } from 'motion/react';
import BookingDetailsView from '../components/BookingDetailsView';

interface Passenger {
  name: string;
  type: 'Adult' | 'Child' | 'Youth' | 'Senior';
  id?: string;
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

export default function Bookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState('All');
  
  // Drawer filter states
  const [drawerTypes, setDrawerTypes] = useState<string[]>([]);
  const [drawerStatuses, setDrawerStatuses] = useState<string[]>([]);
  const [drawerSources, setDrawerSources] = useState<string[]>([]);
  const [drawerReviews, setDrawerReviews] = useState<string[]>([]);
  
  // Date states in drawer (unapplied)
  const [drawerCreatedAtStart, setDrawerCreatedAtStart] = useState('');
  const [drawerCreatedAtEnd, setDrawerCreatedAtEnd] = useState('');
  const [drawerInvoiceDueStart, setDrawerInvoiceDueStart] = useState('');
  const [drawerInvoiceDueEnd, setDrawerInvoiceDueEnd] = useState('');
  const [drawerTravelStart, setDrawerTravelStart] = useState('');
  const [drawerTravelEnd, setDrawerTravelEnd] = useState('');

  // Applied drawer filter states
  const [appliedDrawerTypes, setAppliedDrawerTypes] = useState<string[]>([]);
  const [appliedDrawerStatuses, setAppliedDrawerStatuses] = useState<string[]>([]);
  const [appliedDrawerSources, setAppliedDrawerSources] = useState<string[]>([]);
  const [appliedDrawerReviews, setAppliedDrawerReviews] = useState<string[]>([]);

  // Applied date states
  const [appliedCreatedAtStart, setAppliedCreatedAtStart] = useState('');
  const [appliedCreatedAtEnd, setAppliedCreatedAtEnd] = useState('');
  const [appliedInvoiceDueStart, setAppliedInvoiceDueStart] = useState('');
  const [appliedInvoiceDueEnd, setAppliedInvoiceDueEnd] = useState('');
  const [appliedTravelStart, setAppliedTravelStart] = useState('');
  const [appliedTravelEnd, setAppliedTravelEnd] = useState('');

  const toggleArrayItem = (state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (state.includes(val)) {
      setter(state.filter(item => item !== val));
    } else {
      setter([...state, val]);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerTypes(appliedDrawerTypes);
    setDrawerStatuses(appliedDrawerStatuses);
    setDrawerSources(appliedDrawerSources);
    setDrawerReviews(appliedDrawerReviews);
    setDrawerCreatedAtStart(appliedCreatedAtStart);
    setDrawerCreatedAtEnd(appliedCreatedAtEnd);
    setDrawerInvoiceDueStart(appliedInvoiceDueStart);
    setDrawerInvoiceDueEnd(appliedInvoiceDueEnd);
    setDrawerTravelStart(appliedTravelStart);
    setDrawerTravelEnd(appliedTravelEnd);
    setShowFilters(false);
  };
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const handleSelectBooking = (booking: AdminBooking | null) => {
    setSelectedBooking(booking);
    if (booking) {
      setSearchParams({ orderId: booking.orderId });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam && bookings.length > 0) {
      const b = bookings.find(x => x.orderId === orderIdParam);
      if (b && (!selectedBooking || selectedBooking.id !== b.id)) {
        setSelectedBooking(b);
      }
    } else if (!orderIdParam && selectedBooking) {
      setSelectedBooking(null);
    }
  }, [searchParams, bookings]);

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newTravelDate, setNewTravelDate] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Trigger toast alert
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const saveBookingToBackend = async (booking: AdminBooking) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const data = await response.json();
      if (data.success) {
        console.log(`[Admin DB Sync] Booking ${booking.id} synced with backend database successfully.`);
      } else {
        console.error(`[Admin DB Sync Error] Failed to sync booking ${booking.id} to SQLite backend database:`, data.error);
      }
    } catch (err) {
      console.error(`[Admin DB Sync Network Error] Failed to contact backend for booking ${booking.id}:`, err);
    }
  };

  // Load and merge default mock bookings & user bookings
  const loadBookings = async () => {
    setIsRefreshing(true);
    
    // Fetch bookings from backend database
    let backendBookings: AdminBooking[] = [];
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (data.success && Array.isArray(data.bookings)) {
        backendBookings = data.bookings.map((b: any) => ({
          id: b.id,
          bookingRef: b.bookingRef || b.pnr_number,
          orderId: b.orderId || b.order_number,
          order_number: b.order_number,
          pnr_number: b.pnr_number,
          customerName: b.customerName || b.guestInfo?.name || 'Registered User',
          customerEmail: b.customerEmail || b.guestInfo?.email || 'user@tiqsey.com',
          customerPhone: b.customerPhone || b.guestInfo?.phone || '+1 (555) 123-4567',
          createdAt: b.createdAt,
          attractionId: b.attractionId,
          attractionName: b.attractionName,
          variant: b.variant || 'General Admission Tickets',
          vendorPayable: b.vendorPayable || '--',
          totalPrice: b.totalPrice,
          collectedAmount: b.totalPrice,
          travelers: b.ticketsCount || b.travelers || 1,
          bookingDate: b.bookingDate,
          status: b.status || 'confirmed',
          city: b.city || 'Paris',
          attractionImageUrl: b.attractionImageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
          passengers: b.passengers || []
        }));
        console.log(`[Admin] Successfully loaded ${backendBookings.length} bookings from backend database.`);
      } else {
        console.error("[Admin Database Error] Failed to load bookings from backend database:", data.error || "Unknown error");
      }
    } catch (err) {
      console.error("[Admin Database Network Error] Failed to fetch bookings from backend:", err);
    }

    await new Promise(r => setTimeout(r, 600));
    
    // Default High-Fidelity Mock Bookings based on screenshot & system data
    const defaultBookings: AdminBooking[] = [
      {
        id: 'book-default-2',
        bookingRef: 'BKDB2',
        orderId: 'ODB2',
        customerName: 'Bob Johnson',
        customerEmail: 'bob.johnson@example.com',
        customerPhone: '+1 (555) 349-2041',
        createdAt: '12 Jul 2026 11:13 AM',
        attractionId: 'paris-city-tour',
        attractionName: 'Paris City Tour & Eiffel Tower',
        variant: 'General Admission Tickets',
        vendorPayable: '--',
        totalPrice: 340,
        collectedAmount: 340,
        travelers: 4,
        children: 1,
        bookingDate: '2026-07-12',
        timeslot: '12:00 AM',
        status: 'pending',
        city: 'Paris',
        attractionImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
        passengers: [
          { name: 'Bob Johnson', type: 'Adult' },
          { name: 'Jane Johnson', type: 'Adult' },
          { name: 'Billy Johnson', type: 'Child' },
          { name: 'Sally Johnson', type: 'Child' }
        ],
        notes: 'Requested morning slot if possible. Customer travels with two small children.'
      },
      {
        id: 'book-default-3',
        bookingRef: 'BKDB3',
        orderId: 'ODB3',
        customerName: 'Alice Smith',
        customerEmail: 'alice.smith@example.com',
        customerPhone: '+44 7911 123456',
        createdAt: '17 Jul 2026 11:13 AM',
        attractionId: 'paris-city-tour',
        attractionName: 'Paris City Tour & Eiffel Tower',
        variant: 'General Admission Tickets',
        vendorPayable: '--',
        totalPrice: 255,
        collectedAmount: 255,
        travelers: 3,
        bookingDate: '2026-07-17',
        timeslot: '10:00 AM',
        status: 'confirmed',
        city: 'Paris',
        attractionImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
        passengers: [
          { name: 'Alice Smith', type: 'Adult' },
          { name: 'Tom Smith', type: 'Adult' },
          { name: 'Lily Smith', type: 'Child' }
        ],
        notes: 'Auto-confirmed via Instant Booking API connection.'
      },
      {
        id: 'book-default-4',
        bookingRef: 'BKDB4',
        orderId: 'ODB4',
        customerName: 'Bob Johnson',
        customerEmail: 'bob.johnson@example.com',
        customerPhone: '+1 (555) 349-2041',
        createdAt: '22 Jul 2026 11:13 AM',
        attractionId: 'bali-trek',
        attractionName: 'Bali Volcano Sunrise Trek',
        variant: 'General Admission Tickets',
        vendorPayable: '--',
        totalPrice: 90,
        collectedAmount: 90,
        travelers: 2,
        bookingDate: '2026-07-22',
        status: 'cancelled',
        city: 'Bali',
        attractionImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
        passengers: [
          { name: 'Bob Johnson', type: 'Adult' },
          { name: 'Jack Johnson', type: 'Adult' }
        ],
        notes: 'Cancelled by user due to sudden scheduling conflict. 100% refund voucher generated.'
      },
      {
        id: 'book-default-1',
        bookingRef: 'BKDB1',
        orderId: 'ODB1',
        customerName: 'Emma Watson',
        customerEmail: 'emma@watson.com',
        customerPhone: '+44 7911 987654',
        createdAt: '05 Jul 2026 10:30 AM',
        attractionId: 'louvre-museum',
        attractionName: 'Louvre Museum Access & Audio Tour',
        variant: 'Priority Entry Ticket',
        vendorPayable: 'USD 25',
        totalPrice: 30,
        collectedAmount: 30,
        travelers: 1,
        bookingDate: '2026-07-08',
        status: 'completed',
        city: 'Paris',
        attractionImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1200',
        passengers: [
          { name: 'Emma Watson', type: 'Adult' }
        ],
        notes: 'Standard priority ticket issued.'
      },
      {
        id: 'book-default-5',
        bookingRef: 'BKDB5',
        orderId: 'ODB5',
        customerName: 'David Beckham',
        customerEmail: 'david@beckham.com',
        customerPhone: '+44 7911 345678',
        createdAt: '25 Jul 2026 02:45 PM',
        attractionId: 'sagrada-familia',
        attractionName: 'Sagrada Familia Skip-The-Line',
        variant: 'Audio Guide Included',
        vendorPayable: '--',
        totalPrice: 150,
        collectedAmount: 150,
        travelers: 5,
        bookingDate: '2026-07-28',
        status: 'rejected',
        city: 'Barcelona',
        attractionImageUrl: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=85&w=1200',
        passengers: [
          { name: 'David Beckham', type: 'Adult' },
          { name: 'Victoria Beckham', type: 'Adult' },
          { name: 'Brooklyn Beckham', type: 'Adult' },
          { name: 'Romeo Beckham', type: 'Youth' },
          { name: 'Cruz Beckham', type: 'Youth' }
        ],
        notes: 'Prefers audio guides in English and Spanish.'
      }
    ];

    
    // Try to load cached admin state to preserve status changes on mock data
    let baseBookings = [...defaultBookings];
    try {
      const cached = localStorage.getItem('tiqsey_admin_bookings');
      if (cached) {
         const parsed = JSON.parse(cached);
         baseBookings = baseBookings.map(db => {
           const found = parsed.find((p) => p.id === db.id);
           return found ? { ...db, ...found } : db;
         });
      }
    } catch(e) {}

    const allBookings: AdminBooking[] = [];

    // Scan localStorage for real client bookings
    for (let i = 0; i < localStorage.length; i++) {
      try {
        const key = localStorage.key(i);
        if (key && key.startsWith('tiqsey_bookings_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const userBookings = JSON.parse(raw);
            if (Array.isArray(userBookings)) {
              const userId = key.replace('tiqsey_bookings_', '');
              let userName = 'Registered User';
              let userEmail = 'user@tiqsey.com';
              let userPhone = '+1 (555) 123-4567';
              
              // Resolve real user details
              try {
                const usersRaw = localStorage.getItem('tiqsey_users');
                if (usersRaw) {
                  const users = JSON.parse(usersRaw);
                  const found = users.find((u: any) => u.id === userId);
                  if (found) {
                    userName = found.name;
                    userEmail = found.email;
                  }
                }
              } catch (_) {}

              userBookings.forEach((b: any, idx: number) => {
                const bId = b.id || `real-${userId}-${idx}`;
                // Avoid duplicating
                if (!allBookings.some((ab) => ab.id === bId)) {
                  allBookings.push({
                    id: bId,
                    bookingRef: b.pnr_number || b.bookingRef || `BK-${bId.substring(0, 4).toUpperCase()}`,
                    orderId: b.order_number || b.orderId || `ORD-${bId.substring(0, 4).toUpperCase()}`,
                    order_number: b.order_number,
                    pnr_number: b.pnr_number,
                    customerName: b.guestInfo?.name || userName,
                    customerEmail: b.guestInfo?.email || userEmail,
                    customerPhone: b.guestInfo?.phone || userPhone,
                    createdAt: b.createdAt || (b.bookingDate && !isNaN(new Date(b.bookingDate).getTime()) ? new Date(b.bookingDate).toLocaleDateString() : new Date().toLocaleDateString()) + ' 09:15 AM',
                    attractionId: b.attractionId,
                    attractionName: b.attractionName,
                    variant: b.variant || 'General Admission Tickets',
                    vendorPayable: '--',
                    totalPrice: b.totalPrice,
                    collectedAmount: b.totalPrice,
                    travelers: b.ticketsCount || 1,
                    bookingDate: b.bookingDate,
                    status: b.status || 'confirmed',
                    city: b.city || 'Paris',
                    attractionImageUrl: b.attractionImageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
                    passengers: b.passengers || b.guestInfo?.passengers || [
                      { name: b.guestInfo?.name || userName, type: 'Adult' }
                    ]
                  });
                }
              });
            }
          }
        }
      } catch (e) {
        console.error('Error scanning booking key from localStorage', e);
      }
    }

    // Merge backend bookings into allBookings if they aren't already there
    backendBookings.forEach((bb) => {
      if (!allBookings.some((ab) => ab.id === bb.id)) {
        allBookings.push(bb);
      } else {
        // Prefer the backend database version since it's the single source of truth for the system
        const idx = allBookings.findIndex((ab) => ab.id === bb.id);
        allBookings[idx] = bb;
      }
    });

    // Merge, priority goes to live user data if reference matches
    console.log('Admin tiqsey_bookings_ items (including backend):', allBookings.length);
    const finalBookings = [...baseBookings];
    allBookings.forEach((ab) => {
      const existingIndex = finalBookings.findIndex((fb) => fb.bookingRef === ab.bookingRef || fb.id === ab.id);
      if (existingIndex > -1) {
        // Overwrite standard with custom user details if applicable
        finalBookings[existingIndex] = ab;
      } else {
        finalBookings.push(ab);
      }
    });

    // Sort by Created At reverse (or ID reverse) to make newest first
    finalBookings.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      const hasA = !isNaN(dateA);
      const hasB = !isNaN(dateB);
      
      if (hasA && hasB) {
        if (dateB !== dateA) {
          return dateB - dateA;
        }
      } else if (hasA) {
        return -1; // Place valid dates first
      } else if (hasB) {
        return 1;
      }
      return b.id.localeCompare(a.id);
    });
    setBookings(finalBookings);

    // Keep selectedBooking in sync in real-time if it is currently open
    if (selectedBooking) {
      const updatedSelected = finalBookings.find(b => b.id === selectedBooking.id);
      if (updatedSelected && JSON.stringify(updatedSelected) !== JSON.stringify(selectedBooking)) {
        setSelectedBooking(updatedSelected);
      }
    }

    setIsRefreshing(false);
  };

  // Load bookings on mount and set up automatic real-time updates (polling)
  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 3000); // Poll database every 3 seconds for real-time automatic refreshes

    return () => clearInterval(interval);
  }, [selectedBooking]);

  // Sync state back to individual customer's bookings in localStorage if applicable
  const syncToCustomerStorage = (updatedBooking: AdminBooking) => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tiqsey_bookings_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const userBookings = JSON.parse(raw);
            if (Array.isArray(userBookings)) {
              let changed = false;
              const updatedList = userBookings.map((b: any) => {
                if (b.id === updatedBooking.id || b.bookingRef === updatedBooking.bookingRef) {
                  changed = true;
                  return {
                    ...b,
                    // Map client status. Client doesn't have "pending" state in typical options, or does. Let's keep it in sync.
                    status: updatedBooking.status === 'pending' ? 'confirmed' : updatedBooking.status,
                    bookingDate: updatedBooking.bookingDate,
                    ticketsCount: updatedBooking.travelers,
                    totalPrice: updatedBooking.totalPrice
                  };
                }
                return b;
              });
              if (changed) {
                localStorage.setItem(key, JSON.stringify(updatedList));
                console.log('Successfully synced customer booking in localStorage:', key);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Error synchronizing customer storage:', e);
    }
  };

  // Save/Update operations
  const updateBookingStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected') => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        const up = { ...b, status: newStatus };
        // Sync to Customer localStorage
        syncToCustomerStorage(up);
        // Sync to Backend Database
        saveBookingToBackend(up);
        // If modal is showing this, update selected booking details too
        if (selectedBooking?.id === id) {
          setSelectedBooking(up);
        }
        return up;
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('tiqsey_admin_bookings', JSON.stringify(updated));
    triggerToast(`Booking status successfully marked as ${newStatus.toUpperCase()}`, 'success');
  };

  const updateBookingDetails = (updatedBooking: AdminBooking) => {
    const updated = bookings.map((b) => b.id === updatedBooking.id ? updatedBooking : b);
    setBookings(updated);
    localStorage.setItem('tiqsey_admin_bookings', JSON.stringify(updated));
    syncToCustomerStorage(updatedBooking);
    // Sync to Backend Database
    saveBookingToBackend(updatedBooking);
    triggerToast('Booking details updated successfully', 'success');
  };

  const handleCancel = (id: string) => {
    updateBookingStatus(id, 'cancelled');
    setIsCancelling(false);
    setCancellationReason('');
  };

  // Helper to parse date string into Local date format for comparison
  const getLocalDate = (dStr: string) => {
    if (!dStr) return null;
    const ymdRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const match = dStr.match(ymdRegex);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return new Date(year, month, day);
    }
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // Filter & Search logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        b.orderId.toLowerCase().includes(q) ||
        b.bookingRef.toLowerCase().includes(q) ||
        (b.order_number && b.order_number.toLowerCase().includes(q)) ||
        (b.pnr_number && b.pnr_number.toLowerCase().includes(q)) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.attractionName.toLowerCase().includes(q);

      // 2. Status Tab
      const matchesStatus = 
        selectedStatusTab === 'all' || 
        b.status === selectedStatusTab;

      // 3. City Filter
      const matchesCity = 
        cityFilter === 'All' || 
        b.city?.toLowerCase() === cityFilter.toLowerCase();
        
      // 4. Drawer Status Filters
      let matchesDrawerStatus = true;
      if (appliedDrawerStatuses.length > 0) {
        // Map drawer readable statuses to actual data statuses
        const statusMap: Record<string, string> = {
          'Confirmation Pending': 'pending',
          'Confirmed': 'confirmed',
          'Completed': 'completed',
          'Cancelled': 'cancelled',
          'Rejected': 'rejected'
        };
        const activeDataStatuses = appliedDrawerStatuses.map(s => statusMap[s]).filter(Boolean);
        if (activeDataStatuses.length > 0) {
          matchesDrawerStatus = activeDataStatuses.includes(b.status);
        }
      }

      // 5. Created At Date Filter
      let matchesCreatedAt = true;
      const bCreated = getLocalDate(b.createdAt);
      if (bCreated) {
        if (appliedCreatedAtStart) {
          const start = getLocalDate(appliedCreatedAtStart);
          if (start && bCreated < start) matchesCreatedAt = false;
        }
        if (appliedCreatedAtEnd) {
          const end = getLocalDate(appliedCreatedAtEnd);
          if (end && bCreated > end) matchesCreatedAt = false;
        }
      }

      // 6. Invoice Due Date Filter
      let matchesInvoiceDue = true;
      const bInvoiceDue = getLocalDate(b.bookingDate); // Defaulting to travel date as mock due date proxy
      if (bInvoiceDue) {
        if (appliedInvoiceDueStart) {
          const start = getLocalDate(appliedInvoiceDueStart);
          if (start && bInvoiceDue < start) matchesInvoiceDue = false;
        }
        if (appliedInvoiceDueEnd) {
          const end = getLocalDate(appliedInvoiceDueEnd);
          if (end && bInvoiceDue > end) matchesInvoiceDue = false;
        }
      }

      // 7. Date of Travel Filter
      let matchesTravelDate = true;
      const bTravel = getLocalDate(b.bookingDate);
      if (bTravel) {
        if (appliedTravelStart) {
          const start = getLocalDate(appliedTravelStart);
          if (start && bTravel < start) matchesTravelDate = false;
        }
        if (appliedTravelEnd) {
          const end = getLocalDate(appliedTravelEnd);
          if (end && bTravel > end) matchesTravelDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesCity && matchesDrawerStatus && matchesCreatedAt && matchesInvoiceDue && matchesTravelDate;
    });
  }, [
    bookings, 
    searchQuery, 
    selectedStatusTab, 
    cityFilter, 
    appliedDrawerStatuses,
    appliedCreatedAtStart,
    appliedCreatedAtEnd,
    appliedInvoiceDueStart,
    appliedInvoiceDueEnd,
    appliedTravelStart,
    appliedTravelEnd
  ]);

  // Unique Cities for filters
  const cities = useMemo(() => {
    const set = new Set(bookings.map(b => b.city).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [bookings]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = bookings.length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
    const rejectedCount = bookings.filter(b => b.status === 'rejected').length;
    const totalRev = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      total: totalCount,
      pending: pendingCount,
      confirmed: confirmedCount,
      completed: completedCount,
      cancelled: cancelledCount,
      rejected: rejectedCount,
      revenue: totalRev
    };
  }, [bookings]);

  // Download ticket proxy
  const handleDownload = (booking: AdminBooking) => {
    try {
      downloadTicketVoucher({
        bookingId: booking.id,
        bookingRef: booking.bookingRef,
        order_number: booking.order_number,
        pnr_number: booking.pnr_number,
        attractionName: booking.attractionName,
        attractionImageUrl: booking.attractionImageUrl,
        city: booking.city || 'Paris',
        bookingDate: booking.bookingDate,
        timeSlot: '11:15 AM - Standard Admission',
        passengerName: booking.customerName,
        ticketsCount: booking.travelers,
        totalPrice: booking.totalPrice,
        additionalPassengers: booking.passengers?.map(p => {
          const names = p.name.split(' ');
          return {
            firstName: names[0] || 'Passenger',
            lastName: names.slice(1).join(' ') || 'User',
            type: p.type || 'Adult'
          };
        }) || []
      });
      triggerToast(`Ticket Voucher downloaded successfully for ${booking.bookingRef}!`, 'success');
    } catch (e) {
      console.error('Error generating ticket download', e);
      triggerToast('Error issuing voucher. Please try again.', 'error');
    }
  };

  if (selectedBooking) {
    return (
      <div className="w-full mx-auto pb-12 pl-12 pr-4 sm:pl-12 sm:pr-6 lg:pl-12 lg:pr-8">
        <BookingDetailsView
          booking={selectedBooking}
          onBack={() => {
            handleSelectBooking(null);
            setIsRescheduling(false);
            setIsCancelling(false);
          }}
          onUpdateStatus={updateBookingStatus}
          onUpdateBooking={updateBookingDetails}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full mx-auto pb-12 pl-12 pr-4 sm:pl-12 sm:pr-6 lg:pl-12 lg:pr-8">
      {/* Toast Alert Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-sans"
          >
            {toastType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toastType === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
            {toastType === 'info' && <AlertCircle className="w-5 h-5 text-[#5fa6d9]" />}
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>




      {/* Control Panel: Search, Refresh, Filter Triggers */}
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        {/* Search Bar matching screenshot */}
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7da7c4]" />
          <input
            type="text"
            placeholder="Search by name, email, phone, PNR or order ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-md pl-11 pr-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#5fa6d9] dark:focus:border-[#5fa6d9] placeholder:text-[#7da7c4] shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[13px] font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Refresh and Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBookings}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800/80 rounded-md text-[13px] font-semibold text-[#0a3560] dark:text-slate-300 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#5fa6d9]' : 'text-[#7da7c4]'}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 border rounded-md text-[13px] font-semibold transition-all cursor-pointer shadow-sm ${
              showFilters || cityFilter !== 'All'
                ? 'bg-[#5fa6d9]/10 border-[#5fa6d9] text-[#5fa6d9]' 
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/80 text-[#0a3560] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7da7c4]" />
            Filters
            {cityFilter !== 'All' && (
              <span className="w-1.5 h-1.5 bg-[#5fa6d9] rounded" />
            )}
          </button>
        </div>
      </div>

      {/* Tabs list with all 5 booking statuses plus ORDERS tab with exact badge layout */}
      <div className="border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto scrollbar-none">
        <div className="flex gap-6 min-w-max -mb-px">
          {/* ORDERS tab */}
          <button
            onClick={() => setSelectedStatusTab('all')}
            className={`pb-3 text-[11px] font-black tracking-wider uppercase border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              selectedStatusTab === 'all'
                ? 'border-[#5fa6d9] text-[#5fa6d9]'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            ORDERS
            <span className={`px-2 py-0.5 rounded text-[10px] font-black transition-colors ${
              selectedStatusTab === 'all'
                ? 'bg-[#5fa6d9]/10 text-[#5fa6d9]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {filteredBookings.length}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer removed from here, moved to side drawer below */}

      {/* Tabs and Cards Group with tighter vertical spacing to remove visual gaps */}
      <div className="space-y-4">
        {/* Orders List Container */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-md relative overflow-visible pl-6 sm:pl-8 pr-4 sm:pr-6 py-4 shadow-sm transition-all hover:shadow-md"
              >
                {/* Left Vertical Tab containing White lightbulb icon sticking out to the left as per screenshot */}
                <div className={`absolute right-full top-1/2 -translate-y-1/2 w-8 h-12 rounded-l-xl flex items-center justify-center text-white shadow-sm transition-all ${
                  booking.status === 'pending' ? 'bg-[#ff9500]' :
                  booking.status === 'confirmed' ? 'bg-emerald-500' :
                  booking.status === 'completed' ? 'bg-sky-500' :
                  booking.status === 'cancelled' ? 'bg-red-500' :
                  booking.status === 'rejected' ? 'bg-slate-400' :
                  'bg-slate-400 dark:bg-slate-600'
                }`}>
                  <Lightbulb className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>

                {/* Grid content */}
                <div className="space-y-2 font-sans">
                  {/* ROW 1: General identifiers */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dashed border-slate-200/80 dark:border-slate-800/60">
                    {/* ID, Name, Timestamp */}
                    <div className="flex flex-wrap items-center gap-y-2">
                      {/* Order ID */}
                      <div className="w-[180px] border-r border-slate-200/80 dark:border-slate-700/60 pr-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                          <FileText className="w-3.5 h-3.5 text-[#a8b8c8]" />
                          Order ID
                        </div>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          {booking.orderId}
                        </p>
                      </div>

                      {/* Customer Name */}
                      <div className="w-[180px] border-r border-slate-200/80 dark:border-slate-700/60 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                          <User className="w-3.5 h-3.5 text-[#a8b8c8]" />
                          Customer Name
                        </div>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          {booking.customerName}
                        </p>
                      </div>

                      {/* Created At */}
                      <div className="px-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                          <PenTool className="w-3.5 h-3.5 text-[#a8b8c8]" />
                          Created At
                        </div>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          {booking.createdAt}
                        </p>
                      </div>
                    </div>

                    {/* View Details button matching exactly the placement and color theme of the screenshot */}
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectBooking(booking);
                        setNewTravelDate(booking.bookingDate);
                      }}
                      className="px-5 py-2 bg-[#5fa6d9] hover:bg-[#4ea0d6]/90 text-white text-[12px] font-bold rounded-md transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ROW 2: Activity Title, Subtitle, PNR, Travelers, Travel Date, Status Badge */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between pt-2">
                    {/* Attraction details */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-[14px] font-semibold text-slate-800 dark:text-white leading-tight truncate">
                        {booking.attractionName}
                      </h3>
                      <p className="text-[12px] text-[#889aa8] font-medium mt-1 truncate">
                        Variant: {booking.variant}
                      </p>
                    </div>

                    {/* Booking specifics and Status Badge */}
                    <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-12 gap-y-3">
                      <div className="flex items-center gap-x-4 lg:gap-x-8">
                        {/* PNR */}
                        <div className="w-20">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                            <Ticket className="w-3.5 h-3.5 text-[#a8b8c8]" />
                            PNR
                          </div>
                          <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-300 mt-1 tracking-wide">
                            {booking.bookingRef}
                          </p>
                        </div>

                        {/* Travelers */}
                        <div className="w-20">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                            <Users className="w-3.5 h-3.5 text-[#a8b8c8]" />
                            Travelers
                          </div>
                          <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-300 mt-1">
                            {booking.travelers}
                          </p>
                        </div>

                        {/* Date of Travel */}
                        <div className="w-28">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#a8b8c8]" />
                            Date of Travel
                          </div>
                          <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-300 mt-1">
                            {booking.bookingDate && !isNaN(new Date(booking.bookingDate).getTime()) ? new Date(booking.bookingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : booking.bookingDate || '--'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge & External Icon Link matching screenshot */}
                      <div className="flex items-center justify-start lg:justify-end gap-2.5 min-w-[140px]">
                      {booking.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-orange-500/10 text-orange-600 border border-orange-200/50 uppercase tracking-wider">
                          PENDING
                        </span>
                      )}

                      {booking.status === 'confirmed' && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 uppercase tracking-wider">
                          CONFIRMED
                        </span>
                      )}

                      {booking.status === 'completed' && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-sky-500/10 text-sky-600 border border-sky-200/50 uppercase tracking-wider">
                          COMPLETED
                        </span>
                      )}

                      {booking.status === 'cancelled' && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-red-500/10 text-red-600 border border-red-200/50 uppercase tracking-wider">
                          CANCELLED
                        </span>
                      )}

                      {booking.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-500/10 text-slate-500 border border-slate-200/50 uppercase tracking-wider">
                          REJECTED
                        </span>
                      )}

                      {/* Small external link indicator */}
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleSelectBooking(booking); }} 
                        className="text-[#8892a0] hover:text-[#5fa6d9] transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                      </a>
                    </div>
                  </div>
                </div>

                  {/* ROW 3: Vendor Payable, Total Amount, Collected/Authorized, Direct Booking button */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-2">
                      {/* Vendor Payable */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                          <Wallet className="w-3.5 h-3.5 text-[#a8b8c8]" />
                          Vendor Payable
                        </div>
                        <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-300 mt-1">
                          {booking.vendorPayable}
                        </p>
                      </div>

                      {/* Total Amount */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                          <Wallet className="w-3.5 h-3.5 text-[#a8b8c8]" />
                          Total Amount
                        </div>
                        <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-300 mt-1">
                          USD {booking.totalPrice}
                        </p>
                      </div>

                      {/* Collected/Authorized */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#889aa8] font-medium">
                          <Wallet className="w-3.5 h-3.5 text-[#a8b8c8]" />
                          Collected/Authorized
                        </div>
                        <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-300 mt-1">
                          USD {booking.collectedAmount}
                        </p>
                      </div>
                    </div>

                    {/* Direct Booking button matching screenshot */}
                    <button
                      type="button"
                      onClick={() => triggerToast(`Connecting direct API to operator for booking reference: ${booking.bookingRef}`, 'info')}
                      className="border border-[#7da7c4] text-[#4a7295] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-[12px] font-semibold rounded-md px-4 py-2 transition-colors cursor-pointer shadow-sm"
                    >
                      Direct Booking
                    </button>
                  </div>


                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg p-12 text-center shadow-sm">
              <Ticket className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">No matching orders found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                Try updating your search query or selecting a different status/destination filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SIDE DRAWER FILTERS */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleCloseDrawer}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Filters</h2>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Created At */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Created At</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        value={drawerCreatedAtStart}
                        onChange={(e) => setDrawerCreatedAtStart(e.target.value)}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-600 dark:text-slate-300" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span className="text-slate-400 text-xs">→</span>
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        value={drawerCreatedAtEnd}
                        onChange={(e) => setDrawerCreatedAtEnd(e.target.value)}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-600 dark:text-slate-300" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Invoice Due Date */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Invoice Due Date</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        value={drawerInvoiceDueStart}
                        onChange={(e) => setDrawerInvoiceDueStart(e.target.value)}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-600 dark:text-slate-300" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span className="text-slate-400 text-xs">→</span>
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        value={drawerInvoiceDueEnd}
                        onChange={(e) => setDrawerInvoiceDueEnd(e.target.value)}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-600 dark:text-slate-300" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Date Of Travel */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Date Of Travel</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        value={drawerTravelStart}
                        onChange={(e) => setDrawerTravelStart(e.target.value)}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-600 dark:text-slate-300" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span className="text-slate-400 text-xs">→</span>
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        value={drawerTravelEnd}
                        onChange={(e) => setDrawerTravelEnd(e.target.value)}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-600 dark:text-slate-300" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Regions</label>
                  <select className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-500 dark:text-slate-400 appearance-none">
                    <option value="">Search or Select a Region</option>
                  </select>
                </div>

                {/* GEO */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">GEO</label>
                  <select className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-500 dark:text-slate-400 appearance-none mb-2">
                    <option value="">Search or Select a GEO</option>
                  </select>
                  <button className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50">
                    Without GEO
                  </button>
                </div>

                {/* Agents */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Agents</label>
                  <select className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-slate-400 text-slate-500 dark:text-slate-400 appearance-none">
                    <option value="">Search or Select a Agent</option>
                  </select>
                </div>

                {/* Types */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Types</label>
                  <div className="flex flex-wrap gap-2">
                    {['Owned', 'Resold via Partner', 'Resold via Us'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => toggleArrayItem(drawerTypes, setDrawerTypes, t)}
                        className={`px-3 py-1.5 text-[10px] font-semibold border rounded transition-colors ${
                          drawerTypes.includes(t)
                            ? 'border-[#5fa6d9] bg-[#5fa6d9]/10 text-[#5fa6d9]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#5fa6d9] hover:text-[#5fa6d9]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cart Abandoned', 'Payment Due', 'Confirmed', 'Completed', 'Confirmation Pending', 'Cancelled', 'Rejected', 'Partial Paid', 'Will Be Cart Abandoned'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => toggleArrayItem(drawerStatuses, setDrawerStatuses, t)}
                        className={`px-3 py-1.5 text-[10px] font-semibold border rounded transition-colors ${
                          drawerStatuses.includes(t)
                            ? 'border-[#5fa6d9] bg-[#5fa6d9]/10 text-[#5fa6d9]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#5fa6d9] hover:text-[#5fa6d9]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Sources</label>
                  <div className="flex flex-wrap gap-2">
                    {['Direct Booking', 'Quotation Booking', 'Offline Booking', 'Custom Booking', 'Pay At Venue Booking', 'Agent Booking'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => toggleArrayItem(drawerSources, setDrawerSources, t)}
                        className={`px-3 py-1.5 text-[10px] font-semibold border rounded transition-colors ${
                          drawerSources.includes(t)
                            ? 'border-[#5fa6d9] bg-[#5fa6d9]/10 text-[#5fa6d9]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#5fa6d9] hover:text-[#5fa6d9]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 dark:text-slate-200 mb-2">Reviews</label>
                  <div className="flex flex-wrap gap-2">
                    {['With Review', 'Without Review'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => toggleArrayItem(drawerReviews, setDrawerReviews, t)}
                        className={`px-3 py-1.5 text-[10px] font-semibold border rounded transition-colors ${
                          drawerReviews.includes(t)
                            ? 'border-[#5fa6d9] bg-[#5fa6d9]/10 text-[#5fa6d9]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#5fa6d9] hover:text-[#5fa6d9]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-end gap-3 mt-auto">
                <button
                  onClick={() => {
                    setCityFilter('All');
                    setSelectedStatusTab('all');
                    setDrawerTypes([]);
                    setDrawerStatuses([]);
                    setDrawerSources([]);
                    setDrawerReviews([]);
                    setDrawerCreatedAtStart('');
                    setDrawerCreatedAtEnd('');
                    setDrawerInvoiceDueStart('');
                    setDrawerInvoiceDueEnd('');
                    setDrawerTravelStart('');
                    setDrawerTravelEnd('');
                    setAppliedDrawerTypes([]);
                    setAppliedDrawerStatuses([]);
                    setAppliedDrawerSources([]);
                    setAppliedDrawerReviews([]);
                    setAppliedCreatedAtStart('');
                    setAppliedCreatedAtEnd('');
                    setAppliedInvoiceDueStart('');
                    setAppliedInvoiceDueEnd('');
                    setAppliedTravelStart('');
                    setAppliedTravelEnd('');
                  }}
                  className="px-6 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setAppliedDrawerTypes(drawerTypes);
                    setAppliedDrawerStatuses(drawerStatuses);
                    setAppliedDrawerSources(drawerSources);
                    setAppliedDrawerReviews(drawerReviews);
                    setAppliedCreatedAtStart(drawerCreatedAtStart);
                    setAppliedCreatedAtEnd(drawerCreatedAtEnd);
                    setAppliedInvoiceDueStart(drawerInvoiceDueStart);
                    setAppliedInvoiceDueEnd(drawerInvoiceDueEnd);
                    setAppliedTravelStart(drawerTravelStart);
                    setAppliedTravelEnd(drawerTravelEnd);
                    setShowFilters(false);
                  }}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#5fa6d9] hover:bg-[#4ea0d6]/90 rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
