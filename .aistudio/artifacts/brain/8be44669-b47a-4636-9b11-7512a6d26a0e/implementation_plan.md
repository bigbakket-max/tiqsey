# Instagram Integration & Automated Publishing System

Connect the official Tiqsey Instagram Business account (`@tiqsey_official`) with the Tiqsey travel marketplace, introducing an automated Instagram publishing suite with AI caption generation, visual carousels, scheduling, and analytics.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed based on your preferences:

- **Confirmed Publishing Workflow**: Semi-automated mode by default—when new products or activities are added or edited, the system automatically prepares an optimized draft with AI-crafted captions, hashtags, and images. Admins can preview in an interactive phone mockup, tweak copy, and publish in one click, or toggle **Auto-Publish New Products** for instant hands-off publishing.
- **Confirmed Meta Graph API Setup**: Dedicated Settings in the Admin panel to configure Meta App ID, App Secret, and long-lived Access Token. Includes a **Test Connection** validator, live Instagram Business account verification, token health monitoring, and a sandbox/simulator mode for immediate testing prior to Meta App production review.
- **Confirmed Post Formats**: Full support for both **Single Photo** showcase cards and **Multi-Image Carousels** (showcasing attraction highlights, ticket options, and photo galleries).

---

## 1. Overview & Core Concept

- **What It Does**: Bridges Tiqsey's catalog of tours, museum tickets, and experiences directly to Instagram (`@tiqsey_official`). Generates high-converting social media posts using product imagery and Gemini-powered travel captions, schedules them for optimal engagement times, tracks likes/comments/reach analytics, and publishes directly via Meta's official Instagram Graph API.
- **Target Audience / Persona**: Tiqsey administrators, marketing managers, and content creators running promotional social campaigns for European travel activities.
- **Key Value**: Eliminates tedious manual copywriting and graphic exports. Ensures every new tour or ticket added to Tiqsey immediately benefits from promotional visibility on Instagram with zero friction.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Instagram Account Connection & Health**:
   - Admin navigates to **Marketing > Instagram** in the `/secure-panel` sidebar.
   - Connected account card displays `@tiqsey_official`, profile avatar, account ID, token status, and a **Test Connection** action.
   - Settings tab allows entering or updating Meta App credentials and toggling **Auto-Publish New Products**.

2. **Automated New Product Publishing Flow**:
   - When an admin saves a new attraction in **Inventory**, an Instagram draft is automatically synthesized in the background.
   - Admin receives a banner alert with a direct link to review the generated post in the Instagram Management panel.

3. **Post Creator & Live Feed Mockup**:
   - Admin selects any product from Tiqsey inventory (or clicks **Generate Post** on any tour card).
   - Generates instant travel hooks, descriptions, and optimized hashtags using Gemini (`gemini-2.5-flash`).
   - Admin can choose post format: **Single Photo** or **Carousel Album** (multi-image selector with drag-and-drop order).
   - Realistic mobile phone preview displays live Instagram feed rendering (profile header, image carousel with dots, like/comment counts, and formatted caption with collapsible `#hashtags`).
   - Action bar provides: **Publish to Instagram Now**, **Schedule for Later**, or **Save as Draft**.

4. **Post History, Scheduling Queue & Analytics**:
   - Tabbed queue: **Published Posts**, **Scheduled Queue**, **Drafts**, and **Failed / Retry**.
   - Published cards display post thumbnail, publication timestamp, direct link to live Instagram post (`https://www.instagram.com/p/...`), and performance metrics (Likes, Comments, Reach, Impressions).
   - Failed posts display descriptive Meta API error logs and a **Retry Publish** button.

### Visual Identity & Theme
- **Theme & Accents**: Consistent with Tiqsey's enterprise admin console (`slate-900` dark mode, `#e3000f` brand red primary buttons, and Instagram gradient accents `#833ab4` `#fd1d1d` `#fcb045` on badges and connection headers).
- **Typography & Metrics**: High-contrast tabular numbers (`font-mono`) for reach, likes, impressions, and engagement rates. Clean unboxed metadata labels adhering to zero-pill discipline.
- **Interactive Feedback**: Instant preview updates as caption text is typed, animated loading spinners during API calls, copy-to-clipboard actions for hashtags, and responsive status indicators.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Token Security & Meta Proxy**:
  - *Chosen Approach*: All Meta App Secrets and long-lived Access Tokens are stored server-side in SQLite (`server.ts`) and never exposed to the client. Frontend receives only masked tokens and connection booleans.
  - *Why*: Strict adherence to Meta security guidelines and platform integrity rules; prevents client token leakage.
  - *Alternatives Considered*: Client-side SDK calls were rejected because Instagram Graph API strictly forbids exposing user/page tokens in client bundles.

