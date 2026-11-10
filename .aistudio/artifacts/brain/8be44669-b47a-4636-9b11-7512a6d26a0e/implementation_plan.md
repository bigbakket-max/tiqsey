# Products Page Redesign & Performance Optimization

A comprehensive plan to improve both the product catalog listing table and the product editing workspace in the Tiqsey Admin Panel (`/inventory`), introducing a high-density table layout, instant category/status tabs, bulk selection actions, and an enhanced tabbed product editor.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters have been confirmed based on user selections:

- **Confirmed Scope**: Both the product catalog table view (`/inventory`) and the product edit/create screens (`/inventory/edit/:id` and `/inventory/new`) will be comprehensively upgraded.
- **Confirmed Catalog Layout**: High-density data table with compact rows, live availability toggles, 1-click copyable product IDs, instant status pills, and quick action tooltips.
- **Confirmed Primary Feature**: Instant filter bar with segmented category and status tabs (`All`, `Active`, `Unavailable`, `Drafts`), plus a floating multi-select bulk actions bar (Bulk Active, Bulk Pause, Bulk Delete).
- **Zero Business Logic Degradation**: All existing product fields (variants, pricing tiers, highlight bullet points, gallery images, cancellation policies, affiliate URL tokens, and Supabase/localStorage sync) remain 100% operational.

---

## 1. Overview & Core Concept

- **What It Delivers**: Transforms the product management center into a high-throughput, enterprise-grade inventory console. Store managers can quickly search, filter, bulk-manage, and edit tour activities with zero layout jumping, crisp tabular numerals, and instant feedback.
- **Target Persona**: Store operators, inventory managers, and support agents handling dozens of international tour activities, pricing variants, and marketing campaigns.
- **Key Value**: Drastically reduces the time needed to review catalog items, toggle product availability, perform bulk updates, and edit multi-variant tour packages.

---

## 2. User Experience & Visual Design

### A. High-Density Product Catalog Table
- **Segmented Status Tabs**: Top-level quick tabs (`All [N]`, `Active [N]`, `Unavailable [N]`, `Manual Booking [N]`, `Affiliate [N]`) with live count badges and smooth active indicators.
- **Instant Search & Geography Filters**: Search box with clear button (`✕`), filter dropdowns for Region, City, Category, and Booking Mode, and an instant "Clear All Filters" chip.
- **Multi-Select Bulk Action Bar**: Checkbox on table header and rows. Selecting items slides up a floating bulk bar:
  - Selected count badge (`N items selected`)
  - "Mark Available" button
  - "Mark Unavailable" button
  - "Duplicate Selected" button
  - "Delete Selected" button with confirmation
  - "Deselect All" button
- **High-Density Row Design**:
  - Compact row height ($48\text{px}$–$54\text{px}$) with hover highlight.
  - Image thumbnail with subtle zoom on hover.
  - Product ID badge with 1-click clipboard copy and green checkmark toast.
  - Inline availability switch (Active / Inactive) with instant state transition.
  - Formatted tabular pricing (`font-mono`) with clear discount percentage chips.
  - Supplier name and booking mode tag (Manual vs. Affiliate).
  - Quick action cluster: View Live (`↗`), Quick Highlights (`✦`), Edit (`✎`), Duplicate (`⧉`), and Delete (`🗑`).

### B. Streamlined Product Editor Screen
- **Full-Bleed Sticky Action Header**: Solid, opaque background with zero content bleed-through during scroll, containing:
  - `← Back to Inventory` button
  - Product title and status switcher (`Active` / `Paused` / `Draft`)
  - Permanent product ID pill with copy button
  - Primary action buttons: `View Live Product`, `Duplicate`, `Discard`, and high-visibility `Save Changes` button.
- **Segmented Editor Navigation**: Tab bar with clear count badges and icons:
  - `Primary Details` (Activity Name, Geography, Description, Categories, Highlights)
  - `Ticket Variants` (Pricing tiers, booking mode, vendor rules, capacity)
  - `Gallery & Media` (Cover photo, multi-photo reordering, upload manager)
  - `SEO & Metadata` (Search titles, meta descriptions, canonical URLs)
  - `Live Ticket Preview` (Interactive customer checkout ticket preview)
