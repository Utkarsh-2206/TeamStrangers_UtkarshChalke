import { describe, it, expect } from 'vitest';
import { canTransitionBooking, validatePriceOffer } from '../bookingRules';

describe('Booking Lifecycle & State Transitions', () => {
  it('allows worker to transition booking from pending to accepted', () => {
    const check = canTransitionBooking('pending', 'accepted', 'worker');
    expect(check.allowed).toBe(true);
  });

  it('allows worker to start accepted booking to in_progress', () => {
    const check = canTransitionBooking('accepted', 'in_progress', 'worker');
    expect(check.allowed).toBe(true);
  });

  it('prevents customer from starting in_progress state', () => {
    const check = canTransitionBooking('accepted', 'in_progress', 'customer');
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Only the service worker can start');
  });

  it('prevents worker from unilaterally completing in_progress booking', () => {
    const check = canTransitionBooking('in_progress', 'completed', 'worker');
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Only the customer can confirm');
  });

  it('allows customer to confirm and complete in_progress booking', () => {
    const check = canTransitionBooking('in_progress', 'completed', 'customer');
    expect(check.allowed).toBe(true);
  });

  it('rejects illegal transition from pending directly to completed', () => {
    const check = canTransitionBooking('pending', 'completed', 'admin');
    expect(check.allowed).toBe(false);
  });
});

describe('Price Negotiation Validation', () => {
  it('validates legitimate price offers', () => {
    expect(validatePriceOffer(450).valid).toBe(true);
    expect(validatePriceOffer(1500).valid).toBe(true);
  });

  it('rejects zero or negative prices', () => {
    expect(validatePriceOffer(0).valid).toBe(false);
    expect(validatePriceOffer(-200).valid).toBe(false);
  });

  it('rejects abnormally low prices below platform minimum', () => {
    expect(validatePriceOffer(40).valid).toBe(false);
  });
});
