import React, { useState, useEffect, useMemo } from 'react';
import { X, Copy, Users, Calendar, Check, ChevronDown } from 'lucide-react';

interface Passenger {
  name: string;
  type: 'Adult' | 'Child' | 'Youth' | 'Senior';
}

interface AdminBooking {
  id: string;
  bookingRef: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  attractionId: string;
  attractionName: string;
  variant: string;
  vendorPayable: string;
  totalPrice: number;
  collectedAmount: number;
  travelers: number;
  bookingDate: string;
  timeslot?: string;
  children?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  passengers: Passenger[];
}

interface AllocateVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AdminBooking;
}

export function AllocateVendorModal({ isOpen, onClose, booking }: AllocateVendorModalProps) {
  if (!isOpen) return null;

  // Form states initialized with realistic values matching screenshots
  // Let's check the status to match save button color and layout dynamically
  const isPending = booking.status === 'pending';

  // State values initialized to placeholders/defaults as seen in the top/left screenshot
  const [serviceType, setServiceType] = useState('');
  const [vendor, setVendor] = useState('');
  const [paymentPolicy, setPaymentPolicy] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [currency, setCurrency] = useState(isPending ? 'USD' : 'INR');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [description, setDescription] = useState('');
  const [bestService, setBestService] = useState('');
  const [payableAmount, setPayableAmount] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync state if booking prop changes
  useEffect(() => {
    if (booking) {
      // In the pending screenshot (bottom/right):
      if (booking.status === 'pending') {
        setServiceType('Activity Service');
        setVendor('Tiqets');
        setPaymentPolicy('100 % Date of Booking');
        setCancellationPolicy('No cancellation');
        setCurrency('USD');
        setSelectedEvent('Enter event name manually');
        setBestService('Best Service Offered');
      } else {
        // In the confirmed screenshot (top/left), everything starts empty/placeholder
        setServiceType('');
        setVendor('');
        setPaymentPolicy('');
        setCancellationPolicy('');
        setCurrency('');
        setSelectedEvent('');
        setBestService('');
      }
    }
  }, [booking]);

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onClose();
  };

  const handleClearVendor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVendor('');
  };

  // Determine button colors based on booking status to match both screenshots
  const saveButtonBg = isPending ? 'bg-[#e3000f] hover:bg-red-700' : 'bg-[#f35a06] hover:bg-orange-700';
  
  const { text: badgeText, classes: badgeStyle } = useMemo(() => {
    switch (booking.status) {
      case 'confirmed':
        return {
          text: 'Confirmed',
          classes: 'bg-[#e6f4ea] text-[#137333] border-[#a3cfbb]'
        };
      case 'completed':
        return {
          text: 'Completed',
          classes: 'bg-[#e8f0fe] text-[#1a73e8] border-[#aecbfa]'
        };
      case 'cancelled':
        return {
          text: 'Cancelled',
          classes: 'bg-[#fce8e6] text-[#c5221f] border-[#f9ab9a]'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          classes: 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0]'
        };
      case 'pending':
      default:
        return {
          text: 'PENDING',
          classes: 'bg-[#fef7e0] text-[#b06000] border-[#fce8b2] uppercase'
        };
    }
  }, [booking.status]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-[640px] max-h-[calc(100vh-32px)] md:max-h-[85vh] flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Allocate Service</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Booking Info Header Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[22px] font-medium tracking-tight text-slate-900 dark:text-slate-100">{booking.bookingRef}</span>
                <button 
                  onClick={handleCopy} 
                  title="Copy booking reference"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeStyle} tracking-wide`}>
                {badgeText}
              </span>
            </div>
            
            {/* Travelers & Booking Date */}
            <div className="flex items-center gap-3 text-[14px] font-medium">
              <div className="flex items-center gap-1.5 text-[#3b82f6]">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{booking.travelers || 4} Adults {booking.children ? `${booking.children} Child` : '1 Child'}</span>
              </div>
              <span className="text-slate-200 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {(() => {
                    if (!booking.bookingDate) return '2026-07-12';
                    try {
                      if (booking.bookingDate.includes('-')) {
                        const [year, month, day] = booking.bookingDate.split('T')[0].split('-');
                        if (year && month && day) {
                          const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          return `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${dateObj.getDate()} ${dateObj.getFullYear()}`;
                        }
                      }
                    } catch (e) {}
                    return booking.bookingDate;
                  })()}
                  {booking.timeslot ? ` at ${booking.timeslot}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details section */}
          <div className="pt-4 mt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 mb-2">CUSTOMER DETAILS</h3>
            <div className="flex items-center text-[14px] text-slate-600 dark:text-slate-400 font-medium">
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{booking.customerName || 'Bob Johnson'}</span>
              <span className="mx-3 text-slate-200 dark:text-slate-700">|</span>
              <span>{booking.customerPhone || '+1(555) 349-2041'}</span>
              <span className="mx-3 text-slate-200 dark:text-slate-700">|</span>
              <span>{booking.customerEmail || 'bob.johnson@example.com'}</span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            
            {/* Service Type */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Service Type <span className="text-[#e3000f]">*</span>
              </label>
              <div className="relative">
                <select 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className={`w-full appearance-none border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs bg-slate-50/50 dark:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                    serviceType === '' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <option value="" disabled hidden>Select Service Type</option>
                  <option value="" className="text-slate-400">Select Service Type</option>
                  <option value="Activity Service">Activity Service</option>
                  <option value="Transport Service">Transport Service</option>
                  <option value="Hotel Service">Hotel Service</option>
                  <option value="Guide Service">Guide Service</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Vendor */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Vendor <span className="text-[#e3000f]">*</span>
              </label>
              <div className="relative">
                <select 
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className={`w-full appearance-none border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs bg-slate-50/50 dark:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-12 ${
                    vendor === '' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <option value="" disabled hidden>Select Vendor</option>
                  <option value="" className="text-slate-400">Select Vendor</option>
                  <option value="Tiqets">Tiqets</option>
                  <option value="GetYourGuide">GetYourGuide</option>
                  <option value="Klook">Klook</option>
                  <option value="Viator">Viator</option>
                  <option value="Musement">Musement</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1">
                  {vendor && (
                    <button 
                      onClick={handleClearVendor} 
                      className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-600 transition-colors pointer-events-auto"
                      title="Clear selection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Vendor Payment Policy */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Vendor Payment Policy <span className="text-[#e3000f]">*</span>
              </label>
              <div className="relative">
                <select 
                  value={paymentPolicy}
                  onChange={(e) => setPaymentPolicy(e.target.value)}
                  className={`w-full appearance-none border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs bg-slate-100/70 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                    paymentPolicy === '' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <option value="" disabled hidden>Select Vendor payment policy</option>
                  <option value="" className="text-slate-400">Select Vendor payment policy</option>
                  <option value="100 % Date of Booking">100 % Date of Booking</option>
                  <option value="50 % upfront, 50 % post-service">50 % upfront, 50 % post-service</option>
                  <option value="Pay after service">Pay after service</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Vendor Cancellation Policy */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Vendor Cancellation Policy <span className="text-[#e3000f]">*</span>
              </label>
              <div className="relative">
                <select 
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className={`w-full appearance-none border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs bg-slate-100/70 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                    cancellationPolicy === '' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <option value="" disabled hidden>Select Vendor cancellation policy</option>
                  <option value="" className="text-slate-400">Select Vendor cancellation policy</option>
                  <option value="No cancellation">No cancellation</option>
                  <option value="Free cancellation up to 24h">Free cancellation up to 24h</option>
                  <option value="Free cancellation up to 48h">Free cancellation up to 48h</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
            
            {/* Currency */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Currency <span className="text-[#e3000f]">*</span>
              </label>
              <div className="relative">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`w-full appearance-none border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs bg-slate-50/50 dark:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                    currency === '' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <option value="" disabled hidden>Select Currency</option>
                  <option value="" className="text-slate-400">Select Currency</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SGD">SGD</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

          </div>
          
          {/* Select Events */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Events
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                placeholder="Search or Select a Variant"
                className="w-full border border-slate-200 dark:border-slate-800 rounded-md pl-3 pr-8 py-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              placeholder="Description"
              className="w-full border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[90px] resize-none"
            />
            <div className="text-right text-[10px] text-slate-400 mt-1 font-medium">
              {description.length} / 300
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 flex-1 mr-4">
            
            {/* Vendor Selection Reason Select */}
            <div className="relative flex-1 max-w-[200px]">
              <select 
                value={bestService}
                onChange={(e) => setBestService(e.target.value)}
                className={`w-full appearance-none border border-slate-200 dark:border-slate-800 rounded-md px-3 py-1.5 text-xs bg-slate-50/50 dark:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-8 h-[34px] ${
                  bestService === '' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <option value="" disabled hidden>Vendor Selection Reason</option>
                <option value="" className="text-slate-400">Vendor Selection Reason</option>
                <option value="Best Service Offered">Best Service Offered</option>
                <option value="Alternative Service 1">Alternative Service 1</option>
                <option value="Alternative Service 2">Alternative Service 2</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Total Vendor Payable Input Group */}
            <div className="flex border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-[#f7f7f7] dark:bg-slate-800 h-[34px] flex-1 max-w-[220px]">
              <div className="bg-[#f1f3f5] dark:bg-slate-700 px-3.5 text-xs font-bold text-slate-400 dark:text-slate-300 flex items-center justify-center border-r border-slate-200 dark:border-slate-800 select-none min-w-[50px]">
                {currency || 'INR'}
              </div>
              <input 
                type="text" 
                value={payableAmount} 
                onChange={(e) => setPayableAmount(e.target.value)}
                placeholder="Total Vendor Payable" 
                className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#f7f7f7] dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
            </div>

          </div>

          <button 
            onClick={handleSave}
            className={`px-6 py-1.5 text-white text-xs font-bold rounded-md transition-all h-[34px] flex items-center justify-center min-w-[76px] shadow-sm active:scale-[0.98] ${saveButtonBg}`}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
