import { WorkerProfile, MatchEvaluation, MatchingWeights } from '../types';

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  distanceWeight: 0.35,
  availabilityWeight: 0.25,
  ratingWeight: 0.20,
  affordabilityWeight: 0.20,
};

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 * Handles edge cases safely.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 999.0; // Safe fallback distance
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export interface MatchingCriteria {
  serviceId?: string;
  customerLat?: number;
  customerLon?: number;
  customerBudget?: number;
  scheduledTime?: string; // ISO string
  weights?: MatchingWeights;
  maxRadiusKm?: number;
}

/**
 * Deterministic Hyperlocal Matching Algorithm
 * Calculates an explainable score (0-100) based on distance, availability, rating, and affordability.
 */
export function evaluateWorkerMatch(
  worker: WorkerProfile,
  criteria: MatchingCriteria
): MatchEvaluation {
  const weights = criteria.weights || DEFAULT_MATCHING_WEIGHTS;

  // 1. Eligibility Check
  if (criteria.serviceId) {
    const hasSkill = worker.skills.some(
      (s) => s.id === criteria.serviceId || s.name.toLowerCase() === criteria.serviceId?.toLowerCase()
    );
    if (!hasSkill) {
      return {
        worker,
        distanceKm: 0,
        distanceScore: 0,
        availabilityScore: 0,
        ratingScore: 0,
        affordabilityScore: 0,
        totalScore: 0,
        explanation: 'Worker does not provide the requested service.',
        isEligible: false,
        rejectionReason: 'Service mismatch',
      };
    }
  }

  // 2. Distance Calculation
  let distanceKm = 0;
  let distanceScore = 100;

  if (
    criteria.customerLat !== undefined &&
    criteria.customerLon !== undefined &&
    worker.latitude !== undefined &&
    worker.longitude !== undefined
  ) {
    distanceKm = calculateHaversineDistance(
      criteria.customerLat,
      criteria.customerLon,
      worker.latitude,
      worker.longitude
    );

    const effectiveRadius = Math.max(worker.service_radius_km || 10, criteria.maxRadiusKm || 15);

    if (distanceKm > effectiveRadius) {
      return {
        worker,
        distanceKm,
        distanceScore: 0,
        availabilityScore: 0,
        ratingScore: 0,
        affordabilityScore: 0,
        totalScore: 0,
        explanation: `Outside service radius (${distanceKm} km away, max service radius is ${worker.service_radius_km} km).`,
        isEligible: false,
        rejectionReason: 'Outside service radius',
      };
    }

    // Distance Score: 100 at 0km, decreasing linearly to 0 at effectiveRadius
    distanceScore = Math.max(0, Math.min(100, Math.round((1 - distanceKm / effectiveRadius) * 100)));
  } else {
    // Neutral fallback when coordinates are missing
    distanceKm = 2.5;
    distanceScore = 75;
  }

  // 3. Availability Score (0 - 100)
  let availabilityScore = 0;
  if (worker.availability_status === 'available') {
    availabilityScore = 100;
  } else if (worker.availability_status === 'busy') {
    availabilityScore = 40;
  } else {
    availabilityScore = 10; // Offline
  }

  // 4. Rating Score (0 - 100)
  let ratingScore = 75; // Neutral-positive baseline for new workers
  if (worker.review_count > 0 && worker.rating > 0) {
    ratingScore = Math.min(100, Math.round((worker.rating / 5.0) * 100));
  }

  // 5. Affordability Score (0 - 100)
  let affordabilityScore = 100;
  if (criteria.customerBudget && criteria.customerBudget > 0) {
    const rate = worker.starting_rate || 500;
    if (rate <= criteria.customerBudget) {
      affordabilityScore = 100;
    } else {
      const overPercentage = ((rate - criteria.customerBudget) / criteria.customerBudget) * 100;
      affordabilityScore = Math.max(0, Math.round(100 - overPercentage));
    }
  }

  // 6. Weighted Total Score
  const totalScore = Math.round(
    distanceScore * weights.distanceWeight +
      availabilityScore * weights.availabilityWeight +
      ratingScore * weights.ratingWeight +
      affordabilityScore * weights.affordabilityWeight
  );

  // 7. Human Explainability String
  const explanationParts: string[] = [];

  if (worker.availability_status === 'available') {
    explanationParts.push('Available now');
  } else if (worker.availability_status === 'busy') {
    explanationParts.push('Limited slots today');
  }

  if (distanceKm <= 3) {
    explanationParts.push(`Nearby (${distanceKm} km away)`);
  } else {
    explanationParts.push(`${distanceKm} km away`);
  }

  if (criteria.customerBudget && worker.starting_rate <= criteria.customerBudget) {
    explanationParts.push(`Within your ₹${criteria.customerBudget} budget`);
  } else if (criteria.customerBudget) {
    explanationParts.push(`₹${worker.starting_rate} starting rate`);
  }

  if (worker.review_count > 0) {
    explanationParts.push(`${worker.rating.toFixed(1)}★ (${worker.review_count} reviews)`);
  } else {
    explanationParts.push('New talent');
  }

  const explanation = explanationParts.join(' • ');

  return {
    worker,
    distanceKm,
    distanceScore,
    availabilityScore,
    ratingScore,
    affordabilityScore,
    totalScore,
    explanation,
    isEligible: true,
  };
}

/**
 * Filters and ranks workers according to criteria, returning sorted MatchEvaluations.
 */
export function rankWorkers(
  workers: WorkerProfile[],
  criteria: MatchingCriteria
): MatchEvaluation[] {
  const evaluations: MatchEvaluation[] = [];

  for (const worker of workers) {
    const evalResult = evaluateWorkerMatch(worker, criteria);
    if (evalResult.isEligible) {
      evaluations.push(evalResult);
    }
  }

  // Sort descending by total score
  return evaluations.sort((a, b) => b.totalScore - a.totalScore);
}
