import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Currency, Theme } from '../types';

export const CURRENCIES: Currency[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 1 },
  { code: 'USD', name: 'United States Dollar', symbol: '$', rate: 1.08 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.86 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rate: 1.63 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.48 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.98 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 7.46 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 11.60 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 4.30 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 11.40 },
  { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'د.إ', rate: 3.97 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rate: 390 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.46 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 8.44 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 168 },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', rate: 4200 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', rate: 1.78 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 5.10 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 25.10 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rate: 18.20 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 90 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 39.5 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.50 },
  { code: 'AZN', name: 'Azerbaijani manat', symbol: '₼', rate: 1.84 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', rate: 0.41 },
  { code: 'BYN', name: 'Belarusian ruble', symbol: 'Br', rate: 3.53 },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', rate: 1010 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.82 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 17400 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', rate: 4.02 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', rate: 0.77 },
  { code: 'KRW', name: 'Korean Won', symbol: '₩', rate: 1480 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 0.33 },
  { code: 'KZT', name: 'Kazakhstani tenge', symbol: '₸', rate: 480 },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', rate: 23100 },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', rate: 3755 },
  { code: 'MOP', name: 'Macau Pataca', symbol: 'MOP$', rate: 8.70 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', rate: 0.42 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 63.4 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 301 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', rate: 3.93 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 97.5 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', rate: 4.05 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 35.1 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', rate: 34.9 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 27500 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 19.8 },
];

