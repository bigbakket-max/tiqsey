const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

const orderSummaryReplacement = `        {/* Order Summary Metrics */}
        <div className="flex flex-wrap gap-x-10 gap-y-6 pt-2">
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Receipt className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Order ID</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 select-all">{booking.orderId || 'OD822954911803214'}</span>
          </div>
          
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Booked By</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{booking.customerName || 'Arsalan F'}</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Created At</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{booking.createdAt || '12 Jul 2026'}</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Bookings</span>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">1</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Net Amount</span>
            </div>
            <span className="text-[13px] font-medium text-brand">EUR {booking.totalPrice || 40}</span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">Gross Amount</span>
            </div>
            <span className="text-[13px] font-medium text-brand">EUR {booking.totalPrice || 40}</span>
          </div>
        </div>`;

content = content.replace(/\{\/\* Order Summary Metrics \*\/\}[\s\S]*?\{\/\* Payments Section \*\/\}/m, orderSummaryReplacement + '\n\n        {/* Payments Section */}');

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
