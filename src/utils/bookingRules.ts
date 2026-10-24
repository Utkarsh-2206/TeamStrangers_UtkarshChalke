import { BookingStatus, OfferStatus } from '../types';

export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['negotiating', 'accepted', 'cancelled'],
  negotiating: ['negotiating', 'accepted', 'cancelled'],
  accepted: ['in_progress', 'cancelled', 'disputed'],
  in_progress: ['completed', 'disputed', 'cancelled'],
  completed: [], // terminal state
  cancelled: [], // terminal state
  disputed: ['completed', 'cancelled', 'in_progress'],
};

/**
 * Checks whether a booking state transition is allowed according to platform security rules.
 */
export function canTransitionBooking(
  currentStatus: BookingStatus,
  targetStatus: BookingStatus,
  role: 'customer' | 'worker' | 'admin'
): { allowed: boolean; reason?: string } {
  const allowedNextStates = VALID_TRANSITIONS[currentStatus];

  if (!allowedNextStates || !allowedNextStates.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Invalid state transition from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  // Role permissions
  if (role === 'worker') {
    // Worker cannot unilaterally complete a booking without customer sign-off
    if (targetStatus === 'completed' && currentStatus === 'in_progress') {
      return {
        allowed: false,
        reason: 'Only the customer can confirm and complete a service booking.',
      };
    }
  }

  if (role === 'customer') {
    // Customer cannot set job to in_progress (worker must arrive & start)
    if (targetStatus === 'in_progress') {
      return {
        allowed: false,
        reason: 'Only the service worker can start the on-site job.',
      };
    }
  }

  return { allowed: true };
}

/**
 * Validates price offer proposal
 */
export function validatePriceOffer(
  amount: number,
  minimumAmount: number = 100,
  maximumAmount: number = 50000
): { valid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: 'Price must be a valid number.' };
  }
  if (amount <= 0) {
    return { valid: false, error: 'Price must be greater than zero.' };
  }
  if (amount < minimumAmount) {
    return { valid: false, error: `Price cannot be lower than ₹${minimumAmount}.` };
  }
  if (amount > maximumAmount) {
    return { valid: false, error: `Price cannot exceed ₹${maximumAmount}.` };
  }
  return { valid: true };
}
