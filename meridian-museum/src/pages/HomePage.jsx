import { Link } from "react-router-dom";
import { useVisit } from "../context/VisitContext.jsx";
import ExhibitCard from "../components/ExhibitCard.jsx";

export default function HomePage() {
  const {
    exhibitions,
    loading,
    loadError,
    loadCatalog,
    simulateError,
    setSimulateError,
    simulateSoldOutId,
    setSimulateSoldOutId
  } = useVisit();

  const featured = exhibitions.slice(0, 3);

  return (
    <main className="container page-content">
      <section className="hero-banner">
        <div className="hero-text">
          <p className="eyebrow">Plan Your Day in One Unified Visit Pass</p>
          <h1>Discover Four Millennia of Human Ingenuity</h1>
          <p>
            Compare gallery durations, check real-time entry slots upfront, and bundle
            exhibitions, workshops, and curator tours without switching portals.
          </p>
          <div className="hero-actions">
            <Link to="/exhibitions" className="btn-primary">
              Browse All 10 Exhibitions
            </Link>
            <Link to="/itinerary" className="btn-secondary">
              Review Visit Pass
            </Link>
          </div>
        </div>
      </section>

      {/* Task 6.1 Required Demonstration Controls for Edge-Case Verification */}
      <section className="demo-controls" aria-label="Edge-case demonstration controls">
        <h2>Edge-Case Verification Controls (Task 6.1)</h2>
        <div className="demo-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
            />
            Simulate Schedule API Failure (Test FR14 Error &amp; Retry)
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={simulateSoldOutId === "exh-01"}
              onChange={(e) => setSimulateSoldOutId(e.target.checked ? "exh-01" : null)}
            />
            Force &ldquo;Empires of the Silk Road&rdquo; Sold Out (Test Restored Selection Conflict)
          </label>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Featured Galleries &amp; Workshops</h2>
          <Link to="/exhibitions">View full schedule &rarr;</Link>
        </div>

        {loading ? (
          <p className="state-box">Loading museum schedule...</p>
        ) : loadError ? (
          <div className="state-box error-box" role="alert">
            <h2>Could not load schedule</h2>
            <p>{loadError}</p>
            <button type="button" className="btn-primary" onClick={loadCatalog}>
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {featured.map((item) => (
              <ExhibitCard key={item.id} exhibition={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}