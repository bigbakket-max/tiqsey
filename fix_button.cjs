const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

content = content.replace(
  /className="self-start sm:self-auto border border-brand hover:bg-brand\/5 dark:hover:bg-brand\/10 text-brand px-4 py-1\.5 rounded-full text-xs font-bold transition-colors cursor-pointer"/,
  'className="self-start sm:self-auto border border-brand hover:bg-brand/5 dark:hover:bg-brand/10 text-brand px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer"'
);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
