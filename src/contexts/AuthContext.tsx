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
    passengers?: any[]
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
          password: 'password123',
          bio: 'Super Administrator.',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toLocaleDateString(),
          role: 'admin',
        }
      ];
      localStorage.setItem('tiqsey_users', JSON.stringify(initialUsers));
    } else {
      try {
        const users = JSON.parse(registeredUsers);
        const hasAdmin = users.some((u: any) => u.email.toLowerCase() === 'admin@tiqsey.com');
        if (!hasAdmin) {
          users.push({
            id: 'admin-user-456',
            name: 'System Admin',
            email: 'admin@tiqsey.com',
            password: 'password123',
            bio: 'Super Administrator.',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            createdAt: new Date().toLocaleDateString(),
            role: 'admin',
          });
          localStorage.setItem('tiqsey_users', JSON.stringify(users));
        } else {
          let modified = false;
          users.forEach((u: any) => {
            if (u.email.toLowerCase() === 'admin@tiqsey.com' && u.role !== 'admin') {
              u.role = 'admin';
              modified = true;
            }
          });
          if (modified) {
            localStorage.setItem('tiqsey_users', JSON.stringify(users));
          }
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
        if (loggedUser && loggedUser.email.toLowerCase() === 'admin@tiqsey.com' && loggedUser.role !== 'admin') {
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
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Simulate getting full user from mock DB for now, since our backend just returns success
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
          const users = JSON.parse(usersRaw);
          
          let matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
          
          if (email.toLowerCase() === 'admin@tiqsey.com') {
            if (!matched) {
              matched = {
                id: 'admin-user-456',
                name: 'System Admin',
                email: 'admin@tiqsey.com',
                password: 'password123',
                bio: 'Super Administrator.',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
                createdAt: new Date().toLocaleDateString(),
                role: 'admin',
              };
              users.push(matched);
              localStorage.setItem('tiqsey_users', JSON.stringify(users));
            } else if (matched.role !== 'admin') {
              matched.role = 'admin';
              localStorage.setItem('tiqsey_users', JSON.stringify(users));
            }
          }
          
          if (matched) {
            // Clean password before setting state
            const { password: _, ...userSession } = matched;
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
            // If the user isn't in local mock DB, create a quick session so the backend success works
            const tempUser = {
              id: `user-${Date.now()}`,
              name: deriveNameFromEmail(email),
              email,
              bio: 'New explorer on Tiqsey!',
              avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=200`,
              createdAt: new Date().toLocaleDateString(),
            };
            localStorage.setItem('tiqsey_current_session', JSON.stringify(tempUser));
            setUser(tempUser);
            setBookings([]);
            resolve(tempUser);
          }
        }, 300);
      });
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
          const users = JSON.parse(usersRaw);
          
          const emailExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (emailExists) {
            reject(new Error('An account with this email is already registered. Please sign in instead.'));
            return;
          }

          const newUserDb = {
            id: `user-${Date.now()}`,
            name: name || deriveNameFromEmail(email),
            email,
            password,
            bio: 'New explorer on Tiqsey! Adventure is just a booking away.',
            avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=200`,
            createdAt: new Date().toLocaleDateString(),
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
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  };

  const loginWithGoogle = async (email: string, name: string, avatarUrl: string): Promise<User> => {
    return new Promise((resolve) => {
      // Small network loading simulation
      setTimeout(() => {
        const usersRaw = localStorage.getItem('tiqsey_users') || '[]';
        const users = JSON.parse(usersRaw);
        
        let matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        const derivedName = deriveNameFromEmail(email);
        
        if (!matched) {
          matched = {
            id: `google-${Date.now()}`,
            name: derivedName,
            email,
            password: `google-auth-${Date.now()}`,
            bio: 'Explorer signed in via Google Secure Identity Gateway.',
            avatarUrl,
            createdAt: new Date().toLocaleDateString(),
          };
          users.push(matched);
        } else {
          // Keep name derived from email and prevent changing
          matched.name = derivedName;
          matched.avatarUrl = avatarUrl;
        }
        
        localStorage.setItem('tiqsey_users', JSON.stringify(users));

        const { password: _, ...userSession } = matched;
        localStorage.setItem('tiqsey_current_session', JSON.stringify(userSession));
        setUser(userSession);

        const storedBookings = localStorage.getItem(`tiqsey_bookings_${userSession.id}`);
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        } else {
          setBookings([]);
        }

        resolve(userSession);
      }, 700);
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
    passengers?: any[]
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

    // Generate real secure unique IDs from the backend
    let order_number = '';
    let pnr_number = '';
    try {
      const response = await fetch('/api/bookings/generate-ids', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        order_number = data.orderNumber;
        pnr_number = data.pnrNumber;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Backend API ID Generation Failed. Ensure backend is running.", err);
      throw new Error("Unable to generate unique booking IDs via the secure backend. Transaction aborted.");
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
      totalPrice: (count * pricePerTicket) + ((childCount || 0) * (childPrice || 0)),
      bookingRef: pnr_number, // PNR is the bookingRef
      order_number, // OD...
      pnr_number,   // BK...
      status: 'confirmed',
      childCount: childCount || 0,
      guestInfo,
      passengers,
      createdAt: createdAtStr
    };
    
    const updatedBookings = [newBooking, ...bookings];
    localStorage.setItem(`tiqsey_bookings_${activeUser.id}`, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    // Save/Sync the completed booking to the backend database
    try {
      const saveResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      const saveData = await saveResponse.json();
      if (saveData.success) {
        console.log(`[Database Sync] Successfully saved booking ${newBooking.id} to SQLite backend.`);
      } else {
        console.error(`[Database Sync Error] Failed to save booking ${newBooking.id}:`, saveData.error);
      }
    } catch (err) {
      console.error(`[Database Sync Network Error] Failed to contact backend for booking ${newBooking.id}:`, err);
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

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
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
