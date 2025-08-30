# Flex Living — Developer Assessment Notes

## Tech Stack
- Next.js 15 (App Router), React 18
- Tailwind CSS
- Recharts, date-fns
- API routes under `app/api/*`

## Architecture & Data Flow
- `/api/reviews/hostaway` → calls Hostaway sandbox using env vars.
- Falls back to `/data/mock-reviews.json` when sandbox empty.
- `lib/normalizeReviews.js` cleans & normalizes reviews into a consistent schema, and computes `perProperty`.
- Frontend:
  - Dashboard with filters, performance table, trend chart, approve toggle (localStorage)
  - Property page showing **approved-only** reviews
  - Optional Google Reviews card

## Key Design Decisions
- Mock fallback to guarantee demo works when sandbox has no reviews.
- LocalStorage for approvals (simple for assessment; DB in production).
- Trend spotting via monthly aggregation.
- Dark UI tuned for readability on black backgrounds.

## API Behavior
### `/api/reviews/hostaway`
- Returns `{ source, reviews[], perProperty[] }` (source can be `"hostaway"` or `"mock"`).

### `/api/google/reviews`
- Calls Google Places Details API; requires billing-enabled key.
- Implemented as exploration; documented limitation if billing not enabled.

## Google Reviews — Findings
- Feasible with Places API, but requires billing.
- Endpoint + component implemented.
- Without billing: document and skip in production build.

## Future Improvements
- Persist approval server-side (DB).
- Richer property details (images, amenities, map).
- More analytics (NPS-like scores, heatmaps, recurring issue detection).
- Add tests (unit + E2E).

## Setup & Run
1. `npm install`
2. Add `.env.local` with Hostaway creds (and optional Google key).
3. `npm run dev`
4. Open http://localhost:3000

## Deployment
- Push to GitHub → import repo to Vercel.
- Add same env vars in Vercel dashboard.
- Verify live: `/api/reviews/hostaway` returns JSON (likely `source: "mock"` in sandbox).