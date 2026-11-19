# Frontend Decisions — Meridian Museum of History & Science

This document records three key architectural and interaction decisions made to resolve the usability problems investigated on `britishmuseum.org`.

---

## Decision 1: Upfront Metadata & Live Slot Pills on Exhibition Cards

* **Problem:** On `britishmuseum.org/exhibitions-events`, listing cards display only a title, thumbnail, and multi-month date span—hiding ticket prices, visit duration, age restrictions, and real-time hourly slot availability until the user clicks through multiple pages.
* **Decision:** Surface duration badges, full pricing (including mandatory audio/kit fees), age eligibility tags, and interactive time-slot buttons with live remaining seat counts directly inside each `ExhibitCard` component.
* **Alternative:** Keep minimalist cards and open a "Quick View" modal when the user clicks a preview button on each card.
* **Reason:** Visitors planning a fixed-length museum visit (e.g., 2–3 hours) need to compare durations, costs, and open time slots across multiple exhibits simultaneously without extra clicks or modal context-switching.
* **Tradeoff:** Individual cards are taller and contain denser information, requiring careful visual hierarchy and responsive grid spacing on 390 px mobile viewports so buttons remain easy to tap.
* **Code location:** `src/components/ExhibitCard.jsx` (`ExhibitCard` component, lines 18–88) and `src/styles/main.css` (`.exhibit-card`, `.meta-pills`, `.slot-grid`).
* **Evidence:**
  1. Open `/exhibitions` on desktop (1280 px) or mobile (390 px).
  2. Observe that duration, adult price + fees, eligibility badge, and hourly seat counts appear immediately on every card.
  3. Click any available time-slot pill (e.g., `10:00`) and click **Add to Visit Pass**; observe the remaining seat count decrement immediately without leaving the catalog.
  *(Insert annotated screenshot: `docs/screenshots/decision-1-card-slots.png`)*

---

## Decision 2: Unified React Context + `localStorage` Visit Pass with Conflict Detection

* **Problem:** The British Museum discovery site lacks a multi-item itinerary builder and redirects users to an isolated external subdomain (`tickets.britishmuseum.org`), preventing visitors from bundling activities, viewing cumulative duration, or catching overlapping time slots.
* **Decision:** Manage the entire booking journey inside a single React SPA using `VisitContext` synchronized with `localStorage`, combined with real-time time-slot overlap detection (`findTimeSlotConflict`) and multi-exhibit bundle pricing (`calculateItineraryTotals`).
* **Alternative:** Store each selected exhibition in separate URL parameters or restrict bookings to a single exhibition per checkout session.
* **Reason:** A shared context keeps the navbar badge, catalog seat counts, detail view, and itinerary checkout synchronized across routes and page refreshes, while automatically flagging overlapping schedules before the user submits the form.
* **Tradeoff:** Restored `localStorage` selections can become stale if exhibition capacity changes between visits, requiring an explicit validation pass (`itineraryIssues` memo) to alert users and block invalid confirmation until resolved.
* **Code location:** `src/context/VisitContext.jsx` (`VisitProvider`, `addOrUpdateSlot`, `itineraryIssues`) and `src/rules/bookingRules.js` (`findTimeSlotConflict`, `calculateItineraryTotals`).
* **Evidence:**
  1. Add **Empires of the Silk Road** (`10:00`, 75 mins) from `/exhibitions`.
  2. Add **Junior Archaeologists Dig** (`10:30`, 60 mins).
  3. Observe the warning banner and the conflict alert on `/itinerary` explaining the schedule overlap and preventing checkout until one slot is changed or removed.
  *(Insert annotated screenshot: `docs/screenshots/decision-2-unified-pass.png`)*

---

## Decision 3: URL Query Parameter Synchronization for Search, Filters, and Sorting

* **Problem:** Navigating from a filtered exhibition listing into an exhibition detail page and pressing the browser **Back** button resets active filters and search terms, forcing visitors to rebuild their search criteria.
* **Decision:** Synchronize search keywords, category filters, audience eligibility filters, and sort order with URL query parameters via React Router's `useSearchParams` hook in `CatalogPage`.
* **Alternative:** Store filter and search states in local `useState` variables inside `CatalogPage` or inside `VisitContext`.
* **Reason:** Storing filter state in the URL preserves exact discovery state across detail-page visits, browser Back/Forward navigation, and page reloads without polluting global booking state.
* **Tradeoff:** Updating query parameters on every keystroke requires `{ replace: true }` in `setSearchParams` so the browser history stack is not flooded with intermediate search queries.
* **Code location:** `src/pages/CatalogPage.jsx` (`CatalogPage`, `updateParam`, `filteredExhibitions`).
* **Evidence:**
  1. On `/exhibitions`, filter Category to **Workshops** and Eligibility to **Family Friendly**.
  2. Click **Details** on **Junior Archaeologists Dig** (`/exhibitions/exh-04`).
  3. Click **Back to Previous View** (or the browser Back button) and confirm that both filters remain active in the URL (`?category=Workshops&audience=Family+Friendly`) and UI.
  *(Insert annotated screenshot: `docs/screenshots/decision-3-url-filters.png`)*