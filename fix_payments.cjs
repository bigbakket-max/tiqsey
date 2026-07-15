const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

const paymentsReplacement = `{/* Payments Section */}
        {showPayments && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <h3 className="text-[15px] font-medium text-slate-700 dark:text-slate-300 mb-4">
              Payments
            </h3>

            <div className="w-full max-w-[320px] border border-slate-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-900 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-[#94a3b8]">Payment 1</span>
                <div className="flex items-center gap-1 text-[#94a3b8]">
                  <span className="text-[11px]">Date: 12 Jul 2026</span>
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[17px] font-medium text-brand mb-2">EUR {booking.totalPrice || 40}</p>
                <span className="px-2.5 py-0.5 text-[10px] font-medium text-emerald-500 border border-emerald-500 rounded-full">
                  Successful
                </span>
              </div>

              {/* Stamp */}
              <div className="absolute right-4 top-12 -rotate-[20deg] z-10 pointer-events-none opacity-80">
                <div className="border-[2px] border-emerald-500 rounded-full px-3 py-2 text-emerald-500 text-[14px] font-black tracking-widest flex items-center justify-center transform scale-[0.85] origin-center">
                  PAID
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Payment Ref: </span>
                  <span className="text-slate-500 dark:text-slate-400">dUqvQdv95nm55sm</span>
                </div>
                
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Mode: </span>
                  <span className="text-slate-500 dark:text-slate-400">/TazapayV2</span>
                </div>

                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Transaction ID:</span>
                  <span className="text-slate-500 dark:text-slate-400 break-all">chk_d99p9h7hhjpr05ekuh80</span>
                </div>

                <div className="pt-2 text-center">
                  <button className="text-brand text-[11px] font-medium hover:underline">
                    Show Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}`;

content = content.replace(/\{\/\* Payments Section \*\/\}[\s\S]*?\}\)/m, paymentsReplacement);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
