const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Bookings.tsx', 'utf8');

code = code.replace(
  'const loadBookings = () => {\n    setIsRefreshing(true);',
  'const loadBookings = async () => {\n    setIsRefreshing(true);\n    await new Promise(r => setTimeout(r, 600));'
);

code = code.replace(
  'setBookings(finalBookings);\n    \n    setTimeout(() => {\n      setIsRefreshing(false);\n    }, 400);',
  'setBookings(finalBookings);\n    setIsRefreshing(false);'
);

fs.writeFileSync('src/admin/pages/Bookings.tsx', code);
