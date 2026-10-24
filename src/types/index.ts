export type UserRole = 'customer' | 'worker' | 'admin';

export type AvailabilityStatus = 'available' | 'busy' | 'offline';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type BookingStatus =
  | 'pending'
  | 'negotiating'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type IssueStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  phone: string;
  role: UserRole;
  locality: string;
  city: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  icon_name: string;
  base_price_estimate: number;
  popular_tasks?: string[];
  created_at?: string;
}

export interface WorkerProfile extends Profile {
  worker_id: string; // references profile.id
  bio: string;
  experience_years: number;
  starting_rate: number;
  service_radius_km: number;
  latitude: number;
  longitude: number;
  availability_status: AvailabilityStatus;
  verification_status: VerificationStatus;
  skills: Service[];
  rating: number;
  review_count: number;
  completed_jobs_count: number;
}

export interface WorkerSkill {
  id: string;
  worker_id: string;
  service_id: string;
  skill_level: 'beginner' | 'intermediate' | 'expert';
}

export interface PriceOffer {
  id: string;
  booking_id: string;
  offered_by: string; // user id
  offered_by_role: UserRole;
  offered_by_name: string;
  amount: number;
  message: string;
  status: OfferStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  worker_id: string;
  worker_name?: string;
  worker_phone?: string;
  worker_starting_rate?: number;
  worker_avatar?: string;
  service_id: string;
  service_name?: string;
  job_description: string;
  service_address: string;
  locality: string;
  latitude?: number;
  longitude?: number;
  scheduled_at: string;
  customer_budget: number;
  proposed_price: number;
  agreed_price?: number;
  status: BookingStatus;
  offers?: PriceOffer[];
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name?: string;
  worker_id: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface IssueReport {
  id: string;
  booking_id: string;
  reported_by: string;
  reporter_name?: string;
  issue_type: string;
  description: string;
  status: IssueStatus;
  created_at: string;
}

export interface MatchingWeights {
  distanceWeight: number; // default 0.35
  availabilityWeight: number; // default 0.25
  ratingWeight: number; // default 0.20
  affordabilityWeight: number; // default 0.20
}

export interface MatchEvaluation {
  worker: WorkerProfile;
  distanceKm: number;
  distanceScore: number;
  availabilityScore: number;
  ratingScore: number;
  affordabilityScore: number;
  totalScore: number;
  explanation: string;
  isEligible: boolean;
  rejectionReason?: string;
}
