import { fetchJsonSafely, isSafeNavigationUrl } from './safeFetch';
import { POPULAR_ATTRACTIONS } from '../data/mockData';

export type AdminConfigSection =
  | 'website_settings'
  | 'theme_settings'
  | 'navigation_menus'
  | 'platform_settings'
  | 'marketing_coupons';

export interface WebsiteSettingsConfig {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
  seoTitle: string;
  seoDescription: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
}

export interface ThemeSettingsConfig {
  defaultColorMode: 'light' | 'dark' | 'system';
  heroStyle: 'split-editorial' | 'immersive-search' | 'compact-catalog';
  cardDensity: 'comfortable' | 'compact';
  borderRadius: 'sharp' | 'rounded' | 'soft';
  showAnnouncementBar: boolean;
  announcementText: string;
  enableMotionEffects: boolean;
  showInstantConfirmationBadge: boolean;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  url: string;
  visible: boolean;
  openInNewTab: boolean;
}

export interface NavigationMenusConfig {
  headerItems: NavigationMenuItem[];
  footerItems: NavigationMenuItem[];
}

export interface PlatformSettingsConfig {
  defaultCurrency: 'EUR' | 'USD' | 'GBP' | 'AED' | 'INR';
  defaultLanguage: 'en' | 'es' | 'fr' | 'de' | 'it';
  timezone: string;
  bookingPrefix: string;
  taxPercent: number;
  serviceFeePercent: number;
  autoConfirmBookings: boolean;
  emailNewBookingAlerts: boolean;
  emailCancellationAlerts: boolean;
  emailDailyDigest: boolean;
}

export interface MarketingCoupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  bookingRef: string;
  subject: string;
  category: 'Booking' | 'Refund' | 'Tickets' | 'Account' | 'Technical' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  message: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveBookingRecord {
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
  totalPrice: number;
  collectedAmount: number;
  travelers: number;
  bookingDate: string;
  status: string;
  city?: string;
  source?: string;
  paymentCurrency?: string;
  paymentPrice?: number;
  paymentSymbol?: string;
}

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsConfig = {
  siteName: 'Tiqsey',
  tagline: 'More Culture, More Experience',
  supportEmail: 'support@tiqsey.com',
  supportPhone: '+31 20 808 4210',
  officeAddress: 'Keizersgracht 482, 1017 EG Amsterdam, Netherlands',
  seoTitle: 'Tiqsey — Official Museum Tickets, Landmarks & Skip-the-Line Passes',
  seoDescription:
    'Book instant mobile tickets for top museums, attractions, and cultural experiences worldwide with verified availability and zero-queue entry.',
  maintenanceMode: false,
  maintenanceMessage: 'We are performing brief scheduled maintenance. Bookings will resume shortly.',
  socialLinks: {
    instagram: 'https://instagram.com/tiqsey_official',
    facebook: 'https://facebook.com/tiqsey',
    twitter: 'https://x.com/tiqsey',
    youtube: 'https://youtube.com/@tiqsey',
  },
};

export const DEFAULT_THEME_SETTINGS: ThemeSettingsConfig = {
  defaultColorMode: 'light',
  heroStyle: 'immersive-search',
  cardDensity: 'comfortable',
  borderRadius: 'rounded',
  showAnnouncementBar: true,
  announcementText: 'Instant mobile tickets & free cancellation up to 24h before your visit.',
  enableMotionEffects: true,
  showInstantConfirmationBadge: true,
};

