import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  evaluateWorkerMatch,
  rankWorkers,
  DEFAULT_MATCHING_WEIGHTS,
} from '../matching';
import { WorkerProfile } from '../../types';

const mockWorker: WorkerProfile = {
  id: 'worker-1',
  worker_id: 'worker-1',
  full_name: 'Rajesh Sharma',
  phone: '+91 98765 43210',
  role: 'worker',
  locality: 'Indiranagar',
  city: 'Bengaluru',
  bio: 'Certified licensed master electrician with 10+ years experience.',
  experience_years: 10,
  starting_rate: 450,
  service_radius_km: 12,
  latitude: 12.9784,
  longitude: 77.6408,
  availability_status: 'available',
  verification_status: 'verified',
  skills: [
    {
      id: 'srv-electrician',
      name: 'Electrician',
      category: 'Electrical',
      description: 'Wiring, switches, MCB repair',
      icon_name: 'Zap',
      base_price_estimate: 400,
    },
  ],
  rating: 4.9,
  review_count: 38,
  completed_jobs_count: 142,
  created_at: '2024-01-01T00:00:00Z',
};

const mockWorkerFarAway: WorkerProfile = {
  ...mockWorker,
  id: 'worker-2',
  worker_id: 'worker-2',
  full_name: 'Suresh Kumar',
  locality: 'Electronic City',
  latitude: 12.8452,
  longitude: 77.6602,
  starting_rate: 600,
  service_radius_km: 5, // smaller radius
  rating: 4.2,
  review_count: 5,
};

describe('Hyperlocal Distance (Haversine Formula)', () => {
  it('correctly calculates distance between two nearby coordinates', () => {
    // Indiranagar (12.9784, 77.6408) to Koramangala (12.9352, 77.6245) is ~5.1 km
    const distance = calculateHaversineDistance(12.9784, 77.6408, 12.9352, 77.6245);
    expect(distance).toBeGreaterThan(4.5);
    expect(distance).toBeLessThan(6.0);
  });

  it('returns 0 km for identical coordinates', () => {
    const distance = calculateHaversineDistance(12.9784, 77.6408, 12.9784, 77.6408);
    expect(distance).toBe(0);
  });

  it('safely handles missing or NaN coordinates with fallback', () => {
    const distance = calculateHaversineDistance(NaN, 77.6408, 12.9784, 77.6408);
    expect(distance).toBe(999.0);
  });
});

describe('Smart Hyperlocal Matching Engine', () => {
  it('assigns high match score to close, available worker within budget', () => {
    const match = evaluateWorkerMatch(mockWorker, {
      serviceId: 'srv-electrician',
      customerLat: 12.9750, // very close to Indiranagar
      customerLon: 77.6420,
      customerBudget: 500, // starting rate is 450
    });

    expect(match.isEligible).toBe(true);
    expect(match.totalScore).toBeGreaterThanOrEqual(90);
    expect(match.explanation).toContain('Available now');
    expect(match.explanation).toContain('Within your ₹500 budget');
  });

  it('disqualifies workers who do not have the requested skill', () => {
    const match = evaluateWorkerMatch(mockWorker, {
      serviceId: 'srv-plumber', // worker is electrician
    });

    expect(match.isEligible).toBe(false);
    expect(match.totalScore).toBe(0);
    expect(match.rejectionReason).toBe('Service mismatch');
  });

  it('disqualifies worker outside their supported service radius', () => {
    // Customer in Yelahanka (13.1007, 77.5963), far from Electronic City (radius 5km)
    const match = evaluateWorkerMatch(mockWorkerFarAway, {
      serviceId: 'srv-electrician',
      customerLat: 13.1007,
      customerLon: 77.5963,
      customerBudget: 500,
    });

    expect(match.isEligible).toBe(false);
    expect(match.rejectionReason).toBe('Outside service radius');
  });

  it('ranks closer and higher-rated workers first', () => {
    const results = rankWorkers([mockWorkerFarAway, mockWorker], {
      serviceId: 'srv-electrician',
      customerLat: 12.9750,
      customerLon: 77.6420,
      customerBudget: 500,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].worker.id).toBe(mockWorker.id);
  });
});
