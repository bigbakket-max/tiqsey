const fs = require('fs');
let content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

const missingBlock = `
      {/* 3. ACTIVE BOOKING CARD */}
      <div className="bg-white dark:bg-slate-900 border border-brand rounded-lg p-5 shadow-sm space-y-5">
          
          {/* Header warning & Status badges */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="p-1.5 bg-brand/10 text-brand rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div className="space-y-1">
                <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {booking.attractionName || 'Acropolis of Athens Entry Tickets | Skip-The-Line Admission Tickets'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  Variant: {booking.variant || 'Acropolis of Athens General Admission Tickets'}
                </p>
              </div>
            </div>

            {/* Badges line & Actions buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                {booking.status === 'pending' ? (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-orange-500/10 text-orange-600 border border-orange-200/50 uppercase tracking-wider">
                    CONFIRMATION PENDING
                  </span>
                ) : (
                  getStatusBadge(booking.status)
                )}
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700/80">
                  Direct Booking
                </span>
              </div>
              
              <div className="flex gap-2">
                <button className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors shadow-sm">
                  Cancel Booking
                </button>
                <button 
                  onClick={() => {
                    onUpdateStatus(booking.id, 'confirmed');
                    triggerToast("Booking marked as CONFIRMED successfully!", "success");
                  }}
                  className="bg-brand hover:opacity-90 text-white px-4 py-1.5 rounded-md text-[11px] font-black transition-colors cursor-pointer shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>

          {/* Travel Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-4 font-semibold text-slate-700 dark:text-slate-300">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">PNR</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 select-all">{booking.bookingRef || 'BKWDWDOLOCH7'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Travelers</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.travelers || 2}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Date of Travel</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.bookingDate || '30 Jun 2026'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Booking End Date</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.bookingDate || '30 Jun 2026'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Time Slot</p>
              <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-extrabold">
                {isEditingTimeSlot ? (
                  <input 
                    type="text" 
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    onBlur={() => setIsEditingTimeSlot(false)}
                    onKeyDown={e => e.key === 'Enter' && setIsEditingTimeSlot(false)}
                    className="w-16 border rounded bg-white dark:bg-slate-800 text-xs px-1 font-bold"
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{timeSlot}</span>
                    <button onClick={() => setIsEditingTimeSlot(true)} className="text-blue-500 hover:underline text-[10px] font-bold">
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Net Amount</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">EUR {booking.totalPrice || 66}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-0.5">Gross Amount</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">EUR {booking.totalPrice || 66}</p>
            </div>
          </div>

          {/* Customer Information Section */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Customer Information</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                  <User className="w-3.5 h-3.5" />
                </span>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Travelers</p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.travelers || 2}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                  <User className="w-3.5 h-3.5" />
                </span>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Name</p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.customerName || 'Jacob davis'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800 min-w-0">
                <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase">Email</p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">{booking.customerEmail || 'alyshaawaluddin@gmail.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Phone</p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{booking.customerPhone || '+6281381847386'}</p>
                </div>
              </div>
            </div>

            {/* Booking level geo */}
            <div className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 flex gap-4 pt-1 pl-1">
              <span>BOOKING LEVEL INFORMATION:</span>
              <span>State: <strong className="text-slate-600 dark:text-slate-400">NA</strong></span>
              <span>Country: <strong className="text-slate-600 dark:text-slate-400">Australia</strong></span>
            </div>
          </div>

        </div>

        {/* 5. PASSENGER DETAILS TABLE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Passenger Details</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Total: {passengersList.length} Passengers</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setIsAddingPassenger(true)}
                className="flex items-center gap-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Passenger
              </button>
            </div>
          </div>

          {/* Add passenger inline modal */}
          <AnimatePresence>
            {isAddingPassenger && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md border border-slate-200 dark:border-slate-700 mb-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold">Add New Passenger</h4>
                  <button onClick={() => setIsAddingPassenger(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={newPassengerName}
                      onChange={e => setNewPassengerName(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={newPassengerEmail}
                      onChange={e => setNewPassengerEmail(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Type</label>
                    <select 
                      value={newPassengerType}
                      onChange={e => setNewPassengerType(e.target.value as 'Adult' | 'Child')}
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="Adult">Adult</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAddingPassenger(false)} className="px-3 py-1 text-xs text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setPassengersList([...passengersList, {
                        id: Math.random().toString(),
                        name: newPassengerName,
                        email: newPassengerEmail,
                        type: newPassengerType,
                        status: 'Saved'
                      }]);`;

content = content.replace(
  /\s*\)\};\s*setNewPassengerName\(''\);/g,
  ')}' + missingBlock + '\n                    setNewPassengerName(\'\');'
);

fs.writeFileSync('src/admin/components/BookingDetailsView.tsx', content);
console.log("Success");
