import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Star, Calendar, Users, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, 
  MapPin, Clock, Languages, ShieldAlert, Check, Flame, CreditCard, Sparkles, Ticket,
  Phone, ArrowLeft, Image, Smartphone, Zap, BookOpen, Compass, Info, RotateCcw, Map,
  MessageSquare, Plus, ChevronLeft, ChevronRight, Heart, Share2, Copy, Mail, ExternalLink,
  Tag, ShieldCheck, Download
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { downloadTicketVoucher } from '../utils/ticketDownloader';
import { POPULAR_ATTRACTIONS } from '../data/mockData';
import AttractionCard from './AttractionCard';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { Helmet } from 'react-helmet-async';

const COUNTRIES = [
  { name: 'Afghanistan', code: 'AF', dial: '+93' },
  { name: 'Albania', code: 'AL', dial: '+355' },
  { name: 'Algeria', code: 'DZ', dial: '+213' },
  { name: 'Andorra', code: 'AD', dial: '+376' },
  { name: 'Angola', code: 'AO', dial: '+244' },
  { name: 'Argentina', code: 'AR', dial: '+54' },
  { name: 'Armenia', code: 'AM', dial: '+374' },
  { name: 'Australia', code: 'AU', dial: '+61' },
  { name: 'Austria', code: 'AT', dial: '+43' },
  { name: 'Azerbaijan', code: 'AZ', dial: '+994' },
  { name: 'Bahamas', code: 'BS', dial: '+1-242' },
  { name: 'Bahrain', code: 'BH', dial: '+973' },
  { name: 'Bangladesh', code: 'BD', dial: '+880' },
  { name: 'Barbados', code: 'BB', dial: '+1-246' },
  { name: 'Belarus', code: 'BY', dial: '+375' },
  { name: 'Belgium', code: 'BE', dial: '+32' },
  { name: 'Belize', code: 'BZ', dial: '+501' },
  { name: 'Benin', code: 'BJ', dial: '+229' },
  { name: 'Bhutan', code: 'BT', dial: '+975' },
  { name: 'Bolivia', code: 'BO', dial: '+591' },
  { name: 'Bosnia and Herzegovina', code: 'BA', dial: '+387' },
  { name: 'Botswana', code: 'BW', dial: '+267' },
  { name: 'Brazil', code: 'BR', dial: '+55' },
  { name: 'Brunei', code: 'BN', dial: '+673' },
  { name: 'Bulgaria', code: 'BG', dial: '+359' },
  { name: 'Burkina Faso', code: 'BF', dial: '+226' },
  { name: 'Burundi', code: 'BI', dial: '+257' },
  { name: 'Cambodia', code: 'KH', dial: '+855' },
  { name: 'Cameroon', code: 'CM', dial: '+237' },
  { name: 'Canada', code: 'CA', dial: '+1' },
  { name: 'Cape Verde', code: 'CV', dial: '+238' },
  { name: 'Central African Republic', code: 'CF', dial: '+236' },
  { name: 'Chad', code: 'TD', dial: '+235' },
  { name: 'Chile', code: 'CL', dial: '+56' },
  { name: 'China', code: 'CN', dial: '+86' },
  { name: 'Colombia', code: 'CO', dial: '+57' },
  { name: 'Comoros', code: 'KM', dial: '+269' },
  { name: 'Congo', code: 'CG', dial: '+242' },
  { name: 'Costa Rica', code: 'CR', dial: '+506' },
  { name: 'Croatia', code: 'HR', dial: '+385' },
  { name: 'Cuba', code: 'CU', dial: '+53' },
  { name: 'Cyprus', code: 'CY', dial: '+357' },
  { name: 'Czech Republic', code: 'CZ', dial: '+420' },
  { name: 'Denmark', code: 'DK', dial: '+45' },
  { name: 'Djibouti', code: 'DJ', dial: '+253' },
  { name: 'Dominica', code: 'DM', dial: '+1-767' },
  { name: 'Dominican Republic', code: 'DO', dial: '+1-809' },
  { name: 'Ecuador', code: 'EC', dial: '+593' },
  { name: 'Egypt', code: 'EG', dial: '+20' },
  { name: 'El Salvador', code: 'SV', dial: '+503' },
  { name: 'Equatorial Guinea', code: 'GQ', dial: '+240' },
  { name: 'Eritrea', code: 'ER', dial: '+291' },
  { name: 'Estonia', code: 'EE', dial: '+372' },
  { name: 'Eswatini', code: 'SZ', dial: '+268' },
  { name: 'Ethiopia', code: 'ET', dial: '+251' },
  { name: 'Fiji', code: 'FJ', dial: '+679' },
  { name: 'Finland', code: 'FI', dial: '+358' },
  { name: 'France', code: 'FR', dial: '+33' },
  { name: 'Gabon', code: 'GA', dial: '+241' },
  { name: 'Gambia', code: 'GM', dial: '+220' },
  { name: 'Georgia', code: 'GE', dial: '+995' },
  { name: 'Germany', code: 'DE', dial: '+49' },
  { name: 'Ghana', code: 'GH', dial: '+233' },
  { name: 'Greece', code: 'GR', dial: '+30' },
  { name: 'Grenada', code: 'GD', dial: '+1-473' },
  { name: 'Guatemala', code: 'GT', dial: '+502' },
  { name: 'Guinea', code: 'GN', dial: '+224' },
  { name: 'Guyana', code: 'GY', dial: '+592' },
  { name: 'Haiti', code: 'HT', dial: '+509' },
  { name: 'Honduras', code: 'HN', dial: '+504' },
  { name: 'Hong Kong', code: 'HK', dial: '+852' },
  { name: 'Hungary', code: 'HU', dial: '+36' },
  { name: 'Iceland', code: 'IS', dial: '+354' },
  { name: 'India', code: 'IN', dial: '+91' },
  { name: 'Indonesia', code: 'ID', dial: '+62' },
  { name: 'Iran', code: 'IR', dial: '+98' },
  { name: 'Iraq', code: 'IQ', dial: '+964' },
  { name: 'Ireland', code: 'IE', dial: '+353' },
  { name: 'Israel', code: 'IL', dial: '+972' },
  { name: 'Italy', code: 'IT', dial: '+39' },
  { name: 'Jamaica', code: 'JM', dial: '+1-876' },
  { name: 'Japan', code: 'JP', dial: '+81' },
  { name: 'Jordan', code: 'JO', dial: '+962' },
  { name: 'Kazakhstan', code: 'KZ', dial: '+7' },
  { name: 'Kenya', code: 'KE', dial: '+254' },
  { name: 'Kiribati', code: 'KI', dial: '+686' },
  { name: 'Kuwait', code: 'KW', dial: '+965' },
  { name: 'Kyrgyzstan', code: 'KG', dial: '+996' },
  { name: 'Laos', code: 'LA', dial: '+856' },
  { name: 'Latvia', code: 'LV', dial: '+371' },
  { name: 'Lebanon', code: 'LB', dial: '+961' },
  { name: 'Lesotho', code: 'LS', dial: '+266' },
  { name: 'Liberia', code: 'LR', dial: '+231' },
  { name: 'Libya', code: 'LY', dial: '+218' },
  { name: 'Liechtenstein', code: 'LI', dial: '+423' },
  { name: 'Lithuania', code: 'LT', dial: '+370' },
  { name: 'Luxembourg', code: 'LU', dial: '+352' },
  { name: 'Macau', code: 'MO', dial: '+853' },
  { name: 'Madagascar', code: 'MG', dial: '+261' },
  { name: 'Malawi', code: 'MW', dial: '+265' },
  { name: 'Malaysia', code: 'MY', dial: '+60' },
  { name: 'Maldives', code: 'MV', dial: '+960' },
  { name: 'Mali', code: 'ML', dial: '+223' },
  { name: 'Malta', code: 'MT', dial: '+356' },
  { name: 'Marshall Islands', code: 'MH', dial: '+692' },
  { name: 'Mauritania', code: 'MR', dial: '+222' },
  { name: 'Mauritius', code: 'MU', dial: '+230' },
  { name: 'Mexico', code: 'MX', dial: '+52' },
  { name: 'Micronesia', code: 'FM', dial: '+691' },
  { name: 'Moldova', code: 'MD', dial: '+373' },
  { name: 'Monaco', code: 'MC', dial: '+377' },
  { name: 'Mongolia', code: 'MN', dial: '+976' },
  { name: 'Montenegro', code: 'ME', dial: '+382' },
  { name: 'Morocco', code: 'MA', dial: '+212' },
  { name: 'Mozambique', code: 'MZ', dial: '+258' },
  { name: 'Myanmar', code: 'MM', dial: '+95' },
  { name: 'Namibia', code: 'NA', dial: '+264' },
  { name: 'Nauru', code: 'NR', dial: '+674' },
  { name: 'Nepal', code: 'NP', dial: '+977' },
  { name: 'Netherlands', code: 'NL', dial: '+31' },
  { name: 'New Zealand', code: 'NZ', dial: '+64' },
  { name: 'Nicaragua', code: 'NI', dial: '+505' },
  { name: 'Niger', code: 'NE', dial: '+227' },
  { name: 'Nigeria', code: 'NG', dial: '+234' },
  { name: 'North Korea', code: 'KP', dial: '+850' },
  { name: 'North Macedonia', code: 'MK', dial: '+389' },
  { name: 'Norway', code: 'NO', dial: '+47' },
  { name: 'Oman', code: 'OM', dial: '+968' },
  { name: 'Pakistan', code: 'PK', dial: '+92' },
  { name: 'Palau', code: 'PW', dial: '+680' },
  { name: 'Palestine', code: 'PS', dial: '+970' },
  { name: 'Panama', code: 'PA', dial: '+507' },
  { name: 'Papua New Guinea', code: 'PG', dial: '+675' },
  { name: 'Paraguay', code: 'PY', dial: '+595' },
  { name: 'Peru', code: 'PE', dial: '+51' },
  { name: 'Philippines', code: 'PH', dial: '+63' },
  { name: 'Poland', code: 'PL', dial: '+48' },
  { name: 'Portugal', code: 'PT', dial: '+351' },
  { name: 'Qatar', code: 'QA', dial: '+974' },
  { name: 'Romania', code: 'RO', dial: '+40' },
  { name: 'Russia', code: 'RU', dial: '+7' },
  { name: 'Rwanda', code: 'RW', dial: '+250' },
  { name: 'Saint Kitts and Nevis', code: 'KN', dial: '+1-869' },
  { name: 'Saint Lucia', code: 'LC', dial: '+1-758' },
  { name: 'Saint Vincent', code: 'VC', dial: '+1-784' },
  { name: 'Samoa', code: 'WS', dial: '+685' },
  { name: 'San Marino', code: 'SM', dial: '+378' },
  { name: 'Sao Tome and Principe', code: 'ST', dial: '+239' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966' },
  { name: 'Senegal', code: 'SN', dial: '+221' },
  { name: 'Serbia', code: 'RS', dial: '+381' },
  { name: 'Seychelles', code: 'SC', dial: '+248' },
  { name: 'Sierra Leone', code: 'SL', dial: '+232' },
  { name: 'Singapore', code: 'SG', dial: '+65' },
  { name: 'Slovakia', code: 'SK', dial: '+421' },
  { name: 'Slovenia', code: 'SI', dial: '+386' },
  { name: 'Solomon Islands', code: 'SB', dial: '+677' },
  { name: 'Somalia', code: 'SO', dial: '+252' },
  { name: 'South Africa', code: 'ZA', dial: '+27' },
  { name: 'South Korea', code: 'KR', dial: '+82' },
  { name: 'South Sudan', code: 'SS', dial: '+211' },
  { name: 'Spain', code: 'ES', dial: '+34' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94' },
  { name: 'Sudan', code: 'SD', dial: '+249' },
  { name: 'Suriname', code: 'SR', dial: '+597' },
  { name: 'Sweden', code: 'SE', dial: '+46' },
  { name: 'Switzerland', code: 'CH', dial: '+41' },
  { name: 'Syria', code: 'SY', dial: '+963' },
  { name: 'Taiwan', code: 'TW', dial: '+886' },
  { name: 'Tajikistan', code: 'TJ', dial: '+992' },
  { name: 'Tanzania', code: 'TZ', dial: '+255' },
  { name: 'Thailand', code: 'TH', dial: '+66' },
  { name: 'Timor-Leste', code: 'TL', dial: '+670' },
  { name: 'Togo', code: 'TG', dial: '+228' },
  { name: 'Tonga', code: 'TO', dial: '+676' },
  { name: 'Trinidad and Tobago', code: 'TT', dial: '+1-868' },
  { name: 'Tunisia', code: 'TN', dial: '+216' },
  { name: 'Turkey', code: 'TR', dial: '+90' },
  { name: 'Turkmenistan', code: 'TM', dial: '+993' },
  { name: 'Tuvalu', code: 'TV', dial: '+688' },
  { name: 'Uganda', code: 'UG', dial: '+256' },
  { name: 'Ukraine', code: 'UA', dial: '+380' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' },
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'Uruguay', code: 'UY', dial: '+598' },
  { name: 'Uzbekistan', code: 'UZ', dial: '+998' },
  { name: 'Vanuatu', code: 'VU', dial: '+678' },
  { name: 'Vatican City', code: 'VA', dial: '+39' },
  { name: 'Venezuela', code: 'VE', dial: '+58' },
  { name: 'Vietnam', code: 'VN', dial: '+84' },
  { name: 'Yemen', code: 'YE', dial: '+967' },
  { name: 'Zambia', code: 'ZM', dial: '+260' },
  { name: 'Zimbabwe', code: 'ZW', dial: '+263' }
];

interface Props {
  attractionId: string;
  onClose: () => void;
  onNavigateToBookings?: () => void;
  onViewAttraction?: (id: string) => void;
  onNavigateToDestination?: (city: string, category?: string) => void;
  onNavigateToHome?: () => void;
}

export default function AttractionDetailModal({ 
  attractionId, 
  onClose, 
  onNavigateToBookings, 
  onViewAttraction,
  onNavigateToDestination,
  onNavigateToHome
}: Props) {
  const { formatPrice, t, currency } = useSettings();
  const { user, addBooking } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const currencySymbol = useMemo(() => {
    switch (currency.code) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      case 'SGD': return 'S$';
      default: return currency.code;
    }
  }, [currency.code]);

  const formatPriceScreenshotWay = (val: number) => {
    const converted = val * currency.rate;
    const formattedVal = converted % 1 === 0 ? converted.toFixed(0) : converted.toFixed(2);
    // Standardize to uppercase currency code space value, like EUR 55
    return `${currency.code} ${formattedVal}`;
  };
  
  const attraction = useMemo(() => {
    return POPULAR_ATTRACTIONS.find(a => a.id === attractionId);
  }, [attractionId]);

  const dynamicPackages = useMemo(() => {
    if (!attraction) return [];
    
    // Clean up the attraction name if it ends with ":" or has "Ticket" already
    const cleanName = attraction.name.includes(':') 
      ? attraction.name.split(':')[0] 
      : attraction.name.replace(/Entrance Tickets|Entrance Ticket|Tickets|Ticket/gi, '').trim();

    const basePrice = attraction.discountPrice || attraction.price;

    return [
      { 
        id: 'general', 
        listName: "1-Day Admission Ticket",
        name: `${cleanName} – Same Day Entry Ticket (Instant Confirmation & Guaranteed Admission)`, 
        shortName: `${cleanName} Entry Ticket`,
        priceOffset: 0,
        couponDiscount: 3.80,
        description: `Admission to ${cleanName} permanent collection. Timed entry slots guarantee immediate access without waiting.`,
        duration: '2 Hours'
      },
      { 
        id: 'non-stop-2day', 
        listName: "Non-stop 2-Day Admission Ticket",
        name: `${cleanName} – Non-stop 2-Day Admission Ticket (Fast Track Entry)`, 
        shortName: `${cleanName} 2-Day Fast Track`,
        priceOffset: Math.round(basePrice * 0.15),
        couponDiscount: 4.36,
        description: `Experience two days of unrestricted exploration with fast-track admission past standard queues.`,
        duration: 'Flexible 48 Hours'
      },
      { 
        id: '2day-7days', 
        listName: "2-Day Admission Ticket (2 Visits within 7 Days)",
        name: `${cleanName} – 2-Day Admission Ticket (2 Visits within 7 Days)`, 
        shortName: `${cleanName} 2-Visit Pass`,
        priceOffset: Math.round(basePrice * 0.45),
        couponDiscount: 5.52,
        description: `Visit twice at any time within a 7-day period. Perfect for paced discovery of temporary galleries.`,
        duration: '7 Days Validity'
      }
    ];
  }, [attraction]);

  const [bookingDate, setBookingDate] = useState<string>('');

  const [guestCount, setGuestCount] = useState(2); // default to 2 like the image
  const [childCount, setChildCount] = useState(0);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  const selectedPackage = useMemo(() => {
    return dynamicPackages.find(p => p.id === selectedPackageId) || dynamicPackages[0] || { id: 'general', name: 'General Admission Entrance Ticket', priceOffset: 0 };
  }, [dynamicPackages, selectedPackageId]);

  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  const [calendarYear, setCalendarYear] = useState(() => new Date(bookingDate || Date.now()).getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(bookingDate || Date.now()).getMonth());

  const MONTH_NAMES = useMemo(() => [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ], []);

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 0) {
        setCalendarYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 11) {
        setCalendarYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const daysInMonth = useMemo(() => {
    return new Date(calendarYear, calendarMonth + 1, 0).getDate();
  }, [calendarYear, calendarMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(calendarYear, calendarMonth, 1).getDay();
  }, [calendarYear, calendarMonth]);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [daysInMonth, firstDayOfWeek]);

  const handleSelectDay = (day: number) => {
    const monthStr = String(calendarMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setBookingDate(`${calendarYear}-${monthStr}-${dayStr}`);
    setShowCalendarDropdown(false);
  };

  const formattedDate = useMemo(() => {
    if (!bookingDate) return 'Select travel date';
    const split = bookingDate.split('-');
    if (split.length !== 3) return bookingDate;
    const y = parseInt(split[0]);
    const m = parseInt(split[1]) - 1;
    const d = parseInt(split[2]);
    const dateObj = new Date(y, m, d);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }, [bookingDate]);
  
  const [travelerFirstName, setTravelerFirstName] = useState(() => {
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts[0] || '';
    }
    return '';
  });
  const [travelerLastName, setTravelerLastName] = useState(() => {
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts.slice(1).join(' ') || '';
    }
    return '';
  });
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [travelerCountry, setTravelerCountry] = useState('United States');
  const [travelerCountryCode, setTravelerCountryCode] = useState('+1');
  const [travelerPhoneNumber, setTravelerPhoneNumber] = useState('');

  interface AdditionalPassenger {
    type: 'Adult' | 'Child';
    index: number;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
  }

  const [additionalPassengers, setAdditionalPassengers] = useState<AdditionalPassenger[]>([]);

  useEffect(() => {
    const extraAdults = Math.max(0, guestCount - 1);
    const children = childCount;
    
    setAdditionalPassengers(prev => {
      const updated: AdditionalPassenger[] = [];
      
      // Keep existing adult inputs as much as possible
      for (let i = 0; i < extraAdults; i++) {
        const existing = prev.find(p => p.type === 'Adult' && p.index === i + 2);
        updated.push({
          type: 'Adult',
          index: i + 2,
          firstName: existing?.firstName || '',
          lastName: existing?.lastName || '',
        });
      }
      
      // Keep existing child inputs as much as possible
      for (let i = 0; i < children; i++) {
        const existing = prev.find(p => p.type === 'Child' && p.index === i + 1);
        updated.push({
          type: 'Child',
          index: i + 1,
          firstName: existing?.firstName || '',
          lastName: existing?.lastName || '',
          dateOfBirth: existing?.dateOfBirth || '',
        });
      }
      
      return updated;
    });
  }, [guestCount, childCount]);
  
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [highlightPackages, setHighlightPackages] = useState(false);

  // New Booking Form states
  const [bookingFormStep, setBookingFormStep] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM');
  const [specialRequests, setSpecialRequests] = useState('');

  const guestName = `${travelerFirstName} ${travelerLastName}`.trim();
  const travelerPhone = `${travelerCountryCode} ${travelerPhoneNumber}`.trim();

  // Reset booking form step and booking success when attraction details change
  useEffect(() => {
    setBookingFormStep(false);
    setBookingSuccess(null);
    setCheckoutError(null);
    setGuestCount(2);
    setChildCount(0);
    setBookingDate('');
    if (dynamicPackages && dynamicPackages.length > 0) {
      setSelectedPackageId(dynamicPackages[0].id);
    }
  }, [attraction?.id]);

  // Share Activity Link States & Helpers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!attraction) return '';
    return `${window.location.origin}${window.location.pathname}?attraction=${attraction.id}`;
  }, [attraction?.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: attraction?.name || 'Check out this amazing activity!',
          text: attraction?.description || 'Found this wonderful activity on Secure Bookings.',
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to our custom dialog if user cancelled or it failed
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Accordion Expandable States
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isGettingThereOpen, setIsGettingThereOpen] = useState(false);
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false);
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);

  if (!attraction) return null;

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Home',
        onClick: () => {
          if (onNavigateToHome) {
            onNavigateToHome();
          } else {
            onClose();
          }
        }
      },
      {
        label: attraction.city,
        onClick: () => {
          if (onNavigateToDestination) {
            onNavigateToDestination(attraction.city);
          } else {
            onClose();
          }
        }
      }
    ];

    if (attraction.category) {
      items.push({
        label: attraction.category,
        onClick: () => {
          if (onNavigateToDestination) {
            onNavigateToDestination(attraction.city, attraction.category);
          } else {
            onClose();
          }
        }
      });
    }

    items.push({
      label: attraction.name
    });

    return items;
  }, [attraction, onClose, onNavigateToDestination, onNavigateToHome]);

  // Compute final price with package offset
  const basePrice = attraction.discountPrice || attraction.price;
  const pricePerItem = basePrice + selectedPackage.priceOffset;
  const childPricePerItem = pricePerItem * 0.6; // 40% discount for children
  const totalPriceFloat = (pricePerItem * guestCount) + (childPricePerItem * childCount);

  // Multi-image bento layout: Left image tall, 4 right images in a 2x2 grid
  const galleryUrls = attraction.galleryUrls && attraction.galleryUrls.length > 0 ? attraction.galleryUrls : [];
  
  const galleryImages = useMemo(() => {
    const urls: string[] = [];
    if (attraction.imageUrl) {
      urls.push(attraction.imageUrl);
    }
    for (const url of galleryUrls) {
      if (!urls.includes(url)) {
        urls.push(url);
      }
    }
    const defaultGallery = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800', // flowers
      'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&q=80&w=800', // gallery view
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800', // museum hall
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800', // classical face portrait
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'  // brushes paint
    ];
    for (const img of defaultGallery) {
      if (urls.length >= 5) break;
      if (!urls.includes(img)) {
        urls.push(img);
      }
    }
    return urls.slice(0, 5);
  }, [attraction, galleryUrls]);

  const mainImage = galleryImages[0] || attraction.imageUrl || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800';

  // Find 4 other attractions in the destination "Customers also bought"
  const customersAlsoBought = useMemo(() => {
    // 1. Get other attractions in the exact same city
    const sameCity = POPULAR_ATTRACTIONS.filter(
      a => a.id !== attraction.id && a.city === attraction.city
    );
    
    // 2. If we don't have enough (we need 4), get attractions from the same region
    let list = [...sameCity];
    if (list.length < 4) {
      const sameRegion = POPULAR_ATTRACTIONS.filter(
        a => a.id !== attraction.id && a.region === attraction.region && !list.some(item => item.id === a.id)
      );
      list.push(...sameRegion);
    }
    
    // 3. If we still don't have 4, get other popular attractions
    if (list.length < 4) {
      const otherPopular = POPULAR_ATTRACTIONS.filter(
        a => a.id !== attraction.id && !list.some(item => item.id === a.id)
      );
      list.push(...otherPopular);
    }
    
    return list.slice(0, 4);
  }, [attraction]);

  // Calculate highlights for this attraction
  const highlightsList = useMemo(() => {
    if (attraction?.id === 'ams-rijksmuseum') {
      return [
        'Skip-the-line entry to the Rijksmuseum.',
        'View masterpieces by Rembrandt, Vermeer, and other Dutch masters.',
        'See the famous The Night Watch.',
        'Explore Dutch art and history at your own pace.',
        'Learn fascinating stories behind the museum\'s collection.',
        'Enjoy a memorable cultural experience in Amsterdam.'
      ];
    }
    if (attraction?.id === 'ams-van-gogh') {
      return [
        'Enjoy skip-the-line entry for a hassle-free visit.',
        'Admire the iconic masterpieces of Vincent van Gogh.',
        'Explore the museum at your own pace.',
        'Learn about Van Gogh\'s artistic techniques, influences, and inspirations.',
        'Experience a smooth, engaging, and enriching museum visit.'
      ];
    }
    if (attraction?.id === 'lis-jeronimos') {
      return [
        'Enjoy entry to the magnificent Jerónimos Monastery, a masterpiece of Portuguese architecture.',
        'Admire the stunning Manueline-style design, renowned for its intricate stone carvings and maritime motifs.',
        'Explore the beautiful cloisters, considered among the finest in Europe.',
        'Learn about Portugal’s Age of Discovery and the monastery’s historical significance.',
        'Visit the tombs of renowned figures, including Vasco da Gama and Luís de Camões.',
        'Discover a Jerónimos Monastery UNESCO World Heritage Site that reflects Portugal’s rich cultural heritage.',
        'Explore the monument at your own pace and enjoy a memorable journey through history.'
      ];
    }
    if (attraction?.highlights && attraction.highlights.length > 0) {
      return attraction.highlights;
    }
    return [
      'Enjoy hassle-free entry with pre-booked entry tickets.',
      'Explore the beautiful exhibition galleries at your own leisure.',
      'Admire the incredible structures and local historic collections.',
      'Learn about fascinating histories and stories behind the exhibitions.',
      'Create unforgettable and delightful memories with family and friends.'
    ];
  }, [attraction]);

  // Handle checking availability block
  const handleCheckAvailability = () => {
    setIsChecking(true);
    setCheckoutError(null);
    setTimeout(() => {
      setIsChecking(false);
      setAvailabilityChecked(true);
    }, 1200);
  };

  const handleScrollToPackages = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Smoothly scroll to the Select Package Options section
    const target = document.getElementById('select-package-options-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightPackages(true);
      // Automatically fade out the highlight after some time
      setTimeout(() => {
        setHighlightPackages(false);
      }, 3000);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    
    if (!bookingDate) {
      setCheckoutError('Please select a preferred travel date from the calendar (Mandatory).');
      const target = document.getElementById('visit-date-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!travelerFirstName.trim()) {
      setCheckoutError("First Name* is required.");
      return;
    }

    if (!travelerLastName.trim()) {
      setCheckoutError("Last Name* is required.");
      return;
    }

    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setCheckoutError("A valid email address* is required.");
      return;
    }

    if (!travelerCountry) {
      setCheckoutError("Please select your country*.");
      return;
    }

    if (!travelerCountryCode) {
      setCheckoutError("Please select your country code*.");
      return;
    }

    if (!travelerPhoneNumber.trim()) {
      setCheckoutError("Please enter your phone number*.");
      return;
    }

    // Validate additional passengers details
    for (let i = 0; i < additionalPassengers.length; i++) {
      const p = additionalPassengers[i];
      if (!p.firstName.trim()) {
        setCheckoutError(`First Name* is required for Traveler #${i + 2} (${p.type}).`);
        return;
      }
      if (!p.lastName.trim()) {
        setCheckoutError(`Last Name* is required for Traveler #${i + 2} (${p.type}).`);
        return;
      }
      if (p.type === 'Child' && !p.dateOfBirth?.trim()) {
        setCheckoutError(`Date of Birth* is required for Child Traveler #${i + 2}.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Create guest info object if needed
      const guestInfo = { name: guestName, email: guestEmail, passengers: additionalPassengers };
      const response = await addBooking(
        attraction.id,
        `${attraction.name} - ${selectedPackage.name}`,
        mainImage,
        attraction.city,
        bookingDate,
        guestCount,
        pricePerItem,
        guestInfo,
        childCount,
        childPricePerItem,
        additionalPassengers
      );
      setBookingSuccess(response);
    } catch (err: any) {
      setCheckoutError(err.message || 'An error occurred during booking process.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [reviewsList, setReviewsList] = useState<Array<{ name: string; rating: number; date: string; comment: string }>>([]);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewSuccess, setNewReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchDBReviews = async () => {
      const id = attractionId || attraction?.id;
      if (!id) return;
      try {
        const res = await fetch(`/api/reviews/attraction/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.success && data.reviews) {
          const dbReviews = data.reviews.map((r: any) => ({
            name: r.user_name || 'Verified Customer',
            rating: r.rating,
            date: r.created_at || 'Recently',
            comment: r.comment
          }));
          setReviewsList(prev => {
            const filteredPrev = prev.filter(p => !dbReviews.some((dbR: any) => dbR.comment === p.comment));
            return [...dbReviews, ...filteredPrev];
          });
        }
      } catch (err) {
        console.error("Failed to fetch database reviews", err);
      }
    };

    if (attraction) {
      setReviewsList([
        { name: 'Travel37810392548', rating: 5, date: 'May 2026', comment: `An old center of ${attraction.city} is quite large, so if you are there for the first time, it is really useful to have some guidance. You can also learn quite a lot about art, history, and local traditions.` },
        { name: 'Wander22969920823', rating: 4, date: 'March 2026', comment: `Because our feet were hurting, we took the smart audio tour and stopped at some lovely cafes in ${attraction.city}. Beautiful experiences!` },
        { name: '347odilev', rating: 3, date: 'August 2025', comment: 'Self-guided smart exploration which requires standard mobile access. Beautiful content but make sure your phone battery is charged!' },
        { name: 'Ewan_T', rating: 5, date: 'July 2025', comment: `It was like walking around ${attraction.city} with a funny and smart friend who knows all the interesting details — art, landmarks, and funny historical stories! Highly recommended experience and so smooth to book.` },
        { name: 'Sarah_K', rating: 5, date: 'April 2026', comment: `This booking saved us so much hassle. Slipped past the queue effortlessly. The ${attraction.name} collection is mindblowing!` },
        { name: 'Jordi_V', rating: 4, date: 'February 2026', comment: 'Loved it. Very structured pathways and beautiful presentation. Recommended for families!' }
      ]);
      setReviewFilter('all');
      setShowAllReviews(false);
      setIsWritingReview(false);
      setNewReviewName('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setNewReviewSuccess(false);

      fetchDBReviews();
    }
  }, [attractionId, attraction]);

  // Dynamic calculations of reviews statistics
  const averageRating = useMemo(() => {
    if (!reviewsList || reviewsList.length === 0) return 0;
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / reviewsList.length).toFixed(1));
  }, [reviewsList]);

  const ratingCounts = useMemo(() => {
    const counts: { [rating: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach(r => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });
    return counts;
  }, [reviewsList]);

  const filteredReviews = useMemo(() => {
    return reviewsList.filter(r => reviewFilter === 'all' || r.rating === reviewFilter);
  }, [reviewsList, reviewFilter]);

  // Determine the display set based on "Read More" collapse toggle
  const visibleReviews = useMemo(() => {
    if (showAllReviews) return filteredReviews;
    return filteredReviews.slice(0, 4);
  }, [filteredReviews, showAllReviews]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview = {
      name: newReviewName.trim(),
      rating: newReviewRating,
      date: 'Today',
      comment: newReviewComment.trim()
    };

    setReviewsList(prev => [newReview, ...prev]);
    setNewReviewSuccess(true);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);

    setTimeout(() => {
      setNewReviewSuccess(false);
      setIsWritingReview(false);
    }, 2000);
  };

  if (!attraction) {
    return null;
  }

  return (
    <div id="booking-detail-modal-root" className="bg-slate-50 dark:bg-slate-950 font-sans min-h-screen pb-16">
      <Helmet>
        <title>{`${attraction.name} Tickets & Tours | Tiqsey`}</title>
        <meta name="description" content={attraction.description || `Book ${attraction.name} tickets online with best price guarantee and skip-the-line options.`} />
        <meta property="og:title" content={`${attraction.name} Tickets & Tours | Tiqsey`} />
        <meta property="og:description" content={attraction.description || `Book ${attraction.name} tickets online with best price guarantee and skip-the-line options.`} />
        {attraction.imageUrl && <meta property="og:image" content={attraction.imageUrl} />}
      </Helmet>
      
      {/* Top pristine Header Navigation bar */}
      <div id="booking-sticky-header" className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            id="back-list-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-750 dark:text-slate-350 hover:text-brand transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to exploring
          </button>
          
          <h1 className="hidden sm:block text-xs font-black uppercase text-gray-400 tracking-wider font-mono">
            Secure Booking Portal
          </h1>

          <button 
            id="close-icon-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-850 text-gray-600 dark:text-slate-350 transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-1">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {!bookingSuccess && (
        <div id="gallery-hero-section" className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-2 select-none">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group pointer-events-auto">
            {/* Main single image */}
            <div className="relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img 
                id="main-hero-img"
                src={mainImage} 
                alt={attraction.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105 cursor-pointer"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Hot deals badge */}
            {attraction.discountPrice && (
              <div className="absolute top-4 left-4 z-10">
                <span className="self-start bg-brand text-white text-[10px] lg:text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 leading-none select-none">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Hot Ticket Deals
                </span>
              </div>
            )}

            {/* Floating Share Button */}
            {attraction && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleShare}
                className="absolute top-4 right-[4.25rem] z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-lg border border-slate-100/60 dark:border-slate-800/60 backdrop-blur-xs transition-colors cursor-pointer group/share"
                title="Share Activity"
                aria-label="Share Activity"
              >
                <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover/share:text-brand transition-colors" />
              </motion.button>
            )}

            {/* Wishlist/Favorite Floating Button */}
            {attraction && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => toggleWishlist(attraction)}
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-lg border border-slate-100/60 dark:border-slate-800/60 backdrop-blur-xs transition-colors cursor-pointer group/fav"
                title={isWishlisted(attraction.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                aria-label={isWishlisted(attraction.id) ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <motion.div
                  animate={isWishlisted(attraction.id) ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <Heart 
                    className={`w-5.5 h-5.5 transition-colors duration-200 ${
                      isWishlisted(attraction.id) 
                        ? 'fill-[#e3000f] text-[#e3000f]' 
                        : 'text-slate-600 dark:text-slate-400 group-hover/fav:text-[#e3000f] dark:group-hover/fav:text-[#e3000f]'
                    }`} 
                  />
                </motion.div>
              </motion.button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:py-10">
        {!bookingSuccess ? (
          <div>
            {bookingFormStep ? (
              <div id="booking-form-page" className="space-y-8 animate-fade-in">
                {/* Header Back & Progress bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setBookingFormStep(false)}
                      className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand dark:text-slate-400 dark:hover:text-brand transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to details
                    </button>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight pt-1">
                      Provide Booking Details
                    </h2>
                  </div>

                  {/* Visual Step Indicator Progress Bar */}
                  <div className="flex items-center gap-2 select-none text-[11px] font-bold tracking-wider uppercase font-mono bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500">1. Tickets</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-brand">2. Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-slate-400 dark:text-slate-500">3. Confirmation</span>
                  </div>
                </div>

                {/* Form Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column - Form Fields (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* STEP A: Select Visit Date (High-Fidelity Interactive Calendar) */}
                    <div id="visit-date-section" className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-gray-200 dark:border-slate-800 space-y-4 shadow-3xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[6px] h-[22px] bg-[#e3000f] rounded-sm shrink-0" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          1. Select Visit Date<span className="text-[#e3000f] ml-1">*</span>
                        </h3>
                      </div>

                      {/* Display Selected Date elegantly */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#e3000f]" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Travel Date</span>
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{formattedDate}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#00875a] bg-[#00875a]/10 px-2.5 py-1 rounded-md">
                          Available & Instant Confirmation
                        </span>
                      </div>

                      {/* Render Calendar inline so they can see and click */}
                      <div className="border border-gray-150 dark:border-slate-800 rounded-2xl p-4 max-w-md mx-auto bg-slate-50/50 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-black text-slate-800 dark:text-white tracking-wide">
                            {MONTH_NAMES[calendarMonth]} {calendarYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-2">
                          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                          {calendarDays.map((day, i) => {
                            if (day === null) {
                              return <div key={`empty-${i}`} className="w-full h-14" />;
                            }
                            
                            const monthStr = String(calendarMonth + 1).padStart(2, '0');
                            const dayStr = String(day).padStart(2, '0');
                            const thisDateStr = `${calendarYear}-${monthStr}-${dayStr}`;
                            const isSelected = bookingDate === thisDateStr;
                            
                            // Prevent selecting past dates
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const cellDate = new Date(calendarYear, calendarMonth, day);
                            const isPast = cellDate < today;
                            const dayOfWeek = cellDate.getDay();
                            
                            // Monday is closed (dayOfWeek === 1)
                            const isUnavailable = dayOfWeek === 1;
                            const isDisabled = isPast || isUnavailable;

                            // Filling fast on Fridays and Saturdays (weekend rush)
                            const isFillingFast = !isDisabled && (dayOfWeek === 5 || dayOfWeek === 6);

                            // Calculate day-specific pricing
                            let dayPrice = pricePerItem;
                            if (dayOfWeek >= 2 && dayOfWeek <= 4) {
                              dayPrice = pricePerItem * 0.75; // 25% weekday discount
                            }
                            const convertedPrice = dayPrice * currency.rate;
                            const formattedCellPrice = `${currencySymbol} ${convertedPrice.toFixed(1)}`;

                            let btnClasses = "w-full h-14 rounded-xl flex flex-col justify-center items-center transition-all cursor-pointer text-center select-none border shadow-3xs";
                            
                            if (isSelected) {
                              btnClasses += " bg-[#e3000f] text-white border-[#e3000f] hover:bg-[#c93022]";
                            } else if (isDisabled) {
                              btnClasses += " text-slate-300 dark:text-slate-700 bg-transparent border-transparent cursor-not-allowed pointer-events-none";
                            } else if (isFillingFast) {
                              btnClasses += " bg-[#ffe0b2] text-[#7f4f24] border-transparent hover:bg-[#ffd180] hover:scale-[1.02] dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900/40";
                            } else {
                              // Available
                              btnClasses += " bg-[#c2f0d0] text-[#1b4332] border-transparent hover:bg-[#b0e8c0] hover:scale-[1.02] dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-900/40";
                            }

                            return (
                              <button
                                key={`day-${day}`}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => handleSelectDay(day)}
                                className={btnClasses}
                              >
                                <span className={`text-xs sm:text-sm font-extrabold ${isSelected ? 'text-white' : isDisabled ? 'text-slate-300 dark:text-slate-700' : 'text-slate-850 dark:text-white'}`}>
                                  {day}
                                </span>
                                {!isDisabled && (
                                  <span className={`text-[8.5px] font-bold tracking-tight mt-0.5 ${isSelected ? 'text-white/90' : isFillingFast ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                    {formattedCellPrice}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Legend matching screenshot */}
                        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-150 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#c2f0d0] dark:bg-emerald-950/50 border border-green-200 dark:border-emerald-900/50" />
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#ffe0b2] dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50" />
                            <span>Filling Fast</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP B: Select Time Slot */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-gray-200 dark:border-slate-800 space-y-4 shadow-3xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[6px] h-[22px] bg-[#e3000f] rounded-sm shrink-0" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          2. Select Entry Time Slot
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Please choose a preferred admission window. Keeping to your scheduled time ensures quick skip-the-line check-in.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM'].map((time) => {
                          const isSelected = selectedTimeSlot === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTimeSlot(time)}
                              className={`py-3 px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? 'border-[#e3000f] bg-red-50/20 dark:bg-red-950/10'
                                  : 'border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <span className={`text-sm font-black ${isSelected ? 'text-[#e3000f]' : 'text-slate-850 dark:text-slate-100'}`}>
                                {time}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" /> Available
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP C: Number of Travelers */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-gray-200 dark:border-slate-800 space-y-4 shadow-3xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[6px] h-[22px] bg-[#e3000f] rounded-sm shrink-0" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          3. Number of Travelers<span className="text-[#e3000f] ml-1">*</span>
                        </h3>
                      </div>

                      <div className="space-y-3.5">
                        {/* Adult Ticket */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-gray-150 dark:border-slate-850">
                          <div className="space-y-0.5">
                            <span className="text-sm font-extrabold text-slate-850 dark:text-white block">Adult Ticket</span>
                            <span className="text-xs text-slate-400 block">Age 13–99 years</span>
                          </div>
                          
                          {/* Stepper block */}
                          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 shadow-3xs select-none">
                            <button
                              type="button"
                              disabled={guestCount <= 1}
                              onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                              className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-black text-slate-850 dark:text-white text-base">
                              {guestCount}
                            </span>
                            <button
                              type="button"
                              disabled={guestCount >= 10}
                              onClick={() => setGuestCount(prev => Math.min(10, prev + 1))}
                              className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Child Ticket */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-gray-150 dark:border-slate-850">
                          <div className="space-y-0.5">
                            <span className="text-sm font-extrabold text-slate-850 dark:text-white block">Child Ticket</span>
                            <span className="text-xs text-slate-400 block">Age 4–12 years (40% off)</span>
                          </div>
                          
                          {/* Stepper block */}
                          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 shadow-3xs select-none">
                            <button
                              type="button"
                              disabled={childCount <= 0}
                              onClick={() => setChildCount(prev => Math.max(0, prev - 1))}
                              className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-black text-slate-850 dark:text-white text-base">
                              {childCount}
                            </span>
                            <button
                              type="button"
                              disabled={childCount >= 10}
                              onClick={() => setChildCount(prev => Math.min(10, prev + 1))}
                              className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP D: Required Traveler Details */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-gray-200 dark:border-slate-800 space-y-5 shadow-3xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[6px] h-[22px] bg-[#e3000f] rounded-sm shrink-0" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          4. Required Booking Details <span className="text-[#e3000f] font-bold">(Primary Traveler)</span><span className="text-[#e3000f] ml-1">*</span>
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Your electronic skip-the-line barcode passes will be generated and registered to the traveler specified below.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            First Name*
                          </label>
                          <input
                            type="text"
                            required
                            value={travelerFirstName}
                            onChange={(e) => setTravelerFirstName(e.target.value)}
                            placeholder="e.g. John"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            Last Name*
                          </label>
                          <input
                            type="text"
                            required
                            value={travelerLastName}
                            onChange={(e) => setTravelerLastName(e.target.value)}
                            placeholder="e.g. Doe"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            email address*
                          </label>
                          <input
                            type="email"
                            required
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="e.g. john@example.com"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            select your conuntry*
                          </label>
                          <select
                            required
                            value={travelerCountry}
                            onChange={(e) => {
                              const countryVal = e.target.value;
                              setTravelerCountry(countryVal);
                              const found = COUNTRIES.find(c => c.name === countryVal);
                              if (found) {
                                setTravelerCountryCode(found.dial);
                              }
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium cursor-pointer"
                          >
                            <option value="">Select Country</option>
                            {COUNTRIES.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            select your country code*
                          </label>
                          <select
                            required
                            value={travelerCountryCode}
                            onChange={(e) => setTravelerCountryCode(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium cursor-pointer"
                          >
                            <option value="">Select Code</option>
                            {/* De-duplicate country codes list and sort */}
                            {Array.from(new Set(COUNTRIES.map(c => c.dial)))
                              .sort((a, b) => parseInt(a.replace('+', '')) - parseInt(b.replace('+', '')))
                              .map((dial) => {
                                const list = COUNTRIES.filter(c => c.dial === dial);
                                const labels = list.map(c => c.code).join('/');
                                return (
                                  <option key={dial} value={dial}>
                                    {dial} ({labels})
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            enetr you phone number*
                          </label>
                          <input
                            type="tel"
                            required
                            value={travelerPhoneNumber}
                            onChange={(e) => setTravelerPhoneNumber(e.target.value)}
                            placeholder="e.g. 6 12345678"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            Special Requests box(Optional)
                          </label>
                          <textarea
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            placeholder="Any specific assistance requirements or general requests..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* STEP E: Additional Passengers Details (Split as requested) */}
                    {additionalPassengers.length > 0 && (
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-gray-200 dark:border-slate-800 space-y-5 shadow-3xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[6px] h-[22px] bg-[#e3000f] rounded-sm shrink-0" />
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            5. Additional Passengers Details<span className="text-[#e3000f] ml-1">*</span>
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                          Please provide the full names of the other travelers as printed on their passport or government ID.
                        </p>

                        <div className="space-y-3.5">
                          {additionalPassengers.map((p, idx) => (
                            <div key={`${p.type}-${p.index}`} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-gray-150 dark:border-slate-850/80 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-[#e3000f] uppercase tracking-wider">
                                  Traveler #{idx + 2} ({p.type} Ticket)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                    First Name*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={p.firstName}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAdditionalPassengers(prev => prev.map((item, i) => i === idx ? { ...item, firstName: val } : item));
                                    }}
                                    placeholder="e.g. Marie"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-3 py-2 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                    Last Name*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={p.lastName}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAdditionalPassengers(prev => prev.map((item, i) => i === idx ? { ...item, lastName: val } : item));
                                    }}
                                    placeholder="e.g. Curie"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-3 py-2 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                                  />
                                </div>
                                {p.type === 'Child' && (
                                  <div className="space-y-1 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                      Date of Birth* <span className="text-[10px] font-normal text-slate-400 lowercase italic">(required for child ticket, age 4-12)</span>
                                    </label>
                                    <input
                                      type="date"
                                      required
                                      value={p.dateOfBirth || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setAdditionalPassengers(prev => prev.map((item, i) => i === idx ? { ...item, dateOfBirth: val } : item));
                                      }}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] rounded-xl px-3 py-2 text-sm text-slate-850 dark:text-white outline-hidden transition-all font-medium"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column - Order Summary Panel (4 cols) */}
                  <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-200 dark:border-slate-800 p-6 shadow-sm select-none">
                      <h4 className="text-base font-black text-[#111e38] dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-850 pb-3.5 mb-4 font-mono">
                        Booking Summary
                      </h4>

                      {/* Micro-visual thumbnail & title card */}
                      <div className="flex gap-3 mb-5 border-b border-dashed border-gray-150 dark:border-slate-800 pb-4">
                        <img 
                          src={mainImage} 
                          className="w-16 h-16 object-cover rounded-xl shrink-0 border border-gray-200 dark:border-slate-850 shadow-3xs" 
                          alt="Selected Attraction" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black uppercase text-brand tracking-widest block">Secure Ticket Portal</span>
                          <h5 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight line-clamp-1">
                            {attraction.name}
                          </h5>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block line-clamp-1">
                            Package: {selectedPackage.name}
                          </span>
                        </div>
                      </div>

                      {/* Chosen specifics details block */}
                      <div className="space-y-3.5 mb-6 text-xs text-slate-700 dark:text-slate-300 font-semibold border-b border-dashed border-gray-150 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Date: {formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Entry Time: {selectedTimeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>
                            Travelers: {guestCount} Adult{guestCount > 1 ? 's' : ''}
                            {childCount > 0 && `, ${childCount} Child${childCount > 1 ? 'ren' : ''}`}
                          </span>
                        </div>
                      </div>

                      {/* Prices cost calculations */}
                      <div className="space-y-2.5 mb-6 text-xs">
                        <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                          <span>
                            {guestCount} x Adult Ticket
                          </span>
                          <span>
                            {currency.code} {((pricePerItem * guestCount) * currency.rate).toFixed(2)}
                          </span>
                        </div>
                        {childCount > 0 && (
                          <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                            <span>
                              {childCount} x Child Ticket
                            </span>
                            <span>
                              {currency.code} {((childPricePerItem * childCount) * currency.rate).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                          <span>Booking Fee</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                            {currency.code} 0.00
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                          <span>Local Taxes & VAT</span>
                          <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Included</span>
                        </div>
                      </div>

                      {/* Grand total price block */}
                      <div className="bg-[#FFF9EE] dark:bg-amber-950/10 p-4 rounded-xl border border-[#FFEEDB] dark:border-amber-900/20 mb-6 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest block">Total Price (All Inc.)</span>
                          <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                            {currency.code} {(totalPriceFloat * currency.rate).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-[#F36C21] bg-[#FFF9EE] dark:bg-amber-900/30 px-2 py-1 rounded-[4px] border border-[#FFEEDB] dark:border-amber-900/40">
                          Secure Rate
                        </span>
                      </div>

                      {/* Final Submit & Alerts */}
                      <form onSubmit={handleCreateBooking} className="space-y-4">
                        {checkoutError && (
                          <div className="p-3 bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-xl flex items-center gap-2 select-none">
                            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                            <span className="leading-tight">{checkoutError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#E03A2B] hover:bg-[#be000b] disabled:bg-slate-400 text-white text-[15px] font-bold rounded-[8px] py-3.5 border border-[#E03A2B] transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:cursor-not-allowed shadow-md"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                              <span>Completing Booking...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4.5 h-4.5 text-white/90" />
                              <span>Complete Secure Booking</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Visual trust markers typical of checkout forms */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-850 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">🛡️ SSL Encrypted</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">🎟️ Instant Pass</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <>
                {/* Two Column Layout Block */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Details, alert, accordion lists (8 columns) */}
              <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Ratings Line */}
            <div id="booking-title-section" className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-5 border-b border-gray-200/60 dark:border-slate-900 gap-4">
              <div className="space-y-2">
                {/* Micro-badges for travel product value propositions */}
                <div className="flex flex-wrap items-center gap-1.5 select-none">
                  {attraction.isPopular && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 border border-amber-500/15 dark:border-amber-500/5 px-2.5 py-0.5 rounded-full">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Bestseller
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3.5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {attraction.name}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand" />
                    <span>{attraction.location || `${attraction.city}, Europe`}</span>
                  </span>
                  {/* Removed duration and opening hours block */}
                </div>
              </div>
              
              {/* Star rating pill box stacked for high visual balance */}
              <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0 bg-slate-50/50 dark:bg-slate-900/30 p-2 sm:p-3 rounded-2xl border border-gray-150 dark:border-slate-850 md:border-none md:bg-transparent md:p-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-500/20 px-3.5 py-1.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/30 shadow-xs select-none">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                    <span className="text-sm font-black text-amber-800 dark:text-amber-400 leading-none">
                      Rating {averageRating} / 5
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand/40 dark:hover:border-brand/40 rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Link
                </button>
              </div>
            </div>

                {/* Highlights Panel */}
                <div id="highlights-section" className="space-y-4 pt-2">
                  <div className="flex items-center gap-2.5 border-l-4 border-brand pl-3 select-none">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wider leading-none uppercase">
                      Highlights
                    </h3>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 sm:p-6 rounded-3xl border border-slate-150 dark:border-slate-800">
                    <ul className="list-disc pl-5 space-y-2.5 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm leading-relaxed">
                      {highlightsList.map((item, idx) => (
                        <li key={idx} className="marker:text-[#e3000f]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Select Package Options Panel styled according to uploaded mockup layout */}
                <div id="select-package-options-section" className="space-y-4 pt-1 scroll-mt-24">
                  <div className={`p-4 sm:p-5 md:p-6 rounded-[24px] border space-y-4 transition-all duration-700 ease-in-out ${
                    highlightPackages
                      ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 ring-4 ring-slate-100 dark:ring-slate-700 shadow-xl scale-[1.01]'
                      : 'bg-[#f4f7f9] dark:bg-slate-900/60 border-[#e2e8f0] dark:border-slate-800/65 shadow-none scale-100'
                  }`}>
                    <div className="flex items-center gap-3 select-none">
                      <div className={`w-[6px] h-[22px] sm:h-[24px] bg-[#e3000f] rounded-sm shrink-0 transition-all duration-700 ${
                        highlightPackages ? 'shadow-[0_0_12px_rgba(224,58,43,0.8)] scale-y-110' : ''
                      }`} />
                      <h2 className="text-[19px] sm:text-[21px] font-bold text-[#111e38] dark:text-white tracking-tight leading-none">
                        Select Package Options
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {dynamicPackages.map((pkg, index) => {
                        const isSelected = selectedPackageId === pkg.id;
                        
                        return (
                          <div
                            key={pkg.id}
                            id={index === 0 ? "package-card-first" : `package-card-${pkg.id}`}
                            onClick={() => {
                              setSelectedPackageId(pkg.id);
                              setExpandedPackageId(pkg.id);
                            }}
                            className={`relative bg-white dark:bg-slate-900 rounded-xl transition-all duration-300 select-none outline-none scroll-mt-24 cursor-pointer ${
                              isSelected
                                ? 'border-2 border-[#e3000f] p-4 sm:p-5 shadow-sm'
                                : 'border border-[#dce6f0] dark:border-slate-800 p-4 sm:p-5 hover:border-[#c5d6e6] dark:hover:border-slate-700 hover:shadow-xs'
                            }`}
                          >

                            {isSelected ? (
                              /* ================== EXPANDED STATE (Screenshot 2) ================== */
                              <div>
                                {index === 0 && (
                                  <div className="mb-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-[#00875a] text-white px-2 py-0.5 rounded-[4px] uppercase tracking-wide">
                                      ★ MOST BOOKED
                                    </span>
                                  </div>
                                )}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div className="flex items-start gap-3">
                                    {/* Red dot custom radio button */}
                                    <div className="w-[18px] h-[18px] rounded-full bg-white border-2 border-[#e3000f] flex items-center justify-center shrink-0 mt-0.5">
                                      <div className="w-2.5 h-2.5 rounded-full bg-[#e3000f]" />
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-[15px] sm:text-base font-bold text-[#111e38] dark:text-white leading-snug pr-2">
                                        {pkg.name}
                                      </h4>
                                      
                                      {/* Clock icon with duration */}
                                      <div className="flex items-center gap-1.5 mt-2 text-[#111e38] dark:text-slate-200 text-[13px] font-medium">
                                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                                        <span>{pkg.duration}</span>
                                      </div>
                                      
                                      {/* HIDE DETAILS text link */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedPackageId(null);
                                          setSelectedPackageId('');
                                        }}
                                        className="text-[11px] font-bold text-[#e3000f] hover:text-[#be000b] uppercase tracking-wider block mt-4 text-left cursor-pointer transition-colors"
                                      >
                                        HIDE DETAILS
                                      </button>
                                    </div>
                                  </div>

                                  {/* Solid Red BOOK NOW CTA */}
                                  <div className="shrink-0 self-stretch md:self-center flex items-center justify-end">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPackageId(pkg.id);
                                        setExpandedPackageId(pkg.id);
                                        setBookingFormStep(true);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="w-full md:w-auto inline-flex px-6 py-2.5 bg-[#e3000f] hover:bg-[#be000b] text-white rounded-[8px] text-[13px] font-bold uppercase transition-all items-center justify-center shadow-sm hover:shadow active:scale-95 cursor-pointer"
                                    >
                                      BOOK NOW
                                    </button>
                                  </div>
                                </div>

                                {/* Footer block: Tickets are Non-Refundable */}
                                <div className="mt-5 pt-3.5 border-t border-[#f4f7f9] dark:border-slate-800/80 flex items-center gap-1.5 text-[13px] text-[#e3000f] select-none">
                                  <Info className="w-4 h-4 shrink-0" />
                                  <span>Tickets are Non-Refundable</span>
                                </div>
                              </div>
                            ) : (
                              /* ================== COLLAPSED STATE (Screenshot 1) ================== */
                              <div className="flex items-stretch justify-between gap-4">
                                <div className="flex-1 flex flex-col">
                                  {index === 0 && (
                                    <div className="mb-2">
                                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-[#00875a] text-white px-2 py-0.5 rounded-[4px] uppercase tracking-wide">
                                        ★ MOST BOOKED
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="text-[15px] sm:text-base font-bold text-[#111e38] dark:text-white leading-snug">
                                      {pkg.name}
                                    </h4>
                                  </div>

                                  {/* Pricing left side */}
                                  {(() => {
                                    const basePriceVal = attraction.discountPrice || attraction.price;
                                    const currentPriceRaw = basePriceVal + pkg.priceOffset;
                                    const originalPriceRaw = Math.round(currentPriceRaw / 0.85) - 0.10;
                                    return (
                                      <div className="mt-3 flex flex-col items-start leading-none">
                                        <span className="line-through decoration-[#94a3b8] text-[#94a3b8] font-medium text-[13px]">
                                          {currency.code} {(originalPriceRaw * currency.rate).toFixed(2)}
                                        </span>
                                        <div className="flex items-baseline text-[#c22015] mt-1">
                                          <span className="text-xs font-bold mr-1">{currency.code}</span>
                                          <span className="text-[22px] font-extrabold tracking-tight">
                                            {(currentPriceRaw * currency.rate).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>

                                <div className="flex flex-col justify-end items-end shrink-0 pl-2">
                                  {/* Book Now pill button */}
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPackageId(pkg.id);
                                      setExpandedPackageId(pkg.id);
                                      setBookingFormStep(true);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-2 bg-[#e3000f] hover:bg-[#be000b] text-white rounded-[8px] text-[13px] font-bold uppercase transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer flex items-center justify-center whitespace-nowrap"
                                  >
                                    Book Now
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* RIGHT COLUMN: Interactive Checkout Pane & Highlights Box */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 z-10 self-start">
                
                {/* Dynamic Interactive checkout Box in screenshot theme styling */}
                <div id="booking-checkout-box" className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm select-none">
                  
                  {/* High-Fidelity Price Section matching Screenshot 1 exactly */}
                  {(() => {
                    // Calculate original and current price cleanly
                    const originalPricePerItem = attraction.discountPrice 
                      ? (attraction.price + selectedPackage.priceOffset) 
                      : Math.round(pricePerItem / (1 - 0.44));
                    const discountPercent = Math.round(((originalPricePerItem - pricePerItem) / originalPricePerItem) * 100);
                    return (
                      <div className="flex flex-col mb-6 mt-2 select-none">
                        {/* Line 1: Starting from Original Price */}
                        <div className="text-[#888888] dark:text-slate-400 font-medium text-[13px] sm:text-sm flex items-center gap-1.5 mb-1.5">
                          <span>Starting from</span>
                          <span className="line-through decoration-[#888888] dark:decoration-slate-500 font-semibold">
                            {formatPriceScreenshotWay(originalPricePerItem)}
                          </span>
                        </div>

                        {/* Line 2: Price per Adult */}
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3.5">
                          <span className="text-[34px] sm:text-[36px] font-[1000] text-[#e3000f] tracking-tight leading-none">
                            {formatPriceScreenshotWay(pricePerItem)}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm">
                            per Person
                          </span>
                        </div>

                        {/* Line 3: Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Discount % Off badge */}
                          <div className="bg-[#FFF9EE] dark:bg-amber-950/20 text-[#F36C21] dark:text-amber-400 font-extrabold text-[11px] sm:text-xs px-2.5 py-1 rounded-[6px] border border-[#FFEEDB] dark:border-amber-900/40 shadow-3xs">
                            {discountPercent}% Off
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <form onSubmit={handleCreateBooking} className="space-y-4">
                    {/* Error Alerts */}
                    {checkoutError && (
                      <div className="p-3 bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-xl flex items-center gap-2 select-none">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{checkoutError}</span>
                      </div>
                    )}

                    {/* Action Submit Button */}
                    <button
                      id="finalize-booking-cta-btn"
                      type="button"
                      onClick={handleScrollToPackages}
                      className="w-full bg-brand hover:bg-[#be000b] text-white text-[15px] sm:text-[16px] font-bold rounded-[8px] py-3.5 border border-brand transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-md"
                    >
                      <span>Check availability</span>
                    </button>
                  </form>

                </div>

              </div>

            </div>

            {/* RELATED ATTRACTIONS SLIDER: "Customers also bought" Section */}
            {customersAlsoBought.length > 0 && (
              <div id="related-bought-attractions" className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-900 space-y-6">
                <div className="flex items-center gap-2.5 border-l-4 border-brand pl-3 select-none">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wider leading-none uppercase">
                    Customers also bought
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {customersAlsoBought.map(attr => (
                    <div id={`related-card-${attr.id}`} key={attr.id} className="h-full transform hover:scale-[1.01] transition-transform duration-300">
                      <AttractionCard 
                        attr={attr}
                        onClick={(id) => {
                          onClose();
                          if (onViewAttraction) {
                            setTimeout(() => onViewAttraction(id), 10);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS GRID: "Guest Reviews" Premium Section */}
            <div id="booking-reviews-feed" className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 select-none">
                <div className="flex items-start gap-2.5 border-l-4 border-brand pl-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wider leading-none uppercase">
                      Guest Reviews ({attraction.reviewsCount.toLocaleString()})
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-1.5">
                      Genuine feedback from verified travelers who booked this experience
                    </p>
                  </div>
                </div>
                
                {/* Write a Review triggering button */}
                <button
                  type="button"
                  onClick={() => setIsWritingReview(!isWritingReview)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    isWritingReview 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                      : 'border-2 border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand hover:text-brand'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isWritingReview ? 'Close Form' : 'Write a Review'}
                </button>
              </div>

              {/* Collapsible Write Review Form */}
              <AnimatePresence>
                {isWritingReview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-8"
                  >
                    <form 
                      onSubmit={handleAddReview}
                      className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs"
                    >
                      <h4 className="text-sm font-black uppercase tracking-widest text-brand flex items-center gap-2">
                        <span>Share Your Experience</span>
                      </h4>

                      {newReviewSuccess ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3 font-bold text-xs">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span>Review posted successfully! Your rating has been logged in real-time.</span>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Guest Name */}
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500 block mb-2">
                                Your Full Name
                              </label>
                              <input 
                                type="text"
                                required
                                placeholder="e.g. Wanderer_NL"
                                value={newReviewName}
                                onChange={(e) => setNewReviewName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold outline-hidden focus:border-brand focus:ring-1 focus:ring-brand text-slate-800 dark:text-neutral-100 placeholder-slate-400"
                              />
                            </div>

                            {/* Dynamic Rating selector */}
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500 block mb-2">
                                Rating (Select Stars)
                              </label>
                              <div className="flex items-center gap-1.5 h-10 select-none">
                                {[1, 2, 3, 4, 5].map((starIdx) => (
                                  <button
                                    key={starIdx}
                                    type="button"
                                    onClick={() => setNewReviewRating(starIdx)}
                                    className="p-1 rounded-md transition-colors hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                                  >
                                    <Star 
                                      className={`w-6 h-6 transition-all ${
                                        starIdx <= newReviewRating 
                                          ? 'text-amber-400 fill-amber-300 scale-110' 
                                          : 'text-slate-300 dark:text-slate-700'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Review Comment */}
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500 block mb-2">
                              Your Comment
                            </label>
                            <textarea 
                              required
                              rows={3}
                              placeholder="Describe your tour details, guides, entry details, or audio headsets..."
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 text-xs sm:text-sm font-semibold outline-hidden focus:border-brand focus:ring-1 focus:ring-brand text-slate-800 dark:text-neutral-100 placeholder-slate-400 resize-none"
                            />
                          </div>

                          <div className="pt-2 text-right">
                            <button
                              type="submit"
                              className="px-6 py-3 bg-brand hover:bg-[#be000b] text-white text-xs font-black uppercase tracking-widest rounded-full transition-transform active:scale-98 shadow-sm cursor-pointer"
                            >
                              Post Verified Review
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* RATINGS SUMMARY OVERVIEW DASHBOARD */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row gap-8 items-stretch select-none">
                
                {/* Total Average Card */}
                <div className="flex flex-col items-center justify-center text-center md:border-r border-slate-100 dark:border-slate-800/85 md:pr-10 lg:pr-12 shrink-0">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                    {averageRating}
                  </span>
                  
                  {/* Big Stars bar */}
                  <div className="flex items-center gap-0.5 text-amber-400 mt-3 mb-2">
                    {Array.from({ length: 5 }).map((_, rIdx) => {
                      const starVal = rIdx + 1;
                      const isHalf = starVal - 0.5 <= averageRating && starVal > averageRating;
                      const isFull = starVal <= averageRating;
                      
                      return (
                        <Star 
                          key={rIdx} 
                          className={`w-5 h-5 shrink-0 ${
                            isFull 
                              ? 'text-amber-400 fill-amber-400' 
                              : isHalf 
                                ? 'text-amber-400 fill-amber-400 opacity-70' 
                                : 'text-slate-200 dark:text-slate-850'
                          }`} 
                        />
                      );
                    })}
                  </div>
                  
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#e3000f]/90 bg-brand/10 dark:bg-brand/5 px-2.5 py-1 rounded-md mt-1.5 shadow-3xs border border-brand/10">
                    {reviewsList.length.toLocaleString()} Verified Logs
                  </span>
                </div>

                {/* Rating Distribution Bar Breakdown and Pill Filters */}
                <div className="grow flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingCounts[stars] || 0;
                      const totalCount = reviewsList.length || 1;
                      const percentage = Math.round((count / totalCount) * 100);
                      const isCurrentFilter = reviewFilter === stars;
                      
                      return (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setReviewFilter(isCurrentFilter ? 'all' : stars)}
                          className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between group cursor-pointer ${
                            isCurrentFilter 
                              ? 'bg-brand/[0.04] border-brand dark:border-brand shadow-3xs' 
                              : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-black text-slate-850 dark:text-slate-250">
                            <span className="flex items-center gap-1">
                              {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            </span>
                            <span className="font-extrabold text-brand">{count}</span>
                          </div>
                          
                          {/* Small visual bar indicator */}
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                            <div 
                              style={{ width: `${percentage}%` }}
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCurrentFilter ? 'bg-brand' : 'bg-emerald-600 group-hover:bg-brand'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Filter Pills row */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 select-none">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mr-1.5">
                      Quick View:
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        reviewFilter === 'all'
                          ? 'bg-brand text-white shadow-3xs'
                          : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      All ({reviewsList.length})
                    </button>
                    
                    {[5, 4, 3].map((stars) => {
                      const c = ratingCounts[stars] || 0;
                      return (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setReviewFilter(stars)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            reviewFilter === stars
                              ? 'bg-brand text-white shadow-3xs'
                              : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {stars} Stars ({c})
                        </button>
                      );
                    })}
                  </div>

                </div>

              </div>

              {/* REVIEW list display elements with layout transition and staggers */}
              {filteredReviews.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-3xl p-10 text-center select-none shadow-3xs">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-850 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-3.5 border border-slate-100 dark:border-slate-800">
                    <Star className="w-5 h-5 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-widest">No reviews found</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1 max-w-sm mx-auto leading-relaxed">
                    There are currently no guest ratings matching your selection score. Feel free to log a review above!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
                    {visibleReviews.map((rev, idx) => {
                      // Get initials for profile picture
                      const nameKey = rev.name || 'Anonymous';
                      const initials = nameKey.substring(0, 2).toUpperCase();
                      
                      // Assign color shades based on determinism
                      const colors = [
                        'bg-teal-500/10 text-teal-600 border-teal-500/10 dark:text-teal-400 dark:bg-teal-500/5',
                        'bg-rose-500/10 text-rose-600 border-rose-500/10 dark:text-rose-400 dark:bg-rose-500/5',
                        'bg-amber-500/10 text-amber-600 border-amber-500/10 dark:text-amber-400 dark:bg-amber-500/5',
                        'bg-blue-500/10 text-blue-600 border-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5',
                        'bg-orange-500/10 text-orange-600 border-orange-500/10 dark:text-orange-400 dark:bg-orange-500/5',
                        'bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/5'
                      ];
                      const colorIndex = Math.abs(nameKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
                      const selectedColorClass = colors[colorIndex];

                      return (
                        <div 
                          id={`review-card-${idx}`}
                          key={idx} 
                          className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800/80 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xs transition-all duration-200"
                        >
                          <div>
                            {/* Stars row + Verified pill */}
                            <div className="flex items-center justify-between gap-3 mb-3.5">
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {Array.from({ length: 5 }).map((_, rIdx) => (
                                  <Star 
                                    key={rIdx} 
                                    className={`w-4 h-4 fill-current ${rIdx < rev.rating ? 'text-amber-400' : 'text-slate-100 dark:text-slate-850'}`} 
                                  />
                                ))}
                              </div>
                              
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/15">
                                <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                                Verified Guest
                              </span>
                            </div>
                            
                            {/* Review content quotes */}
                            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-350 leading-relaxed italic mb-5 pl-1.5 border-l-2 border-slate-150 dark:border-slate-800">
                              "{rev.comment}"
                            </p>
                          </div>

                          {/* Profile and Date footer */}
                          <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100 dark:border-slate-850 select-none">
                            <div className="flex items-center gap-2.5">
                              {/* Avatar circle */}
                              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${selectedColorClass}`}>
                                {initials}
                              </div>
                              <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                {rev.name}
                              </span>
                            </div>
                            <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">{rev.date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fully responsive and solid pagination / read toggle controls */}
                  {filteredReviews.length > 4 && (
                    <div className="mt-8 text-center animate-fade-in">
                      <button
                        id="read-more-reviews-btn"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="px-6 py-3 border-2 border-slate-200 dark:border-slate-800 hover:border-brand dark:hover:border-brand rounded-full text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand transition-colors cursor-pointer inline-flex items-center gap-2 select-none"
                      >
                        {showAllReviews ? 'View Fewer Reviews' : `Read All ${filteredReviews.length} Reviews`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
          </div>
        ) : (
          
          /* BOOKING CONFIRMED RECEIPT SCREEN */
          <motion.div 
            id="receipt-success-screen"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl mx-auto p-6 md:p-10 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl shadow-lg mt-8 text-center"
          >
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/15">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">
              Thank you for your order!
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Your order is being processed and it will max 30 min to confirmed .
            </p>

            {/* Digitized boarding Pass visualization typical of travel apps */}
            <div className="bg-gray-50 dark:bg-slate-950 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 text-left relative overflow-hidden mb-8 shadow-xs">
              
              {/* Card notches represent booking slip visual details */}
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-850" />
              <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-850" />

              <div className="flex gap-4 items-center mb-5 border-b border-dashed border-gray-200 dark:border-slate-800 pb-4">
                <img src={mainImage} className="w-16 h-16 object-cover rounded-xl shrink-0 border border-gray-200 dark:border-slate-850" alt="Attraction summary ticket" referrerPolicy="no-referrer" />
                <div>
                  <span className="text-[10px] font-black uppercase text-brand tracking-widest leading-none block mb-1">Explorer Ticket Pass</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{attraction.name}</h4>
                  <div className="mt-1.5 space-y-1">
                    <span className="text-[11px] sm:text-[11.5px] font-mono font-bold text-slate-500 dark:text-slate-400 block">
                      Order Number: <span className="text-slate-800 dark:text-slate-200 font-extrabold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50">{bookingSuccess.order_number || bookingSuccess.orderId || 'OD631794549437610'}</span>
                    </span>
                    <span className="text-[11px] sm:text-[11.5px] font-mono font-bold text-slate-500 dark:text-slate-400 block">
                      PNR Number: <span className="text-slate-800 dark:text-slate-200 font-extrabold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50">{bookingSuccess.pnr_number || bookingSuccess.bookingRef || 'BKDDFLYY8XM'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-xs font-bold leading-normal">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Reservation Date</span>
                  <span className="text-[#1a1a1a] dark:text-slate-200 font-extrabold">{bookingSuccess.bookingDate || bookingDate}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Admission Time</span>
                  <span className="text-[#1a1a1a] dark:text-slate-200 font-extrabold">{selectedTimeSlot}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Primary Traveler</span>
                  <span className="text-[#1a1a1a] dark:text-slate-200 font-extrabold truncate block max-w-[150px]">{bookingSuccess.guestInfo?.name || guestName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Participants</span>
                  <span className="text-[#1a1a1a] dark:text-slate-200 font-extrabold">
                    {guestCount} Adult{guestCount > 1 ? 's' : ''}
                    {childCount > 0 && `, ${childCount} Child${childCount > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                {additionalPassengers.length > 0 && (
                  <div className="col-span-2 border-t border-dashed border-gray-200 dark:border-slate-800/60 pt-3 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Additional Passengers</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[#1a1a1a] dark:text-slate-200 font-extrabold text-[11px]">
                      {additionalPassengers.map((p, pIdx) => (
                        <div key={pIdx} className="truncate flex items-center gap-1">
                          <span>👤</span>
                          <span className="truncate">{p.firstName} {p.lastName}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-bold text-[9px] shrink-0">
                            ({p.type}{p.type === 'Child' && p.dateOfBirth ? `, DOB: ${p.dateOfBirth}` : ''})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Amount Processed</span>
                  <span className="text-brand text-sm font-black">{formatPrice(bookingSuccess.totalPrice ?? totalPriceFloat)}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Pass Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 uppercase text-[10px] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Active admission QR
                  </span>
                </div>
              </div>

              {/* Digital entry ticket barcode / QR illustration */}
              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-slate-800/80 flex flex-col items-center justify-center gap-2">
                <div className="w-24 h-24 bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_all_about_QR_codes_on_English_Wikipedia.svg" 
                    alt="Digital Boarding Pass Admission QR code" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest select-none">
                  Ticket pass UUID: {bookingSuccess.id || 'CONF-8172901-AMS'}
                </span>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                onClick={() => {
                  downloadTicketVoucher({
                    bookingId: bookingSuccess.id || 'CONF-8172901-AMS',
                    bookingRef: bookingSuccess.bookingRef || 'AMS-2910817',
                    order_number: bookingSuccess.order_number,
                    pnr_number: bookingSuccess.pnr_number,
                    attractionName: attraction.name,
                    attractionImageUrl: mainImage,
                    city: attraction.city || attraction.location || 'Europe',
                    bookingDate: bookingSuccess.bookingDate || bookingDate,
                    timeSlot: selectedTimeSlot,
                    passengerName: bookingSuccess.guestInfo?.name || guestName || 'Valued Explorer',
                    ticketsCount: guestCount + childCount,
                    totalPrice: bookingSuccess.totalPrice ?? totalPriceFloat,
                    additionalPassengers: additionalPassengers || bookingSuccess.guestInfo?.passengers,
                  });
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Ticket</span>
              </button>
              <button
                id="view-my-tickets-btn"
                onClick={() => {
                  onClose();
                  if (onNavigateToBookings) {
                    onNavigateToBookings();
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand hover:bg-[#be000b] active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                View My Tickets
              </button>
              <button
                id="continue-explore-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-slate-805 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Continue Traveling
              </button>
            </div>

          </motion.div>
        )}
      </div>

      {/* Custom Share Modal Dialog */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-150 dark:border-slate-800 overflow-hidden z-10 p-6 flex flex-col gap-5 select-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-brand" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Share Activity
                  </h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Activity Mini-Preview */}
              <div className="flex gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <img
                  src={mainImage}
                  alt={attraction.name}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200/50 dark:border-slate-800/80 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {attraction.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand" />
                    {attraction.city}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">
                      {averageRating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Copy URL Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Activity Link URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-brand text-white hover:bg-[#be000b] active:scale-95'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Share Platforms */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Quick Share
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      `Check out ${attraction.name}`
                    )}&body=${encodeURIComponent(
                      `I found this amazing activity on Secure Bookings:\n\n${attraction.name}\n${attraction.description}\n\nView here: ${shareUrl}`
                    )}`}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand transition-colors text-center"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">
                      Email
                    </span>
                  </a>

                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Planning my next adventure: ${attraction.name}! Check it out:`
                    )}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand transition-colors text-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">
                      Twitter
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out this amazing activity on Secure Bookings: ${attraction.name} - ${shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand transition-colors text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">
                      WhatsApp
                    </span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand transition-colors text-center"
                  >
                    <Compass className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">
                      Facebook
                    </span>
                  </a>
                </div>
              </div>

              {/* Secure QR Code Pass */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-150 shadow-xs flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_all_about_QR_codes_on_English_Wikipedia.svg"
                    alt="Scan to share activity link"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center">
                  Scan QR code to open on mobile
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
