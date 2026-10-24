import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore } from '../../lib/mockStore';
import { canTransitionBooking, validatePriceOffer } from '../bookingRules';

describe('End-to-End Customer-to-Worker Booking Lifecycle & Role Permissions', () => {
  beforeEach(() => {
    mockStore.resetToDemo();
  });

  it('executes full booking lifecycle: creation -> worker counteroffer -> customer acceptance -> start job -> customer completion -> review', async () => {
    // 1. Customer creates a new booking
    const booking = await mockStore.createBooking({
      customer_id: 'cust-priya',
      customer_name: 'Priya Verma',
      customer_phone: '+91 98765 11223',
      worker_id: 'w-rajesh',
      worker_name: 'Rajesh Sharma',
      worker_phone: '+91 98765 43210',
      worker_starting_rate: 450,
      service_id: 'srv-electrician',
      service_name: 'Electrician',
      job_description: 'Fix hallway ceiling light fixture and install new switch',
      service_address: 'Flat 402, Green Palms, Indiranagar',
      locality: 'Indiranagar',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      customer_budget: 600,
      proposed_price: 450,
    });

    expect(booking.id).toBeDefined();
    expect(booking.status).toBe('pending');
    expect(booking.offers?.length).toBe(1);
    expect(booking.offers?.[0].amount).toBe(450);
    expect(booking.offers?.[0].status).toBe('pending');

    // 2. Worker reviews request and submits a counteroffer of ₹550
    const counterRes = await mockStore.submitPriceOffer(booking.id, {
      offered_by: 'w-rajesh',
      offered_by_role: 'worker',
      offered_by_name: 'Rajesh Sharma',
      amount: 550,
      message: 'Ceiling box replacement requires additional heavy duty anchor screws.',
    });

    expect(counterRes.success).toBe(true);
    expect(counterRes.booking?.status).toBe('negotiating');
    expect(counterRes.booking?.proposed_price).toBe(550);
    expect(counterRes.booking?.offers?.length).toBe(2);

    const latestOffer = counterRes.booking?.offers?.[1];
    expect(latestOffer?.status).toBe('pending');
    expect(latestOffer?.amount).toBe(550);

    // 3. Customer accepts the counteroffer
    const acceptRes = await mockStore.acceptOffer(booking.id, latestOffer!.id, 'customer');
    expect(acceptRes.success).toBe(true);
    expect(acceptRes.booking?.status).toBe('accepted');
    expect(acceptRes.booking?.agreed_price).toBe(550);

    // 4. Role Permission Guard: Customer cannot start the job (worker must arrive on site)
    const illegalStartCheck = canTransitionBooking('accepted', 'in_progress', 'customer');
    expect(illegalStartCheck.allowed).toBe(false);

    // 5. Worker arrives and starts the job
    const startRes = await mockStore.updateBookingStatus(booking.id, 'in_progress', 'worker');
    expect(startRes.success).toBe(true);
    expect(startRes.booking?.status).toBe('in_progress');

    // 6. Role Permission Guard: Worker CANNOT unilaterally mark job completed without customer sign-off
    const illegalCompleteCheck = canTransitionBooking('in_progress', 'completed', 'worker');
    expect(illegalCompleteCheck.allowed).toBe(false);
    expect(illegalCompleteCheck.reason).toContain('Only the customer can confirm');

    // 7. Customer confirms satisfactory completion
    const completeRes = await mockStore.updateBookingStatus(booking.id, 'completed', 'customer');
    expect(completeRes.success).toBe(true);
    expect(completeRes.booking?.status).toBe('completed');
    expect(completeRes.booking?.completed_at).toBeDefined();

    // 8. Customer submits verified review
    const reviewRes = await mockStore.submitReview({
      booking_id: booking.id,
      customer_id: 'cust-priya',
      customer_name: 'Priya Verma',
      worker_id: 'w-rajesh',
      rating: 5,
      comment: 'Arrived promptly, fixed the ceiling light with great skill and left the place clean!',
    });

    expect(reviewRes.success).toBe(true);
    expect(reviewRes.review?.rating).toBe(5);

    // 9. Review Duplication Guard: Customer cannot submit duplicate review for same booking
    const duplicateReviewRes = await mockStore.submitReview({
      booking_id: booking.id,
      customer_id: 'cust-priya',
      customer_name: 'Priya Verma',
      worker_id: 'w-rajesh',
      rating: 4,
      comment: 'Trying to review again',
    });
    expect(duplicateReviewRes.success).toBe(false);
    expect(duplicateReviewRes.error).toContain('already been submitted');
  });

  it('allows administrator to verify workers and resolve disputes', async () => {
    // 1. Worker verification approval
    const verifyRes = await mockStore.updateWorkerVerification('w-arun', 'verified');
    expect(verifyRes).toBe(true);

    const verifiedWorker = await mockStore.getWorkerById('w-arun');
    expect(verifiedWorker?.verification_status).toBe('verified');

    // 2. Issue reporting and resolution
    const issue = await mockStore.reportIssue({
      booking_id: 'book-101',
      reported_by: 'cust-priya',
      reporter_name: 'Priya Verma',
      issue_type: 'Schedule Reschedule',
      description: 'Need to delay visit by 30 mins due to society power cut.',
    });
    expect(issue.id).toBeDefined();

    // Booking status becomes disputed
    const disputedBooking = await mockStore.getBookingById('book-101');
    expect(disputedBooking?.status).toBe('disputed');

    // Admin marks resolved
    const resolveRes = await mockStore.updateIssueStatus(issue.id, 'resolved');
    expect(resolveRes).toBe(true);
  });
});
