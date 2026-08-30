import { PromotionalBanner } from '../types';

export const BANNER_STORAGE_KEY = 'tiqsey_promotional_banners';
export const BANNER_UPDATE_EVENT = 'tiqsey_banners_updated';

export const DEFAULT_PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'banner-play-passes-1',
    template: 'play-passes',
    title: 'PLAY PASSES',
    subtitle: 'Grab all your',
    highlightText: 'HERE!',
    badgeText: 'PLAY DEAL',
    badgeIcon: 'flame',
    promoCode: 'TIQSEYPLAY',
    ctaText: 'Copy',
    destinationUrl: 'deals',
    destinationType: 'section',
    customBgColor: '#7700e6',
    termsText: 'CODE: TIQSEYPLAY',
    order: 1,
    isActive: true,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'banner-stadium-pass-2',
    template: 'stadium-pass',
    title: 'Match-Day Tours',
    subtitle: 'World Football Tournament',
    highlightText: '& Stadium Passes',
    badgeText: 'STADIUM PASS',
    badgeIcon: 'ticket',
    secondaryBadge: 'Guided Tours',
    ctaText: 'Explore Tickets',
    destinationUrl: 'tournament',
    destinationType: 'section',
    customBgColor: '#055c63',
    termsText: 'T&Cs apply',
    order: 2,
    isActive: true,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'banner-water-parks-3',
    template: 'water-parks',
    title: 'Swim, slide & save',
    subtitle: 'SUMMER Break',
    highlightText: 'Extra 15% off',
    badgeText: 'WATER PARKS',
    badgeIcon: 'compass',
    secondaryBadge: 'SUMMER Break',
    ctaText: 'Park Specials',
    destinationUrl: 'summer',
    destinationType: 'section',
    customBgColor: '#049408',
    termsText: 'T&Cs apply',
    order: 3,
    isActive: true,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'banner-city-guide-4',
    template: 'city-guide',
    title: 'KUALA LUMPUR',
    subtitle: 'Discover top picks in',
    highlightText: 'Explore iconic towers & culture',
    badgeText: 'CITY GUIDE',
    badgeIcon: 'landmark',
    secondaryBadge: 'Featured City',
    ctaText: 'Explore Now',
    destinationUrl: 'Kuala Lumpur',
    destinationType: 'destination',
    customBgColor: '#e11d48',
    customGradientFrom: '#db2777',
    customGradientTo: '#f59e0b',
    termsText: 'Best price guaranteed',
    order: 4,
    isActive: true,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  }
];

export function getStoredBanners(): PromotionalBanner[] {
  if (typeof window === 'undefined') return DEFAULT_PROMOTIONAL_BANNERS;
  
  try {
    const data = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(DEFAULT_PROMOTIONAL_BANNERS));
      return DEFAULT_PROMOTIONAL_BANNERS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return DEFAULT_PROMOTIONAL_BANNERS;
  } catch (err) {
    console.error('Error reading promotional banners from storage:', err);
    return DEFAULT_PROMOTIONAL_BANNERS;
  }
}

export function saveStoredBanners(banners: PromotionalBanner[]): void {
  if (typeof window === 'undefined') return;
  try {
    const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new Event(BANNER_UPDATE_EVENT));
  } catch (err) {
    console.error('Error saving promotional banners:', err);
  }
}

export function addBanner(banner: Omit<PromotionalBanner, 'id' | 'createdAt' | 'updatedAt'>): PromotionalBanner {
  const current = getStoredBanners();
  const id = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  
  const newBanner: PromotionalBanner = {
    ...banner,
    id,
    order: banner.order !== undefined ? banner.order : current.length + 1,
    createdAt: now,
    updatedAt: now
  };
  
  saveStoredBanners([...current, newBanner]);
  return newBanner;
}

export function updateBanner(banner: PromotionalBanner): PromotionalBanner {
  const current = getStoredBanners();
  const now = new Date().toISOString();
  const updated: PromotionalBanner = {
    ...banner,
    updatedAt: now
  };
  
  const next = current.map(b => b.id === banner.id ? updated : b);
  saveStoredBanners(next);
  return updated;
}

export function deleteBanner(id: string): void {
  const current = getStoredBanners();
  const filtered = current.filter(b => b.id !== id);
  // Re-index orders to stay sequential
  const reindexed = filtered.map((b, idx) => ({ ...b, order: idx + 1 }));
  saveStoredBanners(reindexed);
}

export function toggleBannerStatus(id: string): boolean {
  const current = getStoredBanners();
  let nextState = false;
  const updated = current.map(b => {
    if (b.id === id) {
      nextState = !b.isActive;
      return { ...b, isActive: nextState, updatedAt: new Date().toISOString() };
    }
    return b;
  });
  saveStoredBanners(updated);
  return nextState;
}

export function reorderBanners(orderedIds: string[]): void {
  const current = getStoredBanners();
  const map = new Map(current.map(b => [b.id, b]));
  
  const reordered: PromotionalBanner[] = [];
  orderedIds.forEach((id, index) => {
    const item = map.get(id);
    if (item) {
      reordered.push({ ...item, order: index + 1, updatedAt: new Date().toISOString() });
      map.delete(id);
    }
  });
  
  // Append any remainder
  map.forEach(item => {
    reordered.push({ ...item, order: reordered.length + 1 });
  });
  
  saveStoredBanners(reordered);
}

export function duplicateBanner(id: string): PromotionalBanner | null {
  const current = getStoredBanners();
  const item = current.find(b => b.id === id);
  if (!item) return null;
  
  const now = new Date().toISOString();
  const newId = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const duplicated: PromotionalBanner = {
    ...item,
    id: newId,
    title: `${item.title} (Copy)`,
    order: item.order + 1,
    createdAt: now,
    updatedAt: now
  };
  
  const next = [...current];
  const targetIndex = current.findIndex(b => b.id === id);
  next.splice(targetIndex + 1, 0, duplicated);
  
  // Re-index orders
  const reindexed = next.map((b, idx) => ({ ...b, order: idx + 1 }));
  saveStoredBanners(reindexed);
  return duplicated;
}

export function resetToDefaultBanners(): void {
  saveStoredBanners(DEFAULT_PROMOTIONAL_BANNERS);
}
