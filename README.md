# BidderOS Web

React + TypeScript frontend for BidderOS. Uses Redux Toolkit and RTK Query to interact with the BidderOS API.

## Requirements

- Node.js 18+
- BidderOS API running (see `../bidderOS_api/README.md`)

## Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build for Production

```bash
npm run build
```

Output is in `dist/`.

## Architecture Decisions

1. **RTK Query for all API calls** — Every API interaction (auth, resumes, recommendations, cover letters) is handled by RTK Query endpoints in `authApi.ts`. This gives automatic caching, loading/error states, and cache invalidation without any manual `useEffect` + `fetch` boilerplate.

2. **Single `createApi` slice** — All endpoints are co-located in one `authApi` with a shared `baseQuery` that automatically injects the JWT `Authorization` header from the Redux `auth` slice. This avoids duplicating the auth token logic across multiple API configurations.

3. **TypeScript throughout** — All component props, API response shapes, and Redux state are typed. This catches integration errors at compile time rather than at runtime.

4. **React Router v6 with `ProtectedRoute`** — Unauthenticated users are redirected to `/login` automatically. The `ProtectedRoute` component reads auth state from Redux, keeping route protection declarative and centralized.
