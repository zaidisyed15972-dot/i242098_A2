import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext.jsx";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exhibitions, loading, addOrUpdateSlot, itinerary } = useVisit();
  const [imgFailed, setImgFailed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const exhibition = exhibitions.find((item) => item.id === id);
  const existing = exhibition && itinerary.find((item) => item.id === exhibition.id);
  const firstOpen = exhibition?.timeSlots.find((slot) => slot.remainingSeats > 0);

  useEffect(() => {
    setSelectedSlot(existing?.timeSlot || firstOpen?.time || "");
    setImgFailed(false);
  }, [id, existing?.timeSlot, firstOpen?.time]);

  if (loading) {
    return (
      <main className="container page-content">
        <p className="state-box">Loading exhibition details...</p>
      </main>
    );
  }

  if (!exhibition) {
    return (
      <main className="container page-content">
        <div className="state-box error-box">
          <h1>Exhibition Not Found</h1>
          <p>The exhibition ID &ldquo;{id}&rdquo; does not exist or has closed.</p>
          <Link to="/exhibitions" className="btn-primary">
            Return to All Exhibitions
          </Link>
        </div>
      </main>
    );
  }

  const handleReserve = () => {
    if (addOrUpdateSlot(exhibition, selectedSlot)) {
      navigate("/itinerary");
    }
  };

  return (
    <main className="container page-content">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <button type="button" className="btn-link" onClick={() => navigate(-1)}>
          &larr; Back to Previous View
        </button>
      </nav>

      <div className="detail-layout">
        <div className="detail-media">
          {!imgFailed ? (
            <img
              src={exhibition.imageUrl}
              alt={exhibition.imageAlt}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="image-placeholder-box large">
              <span className="placeholder-tag">Image Placeholder</span>
              <p>{exhibition.imageDescription}</p>
              <code>{exhibition.imageUrl}</code>
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="meta-pills">
            <span className="pill">{exhibition.category}</span>
            <span className="pill pill-duration">{exhibition.durationMins} minutes</span>
            <span className="pill">{exhibition.audience}</span>
          </div>

          <h1>{exhibition.title}</h1>
          <p className="detail-wing">Location: {exhibition.galleryWing}</p>
          <p className="detail-desc">{exhibition.summary}</p>

          <div className="rules-box">
            <h2>Admission &amp; Eligibility Rules</h2>
            <ul>
              <li>
                <strong>Adult Base Ticket:</strong> ${exhibition.basePrice} (Child 50% off, Senior 20% off)
              </li>
              <li>
                <strong>Special Equipment / Audio Fee:</strong>{" "}
                {exhibition.specialFee > 0 ? `$${exhibition.specialFee} per visitor (included in summary)` : "None"}
              </li>
              <li>
                <strong>Age Requirement:</strong>{" "}
                {exhibition.minAge >= 16
                  ? "Strictly ages 16 and older."
                  : exhibition.requiresAdultWithChild
                  ? "Family friendly — children must be accompanied by at least 1 adult."
                  : "Open to all ages."}
              </li>
            </ul>
          </div>

          <div className="slot-picker">
            <h3>Choose Entry Time</h3>
            <div className="slot-grid">
              {exhibition.timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={
                    slot.remainingSeats === 0 && existing?.timeSlot !== slot.time
                  }
                  className={`slot-btn ${selectedSlot === slot.time ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot.time)}
                >
                  <strong>{slot.time}</strong>
                  <span>{slot.remainingSeats === 0 ? "Sold out" : `${slot.remainingSeats} seats left`}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn-primary"
              disabled={
                !exhibition.timeSlots.some(
                  (slot) =>
                    slot.time === selectedSlot &&
                    (slot.remainingSeats > 0 || existing?.timeSlot === slot.time)
                )
              }
              onClick={handleReserve}
            >
              Add to Visit Pass &amp; Review
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}