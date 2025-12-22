# LatamCreativa - Project Handover

## Overview
LatamCreativa is a creative platform designed for artists and developers in Latin America. It features a dual-mode interface ("Creative" and "Dev") that adapts the content and theme based on the user's focus.

## Tech Stack
- **Framework**: React 19.2+ with TypeScript 5.8
- **Routing**: React Router v7.9+ (Data Router)
- **State Management**: Zustand 5.0+ (modular slices)
- **Styling**: Tailwind CSS (Dark Mode enabled)
- **Icons**: Lucide React 0.555
- **Backend**: Firebase 12.6+ (Firestore, Auth, Storage, Functions)
- **Bundler**: Vite 6.2 + PWA 1.2
- **Animations**: Framer Motion 12.23
- **Data Fetching**: TanStack React Query 5.66

## Directory Structure

```
src/
├── components/           # UI Components
│   ├── cards/            # Reusable cards (Portfolio, Job, Asset, etc.)
│   ├── chat/             # Chat widget implementation
│   ├── common/           # Generic UI (Pagination, FilterPanel)
│   ├── education/        # Course player specific components
│   ├── layout/           # Header, Navigation, Footer, MobileTabBar
│   ├── modals/           # Global modals
│   ├── profile/          # User profile specific components
│   └── ui/               # Base UI primitives
│
├── data/                 # Static Data & Configuration
│   ├── content.ts        # Barrel file exporting all data modules
│   ├── navigation.ts     # Navigation configuration
│   └── [module].ts       # Individual data files
│
├── hooks/                # Custom Hooks (REFACTORED)
│   ├── store/            # NEW: Zustand slice modules
│   │   ├── types.ts      # Type definitions for all slices
│   │   ├── uiSlice.ts    # UI state (sidebar, modals, toasts)
│   │   ├── authSlice.ts  # Auth state (user, cart, notifications)
│   │   ├── blogSlice.ts  # Blog pagination state
│   │   └── index.ts      # Barrel export
│   ├── useAppStore.ts    # Main store hook (uses slices)
│   ├── useProjectHooks.ts  # Project/Portfolio hooks
│   ├── useArticleHooks.ts  # Blog/Article hooks
│   ├── useUserHooks.ts     # User/Profile hooks
│   └── useFirebase.ts      # Barrel re-export (backward compat)
│
├── layouts/              # Route Layouts
│   └── MainLayout.tsx    # Root layout with sidebars and overlays
│
├── lib/                  # External Libraries Configuration
│   └── firebase.ts       # Firebase initialization
│
├── services/             # API Layer (MODULAR)
│   ├── api.ts            # Aggregated service facade
│   └── modules/          # Domain-specific services
│       ├── projects.ts   # Project CRUD, comments, likes
│       ├── articles.ts   # Article CRUD, comments
│       ├── users.ts      # User profiles, following
│       ├── notifications.ts  # Real-time notifications
│       ├── collections.ts    # User collections
│       └── storage.ts        # Firebase Storage wrapper
│
├── types/                # TypeScript Definitions (MODULAR)
│   ├── navigation.ts     # NavItem, NavSection, CategoryItem
│   ├── content.ts        # PortfolioItem, ArticleItem
│   ├── commerce.ts       # CourseItem, CartItem
│   ├── community.ts      # EventItem, ForumPost
│   ├── user.ts           # User, Notification
│   ├── common.ts         # ItemType, CollectionItem
│   └── index.ts          # Barrel export
│
├── utils/                # Utility Functions
│   └── helpers.ts        # timeAgo, formatters, etc.
│
├── views/                # Page Components
│   ├── admin/            # Admin dashboard views
│   ├── auth/             # Login/Register views
│   ├── blog/             # Blog listing and detail views
│   ├── portfolio/        # Portfolio views
│   ├── user/             # User profile views
│   └── [Module]View.tsx  # Other module views
│
├── router.tsx            # React Router configuration
├── App.tsx               # Entry point with auth listener
├── types.ts              # Legacy re-export (backward compat)
└── index.tsx             # Mount point

functions/                # Firebase Cloud Functions
└── src/
    └── index.ts          # Notification triggers, migrations
```

## Architecture Highlights

### 1. Modular Type System
Types are organized by domain in `src/types/`:
- `content.ts` - Content types (PortfolioItem, ArticleItem)
- `user.ts` - User-related types
- `commerce.ts` - E-commerce types
- Original `types.ts` re-exports for backward compatibility

