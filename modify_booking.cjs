const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

// Add state
content = content.replace(
  /const \[isAddingPassenger, setIsAddingPassenger\] = useState\(false\);/,
  `const [isAddingPassenger, setIsAddingPassenger] = useState(false);\n  const [showPayments, setShowPayments] = useState(false);`
);

// We need to replace the entire ORDER SUMMARY CARD & PAYMENTS LIST block
const topSectionRegex = /\{\/\* 1\. ORDER SUMMARY CARD & PAYMENTS LIST \*\/\}([\s\S]*?)\{\/\* 2\. PAYMENT INFORMATION CARD \*\/\}/m;

const newSection = `{/* 1. ORDER SUMMARY CARD & PAYMENTS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-6">
        {/* Order Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-[15px] font-bold tracking-tight text-slate-800 dark:text-slate-200">Order Summary</h3>
          <button 
            onClick={() => setShowPayments(!showPayments)}
            className="self-start sm:self-auto border border-brand hover:bg-brand/5 dark:hover:bg-brand/10 text-brand px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            {showPayments ? 'Hide Payments' : 'View Payments'}
          </button>
        </div>

        {/* Order Summary Metrics */}
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Order ID</span>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{booking.orderId || 'OD630439962205967'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Booked By</span>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{booking.customerName || 'Jacob davis'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Created At</span>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{booking.createdAt || '29 Jun 2026'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Bookings</span>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">1</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Net Amount</span>
              <span className="text-[13px] font-bold text-brand">EUR {booking.totalPrice || 66}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f8fafc] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#94a3b8] shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-[#94a3b8] mb-0.5">Gross Amount</span>
              <span className="text-[13px] font-bold text-brand">EUR {booking.totalPrice || 66}</span>
            </div>
          </div>
        </div>

        {/* Payments Section */}
        {showPayments && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span>Payments</span>
            </h3>

            <div className="w-full max-w-sm">
              <div className="relative border-l-2 border-brand pl-4 py-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#94a3b8]">Payment 1</span>
                  <span className="text-[11px] font-medium text-[#94a3b8]">Date: 30 Jun 2026</span>
                  <button className="text-[#94a3b8] hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-xl font-bold text-brand">EUR {booking.totalPrice || 66}</p>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 rounded uppercase tracking-wide">
                    SUCCESSFUL
                  </span>
                </div>

                {/* Stamp */}
                <div className="absolute right-8 top-8 -rotate-[20deg]">
                  <div className="border-[3px] border-emerald-500/80 rounded-full px-3 py-1.5 text-emerald-500/80 text-[13px] font-black tracking-widest bg-white dark:bg-slate-900">
                    PAID
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">Payment Ref:</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-mono break-all bg-[#f8fafc] dark:bg-slate-950 p-1.5 rounded flex justify-between items-center">
                      dUqvQdv95nm55sm
                      <button onClick={() => copyToClipboard('dUqvQdv95nm55sm', 'Payment Ref')} className="text-slate-400 hover:text-slate-600">
                        <Copy className="w-3 h-3" />
                      </button>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">Mode: <span className="font-normal text-slate-500">/TazapayV2</span></p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">Transaction ID:</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-mono break-all">chk_d99p9h7hhjpr05ekuh80</p>
                  </div>

                  <div>
                    <button className="text-brand text-[12px] font-bold hover:underline">
                      Show Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PAYMENT INFORMATION CARD */}`;

content = content.replace(topSectionRegex, newSection);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
