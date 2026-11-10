# Blog Suite Redesign & Side-by-Side Live Editor Plan

A comprehensive architectural plan to overhaul the complete Blog management suite in the Tiqsey Admin Panel (`/blog`, `/blog/new`, and `/blog/:id`). Introduces a high-density data grid with segmented status tabs, floating bulk actions, interactive publication switches, and an interactive side-by-side split workspace featuring real-time live storefront preview.

---

## 1. User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters have been confirmed based on user selections:

- **Confirmed Catalog Layout**: High-density table with compact row height ($48\text{px}$–$52\text{px}$), segmented status tabs (`All Posts`, `Published`, `Drafts`, `Scheduled`), search input, and multi-select checkboxes.
- **Confirmed Editor Workspace**: Side-by-side split view with a real-time live preview panel that instantly mirrors content, formatting, images, and meta changes as the author types. Includes quick view-mode toggle buttons (`Edit Only`, `Split Preview`, `Full Preview`).
- **Confirmed Priority Features**: Direct storefront preview link (`/#/blog?post=:id`), 1-click publication status toggle in both the table and the editor header, 1-click copyable post ID/slug badges, and a floating multi-select bulk actions bar.
- **Zero Business Logic Degradation**: Retains all existing TipTap rich text extensions, markdown serialization, image upload pipelines, category tagging, author assignment, and localStorage / event synchronization.

---

## 2. Overview & Core Concept

- **What It Delivers**: Transforms blog management into a high-throughput, enterprise-grade content publishing console. Travel writers, editors, and administrators can quickly scan and organize travel articles, manage post lifecycles, and write articles in an ergonomic side-by-side split layout with immediate visual feedback.
- **Target Persona**: Content managers, travel editors, and marketing specialists responsible for publishing destination guides, hidden gems, and travel tips.
- **Key Value**: Eliminates the guesswork of modal-based previewing by providing a continuous, real-time live preview alongside the rich text editor, coupled with rapid bulk operations and instant status toggling from the main catalog table.

---

## 3. User Experience & Visual Design

### A. Blog Posts Catalog (`src/admin/pages/Blog.tsx`)
- **Segmented Status Tabs Bar**:
  - Horizontal status tabs at the top of the table: `All Posts`, `Published`, `Drafts`, and `Scheduled`.
  - Dynamic count badges (`All [N]`, `Published [N]`, `Drafts [N]`, `Scheduled [N]`) updating dynamically with state.
- **Search & Category Filter Bar**:
  - Search field with clear button (`✕`) for rapid search across post titles, excerpts, authors, and city tags.
  - Category selector (`All Categories`, `Travel Tips`, `Destination Guides`, `Food & Culture`, `Hidden Gems`).
  - "Clear Filters" quick-action button appearing when search or category filters are active.
- **High-Density Table Layout**:
  - Column 1: Checkbox for row selection with "Select All" in header.
  - Column 2: Post & Cover — compact 48px rounded cover thumbnail with subtle hover zoom, title, 1-click copyable ID badge, and live storefront link (`↗`).
  - Column 3: Category — unboxed typographic category label adhering to zero-pill discipline.
  - Column 4: Author & Destination — author name, avatar, and linked city.
  - Column 5: Date & Read Time — formatted publication timestamp and reading time.
  - Column 6: Live Status Toggle — smooth interactive switch between `Published` (emerald) and `Draft` (slate).
  - Column 7: Actions — `View Live` (`↗`), `Duplicate` (`⧉`), `Edit` (`✎`), and `Delete` (`🗑`).
- **Floating Multi-Select Bulk Actions Bar**:
  - Slides up with a smooth spring animation (`AnimatePresence`) when $\ge 1$ post is selected:
  - Selected count badge (`N posts selected`).
  - "Bulk Publish" button (`Check`).
  - "Bulk Set to Draft" button (`Bookmark`).
  - "Delete Selected" button (`Trash2`) with confirmation dialog.
  - "Deselect All" button.

### B. Blog Post Editor (`src/admin/pages/BlogPostForm.tsx`)
- **Solid Sticky Action Header**:
  - `← Back to Blog` button.
  - Title indicator (`Edit Blog Post` or `Create New Blog Post`) with post slug badge.
  - **Segmented View Mode Switcher**:
    - `[✎ Edit Only]`
    - `[◫ Split Live Preview]` (Default)
    - `[👁 Full Preview]`
  - Storefront Preview button: `View Live Post ↗` opening `/#/blog?post=:id` in a new tab.
  - Status switcher: Quick toggle between `Draft`, `Published`, and `Scheduled`.
  - Save buttons: `Save Draft` and `Publish Post`.
- **Side-by-Side Split Workspace**:
  - **Left Column (Editor Pane)**: Full TipTap WYSIWYG toolbar, title input, excerpt field, metadata controls (category, city, author, tags, cover image upload), and body editor.
  - **Right Column (Live Preview Pane)**:
    - Live-rendered storefront article view with hero cover image, publication metadata, reading time, author card, and formatted HTML/markdown prose.
    - Synchronized live updates without page reloads or modal curtains.
    - Toggle between Desktop View and Mobile Card View.

---

## 4. Key Product Decisions & Trade-Offs

- **Decision 1: Side-by-Side Split View as Default on Desktop**
  - *Chosen Approach*: Two equal 50/50 flex columns on desktop ($w \ge 1024\text{px}$) with dedicated scroll containers, collapsible to full-width on mobile/tablets or via the view switcher.
  - *Why*: Authors can see real typography, image placements, and formatting as they type without opening/closing preview modals.
  - *Trade-Off*: Requires horizontal viewport presence; handled cleanly by collapsing to stacked or single-mode on narrower viewports.
