# Implementation Plan: Redesigned Admin Edit Product Experience

A modern, production-grade upgrade to the **Edit Product** workflow in the Tiqsey Admin Inventory panel. Replaces the legacy monolithic form with a high-density, professional SaaS layout featuring sticky navigation, quick-copy identifiers, instant storefront previews, live multi-currency calculations, Google SERP SEO simulation, and unsaved change detection.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architectural & UX Selections:**
> 1. **Sticky Top Action Header**: Breadcrumb trail (`Inventory / Edit Product / {Name}`), one-click Product ID copy, status toggle (`Active`, `Paused`, `Draft`), `View Live Product` storefront link, `Duplicate Product` action, and persistent `Save Changes` & `Discard` buttons.
> 2. **Refined Tabbed Layout & Quick Jump**:
>    - Renamed **Gallery** tab (with photo count `${galleryUrls.length}`).
>    - **Ticket Variants** tab (with count `${variants.length}`).
>    - **Primary Details** tab with a quick-jump section navigation sidebar.
>    - **Live Ticket Preview** tab with responsive storefront card & customer booking modal preview.
> 3. **Unsaved Changes Floating Bar**: Bottom toast bar that detects modified form fields, displaying *"You have unsaved changes"* with quick `Discard` and `Save Changes` triggers.
> 4. **Live Currency Preview & SEO Simulation**:
>    - Real-time exchange rate table previewing customer prices in EUR, USD, GBP, INR, AED, and AUD.
>    - Interactive Google SERP snippet editor with custom URL slug, SEO title length counter, and meta description check.

---

## 1. Scope of Improvements

### A. Top Sticky Action Header & Breadcrumb Bar
- **Breadcrumb Trail**: `Inventory > Edit Product > {Product Name}` with a quick `← Back to Inventory` link.
- **Permanent Product ID Chip**: Displays formatted 8-digit product ID with a 1-click `Copy ID` button that triggers visual feedback (`Copied!`).
- **Product Status Switcher**:
  - `Active` (Green indicator: public storefront search & booking enabled)
  - `Paused` (Amber indicator: hidden from public search, accessible via direct link)
  - `Draft` (Gray indicator: staging only)
- **Top Actions**:
  - `Duplicate Product`: 1-click clones the attraction parameters, sets a new unique Product ID with "(Copy)" suffix, and opens it for rapid cloning.
  - `View Live Product`: Opens `/#/attraction/:id` in a new browser tab so admins can immediately verify the live storefront appearance.
  - `Discard Changes`: Reverts all form inputs back to the initial attraction values or returns to inventory.
  - `Save Changes`: Brand red primary button (`#e3000f`) with loading spinner, disabled state when pristine, and shortcut key support (`Ctrl/Cmd + S`).

### B. Tab Architecture & Quick-Jump Navigation
- **Modern Tab Bar**:
  - **Primary Details**: Core product info, highlights, geographics, pricing, and SEO.
  - **Variants (`{variants.length}`)**: Ticket categories, age policies, and rules.
  - **Gallery (`{galleryUrls.length}`)**: Visual media uploader and drag-and-drop cover manager (as configured in previous step).
  - **Live Ticket Preview**: Real-time customer experience card & modal preview.
- **Section Quick-Jump Anchor Sidebar** (in Primary Details):
  - 1. Basic Information
  - 2. Experience Highlights
  - 3. Geographical Settings
  - 4. Classification & Supplier
  - 5. Features & Badges
  - 6. Pricing & Multi-Currency Preview
  - 7. Capacity & Booking Constraints
  - 8. Search Engine SEO & Slug

### C. Enhanced Form Sections & Accordion Layout
- **Basic Information**: Activity title with character counter, subtitle/summary, exact location address, and permanent Product ID.
- **Experience Highlights**: Visual bullet list with drag-and-drop / move up-down reordering, instant default reset, and live customer modal preview.
- **Live Multi-Currency Preview Matrix**:
  - Real-time calculation showing how the base EUR price converts to USD ($), GBP (£), INR (₹), AED (AED), and AUD (A$) using active interbank rates.
- **Search Engine Optimization (SEO) & URL Slug Editor**:
  - Custom SEO page title with recommended 50–60 character limit meter.
  - URL slug generator (e.g. `acropolis-of-athens-fast-track-ticket`).
  - Meta description editor with 150–160 character progress indicator.
  - Google SERP search result card preview showing how Google will index the attraction.

### D. Unsaved Changes Detection & Safety
- **Dirty State Tracking**: Compares current form state against original attraction data.
- **Floating Bottom Bar**: Renders when fields are dirty:
  - *"Careful — you have unsaved changes on this product."*
  - `Reset Changes` and `Save Changes` buttons.
- **Keyboard Shortcut**: `Cmd+S` / `Ctrl+S` triggers form save from any tab.

---

## 2. Technical Architecture & File Modifications

### `src/admin/pages/Inventory.tsx`
- **New State Hooks**:
  - `isDirty`: boolean comparing form inputs with initial values.
  - `productStatus`: `"active" | "paused" | "draft"`.
  - `seoTitle`, `seoDescription`, `customSlug`: for SEO metadata editing.
  - `isCopiedId`: feedback state for 1-click Product ID copying.
  - `activeSectionAnchor`: for quick-jump sidebar tracking.
- **Header Replacement**:
  - Build the sticky top navigation bar with breadcrumbs, Product ID copy, status dropdown, preview button, duplicate action, and primary save button.
- **Section Enhancements**:
  - Insert Multi-Currency Price Grid next to the pricing input.
  - Insert Google SERP SEO Editor and Snippet Preview card.
  - Update Tab navigation labels and counters (`Gallery` instead of `Gallary`, dynamic counters).
  - Add floating dirty-state bar when `isDirty === true`.

---

## 3. Verification & Quality Assurance
1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` concurrently to verify 0 TypeScript and lint errors.
2. **Interaction Verification**:
   - Test Product ID copy button.
   - Test "View Live Product" link opening the correct attraction ID.
   - Test "Duplicate Product" cloning the item and updating form state.
   - Test multi-currency calculations when price input changes.
   - Test switching tabs (Primary, Variants, Gallery, Live Preview) and quick-jump section navigation.
   - Test unsaved changes bar appearing when modifying fields and disappearing upon save.
