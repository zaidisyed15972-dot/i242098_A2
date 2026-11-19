# Meridian Museum of History & Science — Visit Planner & Ticket Booking

**Course:** CS4032 – Web Programming (Fall 2026)  
**Student Name:** [Your Full Name]  
**Roll Number:** [Your Roll Number]  
**Section:** [Your Section]  

---

## Project Description
**Meridian Museum of History & Science** is a responsive React single-page application that allows visitors, families, and students to browse museum exhibitions, curator-led tours, and hands-on workshops, filter offerings by category and age eligibility, build a conflict-free timed **Visit Pass**, and complete a simulated ticket reservation.

The application addresses three frontend usability issues identified on `britishmuseum.org`:
1. **Upfront Comparison Metadata:** Displays visit duration, total ticket price (including audio/kit fees), and age restrictions directly on catalog cards.
2. **Unified Multi-Activity Visit Pass:** Replaces fragmented external ticketing redirects with a persistent React Context + `localStorage` itinerary featuring time-slot overlap detection and 3+ activity bundle discounts.
3. **Low Click-Depth Slot Discovery:** Exposes interactive time-slot buttons with live remaining seat counts on every card and detail view.

---

## Links
* **Public GitHub Repository:** `https://github.com/<your-username>/<your-repo-name>`
* **Live Deployed Application:** `https://<your-project-name>.vercel.app` (or Netlify URL)
* **Final Commit Hash:** `<paste-full-or-7-char-commit-hash>`

---

## Installation, Development, Build, and Test Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start local development server:**
   ```bash
   npm run dev
   ```

3. **Run automated business-rule unit tests (Node.js built-in test runner):**
   ```bash
   node --test
   ```

4. **Create production build:**
   ```bash
   npm run build
   ```

---

## Main Routes & Feature Summary

| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/` | `HomePage` | Museum overview, featured galleries, quick links, and Task 6.1 edge-case demonstration toggles. |
| `/exhibitions` | `CatalogPage` | Full 10-item catalog with keyword search, category/audience filters, sorting (synced via URL query params), loading/error/empty states, and 1-click time-slot booking. |
| `/exhibitions/:id` | `DetailPage` | Detailed gallery rules, pricing breakdown, live slot selector, and invalid-ID fallback handling. |
| `/itinerary` | `ItineraryPage` | Chronological Visit Pass review, Adult/Child/Senior ticket steppers, live business-rule enforcement, validated booking form, and simulated digital receipt. |

---

## Operating Rules Implemented (`src/rules/bookingRules.js`)
1. **Session Capacity & Group Limit:** Bookings require `1` to `8` tickets per session (`MAX_TICKETS_PER_SESSION = 8`) and cannot exceed `remainingSeats` for the selected time slot.
2. **Age & Supervision Eligibility:** `16+ Only` workshops reject Child tickets; `Family Friendly` workshops marked `requiresAdultWithChild` require at least `1` Adult ticket whenever Child tickets are selected.
3. **Multi-Exhibit Bundle Pricing:** Selecting `3` or more distinct exhibitions/activities automatically applies a **15% Bundle Pass Discount** and waives the **$4 single-pass booking fee**.

---

## Instructions for Reproducing Edge Cases (Task 6.1)

1. **Simulated Loading Failure & Retry (`FR14`):**
   * On the Home page (`/`), check **Simulate Schedule API Failure**.
   * Navigate to **Exhibitions & Tours** (`/exhibitions`) to observe the error banner and click **Retry Loading** (after unchecking the toggle) to restore the catalog.
2. **Restored Selection Availability Conflict:**
   * Add **Empires of the Silk Road** to your Visit Pass.
   * On the Home page (`/`), check **Force "Empires of the Silk Road" Sold Out** (or reload the page with it active).
   * Navigate to **Visit Pass** (`/itinerary`) to observe the inline conflict alert blocking confirmation until the sold-out item is removed.
3. **Time-Slot Overlap & Eligibility Guardrails:**
   * Add two exhibitions with overlapping times (e.g., `10:00` for 75 mins and `10:30` for 60 mins) or add a Child ticket to **Junior Archaeologists Dig** without an Adult ticket.
   * Observe specific error guidance on `/itinerary` with **Confirm Simulated Visit Pass** disabled until corrected.
4. **Empty Search/Filter Results & Invalid Detail URL:**
   * Search for `"xyz"` on `/exhibitions` to see the empty-filter guidance and **Clear All Filters** button.
   * Visit `/exhibitions/invalid-id` to see the graceful not-found state and return link.

---

## Simulated Operations & Known Limitations
* **Simulated Operations:** All seat availability counts, ticket pricing calculations, payment totals, and generated booking reference codes (`MRD-XXXXXX`) are simulated client-side for academic demonstration. No real payment processing or personal data transmission occurs.
* **Known Limitations:**
  * Ticket inventory resets to initial dataset values on full browser cache clear because there is no backend database.
  * The application supports planning a single visit date per active Visit Pass rather than multi-day itineraries simultaneously.

---

## React & JavaScript Concept Map

| Concept | File Path | Component / Function |
| :--- | :--- | :--- |
| Routing & URL Parameters (`useParams`, `useSearchParams`) | `src/App.jsx`, `src/pages/DetailPage.jsx`, `src/pages/CatalogPage.jsx` | `App`, `DetailPage`, `CatalogPage` |
| Shared State (`createContext`, `useContext`) | `src/context/VisitContext.jsx` | `VisitProvider`, `useVisit` |
| Side Effects & `localStorage` Persistence (`useEffect`) | `src/context/VisitContext.jsx` | `VisitProvider` (`STORAGE_KEY` sync & `loadCatalog`) |
| Derived Values (`useMemo`) | `src/context/VisitContext.jsx`, `src/pages/CatalogPage.jsx` | `exhibitionsWithLiveSeats`, `itineraryIssues`, `totals`, `filteredExhibitions` |
| Immutable State Updates (Arrays & Objects) | `src/context/VisitContext.jsx`, `src/pages/ItineraryPage.jsx` | `addOrUpdateSlot`, `updateTicketCount`, `removeFromItinerary`, `formData` |
| Asynchronous Promises (`async`/`await` + error handling) | `src/data/exhibitions.js`, `src/context/VisitContext.jsx` | `fetchExhibitions`, `loadCatalog` |
| Pure Business Rules & Node.js Unit Tests | `src/rules/bookingRules.js`, `tests/bookingRules.test.js` | `validateSessionCapacity`, `validateEligibility`, `calculateItineraryTotals` |
| Controlled Form & Validation | `src/pages/ItineraryPage.jsx` | `ItineraryPage` (`validateForm`, `handleConfirmBooking`) |