- **Save Confirmation Dialog**: Summary card with cover photo, price, variant count, and confirmation spinner.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: High-Density Table with Responsive Horizontal Scroll**
  - *Chosen Approach*: Clean fixed-column table with a minimum container width ($1080\text{px}$) inside an `overflow-x-auto` wrapper, ensuring columns never wrap awkwardly on smaller laptop screens or tablets.
  - *Why*: Guarantees predictable alignment for financial figures, checkboxes, and toggle buttons.
  - *Alternatives Considered*: Responsive cards that drop columns on mobile were tested, but table density was explicitly chosen by the user for inventory oversight.

- **Decision 2: Floating Multi-Select Bulk Action Toolbar**
  - *Chosen Approach*: An animated bottom floating bar (`AnimatePresence` with slide-up `y: 20 -> 0`) when $\ge 1$ item is selected.
  - *Why*: Keeps bulk operations easily accessible without occupying vertical screen space when browsing.

- **Decision 3: Non-Destructive Form State Preservation**
  - *Chosen Approach*: Retain the existing `loadedIdRef` guard and modular form hooks in `Inventory.tsx` so user edits are never overwritten by external re-renders or catalog syncs.

---

## 4. Technical Architecture & Component Mapping

### Component & Data Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Products Inventory Page                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Status & Mode Tabs: All (34) · Active (31) · Paused (3) · Deals  │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Filter Bar: Instant Search · Region · City · Category · Clear    │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ High-Density Catalog Table:                                      │  │
│  │  [☑] Select All  │ Activity & ID │ Pricing │ Status │ Actions   │  │
│  │  [☐] Row 1       │ Amsterdam...  │ €28.00  │ [ON]   │ ↗ ✦ ✎ 🗑   │  │
│  │  [☐] Row 2       │ Rijksmuseum.. │ €45.00  │ [ON]   │ ↗ ✦ ✎ 🗑   │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Pagination Controls & Page Size Selector                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Floating Bulk Bar (When items selected):                         │  │
│  │ "3 products selected"  │ [Mark Available] [Mark Paused] [Delete] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### State Store & Interactive Handlers

1. **`selectedProductIds`**: `Set<string>` or `string[]` tracking checked items across the table.
2. **`statusFilter`**: Segmented filter (`all` | `active` | `unavailable` | `deal`).
3. **`handleBulkAvailability(status: boolean)`**: Batch updates selected items in state, `localStorage`, and Supabase.
4. **`handleBulkDelete()`**: Batch deletes selected items with confirmation dialog.
5. **`handleCopyId(id: string)`**: Copies product ID to clipboard with 2-second visual feedback.
6. **`activeTab`**: Retains active tab in product editor (`Primary`, `Variants`, `Gallery`, `SEO`, `Preview`).

---

## 5. Verification & Completed Features

- [x] **Segmented Status Tabs**: `All Products`, `Active`, `Unavailable`, `Hot Deals`, `Manual Checkout`, and `Affiliate Partner` tabs with live count chips.
- [x] **High-Density Catalog Table**: Compact row layout, 1-click copyable product IDs, instant live availability toggles, thumbnail zoom, and direct `/#/attraction/:id` storefront link (`↗`).
- [x] **Floating Bulk Actions Bar**: Appears smoothly when rows are selected (`Mark Active`, `Mark Paused`, `Delete Selected`, `Deselect All`).
- [x] **Product Editor Sticky Toolbar**: `View Live Product` link mapped to `/#/attraction/:id`, direct `Duplicate`, and `Save Changes`.
- [x] **Zero Regressions**: All existing variant models, pricing rules, highlights editors, and database synchronization remain fully operational.
- [x] **Build & Lint Verification**: Co-executed `compile_applet` and `lint_applet` with zero TypeScript or build errors.
