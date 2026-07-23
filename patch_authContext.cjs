const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const storageSyncCode = `
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('tiqsey_bookings_') && user) {
        if (e.key === \`tiqsey_bookings_\${user.id}\` && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setBookings(parsed);
          } catch (err) {
            console.error('Failed to parse updated bookings from storage', err);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Provide state
`;

code = code.replace(/  \/\/ Provide state/, storageSyncCode);
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log('patched AuthContext.tsx');
