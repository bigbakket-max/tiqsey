const fs = require('fs');
const path = require('path');

// 1. Load language modules
const { baseEn } = require('./translations/base_en.cjs');
const { NEW_KEYS_EN } = require('./new_keys_en.cjs');
const frMod = require('./translations/fr.cjs');
const esMod = require('./data/es.cjs');
const deMod = require('./data/de.cjs');
const itMod = require('./data/it.cjs');
const nlMod = require('./data/nl.cjs');
const { pl: plMod, zh: zhMod, ru: ruMod } = require('./data/pl_zh_ru.cjs');
const { ro: roMod, ar: arMod, ja: jaMod, th: thMod } = require('./data/ro_ar_ja_th.cjs');

const newMods = {
  fr: frMod,
  es: esMod,
  de: deMod,
  it: itMod,
  nl: nlMod,
  pl: plMod,
  zh: zhMod,
  ru: ruMod,
  ro: roMod,
  ar: arMod,
  ja: jaMod,
  th: thMod
};

// 2. Extra keys used in newly converted components
const extraKeys = {
  bestPriceGuaranteeDesc: 'We offer competitive prices so you get the best value for your money.',
  exploreNow: 'EXPLORE NOW',
  tcsApply: 'T&CS APPLY',
  exploreTickets: 'EXPLORE TICKETS',
  parkSpecials: 'PARK SPECIALS',
  bestPriceGuaranteed: 'BEST PRICE GUARANTEED',
  promoCodeLabel: 'CODE',
  limitedOffer: 'LIMITED OFFER',
  homeNav: 'Home',
  travelBlog: 'Blog',
  liked: 'Liked',
  like: 'Like',
  saved: 'Saved',
  noCommentsYet: 'No comments yet. Be the first to start the conversation!',
  shareThoughts: 'Share your thoughts',
  yourNamePlaceholder: 'Your Name',
  addCommentPlaceholder: 'Add a comment...',
  exploreMore: 'EXPLORE MORE',
  signIn: 'Sign In',
  reservationHub: 'Reservation Hub',
  myTickets: 'My tickets',
  myTicketsDesc: 'These tickets were either purchased with the same email used in your Tiqets account or when you were signed in.',
  upcoming: 'Upcoming',
  completed: 'Completed',
  done: 'Done',
  active: 'Active',
  noUpcomingBookings: 'No confirmed/upcoming tickets found',
  noUpcomingBookingsDesc: "Looks like you don't have any upcoming trips scheduled. Time to plan your next adventure!",
  noCompletedBookings: 'No completed tickets found',
  noCompletedBookingsDesc: 'Your completed journeys and ticket history will show up here once you have taken them.',
  fillAllFields: 'Please enter your email and password.',
  enterValidEmail: 'Please enter a valid email address.',
  passwordMinLength: 'Password must be at least 6 characters long.',
  registerFailed: 'Failed to register. Please try again.',
  googleSignUpFailed: 'Failed to sign up with Google.',
  emailPlaceholder: 'name@example.com',
  passwordPlaceholder: 'Create a strong password (6+ chars)',
  hidePassword: 'Hide password',
  showPassword: 'Show password',
  creatingAccount: 'Creating Account...',
  enterEmailFirst: 'Please enter your email address first, then click Forgot password.',
  signInHeroDesc: 'Sign in to manage your bookings, wishlist, and ticket vouchers.',
  passwordResetSent: 'Password reset link sent to your email.',
  enterPassword: 'Enter your password',
  signingIn: 'Signing In...',
  termsAndConditions: 'Terms & Conditions',
  sortBy: 'SORT BY',
  tableOfContents: 'Table of Contents',
  lastUpdated: 'Last Updated'
};

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'nl', 'pl', 'zh', 'ru', 'ro', 'ar', 'ja', 'th'];

// Helper to parse existing ts translation file
function readExistingDict(lang) {
  const filePath = path.join(__dirname, `../src/translations/${lang}.ts`);
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const dict = {};
  const lines = content.split('\n');
  for (const line of lines) {
    // Match line like:   key: 'value' or key: "value",
    const m = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*(['"`])(.*)\2\s*,?\s*$/);
    if (m) {
      dict[m[1]] = m[3];
    }
  }
  return dict;
}

// 3. Assemble master English keys
const existingEn = readExistingDict('en');
const masterEn = { ...existingEn, ...NEW_KEYS_EN, ...baseEn, ...extraKeys };

console.log('Master English total keys count:', Object.keys(masterEn).length);

// 4. Update each language file
for (const lang of LANGS) {
  const existing = readExistingDict(lang);
  const newMod = newMods[lang] || {};
  const combined = {};

  for (const [key, enVal] of Object.entries(masterEn)) {
    if (lang === 'en') {
      combined[key] = enVal;
    } else {
      // Priority:
      // 1. Existing translation in this language
      // 2. New translation from our module
      // 3. If missing, fallback to English
      if (existing[key] && existing[key] !== enVal) {
        combined[key] = existing[key];
      } else if (newMod[key]) {
        combined[key] = newMod[key];
      } else if (existing[key]) {
        combined[key] = existing[key];
      } else {
        combined[key] = enVal;
      }
    }
  }

  // Format into clean TS file
  const outLines = [
    `export const ${lang}: Record<string, string> = {`
  ];

  for (const [k, v] of Object.entries(combined)) {
    // Escape single quotes and backslashes properly
    const sanitized = v
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '')
      .replace(/\n/g, '\\n');
    outLines.push(`  ${k}: '${sanitized}',`);
  }

  outLines.push('};');
  outLines.push('');

  const targetPath = path.join(__dirname, `../src/translations/${lang}.ts`);
  fs.writeFileSync(targetPath, outLines.join('\n'), 'utf8');
  console.log(`Generated ${lang}.ts with ${Object.keys(combined).length} keys.`);
}

console.log('All 13 language files successfully compiled and written!');
