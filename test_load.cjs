const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Bookings.tsx', 'utf8');
code = code.replace(
  "const finalBookings = [...baseBookings];",
  "console.log('Admin tiqsey_bookings_ items:', allBookings.length);\n    const finalBookings = [...baseBookings];"
);
fs.writeFileSync('src/admin/pages/Bookings.tsx', code);
