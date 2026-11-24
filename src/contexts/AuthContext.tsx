import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking } from '../types';
import { TRAVEL_AVATARS } from '../utils/avatars';

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  bookings: Booking[];
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  loginWithGoogle: (email: string, name: string, avatarUrl: string) => Promise<User>;
  logout: () => void;
  updateProfile: (name: string, email: string, bio?: string, avatarUrl?: string) => Promise<User>;
  addBooking: (
    attractionId: string, 
    attractionName: string, 
    imageUrl: string, 
    city: string, 
    date: string, 
    count: number, 
    pricePerTicket: number, 
    guestInfo?: { name: string; email: string; passengers?: any[] },
    childCount?: number,
    childPrice?: number,
    passengers?: any[],
    totalPriceOverride?: number,
    timeslot?: string,
    paymentCurrency?: string,
    paymentPrice?: number,
    paymentSymbol?: string
  ) => Promise<Booking>;
  rateBooking: (bookingId: string, rating: number) => Promise<void>;
  submitReview: (
    bookingId: string,
    attractionId: string,
    rating: number,
    comment: string
  ) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo credentials
const SESSION_STORAGE_KEY = 'tiqsey_current_session';

export const deriveNameFromEmail = (emailStr: string): string => {
  if (!emailStr) return '';
  const parts = emailStr.split('@')[0];
  if (!parts) return '';
  return parts
    .replace(/[._\-+]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

const safeStorageGet = (storage: Storage | undefined, key: string): string | null => {
  try {
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
};

const safeStorageSet = (storage: Storage | undefined, key: string, value: string): boolean => {
  try {
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeStorageRemove = (storage: Storage | undefined, key: string): void => {
  try {
    storage?.removeItem(key);
  } catch {
    // Ignore restricted storage errors
  }
};

const sanitizeSessionUser = (raw: any): User | null => {
  if (!raw || typeof raw !== 'object' || typeof raw.email !== 'string' || !raw.email.trim()) {
    return null;
  }
  const { password: _removed, ...rest } = raw;
  const normalizedEmail = raw.email.trim().toLowerCase();
  const isAdmin = raw.role === 'admin';
  return {
    ...rest,
    id: raw.id || (isAdmin ? (normalizedEmail === 'bigbakket@gmail.com' ? 'admin-user-bigbakket' : 'admin-user-456') : `user-${Date.now()}`),
    name: raw.name || deriveNameFromEmail(raw.email),
    email: raw.email.trim(),
    role: isAdmin ? 'admin' : (raw.role || 'user'),
  } as User;
};

const readStoredSession = (): User | null => null;

// Authentication is held by the server's signed HttpOnly cookie.
// Never persist a client-editable user or role as an authentication credential.
const persistStoredSession = (_sessionUser: User | null): void => {};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => readStoredSession());
  const [isAuthReady, setIsAuthReady] = useState<boolean>(() => readStoredSession() !== null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const hydrateUserBookings = (loggedUser: User) => {
    const storedBookings = safeStorageGet(window.localStorage, `tiqsey_bookings_${loggedUser.id}`);
    if (!storedBookings) {
      setBookings([]);
      return;
    }
    try {
      const parsed = JSON.parse(storedBookings);
      setBookings(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBookings([]);
    }
  };

  // Restore authentication only from the signed server-side HttpOnly session cookie.
  useEffect(() => {
    let active = true;
    // Remove the legacy browser-side mock user store, which may contain plaintext demo credentials.
    safeStorageRemove(window.localStorage, 'tiqsey_users');
    fetch('/api/auth/session', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json().catch(() => null);
        return data?.authenticated && data?.user ? sanitizeSessionUser(data.user) : null;
      })
      .then((serverUser) => {
        if (!active) return;
        setUser(serverUser);
        if (serverUser) hydrateUserBookings(serverUser);
        else setBookings([]);
        setIsAuthReady(true);
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setBookings([]);
          setIsAuthReady(true);
        }
      });
    return () => { active = false; };
  }, []);

  // (bookings hydration handled by hydrateUserBookings above)

  const login = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) throw new Error('Please enter your email and password.');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ email: trimmedEmail, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.success || !data?.user) {
      throw new Error(data?.error || 'Sign in failed. Please check your credentials.');
    }
    const authenticatedUser = sanitizeSessionUser(data.user);
    if (!authenticatedUser) throw new Error('The server returned an invalid user session.');
    setUser(authenticatedUser);
    setIsAuthReady(true);
    hydrateUserBookings(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail || !password) throw new Error('Please complete all required fields.');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.success || !data?.user) {
      throw new Error(data?.error || 'Account registration failed.');
    }
    const authenticatedUser = sanitizeSessionUser(data.user);
    if (!authenticatedUser) throw new Error('The server returned an invalid user session.');
    setUser(authenticatedUser);
    setIsAuthReady(true);
    setBookings([]);
    return authenticatedUser;
  };

  const loginWithGoogle = async (_email: string, _name: string, _avatarUrl: string): Promise<User> => {
    throw new Error('Google sign-in must be completed through the verified OAuth flow. Client-supplied profile details cannot authenticate an account.');
  };

  const logout = () => {
    persistStoredSession(null);
    setUser(null);
    setBookings([]);
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).catch(() => {});
  };

  const updateProfile = async (_name: string, _email: string, bio?: string, avatarUrl?: string): Promise<User> => {
    if (!user) throw new Error('No authenticated user');
    const updatedUser: User = {
      ...user,
      bio: bio !== undefined ? bio : user.bio,
      avatarUrl: avatarUrl || user.avatarUrl,
    };
    setUser(updatedUser);
    return updatedUser;
  };


  const addBooking = async (
    attractionId: string, 
    attractionName: string, 
    imageUrl: string, 
    city: string, 
    date: string, 
    count: number, 
    pricePerTicket: number,
    guestInfo?: { name: string; email: string; passengers?: any[] },
    childCount?: number,
    childPrice?: number,
    passengers?: any[],
    totalPriceOverride?: number,
    timeslot?: string,
    paymentCurrency?: string,
    paymentPrice?: number,
    paymentSymbol?: string
  ): Promise<Booking> => {
    let activeUser = user;
    if (!activeUser && guestInfo) {
      // Create an anonymous, lightweight guest session
      const guestId = `guest-${Date.now()}`;
      const newGuest: User = {
        id: guestId,
        name: guestInfo.name,
        email: guestInfo.email,
        createdAt: new Date().toLocaleDateString(),
        bio: 'Guest Voyager (Anonymous Checkout)'
      };
      // Save guest user state to DB
      const usersRaw = safeStorageGet(window.localStorage, 'tiqsey_users') || '[]';
      let users: any[] = [];
      try {
        const parsedUsers = JSON.parse(usersRaw);
        users = Array.isArray(parsedUsers) ? parsedUsers : [];
      } catch {
        users = [];
      }
      users.push(newGuest);
      safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(users));
      // Authenticate guest user session
      persistStoredSession(newGuest);
      setUser(newGuest);
      activeUser = newGuest;
    }
    
    if (!activeUser) {
      throw new Error('Please log in, register, or provide guest details to buy tickets.');
    }

    // Generate real secure unique IDs from the backend (with fallback for static hosting)
    let order_number = '';
    let pnr_number = '';
    try {
      const response = await fetch('/api/bookings/generate-ids', { method: 'POST' });
      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.success) {
          order_number = data.orderNumber;
          pnr_number = data.pnrNumber;
        }
      }
    } catch (_) {}

    if (!order_number) {
      order_number = `OD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
    }
    if (!pnr_number) {
      pnr_number = `BK${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    }

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
    const createdAtStr = `${formattedDate} ${formattedTime}`;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      attractionId,
      attractionName,
      attractionImageUrl: imageUrl,
      city,
      bookingDate: date,
      ticketsCount: count + (childCount || 0),
      totalPrice: totalPriceOverride !== undefined ? totalPriceOverride : (count * pricePerTicket) + ((childCount || 0) * (childPrice || 0)),
      bookingRef: pnr_number, // PNR is the bookingRef
      order_number, // OD...
      pnr_number,   // BK...
      timeslot,     // Set the selected timeslot
      status: 'confirmed',
      childCount: childCount || 0,
      guestInfo,
      passengers,
      createdAt: createdAtStr,
      paymentCurrency,
      paymentPrice,
      paymentSymbol
    };
    
    const updatedBookings = [newBooking, ...bookings];
    localStorage.setItem(`tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    // Save/Sync the completed booking to the backend database if available
    let backendSyncedToSupabase = false;
    try {
      const saveResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      const saveContentType = saveResponse.headers.get("content-type") || "";
      if (saveContentType.includes("application/json")) {
        const saveData = await saveResponse.json();
        if (saveData.success) {
          backendSyncedToSupabase = Boolean(saveData.supabaseSynced);
          console.log(`[Database Sync] Successfully saved booking ${newBooking.id} to backend.`);
        }
      }
    } catch (_) {
      // Backend not running on static host
    }

    // Direct Supabase sync fallback from client (only if backend did not already sync to Supabase)
    if (!backendSyncedToSupabase) {
      try {
        import('../lib/supabase').then(async ({ supabase, isSupabaseConfigured }) => {
          if (!isSupabaseConfigured || !supabase) return;
          try {
            const { error } = await supabase.from('bookings').upsert({
              id: newBooking.id,
              order_number: newBooking.order_number,
              pnr_number: newBooking.pnr_number,
              attraction_id: newBooking.attractionId,
              attraction_name: newBooking.attractionName,
              attraction_image_url: newBooking.attractionImageUrl,
              city: newBooking.city,
              booking_date: newBooking.bookingDate,
              tickets_count: newBooking.ticketsCount,
              total_price: newBooking.totalPrice,
              status: newBooking.status,
              child_count: newBooking.childCount,
              guest_name: newBooking.guestInfo?.name || '',
              guest_email: newBooking.guestInfo?.email || '',
              guest_phone: (newBooking.guestInfo as any)?.phone || '',
              passengers_json: JSON.stringify(newBooking.passengers || []),
              created_at: newBooking.createdAt,
              timeslot: newBooking.timeslot,
              payment_currency: newBooking.paymentCurrency,
              payment_price: newBooking.paymentPrice,
              payment_symbol: newBooking.paymentSymbol
            }, { onConflict: 'id' });
            if (error) console.warn('[Supabase Client Sync Warning]:', error.message);
            else console.log('[Supabase Client Sync]: Booking saved to Supabase successfully.');
          } catch (_) {}
        }).catch(() => {});
      } catch (_) {}
    }

    return newBooking;
  };

  const rateBooking = async (bookingId: string, rating: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const activeUser = user;
      if (!activeUser) {
        reject(new Error('No authenticated user'));
        return;
      }
      setTimeout(() => {
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, rating } : b
        );
        localStorage.setItem(`tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        resolve();
      }, 300);
    });
  };

  const submitReview = async (
    bookingId: string,
    attractionId: string,
    rating: number,
    comment: string
  ): Promise<void> => {
    const activeUser = user || { id: 'anonymous', name: 'Verified Customer', email: '' };
    
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${months[now.getMonth()]} ${now.getFullYear()}`;

    const reviewId = `rev-${Date.now()}`;
    try {
      let reviewSyncedToSupabase = false;
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: reviewId,
            bookingId,
            attractionId,
            userId: activeUser.id,
            userName: activeUser.name,
            userEmail: activeUser.email,
            rating,
            comment,
            createdAt: formattedDate
          })
        });
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          reviewSyncedToSupabase = Boolean(data?.supabaseSynced);
        }
      } catch (_) {
        // Backend not running on static host
      }

      // Direct Supabase sync fallback for reviews (only if backend did not already sync)
      if (!reviewSyncedToSupabase) {
        try {
          import('../lib/supabase').then(async ({ supabase, isSupabaseConfigured }) => {
            if (!isSupabaseConfigured || !supabase) return;
            try {
              const { error } = await supabase.from('reviews').upsert({
                id: reviewId,
                booking_id: bookingId,
                attraction_id: attractionId,
                user_id: activeUser.id,
                user_name: activeUser.name,
                user_email: activeUser.email,
                rating: Number(rating),
                comment,
                created_at: new Date().toISOString()
              }, { onConflict: 'id' });
              if (error) console.warn('[Supabase Review Sync Warning]:', error.message);
            } catch (_) {}
          }).catch(() => {});
        } catch (_) {}
      }

      // Update local storage and state
      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { ...b, rating } : b
      );
      if (activeUser.id !== 'anonymous') {
        localStorage.setItem(`tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
      }
      setBookings(updatedBookings);
    } catch (err: any) {
      console.error('Error in submitReview context method:', err);
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const activeUser = user;
      if (!activeUser) {
        reject(new Error('No authenticated user'));
        return;
      }
      setTimeout(() => {
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
        );
        localStorage.setItem(`tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
        setBookings(updatedBookings);

        // Sync cancellation to backend (and fallback to direct Supabase if backend unavailable)
        fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' })
        })
          .then(async (res) => {
            const ct = res.headers.get('content-type') || '';
            if (res.ok && ct.includes('application/json')) {
              const data = await res.json().catch(() => ({}));
              if (data?.supabaseSynced) return;
            }
            const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
            if (isSupabaseConfigured && supabase) {
              await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
            }
          })
          .catch(async () => {
            try {
              const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
              if (isSupabaseConfigured && supabase) {
                await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
              }
            } catch (_) {}
          });

        resolve();
      }, 300);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthReady,
      bookings, 
      isAuthModalOpen, 
      setAuthModalOpen, 
      login, 
      register, 
      loginWithGoogle,
      logout, 
      updateProfile,
      addBooking,
      rateBooking,
      submitReview,
      cancelBooking
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
