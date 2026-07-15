export interface Attraction {
  id: string;
  name: string;
  location: string;
  city: string;
  category: string;
  rating: number;
  reviewsCount: number;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  isPopular?: boolean;
  region?: string;
  description?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  knowBeforeYouGo?: string[];
  whatToBring?: string[];
  duration?: string;
  cancellationPolicy?: string;
  galleryUrls?: string[];
  provider?: string;
  fastTrack?: boolean;
  liveGuide?: string;
  maxGroupSize?: number;
  openingHours?: string;
}

export interface Destination {
  id: string;
  name: string;
  attractionsCount: number;
  imageUrl: string;
}

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to EUR (base)
};

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  role?: 'admin' | 'user';
}

export interface Booking {
  id: string;
  attractionId: string;
  attractionName: string;
  attractionImageUrl: string;
  city: string;
  bookingDate: string;
  ticketsCount: number;
  totalPrice: number;
  bookingRef: string; // e.g. TQ-104925-NL
  order_number?: string;
  pnr_number?: string;
  orderId?: string;
  timeslot?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  rating?: number;
  childCount?: number;
  guestInfo?: { name: string; email: string; passengers?: any[] };
  passengers?: any[];
  createdAt?: string;
}

