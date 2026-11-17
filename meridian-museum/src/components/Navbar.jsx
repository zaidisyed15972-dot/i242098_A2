import { NavLink } from "react-router-dom";
import { useVisit } from "../context/VisitContext.jsx";

export default function Navbar() {
  const { itinerary, totals } = useVisit();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand-logo">
          <span className="brand-mark">M</span>
          <div>
            <strong>Meridian Museum</strong>
            <span className="brand-sub">History &amp; Science Discovery</span>
          </div>
        </NavLink>

        <nav aria-label="Primary Navigation" className="main-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/exhibitions" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Exhibitions &amp; Tours
          </NavLink>
          <NavLink to="/itinerary" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Visit Pass ({itinerary.length})
            {totals.grandTotal > 0 && <span className="nav-pill">${totals.grandTotal.toFixed(0)}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}