const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

content = content.replace(
  /\n          <\/div>\)\}\n      \{\/\* 3\. ACTIVE BOOKING CARD \*\/\}/,
  '\n          </div>\n        )}\n      </div>\n\n      {/* 3. ACTIVE BOOKING CARD */}'
);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
