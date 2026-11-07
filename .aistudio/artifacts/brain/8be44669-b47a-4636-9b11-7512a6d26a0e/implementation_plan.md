# Implementation Plan: Comprehensive Website & Admin Panel Error Fixes

Comprehensive audit and resolution for Tiqsey's Customer Website and Admin Panel to eliminate booking checkout obstacles, ensure reliable database persistence and synchronization for attractions and bookings, and fix image upload storage limits.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The fixes are structured around your confirmed preferences from Phase 1:
> - **Platform Scope**: Full comprehensive audit across both Admin Panel and Customer Website.
> - **Admin Focus**: Ensure inventory and booking changes save and sync reliably to the SQLite database.
> - **Website Focus**: Eliminate checkout, date selection, and timeslot booking validation friction.

- **Confirmed Decision 1**: Add full backend SQLite persistence for custom inventory (`attractions` table) with API endpoints (`/api/inventory/attractions`), ensuring newly added or modified attractions persist permanently across reloads, different browsers, and servers.
- **Confirmed Decision 2**: Remove destructive random mock status assignment in `Bookings.tsx` (which previously randomized booking statuses on load), and add server-side `DELETE` and `PATCH` endpoints for complete booking management.
- **Confirmed Decision 3**: Auto-select the earliest valid travel date and active timeslot upon opening attractions, eliminating empty date validation errors during checkout while retaining interactive calendar customization.
- **Confirmed Decision 4**: Route image uploads in the Admin Panel through the `/api/upload` endpoint (and image optimization utility) to eliminate `localStorage` quota exceeded crashes (`QuotaExceededError`).

---

### 1. Overview & Core Concept

- **What It Does**: Hardens the entire booking lifecycle and management suite. Customers on the main website can smoothly browse attractions, select valid travel dates with intelligent timezone normalization, pick admission timeslots with real-time capacity checks, and complete checkout without form submission glitches. Administrators in the Admin Panel can create and edit attractions with optimized image uploads, manage booking statuses with 100% database persistence, and see live sync across customer and admin views.
- **Target Audience / Persona**: Travelers purchasing tickets & experiences worldwide, and operations administrators managing catalog inventory, customer reservations, and vouchers.
- **Key Value**: Rock-solid data integrity, zero lost inventory edits, zero checkout drop-offs due to date/timeslot selection quirks, and seamless real-time synchronization between the customer frontend and the SQLite backend.

---

### 2. User Experience & Visual Design

- **Customer Booking & Checkout Flow**:
  1. *Attraction Exploration*: User selects an attraction or experience modal. The modal automatically initializes with the earliest available operating date (today if within cutoff, or tomorrow) and the first available timeslot, pre-calculating accurate pricing.
  2. *Interactive Calendar & Timeslots*: Clean, unboxed calendar grid highlighting available operating days, blackout dates, and cutoff lead times. Timeslots display real-time availability badges ("Available", "Filling Fast", or "Sold Out") without cascading render loops.
  3. *Seamless Checkout*: When clicking "Book Now" on any package, the user transitions to the traveler details form with pre-selected date and time. Form fields for primary traveler and additional guests include inline validation cues and auto-scroll to any missing required fields.
  4. *Confirmation & Voucher*: Once submitted, the booking is instantly registered in SQLite and client state, showing the verified booking confirmation screen with PNR reference (`BK...`), order ID (`OD...`), and immediate ticket voucher download.

- **Admin Inventory & Booking Management Flow**:
  1. *Inventory Management*: Admin can create new attractions or edit existing ones. Images are uploaded directly to the server's storage (`/uploads/`) instead of storing megabyte-sized raw base64 strings in browser storage.
  2. *Attraction Synchronization*: Saving an attraction triggers an atomic write to the SQLite database and updates the active catalog in real time across the entire site.
  3. *Bookings Dashboard*: Booking statuses remain stable and reflect true state (Confirmed, Pending, Cancelled, Completed, Rejected) without arbitrary random mutation on page refresh. Actions like Rescheduling, Status Updates, and Cancellations persist directly to the database.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full SQLite Persistence for Inventory (`attractions` table)**
  - *Chosen Approach*: Create a dedicated `attractions` table in SQLite (`bookings.db`) with JSON storage for variants, rules, highlights, and gallery images, exposed via `/api/inventory/attractions` endpoints.
  - *Why*: Previously, custom attractions were stored only in `localStorage`, which gets wiped on cache clearing, fails in incognito, and crashes when storing multiple high-resolution photos.
  - *Alternatives Considered*: Retaining `localStorage`-only sync — rejected as it leads to permanent data loss on reload.

- **Decision 2: Elimination of Random Mock Status Overwrites in `Bookings.tsx`**
  - *Chosen Approach*: Remove the random status distribution loop (lines 607–614 in `Bookings.tsx`) and honor the authentic status recorded in the database and user session.
  - *Why*: The previous code used hash-based random status reassignments (`mockStatuses[getMockIndex(...)]`), causing status changes made by admins to randomly revert to `cart_abandoned` or `will_be_cart_abandoned` on refresh.

