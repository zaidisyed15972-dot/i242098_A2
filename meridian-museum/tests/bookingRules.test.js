import test from "node:test";
import assert from "node:assert/strict";
import {
  validateSessionCapacity,
  MAX_TICKETS_PER_SESSION
} from "../src/rules/bookingRules.js";

test("validateSessionCapacity accepts an ordinary valid ticket count", () => {
  const result = validateSessionCapacity(4, 12);
  assert.equal(result.valid, true);
  assert.equal(result.reason, "");
});

test("validateSessionCapacity accepts a count exactly at the rule limit (8)", () => {
  const result = validateSessionCapacity(MAX_TICKETS_PER_SESSION, 10);
  assert.equal(result.valid, true);
});

test("validateSessionCapacity rejects a count exceeding the rule limit (9)", () => {
  const result = validateSessionCapacity(MAX_TICKETS_PER_SESSION + 1, 15);
  assert.equal(result.valid, false);
  assert.match(result.reason, /Maximum 8 tickets/);
});

test("validateSessionCapacity rejects when requested tickets exceed remaining seats", () => {
  const result = validateSessionCapacity(5, 3);
  assert.equal(result.valid, false);
  assert.match(result.reason, /Only 3 seat/);
});