### 2. Zustand Store Slices
State is organized in `src/hooks/store/`:
- **UISlice**: Sidebar, modals, navigation, toasts
- **AuthSlice**: User, cart, likes, notifications, collections
- **BlogSlice**: Article pagination state

### 3. Domain-Specific Hooks
Firebase hooks split by domain in `src/hooks/`:
- `useProjectHooks.ts` - 8 hooks for project operations
- `useArticleHooks.ts` - 11 hooks for article operations
- `useUserHooks.ts` - 3 hooks for user operations

### 4. Service Layer
Business logic in `src/services/modules/`:
- Each service handles its domain's Firestore operations
- Aggregated via `api.ts` facade for convenience

### 5. Data Model
- **authorId** is the standard field for content ownership
- **artistId** is deprecated but supported for backward compatibility

## Security

### Firestore Rules
Secure rules in `firestore.rules`:
- Authentication required for write operations
- Owner-based access control
- Granular permissions per collection

### Deploy: `firebase deploy --only firestore:rules`

## Key Features

### 1. Dual Mode System
Switches between `creative` and `dev` modes:
- **Theme Colors**: Amber/Orange for Creative, Blue/Indigo for Dev
- **Content Filtering**: Feeds filter by `domain` property
- **Navigation**: Sidebar adapts based on mode

### 2. Real-time Features
- Notifications via Firestore listeners
- Follow/unfollow with optimistic updates
- Like/comment with live counters

### 3. PWA Support
- Service worker for offline caching
- 113 precached entries
- Installable on mobile devices

## Deployment Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Firebase Deployment
firebase deploy --only hosting          # Frontend
firebase deploy --only firestore:rules  # Security rules
firebase deploy --only firestore:indexes # Indexes
firebase deploy --only functions         # Cloud Functions
```

## Migrations

### artistId → authorId Migration
Cloud Function available in `functions/src/index.ts`:

```bash
# Test (dry run)
firebase functions:call migrateArtistIdToAuthorId --data '{"dryRun": true}'

# Execute
firebase functions:call migrateArtistIdToAuthorId
```

## Known Issues / To-Dos

### Resolved ✅
- [x] Security rules (was open to public)
- [x] Monolithic types file (split into modules)
- [x] Large hook files (split by domain)
- [x] Large store file (split into slices)
- [x] Inconsistent authorId/artistId fields
- [x] Follow/Like functionality fixed with proper Firestore rules
- [x] Comment interactions (likes and replies) implemented
- [x] Profile stats (views, likes, followers) working
- [x] Portfolio cards show live author data with caching
- [x] Responsive design for mobile devices

### Remaining
- [ ] Bundle size warning (index.js > 500KB)
- [ ] Virtualization for large lists
- [ ] Remove deprecated artistId after migration

---

## Session Updates

### December 22, 2025

#### Comment System Enhancements
- **Comment Likes**: Toggle like on comments with visual feedback (filled heart)
- **Replies**: Nested reply system with inline input
- **Profile Links**: Click on comment/reply author name/avatar to navigate to profile
- **Files**: `projects.ts`, `PortfolioPostView.tsx`, `useProjectHooks.ts`

#### Profile Stats
- **Profile Views**: Auto-increment when visitors view a profile
- **Total Likes**: Aggregate likes from all user projects
- **Files**: `users.ts`, `UserProfileView.tsx`

#### Portfolio Cards
- **Live Author Data**: Cards fetch current author name/avatar instead of stale snapshots
- **Memory Cache**: 1-minute TTL cache to optimize API calls
- **File**: `PortfolioCard.tsx`

#### UI/UX Improvements
- **Edit Project Button**: Fixed route to `/create/portfolio?edit={id}`
- **Owner/Visitor UI**: Hide Follow/Hire buttons for project owners, show Edit button
- **Description Auto-Expand**: Textarea grows dynamically when typing
- **Mobile Floating Action Bar**: Publish/Draft buttons fixed at bottom on mobile
- **Responsive Design**: Added mobile-first padding and layouts

#### Firestore Rules
- Comments likes subcollection permissions
- Stats update permissions for authenticated users
- **Deploy**: `firebase deploy --only firestore:rules`

---
*Updated: December 22, 2025*
