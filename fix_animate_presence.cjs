const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

content = content.replace(
  /<\/motion\.div>\n\s*\)\}\n\s*\{\/\* Passengers Table Grid Layout/m,
  '</motion.div>\n            )}\n          </AnimatePresence>\n\n        {/* Passengers Table Grid Layout'
);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
