const fs = require('fs');
const content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

const orderSummaryRegex = /\{\/\* 1\. ORDER SUMMARY CARD \*\/\}([\s\S]*?)<\/div>\s*\{\/\* 2\. PAYMENT INFORMATION CARD \*\/\}/m;
const orderSummaryMatch = content.match(orderSummaryRegex);

const paymentsListRegex = /\{\/\* Payments list detail card \(Left column\) \*\/\}([\s\S]*?)<\/div>\s*\{\/\* Acropolis Booking Block with action buttons \(Right column\) \*\/\}/m;
const paymentsListMatch = content.match(paymentsListRegex);

const layoutRegex = /\{\/\* 3\. & 4\. TWO-COLUMN LAYOUT: PAYMENTS LIST \(LEFT\/ABOVE\) AND ACTIVE BOOKING CARD \(RIGHT\/BELOW\) \*\/\}\s*<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">\s*\{\/\* Payments list detail card \(Left column\) \*\/\}([\s\S]*?)<\/div>\s*\{\/\* Acropolis Booking Block with action buttons \(Right column\) \*\/\}([\s\S]*?)<\/div>\s*<\/div>/m;
const layoutMatch = content.match(layoutRegex);

if (orderSummaryMatch && paymentsListMatch && layoutMatch) {
  let newContent = content;
  
  // Create the new layout for 1. and Payments List
  const newTopSection = `{/* 1. ORDER SUMMARY CARD & PAYMENTS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-5">
          ${orderSummaryMatch[1].replace(/<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800\/80 rounded-lg p-5 shadow-sm space-y-5">/, '').trim()}

        {/* Payments list detail card (Right column) */}
        ${paymentsListMatch[0]}
      </div>

      {/* 2. PAYMENT INFORMATION CARD */}`;
      
  newContent = newContent.replace(orderSummaryMatch[0], newTopSection);
  
  // Replace the old layout with just the Active Booking Card
  const newActiveBookingCard = `{/* 3. ACTIVE BOOKING CARD */}
      ${layoutMatch[2].replace(/lg:col-span-8 /, '')}</div>`;
      
  newContent = newContent.replace(layoutMatch[0], newActiveBookingCard);
  
  fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', newContent);
  console.log("Success");
} else {
  console.log("Failed to match regexes.");
  if (!orderSummaryMatch) console.log("orderSummaryMatch failed");
  if (!paymentsListMatch) console.log("paymentsListMatch failed");
  if (!layoutMatch) console.log("layoutMatch failed");
}
