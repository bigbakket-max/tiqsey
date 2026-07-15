const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const replacement = `  const addBooking = async (
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
      const guestId = \`guest-\${Date.now()}\`;
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

    const newBooking: Booking = {
      id: \`book-\${Date.now()}\`,
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
      passengers
    };
    
    const updatedBookings = [newBooking, ...bookings];
    localStorage.setItem(\`tiqsey_bookings_\${activeUser.id}\`, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    return newBooking;
  };

`;

code = code.replace("    });\n  };\n\n  const rateBooking =", "  };\n\n" + replacement + "  const rateBooking =");
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
