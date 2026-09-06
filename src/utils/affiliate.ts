import { Attraction, Variant, AffiliateClickLog } from '../types';
import { syncCustomAttractions } from '../data/mockData';

export const AFFILIATE_VENDORS = [
  'Main Website',
  'Official Website',
  'GetYourGuide',
  'Viator',
  'Tiqets',
  'Klook',
  'Headout',
  'Expedia Partner',
  'Civitatis',
  'Direct Partner'
] as const;

export function isValidAffiliateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    // Also allow URLs with dynamic tokens like https://example.com/{activity_id}
    return /^https?:\/\/.+/i.test(trimmed);
  }
}

/**
 * Direct token resolver utility for custom strings or admin test previews.
 */
export function resolveAffiliateUrlTokens(
  rawUrl: string,
  params?: {
    activityId?: string;
    variantId?: string;
    currency?: string;
    date?: string;
    city?: string;
    trackingParams?: string;
  }
): string {
  if (!rawUrl) return '';
  const now = new Date();
  const dateStr = params?.date || now.toISOString().split('T')[0];
  const currencyCode = params?.currency || 'EUR';
  const activityId = params?.activityId || 'sample-activity';
  const variantId = params?.variantId || '';
  const city = params?.city || '';

  let resolvedUrl = rawUrl.trim()
    .replace(/\{activity_id\}/gi, encodeURIComponent(activityId))
    .replace(/\{variant_id\}/gi, encodeURIComponent(variantId))
    .replace(/\{currency\}/gi, encodeURIComponent(currencyCode))
    .replace(/\{date\}/gi, encodeURIComponent(dateStr))
    .replace(/\{timestamp\}/gi, Date.now().toString())
    .replace(/\{city\}/gi, encodeURIComponent(city));

  const trackingParams = (params?.trackingParams || '').trim();
  if (trackingParams) {
    const separator = resolvedUrl.includes('?') ? '&' : '?';
    const cleanParams = trackingParams.startsWith('?') || trackingParams.startsWith('&')
      ? trackingParams.slice(1)
      : trackingParams;
    resolvedUrl = `${resolvedUrl}${separator}${cleanParams}`;
  }

  return resolvedUrl;
}

/**
 * Replaces dynamic placeholder tokens in the affiliate URL and appends tracking query parameters safely.
 * Supported tokens:
 *   {activity_id}   - Attraction product ID or ID
 *   {variant_id}    - Selected variant ID
 *   {currency}      - Selected or local currency code (e.g., EUR, USD)
 *   {date}          - Booking date formatted YYYY-MM-DD
 *   {timestamp}     - Current epoch timestamp
 *   {city}          - Destination city
 */
export function buildAffiliateUrl(
  attraction: Attraction,
  variant?: Variant | null,
  context?: {
    currency?: string;
    date?: string;
  }
): string {
  // Determine raw URL from variant affiliateConfig, variant affiliateUrl, or fallback attraction affiliateConfig
  const rawUrl = (
    variant?.affiliateConfig?.affiliateUrl ||
    variant?.affiliateUrl ||
    attraction.affiliateConfig?.affiliateUrl ||
    (attraction as any).affiliateUrl ||
    (attraction as any).website ||
    ''
  ).trim();
  if (!rawUrl) {
    return (attraction as any).website || 'https://tiqsey.com';
  }

  const trackingParams = (
    variant?.affiliateConfig?.trackingParams ||
    attraction.affiliateConfig?.trackingParams ||
    ''
  ).trim();

  return resolveAffiliateUrlTokens(rawUrl, {
    activityId: attraction.productId || attraction.id,
    variantId: variant?.id,
    currency: context?.currency || attraction.currency || 'EUR',
    date: context?.date,
    city: attraction.city,
    trackingParams: trackingParams
  });
}

const STORAGE_KEY_CLICK_LOGS = 'tiqsey_affiliate_click_logs';

export function getAffiliateClickLogs(): AffiliateClickLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_CLICK_LOGS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearAffiliateClickLogs(attractionId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (attractionId) {
      const logs = getAffiliateClickLogs().filter(l => l.attractionId !== attractionId);
      localStorage.setItem(STORAGE_KEY_CLICK_LOGS, JSON.stringify(logs));
    } else {
      localStorage.removeItem(STORAGE_KEY_CLICK_LOGS);
    }
  } catch (err) {
    console.error('Failed to clear affiliate click logs', err);
  }
}

/**
 * Records an outbound affiliate click event:
 * 1. Appends an entry to localStorage click logs
 * 2. Increments the attraction's affiliateConfig.clickCount
 * 3. Updates lastClickedAt timestamp
 * 4. Syncs the attractions catalog so admin reports reflect real-time counts
 * 5. Dispatches a window event for reactive UI updates
 */
export function recordAffiliateClick(
  attraction: Attraction,
  variant?: Variant | null,
  destinationUrl?: string,
  currency?: string
): void {
  if (typeof window === 'undefined') return;

  const nowIso = new Date().toISOString();
  const resolvedUrl = destinationUrl || buildAffiliateUrl(attraction, variant, { currency });

  const vendorName = variant?.affiliateConfig?.vendorName || attraction.affiliateConfig?.vendorName || 'Third-Party Partner';

  // 1. Log event
  try {
    const logs = getAffiliateClickLogs();
    const newLog: AffiliateClickLog = {
      id: `aff-click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      attractionId: attraction.id,
      attractionName: attraction.name,
      variantId: variant?.id,
      variantName: variant?.name,
      vendorName: vendorName,
      destinationUrl: resolvedUrl,
      clickedAt: nowIso,
      currency: currency || attraction.currency || 'EUR'
    };

    // Keep the most recent 300 logs
    const updatedLogs = [newLog, ...logs].slice(0, 300);
    localStorage.setItem(STORAGE_KEY_CLICK_LOGS, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Failed to write affiliate click log', e);
  }

  // 2. Update attraction & variant in storage & in memory
  try {
    const currentStored = localStorage.getItem('tiqsey_custom_attractions');
    if (currentStored) {
      const parsed: Attraction[] = JSON.parse(currentStored);
      const updatedList = parsed.map(item => {
        if (item.id === attraction.id) {
          const prevConfig = item.affiliateConfig || {};
          const updatedVariants = item.variants?.map(v => {
            if (variant && v.id === variant.id) {
              const prevVConfig = v.affiliateConfig || {};
              return {
                ...v,
                affiliateConfig: {
                  ...prevVConfig,
                  clickCount: (prevVConfig.clickCount || 0) + 1,
                  lastClickedAt: nowIso
                }
              };
            }
            return v;
          });

          return {
            ...item,
            variants: updatedVariants,
            affiliateConfig: {
              ...prevConfig,
              clickCount: (prevConfig.clickCount || 0) + 1,
              lastClickedAt: nowIso
            }
          };
        }
        return item;
      });
      syncCustomAttractions(updatedList);
    }
  } catch (e) {
    console.error('Failed to update attraction click count', e);
  }

  // 3. Dispatch reactive event
  try {
    window.dispatchEvent(
      new CustomEvent('tiqsey_affiliate_clicked', {
        detail: {
          attractionId: attraction.id,
          variantId: variant?.id,
          url: resolvedUrl,
          timestamp: nowIso
        }
      })
    );
  } catch (e) {
    console.error('Failed to dispatch affiliate clicked event', e);
  }
}
