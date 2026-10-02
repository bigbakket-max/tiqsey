import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking } from '../types';

interface AuthContextType {
  user: User | null;
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
const DEMO_EMAIL = 'demo@tiqsey.com';
const DEMO_PASSWORD = 'password123';
export const ADMIN_PASSWORD = 'bigbakket@admin@1997';
export const ADMIN_EMAILS = ['admin@tiqsey.com', 'bigbakket@gmail.com'];

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Load user and bookings on mount
  useEffect(() => {
    // Prime the mock users database with demo account
    const registeredUsers = localStorage.getItem('tiqsey_users');
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
        {
          id: 'admin-user-456',
          name: 'System Admin',
          email: 'admin@tiqsey.com',
          password: ADMIN_PASSWORD,
          bio: 'Super Administrator.',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toLocaleDateString(),
          role: 'admin',
        },
        {
          id: 'admin-user-bigbakket',
          name: 'Lead Admin',
          email: 'bigbakket@gmail.com',
          password: ADMIN_PASSWORD,
          bio: 'Lead Administrator.',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toLocaleDateString(),
          role: 'admin',
        }
      ];
      localStorage.setItem('tiqsey_users', JSON.stringify(initialUsers));
    } else {
      try {
        const users = JSON.parse(registeredUsers);
        let modified = false;

        ADMIN_EMAILS.forEach((admEmail) => {
          const found = users.find((u: any) => u.email.toLowerCase() === admEmail.toLowerCase());
          if (!found) {
            users.push({
              id: admEmail === 'bigbakket@gmail.com' ? 'admin-user-bigbakket' : 'admin-user-456',
              name: admEmail === 'bigbakket@gmail.com' ? 'Lead Admin' : 'System Admin',
              email: admEmail,
              password: ADMIN_PASSWORD,
              bio: 'Administrator.',
              avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
              createdAt: new Date().toLocaleDateString(),
              role: 'admin',
            });
            modified = true;
          } else {
            if (found.role !== 'admin') {
              found.role = 'admin';
              modified = true;
            }
            if (found.password !== ADMIN_PASSWORD) {
              found.password = ADMIN_PASSWORD;
              modified = true;
            }
          }
        });

        if (modified) {
          localStorage.setItem('tiqsey_users', JSON.stringify(users));
        }
      } catch (e) {
        console.error('Failed to parse registered users', e);
      }
    }

    // Check if there is an active session
    const currentSession = localStorage.getItem('tiqsey_current_session');
    if (currentSession) {
      try {
        const loggedUser = JSON.parse(currentSession);
        if (loggedUser && ADMIN_EMAILS.includes(loggedUser.email?.toLowerCase()) && loggedUser.role !== 'admin') {
          loggedUser.role = 'admin';
          localStorage.setItem('tiqsey_current_session', JSON.stringify(loggedUser));
        }
        setUser(loggedUser);
        
        // Load bookings for this user
        const storedBookings = localStorage.getItem(`tiqsey_bookings_${loggedUser.id}`);
        let parsedBookings = storedBookings ? JSON.parse(storedBookings) : null;
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
          localStorage.setItem(`tiqsey_bookings_${loggedUser.id}`, JSON.stringify(parsedBookings));
        }
        if (parsedBookings) {
          setBookings(parsedBookings);
        } else {
          // Pre-populate some historical bookings for the demo user to make the "My Tickets" section feel rich and real
          if (loggedUser.email === DEMO_EMAIL) {
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
            localStorage.setItem(`tiqsey_bookings_${loggedUser.id}`, JSON.stringify(prePopulated));
            setBookings(prePopulated);
          }
        }
      } catch (e) {
        console.error('Session restoration failed', e);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error('Please fill in both email and password.');
    }

