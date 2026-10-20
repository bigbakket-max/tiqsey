import { PromotionalBanner, LargeHeroBannerConfig, LargeHeroBannerSlide } from '../types';

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

// ==========================================
// LARGE HOMEPAGE HERO BANNER (CAROUSEL)
// ==========================================

export const LARGE_BANNER_STORAGE_KEY = 'tiqsey_large_hero_banner_config';
export const LARGE_BANNER_UPDATE_EVENT = 'tiqsey_large_banner_updated';

export const LARGE_HERO_BANNER_VERSION = 'v4_rome_target';

export const DEFAULT_LARGE_HERO_BANNER_CONFIG: LargeHeroBannerConfig = {
  version: LARGE_HERO_BANNER_VERSION,
  isEnabled: true,
  autoPlayInterval: 6000,
  showPartnerBadges: true,
  slides: [
    {
      id: 'slide-rome-beyond',
      title: 'ROME BEYOND THE ORDINARY',
      subtitle: 'Colosseum • Vatican Museums • Sistine Chapel',
      partnerLogosText: 'TIQSEY VERIFIED  |  CURATED EXPERIENCES  |  INSTANT CONFIRMATION',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=85',
      ctaText: 'Explore Rome',
      destinationUrl: 'Rome',
      destinationType: 'destination',
      textStyle: 'modern-white',
      isActive: true,
      order: 1,
      highlightOffer: 'Priority Colosseum Arena Access, Vatican Museums & Sistine Chapel Tour'
    },
    {
      id: 'slide-dubai-unlocked',
      title: 'DUBAI UNLOCKED',
      subtitle: 'Burj Khalifa • Luxury Desert Safaris • Miracle Garden',
      partnerLogosText: 'TIQSEY VERIFIED  |  EMAAR OFFICIAL  |  BEST PRICE GUARANTEE',
      badgeText: 'HOT DEAL 25% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
      ctaText: 'Explore Dubai',
      destinationUrl: 'Dubai',
      destinationType: 'destination',
      textStyle: 'golden-glow',
      isActive: true,
      order: 2,
      highlightOffer: 'At The Top Level 124/125, Desert 4x4 Safari BBQ Dinners & Miracle Garden'
    },
    {
      id: 'slide-paris-essentials',
      title: 'PARIS ESSENTIALS',
      subtitle: 'The Louvre Museum • Eiffel Tower Summit • Seine Cruise',
      partnerLogosText: 'TIQSEY VERIFIED  |  PARIS CITY PASS  |  SKIP THE LINE',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=85',
      ctaText: 'Explore Paris',
      destinationUrl: 'Paris',
      destinationType: 'destination',
      textStyle: 'modern-white',
      isActive: true,
      order: 3,
      highlightOffer: 'Fast-Track Louvre Mona Lisa Passes & Eiffel Tower Summit Observatory'
    },
    {
      id: 'slide-nyc-highlights',
      title: 'NEW YORK PASS',
      subtitle: 'Edge NYC • 9/11 Memorial • Summit One Vanderbilt',
      partnerLogosText: 'TIQSEY VERIFIED  |  NYC TOURISM  |  MOBILE VOUCHER',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=85',
      ctaText: 'Explore NYC',
      destinationUrl: 'New York',
      destinationType: 'destination',
      textStyle: 'modern-white',
      isActive: true,
      order: 4,
      highlightOffer: '100th Floor Glass Floor Sky Deck & All-Inclusive Explorer Passes'
    },
    {
      id: 'slide-singapore-wonders',
      title: 'SINGAPORE WONDERS',
      subtitle: 'Gardens by the Bay • Universal Studios • Marina Bay',
      partnerLogosText: 'TIQSEY VERIFIED  |  SINGAPORE PASS  |  BEST PRICE',
      imageUrl: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&w=2000&q=85',
      ctaText: 'Explore Singapore',
      destinationUrl: 'Singapore',
      destinationType: 'destination',
      textStyle: 'modern-white',
      isActive: true,
      order: 5,
      highlightOffer: 'Supertree Observatory, Cloud Forest & Universal Studios Rides'
    }
  ]
};

