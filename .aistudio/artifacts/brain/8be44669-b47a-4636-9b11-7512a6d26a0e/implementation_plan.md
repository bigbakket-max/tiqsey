# Implementation Plan: Enhanced Search Bar & Visitor Search Results

Upgrade the search experience across Tiqsey with instant live search, category filtering tabs, typo-tolerant fuzzy matching, rich item previews (thumbnails, ratings, live converted prices), user search history, trending chips, and full search results page navigation.

---

## 1. Feature Specifications

### A. Live Instant Dropdown with Rich Previews
- **Thumbnail Previews**: High-resolution, optimized thumbnails with smooth image error fallbacks.
- **Attraction Cards**:
  - Attraction Name with matched search terms subtly highlighted.
  - Location badge (City, Country) and Category pill (e.g. Theme Parks, History).
  - Star rating with total review count (e.g. `★ 4.7 (6,500)`).
  - Live converted price in the visitor's selected currency (`formatPrice`), showing discount % when on sale.
- **Destination & City Cards**:
  - City photo thumbnail, country flag/name, and available experience count.
  - Direct routing to city activities.

### B. Category Filter Tabs in Dropdown
- Interactive tab switcher at the top of the search dropdown:
  - **All** (Top mixed results)
  - **Attractions** (Tickets, Landmarks, Waterparks, Theme parks)
  - **Cities** (Destinations, regions)
  - **Activities** (Tours, Day trips, Cruises, Outdoor)
- Instant filtering without reloading or losing the search term.
- Category badge counts displaying match counts.

### C. Typo-Tolerant Fuzzy Search
- Resilient fuzzy matching algorithm supporting:
  - Levenshtein distance matching (e.g., "Acroplis" -> "Acropolis", "Puket" -> "Phuket", "Amsterdm" -> "Amsterdam").
  - Word-order independence (e.g., "ticket acropolis fast track" -> "Acropolis of Athens: Fast Track Ticket").
  - Substring & prefix matching on names, locations, categories, and 8-digit product IDs.

### D. Empty State: Recent Searches & Trending Chips
- When search input is focused with no query entered:
  - **Recent Searches**: Display visitor's recent searches from `localStorage` with timestamp icon, single-click to search, delete button per item, and a "Clear all" button.
  - **Trending Searches**: Top queried experiences (e.g., "Andamanda Waterpark", "Acropolis Fast Track", "Eiffel Tower", "Amsterdam Canal").
  - **Popular Destinations**: Quick-filter destination chips (Tokyo, Paris, Phuket, Rome, London).

### E. Search Results Navigation & Full Results Page
- Pressing **Enter** or clicking **"View all results for '[query]' →"**:
  - Routes directly to the full results page (`/attractions-and-museums`) with the query applied.
  - Pre-configures filter counts, category tabs, and sorting options (Popularity, Price Low to High, Rating).
- Clicking a specific attraction or destination from the dropdown smoothly opens the full results or details view.

---

## 2. Technical Architecture & File Changes

| File | Proposed Changes |
| :--- | :--- |
| `src/utils/fuzzySearch.ts` | **New Utility**: Lightweight, performant fuzzy matching & Levenshtein distance algorithm for attraction and destination data. |
| `src/components/SearchBar.tsx` | Upgrade search component: add category tabs (`All`, `Attractions`, `Cities`, `Activities`), rich result cards with prices and ratings, recent search storage, trending chips, and keyboard navigation. |
| `src/components/Header.tsx` | Ensure desktop and mobile search bars pass the search callback and handle dropdown positioning smoothly across viewports. |
| `src/components/AttractionsAndMuseumsPage.tsx` | Enhance full search results page to display query header, match counts, active filter badges, and clear search button. |
| `src/App.tsx` | Ensure `handleGlobalSearch` properly carries search terms and filters into the search results page. |

---

## 3. Verification & Testing

1. **Fuzzy Search Verification**:
   - Test typing typos ("Acroplis", "Phukett", "Amsterdm") and verify accurate suggestions appear.
2. **Category Tabs**:
   - Verify clicking "Attractions", "Cities", and "Activities" filters the live dropdown list instantly.
3. **Recent Search History**:
   - Test searching queries, reloading the page, verifying recent searches persist, and deleting individual items or clearing all.
4. **Trending & Popular Chips**:
   - Click trending chips and confirm the search input updates and displays results immediately.
5. **Full Results Routing**:
   - Press Enter on a search query and verify it opens `/attractions-and-museums` with the search term and filters applied.
6. **Build & Lint**:
   - Co-execute `compile_applet` and `lint_applet` to confirm zero TypeScript and syntax errors.
