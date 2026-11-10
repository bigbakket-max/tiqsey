# Promotional Banners, Large Homepage Banner & Activity Promo Cards Overhaul

A comprehensive upgrade to the entire banner and promotional campaign management suite in the Tiqsey Admin Panel (`/promotional-banners`), covering both the panoramic Large Homepage Carousel Banner and the Activity Promo Cards grid.

---

## 1. Overview & Core Enhancements (Completed)

- **Large Homepage Banner Manager (`src/admin/components/LargeBannerManager.tsx`)**:
  - Interactive multi-slide carousel console with live state switches per slide (`ACTIVE` / `DRAFT`).
  - Multi-viewport live simulator (Desktop, Tablet, Mobile) reflecting real slide transitions, CTAs, and scenic destination photography.
  - Direct customer storefront link button (`View Live Banner ↗`) linking directly to `/#/`.
  - 1-click slide cloning (`Duplicate Slide`) helper duplicating slide configuration cleanly.
  - Slide order management (move up, move down, duplicate, delete) with instant local and customer synchronization.
  - Configurable carousel settings: autoplay speed, transition duration, and show/hide controls.
- **Activity Promo Cards Table (`src/admin/pages/PromotionalBanners.tsx`)**:
  - High-density data grid with compact rows, thumbnail preview, template tags, and tabular discount figures.
  - Interactive inline publication toggle switch (`ACTIVE` / `DISABLED`) with instant feedback.
  - 1-click copyable banner ID badge and direct storefront preview button (`↗`).
  - Segmented status tabs (`All Banners`, `Active`, `Disabled`, `Scheduled`, `Expired`) with live count badges.
  - Floating multi-select bulk actions bar (`Bulk Activate`, `Bulk Disable`, `Delete Selected`, `Deselect All`).
  - Search filter with instant reset button (`✕`) and template filter dropdown.
- **Promotional Banner Form & Live Preview (`src/admin/pages/PromotionalBannerForm.tsx`)**:
  - Side-by-side live card preview updating in real time as promotional codes, badge icons, discount percentages, and ready-made flyer graphics are edited.
  - Top action header with direct storefront preview link (`Storefront Live ↗`), back navigation (`ArrowLeft`), quick inline active switcher (`Active` / `Draft`), and delete action.

---

## 2. Technical Architecture & File Verification

1. **`src/admin/pages/PromotionalBanners.tsx`**:
   - Tabbed hub for Large Banner Carousel vs. Activity Promo Cards with dynamic count badges.
   - High-density table with multi-select checkboxes, copyable IDs, inline status toggle, and floating bulk action bar.
2. **`src/admin/components/LargeBannerManager.tsx`**:
   - Slide management with compact slide card rows, inline active switches, scenic image thumbnails, duplicate slide helper, and storefront live link.
   - Responsive multi-viewport simulator (Desktop, Tablet, Mobile) with interactive slide controller.
3. **`src/admin/pages/PromotionalBannerForm.tsx`**:
   - Sticky top bar with direct storefront link (`/#/`), inline active state switcher, and real-time live preview card.