const detectLocalCurrencyCode = (): string => {
  try {
    // 1. Try Intl API
    const intlCurrency = Intl.NumberFormat().resolvedOptions().currency;
    if (intlCurrency && CURRENCIES.some(c => c.code === intlCurrency)) {
      return intlCurrency;
    }
  } catch (e) {
    console.warn('Intl currency detection error:', e);
  }

  // 2. Try browser locale fallback
  try {
    const locale = navigator.language || (navigator.languages && navigator.languages[0]) || '';
    const uppercaseLocale = locale.toUpperCase();
    if (uppercaseLocale.includes('IN')) return 'INR';
    if (uppercaseLocale.includes('GB')) return 'GBP';
    if (uppercaseLocale.includes('AE')) return 'AED';
    if (uppercaseLocale.includes('SG')) return 'SGD';
    if (uppercaseLocale.includes('US')) return 'USD';
    
    // Eurozone countries
    const euroLocales = ['FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'AT', 'FI', 'GR', 'IE', 'PT'];
    if (euroLocales.some(el => uppercaseLocale.includes(el))) return 'EUR';
  } catch (e) {
    console.warn('Navigator locale detection error:', e);
  }

  return 'USD'; // Default fallback
};

interface SettingsContextType {
  currency: Currency;
  detectedLocalCurrency: Currency;
  theme: Theme;
  setCurrency: (curr: Currency) => void;
  setTheme: (theme: Theme) => void;
  formatPrice: (priceInEur: number) => string;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Simple translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    heroTitle: 'The world is',
    heroTitleHighlight: 'waiting',
    heroSubtitle: 'Discover the most popular landmarks, museums, and hidden gems in the world\'s most beautiful cities.',
    searchPlaceholder: 'Search places and things to do',
    popularDestinations: 'Popular destinations',
    topRatedAttractions: 'Popular attractions',
    getTickets: 'Get tickets',
    from: 'From',
    discoverMore: 'Load More',
    whyBook: 'Why book with',
    mobileTickets: 'Trusted by thousands',
    mobileTicketsSub: 'Over 12M+ happy customers',
    unbeatableValue: 'Unbeatable Value',
    unbeatableValueSub: 'Price guarantee',
    flexibleBooking: 'Flexible Booking',
    flexibleBookingSub: 'Cancel up to 24h in advance',
    navHome: 'Home',
    navHotDeals: 'Hot Deals',
    navAttractionsAndTours: 'Attractions & Museums',
    navRegions: 'Regions',
    navCities: 'Destinations',
    navGoCityPass: 'City Pass',
    navFavorites: 'Favorites',
    navSignIn: 'Sign in',
    navMyAccount: 'My Account',
    trustRating: '4.8/5 Rating',
    securePayments: 'Secure Payments',
    securePaymentsSub: '100% Protection',
    instantBooking: 'Instant Booking',
    instantBookingSub: 'Get it in seconds',
    specialOffers: 'Special Offers',
    adBannerHighlight: 'Book now and get up to 30% off on your next trip to top curated landmarks!',
    getBestDeals: 'Get Best Deals',
    newsletterTitle: 'Stay in the loop',
    newsletterSubtitle: 'Join our newsletter and receive a discount code for your next booking. Plus, get travel tips and early access to deals.',
    yourEmail: 'Your email address',
    subscribe: 'Subscribe',
    regionLanguage: 'Region & Language',
    theme: 'Theme',
    wishlist: 'Wishlist',
    allRightsReserved: 'All rights reserved.',
    followUs: 'Follow Us',
    curatedSelection: 'Curated selection'
  },
  fr: {
    heroTitle: 'Le monde vous',
    heroTitleHighlight: 'attend',
    heroSubtitle: 'Découvrez les monuments, musées et trésors cachés les plus populaires des plus belles villes du monde.',
    searchPlaceholder: 'Rechercher des lieux et des activités',
    popularDestinations: 'Destinations populaires',
    topRatedAttractions: 'Attractions populaires',
    getTickets: 'Réserver des billets',
    from: 'À partir de',
    discoverMore: 'Charger plus',
    whyBook: 'Pourquoi réserver avec',
    mobileTickets: 'Confiance par milliers',
    mobileTicketsSub: 'Plus de 12M+ clients heureux',
    unbeatableValue: 'Valeur imbattable',
    unbeatableValueSub: 'Garantie de prix',
    flexibleBooking: 'Réservation Flexible',
    flexibleBookingSub: 'Annulez jusqu\'à 24h à l\'avance',
    navHome: 'Accueil',
    navHotDeals: 'Offres Chaudes',
    navAttractionsAndTours: 'Activités',
    navRegions: 'Régions',
    navCities: 'Destinations',
    navGoCityPass: 'Pass Ville',
    navFavorites: 'Favoris',
    navSignIn: 'Se connecter',
    navMyAccount: 'Mon Compte',
    trustRating: 'Évaluation 4.8/5',
    securePayments: 'Paiements Sécurisés',
    securePaymentsSub: 'Protection 100%',
    instantBooking: 'Réservation Instantanée',
    instantBookingSub: 'Obtenez en secondes',
    specialOffers: 'Offres Spéciales',
    adBannerHighlight: 'Réservez maintenant et obtenez jusqu\'à 30% de réduction sur votre prochain voyage vers des lieux précieux !',
    getBestDeals: 'Profiter des offres',
    newsletterTitle: 'Restez informé',
    newsletterSubtitle: 'Rejoignez notre newsletter et recevez un code de réduction pour votre prochaine réservation. Plus des conseils de voyage !',
    yourEmail: 'Votre adresse email',
    subscribe: 'S\'abonner',
    regionLanguage: 'Région et langue',
    theme: 'Thème',
    wishlist: 'Liste d\'envies',
    allRightsReserved: 'Tous droits réservés.',
    followUs: 'Suivez-nous',
    curatedSelection: 'Sélection triée'
  },
  de: {
    heroTitle: 'Die Welt',
    heroTitleHighlight: 'wartet',
    heroSubtitle: 'Entdecken Sie die beliebtesten Sehenswürdigkeiten, Museen und verborgenen Schätze in den schönsten Städten der Welt.',
    searchPlaceholder: 'Nach Orten und Aktivitäten suchen',
    popularDestinations: 'Beliebte Reiseziele',
    topRatedAttractions: 'Beliebte Attraktionen',
    getTickets: 'Tickets sichern',
    from: 'Ab',
    discoverMore: 'Mehr laden',
    whyBook: 'Warum bei uns buchen?',
    mobileTickets: 'Vertraut von Tausenden',
    mobileTicketsSub: 'Über 12 Mio. zufriedene Kunden',
    unbeatableValue: 'Unschlagbarer Wert',
    unbeatableValueSub: 'Preisgarantie',
    flexibleBooking: 'Flexible Buchung',
    flexibleBookingSub: 'Bis zu 24h vorher stornieren',
    navHome: 'Startseite',
    navHotDeals: 'Heiße Deals',
    navAttractionsAndTours: 'Aktivitäten',
    navRegions: 'Regionen',
    navCities: 'Reiseziele',
    navGoCityPass: 'City Pass',
    navFavorites: 'Favoriten',
    navSignIn: 'Anmelden',
    navMyAccount: 'Mein Konto',
    trustRating: '4.8/5 Bewertung',
    securePayments: 'Sichere Zahlungen',
    securePaymentsSub: '100% Schutz',
    instantBooking: 'Sofortige Buchung',
    instantBookingSub: 'In Sekunden erhalten',
    specialOffers: 'Sonderangebote',
    adBannerHighlight: 'Buchen Sie jetzt und erhalten Sie bis zu 30% Rabatt auf Ihre nächste Reise zu ausgewählten Sehenswürdigkeiten!',
    getBestDeals: 'Beste Angebote sichern',
    newsletterTitle: 'Auf dem Laufenden bleiben',
    newsletterSubtitle: 'Melden Sie sich für unseren Newsletter an und erhalten Sie einen Rabattcode für Ihre nächste Buchung sowie exklusive Reisetipps!',
    yourEmail: 'Ihre E-Mail-Adresse',
    subscribe: 'Abonnieren',
    regionLanguage: 'Region & Sprache',
    theme: 'Design',
    wishlist: 'Wunschliste',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    followUs: 'Folgen Sie uns',
    curatedSelection: 'Kuratiertes Angebot'
  },
  es: {
    heroTitle: 'El mundo te está',
    heroTitleHighlight: 'esperando',
    heroSubtitle: 'Descubre los monumentos, museos y tesoros ocultos más populares en las ciudades más bellas del mundo.',
    searchPlaceholder: 'Buscar lugares y cosas para hacer',
    popularDestinations: 'Destinos populares',
    topRatedAttractions: 'Atracciones populares',
    getTickets: 'Conseguir entradas',
    from: 'Desde',
    discoverMore: 'Cargar más',
    whyBook: '¿Por qué reservar con',
    mobileTickets: 'Confianza de miles',
    mobileTicketsSub: 'Más de 12M+ clientes felices',
    unbeatableValue: 'Valor imbatible',
    unbeatableValueSub: 'Garantía de precio',
    flexibleBooking: 'Reserva Flexible',
    flexibleBookingSub: 'Cancela hasta 24h antes',
    navHome: 'Inicio',
    navHotDeals: 'Ofertas Especiales',
    navAttractionsAndTours: 'Actividades',
    navRegions: 'Regiones',
    navCities: 'Destinos',
    navGoCityPass: 'Pase de la Ciudad',
    navFavorites: 'Favoritos',
    navSignIn: 'Iniciar sesión',
    navMyAccount: 'Mi Cuenta',
    trustRating: 'Valoración 4.8/5',
    securePayments: 'Pagos Seguros',
    securePaymentsSub: '100% Protección',
    instantBooking: 'Reserva Instantánea',
    instantBookingSub: 'Consíguelo en segundos',
    specialOffers: 'Ofertas Especiales',
    adBannerHighlight: '¡Reserva ahora y obtén hasta un 30% de descuento en tu próximo viaje a lugares destacados!',
    getBestDeals: 'Obtener Mejores Ofertas',
    newsletterTitle: 'Mantente al día',
    newsletterSubtitle: 'Únete al boletín para recibir un descuento en tu próxima reserva y enterarte de ofertas especiales antes que nadie.',
    yourEmail: 'Tu correo electrónico',
    subscribe: 'Suscribirse',
    regionLanguage: 'Región e Idioma',
    theme: 'Tema',
    wishlist: 'Lista de deseos',
    allRightsReserved: 'Todos los derechos reservados.',
    followUs: 'Síguenos',
    curatedSelection: 'Selección curada'
  },
  it: {
    heroTitle: 'Il mondo ti sta',
    heroTitleHighlight: 'aspettando',
    heroSubtitle: 'Scopri i monumenti, i musei e le gemme nascoste più popolari nelle città più belle del mondo.',
    searchPlaceholder: 'Cerca luoghi e attrazioni',
    popularDestinations: 'Destinazioni popolari',
    topRatedAttractions: 'Attrazioni popolari',
    getTickets: 'Acquista biglietti',
    from: 'Da',
    discoverMore: 'Carica altro',
    whyBook: 'Perché prenotare con',
    mobileTickets: 'Fiducia da migliaia',
    mobileTicketsSub: 'Più di 12M+ clienti felici',
    unbeatableValue: 'Valore imbatibile',
    unbeatableValueSub: 'Garanzia di prezzo',
    flexibleBooking: 'Prenotazione Flessibile',
    flexibleBookingSub: 'Cancella fino a 24h prima',
    navHome: 'Home',
    navHotDeals: 'Offerte Speciali',
    navAttractionsAndTours: 'Attività',
    navRegions: 'Regioni',
    navCities: 'Destinazioni',
    navGoCityPass: 'City Pass',
    navFavorites: 'Preferiti',
    navSignIn: 'Accedi',
    navMyAccount: 'Mio Account',
    trustRating: 'Valutazione 4.8/5',
    securePayments: 'Pagamenti Sicuri',
    securePaymentsSub: 'Protezione al 100%',
    instantBooking: 'Prenotazione Istantanea',
    instantBookingSub: 'Ottienilo in pochi secondi',
    specialOffers: 'Offerte Speciali',
    adBannerHighlight: 'Prenota ora e ottieni fino al 30% di sconto sul tuo prossimo viaggio verso le attrazioni più famose!',
    getBestDeals: 'Ottieni Migliori Offerte',
    newsletterTitle: 'Rimani aggiornato',
    newsletterSubtitle: 'Iscriviti alla newsletter per ricevere codici sconto esclusivi per le tue prossime prenotazioni e consigli utili!',
    yourEmail: 'Il tuo indirizzo email',
    subscribe: 'Iscriviti',
    regionLanguage: 'Regione e Lingua',
    theme: 'Tema',
    wishlist: 'Lista dei desideri',
    allRightsReserved: 'Tutti i diritti riservati.',
    followUs: 'Seguici',
    curatedSelection: 'Selezione curata'
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [detectedLocalCurrency, setDetectedLocalCurrency] = useState<Currency>(() => {
    const savedDetected = localStorage.getItem('tiqsey_detected_curr');
    if (savedDetected) {
      const found = CURRENCIES.find(c => c.code === savedDetected);
      if (found) return found;
    }
    const code = detectLocalCurrencyCode();
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('tiqsey_curr');
    if (saved) {
      return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0];
    }
    // First visit: Automatically detect local currency
    const code = detectLocalCurrencyCode();
    const detected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    localStorage.setItem('tiqsey_curr', detected.code);
    return detected;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tiqsey_theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    if (!localStorage.getItem('tiqsey_autodetected')) {
      const countryToCurrency: Record<string, string> = {
        US: 'USD', GB: 'GBP', AU: 'AUD', CA: 'CAD', CH: 'CHF', DK: 'DKK', NO: 'NOK',
        PL: 'PLN', SE: 'SEK', AE: 'AED', HU: 'HUF', SG: 'SGD', HK: 'HKD', JP: 'JPY',
        CO: 'COP', NZ: 'NZD', MY: 'MYR', CZ: 'CZK', MX: 'MXN', IN: 'INR', TH: 'THB',
        BR: 'BRL', AZ: 'AZN', BHD: 'BHD', BYN: 'BYN', CLP: 'CLP', CNY: 'CNY', ID: 'IDR',
        ILS: 'ILS', JOD: 'JOD', KRW: 'KRW', KWD: 'KWD', KZT: 'KZT', LAK: 'LAK', MNT: 'MNT',
        MOP: 'MOP', OMR: 'OMR', PHP: 'PHP', PKR: 'PKR', QAR: 'QAR', RUB: 'RUB', SAR: 'SAR',
        TRY: 'TRY', TWD: 'TWD', VND: 'VND', ZAR: 'ZAR',
        AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR', FR: 'EUR', DE: 'EUR', GR: 'EUR',
        IE: 'EUR', IT: 'EUR', LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR',
        SK: 'EUR', SI: 'EUR', ES: 'EUR'
      };

      const handleDetectionSuccess = (currencyCode: string) => {
        const detectedCurr = CURRENCIES.find(c => c.code === currencyCode);
        if (detectedCurr) {
          setDetectedLocalCurrency(detectedCurr);
          localStorage.setItem('tiqsey_detected_curr', detectedCurr.code);
          
          if (!localStorage.getItem('tiqsey_curr_overridden')) {
            setCurrency(detectedCurr);
            localStorage.setItem('tiqsey_curr', detectedCurr.code);
          }
        }
        localStorage.setItem('tiqsey_autodetected', 'true');
      };

      const tryGeoServices = async () => {
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            if (data.currency) {
              handleDetectionSuccess(data.currency);
              return;
            }
          }
        } catch (e) {
          console.warn('Geo service 1 (ipapi) failed:', e);
        }

        try {
          const res = await fetch('https://ip-api.com/json/');
          if (res.ok) {
            const data = await res.json();
            if (data.countryCode) {
              const mappedCurrency = countryToCurrency[data.countryCode.toUpperCase()];
              if (mappedCurrency) {
                handleDetectionSuccess(mappedCurrency);
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Geo service 2 (ip-api) failed:', e);
        }

        localStorage.setItem('tiqsey_autodetected', 'true');
      };

      tryGeoServices();
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t: Theme) => {
      root.classList.remove('light', 'dark');
      
      if (t === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('tiqsey_curr', curr.code);
    localStorage.setItem('tiqsey_curr_overridden', 'true');
  };

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('tiqsey_theme', t);
  };

  const formatPrice = (priceInEur: number) => {
    const converted = priceInEur * currency.rate;
    return `${converted.toFixed(2)} ${currency.code}`;
  };

  const t = (key: string) => {
    return translations['en'][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ 
      currency, 
      detectedLocalCurrency,
      theme,
      setCurrency: handleSetCurrency, 
      setTheme: handleSetTheme,
      formatPrice, 
      t 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