- **Decision 3: Default Initial Travel Date in `AttractionDetailModal`**
  - *Chosen Approach*: When an attraction modal opens, calculate the first valid operating date based on the attraction's timezone, cutoff lead times, and operating days, and set it as the default `bookingDate`.
  - *Why*: Prevents users from landing on the booking form with an empty date string, which was triggering validation errors and confusing shoppers.

- **Decision 4: IANA Timezone Normalization Helper**
  - *Chosen Approach*: Map Windows-style timezone strings (e.g., `"Romance Standard Time"`, `"GMT Standard Time"`) to standard IANA timezone identifiers (e.g., `"Europe/Paris"`, `"Europe/London"`).
  - *Why*: `Intl.DateTimeFormat` throws a runtime `RangeError` if provided a non-IANA timezone string, causing dates and timeslots to malfunction on custom attractions.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TIQSEY CLIENT                                 │
│                                                                        │
│   ┌─────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Customer Booking Flow     │   │      Admin Management        │   │
│   │  (AttractionDetailModal)    │   │     (Inventory & Bookings)   │   │
│   │  - Auto-selected valid date │   │  - Status edit / cancellation│   │
│   │  - Timezone-safe timeslots  │   │  - /api/upload image storage │   │
│   │  - Form validation & alerts │   │  - Persistent catalog sync   │   │
│   └──────────────┬──────────────┘   └──────────────┬───────────────┘   │
└──────────────────┼─────────────────────────────────┼───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS SERVER (server.ts)                      │
│                                                                        │
│   ┌─────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Bookings REST API         │   │   Inventory & Upload API     │   │
│   │  - GET  /api/bookings       │   │  - GET  /api/inventory/attrs │   │
│   │  - POST /api/bookings       │   │  - POST /api/inventory/attrs │   │
│   │  - PATCH /api/bookings/:id  │   │  - DELETE /api/inventory/... │   │
│   │  - DELETE /api/bookings/:id │   │  - POST /api/upload          │   │
│   └──────────────┬──────────────┘   └──────────────┬───────────────┘   │
└──────────────────┼─────────────────────────────────┼───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      SQLITE DATABASE (bookings.db)                     │
│                                                                        │
│   ┌─────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   bookings Table            │   │   attractions Table          │   │
│   │  - order_number, pnr_number │   │  - id, product_id, name, city│   │
│   │  - status, date, timeslot   │   │  - price, variants_json      │   │
│   │  - guest details, pricing   │   │  - gallery_json, timezone    │   │
│   └─────────────────────────────┘   └──────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Steps

1. **Server-Side SQLite Schema & REST Endpoints (`server.ts`)**:
   - Add `attractions` table creation with columns for `id`, `productId`, `name`, `city`, `category`, `price`, `rating`, `reviewsCount`, `imageUrl`, `galleryUrls_json`, `variants_json`, `highlights_json`, `timezone`, `bookingMode`, `affiliateConfig_json`, `isAvailable`, `updated_at`.
   - Implement `GET /api/inventory/attractions` to return custom and modified attractions.
   - Implement `POST /api/inventory/attractions` (upsert attraction).
   - Implement `DELETE /api/inventory/attractions/:id` to remove custom attractions.
   - Implement `PATCH /api/bookings/:id` and `DELETE /api/bookings/:id` for full booking lifecycle control.

2. **Admin Inventory Hardening (`src/admin/pages/Inventory.tsx` & `src/data/mockData.ts`)**:
   - Connect `Inventory.tsx` and `syncCustomAttractions` to fetch from and persist to `/api/inventory/attractions`.
   - Update file uploads in `Inventory.tsx` to utilize `uploadAndOptimizeImage` so images save cleanly as relative URLs (`/uploads/...`) instead of gigantic base64 payloads that choke browser storage.
   - Map timezones to standard IANA values when creating/editing attractions.

3. **Admin Bookings Stability (`src/admin/pages/Bookings.tsx`)**:
   - Remove the random status scrambling logic (`mockStatuses[getMockIndex(...)]`) in `loadBookings`.
   - Wire status updates, rescheduling, and cancellations to the backend database endpoints with optimistic UI updates and instant toast alerts.

4. **Website Checkout & Date Selection Fixes (`src/components/AttractionDetailModal.tsx`)**:
   - Provide a timezone converter helper to safely translate Windows timezones to valid IANA identifiers before passing to `Intl.DateTimeFormat`.
   - Pre-select the nearest valid operating date by default when opening any attraction, so timeslots and pricing are immediately active.
   - Remove the unsafe `setTimeout` state update during render in the timeslots section.
   - Refine checkout validation with smooth scrolling and clear, focused error messages.

5. **Compilation, Verification & Testing**:
   - Run `compile_applet` and `lint_applet` together to verify 100% clean builds with zero TypeScript or syntax errors.
   - Verify both Website booking creation and Admin inventory/booking status workflows end-to-end.
