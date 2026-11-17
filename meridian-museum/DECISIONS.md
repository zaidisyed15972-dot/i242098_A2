# Implementation decisions

- Use a React single-page application with React Router so exhibition details,
  catalog filters, and the visit pass share one client-side flow.
- Keep the exhibition schedule as local mock data behind an asynchronous loader.
  This supports loading, failure, and sold-out demonstrations without implying a
  live reservation service.
- Keep booking eligibility, capacity, pricing, and time-conflict rules in
  `src/rules/bookingRules.js` so they can be checked independently of the UI.
- Keep the visit date and selected sessions in shared context and persist them in
  local storage. Catalog search and filters are encoded in URL query parameters.
- Treat confirmation as simulated: visitor details and payment are not transmitted
  to an external service.