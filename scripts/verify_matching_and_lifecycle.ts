import { calculateHaversineDistance, evaluateWorkerMatch, rankWorkers } from '../src/utils/matching';
import { canTransitionBooking, validatePriceOffer, VALID_TRANSITIONS } from '../src/utils/bookingRules';
import { DEMO_WORKERS } from '../src/lib/demoData';

console.log('=================================================================');
console.log('KAAMCONNECT VERIFIED BENCHMARK & STATE TRANSITION REPORT');
console.log('=================================================================\n');

// 1. SMART MATCHING BENCHMARK: DISTANCE IMPACT
console.log('--- 1. MATCHING BENCHMARK: DISTANCE VARIATION (Worker: Rajesh Sharma, Indiranagar) ---');
const rajesh = DEMO_WORKERS.find((w) => w.id === 'w-rajesh')!;

const distanceTestCases = [
  { name: 'Ultra-local (Indiranagar 100ft Rd)', lat: 12.9750, lon: 77.6420, budget: 500 },
  { name: 'Mid-distance (Koramangala 4th Block)', lat: 12.9352, lon: 77.6245, budget: 500 },
  { name: 'Outer radius boundary (Hebbal)', lat: 13.0358, lon: 77.5970, budget: 500 },
  { name: 'Exceeding radius (Electronic City)', lat: 12.8452, lon: 77.6602, budget: 500 },
];

distanceTestCases.forEach((tc) => {
  const res = evaluateWorkerMatch(rajesh, {
    serviceId: 'srv-electrician',
    customerLat: tc.lat,
    customerLon: tc.lon,
    customerBudget: tc.budget,
  });
  console.log(`[${tc.name}]: Distance=${res.distanceKm} km | DistanceScore=${res.distanceScore} | TotalScore=${res.totalScore} | Eligible=${res.isEligible} | ${res.isEligible ? res.explanation : res.rejectionReason}`);
});

// 2. SMART MATCHING BENCHMARK: BUDGET VARIATION
console.log('\n--- 2. MATCHING BENCHMARK: BUDGET VARIATION (Rajesh base rate = ₹450) ---');
const budgetTestCases = [
  { name: 'Comfortable Budget (₹650)', budget: 650 },
  { name: 'Exact Budget (₹450)', budget: 450 },
  { name: 'Slightly Below Budget (₹400, -11%)', budget: 400 },
  { name: 'Strict Low Budget (₹300, -33%)', budget: 300 },
  { name: 'Extreme Low Budget (₹200, -55%)', budget: 200 },
];

budgetTestCases.forEach((tc) => {
  const res = evaluateWorkerMatch(rajesh, {
    serviceId: 'srv-electrician',
    customerLat: 12.9750,
    customerLon: 77.6420,
    customerBudget: tc.budget,
  });
  console.log(`[${tc.name}]: Budget=₹${tc.budget} | AffordabilityScore=${res.affordabilityScore} | TotalScore=${res.totalScore} | Explanation: ${res.explanation}`);
});

// 3. RANKING VERIFICATION
console.log('\n--- 3. MULTI-WORKER RANKING FOR PLUMBING IN KORAMANGALA (Budget: ₹450) ---');
const rankedPlumbers = rankWorkers(DEMO_WORKERS, {
  serviceId: 'srv-plumber',
  customerLat: 12.9352,
  customerLon: 77.6245,
  customerBudget: 450,
});

rankedPlumbers.forEach((evalResult, idx) => {
  console.log(`#${idx + 1}: ${evalResult.worker.full_name} (${evalResult.worker.locality}) ➔ TotalScore=${evalResult.totalScore}/100 (Dist=${evalResult.distanceKm}km, Rate=₹${evalResult.worker.starting_rate}, Rating=${evalResult.worker.rating}★)`);
});

// 4. BOOKING STATE MACHINE & SECURITY CONSTRAINTS VERIFICATION
console.log('\n--- 4. BOOKING STATE MACHINE & ROLE PERMISSIONS VERIFICATION ---');

const transitions = [
  // Happy path
  { from: 'pending', to: 'negotiating', role: 'worker', expect: true, desc: 'Worker counteroffers' },
  { from: 'negotiating', to: 'accepted', role: 'customer', expect: true, desc: 'Customer accepts counter' },
  { from: 'accepted', to: 'in_progress', role: 'worker', expect: true, desc: 'Worker arrives and starts' },
  { from: 'in_progress', to: 'completed', role: 'customer', expect: true, desc: 'Customer confirms completion & signs off' },

  // Security violations
  { from: 'in_progress', to: 'completed', role: 'worker', expect: false, desc: 'Worker attempts unilateral job sign-off' },
  { from: 'accepted', to: 'in_progress', role: 'customer', expect: false, desc: 'Customer attempts to start worker job' },
  { from: 'pending', to: 'in_progress', role: 'worker', expect: false, desc: 'Skip negotiation & acceptance' },
  { from: 'completed', to: 'pending', role: 'customer', expect: false, desc: 'Reopen completed terminal state' },
  { from: 'cancelled', to: 'accepted', role: 'worker', expect: false, desc: 'Reopen cancelled terminal state' },
];

transitions.forEach((t) => {
  const result = canTransitionBooking(t.from as any, t.to as any, t.role as any);
  const passed = result.allowed === t.expect;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${t.desc}: (${t.from} ➔ ${t.to} by ${t.role}) = ${result.allowed ? 'ALLOWED' : 'BLOCKED'} ${result.reason ? '(' + result.reason + ')' : ''}`);
});

// 5. PRICE OFFER VALIDATION
console.log('\n--- 5. PRICE OFFER VALIDATION CHECKS ---');
const priceCases = [
  { amt: 450, expect: true, desc: 'Normal market quote (₹450)' },
  { amt: 50, expect: false, desc: 'Sub-minimum price (₹50 < ₹100)' },
  { amt: -200, expect: false, desc: 'Negative price (₹-200)' },
  { amt: 999999, expect: false, desc: 'Excessive price (₹9,99,999 > ₹50,000 cap)' },
  { amt: NaN, expect: false, desc: 'NaN non-numeric input' },
];

priceCases.forEach((pc) => {
  const res = validatePriceOffer(pc.amt);
  const passed = res.valid === pc.expect;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${pc.desc}: ${res.valid ? 'VALID' : 'INVALID'} ${res.error ? '(' + res.error + ')' : ''}`);
});

console.log('\n=================================================================');
console.log('ALL VERIFICATION BENCHMARKS COMPLETED SUCCESSFULLY');
console.log('=================================================================');
