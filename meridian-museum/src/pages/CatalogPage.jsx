import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVisit } from "../context/VisitContext.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ExhibitCard from "../components/ExhibitCard.jsx";

export default function CatalogPage() {
  const {
    exhibitions,
    loading,
    loadError,
    loadCatalog,
    statusBanner,
    setStatusBanner,
    totals
  } = useVisit();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const audience = searchParams.get("audience") || "All";
  const sortBy = searchParams.get("sort") || "recommended";

  const updateParam = (key, value, defaultVal) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultVal) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  const filteredExhibitions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = exhibitions.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.galleryWing.toLowerCase().includes(q);
      const matchesCategory = category === "All" || item.category === category;
      const matchesAudience = audience === "All" || item.audience === audience;
      return matchesSearch && matchesCategory && matchesAudience;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "duration-asc") return a.durationMins - b.durationMins;
      if (sortBy === "seats-desc") {
        const seatsA = a.timeSlots.reduce((sum, s) => sum + s.remainingSeats, 0);
        const seatsB = b.timeSlots.reduce((sum, s) => sum + s.remainingSeats, 0);
        return seatsB - seatsA;
      }
      return 0;
    });
  }, [exhibitions, searchQuery, category, audience, sortBy]);

  return (
    <main className="container page-content">
      <div className="catalog-header">
        <div>
          <h1>Exhibitions, Guided Tours &amp; Workshops</h1>
          <p>
            Current Visit Plan: <strong>{totals.itemCount} selected</strong> ({totals.totalDurationMins} mins total) &bull;{" "}
            <Link to="/itinerary">Open Visit Pass &rarr;</Link>
          </p>
        </div>
      </div>

      {statusBanner && (
        <div className={`alert alert-${statusBanner.type}`} role="status">
          <span>{statusBanner.text}</span>
          <button type="button" className="btn-link" onClick={() => setStatusBanner(null)}>
            Dismiss
          </button>
        </div>
      )}

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={(v) => updateParam("q", v, "")}
        category={category}
        setCategory={(v) => updateParam("category", v, "All")}
        audience={audience}
        setAudience={(v) => updateParam("audience", v, "All")}
        sortBy={sortBy}
        setSortBy={(v) => updateParam("sort", v, "recommended")}
        onReset={resetFilters}
      />

      {loading && <div className="state-box">Loading exhibitions and live slot capacity...</div>}

      {!loading && loadError && (
        <div className="state-box error-box" role="alert">
          <h2>Could not load schedule</h2>
          <p>{loadError}</p>
          <button type="button" className="btn-primary" onClick={loadCatalog}>
            Retry Loading
          </button>
        </div>
      )}

      {!loading && !loadError && exhibitions.length === 0 && (
        <div className="state-box">
          <h2>No exhibitions scheduled</h2>
          <p>There are currently no active museum exhibitions in the catalog.</p>
        </div>
      )}

      {!loading && !loadError && exhibitions.length > 0 && filteredExhibitions.length === 0 && (
        <div className="state-box">
          <h2>No matching exhibitions</h2>
          <p>No galleries or workshops match your current search and filter criteria.</p>
          <button type="button" className="btn-primary" onClick={resetFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {!loading && !loadError && filteredExhibitions.length > 0 && (
        <div className="cards-grid">
          {filteredExhibitions.map((item) => (
            <ExhibitCard key={item.id} exhibition={item} />
          ))}
        </div>
      )}
    </main>
  );
}