    // Attempt backend sync safely without breaking if backend returns HTML (e.g., on static host)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok && data?.error) {
          console.warn("[Backend Login Warning]:", data.error);
        }
      }
    } catch (_) {
      // Backend unreachable or static hosting - fall back seamlessly to client session
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
        let users: any[] = [];
        try {
          users = JSON.parse(usersRaw);
        } catch (_) {
          users = [];
        }
        
        const normalizedEmail = trimmedEmail.toLowerCase();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
        let matched = users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
        
        if (isAdmin) {
          if (!matched) {
            matched = {
              id: normalizedEmail === 'bigbakket@gmail.com' ? 'admin-user-bigbakket' : 'admin-user-456',
              name: normalizedEmail === 'bigbakket@gmail.com' ? 'Lead Admin' : 'System Admin',
              email: normalizedEmail,
              password: ADMIN_PASSWORD,
              bio: 'Super Administrator.',
              avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
              createdAt: new Date().toLocaleDateString(),
              role: 'admin',
            };
            users.push(matched);
            localStorage.setItem('tiqsey_users', JSON.stringify(users));
          } else {
            let userModified = false;
            if (matched.role !== 'admin') {
              matched.role = 'admin';
              userModified = true;
            }
            if (matched.password !== ADMIN_PASSWORD) {
              matched.password = ADMIN_PASSWORD;
              userModified = true;
            }
            if (userModified) {
              localStorage.setItem('tiqsey_users', JSON.stringify(users));
            }
          }
        }
        
        if (matched) {
          // Verify password
          if (isAdmin) {
            if (password !== ADMIN_PASSWORD) {
              reject(new Error('Incorrect administrator password. Please check your credentials.'));
              return;
            }
          } else if (matched.password && matched.password !== password) {
            reject(new Error('Incorrect password. Please verify your credentials or use the demo password.'));
            return;
          }

          // Clean password before setting state
          const { password: _, ...userSession } = matched;
          if (isAdmin) {
            userSession.role = 'admin';
          }
          localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
          setUser(userSession);
          
          // Load bookings
          const storedBookings = localStorage.getItem(`tiqsey_bookings_${userSession.id}`);
          if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
          } else {
            setBookings([]);
          }
          
          resolve(userSession);
        } else {
          // Create user account seamlessly for new email
          const tempUser: any = {
            id: `user-${Date.now()}`,
            name: deriveNameFromEmail(trimmedEmail),
            email: trimmedEmail,
            password: password,
            bio: 'New explorer on Tiqsey!',
            avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
            createdAt: new Date().toLocaleDateString(),
            role: isAdmin ? 'admin' : 'user',
          };
          users.push(tempUser);
          localStorage.setItem('tiqsey_users', JSON.stringify(users));

          const { password: _, ...userSession } = tempUser;
          localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
          setUser(userSession);
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
    const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=200`,
          createdAt: new Date().toLocaleDateString(),
          role: (isAdmin ? 'admin' : 'user') as 'admin' | 'user',
        };

        const updatedUsersList = [...users, newUserDb];
        localStorage.setItem('tiqsey_users', JSON.stringify(updatedUsersList));

        // Create active session
        const { password: _, ...userSession } = newUserDb;
        localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
        setUser(userSession);
        setBookings([]); // starts blank

        resolve(userSession);
      }, 300);
    });
  };

  const loginWithGoogle = async (email: string, name: string, avatarUrl: string): Promise<User> => {
    return new Promise((resolve) => {
      // Small network loading simulation
      setTimeout(() => {
        const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
        let users: any[] = [];
        try {
          users = JSON.parse(usersRaw);
        } catch (_) {
          users = [];
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
        let matched = users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
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
        
        localStorage.setItem('tiqsey_users', JSON.stringify(users));

        const { password: _, ...userSession } = matched;
        if (isAdmin) userSession.role = 'admin';
        localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
        setUser(userSession);

        const storedBookings = localStorage.getItem(`tiqsey_bookings_${userSession.id}`);
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        } else {
          setBookings([]);
        }

        resolve(userSession);
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('tiqsey_current_session');
    setUser(null);
    setBookings([]);
  };

  const updateProfile = async (name: string, email: string, bio?: string, avatarUrl?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('No authenticated user'));
        return;
      }
      setTimeout(() => {
        const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
        const users = JSON.parse(usersRaw);
        
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
            bio: bio || originalUser.bio,
            avatarUrl: avatarUrl || originalUser.avatarUrl
          };
          
          users[matchedIdx] = updatedUserDb;
          localStorage.setItem('tiqsey_users', JSON.stringify(users));
          
          const { password: _, ...userSession } = updatedUserDb;
          localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
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
          localStorage.setItem('tiqsey_users', JSON.stringify(users));
          
          const { password: _, ...userSession } = newUserDb;
          localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
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
      const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
      const users = JSON.parse(usersRaw);
      users.push(newGuest);
      localStorage.setItem('tiqsey_users', JSON.stringify(users));
      // Authenticate guest user session
      localStorage.setItem('tiqsey_current_session', JSON.stringify(newGuest));
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
          console.log(`[Database Sync] Successfully saved booking ${newBooking.id} to SQLite backend.`);
        }
      }
    } catch (_) {
      // Backend not running on static host
    }

    // Direct Supabase sync from client (ensures customer details are stored in Supabase on static hosts like Hostinger!)
    try {
      import('../lib/supabase').then(({ supabase }) => {
        supabase.from('bookings').upsert({
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
        }, { onConflict: 'id' }).then(({ error }) => {
          if (error) console.warn('[Supabase Client Sync Warning]:', error.message);
          else console.log('[Supabase Client Sync]: Booking saved to Supabase successfully.');
        });
      }).catch(() => {});
    } catch (sbErr) {
      console.warn('[Supabase Direct Sync Error]:', sbErr);
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

    try {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `rev-${Date.now()}`,
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
          await response.json();
        }
      } catch (_) {
        // Backend not running on static host
      }

      // Direct Supabase sync for reviews
      try {
        import('../lib/supabase').then(({ supabase }) => {
          supabase.from('reviews').upsert({
            id: `rev-${Date.now()}`,
            booking_id: bookingId,
            attraction_id: attractionId,
            user_id: activeUser.id,
            user_name: activeUser.name,
            user_email: activeUser.email,
            rating: Number(rating),
            comment,
            created_at: new Date().toISOString()
          }, { onConflict: 'id' }).then(({ error }) => {
            if (error) console.warn('[Supabase Review Sync Warning]:', error.message);
          });
        }).catch(() => {});
      } catch (_) {}

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
        resolve();
      }, 300);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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
