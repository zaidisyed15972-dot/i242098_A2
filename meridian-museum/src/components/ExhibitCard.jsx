import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useVisit } from "../context/VisitContext.jsx";

export default function ExhibitCard({ exhibition }) {
  const { itinerary, addOrUpdateSlot } = useVisit();
  const [imgFailed, setImgFailed] = useState(false);

  const existingBooking = itinerary.find((item) => item.id === exhibition.id);
  const firstAvailable = exhibition.timeSlots.find((s) => s.remainingSeats > 0);
  const [chosenSlot, setChosenSlot] = useState(
    existingBooking?.timeSlot || firstAvailable?.time || exhibition.timeSlots[0]?.time || ""
  );

  const totalPrice = exhibition.basePrice + (exhibition.specialFee || 0);

  return (
    <article className="exhibit-card">
      <div className="card-media">
        {!imgFailed ? (
          <img
            src={exhibition.imageUrl}
            alt={exhibition.imageAlt}
            onError={() => setImgFailed(true)}
          />
        ) : (
          /* Fallback when image file is not yet added to /public/images/ (Task 6.1) */
          <div className="image-placeholder-box" role="img" aria-label={exhibition.imageAlt}>
            <span className="placeholder-tag">Image Placeholder</span>
            <p>{exhibition.imageDescription}</p>
            <code>{exhibition.imageUrl}</code>
          </div>
        )}
        <span className="badge-category">{exhibition.category}</span>
      </div>

      <div className="card-body">
        {/* Problem 1 Fix: Upfront Duration, Total Price (including fees), and Age Eligibility */}
        <div className="meta-pills">
          <span className="pill pill-duration">{exhibition.durationMins} mins</span>
          <span className="pill pill-price">
            ${totalPrice} Adult {exhibition.specialFee > 0 ? `(incl. $${exhibition.specialFee} kit/audio)` : ""}
          </span>
          <span className={`pill ${exhibition.minAge >= 16 ? "pill-warn" : "pill-ok"}`}>
            {exhibition.audience}
          </span>
        </div>

        <h3 className="card-title">
          <Link to={`/exhibitions/${exhibition.id}`}>{exhibition.title}</Link>
        </h3>
        <p className="card-wing">{exhibition.galleryWing}</p>
        <p className="card-summary">{exhibition.summary}</p>

        {/* Problem 3 Fix: Interactive Time-Slot Pills with Live Remaining Seats directly on card */}
        <div className="slot-picker">
          <span className="slot-label">Select Time Slot:</span>
          <div className="slot-grid">
            {exhibition.timeSlots.map((slot) => {
              const isSoldOut =
                slot.remainingSeats === 0 && existingBooking?.timeSlot !== slot.time;
              const isSelected = chosenSlot === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isSoldOut}
                  className={`slot-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => setChosenSlot(slot.time)}
                >
                  <strong>{slot.time}</strong>
                  <span>{isSoldOut ? "Sold out" : `${slot.remainingSeats} left`}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-footer">
          <Link to={`/exhibitions/${exhibition.id}`} className="btn-secondary">
            Details
          </Link>
          <button
            type="button"
            className="btn-primary"
            disabled={
              !exhibition.timeSlots.some(
                (slot) =>
                  slot.time === chosenSlot &&
                  (slot.remainingSeats > 0 || existingBooking?.timeSlot === slot.time)
              )
            }
            onClick={() => addOrUpdateSlot(exhibition, chosenSlot)}
          >
            {existingBooking ? `Update (${existingBooking.timeSlot})` : "Add to Visit Pass"}
          </button>
        </div>
      </div>
    </article>
  );
}