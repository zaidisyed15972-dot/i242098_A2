export const MAX_TICKETS_PER_SESSION = 8;
export const BUNDLE_DISCOUNT_THRESHOLD = 3; // 3+ exhibitions/activities = 15% off
export const BUNDLE_DISCOUNT_RATE = 0.15;
export const SINGLE_ITEM_BOOKING_FEE = 4; // $4 processing fee if fewer than 3 items

/**
 * RULE 1 (Capacity & Group Size):
 * Each itinerary session requires 1 to 8 tickets and cannot exceed remainingSeats.
 */
export function validateSessionCapacity(requestedTickets, remainingSeats) {
  if (!Number.isInteger(requestedTickets) || requestedTickets < 1) {
    return { valid: false, reason: "Select at least 1 ticket for this session." };
  }
  if (requestedTickets > MAX_TICKETS_PER_SESSION) {
    return {
      valid: false,
      reason: `Maximum ${MAX_TICKETS_PER_SESSION} tickets allowed per session.`
    };
  }
  if (requestedTickets > remainingSeats) {
    return {
      valid: false,
      reason:
        remainingSeats === 0
          ? "This time slot is now sold out."
          : `Only ${remainingSeats} seat(s) left for this time slot.`
    };
  }
  return { valid: true, reason: "" };
}

/**
 * RULE 2 (Eligibility & Supervision):
 * - 16+ Only events reject Child tickets.
 * - Family Friendly workshops marked requiresAdultWithChild require >= 1 Adult ticket if Child > 0.
 */
export function validateEligibility(exhibition, tickets) {
  const { adult = 0, child = 0, senior = 0 } = tickets;
  const total = adult + child + senior;

  if (total === 0) {
    return { valid: false, reason: "At least one visitor ticket is required." };
  }
  if (exhibition.minAge >= 16 && child > 0) {
    return {
      valid: false,
      reason: `"${exhibition.title}" is restricted to ages 16+. Remove child tickets to continue.`
    };
  }
  if (exhibition.requiresAdultWithChild && child > 0 && adult < 1) {
    return {
      valid: false,
      reason: `"${exhibition.title}" requires at least 1 accompanying Adult ticket with Child tickets.`
    };
  }
  return { valid: true, reason: "" };
}

/**
 * RULE 3 (Pricing & Multi-Exhibit Bundle Rule):
 * - Child tickets are 50% of basePrice; Senior tickets are 80% of basePrice.
 * - Booking 3 or more distinct exhibitions/workshops unlocks a 15% Bundle Pass Discount and waives the $4 booking fee.
 */
export function calculateItineraryTotals(itineraryItems) {
  let subtotal = 0;
  let totalTickets = 0;
  let totalDurationMins = 0;

  for (const item of itineraryItems) {
    const { adult = 0, child = 0, senior = 0 } = item.tickets;
    const itemTicketCount = adult + child + senior;
    const ticketCost =
      adult * item.basePrice +
      child * (item.basePrice * 0.5) +
      senior * (item.basePrice * 0.8);
    const feeCost = itemTicketCount * (item.specialFee || 0);

    subtotal += ticketCost + feeCost;
    totalTickets += itemTicketCount;
    totalDurationMins += item.durationMins;
  }

  const qualifiesForBundle = itineraryItems.length >= BUNDLE_DISCOUNT_THRESHOLD;
  const discountAmount = qualifiesForBundle ? subtotal * BUNDLE_DISCOUNT_RATE : 0;
  const bookingFee = itineraryItems.length > 0 && !qualifiesForBundle ? SINGLE_ITEM_BOOKING_FEE : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + bookingFee);

  return {
    itemCount: itineraryItems.length,
    totalTickets,
    totalDurationMins,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    bookingFee: Number(bookingFee.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    qualifiesForBundle
  };
}

/**
 * Helper to detect overlapping time slots on the same visit day.
 */
export function timeToMinutes(timeStr) {
  const [hours, mins] = timeStr.split(":").map(Number);
  return hours * 60 + mins;
}

export function findTimeSlotConflict(existingItems, candidateItem) {
  const candStart = timeToMinutes(candidateItem.timeSlot);
  const candEnd = candStart + candidateItem.durationMins;

  return existingItems.find((item) => {
    if (item.id === candidateItem.id && item.timeSlot === candidateItem.timeSlot) {
      return false;
    }
    const start = timeToMinutes(item.timeSlot);
    const end = start + item.durationMins;
    return candStart < end && candEnd > start;
  }) || null;
}