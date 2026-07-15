const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

content = content.replace(
  /        \)\}\n      \{\/\* 3\. ACTIVE BOOKING CARD \*\/\}/m,
  '        )}\n      </div>\n\n      {/* 3. ACTIVE BOOKING CARD */}'
);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