export const DEFAULT_NAVIGATION_MENUS: NavigationMenusConfig = {
  headerItems: [
    { id: 'hdr-1', label: 'Explore Attractions', url: '/attractions', visible: true, openInNewTab: false },
    { id: 'hdr-2', label: 'Top Cities', url: '/#cities', visible: true, openInNewTab: false },
    { id: 'hdr-3', label: 'Travel Blog', url: '/blog', visible: true, openInNewTab: false },
    { id: 'hdr-4', label: 'My Bookings', url: '/bookings', visible: true, openInNewTab: false },
  ],
  footerItems: [
    { id: 'ftr-1', label: 'About Tiqsey', url: '/about', visible: true, openInNewTab: false },
    { id: 'ftr-2', label: 'Help Center', url: '/help', visible: true, openInNewTab: false },
    { id: 'ftr-3', label: 'Privacy Policy', url: '/privacy', visible: true, openInNewTab: false },
    { id: 'ftr-4', label: 'Terms of Service', url: '/terms', visible: true, openInNewTab: false },
  ],
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsConfig = {
  defaultCurrency: 'EUR',
  defaultLanguage: 'en',
  timezone: 'Europe/Amsterdam',
  bookingPrefix: 'TIQ-',
  taxPercent: 9,
  serviceFeePercent: 2.5,
  autoConfirmBookings: true,
  emailNewBookingAlerts: true,
  emailCancellationAlerts: true,
  emailDailyDigest: false,
};

export const DEFAULT_COUPONS: MarketingCoupon[] = [
  {
    id: 'cpn-welcome10',
    code: 'WELCOME10',
    description: '10% off first cultural experience or museum booking',
    discountType: 'percent',
    discountValue: 10,
    minOrderValue: 40,
    maxUses: 500,
    usedCount: 124,
    expiresAt: '2026-12-31',
    status: 'active',
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'cpn-culture15',
    code: 'CULTURE15',
    description: '€15 instant savings on European museum bundles over €120',
    discountType: 'fixed',
    discountValue: 15,
    minOrderValue: 120,
    maxUses: 250,
    usedCount: 68,
    expiresAt: '2026-10-30',
    status: 'active',
    createdAt: '2026-03-10T11:30:00.000Z',
  },
];

const LOCAL_CONFIG_PREFIX = 'tiqsey_admin_config_v1_';
const LOCAL_TICKETS_KEY = 'tiqsey_admin_support_tickets_v1';

function buildAdminHeaders(adminEmail?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (adminEmail) {
    headers['x-admin-email'] = adminEmail;
  }
  return headers;
}

export async function loadAdminConfig<T>(
  section: AdminConfigSection,
  adminEmail: string | undefined,
  fallback: T
): Promise<{ data: T; source: 'server' | 'local' | 'default'; updatedAt: string | null }> {
  const res = await fetchJsonSafely<{ success?: boolean; value?: T | null; updatedAt?: string | null }>(
    `/api/admin/config/${encodeURIComponent(section)}`,
    {
      method: 'GET',
      headers: buildAdminHeaders(adminEmail),
      credentials: 'include',
    }
  );

  if (res.ok && res.data?.success && res.data.value !== null && res.data.value !== undefined) {
    try {
      localStorage.setItem(`${LOCAL_CONFIG_PREFIX}${section}`, JSON.stringify(res.data.value));
    } catch {
      // Ignore storage quota error
    }
    return {
      data: res.data.value,
      source: 'server',
      updatedAt: res.data.updatedAt || null,
    };
  }

  try {
    const raw = localStorage.getItem(`${LOCAL_CONFIG_PREFIX}${section}`);
    if (raw) {
      return {
        data: JSON.parse(raw) as T,
        source: 'local',
        updatedAt: null,
      };
    }
  } catch {
    // Ignore parse error
  }

  return { data: fallback, source: 'default', updatedAt: null };
}

export async function saveAdminConfig<T>(
  section: AdminConfigSection,
  value: T,
  adminEmail: string | undefined
): Promise<{ ok: boolean; source: 'server' | 'local'; error?: string; updatedAt?: string }> {
  try {
    localStorage.setItem(`${LOCAL_CONFIG_PREFIX}${section}`, JSON.stringify(value));
  } catch {
    // Ignore quota errors
  }

  const res = await fetchJsonSafely<{ success?: boolean; error?: string; updatedAt?: string }>(
    `/api/admin/config/${encodeURIComponent(section)}`,
    {
      method: 'PUT',
      headers: buildAdminHeaders(adminEmail),
      credentials: 'include',
      body: JSON.stringify({ value, adminEmail }),
    }
  );

  if (res.ok && res.data?.success) {
    return { ok: true, source: 'server', updatedAt: res.data.updatedAt };
  }

  // If server returned a validation/auth error JSON, propagate it
  if (res.isJson && res.status >= 400 && res.status < 500 && res.data?.error) {
    return { ok: false, source: 'local', error: res.data.error };
  }

  // Static deployment or offline fallback succeeded via localStorage
  return { ok: true, source: 'local', updatedAt: new Date().toISOString() };
}

export function parseSafeTimestamp(val?: string | null): number {
  if (!val) return 0;
  const parsed = Date.parse(val);
  if (!Number.isNaN(parsed)) return parsed;
  // Normalize formats like "17 Jul 2026 09:12 PM" for Safari compatibility
  const match = String(val).trim().match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})(?:\s*(AM|PM))?)?$/i);
  if (match) {
    const [, dayStr, monStr, yearStr, hourStr, minStr, ampm] = match;
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const m = months[monStr.slice(0, 3).toLowerCase()];
    if (m !== undefined) {
      let hours = hourStr ? Number(hourStr) : 0;
      const mins = minStr ? Number(minStr) : 0;
      if (ampm) {
        const up = ampm.toUpperCase();
        if (up === 'PM' && hours < 12) hours += 12;
        if (up === 'AM' && hours === 12) hours = 0;
      }
      const d = new Date(Number(yearStr), m, Number(dayStr), hours, mins);
      if (!Number.isNaN(d.getTime())) return d.getTime();
    }
  }
  return 0;
}

