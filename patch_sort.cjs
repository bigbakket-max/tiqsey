const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Bookings.tsx', 'utf8');
code = code.replace(
  '// Sort by Created At reverse (or ID reverse) to make newest first\n    setBookings(finalBookings);',
  `// Sort by Created At reverse (or ID reverse) to make newest first
    finalBookings.sort((a, b) => {
      const tsA = a.id.startsWith('book-') ? parseInt(a.id.replace('book-', '')) : 0;
      const tsB = b.id.startsWith('book-') ? parseInt(b.id.replace('book-', '')) : 0;
      if (!isNaN(tsA) && !isNaN(tsB) && tsA !== 0 && tsB !== 0) {
        return tsB - tsA;
      }
      return b.id.localeCompare(a.id);
    });
    setBookings(finalBookings);`
);
fs.writeFileSync('src/admin/pages/Bookings.tsx', code);