export function getStoredLargeHeroBannerConfig(): LargeHeroBannerConfig {
  if (typeof window === 'undefined') return DEFAULT_LARGE_HERO_BANNER_CONFIG;
  try {
    const raw = localStorage.getItem(LARGE_BANNER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LARGE_BANNER_STORAGE_KEY, JSON.stringify(DEFAULT_LARGE_HERO_BANNER_CONFIG));
      return DEFAULT_LARGE_HERO_BANNER_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.slides)) {
      // Check if user has legacy mock slides or needs update to the latest Rome reference
      const isLatest = parsed.version === LARGE_HERO_BANNER_VERSION && parsed.slides.length > 0 && parsed.slides[0]?.id === 'slide-rome-beyond';
      if (!isLatest) {
        localStorage.setItem(LARGE_BANNER_STORAGE_KEY, JSON.stringify(DEFAULT_LARGE_HERO_BANNER_CONFIG));
        return DEFAULT_LARGE_HERO_BANNER_CONFIG;
      }
      parsed.slides.sort((a: LargeHeroBannerSlide, b: LargeHeroBannerSlide) => (a.order || 0) - (b.order || 0));
      return parsed;
    }
    return DEFAULT_LARGE_HERO_BANNER_CONFIG;
  } catch (err) {
    console.error('Error reading large hero banner config:', err);
    return DEFAULT_LARGE_HERO_BANNER_CONFIG;
  }
}

export function saveStoredLargeHeroBannerConfig(config: LargeHeroBannerConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const sorted = {
      ...config,
      slides: [...config.slides].sort((a, b) => (a.order || 0) - (b.order || 0))
    };
    localStorage.setItem(LARGE_BANNER_STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new Event(LARGE_BANNER_UPDATE_EVENT));
  } catch (err) {
    console.error('Error saving large hero banner config:', err);
  }
}

export function addLargeBannerSlide(slide: Omit<LargeHeroBannerSlide, 'id'>): LargeHeroBannerSlide {
  const config = getStoredLargeHeroBannerConfig();
  const id = `slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const newSlide: LargeHeroBannerSlide = {
    ...slide,
    id,
    order: slide.order !== undefined ? slide.order : config.slides.length + 1,
    createdAt: now,
    updatedAt: now
  };
  saveStoredLargeHeroBannerConfig({
    ...config,
    slides: [...config.slides, newSlide]
  });
  return newSlide;
}

export function updateLargeBannerSlide(slide: LargeHeroBannerSlide): LargeHeroBannerSlide {
  const config = getStoredLargeHeroBannerConfig();
  const updated: LargeHeroBannerSlide = {
    ...slide,
    updatedAt: new Date().toISOString()
  };
  const nextSlides = config.slides.map(s => s.id === slide.id ? updated : s);
  saveStoredLargeHeroBannerConfig({
    ...config,
    slides: nextSlides
  });
  return updated;
}

export function deleteLargeBannerSlide(id: string): void {
  const config = getStoredLargeHeroBannerConfig();
  const filtered = config.slides.filter(s => s.id !== id);
  const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
  saveStoredLargeHeroBannerConfig({
    ...config,
    slides: reindexed
  });
}

export function toggleLargeBannerSlide(id: string): boolean {
  const config = getStoredLargeHeroBannerConfig();
  let nextState = false;
  const nextSlides = config.slides.map(s => {
    if (s.id === id) {
      nextState = !s.isActive;
      return { ...s, isActive: nextState, updatedAt: new Date().toISOString() };
    }
    return s;
  });
  saveStoredLargeHeroBannerConfig({
    ...config,
    slides: nextSlides
  });
  return nextState;
}

export function reorderLargeBannerSlides(orderedIds: string[]): void {
  const config = getStoredLargeHeroBannerConfig();
  const map = new Map(config.slides.map(s => [s.id, s]));
  const reordered: LargeHeroBannerSlide[] = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      reordered.push({ ...item, order: idx + 1, updatedAt: new Date().toISOString() });
      map.delete(id);
    }
  });
  map.forEach(item => {
    reordered.push({ ...item, order: reordered.length + 1 });
  });
  saveStoredLargeHeroBannerConfig({
    ...config,
    slides: reordered
  });
}

export function resetLargeHeroBannerConfig(): void {
  saveStoredLargeHeroBannerConfig(DEFAULT_LARGE_HERO_BANNER_CONFIG);
}