export function formatSafeDate(val?: string | null): string {
  const ts = parseSafeTimestamp(val);
  if (!ts) return val ? String(val) : '—';
  return new Date(ts).toLocaleDateString();
}

export function formatSafeDateTime(val?: string | null): string {
  const ts = parseSafeTimestamp(val);
  if (!ts) return val ? String(val) : '—';
  return new Date(ts).toLocaleString();
}

export function toSafeIsoString(val?: string | null): string {
  const ts = parseSafeTimestamp(val);
  if (!ts) return val ? String(val) : '';
  return new Date(ts).toISOString();
}

function normalizeBookingRecord(raw: any): LiveBookingRecord {
  const totalPrice = Number(raw?.totalPrice ?? raw?.total_price ?? raw?.price ?? 0) || 0;
  const collectedAmount = Number(raw?.collectedAmount ?? raw?.collected_amount ?? totalPrice) || 0;
  const guest = raw?.guestInfo && typeof raw.guestInfo === 'object' ? raw.guestInfo : {};
  const customerName = String(
    raw?.customerName ||
      raw?.customer_name ||
      guest?.name ||
      raw?.guest_name ||
      raw?.userName ||
      'Guest Customer'
  ).trim() || 'Guest Customer';
  const customerEmail = String(
    raw?.customerEmail ||
      raw?.customer_email ||
      guest?.email ||
      raw?.guest_email ||
      raw?.userEmail ||
      ''
  ).trim();
  const customerPhone = String(
    raw?.customerPhone ||
      raw?.customer_phone ||
      guest?.phone ||
      raw?.guest_phone ||
      ''
  ).trim();
  const travelers =
    Number(raw?.ticketsCount ?? raw?.tickets_count ?? raw?.travelers ?? raw?.guests ?? 1) || 1;

  return {
    id: String(raw?.id || raw?.bookingRef || raw?.booking_ref || Math.random().toString(36).slice(2)),
    bookingRef: String(raw?.bookingRef || raw?.booking_ref || raw?.pnr_number || raw?.orderId || 'N/A'),
    orderId: String(raw?.orderId || raw?.order_number || raw?.bookingRef || raw?.id || 'N/A'),
    customerName,
    customerEmail,
    customerPhone,
    createdAt: String(raw?.createdAt || raw?.created_at || new Date().toISOString()),
    attractionId: String(raw?.attractionId || raw?.attraction_id || ''),
    attractionName: String(raw?.attractionName || raw?.attraction_name || raw?.title || 'Tiqsey Experience'),
    variant: String(raw?.variant || raw?.optionName || 'Standard Admission'),
    totalPrice,
    collectedAmount,
    travelers,
    bookingDate: String(raw?.bookingDate || raw?.booking_date || raw?.date || ''),
    status: String(raw?.status || 'confirmed').toLowerCase(),
    city: raw?.city ? String(raw.city) : undefined,
    source: raw?.source ? String(raw.source) : 'Direct Website',
    paymentCurrency: raw?.paymentCurrency || raw?.payment_currency || 'EUR',
    paymentPrice: Number(raw?.paymentPrice ?? raw?.payment_price ?? totalPrice) || totalPrice,
    paymentSymbol: raw?.paymentSymbol || raw?.payment_symbol || '€',
  };
}

