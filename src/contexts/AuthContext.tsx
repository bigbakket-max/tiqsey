import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking } from '../types';
import { TRAVEL_AVATARS } from '../utils/avatars';
import {
  APP_MODE,
  ADMIN_SITE_URL,
  isPublicProductionHost,
  resolveApiUrl,
} from '../utils/appConfig';

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  bookings: Booking[];
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  claimAdminSetup: (email: string, password: string) => Promise<User>;
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

// Default demo credentials (non-admin preview account)
const DEMO_EMAIL = 'demo@tiqsey.com';
const DEMO_PASSWORD = 'password123';
export const ADMIN_EMAILS = ['admin@tiqsey.com', 'superadmin@tiqsey.com', 'bigbakket@gmail.com'];

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

const SESSION_STORAGE_KEY = 'tiqsey_current_session';

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
  const isAdmin = ADMIN_EMAILS.includes(normalizedEmail) || raw.role === 'admin';
  return {
    ...rest,
    id: raw.id || (isAdmin ? (normalizedEmail === 'bigbakket@gmail.com' ? 'admin-user-bigbakket' : 'admin-user-456') : `user-${Date.now()}`),
    name: raw.name || deriveNameFromEmail(raw.email),
    email: raw.email.trim(),
    role: isAdmin ? 'admin' : (raw.role || 'user'),
  } as User;
};

const readStoredSession = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw =
    safeStorageGet(window.localStorage, SESSION_STORAGE_KEY) ||
    safeStorageGet(window.sessionStorage, SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return sanitizeSessionUser(parsed);
  } catch {
    return null;
  }
};

