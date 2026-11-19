import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useVisit } from "../context/VisitContext.jsx";
import {
  MAX_TICKETS_PER_SESSION,
  BUNDLE_DISCOUNT_THRESHOLD
} from "../rules/bookingRules.js";

export default function ItineraryPage() {
  const {
    exhibitions,
    selectedDate,
    setSelectedDate,
    itinerary,
    itineraryIssues,
    totals,
    updateTicketCount,
    removeFromItinerary,
    clearItinerary
  } = useVisit();

  // Controlled Form State (FR09: 4 user-editable fields)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    accessNeeds: "None",
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const validateForm = () => {
    const errors = {};
    if (formData.fullName.trim().length < 3) {
      errors.fullName = "Please enter the lead visitor's full name (at least 3 characters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address for your digital Visit Pass.";
    }
    if (!formData.termsAccepted) {
      errors.termsAccepted = "Please confirm that you have reviewed the timed-entry guidelines.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (!isFormValid || itineraryIssues.length > 0 || itinerary.length === 0) {
      return;
    }

    const referenceCode = `MRD-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmation({
      referenceCode,
      visitDate: selectedDate,
      visitor: { ...formData },
      items: itinerary.map((i) => ({ ...i })),
      totals: { ...totals }
    });
    clearItinerary();
  };

  if (confirmation) {
    return (
      <main className="container page-content">
        <section className="confirmation-card" aria-live="polite">
          <span className="badge-success">Simulated Booking Confirmed</span>
          <h1>Your Meridian Visit Pass</h1>
          <p>
            Booking Reference: <strong>{confirmation.referenceCode}</strong> &bull; Visit Date:{" "}
            <strong>{confirmation.visitDate}</strong>
          </p>
          <p>
            Issued to <strong>{confirmation.visitor.fullName}</strong> ({confirmation.visitor.email})
          </p>

          <ul className="receipt-list">
            {confirmation.items.map((item) => (
              <li key={`${item.id}-${item.timeSlot}`}>
                <strong>{item.timeSlot}</strong> &mdash; {item.title} ({item.durationMins} mins) |
                Tickets: {item.tickets.adult} Adult, {item.tickets.child} Child, {item.tickets.senior} Senior
              </li>
            ))}
          </ul>

          <div className="receipt-total">
            <p>Total Paid (Simulated): <strong>${confirmation.totals.grandTotal.toFixed(2)}</strong></p>
          </div>

          <Link to="/exhibitions" className="btn-primary" onClick={() => setConfirmation(null)}>
            Plan Another Visit
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-content">
      <h1>Your Unified Visit Pass</h1>
      <p>Combine galleries, tours, and workshops into a single conflict-free schedule.</p>

      {/* Bundle Progress Indicator (Rule 3) */}
      <div className="bundle-banner">
        {totals.qualifiesForBundle ? (
          <strong>Bundle Unlocked! You saved 15% (${totals.discountAmount.toFixed(2)}) and waived the $4 booking fee.</strong>
        ) : (
          <span>
            Add <strong>{Math.max(0, BUNDLE_DISCOUNT_THRESHOLD - itinerary.length)}</strong> more exhibition(s) to unlock{" "}
            <strong>15% Bundle Pass savings</strong> and waive the $4 booking fee.
          </span>
        )}
      </div>

      {/* Edge-Case & Operating Rule Conflict Alert Panel (Task 6.1 & FR12) */}
      {itineraryIssues.length > 0 && (
        <div className="alert alert-error" role="alert">
          <div>
            <strong>Action Required Before Confirming:</strong>
            <ul>
              {itineraryIssues.map((issue) => (
                <li key={issue.key}>{issue.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {itinerary.length === 0 ? (
        <div className="state-box">
          <h2>Your Visit Pass is empty</h2>
          <p>Browse our galleries and click a time slot to start building your day.</p>
          <Link to="/exhibitions" className="btn-primary">
            Explore Exhibitions
          </Link>
        </div>
      ) : (
        <div className="itinerary-layout">
          <section className="itinerary-items" aria-label="Selected sessions">
            <div className="field-group inline-date">
              <label htmlFor="itinerary-date">Visit Date:</label>
              <input
                id="itinerary-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {[...itinerary]
              .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
              .map((item) => {
                const liveExh = exhibitions.find((e) => e.id === item.id);
                const liveSlot = liveExh?.timeSlots.find((s) => s.time === item.timeSlot);
                const totalItemTickets = item.tickets.adult + item.tickets.child + item.tickets.senior;
                const canAddMore =
                  totalItemTickets < MAX_TICKETS_PER_SESSION && (liveSlot?.remainingSeats || 0) > 0;

                return (
                  <article key={`${item.id}-${item.timeSlot}`} className="itinerary-card">
                    <div className="itinerary-card-header">
                      <div>
                        <span className="pill pill-duration">{item.timeSlot} ({item.durationMins} mins)</span>
                        <h3>{item.title}</h3>
                        <p className="muted-text">
                          Max {MAX_TICKETS_PER_SESSION} tickets/booking &bull; {liveSlot?.remainingSeats ?? 0} extra seats available
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => removeFromItinerary(item.id, item.timeSlot)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="ticket-steppers">
                      {[
                        { key: "adult", label: `Adult ($${item.basePrice})` },
                        { key: "child", label: `Child ($${(item.basePrice * 0.5).toFixed(2)})` },
                        { key: "senior", label: `Senior ($${(item.basePrice * 0.8).toFixed(2)})` }
                      ].map((tier) => (
                        <div key={tier.key} className="stepper-row">
                          <span>{tier.label}</span>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              aria-label={`Decrease ${tier.label} for ${item.title}`}
                              disabled={item.tickets[tier.key] === 0}
                              onClick={() => updateTicketCount(item.id, item.timeSlot, tier.key, -1)}
                            >
                              -
                            </button>
                            <span>{item.tickets[tier.key]}</span>
                            <button
                              type="button"
                              aria-label={`Increase ${tier.label} for ${item.title}`}
                              disabled={!canAddMore}
                              onClick={() => updateTicketCount(item.id, item.timeSlot, tier.key, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
          </section>

          <aside className="summary-sidebar">
            <div className="summary-box">
              <h2>Calculated Summary</h2>
              <dl className="summary-list">
                <div>
                  <dt>Total Sessions</dt>
                  <dd>{totals.itemCount}</dd>
                </div>
                <div>
                  <dt>Total Visitors</dt>
                  <dd>{totals.totalTickets}</dd>
                </div>
                <div>
                  <dt>Estimated Duration</dt>
                  <dd>{(totals.totalDurationMins / 60).toFixed(1)} hrs ({totals.totalDurationMins} mins)</dd>
                </div>
                <div>
                  <dt>Tickets &amp; Audio Kits</dt>
                  <dd>${totals.subtotal.toFixed(2)}</dd>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="discount-row">
                    <dt>Bundle Discount (15%)</dt>
                    <dd>-${totals.discountAmount.toFixed(2)}</dd>
                  </div>
                )}
                <div>
                  <dt>Single-Pass Booking Fee</dt>
                  <dd>${totals.bookingFee.toFixed(2)}</dd>
                </div>
                <div className="grand-total-row">
                  <dt>Total Due (Simulated)</dt>
                  <dd>${totals.grandTotal.toFixed(2)}</dd>
                </div>
              </dl>

              {totals.totalDurationMins > 300 && (
                <p className="warning-note">
                  Note: Your itinerary exceeds 5 hours. Consider spacing activities across two days.
                </p>
              )}

              <form onSubmit={handleConfirmBooking} noValidate className="checkout-form">
                <h3>Visitor Details</h3>

                <div className="field-group">
                  <label htmlFor="visitor-name">Lead Visitor Full Name *</label>
                  <input
                    id="visitor-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                  {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
                </div>

                <div className="field-group">
                  <label htmlFor="visitor-email">Email for E-Tickets *</label>
                  <input
                    id="visitor-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>

                <div className="field-group">
                  <label htmlFor="access-needs">Accessibility Requirements</label>
                  <select
                    id="access-needs"
                    value={formData.accessNeeds}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accessNeeds: e.target.value }))}
                  >
                    <option value="None">None</option>
                    <option value="Wheelchair Access">Step-Free / Wheelchair Access</option>
                    <option value="Hearing Loop">Induction Hearing Loop</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))
                      }
                    />
                    I acknowledge timed-entry arrival windows (Simulated Booking) *
                  </label>
                  {formErrors.termsAccepted && (
                    <span className="field-error">{formErrors.termsAccepted}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-full"
                  disabled={itineraryIssues.length > 0}
                >
                  Confirm Simulated Visit Pass
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}