export async function fetchAdminLiveBookings(adminEmail?: string): Promise<LiveBookingRecord[]> {
  const res = await fetchJsonSafely<any>('/api/bookings', {
    method: 'GET',
    headers: buildAdminHeaders(adminEmail),
    credentials: 'include',
  });

  let rows: any[] = [];
  if (res.ok && res.data) {
    if (Array.isArray(res.data)) {
      rows = res.data;
    } else if (Array.isArray(res.data.bookings)) {
      rows = res.data.bookings;
    } else if (Array.isArray(res.data.data)) {
      rows = res.data.data;
    }
  }

  if (rows.length === 0) {
    for (const key of ['tiqsey_bookings', 'tiqsey_admin_bookings', 'bookings']) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            rows = parsed;
            break;
          }
        }
      } catch {
        // Ignore parse error
      }
    }
  }

  return rows.map(normalizeBookingRecord).sort((a, b) => {
    return parseSafeTimestamp(b.createdAt) - parseSafeTimestamp(a.createdAt);
  });
}

export async function fetchAdminLiveAttractions(): Promise<
  Array<{ id: string; name: string; city: string; category: string; price: number }>
> {
  const res = await fetchJsonSafely<any>('/api/inventory/attractions', {
    method: 'GET',
    credentials: 'include',
  });
  let list: any[] = [];
  if (res.ok && res.data) {
    if (Array.isArray(res.data)) list = res.data;
    else if (Array.isArray(res.data.attractions)) list = res.data.attractions;
  }
  if (list.length === 0) {
    list = POPULAR_ATTRACTIONS as any[];
  }
  return list.map((a) => ({
    id: String(a.id || ''),
    name: String(a.name || a.title || 'Untitled Activity'),
    city: String(a.city || a.destination || 'Global'),
    category: String(a.category || 'Experience'),
    price: Number(a.price ?? a.startingPrice ?? 0) || 0,
  }));
}

export async function loadSupportTickets(adminEmail?: string): Promise<{
  tickets: SupportTicket[];
  source: 'server' | 'local';
}> {
  const res = await fetchJsonSafely<{ success?: boolean; tickets?: SupportTicket[] }>(
    '/api/admin/support/tickets',
    {
      method: 'GET',
      headers: buildAdminHeaders(adminEmail),
      credentials: 'include',
    }
  );
  if (res.ok && res.data?.success && Array.isArray(res.data.tickets)) {
    try {
      localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(res.data.tickets));
    } catch {
      // Ignore
    }
    return { tickets: res.data.tickets, source: 'server' };
  }

  try {
    const raw = localStorage.getItem(LOCAL_TICKETS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { tickets: parsed as SupportTicket[], source: 'local' };
      }
    }
  } catch {
    // Ignore
  }
  return { tickets: [], source: 'local' };
}

