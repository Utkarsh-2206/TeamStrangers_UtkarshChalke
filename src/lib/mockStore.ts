import {
  WorkerProfile,
  Service,
  Booking,
  PriceOffer,
  Review,
  IssueReport,
  Profile,
  BookingStatus,
  VerificationStatus,
  AvailabilityStatus,
} from '../types';
import {
  DEMO_WORKERS,
  DEMO_SERVICES,
  DEMO_BOOKINGS,
  DEMO_REVIEWS,
  DEMO_ISSUES,
  DEMO_PROFILES,
} from './demoData';
import { canTransitionBooking, validatePriceOffer } from '../utils/bookingRules';

const STORAGE_KEYS = {
  WORKERS: 'kaamconnect_workers_v1',
  SERVICES: 'kaamconnect_services_v1',
  BOOKINGS: 'kaamconnect_bookings_v1',
  REVIEWS: 'kaamconnect_reviews_v1',
  ISSUES: 'kaamconnect_issues_v1',
  PROFILES: 'kaamconnect_profiles_v1',
};

const memoryStorage: Record<string, string> = {};

let idCounter = 0;
function generateId(prefix: string): string {
  idCounter++;
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 7)}`;
}

function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

function getStored<T>(key: string, defaultValue: T): T {
  try {
    if (typeof localStorage === 'undefined') {
      const mem = memoryStorage[key];
      if (!mem) {
        memoryStorage[key] = JSON.stringify(defaultValue);
        return cloneData(defaultValue);
      }
      return JSON.parse(mem);
    }
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return cloneData(defaultValue);
    }
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return cloneData(defaultValue);
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') {
      memoryStorage[key] = JSON.stringify(value);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kaamconnect:data-changed', { detail: { key } }));
    }
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

class MockDataStore {
  // Reset store to fresh demo seed
  resetToDemo(): void {
    for (const k of Object.keys(memoryStorage)) {
      delete memoryStorage[k];
    }
    setStored(STORAGE_KEYS.WORKERS, cloneData(DEMO_WORKERS));
    setStored(STORAGE_KEYS.SERVICES, cloneData(DEMO_SERVICES));
    setStored(STORAGE_KEYS.BOOKINGS, cloneData(DEMO_BOOKINGS));
    setStored(STORAGE_KEYS.REVIEWS, cloneData(DEMO_REVIEWS));
    setStored(STORAGE_KEYS.ISSUES, cloneData(DEMO_ISSUES));
    setStored(STORAGE_KEYS.PROFILES, cloneData(DEMO_PROFILES));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kaamconnect:data-changed', { detail: { key: 'all' } }));
    }
  }

  // SERVICES
  async getServices(): Promise<Service[]> {
    return getStored<Service[]>(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
  }

  // WORKERS
  async getWorkers(): Promise<WorkerProfile[]> {
    return getStored<WorkerProfile[]>(STORAGE_KEYS.WORKERS, DEMO_WORKERS);
  }

  async getWorkerById(workerId: string): Promise<WorkerProfile | null> {
    const workers = await this.getWorkers();
    return workers.find((w) => w.id === workerId || w.worker_id === workerId) || null;
  }

  async updateWorkerAvailability(workerId: string, status: AvailabilityStatus): Promise<boolean> {
    const workers = await this.getWorkers();
    const updated = workers.map((w) => (w.id === workerId ? { ...w, availability_status: status } : w));
    setStored(STORAGE_KEYS.WORKERS, updated);
    return true;
  }

  async updateWorkerProfile(workerId: string, updates: Partial<WorkerProfile>): Promise<WorkerProfile | null> {
    const workers = await this.getWorkers();
    let updatedWorker: WorkerProfile | null = null;
    const updated = workers.map((w) => {
      if (w.id === workerId) {
        updatedWorker = { ...w, ...updates, updated_at: new Date().toISOString() };
        return updatedWorker;
      }
      return w;
    });
    setStored(STORAGE_KEYS.WORKERS, updated);
    return updatedWorker;
  }

  async updateWorkerVerification(workerId: string, status: VerificationStatus): Promise<boolean> {
    const workers = await this.getWorkers();
    const updated = workers.map((w) =>
      w.id === workerId ? { ...w, verification_status: status, updated_at: new Date().toISOString() } : w
    );
    setStored(STORAGE_KEYS.WORKERS, updated);
    return true;
  }

  // BOOKINGS
  async getBookings(userId?: string, role?: 'customer' | 'worker' | 'admin'): Promise<Booking[]> {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
    if (!userId || role === 'admin') {
      return bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (role === 'customer') {
      return bookings
        .filter((b) => b.customer_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (role === 'worker') {
      return bookings
        .filter((b) => b.worker_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return bookings;
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const bookings = await this.getBookings();
    return bookings.find((b) => b.id === bookingId) || null;
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'created_at'>): Promise<Booking> {
    const bookings = await this.getBookings();
    const newId = generateId('book');

    const initialOffer: PriceOffer = {
      id: generateId('off'),
      booking_id: newId,
      offered_by: bookingData.customer_id,
      offered_by_role: 'customer',
      offered_by_name: bookingData.customer_name || 'Customer',
      amount: bookingData.proposed_price,
      message: 'Initial booking proposed price',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      status: 'pending',
      offers: [initialOffer],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    setStored(STORAGE_KEYS.BOOKINGS, bookings);
    return newBooking;
  }

  // NEGOTIATION / COUNTEROFFERS
  async submitPriceOffer(
    bookingId: string,
    offerData: {
      offered_by: string;
      offered_by_role: 'customer' | 'worker';
      offered_by_name: string;
      amount: number;
      message: string;
    }
  ): Promise<{ success: boolean; error?: string; booking?: Booking }> {
    const validation = validatePriceOffer(offerData.amount);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const bookings = await this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      return { success: false, error: 'Booking not found.' };
    }

    const booking = bookings[index];

    // Mark previous pending offers as rejected/superseded
    const updatedOffers = (booking.offers || []).map((o) =>
      o.status === 'pending' ? { ...o, status: 'rejected' as const } : o
    );

    const newOffer: PriceOffer = {
      id: generateId('off'),
      booking_id: bookingId,
      offered_by: offerData.offered_by,
      offered_by_role: offerData.offered_by_role,
      offered_by_name: offerData.offered_by_name,
      amount: offerData.amount,
      message: offerData.message || 'Counteroffer',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    updatedOffers.push(newOffer);

    booking.offers = updatedOffers;
    booking.status = 'negotiating';
    booking.proposed_price = offerData.amount;
    booking.updated_at = new Date().toISOString();

    bookings[index] = booking;
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking };
  }

  async acceptOffer(
    bookingId: string,
    offerId: string,
    acceptedByRole: 'customer' | 'worker'
  ): Promise<{ success: boolean; error?: string; booking?: Booking }> {
    const bookings = await this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      return { success: false, error: 'Booking not found.' };
    }

    const booking = bookings[index];
    const targetOffer = booking.offers?.find((o) => o.id === offerId);
    if (!targetOffer) {
      return { success: false, error: 'Offer not found.' };
    }

    // Role cannot accept their own offer
    if (targetOffer.offered_by_role === acceptedByRole) {
      return { success: false, error: 'You cannot accept your own counteroffer.' };
    }

    booking.offers = (booking.offers || []).map((o) =>
      o.id === offerId ? { ...o, status: 'accepted' as const } : o.status === 'pending' ? { ...o, status: 'rejected' as const } : o
    );

    booking.status = 'accepted';
    booking.agreed_price = targetOffer.amount;
    booking.updated_at = new Date().toISOString();

    bookings[index] = booking;
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking };
  }

  // BOOKING STATUS UPDATES
  async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    role: 'customer' | 'worker' | 'admin'
  ): Promise<{ success: boolean; error?: string; booking?: Booking }> {
    const bookings = await this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      return { success: false, error: 'Booking not found.' };
    }

    const booking = bookings[index];
    const transitionCheck = canTransitionBooking(booking.status, newStatus, role);
    if (!transitionCheck.allowed) {
      return { success: false, error: transitionCheck.reason };
    }

    booking.status = newStatus;
    booking.updated_at = new Date().toISOString();

    if (newStatus === 'completed') {
      booking.completed_at = new Date().toISOString();
      // Increment completed jobs count for worker
      const workers = await this.getWorkers();
      const wIdx = workers.findIndex((w) => w.id === booking.worker_id);
      if (wIdx !== -1) {
        workers[wIdx].completed_jobs_count = (workers[wIdx].completed_jobs_count || 0) + 1;
        setStored(STORAGE_KEYS.WORKERS, workers);
      }
    }

    bookings[index] = booking;
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking };
  }

  // REVIEWS
  async getReviewsForWorker(workerId: string): Promise<Review[]> {
    const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
    return reviews.filter((r) => r.worker_id === workerId);
  }

  async submitReview(review: Omit<Review, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string; review?: Review }> {
    const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);

    // Prevent duplicate reviews for the same booking
    if (reviews.some((r) => r.booking_id === review.booking_id)) {
      return { success: false, error: 'A review has already been submitted for this booking.' };
    }

    if (review.rating < 1 || review.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }

    const newReview: Review = {
      ...review,
      id: generateId('rev'),
      created_at: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    setStored(STORAGE_KEYS.REVIEWS, reviews);

    // Recalculate worker average rating
    const workerReviews = reviews.filter((r) => r.worker_id === review.worker_id);
    const avg = workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length;

    const workers = await this.getWorkers();
    const wIdx = workers.findIndex((w) => w.id === review.worker_id);
    if (wIdx !== -1) {
      workers[wIdx].rating = Math.round(avg * 10) / 10;
      workers[wIdx].review_count = workerReviews.length;
      setStored(STORAGE_KEYS.WORKERS, workers);
    }

    return { success: true, review: newReview };
  }

  // ISSUE REPORTS
  async getIssues(): Promise<IssueReport[]> {
    return getStored<IssueReport[]>(STORAGE_KEYS.ISSUES, DEMO_ISSUES);
  }

  async reportIssue(issue: Omit<IssueReport, 'id' | 'status' | 'created_at'>): Promise<IssueReport> {
    const issues = await this.getIssues();
    const newIssue: IssueReport = {
      ...issue,
      id: generateId('iss'),
      status: 'open',
      created_at: new Date().toISOString(),
    };
    issues.unshift(newIssue);
    setStored(STORAGE_KEYS.ISSUES, issues);

    // Flag booking as disputed
    const bookings = await this.getBookings();
    const bIdx = bookings.findIndex((b) => b.id === issue.booking_id);
    if (bIdx !== -1) {
      bookings[bIdx].status = 'disputed';
      setStored(STORAGE_KEYS.BOOKINGS, bookings);
    }

    return newIssue;
  }

  async updateIssueStatus(issueId: string, status: 'open' | 'under_review' | 'resolved' | 'dismissed'): Promise<boolean> {
    const issues = await this.getIssues();
    const updated = issues.map((i) => (i.id === issueId ? { ...i, status } : i));
    setStored(STORAGE_KEYS.ISSUES, updated);
    return true;
  }

  // ADMIN METRICS
  async getAdminMetrics() {
    const workers = await this.getWorkers();
    const bookings = await this.getBookings();
    const issues = await this.getIssues();

    const totalRevenueBookings = bookings
      .filter((b) => b.status === 'completed' && b.agreed_price)
      .reduce((sum, b) => sum + (b.agreed_price || 0), 0);

    return {
      totalCustomers: 24, // demo baseline
      totalWorkers: workers.length,
      verifiedWorkers: workers.filter((w) => w.verification_status === 'verified').length,
      pendingVerifications: workers.filter((w) => w.verification_status === 'pending').length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter((b) => ['pending', 'negotiating', 'accepted', 'in_progress'].includes(b.status)).length,
      completedBookings: bookings.filter((b) => b.status === 'completed').length,
      disputedBookings: bookings.filter((b) => b.status === 'disputed').length,
      totalIssues: issues.length,
      openIssues: issues.filter((i) => ['open', 'under_review'].includes(i.status)).length,
      grossBookingValue: totalRevenueBookings,
    };
  }
}

export const mockStore = new MockDataStore();
