import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetchExhibitions } from "../data/exhibitions.js";
import {
  validateSessionCapacity,
  validateEligibility,
  calculateItineraryTotals,
  findTimeSlotConflict
} from "../rules/bookingRules.js";

const VisitContext = createContext(null);
const STORAGE_KEY = "meridian_visit_pass_v1";

function getTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function VisitProvider({ children }) {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Task 6.1 Demonstration toggles for edge-case verification
  const [simulateError, setSimulateError] = useState(false);
  const [simulateSoldOutId, setSimulateSoldOutId] = useState(null);

  // Persisted Visit Pass State (FR13)
  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved?.selectedDate || getTomorrowISO();
    } catch {
      return getTomorrowISO();
    }
  });

  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved?.itinerary) ? saved.itinerary : [];
    } catch {
      return [];
    }
  });

  const [statusBanner, setStatusBanner] = useState(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchExhibitions({ simulateError, simulateSoldOutId });
      setExhibitions(data);
    } catch (err) {
      setLoadError(err.message || "Failed to load exhibitions.");
    } finally {
      setLoading(false);
    }
  }, [simulateError, simulateSoldOutId]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Sync to localStorage whenever selectedDate or itinerary changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selectedDate, itinerary })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [selectedDate, itinerary]);

  // Calculate remaining seats dynamically by subtracting user's current itinerary hold
  const exhibitionsWithLiveSeats = useMemo(() => {
    return exhibitions.map((exh) => ({
      ...exh,
      timeSlots: exh.timeSlots.map((slot) => {
        const bookedEntry = itinerary.find(
          (item) => item.id === exh.id && item.timeSlot === slot.time
        );
        const heldTickets = bookedEntry
          ? bookedEntry.tickets.adult + bookedEntry.tickets.child + bookedEntry.tickets.senior
          : 0;
        return {
          ...slot,
          rawSeats: slot.remainingSeats,
          remainingSeats: Math.max(0, slot.remainingSeats - heldTickets)
        };
      })
    }));
  }, [exhibitions, itinerary]);

  // Detect conflicts or stale restored selections (Task 6.1)
  const itineraryIssues = useMemo(() => {
    const issues = [];
    itinerary.forEach((item) => {
      const liveExh = exhibitions.find((e) => e.id === item.id);
      if (!liveExh) {
        issues.push({
          key: `${item.id}-${item.timeSlot}`,
          message: `"${item.title}" is no longer available on the schedule.`
        });
        return;
      }
      const liveSlot = liveExh.timeSlots.find((s) => s.time === item.timeSlot);
      const totalRequested = item.tickets.adult + item.tickets.child + item.tickets.senior;
      const capCheck = validateSessionCapacity(totalRequested, liveSlot ? liveSlot.remainingSeats : 0);
      if (!capCheck.valid) {
        issues.push({
          key: `${item.id}-${item.timeSlot}`,
          message: `${item.title} (${item.timeSlot}): ${capCheck.reason}`
        });
      }
      const eligCheck = validateEligibility(liveExh, item.tickets);
      if (!eligCheck.valid) {
        issues.push({
          key: `${item.id}-${item.timeSlot}`,
          message: eligCheck.reason
        });
      }
      const overlap = findTimeSlotConflict(itinerary, item);
      if (overlap) {
        issues.push({
          key: `${item.id}-${item.timeSlot}`,
          message: `Schedule overlap: "${item.title}" (${item.timeSlot}) overlaps with "${overlap.title}" (${overlap.timeSlot}).`
        });
      }
    });
    return issues;
  }, [itinerary, exhibitions]);

  const addOrUpdateSlot = (exhibition, timeSlot) => {
    const existingIndex = itinerary.findIndex((item) => item.id === exhibition.id);
    const keepingExistingSlot =
      existingIndex >= 0 && itinerary[existingIndex].timeSlot === timeSlot;
    const slotObj = exhibition.timeSlots.find((s) => s.time === timeSlot);
    if (!slotObj || (slotObj.remainingSeats < 1 && !keepingExistingSlot)) {
      setStatusBanner({ type: "error", text: "Selected time slot has no remaining seats." });
      return false;
    }

    const candidate = {
      id: exhibition.id,
      title: exhibition.title,
      category: exhibition.category,
      timeSlot,
      durationMins: exhibition.durationMins,
      basePrice: exhibition.basePrice,
      specialFee: exhibition.specialFee,
      minAge: exhibition.minAge,
      requiresAdultWithChild: exhibition.requiresAdultWithChild,
      tickets:
        existingIndex >= 0
          ? itinerary[existingIndex].tickets
          : { adult: 1, child: 0, senior: 0 }
    };

    const conflict = findTimeSlotConflict(
      itinerary.filter((_, idx) => idx !== existingIndex),
      candidate
    );

    setItinerary((prev) => {
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = candidate;
        return updated;
      }
      return [...prev, candidate];
    });

    if (conflict) {
      setStatusBanner({
        type: "warning",
        text: `Added "${exhibition.title}" at ${timeSlot}, but it overlaps with "${conflict.title}" (${conflict.timeSlot}). Adjust slots in your Visit Pass.`
      });
    } else {
      setStatusBanner({
        type: "success",
        text: `Reserved ${timeSlot} slot for "${exhibition.title}" in your Visit Pass.`
      });
    }
    return true;
  };

  const updateTicketCount = (exhibitionId, timeSlot, tier, delta) => {
    setItinerary((prev) =>
      prev.map((item) => {
        if (item.id !== exhibitionId || item.timeSlot !== timeSlot) return item;
        const nextCount = Math.max(0, (item.tickets[tier] || 0) + delta);
        return {
          ...item,
          tickets: {
            ...item.tickets,
            [tier]: nextCount
          }
        };
      })
    );
  };

  const removeFromItinerary = (exhibitionId, timeSlot) => {
    setItinerary((prev) =>
      prev.filter((item) => !(item.id === exhibitionId && item.timeSlot === timeSlot))
    );
  };

  const clearItinerary = () => {
    setItinerary([]);
    setStatusBanner(null);
  };

  const totals = useMemo(() => calculateItineraryTotals(itinerary), [itinerary]);

  return (
    <VisitContext.Provider
      value={{
        exhibitions: exhibitionsWithLiveSeats,
        loading,
        loadError,
        loadCatalog,
        simulateError,
        setSimulateError,
        simulateSoldOutId,
        setSimulateSoldOutId,
        selectedDate,
        setSelectedDate,
        itinerary,
        itineraryIssues,
        totals,
        statusBanner,
        setStatusBanner,
        addOrUpdateSlot,
        updateTicketCount,
        removeFromItinerary,
        clearItinerary
      }}
    >
      {children}
    </VisitContext.Provider>
  );
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit must be used inside VisitProvider");
  return ctx;
}