export async function createSupportTicket(
  input: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>,
  adminEmail?: string
): Promise<{ ok: boolean; ticket?: SupportTicket; error?: string }> {
  const res = await fetchJsonSafely<{ success?: boolean; ticket?: SupportTicket; error?: string }>(
    '/api/admin/support/tickets',
    {
      method: 'POST',
      headers: buildAdminHeaders(adminEmail),
      credentials: 'include',
      body: JSON.stringify({ ...input, adminEmail }),
    }
  );

  if (res.ok && res.data?.success && res.data.ticket) {
    return { ok: true, ticket: res.data.ticket };
  }
  if (res.isJson && res.status >= 400 && res.status < 500 && res.data?.error) {
    return { ok: false, error: res.data.error };
  }

  // Local fallback
  const now = new Date().toISOString();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const localTicket: SupportTicket = {
    ...input,
    id: `tkt_local_${Date.now()}`,
    ticketNumber: `SUP-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${suffix}`,
    createdAt: now,
    updatedAt: now,
  };
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_TICKETS_KEY) || '[]');
    const updated = [localTicket, ...(Array.isArray(existing) ? existing : [])];
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return { ok: true, ticket: localTicket };
}

export async function updateSupportTicket(
  id: string,
  patch: Partial<Pick<SupportTicket, 'status' | 'priority' | 'category' | 'subject' | 'internalNotes'>>,
  adminEmail?: string
): Promise<{ ok: boolean; ticket?: SupportTicket; error?: string }> {
  const res = await fetchJsonSafely<{ success?: boolean; ticket?: SupportTicket; error?: string }>(
    `/api/admin/support/tickets/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: buildAdminHeaders(adminEmail),
      credentials: 'include',
      body: JSON.stringify({ ...patch, adminEmail }),
    }
  );
  if (res.ok && res.data?.success && res.data.ticket) {
    return { ok: true, ticket: res.data.ticket };
  }
  if (res.isJson && res.status >= 400 && res.status < 500 && res.data?.error) {
    return { ok: false, error: res.data.error };
  }

  // Local fallback
  try {
    const existing: SupportTicket[] = JSON.parse(localStorage.getItem(LOCAL_TICKETS_KEY) || '[]');
    let found: SupportTicket | undefined;
    const next = existing.map((t) => {
      if (t.id === id) {
        found = { ...t, ...patch, updatedAt: new Date().toISOString() };
        return found;
      }
      return t;
    });
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(next));
    if (found) return { ok: true, ticket: found };
  } catch {
    // Ignore
  }
  return { ok: false, error: 'Unable to update ticket.' };
}

export async function deleteSupportTicket(
  id: string,
  adminEmail?: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetchJsonSafely<{ success?: boolean; error?: string }>(
    `/api/admin/support/tickets/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: buildAdminHeaders(adminEmail),
      credentials: 'include',
    }
  );
  if (res.ok && res.data?.success) {
    return { ok: true };
  }
  if (res.isJson && res.status >= 400 && res.status < 500 && res.data?.error) {
    return { ok: false, error: res.data.error };
  }

  try {
    const existing: SupportTicket[] = JSON.parse(localStorage.getItem(LOCAL_TICKETS_KEY) || '[]');
    localStorage.setItem(
      LOCAL_TICKETS_KEY,
      JSON.stringify(existing.filter((t) => t.id !== id))
    );
    return { ok: true };
  } catch {
    return { ok: false, error: 'Unable to delete ticket.' };
  }
}

export function sanitizeUrlOrEmpty(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  return isSafeNavigationUrl(trimmed) ? trimmed : '';
}

/**
 * Exports tabular data to CSV while neutralizing leading formula characters
 * (=, +, -, @, tab, CR) to prevent spreadsheet formula injection.
 */
export function exportRowsToCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number | boolean | null | undefined>>
): void {
  const escapeCell = (raw: string | number | boolean | null | undefined): string => {
    let str = raw === null || raw === undefined ? '' : String(raw);
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
