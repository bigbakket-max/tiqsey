# Implementation Plan: Fix Website Browsing, Search, Filters & Image Loading Errors

## User Issue Summary
During website browsing, search, and filtering, users encounter elements failing to load, broken links/routing, and missing or broken images.

## Identified Root Causes
1. **Component Rendering / Undefined Icon Errors in Browsing (`ActivitiesPage.tsx`)**:
   - `getCategoryMeta` references `Palette` icon before its definition (inline SVG placed after usage) instead of importing `Palette` from `lucide-react`, causing potential component initialization and rendering errors when navigating categories like Museums & Art.
   - Unhandled category edge-cases when filtering destinations or categories that don't match standard category keys.
2. **Broken Image URLs & Missing Image Fallbacks (`mockData.ts` and UI cards)**:
   - Several attraction and destination image links in `src/data/mockData.ts` rely on third-party blog and travel domains subject to hotlink protection, 403 Forbidden, or broken links.
   - Banners and gallery components (`ActivitiesPage.tsx`, `FeaturedDestinations.tsx`, `AttractionDetailModal.tsx`) lack reliable placeholder image fallbacks, causing broken image icons and blank spaces.
3. **Search & Navigation Routing Inconsistencies (`App.tsx`, `Hero.tsx`, `FeaturedDestinations.tsx`)**:
   - Hero search handler matches attraction titles or keywords and sets `selectedDestination = matchingAttraction.city` or query string, trapping users in an invalid destination view (e.g. searching for "Museum" or an attraction name displays an empty "No activities found in Museum").
   - Destination cards in `FeaturedDestinations.tsx` update internal state without synchronizing with browser routing history or deep-linking properly.
4. **Filter & Sort Edge Cases**:
   - Safe parsing for pricing ranges, ratings, and operating dates to prevent filters from crashing when custom inventory attractions or filtered items lack optional fields.

---

## Proposed Changes

### Phase 1: Fix Component Loading & Category Filtering (`ActivitiesPage.tsx`)
- Import `Palette` directly from `lucide-react` alongside other icons (`Landmark`, `Compass`, `Sparkles`, `Camera`, `Trees`, `UtensilsCrossed`).
- Remove redundant inline SVG declaration to prevent TDZ/initialization errors.
- Ensure all category filter buttons safely fall back to default metadata if an unexpected category string is encountered.
- Add an `onError` image handler to the destination hero banner in `ActivitiesPage.tsx` with a reliable high-res travel fallback.

### Phase 2: Image Resilience & Fallbacks (`mockData.ts` and Components)
- Audit image URLs in `src/data/mockData.ts` to replace volatile external blog URLs with stable, high-resolution Unsplash travel imagery.
- Ensure all image tags across `AttractionCard.tsx`, `FeaturedDestinations.tsx`, `AttractionsAndMuseumsPage.tsx`, and `AttractionDetailModal.tsx` have uniform `onError` fallback handling using verified Unsplash fallback URLs.

### Phase 3: Fix Search & Navigation Routing (`App.tsx` & `Hero.tsx`)
- Update `Hero.tsx` search submission handler:
  - If a specific attraction is found by name, trigger `handleViewAttraction(id)` directly, opening its full details and booking modal.
  - If a city/destination is found, navigate to `ActivitiesPage` for that destination.
  - If a category or keyword is found, navigate to `AttractionsAndMuseumsPage` with the search/category filter pre-applied.
- Synchronize destination card clicks with browser URL parameters (`/destinations/:id`) for smooth back/forward navigation.

### Phase 4: Verification & Testing
- Compile and lint the applet (`compile_applet` & `lint_applet`).
- Verify browsing each destination (e.g. Paris, Tokyo, New York, Rome, London, Dubai) renders without component errors.
- Test category filters (Museums, Landmarks, Tours, Nature, Entertainment, Food).
- Verify search functionality for attraction titles, cities, and categories.
- Confirm all images load cleanly with no broken image placeholders.