- **Decision 2: Direct Storefront Hash Route Binding (`/#/blog?post=:id`)**
  - *Chosen Approach*: Update `BlogPage.tsx` to read `?post=:id` from URL search and hash parameters on load, opening the full post view immediately.
  - *Why*: Allows the admin panel "View Live Post" button to reliably take the editor directly to the published article on the customer-facing storefront.
- **Decision 3: Non-Destructive Storage Integration**
  - *Chosen Approach*: Leverage existing `BlogContext` with `localStorage`, custom window events (`tiqsey_blog_updated`), and schedule checker.
  - *Why*: Guarantees zero data loss, instant updates across tabs, and full compatibility with existing mock and user-generated posts.

---

## 5. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Blog Posts Management Page                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Status Tabs: All Posts · Published · Drafts · Scheduled          │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Filter Bar: Search Posts · Category Filter · Clear Filters       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ High-Density Table:                                              │  │
│  │  [☑] Select  │ Post & ID   │ Category │ Author │ Status │ Actions │  │
│  │  [☐] Row 1   │ Paris...    │ Hidden.. │ Camille│ [ON]   │ ↗ ⧉ ✎ 🗑 │  │
│  │  [☐] Row 2   │ Tokyo...    │ Guides   │ Kenji  │ [ON]   │ ↗ ⧉ ✎ 🗑 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Floating Bulk Bar (When selected): [Publish] [Draft] [Delete]    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                     Blog Post Editor (Split View)                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Sticky Top Header: ← Back · [Edit|Split|Preview] · Live ↗ · Save │  │
│  ├──────────────────────────────────┬───────────────────────────────┤  │
│  │ Left: Rich Editor                │ Right: Live Storefront Preview│  │
│  │ - Title & Excerpt                │ - Storefront Hero Header      │  │
│  │ - Cover Image Drag & Drop        │ - Author Meta Bar             │  │
│  │ - Category, City, Author, Tags   │ - Formatted Body Prose        │  │
│  │ - TipTap WYSIWYG Toolbar & Prose │ - Destination Cards & Links   │  │
│  └──────────────────────────────────┴───────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Files to Modify

1. **`src/admin/pages/Blog.tsx`**:
   - Rebuild into a high-density, multi-select data grid.
   - Add status tabs (`all`, `published`, `draft`, `scheduled`) with live count chips.
   - Add live toggle switch for publication state.
   - Add 1-click copyable post ID badge and direct storefront preview button (`↗`).
   - Add duplicate post action (`handleDuplicatePost`).
   - Add floating animated bulk action bar (`AnimatePresence`).
2. **`src/admin/pages/BlogPostForm.tsx`**:
   - Wire up `editorMode` (`'split' | 'edit' | 'preview'`).
   - Implement side-by-side desktop layout with responsive live preview pane.
   - Add sticky header controls: direct `View Live Post` button, view mode switchers, draft saver, and publication dropdown.
   - Clean up toolbar dropdowns and ensure smooth scrolling in both panes.
3. **`src/components/BlogPage.tsx`**:
   - Initialize `selectedPostId` from URL query parameter (`?post=...`) or hash route (`/#/blog?post=...`).
   - Ensure direct live links from the admin panel land directly on the selected post.

---

## 6. Step-by-Step Implementation Sequence

1. **Storefront Route Binding**: Update `src/components/BlogPage.tsx` so `selectedPostId` recognizes `post` query parameter on mount.
2. **Blog Catalog Overhaul (`src/admin/pages/Blog.tsx`)**:
   - Add status filter state, bulk selection state, copied ID state.
   - Implement segmented status tabs with live count indicators.
   - Build high-density table rows with interactive switches, 1-click copy IDs, and action buttons.
   - Add duplicate post handler and floating multi-select bulk actions bar.
3. **Editor Split View Overhaul (`src/admin/pages/BlogPostForm.tsx`)**:
   - Update sticky top bar with segmented view toggle (`Edit`, `Split`, `Preview`) and `View Live Post` external link.
   - Implement side-by-side split layout: editor on left, formatted live article preview on right.
   - Sync real-time updates as the user edits title, excerpt, cover image, tags, and rich content.
4. **Verification & Testing**:
   - Co-execute `compile_applet` and `lint_applet` to ensure zero compilation and typing errors.
   - Restart dev server and verify HTTP 200 on `/blog`, `/blog/new`, and storefront routes.

---

## 7. Verification & Completed Features

- [x] **Storefront Query Binding**: `BlogPage.tsx` now reads `?post=:id` from URL query and hash routes on load.
- [x] **High-Density Blog Catalog**: `Blog.tsx` features segmented status tabs (`All Posts`, `Published`, `Drafts`, `Scheduled`) with live counts, search and category filters with 1-click clear, compact table layout, and inline publication switches (`LIVE` / `DRAFT`).
- [x] **Multi-Select Bulk Actions**: Checkboxes with page-level select-all, floating action toolbar (`Bulk Publish`, `Set as Draft`, `Delete Selected`, `Deselect All`).
- [x] **Interactive Side-by-Side Live Editor**: `BlogPostForm.tsx` offers three layout modes (`Editor`, `Split Live`, `Preview`). The right-hand preview panel renders real-time typography, cover image, metadata, and HTML prose as the author types.
- [x] **Storefront Linkage**: Added direct `View Live Post` external links on both table rows and the editor header.
- [x] **Compilation & Lint Verification**: Both `compile_applet` and `lint_applet` passed with zero errors. All routes verified via HTTP 200 smoke tests.