const persistStoredSession = (sessionUser: User | null): void => {
  if (typeof window === 'undefined') return;
  if (!sessionUser) {
    safeStorageRemove(window.localStorage, SESSION_STORAGE_KEY);
    safeStorageRemove(window.sessionStorage, SESSION_STORAGE_KEY);
    return;
  }
  const clean = sanitizeSessionUser(sessionUser);
  if (!clean) return;
  const serialized = JSON.stringify(clean);
  safeStorageSet(window.localStorage, SESSION_STORAGE_KEY, serialized);
  safeStorageSet(window.sessionStorage, SESSION_STORAGE_KEY, serialized);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const initial = readStoredSession();
    // Never trust an unverified cached admin session on initial paint before /api/auth/session confirms the HttpOnly cookie
    if (initial && (initial.role === 'admin' || ADMIN_EMAILS.includes(initial.email.toLowerCase()))) {
      return null;
    }
    return initial;
  });
  const [isAuthReady, setIsAuthReady] = useState<boolean>(() => {
    const initial = readStoredSession();
    if (!initial) return false;
    if (initial.role === 'admin' || ADMIN_EMAILS.includes(initial.email.toLowerCase())) {
      return false;
    }
    return true;
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const hydrateUserBookings = (loggedUser: User) => {
    const storedBookings = safeStorageGet(window.localStorage, `tiqsey_bookings_${loggedUser.id}`);
    let parsedBookings: Booking[] | null = null;
    if (storedBookings) {
      try {
        const parsed = JSON.parse(storedBookings);
        parsedBookings = Array.isArray(parsed) ? parsed : null;
      } catch {
        parsedBookings = null;
      }
    }
    if (parsedBookings && parsedBookings.length === 2 && loggedUser.email === DEMO_EMAIL) {
      parsedBookings.push({
        id: 'book-3',
        attractionId: 'louvre-museum',
        attractionName: 'Louvre Museum: Ultimate Priority Access & Audio Tour',
        attractionImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1200',
        city: 'Paris',
        bookingDate: '2026-04-10',
        ticketsCount: 3,
        totalPrice: 90,
        bookingRef: 'TQ-452109-FR',
        status: 'confirmed'
      });
      safeStorageSet(window.localStorage, `tiqsey_bookings_${loggedUser.id}`, JSON.stringify(parsedBookings));
    }
    if (parsedBookings) {
      setBookings(parsedBookings);
    } else if (loggedUser.email === DEMO_EMAIL) {
      const prePopulated: Booking[] = [
        {
          id: 'book-1',
          attractionId: 'sagrada-familia',
          attractionName: 'Sagrada Familia | Skip-The-Line Tickets + Audio Guide',
          attractionImageUrl: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=85&w=1200',
          city: 'Barcelona',
          bookingDate: '2026-06-15',
          ticketsCount: 2,
          totalPrice: 60,
          bookingRef: 'TQ-983105-ES',
          status: 'confirmed'
        },
        {
          id: 'book-2',
          attractionId: 'van-gogh',
          attractionName: 'Van Gogh Museum: Timed-entry Admission Ticket',
          attractionImageUrl: 'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&q=85&w=1200',
          city: 'Amsterdam',
          bookingDate: '2026-06-12',
          ticketsCount: 1,
          totalPrice: 22,
          bookingRef: 'TQ-340120-NL',
          status: 'confirmed'
        },
        {
          id: 'book-3',
          attractionId: 'louvre-museum',
          attractionName: 'Louvre Museum: Ultimate Priority Access & Audio Tour',
          attractionImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1200',
          city: 'Paris',
          bookingDate: '2026-04-10',
          ticketsCount: 3,
          totalPrice: 90,
          bookingRef: 'TQ-452109-FR',
          status: 'confirmed'
        }
      ];
      safeStorageSet(window.localStorage, `tiqsey_bookings_${loggedUser.id}`, JSON.stringify(prePopulated));
      setBookings(prePopulated);
    }
  };

  // Load user, seed defaults safely, and verify server cookie session if needed
  useEffect(() => {
    let active = true;

    // Prime the demo traveler user safely (never store admin credentials in client localStorage)
    const registeredUsers = safeStorageGet(window.localStorage, 'tiqsey_users');
    if (!registeredUsers) {
      const initialUsers = [
        {
          id: 'demo-user-123',
          name: 'Alex Mercer',
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          bio: 'Adventurer, photographer, and world traveler. Always looking for the next historic landmark or nature hike.',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toLocaleDateString(),
          role: 'user',
        },
      ];
      safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(initialUsers));
    } else {
      try {
        const users = JSON.parse(registeredUsers);
        if (Array.isArray(users)) {
          const cleaned = users.filter((u: any) => !ADMIN_EMAILS.includes(String(u?.email || '').toLowerCase()));
          if (cleaned.length !== users.length) {
            safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(cleaned));
          }
        }
      } catch (e) {
        console.error('Failed to parse registered users', e);
      }
    }

    const storedUser = readStoredSession();
    const storedIsAdmin = Boolean(
      storedUser && (storedUser.role === 'admin' || ADMIN_EMAILS.includes(storedUser.email.toLowerCase()))
    );

    if (storedUser && !storedIsAdmin) {
      // Standard customer session
      persistStoredSession(storedUser);
      setUser(storedUser);
      hydrateUserBookings(storedUser);
      setIsAuthReady(true);
    } else {
      // Always verify admin sessions (and empty sessions) against the server-signed HttpOnly session cookie
      fetch(resolveApiUrl('/api/auth/session'), { credentials: 'include' })
        .then(async (res) => {
          const ct = res.headers.get('content-type') || '';
          if (!res.ok || !ct.includes('application/json')) return { reachable: false, user: null };
          const data = await res.json();
          const verifiedUser = data?.authenticated && data?.user ? sanitizeSessionUser(data.user) : null;
          return { reachable: true, user: verifiedUser };
        })
        .then(({ reachable, user: serverUser }) => {
          if (!active) return;
          if (serverUser) {
            persistStoredSession(serverUser);
            setUser(serverUser);
            hydrateUserBookings(serverUser);
          } else if (reachable && storedIsAdmin) {
            // Backend confirmed no valid signed HttpOnly cookie exists; clear stale cached admin state
            persistStoredSession(null);
            setUser(null);
            setBookings([]);
          }
          setIsAuthReady(true);
        })
        .catch(() => {
          if (active) setIsAuthReady(true);
        });
    }

    // Keep auth state synchronized across browser tabs
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key !== SESSION_STORAGE_KEY) return;
      if (!e.newValue) {
        setUser(null);
        setBookings([]);
        return;
      }
      try {
        const synced = sanitizeSessionUser(JSON.parse(e.newValue));
        if (synced) {
          setUser(synced);
          hydrateUserBookings(synced);
        }
      } catch {
        // Ignore malformed cross-tab data
      }
    };

    window.addEventListener('storage', handleStorageSync);
    return () => {
      active = false;
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);
  // (bookings hydration handled by hydrateUserBookings above)

  const claimAdminSetup = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error('Please enter your administrator email and choose a password.');
    }

    const response = await fetch(resolveApiUrl('/api/auth/admin-setup'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ email: trimmedEmail, password }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Admin setup requires the backend server to be running.');
    }

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.user) {
      throw new Error(data?.error || 'Could not complete administrator setup.');
    }

    const userSession = sanitizeSessionUser({
      ...data.user,
      bio: 'Super Administrator.',
      createdAt: new Date().toLocaleDateString(),
      role: 'admin',
    });
    if (!userSession) {
      throw new Error('Invalid administrator session returned by server.');
    }

    persistStoredSession(userSession);
    setUser(userSession);
    setIsAuthReady(true);
    hydrateUserBookings(userSession);
    return userSession;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error('Please fill in both email and password.');
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

    if (isAdmin && (APP_MODE === 'public' || isPublicProductionHost())) {
      throw new Error(`Administrator sign-in is only available at ${ADMIN_SITE_URL}.`);
    }

    // Server-side verification & signed HttpOnly session cookie
    try {
      const response = await fetch(resolveApiUrl('/api/auth/login'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok && data?.success && data?.user) {
          const userSession = sanitizeSessionUser({
            ...data.user,
            bio: isAdmin ? 'Super Administrator.' : 'Explorer on Tiqsey',
            createdAt: new Date().toLocaleDateString(),
            role: isAdmin ? 'admin' : data.user.role || 'user',
          });
          if (userSession) {
            persistStoredSession(userSession);
            setUser(userSession);
            setIsAuthReady(true);
            hydrateUserBookings(userSession);
            return userSession;
          }
        }
        if (isAdmin) {
          const err: any = new Error(
            data?.error || 'Incorrect administrator password. Please check your credentials.'
          );
          if (data?.needsSetup) err.needsSetup = true;
          throw err;
        }
      } else if (isAdmin) {
        throw new Error('Administrator sign-in requires the backend server to verify credentials.');
      }
    } catch (err: any) {
      if (isAdmin) {
        throw err instanceof Error
          ? err
          : new Error('Unable to verify administrator credentials.');
      }
      // For standard customer accounts on static hosting, fall back seamlessly to local preview session
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersRaw = safeStorageGet(window.localStorage, 'tiqsey_users') || '[]';
        let users: any[] = [];
        try {
          const parsedUsers = JSON.parse(usersRaw);
          users = Array.isArray(parsedUsers) ? parsedUsers : [];
        } catch (_) {
          users = [];
        }

        const matched = users.find((u: any) => u.email?.toLowerCase() === normalizedEmail);

        if (matched) {
          if (matched.password && matched.password !== password) {
            reject(new Error('Incorrect password. Please verify your credentials or use the demo password.'));
            return;
          }

          const { password: _, ...userSession } = matched;
          persistStoredSession(userSession);
          setUser(userSession);
          setIsAuthReady(true);
          hydrateUserBookings(userSession);
          resolve(userSession);
        } else {
          const tempUser: any = {
            id: `user-${Date.now()}`,
            name: deriveNameFromEmail(trimmedEmail),
            email: trimmedEmail,
            password: password,
            bio: 'New explorer on Tiqsey!',
            avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
            createdAt: new Date().toLocaleDateString(),
            role: 'user',
          };
          users.push(tempUser);
          safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(users));

          const { password: _, ...userSession } = tempUser;
          persistStoredSession(userSession);
          setUser(userSession);
          setIsAuthReady(true);
          setBookings([]);
          resolve(userSession);
        }
      }, 300);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error('Please fill in all required fields.');
    }

    // Check if account already exists locally
    const usersRaw = safeStorageGet(window.localStorage, 'tiqsey_users') || '[]';
    let users: any[] = [];
    try {
      users = JSON.parse(usersRaw);
    } catch (_) {
      users = [];
    }

    const emailExists = users.some((u: any) => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (emailExists) {
      throw new Error('An account with this email is already registered. Please sign in instead.');
    }

    // Attempt backend sync safely without breaking if backend returns HTML (e.g. on static hosting like Hostinger)
    try {
      const response = await fetch(resolveApiUrl("/api/auth/register"), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ name, email: trimmedEmail, password }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok && data?.error) {
          console.warn("[Backend Register Warning]:", data.error);
        }
      }
    } catch (_) {
      // Backend unreachable or static hosting - proceed seamlessly
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedEmail = trimmedEmail.toLowerCase();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

        const newUserDb = {
          id: `user-${Date.now()}`,
          name: name || deriveNameFromEmail(trimmedEmail),
          email: trimmedEmail,
          password,
          bio: 'New explorer on Tiqsey! Adventure is just a booking away.',
          avatarUrl: TRAVEL_AVATARS[Math.floor(Math.random() * TRAVEL_AVATARS.length)]?.url || TRAVEL_AVATARS[0].url,
          createdAt: new Date().toLocaleDateString(),
          role: (isAdmin ? 'admin' : 'user') as 'admin' | 'user',
        };

        const updatedUsersList = [...users, newUserDb];
        safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(updatedUsersList));

        // Create active session
        const { password: _, ...userSession } = newUserDb;
        persistStoredSession(userSession);
        setUser(userSession);
        setIsAuthReady(true);
        setBookings([]); // starts blank

        resolve(userSession);
      }, 300);
    });
  };

  const loginWithGoogle = async (email: string, name: string, avatarUrl: string): Promise<User> => {
    return new Promise((resolve) => {
      // Small network loading simulation
      setTimeout(() => {
        const usersRaw = safeStorageGet(window.localStorage, 'tiqsey_users') || '[]';
        let users: any[] = [];
        try {
          const parsedUsers = JSON.parse(usersRaw);
          users = Array.isArray(parsedUsers) ? parsedUsers : [];
        } catch (_) {
          users = [];
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
        let matched = users.find((u: any) => u.email?.toLowerCase() === normalizedEmail);
        const derivedName = name || deriveNameFromEmail(email);
        
        if (!matched) {
          matched = {
            id: `google-${Date.now()}`,
            name: derivedName,
            email: normalizedEmail,
            password: `google-auth-${Date.now()}`,
            bio: 'Explorer signed in via Google Secure Identity Gateway.',
            avatarUrl,
            createdAt: new Date().toLocaleDateString(),
            role: isAdmin ? 'admin' : 'user',
          };
          users.push(matched);
        } else {
          matched.name = derivedName;
          matched.avatarUrl = avatarUrl;
          if (isAdmin) matched.role = 'admin';
        }
        
        safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(users));

        const { password: _, ...userSession } = matched;
        if (isAdmin) userSession.role = 'admin';
        persistStoredSession(userSession);
        setUser(userSession);
        setIsAuthReady(true);

        const storedBookings = safeStorageGet(window.localStorage, `tiqsey_bookings_${userSession.id}`);
        if (storedBookings) {
          try {
            const parsed = JSON.parse(storedBookings);
            setBookings(Array.isArray(parsed) ? parsed : []);
          } catch {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }

        resolve(userSession);
      }, 500);
    });
  };

  const logout = () => {
    persistStoredSession(null);
    setUser(null);
    setBookings([]);
    fetch(resolveApiUrl('/api/auth/logout'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).catch(() => {});
  };

  const updateProfile = async (name: string, email: string, bio?: string, avatarUrl?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('No authenticated user'));
        return;
      }
      setTimeout(() => {
        const usersRaw = safeStorageGet(window.localStorage, 'tiqsey_users') || '[]';
        let users: any[] = [];
        try {
          const parsedUsers = JSON.parse(usersRaw);
          users = Array.isArray(parsedUsers) ? parsedUsers : [];
        } catch {
          users = [];
        }
        
        let matchedIdx = users.findIndex((u: any) => u.id === user.id);
        if (matchedIdx === -1) {
          // Fallback: search by email
          matchedIdx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
        }
        
        if (matchedIdx !== -1) {
          // Keep the original name and email to avoid profile modifications
          const originalUser = users[matchedIdx];
          const updatedUserDb = {
            ...originalUser,
            // Guaranteed locked properties
            name: originalUser.name || deriveNameFromEmail(originalUser.email),
            email: originalUser.email,
            bio: bio !== undefined ? bio : originalUser.bio,
            avatarUrl: avatarUrl || originalUser.avatarUrl
          };
          
          users[matchedIdx] = updatedUserDb;
          safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(users));
          
          const { password: _, ...userSession } = updatedUserDb;
          persistStoredSession(userSession);
          setUser(userSession);
          resolve(userSession);
        } else {
          // If the user isn't in local mock DB, create it dynamically to avoid throwing an error
          const newUserDb = {
            id: user.id || `user-${Date.now()}`,
            name: user.name || deriveNameFromEmail(user.email),
            email: user.email,
            password: 'password123',
            bio: bio || user.bio || 'New explorer on Tiqsey!',
            avatarUrl: avatarUrl || user.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
            createdAt: user.createdAt || new Date().toLocaleDateString(),
          };
          
          users.push(newUserDb);
          safeStorageSet(window.localStorage, 'tiqsey_users', JSON.stringify(users));
          
          const { password: _, ...userSession } = newUserDb;
          persistStoredSession(userSession);
          setUser(userSession);
          resolve(userSession);
        }
      }, 500);
    });
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
      const response = await fetch(resolveApiUrl('/api/bookings/generate-ids'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
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
    safeStorageSet(window.localStorage, `tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    // Save/Sync the completed booking to the backend database if available
    let backendSyncedToSupabase = false;
    try {
      const saveResponse = await fetch(resolveApiUrl('/api/bookings'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
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
        safeStorageSet(window.localStorage, `tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
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
        const response = await fetch(resolveApiUrl('/api/reviews'), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
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
        safeStorageSet(window.localStorage, `tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
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
        safeStorageSet(window.localStorage, `tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
        setBookings(updatedBookings);

        // Sync cancellation to backend (and fallback to direct Supabase if backend unavailable)
        fetch(resolveApiUrl(`/api/bookings/${encodeURIComponent(bookingId)}`), {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
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
      claimAdminSetup,
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