- **Decision 2: Dual Mode (Live Meta Graph API + Test Sandbox Simulator)**:
  - *Chosen Approach*: When Meta API credentials are provided, the backend connects directly to Meta's endpoints (`graph.facebook.com/v21.0`). If credentials are empty or pending developer app review, the system automatically runs in high-fidelity Sandbox Mode, allowing the admin to test complete caption generation, scheduling, and queue management without blocking work.
  - *Why*: Allows immediate testing and verification of the full publishing lifecycle without waiting for Meta's App Review process.

- **Decision 3: Gemini-Powered Multi-Tone Caption Generation**:
  - *Chosen Approach*: Uses `@google/genai` on the server (`gemini-2.5-flash`) with preset tone selectors: *Engaging Travel Hook*, *Promotional Discount Offer*, *Storytelling & History*, or *Short & Punchy*.
  - *Why*: Gives admins creative flexibility to match different social media campaigns while keeping brand voice consistent.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Tiqsey Admin Panel                              │
│                                                                        │
│   ┌────────────────────┐    ┌──────────────────────────────────────┐   │
│   │  Inventory / Edit  │    │      Instagram Management Suite      │   │
│   │   Product Save     │    │  (Connect, Feed Mockup, Analytics)   │   │
│   └─────────┬──────────┘    └──────────────────┬───────────────────┘   │
└─────────────┼──────────────────────────────────┼───────────────────────┘
              │ Trigger New Draft                │ API Operations
              ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend Server (server.ts)                      │
│                                                                        │
│   ┌───────────────────────────┐    ┌───────────────────────────────┐   │
│   │   Gemini AI Generator     │    │   Instagram Publishing Engine │   │
│   │ (@google/genai 2.5-flash) │    │   - Container Creator         │   │
│   └─────────┬─────────────────┘    │   - Carousel Builder          │   │
│             │                      │   - Media Publisher           │   │
│             ▼                      │   - Insights & Analytics      │   │
│   ┌───────────────────────────┐    └───────────────┬───────────────┘   │
│   │    SQLite Database        │                    │                   │
│   │  - instagram_settings     │                    │                   │
│   │  - instagram_posts        │                    │                   │
│   └───────────────────────────┘                    │                   │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     │ Secure HTTPS Calls
                                                     ▼
                                      ┌──────────────────────────────┐
                                      │   Meta Instagram Graph API   │
                                      │   (@tiqsey_official Account) │
                                      └──────────────────────────────┘
```

### Data Models (SQLite)

- **`instagram_settings`**:
  - `id` (TEXT PRIMARY KEY, 'default')
  - `account_id` (TEXT)
  - `username` (TEXT, default 'tiqsey_official')
  - `profile_picture_url` (TEXT)
  - `app_id` (TEXT)
  - `app_secret` (TEXT, encrypted/server-only)
  - `access_token` (TEXT, server-only)
  - `is_connected` (INTEGER: 0/1)
  - `auto_post_new_products` (INTEGER: 0/1)
  - `default_post_format` (TEXT: 'single' | 'carousel')
  - `updated_at` (TEXT)

- **`instagram_posts`**:
  - `id` (TEXT PRIMARY KEY)
  - `attraction_id` (TEXT)
  - `attraction_name` (TEXT)
  - `caption` (TEXT)
  - `media_type` (TEXT: 'IMAGE' | 'CAROUSEL_ALBUM')
  - `media_urls` (TEXT: JSON array of image URLs)
  - `status` (TEXT: 'published' | 'scheduled' | 'draft' | 'failed')
  - `scheduled_at` (TEXT)
  - `published_at` (TEXT)
  - `instagram_post_id` (TEXT)
  - `permalink` (TEXT)
  - `likes_count` (INTEGER)
  - `comments_count` (INTEGER)
  - `reach_count` (INTEGER)
  - `impressions_count` (INTEGER)
  - `error_message` (TEXT)
  - `created_at` (TEXT)

### Server Proxy API Routes

- `GET /api/admin/instagram/settings` - Retrieve masked account settings and connection status.
- `POST /api/admin/instagram/settings` - Save Meta credentials and toggle auto-publishing.
- `POST /api/admin/instagram/test-connection` - Validate token with Meta Graph API and retrieve profile stats.
- `GET /api/admin/instagram/posts` - List posts filtered by status (published, scheduled, drafts, failed).
- `POST /api/admin/instagram/generate-caption` - Call Gemini API with attraction metadata to generate captions, hooks, and hashtags.
- `POST /api/admin/instagram/publish` - Execute single or carousel container creation and publish to Instagram.
- `POST /api/admin/instagram/schedule` - Queue post for future automated publication.
- `POST /api/admin/instagram/retry/:id` - Retry a failed publication.
- `DELETE /api/admin/instagram/posts/:id` - Delete or cancel a scheduled post.
- `GET /api/admin/instagram/analytics` - Fetch live engagement metrics and historical reach across published posts.
