const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Bookings.tsx', 'utf8');

const mergeLogic = `
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
`;

code = code.replace(
  "const allBookings: AdminBooking[] = [];",
  mergeLogic + "\n    const allBookings: AdminBooking[] = [];"
);

code = code.replace(
  "const finalBookings = [...defaultBookings];",
  "const finalBookings = [...baseBookings];"
);

const saveLogic = `  const updateBookingStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected') => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        const up = { ...b, status: newStatus };
        // Sync to Customer localStorage
        syncToCustomerStorage(up);
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
    triggerToast(\`Booking status successfully marked as \${newStatus.toUpperCase()}\`, 'success');
  };`;

// Also replace updateBookingDetails to save:
const saveDetailsLogic = `  const updateBookingDetails = (updatedBooking: AdminBooking) => {
    const updated = bookings.map((b) => b.id === updatedBooking.id ? updatedBooking : b);
    setBookings(updated);
    localStorage.setItem('tiqsey_admin_bookings', JSON.stringify(updated));
    syncToCustomerStorage(updatedBooking);
    triggerToast('Booking details updated successfully', 'success');
  };`;

code = code.replace(
  /  const updateBookingStatus = \([\s\S]*?triggerToast\([^;]+;\n  };/,
  saveLogic
);

code = code.replace(
  /  const updateBookingDetails = \([\s\S]*?triggerToast\([^;]+;\n  };/,
  saveDetailsLogic
);

fs.writeFileSync('src/admin/pages/Bookings.tsx', code);
