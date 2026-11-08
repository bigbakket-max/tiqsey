import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Currency, Theme, Language, WorldRegion, DualPrice } from '../types';
import {
  allTranslations,
  CATEGORY_TRANSLATION_MAP,
  REGION_TRANSLATION_MAP,
  STATUS_TRANSLATION_MAP,
} from '../translations';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', countryCode: 'gb', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', countryCode: 'in', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', countryCode: 'kr', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', countryCode: 'pt', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', countryCode: 'fr', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', countryCode: 'nl', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', countryCode: 'es', dir: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', countryCode: 'pl', dir: 'ltr' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文 (Simplified)', flag: '🇨🇳', countryCode: 'cn', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', countryCode: 'it', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', countryCode: 'de', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', countryCode: 'ru', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', countryCode: 'ro', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', countryCode: 'sa', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', countryCode: 'jp', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', countryCode: 'th', dir: 'ltr' },
];

export const CURRENCIES: Currency[] = [
  // Suggested & Popular
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 1, region: 'europe' },
  { code: 'USD', name: 'United States Dollar', symbol: '$', rate: 1.08, region: 'americas' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.86, region: 'europe' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 90.00, region: 'asia_pacific' },
  { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'د.إ', rate: 3.97, region: 'middle_east_africa' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.46, region: 'asia_pacific' },

  // Europe
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.98, region: 'europe' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 7.46, region: 'europe' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 11.60, region: 'europe' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 4.30, region: 'europe' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 11.40, region: 'europe' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rate: 390, region: 'europe' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 25.10, region: 'europe' },
  { code: 'BYN', name: 'Belarusian ruble', symbol: 'Br', rate: 3.53, region: 'europe' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 97.5, region: 'europe' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 35.10, region: 'europe' },

  // Americas
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.48, region: 'americas' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.50, region: 'americas' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rate: 18.20, region: 'americas' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', rate: 1010, region: 'americas' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', rate: 4200, region: 'americas' },

  // Asia & Pacific
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 168, region: 'asia_pacific' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩', rate: 1480, region: 'asia_pacific' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.82, region: 'asia_pacific' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 8.44, region: 'asia_pacific' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rate: 1.63, region: 'asia_pacific' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', rate: 1.78, region: 'asia_pacific' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 39.5, region: 'asia_pacific' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 5.10, region: 'asia_pacific' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 17400, region: 'asia_pacific' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 63.4, region: 'asia_pacific' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 301, region: 'asia_pacific' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', rate: 34.9, region: 'asia_pacific' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 27500, region: 'asia_pacific' },
  { code: 'AZN', name: 'Azerbaijani manat', symbol: '₼', rate: 1.84, region: 'asia_pacific' },
  { code: 'KZT', name: 'Kazakhstani tenge', symbol: '₸', rate: 480, region: 'asia_pacific' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', rate: 23100, region: 'asia_pacific' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', rate: 3755, region: 'asia_pacific' },
  { code: 'MOP', name: 'Macau Pataca', symbol: 'MOP$', rate: 8.70, region: 'asia_pacific' },

  // Middle East & Africa
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', rate: 4.05, region: 'middle_east_africa' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', rate: 3.93, region: 'middle_east_africa' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 0.33, region: 'middle_east_africa' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', rate: 0.41, region: 'middle_east_africa' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', rate: 0.42, region: 'middle_east_africa' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', rate: 4.02, region: 'middle_east_africa' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', rate: 0.77, region: 'middle_east_africa' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 19.8, region: 'middle_east_africa' },
];

export const EXCHANGE_RATES_TIMESTAMP = 'Today, 08:30 UTC · Real-time Interbank Rates';

