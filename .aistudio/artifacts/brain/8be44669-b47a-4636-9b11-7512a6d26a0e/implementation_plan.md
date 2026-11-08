# Implementation Plan: Enhanced Multi-Language & Multi-Currency Experience

Comprehensive upgrade to Tiqsey's localization and currency conversion systems, providing seamless international booking with full language coverage, auto-detection prompts, regional currency grouping, live exchange rates, dual price transparency, RTL support, and header quick-switchers.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Status: Completed & Verified**
> 1. **Multi-Language**: Full UI translation coverage across all views, auto-detected browser language with one-click banner, added Hindi (hi), Korean (ko), and Portuguese (pt), and full RTL layout support for Arabic (`dir="rtl"` with icon mirroring).
> 2. **Currency**: Live exchange rates with updated timestamps, auto-detected local currency with location confirmation toast, dual price display (converted + base price), and regional grouping in the selector (Europe, Americas, Asia & Pacific, Middle East & Africa).
> 3. **Navigation & Access**: Compact quick-switch dropdowns directly in header triggers for top picks, plus full tabbed modal selector.

---

## 1. Overview & Core Concept

- **What It Delivers**:
  - Global visitors experience native-feeling booking in their own language and local currency without manual searching.
  - Transparent pricing eliminates currency conversion surprises by showing both the converted amount and the underlying base rate.
  - Arabic visitors enjoy a natural right-to-left (RTL) reading flow with mirrored chevron icons and alignment.
  - Header triggers allow fast 1-click switching between popular currencies and languages without taking up the entire screen.

---

## 2. User Experience & Visual Design

### A. Header Quick-Switch Dropdowns & Full Modal
- **Quick-Switch Flyout**: Clicking or hovering the Language pill (`EN`) or Currency pill (`INR`) in the header displays a refined dropdown panel:
  - Top 5-6 frequently used options with country flags and native names.
  - Currently active option highlighted with a brand `#e3000f` checkmark.
  - Action footer: *"All 16 Languages..."* or *"All 48 Currencies..."* which opens the full `SettingsModal`.
- **Regional Currency Groups in Full Modal**:
  - Instead of an unorganized alphabetical list, currencies are categorized into clean, labeled visual sections:
    - **Suggested & Popular**: User's detected currency + EUR, USD, GBP, AED, SGD, INR
    - **Europe**: EUR, GBP, CHF, PLN, SEK, NOK, DKK, CZK, HUF, etc.
    - **Asia & Pacific**: INR, JPY, CNY, SGD, THB, AUD, NZD, KRW, HKD, IDR, MYR, PHP, VND
    - **Americas**: USD, CAD, BRL, MXN, CLP, COP
    - **Middle East & Africa**: AED, SAR, QAR, KWD, BHD, OMR, ILS, JOD, ZAR
  - Live search input instantly filters across codes, country names, and symbols across all regions.

### B. Auto-Detection Banners & Toasts
- **Language Detection Banner**:
  - Detects visitor's browser language on first visit. If it differs from the active language, a subtle, dismissible top banner appears:
    *"We noticed your browser is in हिन्दी (Hindi). Would you like to switch to हिन्दी? [Switch to हिन्दी] [Keep English] [×]"*
- **Currency Detection Toast**:
  - Detects visitor's region via `Intl` currency or locale. Displays a gentle corner confirmation:
    *"Showing prices in INR (₹) based on your location. [Keep INR] [Change]"*
  - Remembers choice in `localStorage` so it never pesters the user again.

### C. Dual Price Display & Rate Transparency
- **Pricing Cards & Detail Pages**:
  - Displays converted price prominently: e.g. **INR 4,320**
  - Displays secondary base price indicator: `(~€48.00 base price)`
  - Hover or click on the price or exchange rate badge shows a tooltip:
    *"1 EUR = 90.00 INR · Converted at live rate updated today at 08:30 UTC"*.
- **Booking Summary & Checkout**:
  - Clear note explaining that charge is processed in EUR equivalent with no hidden conversion markup.

### D. New Languages & Full RTL Arabic Layout
- **New Languages Added**:
  - **Hindi (`hi`)**: `हिन्दी` (flag: 🇮🇳, countryCode: `in`)
  - **Korean (`ko`)**: `한국어` (flag: 🇰🇷, countryCode: `kr`)
  - **Portuguese (`pt`)**: `Português` (flag: 🇵🇹, countryCode: `pt`)
- **Full UI Translation Coverage**:
  - Translate all navigation headers, hero text, search tags, filter categories, booking forms, vouchers, and trust cards.
