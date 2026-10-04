import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { de } from './de';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';
import { zh } from './zh';
import { ru } from './ru';
import { ro } from './ro';
import { ar } from './ar';
import { ja } from './ja';
import { th } from './th';

export const allTranslations: Record<string, Record<string, string>> = {
  en,
  fr,
  es,
  de,
  it,
  nl,
  pl,
  zh,
  ru,
  ro,
  ar,
  ja,
  th,
};

// Category mapping helper
export const CATEGORY_TRANSLATION_MAP: Record<string, string> = {
  'Theme Parks': 'catThemeParks',
  'Theme Park': 'catThemeParks',
  'Water Parks': 'catThemeParks',
  'Museum': 'catMuseums',
  'Museums': 'catMuseums',
  'Arts': 'catArts',
  'Architecture': 'catLandmarks',
  'Architectural': 'catLandmarks',
  'Landmark': 'catLandmarks',
  'Landmarks': 'catLandmarks',
  'Monuments': 'catLandmarks',
  'Observation Deck': 'catObservationDecks',
  'Observation Decks': 'catObservationDecks',
  'Adventure': 'catAdventure',
  'Nature': 'catNature',
  'Park': 'catParks',
  'Parks & Gardens': 'catParks',
  'Show': 'catShows',
  'Shows & Events': 'catShows',
  'Entertainment': 'catShows',
  'Fun': 'catShows',
  'Food': 'catFood',
  'Cruise': 'catCruises',
  'Day Trips': 'catDayTrips',
  'City Tours': 'catCityTours',
  'Tour': 'catCityTours',
  'Card': 'cityPassTitle',
  'Historic Sites': 'catHistorical',
  'History': 'catHistorical',
  'Religious': 'catCultural',
  'Cultural': 'catCultural',
  'Zoos & Aquariums': 'catZoos',
};

// Region mapping helper
export const REGION_TRANSLATION_MAP: Record<string, string> = {
  'Asia': 'regionAsia',
  'Europe': 'regionEurope',
  'Middle East': 'regionMiddleEast',
  'North America': 'regionNorthAmerica',
  'South America': 'regionSouthAmerica',
  'Oceania': 'regionOceania',
  'Africa': 'regionAfrica',
};

// Status mapping helper
export const STATUS_TRANSLATION_MAP: Record<string, string> = {
  'confirmed': 'confirmedStatus',
  'pending': 'pendingStatus',
  'completed': 'completedStatus',
  'cancelled': 'cancelledStatus',
};