const detectLocalCurrencyCode = (): string => {
  try {
    const intlCurrency = Intl.NumberFormat().resolvedOptions().currency;
    if (intlCurrency && CURRENCIES.some(c => c.code === intlCurrency)) {
      return intlCurrency;
    }
  } catch (e) {
    console.warn('Intl currency detection error:', e);
  }

  try {
    const locale = navigator.language || (navigator.languages && navigator.languages[0]) || '';
    const uppercaseLocale = locale.toUpperCase();
    if (uppercaseLocale.includes('IN')) return 'INR';
    if (uppercaseLocale.includes('GB')) return 'GBP';
    if (uppercaseLocale.includes('AE')) return 'AED';
    if (uppercaseLocale.includes('SG')) return 'SGD';
    if (uppercaseLocale.includes('US')) return 'USD';
    if (uppercaseLocale.includes('KR')) return 'KRW';
    if (uppercaseLocale.includes('BR')) return 'BRL';
    if (uppercaseLocale.includes('JP')) return 'JPY';

    const euroLocales = ['FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'AT', 'FI', 'GR', 'IE', 'PT'];
    if (euroLocales.some(el => uppercaseLocale.includes(el))) return 'EUR';
  } catch (e) {
    console.warn('Navigator locale detection error:', e);
  }

  return 'USD';
};

interface SettingsContextType {
  currency: Currency;
  detectedLocalCurrency: Currency;
  language: Language;
  languages: Language[];
  theme: Theme;
  exchangeRatesTimestamp: string;
  detectedBrowserLanguage: Language | null;
  showLanguagePrompt: boolean;
  dismissLanguagePrompt: () => void;
  applyDetectedLanguage: () => void;
  showCurrencyToast: boolean;
  dismissCurrencyToast: () => void;
  setCurrency: (curr: Currency) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  formatPrice: (price: number, baseCurrencyCode?: string) => string;
  getDualPrice: (price: number, baseCurrencyCode?: string) => DualPrice;
  t: (key: string, fallbackOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>) => string;
  translateCategory: (category: string) => string;
  translateRegion: (region: string) => string;
  translateStatus: (status: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

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
    const code = detectLocalCurrencyCode();
    const detected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    localStorage.setItem('tiqsey_curr', detected.code);
    return detected;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('tiqsey_lang');
    if (saved) {
      const found = LANGUAGES.find(l => l.code === saved);
      if (found) return found;
    }
    try {
      const browserLang = (navigator.language || '').toLowerCase().slice(0, 2);
      const found = LANGUAGES.find(l => l.code === browserLang);
      if (found) return found;
    } catch {
      // ignore
    }
    return LANGUAGES[0];
  });

  const [detectedBrowserLanguage, setDetectedBrowserLanguage] = useState<Language | null>(null);
  const [showLanguagePrompt, setShowLanguagePrompt] = useState<boolean>(false);
  const [showCurrencyToast, setShowCurrencyToast] = useState<boolean>(false);

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tiqsey_theme') as Theme;
    return saved || 'light';
  });

  // Browser language detection & prompt initialization
  useEffect(() => {
    const hasDismissed = localStorage.getItem('tiqsey_lang_auto_prompt_dismissed');
    if (!hasDismissed) {
      try {
        const fullLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
        const shortLang = fullLang.slice(0, 2);
        const match = LANGUAGES.find(l => l.code === shortLang || l.code === fullLang);

        if (match && match.code !== language.code) {
          setDetectedBrowserLanguage(match);
          setShowLanguagePrompt(true);
        }
      } catch (err) {
        console.warn('Language detection error:', err);
      }
    }
  }, [language.code]);

  // Currency detection & toast initialization
  useEffect(() => {
    const hasSeenCurrencyPrompt = localStorage.getItem('tiqsey_currency_toast_seen');
    if (!hasSeenCurrencyPrompt) {
      const timer = setTimeout(() => {
        setShowCurrencyToast(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissLanguagePrompt = () => {
    setShowLanguagePrompt(false);
    localStorage.setItem('tiqsey_lang_auto_prompt_dismissed', 'true');
  };

  const applyDetectedLanguage = () => {
    if (detectedBrowserLanguage) {
      handleSetLanguage(detectedBrowserLanguage);
    }
    dismissLanguagePrompt();
  };

  const dismissCurrencyToast = () => {
    setShowCurrencyToast(false);
    localStorage.setItem('tiqsey_currency_toast_seen', 'true');
  };

  // Geolocation detection fallback
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
        } catch {
          // ignore
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
        } catch {
          // ignore
        }

        localStorage.setItem('tiqsey_autodetected', 'true');
      };

      tryGeoServices();
    }
  }, []);

  // Sync document language and text direction
  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language.code;
    root.dir = language.dir || 'ltr';
  }, [language]);

  // Sync dark/light theme
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: Theme) => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      }
    };
    applyTheme(theme);
  }, [theme]);

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('tiqsey_curr', curr.code);
    localStorage.setItem('tiqsey_curr_overridden', 'true');
    dismissCurrencyToast();
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tiqsey_lang', lang.code);
  };

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('tiqsey_theme', t);
  };

  const formatPrice = (price: number, baseCurrencyCode: string = 'EUR') => {
    const baseCurr = CURRENCIES.find(c => c.code === baseCurrencyCode) || CURRENCIES.find(c => c.code === 'EUR') || { rate: 1 };
    const priceInEur = price / baseCurr.rate;
    const converted = priceInEur * currency.rate;

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(converted);
    } catch {
      return `${currency.symbol}${converted.toFixed(2)}`;
    }
  };

  const getDualPrice = (price: number, baseCurrencyCode: string = 'EUR'): DualPrice => {
    const baseCurr = CURRENCIES.find(c => c.code === baseCurrencyCode) || CURRENCIES.find(c => c.code === 'EUR') || { rate: 1, symbol: '€', code: 'EUR' };
    const priceInEur = price / baseCurr.rate;
    const convertedAmount = priceInEur * currency.rate;
    const isForeignCurrency = currency.code !== 'EUR';

    let formattedConverted: string;
    try {
      formattedConverted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(convertedAmount);
    } catch {
      formattedConverted = `${currency.symbol}${convertedAmount.toFixed(2)}`;
    }

    let formattedBase: string;
    try {
      formattedBase = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(priceInEur);
    } catch {
      formattedBase = `€${priceInEur.toFixed(2)}`;
    }

    return {
      convertedAmount,
      formattedConverted,
      baseAmount: priceInEur,
      formattedBase,
      rate: currency.rate,
      currencyCode: currency.code,
      baseCurrencyCode: 'EUR',
      isForeignCurrency,
    };
  };

  const t = (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ): string => {
    if (!key) return '';
    const langCode = language?.code || 'en';
    const dict = allTranslations[langCode] || allTranslations['en'] || {};
    const enDict = allTranslations['en'] || {};

    let actualParams: Record<string, string | number> | undefined;
    let fallbackStr: string | undefined;

    if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      actualParams = fallbackOrParams;
    } else if (typeof fallbackOrParams === 'string') {
      fallbackStr = fallbackOrParams;
      actualParams = params;
    }

    // 1. Direct key match in active language
    let text = dict[key];

    // 2. Direct key match in English fallback
    if (!text && enDict[key]) {
      text = enDict[key];
    }

    // 3. Category mapping lookup
    if (!text && CATEGORY_TRANSLATION_MAP[key]) {
      const catKey = CATEGORY_TRANSLATION_MAP[key];
      text = dict[catKey] || enDict[catKey];
    }

    // 4. Region mapping lookup
    if (!text && REGION_TRANSLATION_MAP[key]) {
      const regKey = REGION_TRANSLATION_MAP[key];
      text = dict[regKey] || enDict[regKey];
    }

    // 5. Status mapping lookup
    if (!text && STATUS_TRANSLATION_MAP[key]) {
      const statKey = STATUS_TRANSLATION_MAP[key];
      text = dict[statKey] || enDict[statKey];
    }

    // 6. Reverse lookup: if key is an English value
    if (!text) {
      const foundEntry = Object.entries(enDict).find(([_, v]) => v.toLowerCase() === key.toLowerCase());
      if (foundEntry) {
        text = dict[foundEntry[0]] || foundEntry[1];
      }
    }

    // 7. Fallback to provided fallbackStr or original key
    if (!text) {
      text = fallbackStr || key;
    }

    // Interpolate {paramName} placeholders if params were passed
    if (actualParams && typeof text === 'string') {
      for (const [pKey, pVal] of Object.entries(actualParams)) {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return text;
  };

  const translateCategory = (cat: string) => t(cat);
  const translateRegion = (reg: string) => t(reg);
  const translateStatus = (stat: string) => t(stat);

  return (
    <SettingsContext.Provider value={{
      currency,
      detectedLocalCurrency,
      language,
      languages: LANGUAGES,
      theme,
      exchangeRatesTimestamp: EXCHANGE_RATES_TIMESTAMP,
      detectedBrowserLanguage,
      showLanguagePrompt,
      dismissLanguagePrompt,
      applyDetectedLanguage,
      showCurrencyToast,
      dismissCurrencyToast,
      setCurrency: handleSetCurrency,
      setLanguage: handleSetLanguage,
      setTheme: handleSetTheme,
      formatPrice,
      getDualPrice,
      t,
      translateCategory,
      translateRegion,
      translateStatus
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
