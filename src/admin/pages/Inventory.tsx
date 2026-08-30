import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAdminLoader } from "../contexts/AdminLoaderContext";
import { WysiwygEditor, TabbedWysiwygEditor } from "../components/WysiwygEditor";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Copy,
  Pause,
  Play,
  X,
  Upload,
  Save,
  HelpCircle,
  TrendingUp,
  Percent,
  Users,
  DollarSign,
  Globe,
  Layers,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowUpDown,
  Compass,
  MapPin,
  Clock,
  Star,
  Image,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  ArrowLeft,
  Baby,
  Coins,
  Info,
  RotateCcw
} from "lucide-react";
import { POPULAR_ATTRACTIONS, syncCustomAttractions } from "../../data/mockData";
import { generateUniqueProductId, getDisplayProductId, registerUsedProductId } from "../../utils/productIdGenerator";
import { Attraction, Variant, VariantRule } from "../../types";
import AttractionCard from "../../components/AttractionCard";
import { GEOGRAPHY_DATA } from "../../data/geographyData";
import { CURRENCIES } from "../../contexts/SettingsContext";

const TIMEZONES = [
{ value: "Cape Verde Standard Time", label: "(UTC-01:00) Cabo Verde Is." },
  { value: "UTC-02", label: "(UTC-02:00) Coordinated Universal Time-02" },
  { value: "Pacific SA Standard Time", label: "(UTC-03:00) Santiago" },
  { value: "Argentina Standard Time", label: "(UTC-03:00) City of Buenos Aires" },
  { value: "E. South America Standard Time", label: "(UTC-03:00) Brasilia" },
  { value: "SA Eastern Standard Time", label: "(UTC-03:00) Cayenne, Fortaleza" },
  { value: "Greenland Standard Time", label: "(UTC-03:00) Greenland" },
  { value: "Montevideo Standard Time", label: "(UTC-03:00) Montevideo" },
  { value: "SA Western Standard Time", label: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan" },
  { value: "Atlantic Standard Time", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "Paraguay Standard Time", label: "(UTC-04:00) Asuncion" },
  { value: "Venezuela Standard Time", label: "(UTC-04:30) Caracas" },
  { value: "Eastern Standard Time", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "SA Pacific Standard Time", label: "(UTC-05:00) Bogota, Lima, Quito, Rio Branco" },
  { value: "Central America Standard Time", label: "(UTC-06:00) Central America" },
  { value: "Central Standard Time (Mexico)", label: "(UTC-06:00) Guadalajara, Mexico City, Monterrey" },
  { value: "Mountain Standard Time", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "Pacific Standard Time", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "Hawaiian Standard Time", label: "(UTC-10:00) Hawaii" },
  { value: "UTC-11", label: "(UTC-11:00) Coordinated Universal Time-11" },
  { value: "UTC", label: "(UTC) Coordinated Universal Time" },
  { value: "Greenwich Standard Time", label: "(UTC) Monrovia, Reykjavik" },
  { value: "GMT Standard Time", label: "(UTC) Dublin, Edinburgh, Lisbon, London" },
  { value: "Morocco Standard Time", label: "(UTC) Casablanca" },
  { value: "Central Europe Standard Time", label: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague" },
  { value: "W. Central Africa Standard Time", label: "(UTC+01:00) West Central Africa" },
  { value: "W. Europe Standard Time", label: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna" },
  { value: "Romance Standard Time", label: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris" },
  { value: "Central European Standard Time", label: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb" },
  { value: "Namibia Standard Time", label: "(UTC+01:00) Windhoek" },
  { value: "FLE Standard Time", label: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius" },
  { value: "South Africa Standard Time", label: "(UTC+02:00) Harare, Pretoria" },
  { value: "E. Europe Standard Time", label: "(UTC+02:00) E. Europe" },
  { value: "Egypt Standard Time", label: "(UTC+02:00) Cairo" },
  { value: "GTB Standard Time", label: "(UTC+02:00) Athens, Bucharest" },
  { value: "Israel Standard Time", label: "(UTC+02:00) Middle East" },
  { value: "Jordan Standard Time", label: "(UTC+02:00) Amman" },
  { value: "Middle East Standard Time", label: "(UTC+02:00) Beirut" },
  { value: "Syria Standard Time", label: "(UTC+02:00) Damascus" },
  { value: "Türkiye Standard Time", label: "(UTC+02:00) Istanbul" },
  { value: "Arab Standard Time", label: "(UTC+03:00) Kuwait, Riyadh" },
  { value: "Belarus Standard Time", label: "(UTC+03:00) Minsk" },
  { value: "E. Africa Standard Time", label: "(UTC+03:00) Nairobi" },
  { value: "Arabic Standard Time", label: "(UTC+03:00) Baghdad" },
  { value: "Russian Standard Time", label: "(UTC+03:00) Moscow, St. Petersburg, Volgograd (RTZ 2)" },
  { value: "Iran Standard Time", label: "(UTC+03:30) Tehran" },
  { value: "Caucasus Standard Time", label: "(UTC+04:00) Yerevan" },
  { value: "Azerbaijan Standard Time", label: "(UTC+04:00) Baku" },
  { value: "Georgian Standard Time", label: "(UTC+04:00) Tbilisi" },
  { value: "Mauritius Standard Time", label: "(UTC+04:00) Port Louis" },
  { value: "Arabian Standard Time", label: "(UTC+04:00) Abu Dhabi, Muscat" },
  { value: "Afghanistan Standard Time", label: "(UTC+04:30) Kabul" },
  { value: "West Asia Standard Time", label: "(UTC+05:00) Ashgabat, Tashkent" },
  { value: "Pakistan Standard Time", label: "(UTC+05:00) Islamabad, Karachi" },
  { value: "India Standard Time", label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
  { value: "Sri Lanka Standard Time", label: "(UTC+05:30) Sri Jayawardenepura" },
  { value: "Nepal Standard Time", label: "(UTC+05:45) Kathmandu" },
  { value: "Bangladesh Standard Time", label: "(UTC+06:00) Dhaka" },
  { value: "Central Asia Standard Time", label: "(UTC+06:00) Astana" },
  { value: "Myanmar Standard Time", label: "(UTC+06:30) Yangon (Rangoon)" },
  { value: "SE Asia Standard Time", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
  { value: "Singapore Standard Time", label: "(UTC+08:00) Kuala Lumpur, Singapore" },
  { value: "China Standard Time", label: "(UTC+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi" },
  { value: "Ulaanbaatar Standard Time", label: "(UTC+08:00) Ulaanbaatar" },
  { value: "Taipei Standard Time", label: "(UTC+08:00) Taipei" },
  { value: "Tokyo Standard Time", label: "(UTC+09:00) Osaka, Sapporo, Tokyo" },
  { value: "Korea Standard Time", label: "(UTC+09:00) Seoul" },
  { value: "AUS Eastern Standard Time", label: "(UTC+10:00) Canberra, Melbourne, Sydney" },
  { value: "West Pacific Standard Time", label: "(UTC+10:00) Guam, Port Moresby" },
  { value: "Central Pacific Standard Time", label: "(UTC+11:00) Solomon Is., New Caledonia" },
  { value: "Fiji Standard Time", label: "(UTC+12:00) Fiji" },
  { value: "UTC+12", label: "(UTC+12:00) Coordinated Universal Time+12" },
  { value: "New Zealand Standard Time", label: "(UTC+12:00) Auckland, Wellington" },
  { value: "Samoa Standard Time", label: "(UTC+13:00) Samoa" },
  { value: "Tonga Standard Time", label: "(UTC+13:00) Nuku'alofa" }
];

const getDefaultTimezoneAndCurrency = (cityName: string, countryName: string) => {
  const cityLower = (cityName || "").toLowerCase();
  const countryLower = (countryName || "").toLowerCase();

  let timezone = "GMT Standard Time";
  let currency = "EUR";

  if (cityLower.includes("new york") || countryLower.includes("united states") || countryLower.includes("usa")) {
    timezone = "Eastern Standard Time";
    currency = "USD";
  } else if (cityLower.includes("london") || countryLower.includes("united kingdom") || countryLower.includes("uk")) {
    timezone = "GMT Standard Time";
    currency = "GBP";
  } else if (cityLower.includes("paris") || countryLower.includes("france")) {
    timezone = "Romance Standard Time";
    currency = "EUR";
  } else if (cityLower.includes("rome") || cityLower.includes("venice") || cityLower.includes("florence") || countryLower.includes("italy")) {
    timezone = "W. Europe Standard Time";
    currency = "EUR";
  } else if (cityLower.includes("tokyo") || cityLower.includes("kyoto") || countryLower.includes("japan")) {
    timezone = "Tokyo Standard Time";
    currency = "JPY";
  } else if (cityLower.includes("dubai") || countryLower.includes("united arab emirates") || countryLower.includes("uae")) {
    timezone = "Arabian Standard Time";
    currency = "AED";
  } else if (cityLower.includes("singapore")) {
    timezone = "Singapore Standard Time";
    currency = "SGD";
  } else if (cityLower.includes("cairo") || countryLower.includes("egypt")) {
    timezone = "Egypt Standard Time";
    currency = "USD";
  } else if (countryLower.includes("australia") || cityLower.includes("sydney") || cityLower.includes("melbourne")) {
    timezone = "AUS Eastern Standard Time";
    currency = "AUD";
  } else if (countryLower.includes("india") || cityLower.includes("delhi") || cityLower.includes("mumbai") || cityLower.includes("agra")) {
    timezone = "India Standard Time";
    currency = "INR";
  }

  return { timezone, currency };
};

const getCurrencySymbol = (code: string | undefined) => {
  const found = CURRENCIES.find(c => c.code === (code || "EUR").toUpperCase());
  return found ? found.symbol : "€";
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const MONTHS_OF_YEAR = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const daysMap: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun"
};

const getDaysString = (days: string[]) => {
  if (days.length === 0) return "";
  if (days.length === 7) return "Daily";
  
  const hasWeekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].every(d => days.includes(d)) && days.length === 5;
  if (hasWeekdays) return "Mon - Fri";
  
  const hasWeekends = ["Saturday", "Sunday"].every(d => days.includes(d)) && days.length === 2;
  if (hasWeekends) return "Weekends (Sat-Sun)";

  return days.map(d => daysMap[d] || d).join(", ");
};

const getMonthsString = (months: string[]) => {
  if (months.length === 12) return "All Year";
  if (months.length === 0) return "";
  
  if (months.length > 3) {
    return `${months.length} Months`;
  }
  return months.map(m => m.substring(0, 3)).join(", ");
};

const parseOpeningHours = (hoursStr: string) => {
  const str = hoursStr || "";
  let daysPart = "";
  let timePart = "";
  
  if (str.includes("\n")) {
    const lines = str.split("\n");
    const days: string[] = [];
    const months: string[] = [];
    const dayWise: Record<string, string> = {};
    const monthWise: Record<string, string> = {};
    let firstTime = "";
    lines.forEach(line => {
      if (line.includes(":")) {
         const p = line.split(":");
         const d = p[0].trim();
         const val = p.slice(1).join(":").trim();
         if (MONTHS_OF_YEAR.includes(d) || MONTHS_OF_YEAR.some(m => m.startsWith(d))) {
            months.push(d);
            monthWise[d] = val;
         } else if (d !== "Months" && d !== "Days") {
            days.push(d);
            dayWise[d] = val;
         }
         if (!firstTime) firstTime = val;
      }
    });
    return { days, months, time: firstTime || "09:00 - 18:00", dayWise, monthWise };
  }
  
  if (str.includes(":")) {
    const parts = str.split(":");
    daysPart = parts[0].trim();
    timePart = parts.slice(1).join(":").trim();
  } else {
    daysPart = str.trim();
  }

  let days: string[] = [];
  const daysLower = daysPart.toLowerCase();
  
  if (daysLower.includes("daily")) {
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  } else if (daysLower.includes("weekdays") || daysLower === "mon - fri" || daysLower === "mon-fri" || daysLower === "monday - friday") {
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  } else if (daysLower.includes("weekends") || daysLower === "sat - sun" || daysLower === "sat-sun" || daysLower === "saturday - sunday") {
    days = ["Saturday", "Sunday"];
  } else {
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    allDays.forEach(day => {
      const short = daysMap[day].toLowerCase();
      if (daysLower.includes(day.toLowerCase()) || daysLower.includes(short)) {
        days.push(day);
      }
    });
  }
  
  return {
    days,
    months: [],
    time: timePart || "09:00 - 18:00",
    monthWise: {}
  };
};

const parseDuration = (durStr: string) => {
  const str = (durStr || "").trim().toLowerCase();
  
  if (!str) {
    return { mode: "single" as const, hours: 2, minutes: 0, hoursMax: 3, minutesMax: 0, preset: "Full Day" };
  }
  
  if (str.includes("day") || str.includes("full")) {
    return { mode: "presets" as const, preset: "Full Day", hours: 8, minutes: 0, hoursMax: 8, minutesMax: 0 };
  }

  // Check for range like "2-3 hours" or "2 - 3 hours" or "2-3h"
  const rangeRegex = /^(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(hour|hr|min|h|m)/;
  const matchRange = str.match(rangeRegex);
  if (matchRange) {
    const minVal = parseFloat(matchRange[1]);
    const maxVal = parseFloat(matchRange[2]);
    const unit = matchRange[3];
    
    if (unit.startsWith("h")) {
      const minH = Math.floor(minVal);
      const minM = Math.round((minVal - minH) * 60);
      const maxH = Math.floor(maxVal);
      const maxM = Math.round((maxVal - maxH) * 60);
      return {
        mode: "range" as const,
        hours: minH,
        minutes: minM,
        hoursMax: maxH,
        minutesMax: maxM,
        preset: "Full Day"
      };
    } else {
      return {
        mode: "range" as const,
        hours: 0,
        minutes: Math.round(minVal),
        hoursMax: 0,
        minutesMax: Math.round(maxVal),
        preset: "Full Day"
      };
    }
  }

  let hours = 0;
  let minutes = 0;
  const hPattern = str.match(/(\d+)\s*(?:hour|hr|h)/);
  const mPattern = str.match(/(\d+)\s*(?:minute|min|m)/);
  
  if (hPattern) {
    hours = parseInt(hPattern[1], 10);
  }
  if (mPattern) {
    minutes = parseInt(mPattern[1], 10);
  }
  
  if (!hPattern && !mPattern) {
    const num = parseFloat(str);
    if (!isNaN(num)) {
      if (str.includes("hour") || str.includes("h")) {
        hours = Math.floor(num);
        minutes = Math.round((num - hours) * 60);
      } else {
        minutes = Math.round(num);
      }
    }
  }

  return {
    mode: "single" as const,
    hours,
    minutes,
    hoursMax: hours + 1,
    minutesMax: minutes,
    preset: "Full Day"
  };
};

const formatDuration = (
  mode: "single" | "range" | "presets",
  hours: number,
  minutes: number,
  hoursMax: number,
  minutesMax: number,
  preset?: string
) => {
  if (mode === "presets" && preset) {
    return preset;
  }
  
  const formatSingle = (h: number, m: number) => {
    if (h > 0 && m > 0) {
      return `${h}h ${m}m`;
    } else if (h > 0) {
      return `${h} hour${h > 1 ? "s" : ""}`;
    } else if (m > 0) {
      return `${m} minute${m > 1 ? "s" : ""}`;
    }
    return "0 hours";
  };

  if (mode === "single") {
    return formatSingle(hours, minutes);
  }

  if (mode === "range") {
    if (hours > 0 || hoursMax > 0) {
      const minHStr = minutes > 0 ? `${hours}.${Math.round(minutes/6)}` : `${hours}`;
      const maxHStr = minutesMax > 0 ? `${hoursMax}.${Math.round(minutesMax/6)}` : `${hoursMax}`;
      return `${minHStr}-${maxHStr} hours`;
    } else {
      return `${minutes}-${minutesMax} minutes`;
    }
  }
  
  return "";
};

export default function Inventory() {
  const { showLoader, hideLoader } = useAdminLoader();
  const [attractions, setAttractions] = useState<Attraction[]>(() => {
    // Return live reference of POPULAR_ATTRACTIONS
    return [...POPULAR_ATTRACTIONS];
  });

  const navigate = useNavigate();
  const locationObj = useLocation();
  const { id } = useParams<{ id: string }>();

  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || "";
  });

  useEffect(() => {
    const params = new URLSearchParams(locationObj.search);
    const s = params.get('search');
    if (s !== null && s !== searchQuery) {
      setSearchQuery(s);
    }
  }, [locationObj.search]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "capacity" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const isEditRoute = locationObj.pathname.includes("/edit/");
  const isNewRoute = locationObj.pathname.includes("/new");
  const isModalOpen = isEditRoute || isNewRoute;

  // Modal state
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [activeTab, setActiveTab] = useState("Primary");

  // Form states
  const [assignedProductId, setAssignedProductId] = useState<string>("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("Europe");
  const [subRegion, setSubRegion] = useState("");
  const [country, setCountry] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [timezone, setTimezone] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  // Bulk Generator States
  const [isBulkGenOpen, setIsBulkGenOpen] = useState(false);
  const [bulkStartDate, setBulkStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bulkEndDate, setBulkEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [bulkTimeSlots, setBulkTimeSlots] = useState<string[]>(["09:00 AM", "11:00 AM", "02:00 PM"]);
  const [availableBulkTimeSlots, setAvailableBulkTimeSlots] = useState<string[]>([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
  ]);
  const [customBulkTimeSlot, setCustomBulkTimeSlot] = useState("");
  const [bulkPrice, setBulkPrice] = useState<number | "">("");
  const [bulkInventoryType, setBulkInventoryType] = useState<"custom" | "unlimited">("custom");
  const [bulkInventory, setBulkInventory] = useState<number>(50);
  const [bulkDays, setBulkDays] = useState<string[]>(DAYS_OF_WEEK);

  // Inventory Calendar States
  const [currentCalendarYear, setCurrentCalendarYear] = useState(2026);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(6); // July (0-indexed)
  const [selectedCalendarSlot, setSelectedCalendarSlot] = useState("All");
  const [selectedCalendarDays, setSelectedCalendarDays] = useState<string[]>([]);
  const [dontNeedTimeSlots, setDontNeedTimeSlots] = useState(false);
  const [calendarPriceInput, setCalendarPriceInput] = useState<number | "">("");
  const [calendarCapacityInput, setCalendarCapacityInput] = useState<number | "">("");
  const [calendarCapacityType, setCalendarCapacityType] = useState<"custom" | "unlimited">("custom");
  const [isCalendarSaved, setIsCalendarSaved] = useState(false);

  const activeVariant = useMemo(() => {
    if (editingVariantId === null) return null;
    return variants.find(v => v.id === editingVariantId) || null;
  }, [variants, editingVariantId]);

  const existingSlots = useMemo(() => {
    if (!activeVariant) return [];
    if (dontNeedTimeSlots) {
      return ["All Day"];
    }
    const slotsSet = new Set<string>();
    activeVariant.rules?.forEach(r => {
      if (r.timeSlot) slotsSet.add(r.timeSlot);
    });
    if (slotsSet.size === 0) {
      return ["09:00 AM", "11:00 AM", "02:00 PM"];
    }
    return Array.from(slotsSet).sort();
  }, [activeVariant, dontNeedTimeSlots]);

  // Sync state with active variant when selected
  useEffect(() => {
    if (editingVariantId) {
      setSelectedCalendarDays([]);
      const v = variants.find(item => item.id === editingVariantId);
      if (v) {
        const hasDontNeedTimeSlots = (v as any).dontNeedTimeSlots || (v.rules && v.rules.length > 0 && v.rules.every(r => r.timeSlot === "All Day")) || false;
        setDontNeedTimeSlots(hasDontNeedTimeSlots);
        
        if (v.rules && v.rules.length > 0) {
          const firstRuleDate = v.rules[0].date;
          const parts = firstRuleDate.split("-");
          if (parts.length === 3) {
            const yr = parseInt(parts[0], 10);
            const mo = parseInt(parts[1], 10) - 1;
            if (!isNaN(yr)) setCurrentCalendarYear(yr);
            if (!isNaN(mo)) setCurrentCalendarMonth(mo);
          }
        } else {
          setCurrentCalendarYear(2026);
          setCurrentCalendarMonth(6); // July
        }
      }
    }
  }, [editingVariantId]);

  // Geography lookup function for fallback / auto-completion of older entries
  const findGeographyHierarchy = (targetRegion: string, targetCity: string) => {
    const regData = GEOGRAPHY_DATA[targetRegion];
    if (regData) {
      for (const subReg of Object.keys(regData)) {
        for (const cntry of Object.keys(regData[subReg])) {
          for (const st of Object.keys(regData[subReg][cntry])) {
            if (regData[subReg][cntry][st].includes(targetCity)) {
              return { subRegion: subReg, country: cntry, state: st };
            }
          }
        }
      }
    }
    // Fallback if not found: find just by city anywhere in database
    for (const reg of Object.keys(GEOGRAPHY_DATA)) {
      for (const subReg of Object.keys(GEOGRAPHY_DATA[reg])) {
        for (const cntry of Object.keys(GEOGRAPHY_DATA[reg][subReg])) {
          for (const st of Object.keys(GEOGRAPHY_DATA[reg][subReg][cntry])) {
            if (GEOGRAPHY_DATA[reg][subReg][cntry][st].includes(targetCity)) {
              return { region: reg, subRegion: subReg, country: cntry, state: st };
            }
          }
        }
      }
    }
    return null;
  };

  const getCountriesForRegion = (r: string): string[] => {
    const regData = GEOGRAPHY_DATA[r] || {};
    const countrySet = new Set<string>();
    for (const subReg of Object.keys(regData)) {
      for (const cntry of Object.keys(regData[subReg] || {})) {
        countrySet.add(cntry);
      }
    }
    return Array.from(countrySet).sort();
  };

  const getCitiesForCountry = (r: string, c: string): string[] => {
    const regData = GEOGRAPHY_DATA[r] || {};
    const citySet = new Set<string>();
    for (const subReg of Object.keys(regData)) {
      const countryData = regData[subReg]?.[c];
      if (countryData) {
        for (const st of Object.keys(countryData)) {
          const cities = countryData[st] || [];
          for (const ct of cities) {
            citySet.add(ct);
          }
        }
      }
    }
    return Array.from(citySet).sort();
  };

  const getSubRegionAndState = (r: string, c: string, ct: string) => {
    const regData = GEOGRAPHY_DATA[r];
    if (regData) {
      for (const subReg of Object.keys(regData)) {
        if (regData[subReg][c]) {
          for (const st of Object.keys(regData[subReg][c])) {
            if (regData[subReg][c][st].includes(ct)) {
              return { subRegion: subReg, state: st };
            }
          }
        }
      }
    }
    return { subRegion: "", state: "" };
  };

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const countries = getCountriesForRegion(newRegion);
    const firstCountry = countries[0] || "";
    setCountry(firstCountry);

    const cities = firstCountry ? getCitiesForCountry(newRegion, firstCountry) : [];
    const firstCity = cities[0] || "";
    setCity(firstCity);

    if (newRegion && firstCountry && firstCity) {
      const { subRegion: sub, state: st } = getSubRegionAndState(newRegion, firstCountry, firstCity);
      setSubRegion(sub);
      setState(st);
    } else {
      setSubRegion("");
      setState("");
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const cities = getCitiesForCountry(region, newCountry);
    const firstCity = cities[0] || "";
    setCity(firstCity);

    if (region && newCountry && firstCity) {
      const { subRegion: sub, state: st } = getSubRegionAndState(region, newCountry, firstCity);
      setSubRegion(sub);
      setState(st);
    } else {
      setSubRegion("");
      setState("");
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (region && country && newCity) {
      const { subRegion: sub, state: st } = getSubRegionAndState(region, country, newCity);
      setSubRegion(sub);
      setState(st);
    } else {
      setSubRegion("");
      setState("");
    }
  };
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [discountPrice, setDiscountPrice] = useState<number | string>("");
  const [capacity, setCapacity] = useState<number | string>(500);
  const [capacityType, setCapacityType] = useState<"custom" | "no-limit">("custom");
  const [supplier, setSupplier] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [digitalHours, setDigitalHours] = useState<number | "">("");
  const [digitalMinutes, setDigitalMinutes] = useState<number | "">("");
  const [openingHours, setOpeningHours] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [fastTrack, setFastTrack] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [monthWiseHours, setMonthWiseHours] = useState<Record<string, string>>({});
  const [isMonthsDropdownOpen, setIsMonthsDropdownOpen] = useState(false);
  const [timeRangeInput, setTimeRangeInput] = useState("09:00 - 18:00");
  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
  const [isOpeningHoursDropdownOpen, setIsOpeningHoursDropdownOpen] = useState(false);
  const [openTimeInput, setOpenTimeInput] = useState("09:00");
  const [closeTimeInput, setCloseTimeInput] = useState("18:00");
  const [leadTimeEnabled, setLeadTimeEnabled] = useState(false);
  const [dayWiseHours, setDayWiseHours] = useState<Record<string, string>>({});
  const [leadTimeValue, setLeadTimeValue] = useState<number>(24);
  const [leadTimeUnit, setLeadTimeUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [allowLastMinuteBooking, setAllowLastMinuteBooking] = useState(false);

  useEffect(() => {
    if (isEditRoute && id) {
      const attr = attractions.find(a => a.id === id);
      if (attr) {
        setEditingAttraction(attr);
        setActiveTab("Primary");
        setName(attr.name || "");
        setLocation(attr.location || "");

        // cascade geographical fields
        if (attr.region && attr.country && attr.city) {
          setRegion(attr.region);
          setCountry(attr.country);
          setCity(attr.city);
          const { subRegion: sub, state: st } = getSubRegionAndState(attr.region, attr.country, attr.city);
          setSubRegion(sub);
          setState(st);
        } else {
          const matched = findGeographyHierarchy(attr.region || "Europe", attr.city || "");
          if (matched) {
            setRegion(matched.region || attr.region || "Europe");
            setSubRegion(matched.subRegion || "");
            setCountry(matched.country || "");
            setState(matched.state || "");
            setCity(attr.city || "");
          } else {
            const fallbackRegion = attr.region || "Europe";
            setRegion(fallbackRegion);
            const countries = getCountriesForRegion(fallbackRegion);
            const defaultCountry = countries[0] || "";
            setCountry(defaultCountry);
            const cities = defaultCountry ? getCitiesForCountry(fallbackRegion, defaultCountry) : [];
            const defaultCity = cities[0] || "";
            setCity(defaultCity);
            const { subRegion: sub, state: st } = getSubRegionAndState(fallbackRegion, defaultCountry, defaultCity);
            setSubRegion(sub);
            setState(st);
          }
        }

        const fallbackGeo = getDefaultTimezoneAndCurrency(attr.city || "", attr.country || "");
        setTimezone(attr.timezone || fallbackGeo.timezone);
        setCurrencyCode(attr.currency || fallbackGeo.currency);

        setCategory(attr.category || "");
        setAssignedProductId(attr.productId || getDisplayProductId(attr));
        setPrice(attr.price ?? "");
        setDiscountPrice(attr.discountPrice ?? "");
        setCapacity(attr.maxGroupSize || 500);
        setCapacityType(attr.noCapacityLimit ? "no-limit" : "custom");
        setSupplier(attr.provider || "Local Operator");
        setImageUrl(attr.imageUrl || "");
        setDescription(attr.description || "");
        const dur = attr.duration || "";
        setDuration(dur);
        const hours = attr.openingHours || "";
        setOpeningHours(hours);
        const parsed = parseOpeningHours(hours);
        setSelectedDays(attr.operatingDays && attr.operatingDays.length > 0 ? attr.operatingDays : parsed.days);

        const attrMonths = (attr as any).operatingMonths;
        setSelectedMonths(attrMonths && attrMonths.length > 0 ? attrMonths : parsed.months);

        setTimeRangeInput(parsed.time);

        if (parsed.dayWise) {
          setDayWiseHours(parsed.dayWise);
        } else {
          const defaultDayWise: Record<string, string> = {};
          const parsedDays = attr.operatingDays && attr.operatingDays.length > 0 ? attr.operatingDays : parsed.days;
          parsedDays.forEach(d => {
            defaultDayWise[d] = parsed.time;
          });
          setDayWiseHours(defaultDayWise);
        }

        if (parsed.monthWise && Object.keys(parsed.monthWise).length > 0) {
          setMonthWiseHours(parsed.monthWise);
        } else {
          const defaultMonthWise: Record<string, string> = {};
          const parsedMonths = attrMonths && attrMonths.length > 0 ? attrMonths : parsed.months;
          parsedMonths.forEach((m: string) => {
            defaultMonthWise[m] = parsed.time;
          });
          setMonthWiseHours(defaultMonthWise);
        }

        setIsDaysDropdownOpen(false);
        setHighlightsInput((attr.highlights || []).join("\n"));
        setIncludedInput((attr.included || []).join("\n"));
        setIsPopular(attr.isPopular ?? false);
        setFastTrack(attr.fastTrack ?? false);
        setIsAvailable(attr.isAvailable !== false);
        setLeadTimeEnabled(attr.leadTimeEnabled ?? false);
        setLeadTimeValue(attr.leadTimeValue ?? 24);
        setLeadTimeUnit(attr.leadTimeUnit ?? 'hours');
        setAllowLastMinuteBooking(attr.allowLastMinuteBooking ?? false);
        const urls = attr.galleryUrls && attr.galleryUrls.length > 0 
          ? attr.galleryUrls 
          : (attr.imageUrl ? [attr.imageUrl] : []);
        setGalleryUrls(urls);
        setIsReordering(false);

        if (attr.variants && attr.variants.length > 0) {
          setVariants(attr.variants);
        } else {
          const cleanName = (attr.name || "").includes(':') 
            ? (attr.name || "").split(':')[0] 
            : (attr.name || "").replace(/Entrance Tickets|Entrance Ticket|Tickets|Ticket/gi, '').trim();

          const basePriceVal = attr.price || 20;

          const generated: Variant[] = [
            {
              id: `var-general-${Date.now()}-1`,
              name: "General Admission Entrance Ticket",
              agePolicy: "All Ages",
              notes: "Timed entry slots guarantee immediate access without waiting.",
              priceIncludes: `Admission to ${cleanName} permanent collection.`,
              otherDetails: "Instant mobile voucher confirmation.",
              rules: [
                {
                  id: `rule-gen-${Date.now()}-1`,
                  date: new Date().toISOString().split('T')[0],
                  timeSlot: "11:00 AM",
                  price: basePriceVal,
                  inventory: 150
                }
              ]
            },
            {
              id: `var-nonstop-${Date.now()}-2`,
              name: "Non-stop 2-Day Explorer Pass",
              agePolicy: "All Ages",
              notes: "Experience two days of unrestricted exploration.",
              priceIncludes: "Fast-track admission past standard queues.",
              otherDetails: "Flexible 48 Hours validity.",
              rules: [
                {
                  id: `rule-ns-${Date.now()}-2`,
                  date: new Date().toISOString().split('T')[0],
                  timeSlot: "11:00 AM",
                  price: Math.round(basePriceVal * 1.6),
                  inventory: 100
                }
              ]
            },
            {
              id: `var-7day-${Date.now()}-3`,
              name: "2-Day Explorer Pass (Valid 7 Days)",
              agePolicy: "All Ages",
              notes: "Perfect for paced discovery of temporary galleries.",
              priceIncludes: "Visit twice at any time within a 7-day period.",
              otherDetails: "7 Days Validity from first use.",
              rules: [
                {
                  id: `rule-7d-${Date.now()}-3`,
                  date: new Date().toISOString().split('T')[0],
                  timeSlot: "11:00 AM",
                  price: Math.round(basePriceVal * 1.45),
                  inventory: 80
                }
              ]
            }
          ];
          setVariants(generated);
        }
      }
    } else if (isNewRoute) {
      setEditingAttraction(null);
      setActiveTab("Primary");
      setAssignedProductId(generateUniqueProductId(attractions));
      setName("");
      setLocation("");
      
      const defaultRegion = "Europe";
      setRegion(defaultRegion);
      const countries = getCountriesForRegion(defaultRegion);
      const defaultCountry = countries[0] || "";
      setCountry(defaultCountry);
      const cities = defaultCountry ? getCitiesForCountry(defaultRegion, defaultCountry) : [];
      const defaultCity = cities[0] || "";
      setCity(defaultCity);

      const { subRegion: sub, state: defaultState } = getSubRegionAndState(defaultRegion, defaultCountry, defaultCity);
      setSubRegion(sub);
      setState(defaultState);

      const geoDefaults = getDefaultTimezoneAndCurrency(defaultCity, defaultCountry);
      setTimezone(geoDefaults.timezone);
      setCurrencyCode(geoDefaults.currency);

      setCategory("Museum");
      setPrice("");
      setDiscountPrice("");
      setCapacity(500);
      setCapacityType("custom");
      setSupplier("Local Operator");
      setImageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80");
      setDescription("");
      setDuration("2-3 hours");
      setOpeningHours("Daily: 09:00 - 18:00");
      const initDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      setSelectedDays(initDays);
      const defaultDayWise: Record<string, string> = {};
      initDays.forEach(d => defaultDayWise[d] = "09:00 - 18:00");
      setDayWiseHours(defaultDayWise);
      setSelectedMonths([]);
      setMonthWiseHours({});
      setTimeRangeInput("09:00 - 18:00");
      setIsDaysDropdownOpen(false);
      setHighlightsInput("");
      setIncludedInput("");
      setIsPopular(false);
      setFastTrack(false);
      setIsAvailable(true);
      setLeadTimeEnabled(false);
      setLeadTimeValue(24);
      setLeadTimeUnit('hours');
      setAllowLastMinuteBooking(false);
      setGalleryUrls([]);
      setIsReordering(false);
      setVariants([]);
    }
  }, [id, isEditRoute, isNewRoute, attractions]);

  const updateGlobalHoursString = (months: string[], days: string[], mHours: Record<string, string>, dHours: Record<string, string>) => {
    const parts = [];
    months.forEach(m => parts.push(`${m}: ${mHours[m] || "09:00 - 18:00"}`));
    days.forEach(d => parts.push(`${d}: ${dHours[d] || "09:00 - 18:00"}`));
    setOpeningHours(parts.join("\n"));
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      let updated: string[];
      if (prev.includes(day)) {
        updated = prev.filter(d => d !== day);
      } else {
        updated = [...prev, day];
      }
      
      const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        .filter(d => updated.includes(d));
      
      updateGlobalHoursString(selectedMonths, orderedDays, monthWiseHours, dayWiseHours);
      return orderedDays;
    });
  };

  const handleMonthToggle = (month: string) => {
    setSelectedMonths(prev => {
      let updated: string[];
      if (prev.includes(month)) {
        updated = prev.filter(m => m !== month);
      } else {
        updated = [...prev, month];
      }
      const orderedMonths = MONTHS_OF_YEAR.filter(m => updated.includes(m));
      updateGlobalHoursString(orderedMonths, selectedDays, monthWiseHours, dayWiseHours);
      return orderedMonths;
    });
  };

  const handleSelectPresetMonths = (presetType: "all" | "summer" | "winter" | "none") => {
    let updated: string[] = [];
    if (presetType === "all") {
      updated = [...MONTHS_OF_YEAR];
    } else if (presetType === "summer") {
      updated = ["June", "July", "August"];
    } else if (presetType === "winter") {
      updated = ["December", "January", "February"];
    }
    setSelectedMonths(updated);
    updateGlobalHoursString(updated, selectedDays, monthWiseHours, dayWiseHours);
  };

  const handleTimeRangeChange = (newVal: string) => {
    setTimeRangeInput(newVal);
    updateGlobalHoursString(selectedMonths, selectedDays, monthWiseHours, dayWiseHours);
  };

  const handleSelectPresetDays = (presetType: "all" | "weekdays" | "weekends" | "none") => {
    let updated: string[] = [];
    if (presetType === "all") {
      updated = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    } else if (presetType === "weekdays") {
      updated = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    } else if (presetType === "weekends") {
      updated = ["Saturday", "Sunday"];
    }
    
    setSelectedDays(updated);
    updateGlobalHoursString(selectedMonths, updated, monthWiseHours, dayWiseHours);
  };

  const handleAddUrlToGallery = () => {
    if (!newUrlInput.trim()) return;
    const url = newUrlInput.trim();
    setGalleryUrls((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
    if (!imageUrl || imageUrl.includes("unsplash.com")) {
      setImageUrl(url);
    }
    setNewUrlInput("");
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const newUrl = reader.result;
          setGalleryUrls((prev) => [...prev, newUrl]);
          if (!imageUrl || imageUrl.includes("unsplash.com")) {
            setImageUrl(newUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    setGalleryUrls((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveRight = (index: number) => {
    if (index === galleryUrls.length - 1) return;
    setGalleryUrls((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const deleteGalleryItem = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Extract statistics in real-time
  const stats = useMemo(() => {
    const total = attractions.length;
    const avgPrice = total > 0 ? attractions.reduce((acc, curr) => acc + curr.price, 0) / total : 0;
    const promotions = attractions.filter(a => a.discountPrice !== undefined && a.discountPrice > 0).length;
    const lowCapacity = attractions.filter(a => !a.noCapacityLimit && (a.maxGroupSize || 500) < 150).length;

    return {
      total,
      avgPrice,
      promotions,
      lowCapacity
    };
  }, [attractions]);

  // Extract all categories dynamically for filter options
  const categories = useMemo(() => {
    const cats = new Set(attractions.map((a) => a.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [attractions]);

  // All unique regions dynamically
  const regions = useMemo(() => {
    const regs = new Set(attractions.map((a) => a.region).filter(Boolean));
    return ["All", ...Array.from(regs)];
  }, [attractions]);

  // All unique locations (cities) dynamically
  const locations = useMemo(() => {
    const locs = new Set(attractions.map((a) => a.city).filter(Boolean));
    return ["All", ...Array.from(locs)];
  }, [attractions]);

  // Preset popular categories for easy selection
  const categoryPresets = ["Museum", "Landmark", "Cruise", "Architecture", "Food & Drink", "Adventure", "Day Tour", "Nature"];

  // Handle opening modal for adding new activity
  const handleAddClick = () => {
    navigate("/inventory/new");
  };

  // Handle opening modal for editing an activity
  const handleEditClick = (attr: Attraction) => {
    navigate(`/inventory/edit/${attr.id}`);
  };

  // Handle delete operation
  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this attraction? This will instantly sync with the main website catalogue.")) {
      const itemToDelete = attractions.find((a) => a.id === id);
      if (itemToDelete) {
        registerUsedProductId(itemToDelete.id);
        if (itemToDelete.productId) registerUsedProductId(itemToDelete.productId);
        registerUsedProductId(getDisplayProductId(itemToDelete));
      }
      const updated = attractions.filter((a) => a.id !== id);
      setAttractions(updated);
      syncCustomAttractions(updated);
    }
  };

  // Toggle available/unavailable status
  const handleToggleAvailability = (id: string) => {
    const updatedList = attractions.map((a) => {
      if (a.id === id) {
        return { ...a, isAvailable: a.isAvailable === false ? true : false };
      }
      return a;
    });
    setAttractions(updatedList);
    syncCustomAttractions(updatedList);
  };

  // Handle file import to base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset image URLs picker
  const handlePresetImageSelect = (url: string) => {
    setImageUrl(url);
    setGalleryUrls((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  // Handle saving changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Activity Name is required");
    if (!city.trim()) return alert("City is required");
    if (!price || Number(price) <= 0) return alert("Valid original price is required");
    if (!imageUrl.trim()) return alert("Image URL or Uploaded image is required");

    setShowSaveConfirm(true);
  };

  const executeSave = async () => {
    showLoader();
    await new Promise(resolve => setTimeout(resolve, 600));
    const highlights = highlightsInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const included = includedInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const finalProductId = editingAttraction
      ? (editingAttraction.productId || getDisplayProductId(editingAttraction))
      : (assignedProductId || generateUniqueProductId(attractions));

    registerUsedProductId(finalProductId);

    const attractionData: Attraction = {
      id: finalProductId,
      productId: finalProductId,
      name: name.trim(),
      location: location.trim() || `${city.trim()}, ${region}`,
      city: city.trim(),
      region,
      subRegion,
      country,
      state,
      category: category.trim() || "Activity",
      rating: editingAttraction ? editingAttraction.rating : 4.8,
      reviewsCount: editingAttraction ? editingAttraction.reviewsCount : 12,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      imageUrl: imageUrl.trim(),
      isPopular,
      fastTrack,
      isAvailable,
      description: description.trim(),
      highlights,
      included,
      duration: duration.trim() || "Flexible",
      openingHours: openingHours.trim() || "Daily",
      operatingDays: selectedDays,
      operatingMonths: selectedMonths,
      maxGroupSize: capacityType === "no-limit" ? undefined : Number(capacity),
      noCapacityLimit: capacityType === "no-limit",
      provider: supplier.trim() || "Local Operator",
      timezone: timezone.trim() || "GMT Standard Time",
      currency: currencyCode.trim() || "EUR",
      leadTimeEnabled,
      leadTimeValue: Number(leadTimeValue),
      leadTimeUnit,
      allowLastMinuteBooking,
      variants,
      galleryUrls,
    };

    let updatedList: Attraction[];
    if (editingAttraction) {
      updatedList = attractions.map((a) => (a.id === editingAttraction.id ? attractionData : a));
    } else {
      updatedList = [attractionData, ...attractions];
    }

    setAttractions(updatedList);
    syncCustomAttractions(updatedList);
    setShowSaveConfirm(false);
    hideLoader();
    navigate("/inventory");
  };

  // Change sort configuration
  const handleSort = (field: "name" | "price" | "capacity" | "rating") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter & sort list
  const filteredAndSortedAttractions = useMemo(() => {
    let result = attractions.filter((attr) => {
      const matchesSearch =
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDisplayProductId(attr).toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attr.provider || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || attr.category === selectedCategory;
      const matchesRegion = selectedRegion === "All" || attr.region === selectedRegion;
      const matchesLocation = selectedLocation === "All" || attr.city === selectedLocation;

      return matchesSearch && matchesCategory && matchesRegion && matchesLocation;
    });

    // Sort result
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        const actualA = a.discountPrice || a.price;
        const actualB = b.discountPrice || b.price;
        comparison = actualA - actualB;
      } else if (sortBy === "capacity") {
        const capA = a.noCapacityLimit ? Infinity : (a.maxGroupSize || 500);
        const capB = b.noCapacityLimit ? Infinity : (b.maxGroupSize || 500);
        comparison = capA - capB;
      } else if (sortBy === "rating") {
        comparison = (a.rating || 0) - (b.rating || 0);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [attractions, searchQuery, selectedCategory, selectedRegion, selectedLocation, sortBy, sortOrder]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedRegion, selectedLocation, sortBy, sortOrder]);

  // Derived Pagination
  const totalPages = Math.ceil(filteredAndSortedAttractions.length / itemsPerPage);
  const paginatedAttractions = filteredAndSortedAttractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const inventoryTable = useMemo(() => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
      {/* Advanced Filters Toolbar */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] transition-colors text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-3 mr-1">
              <Layers className="w-4 h-4 text-slate-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer hover:text-[#5fa6d9] transition-colors"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-[#5fa6d9] cursor-pointer"
            >
              <option value="All">All Cities</option>
              {locations.filter(l => l !== "All").map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-[#5fa6d9] cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {(selectedCategory !== "All" || selectedRegion !== "All" || selectedLocation !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedRegion("All");
                  setSelectedLocation("All");
                  setSearchQuery("");
                }}
                className="text-sm font-semibold text-[#5fa6d9] hover:text-[#4b95cc] transition-colors px-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Real-Time Catalogue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1000px] table-fixed">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1.5">
                  Activity & ID
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors" onClick={() => handleSort("price")}>
                <div className="flex items-center gap-1.5">
                  Price Configuration
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="px-6 py-4">Availability</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
            {filteredAndSortedAttractions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 bg-slate-50/20 dark:bg-slate-950/10">
                  <div className="max-w-md mx-auto space-y-3">
                    <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
                    <p className="text-base font-black text-slate-800 dark:text-white">No Activities Match Filters</p>
                    <p className="text-xs text-slate-400">
                      Try clearing or relaxing your search query and filters to review other operational inventory items.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAttractions.map((attr) => {
                const hasDiscount = attr.discountPrice !== undefined && attr.discountPrice > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((attr.price - attr.discountPrice!) / attr.price) * 100)
                  : 0;

                return (
                  <tr key={attr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Name / ID / Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 flex-shrink-0 group">
                          <img
                            src={attr.imageUrl}
                            alt={attr.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          {hasDiscount && (
                            <div className="absolute top-0 left-0 bg-emerald-500 text-white font-black text-[8px] px-1 py-0.5 rounded-br-md">
                              DEAL
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 dark:text-white font-black text-sm truncate" title={attr.name}>
                            {attr.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded">
                              ID: {getDisplayProductId(attr)}
                            </span>
                            <span className="flex items-center text-[10px] text-amber-500 font-bold gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                              {attr.rating || 4.8}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location details */}
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <p className="text-slate-900 dark:text-slate-200 font-bold truncate">{attr.city}</p>
                        <p className="text-slate-400 font-medium truncate text-[11px]">{attr.region}</p>
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-4">
                      <span className="inline-block whitespace-nowrap bg-[#f0f7fc] dark:bg-[#102738]/30 text-[#5fa6d9] dark:text-[#5fa6d9] text-[11px] font-bold px-3 py-1 rounded-md border border-[#e0f0fa]/50 dark:border-[#1e4663]/30">
                        {attr.category}
                      </span>
                    </td>

                    {/* Price configurations with smart badges */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        {hasDiscount ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm font-mono">
                                {(attr.currency || "EUR").toUpperCase()} {attr.discountPrice?.toFixed(2)}
                              </span>
                              <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded">
                                -{discountPercent}%
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-medium line-through font-mono">
                              Reg: {(attr.currency || "EUR").toUpperCase()} {attr.price.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-900 dark:text-white font-black text-sm font-mono">
                            {(attr.currency || "EUR").toUpperCase()} {attr.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Availability toggle switch */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 select-none">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(attr.id)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            attr.isAvailable !== false
                              ? "bg-[#5fa6d9]"
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}
                          aria-label={`Toggle availability for ${attr.name}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              attr.isAvailable !== false ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className={`text-[11px] font-black uppercase tracking-wider ${attr.isAvailable !== false ? "text-[#5fa6d9]" : "text-slate-400"}`}>
                          {attr.isAvailable !== false ? "AVAILABLE" : "UNAVAILABLE"}
                        </span>
                      </div>
                    </td>

                    {/* Supplier brand */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold" title={attr.provider}>
                        {attr.provider || "Local Operator"}
                      </p>
                    </td>

                    {/* Action Tools */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(attr)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors group"
                          title="Edit Activity"
                        >
                          <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(attr.id)}
                          className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedAttractions.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900 dark:text-white">{filteredAndSortedAttractions.length}</span> activities
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {(() => {
                const pages: (number | string)[] = [];
                const maxButtons = 5;
                if (totalPages <= maxButtons) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push(1);
                  let start = Math.max(2, currentPage - 1);
                  let end = Math.min(totalPages - 1, currentPage + 1);
                  
                  if (currentPage <= 2) {
                    end = 4;
                  } else if (currentPage >= totalPages - 1) {
                    start = totalPages - 3;
                  }
                  
                  if (start > 2) {
                    pages.push("...");
                  }
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  if (end < totalPages - 1) {
                    pages.push("...");
                  }
                  pages.push(totalPages);
                }
                
                return pages.map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-xs font-bold text-slate-400 dark:text-slate-600 select-none"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  const isPageActive = page === currentPage;
                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[32px] h-8 px-2.5 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                        isPageActive
                          ? "bg-[#5fa6d9] text-white shadow-sm shadow-[#5fa6d9]/15"
                          : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  );
                });
              })()}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  ), [
    paginatedAttractions, 
    searchQuery, 
    selectedCategory, 
    selectedRegion, 
    selectedLocation, 
    sortBy, 
    sortOrder, 
    currentPage, 
    itemsPerPage, 
    totalPages, 
    filteredAndSortedAttractions.length,
    categories,
    regions,
    locations
  ]);

  const selectedCurrencyObj = CURRENCIES.find(c => c.code === currencyCode) || { symbol: "€", code: "EUR" };

  const renderVariantEditor = () => {
    if (editingVariantId === null) return null;
    const activeVariant = variants.find(v => v.id === editingVariantId);
    if (!activeVariant) return null;

    return (
      <div className="space-y-6 animate-in fade-in duration-200 text-left">
        {/* Header/Controls Row */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingVariantId(null)}
              className="p-2 bg-[#5fa6d9]/10 text-[#5fa6d9] hover:bg-[#5fa6d9]/20 rounded-lg transition-colors cursor-pointer"
              title="Back to Variants"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#5fa6d9]/15 text-[#5fa6d9] text-[9px] font-black tracking-wider uppercase rounded">Variant Editor</span>
                <h4 className="font-bold text-[14px] text-slate-900 dark:text-white">
                  Editing Variant: {activeVariant.name || "Untitled"}
                </h4>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditingVariantId(null)}
            className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Done Editing
          </button>
        </div>

        <div className="space-y-8">
            {/* Primary Attributes Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-[#5fa6d9] tracking-wider border-b border-slate-100 dark:border-slate-800/60 pb-1">
                Primary Configuration
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Variant Name */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeVariant.name}
                    onChange={(e) => {
                      const updated = variants.map(item => item.id === activeVariant.id ? { ...item, name: e.target.value } : item);
                      setVariants(updated);
                    }}
                    placeholder="Variant Name (e.g. VIP Guided Tour)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Base Price ({selectedCurrencyObj.code})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{selectedCurrencyObj.symbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={activeVariant.basePrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? undefined : Number(e.target.value);
                        const updated = variants.map(item => item.id === activeVariant.id ? { ...item, basePrice: val } : item);
                        setVariants(updated);
                      }}
                      placeholder="Inherit from Product"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-7 pr-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={activeVariant.duration || ""}
                    onChange={(e) => {
                      const updated = variants.map(item => item.id === activeVariant.id ? { ...item, duration: e.target.value } : item);
                      setVariants(updated);
                    }}
                    placeholder="e.g. 2 Hours"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={activeVariant.language || ""}
                    onChange={(e) => {
                      const updated = variants.map(item => item.id === activeVariant.id ? { ...item, language: e.target.value } : item);
                      setVariants(updated);
                    }}
                    placeholder="e.g. English, French"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                  />
                </div>

                {/* Transfer */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Transfer / Pickup
                  </label>
                  <input
                    type="text"
                    value={activeVariant.transfer || ""}
                    onChange={(e) => {
                      const updated = variants.map(item => item.id === activeVariant.id ? { ...item, transfer: e.target.value } : item);
                      setVariants(updated);
                    }}
                    placeholder="e.g. No, Yes (Hotel Pickup available)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                  />
                </div>

                {/* Ticketed */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Ticket Generation
                  </label>
                  <select
                    value={activeVariant.isTicketed !== false ? "true" : "false"}
                    onChange={(e) => {
                      const val = e.target.value === "true";
                      const updated = variants.map(item => item.id === activeVariant.id ? { ...item, isTicketed: val } : item);
                      setVariants(updated);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="true">Ticketed (Generates entrance passes)</option>
                    <option value="false">Not Ticketed (Manual voucher validation)</option>
                  </select>
                </div>

                {/* Single Rich Content Box for Variant Details & Policies */}
                <div className="col-span-1 md:col-span-2">
                  <WysiwygEditor
                    label="Package Details, Policies & Exclusions"
                    value={activeVariant.notes || ""}
                    onChange={(val) => {
                      const updated = variants.map(item => 
                        item.id === activeVariant.id 
                          ? { 
                              ...item, 
                              notes: val,
                              agePolicy: "",
                              priceIncludes: "",
                              otherDetails: ""
                            } 
                          : item
                      );
                      setVariants(updated);
                    }}
                    placeholder="Provide all package details, age policy, inclusions, and other specifications here using the rich formatting tools."
                  />
                </div>
              </div>
            </div>

            {/* Rules Section: Date and Timeslot Rules */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              {/* Calendar Container */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md">
                {/* Header Row */}
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#5fa6d9]" />
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Inventory Calendar</h3>
                  </div>
                  
                  {/* Save Changes Button with Status */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {isCalendarSaved && (
                      <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 animate-pulse">
                        <Check className="w-3.5 h-3.5" /> All Changes Synced!
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCalendarSaved(true);
                        setTimeout(() => setIsCalendarSaved(false), 2000);
                        alert("Calendar inventory and pricing settings successfully saved.");
                      }}
                      className="bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#5fa6d9]/10 active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>

                {/* Sub-Header / Filters Row */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Don't Need Time Slots Checkbox */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={dontNeedTimeSlots}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setDontNeedTimeSlots(val);
                          
                          // Sync on the variant object directly to persist
                          const updated = variants.map(item => 
                            item.id === activeVariant.id ? { ...item, dontNeedTimeSlots: val } : item
                          );
                          setVariants(updated);

                          // If checked, turn all existing rule timeslots to "All Day"
                          if (val) {
                            const updatedRules = (activeVariant.rules || []).map(r => ({
                              ...r,
                              timeSlot: "All Day"
                            }));
                            const withUpdatedRules = updated.map(item => 
                              item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                            );
                            setVariants(withUpdatedRules);
                            setSelectedCalendarSlot("All Day");
                          } else {
                            setSelectedCalendarSlot("All");
                          }
                        }}
                        className="rounded border-slate-300 dark:border-slate-800 text-[#5fa6d9] focus:ring-[#5fa6d9] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        Don't Need Time Slots?
                      </span>
                    </label>
                  </div>

                  {/* Calendar Navigation Row */}
                  <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-4">
                    {/* Month tabs row */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none max-w-full lg:max-w-none">
                      {MONTHS_OF_YEAR.map((m, idx) => {
                        const isCurrent = currentCalendarMonth === idx;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedCalendarDays([]);
                              setCurrentCalendarMonth(idx);
                            }}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-[#5fa6d9] text-white font-extrabold shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            {m.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Year Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Year:</span>
                        <select
                          value={currentCalendarYear}
                          onChange={(e) => {
                            setSelectedCalendarDays([]);
                            setCurrentCalendarYear(Number(e.target.value));
                          }}
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                        >
                          {Array.from({ length: 6 }, (_, i) => {
                            const y = new Date().getFullYear() + i;
                            return (
                              <option key={y} value={y}>{y}</option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Display current month with arrows */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded px-2 py-1">
                        <span className="text-xs font-black text-slate-800 dark:text-white min-w-[70px] text-center">
                          {MONTHS_OF_YEAR[currentCalendarMonth]} {currentCalendarYear}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCalendarDays([]);
                              if (currentCalendarMonth === 0) {
                                setCurrentCalendarMonth(11);
                                setCurrentCalendarYear(y => y - 1);
                              } else {
                                setCurrentCalendarMonth(m => m - 1);
                              }
                            }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCalendarDays([]);
                              if (currentCalendarMonth === 11) {
                                setCurrentCalendarMonth(0);
                                setCurrentCalendarYear(y => y + 1);
                              } else {
                                setCurrentCalendarMonth(m => m + 1);
                              }
                            }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid & Days Header */}
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <span key={day} className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest py-1">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Calendar Days Cells Grid */}
                  <div className="grid grid-cols-7 gap-2 min-h-[300px]">
                    {(() => {
                      const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
                      const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();

                      const cells = [];
                      // Empty cells for alignment
                      for (let i = 0; i < firstDayIndex; i++) {
                        cells.push(
                          <div
                            key={`empty-${i}`}
                            className="bg-slate-50/40 dark:bg-slate-950/5 border border-dashed border-slate-200/50 dark:border-slate-800/20 rounded-xl min-h-[70px] opacity-20"
                          />
                        );
                      }

                      // Active day cells
                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                        const isSelected = selectedCalendarDays.includes(dateStr);
                        
                        const dayRules = (activeVariant.rules || []).filter(r => r.date === dateStr);
                        
                        // Status color computation
                        let statusDot = "bg-slate-300 dark:bg-slate-700";
                        let statusBg = "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-70";

                        if (dayRules.length > 0) {
                          const allSoldOut = dayRules.every(r => r.inventory === 0);
                          if (allSoldOut) {
                            statusDot = "bg-rose-500";
                            statusBg = "bg-rose-500/10 dark:bg-rose-500/5 border-rose-500/20";
                          } else {
                            const activeRules = dayRules.filter(r => r.inventory !== 0);
                            const minInventory = activeRules.reduce((min, r) => {
                              if (r.inventory === -1) return min;
                              return min === -1 ? r.inventory : Math.min(min, r.inventory);
                            }, -1);

                            if (minInventory === -1 || minInventory > 20) {
                              statusDot = "bg-emerald-500";
                              statusBg = "bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/20";
                            } else if (minInventory > 10) {
                              statusDot = "bg-amber-400";
                              statusBg = "bg-amber-400/10 dark:bg-amber-400/5 border-amber-400/20";
                            } else {
                              statusDot = "bg-orange-500";
                              statusBg = "bg-orange-500/10 dark:bg-orange-500/5 border-orange-500/20";
                            }
                          }
                        }

                        cells.push(
                          <div
                            key={`day-${d}`}
                            onClick={() => {
                              setSelectedCalendarDays(prev => 
                                prev.includes(dateStr) ? prev.filter(x => x !== dateStr) : [...prev, dateStr]
                              );
                            }}
                            className={`relative p-2 rounded-xl border min-h-[72px] flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-sm cursor-pointer select-none group ${statusBg} ${
                              isSelected
                                ? "ring-2 ring-[#5fa6d9] border-transparent scale-[0.98] shadow-md z-10"
                                : ""
                            }`}
                          >
                            {/* Day Header Row */}
                            <div className="flex justify-between items-start">
                              <span className={`text-[11px] font-black ${isSelected ? "text-[#5fa6d9]" : "text-slate-800 dark:text-slate-200"}`}>
                                {d}
                              </span>
                              {/* Status indicators */}
                              <div className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                              </div>
                            </div>

                            {/* Cell Values Row */}
                            <div className="space-y-0.5 mt-2">
                              {dayRules.length > 0 ? (
                                <>
                                  {/* Price Tag */}
                                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-0.5">
                                    <span className="text-[8px] text-[#5fa6d9] font-black uppercase tracking-wider mr-0.5">
                                      {selectedCurrencyObj.code}
                                    </span>
                                    {dayRules.length === 1 ? dayRules[0].price : `${Math.min(...dayRules.map(r => r.price))}+`}
                                  </span>
                                  {/* Remaining Capacity */}
                                  <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                                    <span className="text-[9px] text-[#5fa6d9]">👥</span>
                                    {dayRules.length === 1 
                                      ? (dayRules[0].inventory === -1 ? "∞" : dayRules[0].inventory)
                                      : `${dayRules.length} slots`
                                    }
                                  </span>
                                </>
                              ) : (
                                <span className="text-[8px] font-semibold text-slate-400/80 dark:text-slate-600 italic block mt-4">
                                  No slots
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                </div>

                {/* Legend Row */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-y-2 gap-x-5 text-[10px] font-bold text-slate-500">
                  <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black mr-1">Legend:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Limited Availability</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>Fast Filling</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Sold Out</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span>Closed</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    <span className="text-[8px] text-[#5fa6d9] font-black uppercase tracking-wider mr-1">
                      {selectedCurrencyObj.code}
                    </span>
                    <span>Price</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    <span>👥 Remaining Capacity</span>
                  </div>
                </div>
              </div>

              {/* THREE COLUMN CONTROLS BLOCK */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Column 1: Time Slots Selector & Management */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                    <Clock className="w-4 h-4 text-[#5fa6d9]" />
                    <h4 className="text-[11px] font-black uppercase text-slate-800 dark:text-white tracking-wider">Timeslots filter</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">View Slot on Calendar</label>
                      <select
                        value={selectedCalendarSlot}
                        disabled={dontNeedTimeSlots}
                        onChange={(e) => setSelectedCalendarSlot(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] cursor-pointer"
                      >
                        <option value="All">All Slots Summary</option>
                        {existingSlots.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Timeslots</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {existingSlots.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded text-slate-600 dark:text-slate-400 shadow-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Pricing & Capacity Quick Editor */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4 shadow-sm relative overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#5fa6d9]" />
                      <h4 className="text-[11px] font-black uppercase text-slate-800 dark:text-white tracking-wider">Pricing & Capacity</h4>
                    </div>
                    {selectedCalendarDays.length === 1 && (
                      <span className="text-[9px] font-bold text-[#5fa6d9] bg-[#5fa6d9]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Slot-wise Editor
                      </span>
                    )}
                  </div>

                  {selectedCalendarDays.length === 0 ? (
                    <div className="h-[220px] flex flex-col items-center justify-center text-center p-3">
                      <p className="text-[10px] font-semibold text-slate-400 leading-relaxed max-w-[180px]">
                        Click on specific calendar day cells above to select them and perform pricing & capacity updates.
                      </p>
                    </div>
                  ) : selectedCalendarDays.length === 1 ? (
                    (() => {
                      const dateStr = selectedCalendarDays[0];
                      const parts = dateStr.split('-');
                      const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                      const formattedDateHuman = dObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                      
                      return (
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-extrabold text-[#5fa6d9] tracking-wider uppercase">
                              Date: {formattedDateHuman}
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedCalendarDays([])}
                              className="text-[9px] text-slate-400 hover:text-slate-600 font-bold transition-colors"
                            >
                              Deselect
                            </button>
                          </div>

                          {/* Dynamic Scrollable List of Timeslots */}
                          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 flex-1">
                            {existingSlots.map(slot => {
                              const rule = activeVariant.rules?.find(r => r.date === dateStr && r.timeSlot === slot);
                              const currentPrice = Number(rule ? rule.price : (activeVariant.basePrice || price || 20));
                              const currentCapacity = rule ? rule.inventory : -1;
                              const currentCapacityType = currentCapacity === -1 ? "unlimited" : "custom";

                              return (
                                <div key={slot} className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 transition-all">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-[#5fa6d9]" /> {slot}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      {rule ? (
                                        <>
                                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/45 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900">
                                            Customized
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedRules = (activeVariant.rules || []).filter(r => !(r.date === dateStr && r.timeSlot === slot));
                                              const updated = variants.map(item => 
                                                item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                                              );
                                              setVariants(updated);
                                            }}
                                            className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded"
                                            title="Reset to default price/capacity"
                                          >
                                            <RotateCcw className="w-3 h-3" />
                                          </button>
                                        </>
                                      ) : (
                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price</label>
                                      <div className="relative mt-0.5">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-bold">{selectedCurrencyObj.symbol}</span>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={currentPrice}
                                          onChange={(e) => {
                                            const pVal = e.target.value === "" ? 0 : Number(e.target.value);
                                            const updatedRules = [...(activeVariant.rules || [])];
                                            const existingIndex = updatedRules.findIndex(r => r.date === dateStr && r.timeSlot === slot);
                                            if (existingIndex > -1) {
                                              updatedRules[existingIndex] = { ...updatedRules[existingIndex], price: pVal };
                                            } else {
                                              updatedRules.push({
                                                id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                                date: dateStr,
                                                timeSlot: slot,
                                                price: pVal,
                                                inventory: currentCapacity
                                              });
                                            }
                                            const updated = variants.map(item => 
                                              item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                                            );
                                            setVariants(updated);
                                          }}
                                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded pl-5 pr-1 py-0.5 text-xs font-bold text-slate-850 dark:text-white focus:outline-none"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Capacity</label>
                                      <div className="flex gap-1 mt-0.5">
                                        <select
                                          value={currentCapacityType}
                                          onChange={(e) => {
                                            const isUnlimited = e.target.value === "unlimited";
                                            const cVal = isUnlimited ? -1 : 50;
                                            const updatedRules = [...(activeVariant.rules || [])];
                                            const existingIndex = updatedRules.findIndex(r => r.date === dateStr && r.timeSlot === slot);
                                            if (existingIndex > -1) {
                                              updatedRules[existingIndex] = { ...updatedRules[existingIndex], inventory: cVal };
                                            } else {
                                              updatedRules.push({
                                                id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                                date: dateStr,
                                                timeSlot: slot,
                                                price: currentPrice,
                                                inventory: cVal
                                              });
                                            }
                                            const updated = variants.map(item => 
                                              item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                                            );
                                            setVariants(updated);
                                          }}
                                          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1 py-0.5 text-[11px] font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                                        >
                                          <option value="custom">Limit</option>
                                          <option value="unlimited">∞</option>
                                        </select>
                                        {currentCapacityType === "custom" && (
                                          <input
                                            type="number"
                                            min="0"
                                            value={currentCapacity === -1 ? 50 : currentCapacity}
                                            onChange={(e) => {
                                              const cVal = e.target.value === "" ? 0 : Number(e.target.value);
                                              const updatedRules = [...(activeVariant.rules || [])];
                                              const existingIndex = updatedRules.findIndex(r => r.date === dateStr && r.timeSlot === slot);
                                              if (existingIndex > -1) {
                                                updatedRules[existingIndex] = { ...updatedRules[existingIndex], inventory: cVal };
                                              } else {
                                                updatedRules.push({
                                                  id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                                  date: dateStr,
                                                  timeSlot: slot,
                                                  price: currentPrice,
                                                  inventory: cVal
                                                });
                                              }
                                              const updated = variants.map(item => 
                                                item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                                              );
                                              setVariants(updated);
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1 py-0.5 text-xs font-semibold text-slate-850 dark:text-white focus:outline-none"
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Quick Add Custom Timeslot Form for this day */}
                          <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-1.5">
                            <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Add Custom Slot for This Day</label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                placeholder="e.g. 05:00 PM"
                                id="quick-add-slot-input"
                                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const input = e.currentTarget;
                                    const val = input.value.trim();
                                    if (val) {
                                      const updatedRules = [...(activeVariant.rules || [])];
                                      updatedRules.push({
                                        id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                        date: dateStr,
                                        timeSlot: val,
                                        price: Number(activeVariant.basePrice || price || 20),
                                        inventory: 50
                                      });
                                      const updated = variants.map(item => 
                                        item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                                      );
                                      setVariants(updated);
                                      input.value = "";
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById("quick-add-slot-input") as HTMLInputElement;
                                  const val = input ? input.value.trim() : "";
                                  if (val) {
                                    const updatedRules = [...(activeVariant.rules || [])];
                                    updatedRules.push({
                                      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                      date: dateStr,
                                      timeSlot: val,
                                      price: Number(activeVariant.basePrice || price || 20),
                                      inventory: 50
                                    });
                                    const updated = variants.map(item => 
                                      item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                                    );
                                    setVariants(updated);
                                    if (input) input.value = "";
                                  }
                                }}
                                className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 rounded text-xs font-black transition-all active:scale-95"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold text-[#5fa6d9] tracking-wider uppercase">
                        Bulk Editing: {selectedCalendarDays.length} selected days
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">{selectedCurrencyObj.symbol}</span>
                            <input
                              type="number"
                              placeholder={String(activeVariant.basePrice || price || 20)}
                              value={calendarPriceInput}
                              onChange={(e) => setCalendarPriceInput(e.target.value === "" ? "" : Number(e.target.value))}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded pl-5 pr-1.5 py-1 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity</label>
                          <select
                            value={calendarCapacityType}
                            onChange={(e) => setCalendarCapacityType(e.target.value as "custom" | "unlimited")}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer mb-1.5"
                          >
                            <option value="custom">Limit</option>
                            <option value="unlimited">Unlimited</option>
                          </select>
                          {calendarCapacityType === "custom" && (
                            <input
                              type="number"
                              placeholder="50"
                              value={calendarCapacityInput}
                              onChange={(e) => setCalendarCapacityInput(e.target.value === "" ? "" : Number(e.target.value))}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                            />
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const targetSlot = dontNeedTimeSlots ? "All Day" : (selectedCalendarSlot === "All" ? "09:00 AM" : selectedCalendarSlot);
                          const pVal = calendarPriceInput !== "" ? Number(calendarPriceInput) : Number(activeVariant.basePrice || price || 20);
                          const cVal = calendarCapacityType === "unlimited" ? -1 : (calendarCapacityInput !== "" ? Number(calendarCapacityInput) : 50);

                          const updatedRules = [...(activeVariant.rules || [])];
                          selectedCalendarDays.forEach(dateStr => {
                            const existingIndex = updatedRules.findIndex(r => r.date === dateStr && r.timeSlot === targetSlot);
                            if (existingIndex > -1) {
                              updatedRules[existingIndex] = {
                                ...updatedRules[existingIndex],
                                price: pVal,
                                inventory: cVal
                              };
                            } else {
                              updatedRules.push({
                                id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                date: dateStr,
                                timeSlot: targetSlot,
                                price: pVal,
                                inventory: cVal
                              });
                            }
                          });

                          const updated = variants.map(item => 
                            item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                          );
                          setVariants(updated);
                          setSelectedCalendarDays([]);
                          setCalendarPriceInput("");
                          setCalendarCapacityInput("");
                        }}
                        className="w-full bg-[#5fa6d9] hover:bg-[#4b95cc] text-white py-1.5 rounded text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" /> Apply to Selected
                      </button>
                    </div>
                  )}
                </div>

                {/* Column 3: Bulk Actions Panel */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-[11px] font-black uppercase text-slate-800 dark:text-white tracking-wider">Bulk actions</h4>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {/* Range-based bulk generator trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        if (bulkPrice === "") {
                          setBulkPrice(Number(activeVariant.basePrice || price || 20));
                        }
                        setIsBulkGenOpen(!isBulkGenOpen);
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs font-bold rounded border transition-all cursor-pointer ${
                        isBulkGenOpen
                          ? "bg-emerald-500 text-white border-transparent shadow-sm font-black"
                          : "bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Bulk Generate Range
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    {/* Populate month button */}
                    <button
                      type="button"
                      onClick={() => {
                        const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
                        const pVal = Number(activeVariant.basePrice || price || 20);
                        
                        const rulesToAdd: VariantRule[] = [];
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                          existingSlots.forEach((slot, slotIndex) => {
                            rulesToAdd.push({
                              id: `rule-${Date.now()}-${d}-${slotIndex}-${Math.random().toString(36).substr(2, 5)}`,
                              date: dateStr,
                              timeSlot: slot,
                              price: pVal,
                              inventory: 100
                            });
                          });
                        }

                        // Combine with existing rules and deduplicate
                        const updatedRules = [...(activeVariant.rules || []), ...rulesToAdd];
                        const uniqueRules: VariantRule[] = [];
                        const seen = new Set<string>();
                        for (let i = updatedRules.length - 1; i >= 0; i--) {
                          const r = updatedRules[i];
                          const key = `${r.date}-${r.timeSlot}`;
                          if (!seen.has(key)) {
                            seen.add(key);
                            uniqueRules.unshift(r);
                          }
                        }

                        const updated = variants.map(item => 
                          item.id === activeVariant.id ? { ...item, rules: uniqueRules } : item
                        );
                        setVariants(updated);
                        alert(`Successfully populated all days for ${MONTHS_OF_YEAR[currentCalendarMonth]} ${currentCalendarYear} with existing timeslots, default price: ${selectedCurrencyObj.symbol}${pVal} and limit: 100.`);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold rounded border bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Fill Current Month
                    </button>

                    {/* Populate selected date(s) button */}
                    <button
                      type="button"
                      disabled={selectedCalendarDays.length === 0}
                      onClick={() => {
                        const pVal = Number(activeVariant.basePrice || price || 20);
                        const rulesToAdd: VariantRule[] = [];
                        selectedCalendarDays.forEach(dateStr => {
                          existingSlots.forEach((slot, slotIndex) => {
                            rulesToAdd.push({
                              id: `rule-${Date.now()}-${dateStr}-${slotIndex}-${Math.random().toString(36).substr(2, 5)}`,
                              date: dateStr,
                              timeSlot: slot,
                              price: pVal,
                              inventory: 100
                            });
                          });
                        });

                        // Combine with existing rules and deduplicate
                        const updatedRules = [...(activeVariant.rules || []), ...rulesToAdd];
                        const uniqueRules: VariantRule[] = [];
                        const seen = new Set<string>();
                        for (let i = updatedRules.length - 1; i >= 0; i--) {
                          const r = updatedRules[i];
                          const key = `${r.date}-${r.timeSlot}`;
                          if (!seen.has(key)) {
                            seen.add(key);
                            uniqueRules.unshift(r);
                          }
                        }

                        const updated = variants.map(item => 
                          item.id === activeVariant.id ? { ...item, rules: uniqueRules } : item
                        );
                        setVariants(updated);
                        alert(`Successfully populated all timeslots for selected date(s) with default price: ${selectedCurrencyObj.symbol}${pVal} and limit: 100.`);
                        setSelectedCalendarDays([]);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold rounded border bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      {selectedCalendarDays.length === 0
                        ? "Fill Selected Date (Select date first)"
                        : selectedCalendarDays.length === 1
                          ? "Fill This Date"
                          : `Fill Selected Dates (${selectedCalendarDays.length})`}
                    </button>

                    {/* Clear current month rules */}
                    <button
                      type="button"
                      disabled={!(activeVariant.rules && activeVariant.rules.length > 0)}
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to clear all slots and rules for the month of ${MONTHS_OF_YEAR[currentCalendarMonth]} ${currentCalendarYear}?`)) {
                          const monthPrefix = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}`;
                          const updatedRules = (activeVariant.rules || []).filter(r => !r.date.startsWith(monthPrefix));
                          
                          const updated = variants.map(item => 
                            item.id === activeVariant.id ? { ...item, rules: updatedRules } : item
                          );
                          setVariants(updated);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold rounded border bg-rose-50/25 hover:bg-rose-50 dark:bg-rose-950/5 dark:hover:bg-rose-950/20 border-rose-200/40 text-rose-500 disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Clear Month Rules
                    </button>

                    {/* Clear all rules completely */}
                    <button
                      type="button"
                      disabled={!(activeVariant.rules && activeVariant.rules.length > 0)}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to completely erase ALL scheduling and pricing rules for this variant? This is irreversible.")) {
                          const updated = variants.map(item => 
                            item.id === activeVariant.id ? { ...item, rules: [] } : item
                          );
                          setVariants(updated);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-black rounded border bg-red-500/10 hover:bg-red-500/15 border-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Clear All Variant Rules
                    </button>
                  </div>
                </div>
              </div>

              {/* ORIGINAL RANGE-BASED BULK GENERATOR (EXACT RE-IMPLEMENTATION, ONLY VISIBLE WHEN OPENED FROM BULK ACTIONS) */}
              {isBulkGenOpen && (
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4 animate-in slide-in-from-bottom-4 duration-205">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Bulk Generate Range Slots</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBulkGenOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                      <input
                        type="date"
                        value={bulkStartDate}
                        onChange={(e) => setBulkStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                      <input
                        type="date"
                        value={bulkEndDate}
                        onChange={(e) => setBulkEndDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Day Presets</label>
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {["All Days", "Weekdays", "Weekends"].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => {
                              if (preset === "All Days") {
                                setBulkDays(DAYS_OF_WEEK);
                              } else if (preset === "Weekdays") {
                                setBulkDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
                              } else if (preset === "Weekends") {
                                setBulkDays(["Saturday", "Sunday"]);
                              }
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Apply to Days</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = bulkDays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => {
                              if (isSelected) {
                                setBulkDays(bulkDays.filter((d) => d !== day));
                              } else {
                                setBulkDays([...bulkDays, day]);
                              }
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded transition-colors border ${
                              isSelected
                                ? "bg-[#5fa6d9]/15 text-[#5fa6d9] border-[#5fa6d9]/40 font-extrabold"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Custom Price ({selectedCurrencyObj.code})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{selectedCurrencyObj.symbol}</span>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder={String(activeVariant.basePrice || price || 20)}
                          value={bulkPrice}
                          onChange={(e) => {
                            const val = e.target.value === "" ? "" : Number(e.target.value);
                            setBulkPrice(val);
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded pl-7 pr-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity / Inventory</label>
                      <div className="flex gap-2">
                        <select
                          value={bulkInventoryType}
                          onChange={(e) => setBulkInventoryType(e.target.value as "custom" | "unlimited")}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                        >
                          <option value="custom">Limit capacity</option>
                          <option value="unlimited">No limit</option>
                        </select>
                        {bulkInventoryType === "custom" && (
                          <input
                            type="number"
                            min="1"
                            value={bulkInventory}
                            onChange={(e) => setBulkInventory(Number(e.target.value))}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Time Slots to Generate</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                      {availableBulkTimeSlots.map((slot) => {
                        const isSelected = bulkTimeSlots.includes(slot);
                        return (
                          <div
                            key={slot}
                            className={`flex items-center justify-between rounded border transition-all text-[11px] font-bold overflow-hidden ${
                              isSelected
                                ? "bg-[#5fa6d9]/15 text-[#5fa6d9] border-[#5fa6d9]/40"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50/50"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setBulkTimeSlots(bulkTimeSlots.filter((s) => s !== slot));
                                } else {
                                  setBulkTimeSlots([...bulkTimeSlots, slot]);
                                }
                              }}
                              className="flex-1 py-1.5 px-2 text-center select-none truncate cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                            >
                              {slot}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete timeslot "${slot}" from the list?`)) {
                                  setAvailableBulkTimeSlots(availableBulkTimeSlots.filter((s) => s !== slot));
                                  setBulkTimeSlots(bulkTimeSlots.filter((s) => s !== slot));
                                }
                              }}
                              className="p-1.5 pr-2.5 hover:text-red-500 dark:hover:text-red-400 text-slate-300 dark:text-slate-600 transition-colors cursor-pointer"
                              title="Delete timeslot"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2.5 flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        placeholder="Add custom slot e.g. 10:30 AM"
                        value={customBulkTimeSlot}
                        onChange={(e) => setCustomBulkTimeSlot(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const trimmed = customBulkTimeSlot.trim();
                            if (trimmed) {
                              if (!availableBulkTimeSlots.includes(trimmed)) {
                                setAvailableBulkTimeSlots([...availableBulkTimeSlots, trimmed]);
                              }
                              if (!bulkTimeSlots.includes(trimmed)) {
                                setBulkTimeSlots([...bulkTimeSlots, trimmed]);
                              }
                              setCustomBulkTimeSlot("");
                            }
                          }
                        }}
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = customBulkTimeSlot.trim();
                          if (trimmed) {
                            if (!availableBulkTimeSlots.includes(trimmed)) {
                              setAvailableBulkTimeSlots([...availableBulkTimeSlots, trimmed]);
                            }
                            if (!bulkTimeSlots.includes(trimmed)) {
                              setBulkTimeSlots([...bulkTimeSlots, trimmed]);
                            }
                            setCustomBulkTimeSlot("");
                          }
                        }}
                        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded text-xs font-bold transition-colors"
                      >
                        Add Slot
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Selected: <span className="font-bold text-[#5fa6d9]">{bulkDays.length} operating days</span> & <span className="font-bold text-[#5fa6d9]">{bulkTimeSlots.length} timeslots</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkStartDate(new Date().toISOString().split('T')[0]);
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setBulkEndDate(d.toISOString().split('T')[0]);
                          setBulkTimeSlots(["09:00 AM", "11:00 AM", "02:00 PM"]);
                          setBulkDays(DAYS_OF_WEEK);
                          setBulkPrice("");
                          setBulkInventoryType("custom");
                          setBulkInventory(50);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-200/40 rounded transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (bulkTimeSlots.length === 0) {
                            alert("Please select at least one timeslot to generate.");
                            return;
                          }
                          if (bulkDays.length === 0) {
                            alert("Please select at least one operating day.");
                            return;
                          }
                          const start = new Date(bulkStartDate);
                          const end = new Date(bulkEndDate);
                          if (start > end) {
                            alert("Start date must be before or equal to End date.");
                            return;
                          }

                          const diffTime = Math.abs(end.getTime() - start.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays > 90) {
                            alert("For performance, please limit bulk slot generation to a maximum of 90 days at a time.");
                            return;
                          }

                          const defaultP = Number(activeVariant.basePrice || price || 20);
                          const finalPrice = bulkPrice === "" ? defaultP : Number(bulkPrice);
                          const finalInv = bulkInventoryType === "unlimited" ? -1 : bulkInventory;

                          const rulesToAdd: VariantRule[] = [];
                          const current = new Date(start);
                          while (current <= end) {
                            const dayName = current.toLocaleDateString("en-US", { weekday: "long" });
                            if (bulkDays.includes(dayName)) {
                              const dateStr = current.toISOString().split("T")[0];
                              bulkTimeSlots.forEach((slot, index) => {
                                const rId = `rule-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`;
                                rulesToAdd.push({
                                  id: rId,
                                  date: dateStr,
                                  timeSlot: slot,
                                  price: finalPrice,
                                  inventory: finalInv
                                });
                              });
                            }
                            current.setDate(current.getDate() + 1);
                          }

                          const updatedRules = [...(activeVariant.rules || []), ...rulesToAdd];
                          const uniqueRules: VariantRule[] = [];
                          const seen = new Set<string>();
                          for (let i = updatedRules.length - 1; i >= 0; i--) {
                            const r = updatedRules[i];
                            const key = `${r.date}-${r.timeSlot}`;
                            if (!seen.has(key)) {
                              seen.add(key);
                              uniqueRules.unshift(r);
                            }
                          }

                          const updated = variants.map(item => item.id === activeVariant.id ? { ...item, rules: uniqueRules } : item);
                          setVariants(updated);
                          setIsBulkGenOpen(false);
                          alert(`Bulk range timeslots generated successfully for ${rulesToAdd.length} slot combinations!`);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Generate Slots
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Card Footer */}
            <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingVariantId(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setEditingVariantId(null)}
                className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Done Editing
              </button>
            </div>
          </div>
        </div>
      );
    };

  return (
    <div className="space-y-8 w-full mx-auto pb-12">
      {!isModalOpen ? (
        <>
          {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-[#102738] to-slate-900 p-6 rounded-lg text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5fa6d9]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#5fa6d9] text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
              Operational Catalogue
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-300 font-bold">Auto-sync Active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Inventory Control Center</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Add, update, or remove activity details, custom pricing, discount vouchers, and daily capacities. All modifications synchronize instantly across user search fields.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="z-10 flex items-center gap-2 bg-[#5fa6d9] text-white px-6 py-3 rounded-lg font-black hover:bg-[#4b95cc] active:scale-95 transition-all shadow-lg hover:shadow-[#5fa6d9]/20 text-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {/* Modern Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Listed Attractions</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#5fa6d9] transition-colors">
              {stats.total}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Across global regions</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-[#5fa6d9] rounded-md group-hover:bg-[#f0f7fc] dark:group-hover:bg-[#102738]/40 transition-colors">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Active Promotions</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.promotions}
            </p>
            <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <Percent className="w-3 h-3" /> Hot Deals displayed live
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-emerald-500 rounded-md group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 transition-colors">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Average Original Price</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              EUR {stats.avgPrice.toFixed(1)}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Weighted mean price</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-sky-500 rounded-md group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40 transition-colors">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Low Stock Alerts</p>
            <p className="text-3xl font-black text-amber-500">
              {stats.lowCapacity}
            </p>
            <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Under 150 bookings limit
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-amber-500 rounded-md group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 transition-colors">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search, Filter Tabs and Table Container */}
      {inventoryTable}
        </>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header Card */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md p-6 flex justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#5fa6d9]/10 text-[#5fa6d9] rounded-lg shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center flex-wrap gap-2">
                  {editingAttraction ? (
                    <>
                      <span>Edit Product</span>
                      <span className="text-slate-300 dark:text-slate-700 font-normal">—</span>
                      <span className="text-slate-900 dark:text-white">{name || editingAttraction.name}</span>
                    </>
                  ) : (
                    "Add New Product"
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {editingAttraction ? "Update the details, pricing, and variants for this product." : "Create a new bookable product or experience to add to your inventory."}
                </p>
              </div>
            </div>
          </div>

          {/* Form Content Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
            {/* Scrollable Container with form and real-time preview stacked vertically */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-0 bg-slate-50 dark:bg-slate-950/20">
              
              {/* Form Input Section */}
              <form id="attraction-form" onSubmit={handleSave} className="w-full flex flex-col sm:flex-row border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                {/* Vertical Tabs Sidebar */}
                <div className="flex flex-row sm:flex-col sm:w-52 bg-slate-50 dark:bg-slate-950/40 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800/80 p-4 gap-1.5 text-sm font-bold text-slate-400 shrink-0 overflow-x-auto sm:overflow-x-visible">
                  {(() => {
                    const tabIcons: Record<string, React.ReactNode> = {
                      "Primary": <Home className="w-4 h-4" />,
                      "Variants": <Layers className="w-4 h-4" />,
                      "Gallary": <Image className="w-4 h-4" />,
                      "Live Ticket Preview": <Compass className="w-4 h-4" />
                    };
                    return ["Primary", "Variants", "Gallary", "Live Ticket Preview"].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`py-2.5 px-3.5 rounded-lg text-left transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5 ${
                          activeTab === tab
                            ? "bg-[#5fa6d9]/15 text-[#5fa6d9] font-black"
                            : "hover:bg-slate-100/80 dark:hover:bg-slate-900/60 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                      >
                        {tabIcons[tab] || <Home className="w-4 h-4" />}
                        <span>{tab}</span>
                      </button>
                    ));
                  })()}
                </div>
                
                <div className="flex-1 p-6 lg:p-10 space-y-8">
                  {/* TAB 1: Primary */}
                  {activeTab === "Primary" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      {/* Section 1: Basic Information */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <MapPin className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Basic Information</h3>
                        </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Product ID (Permanent & Non-Editable)
                                </label>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50 font-mono font-bold">
                                  Auto-Assigned
                                </span>
                              </div>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={editingAttraction ? (editingAttraction.productId || getDisplayProductId(editingAttraction)) : assignedProductId}
                                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2 text-sm font-mono font-bold text-slate-700 dark:text-slate-200 cursor-not-allowed select-all"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">Unique 8-digit numeric system identifier (format: 36110868). Automatically assigned and permanent.</p>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Activity Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Skip-the-line Eiffel Tower Summit Access"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Geographical Region
                                </label>
                                <select
                                  value={region}
                                  onChange={(e) => handleRegionChange(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-bold text-slate-700 dark:text-slate-300"
                                >
                                  {Object.keys(GEOGRAPHY_DATA).map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Geographical Country
                                </label>
                                <select
                                  value={country}
                                  onChange={(e) => handleCountryChange(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-700 dark:text-slate-300"
                                >
                                  {getCountriesForRegion(region).map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                  {!country && <option value="">Select Country</option>}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Geographical City *
                                </label>
                                <select
                                  required
                                  value={city}
                                  onChange={(e) => handleCityChange(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-bold text-slate-800 dark:text-white"
                                >
                                  {getCitiesForCountry(region, country).map((ct) => (
                                    <option key={ct} value={ct}>{ct}</option>
                                  ))}
                                  {!city && <option value="">Select City</option>}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Exact Location Coordinates/Address
                              </label>
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] text-slate-700 dark:text-slate-300"
                              />
                            </div>
                          </div>
                        </div>

                      {/* Section 2: Geographical Settings */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <Globe className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Geographical Time Zone & Currency</h3>
                        </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Geographical Time Zone *
                              </label>
                              <select
                                required
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white cursor-pointer"
                              >
                                <option value="">Select Time Zone</option>
                                {TIMEZONES.map((tz) => (
                                  <option key={tz.value} value={tz.value}>
                                    {tz.label}
                                  </option>
                                ))}
                              </select>
                              <span className="text-[10px] text-slate-400 mt-1 block font-semibold">Used to calculate timezone-aware availability and local deadlines.</span>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Geographical Currency *
                              </label>
                              <select
                                required
                                value={currencyCode}
                                onChange={(e) => setCurrencyCode(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white cursor-pointer"
                              >
                                <option value="">Select Currency</option>
                                {CURRENCIES.map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.code} - {c.name} ({c.symbol})
                                  </option>
                                ))}
                              </select>
                              <span className="text-[10px] text-slate-400 mt-1 block font-semibold">Used to calculate and display accurate local equivalent conversions.</span>
                            </div>
                          </div>
                        </div>

                      {/* Section 3: Classification & Supplier */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <Layers className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Classification & Supplier</h3>
                        </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Category Label *
                              </label>
                              <select
                                value={categoryPresets.includes(category) ? category : "Custom Category"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "Custom Category") {
                                    setCategory(categoryPresets.includes(category) ? "" : category);
                                  } else {
                                    setCategory(val);
                                  }
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white cursor-pointer"
                              >
                                {categoryPresets.map((p) => (
                                  <option key={p} value={p}>
                                    {p}
                                  </option>
                                ))}
                                <option value="Custom Category">Custom Category</option>
                              </select>

                              {!categoryPresets.includes(category) && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-250">
                                  <input
                                    type="text"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Enter custom category name"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2 text-xs focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white"
                                  />
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Registered Provider / Supplier
                              </label>
                              <select
                                value={supplier === "Local Operator" ? "Local Operator" : "Custom Supplier"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "Local Operator") {
                                    setSupplier("Local Operator");
                                  } else {
                                    setSupplier("Custom Supplier");
                                  }
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white cursor-pointer"
                              >
                                <option value="Local Operator">Local Operator</option>
                                <option value="Custom Supplier">Custom Supplier</option>
                              </select>
                              {supplier !== "Local Operator" && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-250">
                                  <input
                                    type="text"
                                    value={supplier === "Custom Supplier" ? "" : supplier}
                                    onChange={(e) => setSupplier(e.target.value || "Custom Supplier")}
                                    placeholder="Enter custom supplier name"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2 text-xs focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      {/* Section 4: Features & Badges */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <Sparkles className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Features & Badges</h3>
                        </div>
                          <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-[#5fa6d9] transition-colors">
                              <input
                                type="checkbox"
                                checked={isPopular}
                                onChange={(e) => setIsPopular(e.target.checked)}
                                className="w-4 h-4 text-[#5fa6d9] rounded border-slate-300 focus:ring-[#5fa6d9]"
                              />
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Bestseller</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-[#5fa6d9] transition-colors">
                              <input
                                type="checkbox"
                                checked={fastTrack}
                                onChange={(e) => setFastTrack(e.target.checked)}
                                className="w-4 h-4 text-[#5fa6d9] rounded border-slate-300 focus:ring-[#5fa6d9]"
                              />
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Trending</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-[#5fa6d9] transition-colors">
                              <input
                                type="checkbox"
                                checked={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                                className="w-4 h-4 text-[#5fa6d9] rounded border-slate-300 focus:ring-[#5fa6d9]"
                              />
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Available</span>
                            </label>
                          </div>
                        </div>

                      {/* Section 5: Pricing Configuration & Limits */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <DollarSign className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Pricing Configuration & Limits</h3>
                        </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Original Price ({selectedCurrencyObj.code}) *
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">{selectedCurrencyObj.code}</span>
                                <input
                                  type="number"
                                  required
                                  min="1"
                                  step="0.01"
                                  value={price}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
                                      val = val.replace(/^0+/, '');
                                      if (val === '') val = '0';
                                    }
                                    setPrice(val);
                                  }}
                                  placeholder="85.00"
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-12 pr-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Promo Discount Price ({selectedCurrencyObj.code})
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-[10px] font-bold">{selectedCurrencyObj.code}</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={discountPrice}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
                                      val = val.replace(/^0+/, '');
                                      if (val === '') val = '0';
                                    }
                                    setDiscountPrice(val);
                                  }}
                                  placeholder="e.g. 65.00"
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-12 pr-3 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Max Capacity per Day
                              </label>
                              <div className="flex items-center gap-2">
                                <select
                                  value={capacityType}
                                  onChange={(e) => setCapacityType(e.target.value as "custom" | "no-limit")}
                                  className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                                >
                                  <option value="custom">Custom Limit</option>
                                  <option value="no-limit">No Limit</option>
                                </select>
                                
                                {capacityType === "custom" && (
                                  <input
                                    type="number"
                                    min="1"
                                    value={capacity}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
                                        val = val.replace(/^0+/, '');
                                        if (val === '') val = '0';
                                      }
                                      setCapacity(val);
                                    }}
                                    placeholder="500"
                                    className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] animate-in fade-in zoom-in-95 duration-200"
                                  />
                                )}
                                
                                {capacityType === "no-limit" && (
                                  <div className="w-1/2 px-4 py-2.5 text-sm font-bold text-slate-400 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-md flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                                    Unlimited
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                      {/* Section 6: Logistics & Operational Hours */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <Clock className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Logistics & Operational Hours</h3>
                        </div>

                        <div className="space-y-4">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Duration Description
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="e.g. 2-3 hours, Full Day, 45 minutes"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-[#5fa6d9] transition-colors"
                                    title="Open digital duration clock"
                                  >
                                    <Clock className="w-4 h-4 text-[#5fa6d9]" />
                                  </button>

                                  {/* Digital Clock Popover */}
                                  {isDurationDropdownOpen && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setIsDurationDropdownOpen(false)}
                                      />
                                      <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-20 p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-[#5fa6d9]" />
                                            Digital Clock
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => setIsDurationDropdownOpen(false)}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                          {["Flexible", "Half Day", "Full Day", "All Day", "Multi-day", "Ticket Only"].map(preset => (
                                            <button
                                              key={preset}
                                              type="button"
                                              onClick={() => {
                                                setDuration(preset);
                                                setDigitalHours("");
                                                setDigitalMinutes("");
                                                setIsDurationDropdownOpen(false);
                                              }}
                                              className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-1.5 rounded transition-colors"
                                            >
                                              {preset}
                                            </button>
                                          ))}
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hours</label>
                                            <input
                                              type="number"
                                              min="0"
                                              max="72"
                                              value={digitalHours}
                                              onChange={(e) => {
                                                const v = e.target.value;
                                                setDigitalHours(v === "" ? "" : Number(v));
                                              }}
                                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] text-center"
                                            />
                                          </div>
                                          <div className="text-xl font-black text-slate-300 dark:text-slate-700 mt-4">:</div>
                                          <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Minutes</label>
                                            <input
                                              type="number"
                                              min="0"
                                              max="59"
                                              value={digitalMinutes}
                                              onChange={(e) => {
                                                const v = e.target.value;
                                                setDigitalMinutes(v === "" ? "" : Number(v));
                                              }}
                                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] text-center"
                                            />
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            let strParts = [];
                                            if (digitalHours) strParts.push(`${digitalHours} ${digitalHours === 1 ? 'hour' : 'hours'}`);
                                            if (digitalMinutes) strParts.push(`${digitalMinutes} ${digitalMinutes === 1 ? 'min' : 'mins'}`);
                                            setDuration(strParts.join(" ") || "Flexible");
                                            setIsDurationDropdownOpen(false);
                                          }}
                                          className="w-full bg-[#5fa6d9] hover:bg-[#4b92c4] text-white py-2 rounded-md text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors shadow-md text-center"
                                        >
                                          Set Duration
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Dropdown Checkbox list for Days of the Week */}
                                    <div className="relative">
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Operating Days
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                                      >
                                        <span className="flex items-center gap-2 truncate">
                                          <Calendar className="w-4 h-4 text-[#5fa6d9]" />
                                          <span className="truncate">
                                            {selectedDays.length === 0 ? "Select Operating Days..." : getDaysString(selectedDays)}
                                          </span>
                                        </span>
                                        {isDaysDropdownOpen ? (
                                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                        )}
                                      </button>

                                      {/* Dropdown Card */}
                                      {isDaysDropdownOpen && (
                                        <>
                                          {/* Backdrop to close the dropdown */}
                                          <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsDaysDropdownOpen(false)}
                                          />
                                          <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-1 duration-200">
                                            {/* Quick selectors */}
                                            <div className="p-2 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between gap-1 flex-wrap">
                                              <button
                                                type="button"
                                                onClick={() => handleSelectPresetDays("all")}
                                                className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                              >
                                                All Days
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleSelectPresetDays("weekdays")}
                                                className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                              >
                                                Weekdays
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleSelectPresetDays("weekends")}
                                                className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                              >
                                                Weekends
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleSelectPresetDays("none")}
                                                className="px-2 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 rounded text-[10px] font-bold border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
                                              >
                                                Reset
                                              </button>
                                            </div>

                                            {/* Checkboxes list */}
                                            <div className="p-2.5 max-h-[220px] overflow-y-auto space-y-1">
                                              {DAYS_OF_WEEK.map((day) => {
                                                const isChecked = selectedDays.includes(day);
                                                return (
                                                  <label
                                                    key={day}
                                                    className="flex items-center gap-3 px-2.5 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer select-none transition-colors"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={isChecked}
                                                      onChange={() => handleDayToggle(day)}
                                                      className="w-4 h-4 rounded text-[#5fa6d9] focus:ring-[#5fa6d9] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 transition-colors cursor-pointer"
                                                    />
                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                      {day}
                                                    </span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    {/* Hours details input */}
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Day-Wise Opening Hours
                                      </label>
                                      {selectedDays.length === 0 ? (
                                        <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-md p-3 text-sm text-slate-500 italic">
                                          Select operating days first to set hours.
                                        </div>
                                      ) : (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                          {selectedDays.map(day => (
                                            <div key={day} className="flex items-center gap-3">
                                              <div className="w-24 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {day}
                                              </div>
                                              <div className="relative flex-1">
                                                <Clock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                                <input
                                                  type="text"
                                                  value={dayWiseHours[day] || "09:00 - 18:00"}
                                                  onChange={(e) => {
                                                    const newHours = { ...dayWiseHours, [day]: e.target.value };
                                                    setDayWiseHours(newHours);
                                                    updateGlobalHoursString(selectedMonths, selectedDays, monthWiseHours, newHours);
                                                  }}
                                                  placeholder="e.g. 09:00 - 18:00, Closed"
                                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* MONTH-WISE GRID */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Dropdown Checkbox list for Months */}
                                    <div className="relative">
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Operating Months
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => setIsMonthsDropdownOpen(!isMonthsDropdownOpen)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                                      >
                                        <span className="flex items-center gap-2 truncate">
                                          <Calendar className="w-4 h-4 text-[#5fa6d9]" />
                                          <span className="truncate">
                                            {selectedMonths.length === 0 ? "Select Operating Months..." : getMonthsString(selectedMonths)}
                                          </span>
                                        </span>
                                        {isMonthsDropdownOpen ? (
                                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                        )}
                                      </button>
                                      
                                      {/* Dropdown Card */}
                                      {isMonthsDropdownOpen && (
                                        <>
                                          {/* Backdrop to close the dropdown */}
                                          <div 
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsMonthsDropdownOpen(false)}
                                          />
                                          <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-1 duration-200">
                                            {/* Quick selectors */}
                                            <div className="p-2 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between gap-1 flex-wrap">
                                              <button type="button" onClick={() => handleSelectPresetMonths("all")} className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer">All Year</button>
                                              <button type="button" onClick={() => handleSelectPresetMonths("summer")} className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer">Summer</button>
                                              <button type="button" onClick={() => handleSelectPresetMonths("winter")} className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer">Winter</button>
                                              <button type="button" onClick={() => handleSelectPresetMonths("none")} className="px-2 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 rounded text-[10px] font-bold border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer">Reset</button>
                                            </div>
                                            
                                            {/* Checkboxes list */}
                                            <div className="p-2.5 max-h-[220px] overflow-y-auto space-y-1">
                                              {MONTHS_OF_YEAR.map((month) => {
                                                const isChecked = selectedMonths.includes(month);
                                                return (
                                                  <label key={month} className="flex items-center gap-3 px-2.5 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer select-none transition-colors">
                                                    <input type="checkbox" checked={isChecked} onChange={() => handleMonthToggle(month)} className="w-4 h-4 rounded text-[#5fa6d9] focus:ring-[#5fa6d9] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 transition-colors cursor-pointer" />
                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{month}</span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Month-Wise Hours details input */}
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Month-Wise Opening Hours
                                      </label>
                                      {selectedMonths.length === 0 ? (
                                        <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-md p-3 text-sm text-slate-500 italic">
                                          Select operating months first to set hours.
                                        </div>
                                      ) : (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                          {selectedMonths.map(month => (
                                            <div key={month} className="flex items-center gap-3">
                                              <div className="w-24 text-xs font-bold text-slate-600 dark:text-slate-400">{month}</div>
                                              <div className="relative flex-1">
                                                <Clock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                                <input type="text" value={monthWiseHours[month] || "09:00 - 18:00"} onChange={(e) => {
                                                    const val = e.target.value;
                                                    const newHours = { ...monthWiseHours, [month]: val };
                                                    setMonthWiseHours(newHours);
                                                    updateGlobalHoursString(selectedMonths, selectedDays, newHours, dayWiseHours);
                                                  }} placeholder="e.g. 09:00 - 18:00, Closed" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]" />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Real-time Preview block */}
                                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-lg p-3.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3 text-[#5fa6d9]" />
                                        Opening Hours Format Preview (Saves to database)
                                      </span>
                                    </div>
                                    <div className="w-full bg-transparent px-0 py-1 text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-pre-line">
                                      {openingHours || "Not set"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      {/* Section 7: Booking Policies & Cutoffs */}
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                          <CheckCircle2 className="w-4 h-4 text-[#5fa6d9]" />
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Booking Policies & Cutoffs</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Activity Lead Time
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                              <input
                                type="checkbox"
                                checked={leadTimeEnabled}
                                onChange={(e) => setLeadTimeEnabled(e.target.checked)}
                                className="w-4 h-4 rounded text-[#5fa6d9] focus:ring-[#5fa6d9] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 transition-colors"
                              />
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Enforce Booking Lead Time Cutoff
                              </span>
                            </label>
                            
                            {leadTimeEnabled && (
                              <div className="flex items-center gap-2 animate-in fade-in duration-200">
                                <input
                                  type="number"
                                  min="1"
                                  value={leadTimeValue}
                                  onChange={(e) => setLeadTimeValue(Number(e.target.value))}
                                  className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                                />
                                <select
                                  value={leadTimeUnit}
                                  onChange={(e) => setLeadTimeUnit(e.target.value as any)}
                                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                                >
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Last-Minute Booking Override
                            </label>
                            <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${allowLastMinuteBooking ? 'border-[#5fa6d9] bg-[#5fa6d9]/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'}`}>
                              <input
                                type="checkbox"
                                checked={allowLastMinuteBooking}
                                onChange={(e) => setAllowLastMinuteBooking(e.target.checked)}
                                className="w-4 h-4 rounded text-[#5fa6d9] focus:ring-[#5fa6d9] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 transition-colors"
                              />
                              <div>
                                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                                  Allow Last-Minute Bookings
                                </span>
                                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                                  Overrides lead time limits for unsold inventory.
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Tab Save Button */}
                      <div className="flex justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-md font-bold transition-colors shadow-sm text-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </button>
                      </div>

                    </div>
                  )}

                                    {/* TAB: Variants */}
                  {activeTab === "Variants" &&
                    (editingVariantId !== null ? (
                      renderVariantEditor()
                    ) : (
                      <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/60">
                        <div>
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Ticket Variants & Options</h3>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Configure custom age policies, included perks, and specific date/timeslot pricing rules.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newVariant: Variant = {
                              id: `var-${Date.now()}`,
                              name: "New Variant Option",
                              agePolicy: "All Ages",
                              notes: "",
                              priceIncludes: "",
                              otherDetails: "",
                              rules: []
                            };
                            setVariants([...variants, newVariant]);
                          }}
                          className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95c8] text-white text-xs font-black px-3 py-1.5 rounded-md transition-all shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Variant
                        </button>
                      </div>

                      {variants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                          <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                          <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">No Variants Configured</p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-md text-center font-semibold">
                            Each attraction can have multiple variants (e.g., Adult, Child, VIP Guided Tour) with their own date-specific pricing and inventory limits.
                          </p>
                          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                            <button
                              type="button"
                              onClick={() => {
                                const newVariant: Variant = {
                                  id: `var-${Date.now()}`,
                                  name: "Adult Ticket (General Admission)",
                                  agePolicy: "Age 18-64",
                                  notes: "Please arrive 15 minutes before the time slot.",
                                  priceIncludes: "General admission entry, audio guide app.",
                                  otherDetails: "Instant confirmation.",
                                  rules: []
                                };
                                setVariants([newVariant]);
                              }}
                              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#5fa6d9]/10 hover:bg-[#5fa6d9]/20 text-[#5fa6d9] text-xs font-black px-4 py-2.5 rounded-md transition-all cursor-pointer border border-[#5fa6d9]/20"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Default Variant
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const cleanName = name.includes(':') 
                                  ? name.split(':')[0] 
                                  : name.replace(/Entrance Tickets|Entrance Ticket|Tickets|Ticket/gi, '').trim();

                                const basePriceVal = Number(price) || 20;

                                const fetchedVariants: Variant[] = [
                                  {
                                    id: `var-general-${Date.now()}-1`,
                                    name: "General Admission Entrance Ticket",
                                    agePolicy: "All Ages",
                                    notes: "Timed entry slots guarantee immediate access without waiting.",
                                    priceIncludes: `Admission to ${cleanName} permanent collection.`,
                                    otherDetails: "Instant mobile voucher confirmation.",
                                    rules: [
                                      {
                                        id: `rule-gen-${Date.now()}-1`,
                                        date: new Date().toISOString().split('T')[0],
                                        timeSlot: "11:00 AM",
                                        price: basePriceVal,
                                        inventory: 150
                                      }
                                    ]
                                  },
                                  {
                                    id: `var-nonstop-${Date.now()}-2`,
                                    name: "Non-stop 2-Day Explorer Pass",
                                    agePolicy: "All Ages",
                                    notes: "Experience two days of unrestricted exploration.",
                                    priceIncludes: "Fast-track admission past standard queues.",
                                    otherDetails: "Flexible 48 Hours validity.",
                                    rules: [
                                      {
                                        id: `rule-ns-${Date.now()}-2`,
                                        date: new Date().toISOString().split('T')[0],
                                        timeSlot: "11:00 AM",
                                        price: Math.round(basePriceVal * 1.15),
                                        inventory: 100
                                      }
                                    ]
                                  },
                                  {
                                    id: `var-7day-${Date.now()}-3`,
                                    name: "2-Day Explorer Pass (Valid 7 Days)",
                                    agePolicy: "All Ages",
                                    notes: "Perfect for paced discovery of temporary galleries.",
                                    priceIncludes: "Visit twice at any time within a 7-day period.",
                                    otherDetails: "7 Days Validity from first use.",
                                    rules: [
                                      {
                                        id: `rule-7d-${Date.now()}-3`,
                                        date: new Date().toISOString().split('T')[0],
                                        timeSlot: "11:00 AM",
                                        price: Math.round(basePriceVal * 1.45),
                                        inventory: 80
                                      }
                                    ]
                                  }
                                ];
                                setVariants(fetchedVariants);
                              }}
                              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-md transition-all cursor-pointer shadow-sm"
                            >
                              <Sparkles className="w-3.5 h-3.5" /> Fetch & Sync All Existing Variants
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {variants.map((v) => {
                              return (
                                <div key={v.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                                   <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/60">
                                      <div className="flex items-center gap-3.5">
                                         <h4 className="font-bold text-[15px] text-slate-800 dark:text-white">{v.name}</h4>
                                         {v.isActive !== false ? (
                                           <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE
                                           </span>
                                         ) : (
                                           <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full">
                                             <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> INACTIVE
                                           </span>
                                         )}
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button type="button" onClick={() => setEditingVariantId(v.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer" title="Edit Variant">
                                          <Edit className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
                                        </button>
                                        <button type="button" onClick={() => {
                                          const cloned = {...v, id: `var-${Date.now()}`, name: v.name + " (Copy)"};
                                          setVariants([...variants, cloned]);
                                        }} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer" title="Clone Variant">
                                          <Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Clone</span>
                                        </button>
                                        <button type="button" onClick={() => {
                                          const updated = variants.map(item => item.id === v.id ? { ...item, isActive: v.isActive === false ? true : false } : item);
                                          setVariants(updated);
                                        }} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer" title={v.isActive === false ? "Make Active" : "Make Inactive"}>
                                          {v.isActive === false ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />} <span className="hidden sm:inline">{v.isActive === false ? "Active" : "Inactive"}</span>
                                        </button>
                                        <button type="button" onClick={() => {
                                          if (window.confirm(`Are you sure you want to delete this variant?`)) {
                                            setVariants(variants.filter(item => item.id !== v.id));
                                          }
                                        }} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer" title="Delete Variant">
                                          <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Delete</span>
                                        </button>                                      </div>
                                   </div>
                                   <div className="px-5 py-3.5 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px]">
                                     <div className="flex items-center gap-1.5"><span className="text-slate-400/90 font-medium">Price:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedCurrencyObj.symbol}{(v.basePrice || (v.rules && v.rules.length > 0 ? v.rules[0].price : 0)).toFixed(2)}</span></div>
                                     <div className="flex items-center gap-1.5"><span className="text-slate-400/90 font-medium">Duration:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{v.duration || "2 Hours"}</span></div>
                                     <div className="flex items-center gap-1.5"><span className="text-slate-400/90 font-medium">Language:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{v.language || "English"}</span></div>
                                     <div className="font-semibold text-slate-700 dark:text-slate-300">{v.isTicketed !== false ? "Ticketed" : "Not Ticketed"}</div>
                                     <div className="flex items-center gap-1.5"><span className="text-slate-400/90 font-medium">Transfer:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{v.transfer || "No"}</span></div>
                                   </div>
                                </div>
                              );
                            })}
                        </div>
                      )}

                      {/* Tab Save Button */}
                      <div className="flex justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-md font-bold transition-colors shadow-sm text-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                    )
                  )}



                  {/* TAB 3: Gallary */}
                  {activeTab === "Gallary" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* PRODUCT GALLERY CARD */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Image className="w-4 h-4 text-[#5fa6d9]" />
                            Product Gallery
                          </h3>
                        </div>
                        
                        <div className="p-6">
                          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#5fa6d9]/10 flex items-center justify-center mb-3">
                              <Image className="w-6 h-6 text-[#5fa6d9]" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              Add Media for this product
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 mb-4">
                              Upload images from your device or add via URL
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
                              <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors bg-white dark:bg-slate-900 shrink-0">
                                <Upload className="w-4 h-4 text-[#5fa6d9]" />
                                <span>Upload Media</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleGalleryFileChange}
                                  className="hidden"
                                />
                              </label>

                              <div className="flex w-full items-center gap-2">
                                <input
                                  type="text"
                                  value={newUrlInput}
                                  onChange={(e) => setNewUrlInput(e.target.value)}
                                  placeholder="Or paste direct image URL..."
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddUrlToGallery();
                                    }
                                  }}
                                  className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#5fa6d9]"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddUrlToGallery}
                                  className="px-3 py-2.5 bg-[#5fa6d9] hover:bg-[#4b8fb8] text-white rounded-md text-xs font-bold transition-colors shrink-0"
                                >
                                  Add
                                </button>
                              </div>
                            </div>



                          </div>
                        </div>
                      </div>

                      {/* HORIZONTAL SEPARATOR */}
                      <hr className="border-slate-200 dark:border-slate-800 my-4" />

                      {/* GALLERY ITEMS ROW & HEADER */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex flex-col">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                              Media for this Product
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              Manage order, set the primary cover image, or delete items
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setIsReordering(!isReordering)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors border flex items-center gap-1.5 ${
                              isReordering 
                                ? "bg-amber-500/10 border-amber-500 text-amber-500 hover:bg-amber-500/20" 
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            <span>{isReordering ? "Exit Reorder Mode" : "Reorder Media"}</span>
                          </button>
                        </div>

                        {galleryUrls.length === 0 ? (
                          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center bg-slate-50/20 dark:bg-slate-950/5">
                            <Image className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 font-medium">No media uploaded yet for this product.</p>
                            <p className="text-[10px] text-slate-400 mt-1">Upload a photo above to populate the product showcase.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {galleryUrls.map((url, index) => {
                              const isCover = url === imageUrl;
                              return (
                                <div 
                                  key={`${url}-${index}`}
                                  className={`relative group bg-white dark:bg-slate-900 rounded-xl border overflow-hidden shadow-sm hover:shadow transition-all duration-200 ${
                                    isCover ? "border-[#5fa6d9] ring-1 ring-[#5fa6d9]/40" : "border-slate-200 dark:border-slate-800"
                                  }`}
                                >
                                  {/* Aspect ratio frame */}
                                  <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                                    <img 
                                      src={url} 
                                      alt={`Gallery visual ${index + 1}`} 
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      referrerPolicy="no-referrer"
                                    />
                                    {isCover && (
                                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#5fa6d9] text-white text-[9px] font-black uppercase tracking-wider rounded shadow-sm">
                                        Cover Image
                                      </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      <button
                                        type="button"
                                        onClick={() => deleteGalleryItem(index)}
                                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow transition-colors"
                                        title="Delete image"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    
                                    {/* Position Index Badge */}
                                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-mono rounded">
                                      #{index + 1}
                                    </div>
                                  </div>

                                  {/* Footer with action bar / layout controls */}
                                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setImageUrl(url)}
                                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                                        isCover 
                                          ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20"
                                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                                      }`}
                                    >
                                      {isCover ? <Check className="w-3 h-3" /> : null}
                                      <span>{isCover ? "Active Cover" : "Make Cover"}</span>
                                    </button>

                                    {/* Navigation arrows for shifting/sorting */}
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() => moveLeft(index)}
                                        className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        title="Move left"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        disabled={index === galleryUrls.length - 1}
                                        onClick={() => moveRight(index)}
                                        className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        title="Move right"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Tab Save Button */}
                      <div className="flex justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-md font-bold transition-colors shadow-sm text-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 4: Live Ticket Preview */}
                  {activeTab === "Live Ticket Preview" && (
                    <div className="space-y-6 animate-in fade-in duration-300 flex flex-col items-center justify-start text-center py-4">
                      <div className="w-full text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#5fa6d9] animate-pulse" />
                          Live Customer Ticket Preview
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Review how this activity will render to travelers on the web application storefront in real-time as you modify parameters.
                        </p>
                      </div>

                      {/* Card Container Mock */}
                      <div className="w-full max-w-sm pointer-events-none text-left">
                        <AttractionCard 
                          attr={{
                            id: editingAttraction?.id || "preview-id",
                            name: name || "Untitled Activity Showcase",
                            location: location || "Mock Location",
                            city: city || "City",
                            category: category || "Category",
                            rating: 4.8,
                            reviewsCount: 12,
                            price: Number(price || 0),
                            discountPrice: discountPrice ? Number(discountPrice) : undefined,
                            imageUrl: imageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
                            isPopular: isPopular,
                            fastTrack: fastTrack,
                            region: region || "Europe",
                            description: description || "Enter a descriptive operational review description above to preview catalog text cards automatically.",
                            highlights: highlightsInput.split('\n').filter(Boolean),
                            included: includedInput.split('\n').filter(Boolean),
                            duration: duration || "Flexible",
                            provider: supplier || "Provider",
                            openingHours: openingHours || ""
                          }} 
                        />
                      </div>

                      {/* Info Tip block */}
                      <div className="w-full max-w-sm bg-[#f0f7fc] dark:bg-[#102738]/20 border border-[#e0f0fa] dark:border-[#1e4663]/30 p-4 rounded-lg flex gap-3 text-left">
                        <Sparkles className="w-5 h-5 text-[#5fa6d9] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-[#1e4663] dark:text-[#bce1f5]">Catalog Cohesiveness</p>
                          <p className="text-[10px] text-[#5fa6d9] dark:text-[#8ecaf0] leading-relaxed">
                            Always provide high-quality Unsplash cover links and precise regional tags so visitors can search with ease.
                          </p>
                        </div>
                      </div>

                      {/* Tab Save Button */}
                      <div className="flex justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/50 w-full">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-md font-bold transition-colors shadow-sm text-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              </form>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 gap-3">
              <button
                type="button"
                onClick={() => navigate("/inventory")}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="attraction-form"
                className="flex items-center gap-1.5 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-md font-bold transition-colors shadow-sm text-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Save Confirmation Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Do you want to save the changes ?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to save the changes for <strong className="text-slate-800 dark:text-white">"{name || "this attraction"}"</strong>? This will update the inventory on the website catalog.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={executeSave}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