- **RTL Arabic Support**:
  - Set `dir="rtl"` on `<html>`.
  - Mirror directional icons (`ArrowRight` $\to$ `ArrowLeft`, `ChevronRight` $\to$ `ChevronLeft`).
  - Right-align card metadata and reverse horizontal flex orders (`rtl:flex-row-reverse`, `rtl:text-right`).

---

## 3. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SettingsContext                                  │
│  - language: Language (code, name, nativeName, flag, dir, countryCode)      │
│  - currency: Currency (code, name, symbol, rate, region)                    │
│  - exchangeRatesTimestamp: string                                           │
│  - detectedLocalCurrency: Currency                                          │
│  - detectedBrowserLanguage: Language | null                                 │
│  - formatPrice(amount, baseCurrency): string                                │
│  - getDualPrice(amount): { converted: string, base: string, rate: number }   │
│  - t(key, fallback): string                                                 │
└───────────────────────┬───────────────────────────────────┬─────────────────┘
                        │                                   │
          ┌─────────────▼─────────────┐       ┌─────────────▼─────────────┐
          │      Header Controls      │       │     Auto-Detect Banners   │
          │  - Inline Quick Dropdowns │       │  - Language Suggestion    │
          │  - Full Modal Triggers    │       │  - Currency Confirmation  │
          └─────────────┬─────────────┘       └───────────────────────────┘
                        │
          ┌─────────────▼─────────────────────────────────────────────┐
          │     SettingsModal (Regional Currencies + Languages)       │
          │  - Tab 1: Languages (16 languages including HI, KO, PT)   │
          │  - Tab 2: Currencies grouped by World Regions + Search    │
          │  - Live Exchange Rate info & timestamp footer             │
          └───────────────────────────────────────────────────────────┘
```

### Key Modules & Files
1. `src/types.ts`:
   - Extend `Currency` with `region: 'popular' | 'europe' | 'americas' | 'asia_pacific' | 'middle_east_africa'`.
   - Add dual-price helper types.
2. `src/contexts/SettingsContext.tsx`:
   - Add `LANGUAGES` entries for `hi`, `ko`, `pt`.
   - Update `CURRENCIES` with regional tags and rate timestamps.
   - Implement `getDualPrice(priceInEur: number)`.
   - Add language auto-detection logic on mount with `localStorage` dismissal flag.
3. `src/translations/`:
   - Create `src/translations/hi.ts` (Hindi).
   - Create `src/translations/ko.ts` (Korean).
   - Create `src/translations/pt.ts` (Portuguese).
   - Register in `src/translations/index.ts`.
4. `src/components/Header.tsx`:
   - Add quick-switch hover/click dropdown flyouts for Language and Currency.
   - Ensure RTL styling mirrors navigation cleanly.
5. `src/components/SettingsModal.tsx`:
   - Organize Currencies into regional accordion/sections: **Suggested**, **Europe**, **Americas**, **Asia & Pacific**, **Middle East & Africa**.
   - Show live rate exchange info pill with last-updated timestamp.
6. `src/components/LanguageDetectionBanner.tsx` & `src/components/CurrencyDetectionToast.tsx`:
   - Non-intrusive prompt components to easily accept or dismiss detected language/currency.
7. `src/components/AttractionCard.tsx` & `src/components/AttractionDetailPage.tsx`:
   - Integrate dual-price display showing converted price + base price indicator.

---

## 4. Verification & Testing

1. **Language Switching & Translation Coverage**:
   - Switch between English, Hindi, Korean, Portuguese, and Arabic.
   - Verify UI components (nav, search bar, filter tabs, hero, attraction cards, details) translate correctly.
2. **RTL Verification**:
   - Select Arabic (`ar`). Verify page layout flips to right-to-left (`dir="rtl"`), arrows mirror correctly, and text aligns naturally.
3. **Currency Conversion & Regional Grouping**:
   - Open Currency selector: verify currencies are grouped into Europe, Americas, Asia & Pacific, and Middle East & Africa.
   - Verify search filters across all groups instantly.
   - Check converted prices across the site (e.g. INR, USD, GBP, JPY) against live exchange rates.
4. **Dual Price Display**:
   - Check attraction card and detail page: verify converted price is prominent and base EUR price is clearly referenced.
5. **Auto-Detection Toasts**:
   - Test dismissal and one-click acceptance of detected language/currency.
6. **Build & Lint Verification**:
   - Co-execute `compile_applet` and `lint_applet` to confirm zero TypeScript errors.
