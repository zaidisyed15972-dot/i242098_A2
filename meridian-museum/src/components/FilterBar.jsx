import { useVisit } from "../context/VisitContext.jsx";

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  audience,
  setAudience,
  sortBy,
  setSortBy,
  onReset
}) {
  const { selectedDate, setSelectedDate } = useVisit();

  return (
    <section className="filter-panel" aria-label="Filter and search exhibitions">
      <div className="filter-grid">
        <div className="field-group">
          <label htmlFor="visit-date">Visit Date</label>
          <input
            id="visit-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="search-exhibits">Search Galleries</label>
          <input
            id="search-exhibits"
            type="search"
            placeholder="Keyword, wing, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="filter-category">Category</label>
          <select id="filter-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Exhibitions">Exhibitions</option>
            <option value="Guided Tours">Guided Tours</option>
            <option value="Workshops">Workshops</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="filter-audience">Eligibility</label>
          <select id="filter-audience" value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="All">All Visitors</option>
            <option value="Family Friendly">Family Friendly</option>
            <option value="16+ Only">16+ Only</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="sort-exhibits">Sort By</label>
          <select id="sort-exhibits" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="duration-asc">Duration: Shortest First</option>
            <option value="seats-desc">Availability: Most Seats</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button type="button" className="btn-secondary btn-sm" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </section>
  );
}