import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  SlidersHorizontal,
  BadgeCheck,
  Navigation,
  Info,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DEMO_SERVICES } from '../lib/demoData';
import { mockStore } from '../lib/mockStore';
import { WorkerProfile, MatchEvaluation } from '../types';
import { rankWorkers } from '../utils/matching';
import { LeafletMap } from '../components/common/LeafletMap';
import { StarRating } from '../components/common/StarRating';
import { StatusBadge } from '../components/common/StatusBadge';
import { WorkerCardSkeleton } from '../components/common/Skeleton';

// Coordinates for standard Bengaluru localities
const LOCALITY_COORDINATES: Record<string, [number, number]> = {
  Indiranagar: [12.9784, 77.6408],
  Koramangala: [12.9352, 77.6245],
  'HSR Layout': [12.9121, 77.6446],
  'JP Nagar': [12.9063, 77.5857],
  Whitefield: [12.9698, 77.7499],
  Jayanagar: [12.9308, 77.5838],
  Bellandur: [12.9260, 77.6762],
  Marathahalli: [12.9591, 77.6974],
  Malleshwaram: [13.0031, 77.5643],
  'BTM Layout': [12.9166, 77.6101],
};

export const WorkersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  const initialLocality = searchParams.get('locality') || 'Indiranagar';

  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [selectedService, setSelectedService] = useState<string>(initialService);
  const [selectedLocality, setSelectedLocality] = useState<string>(initialLocality);
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [maxBudget, setMaxBudget] = useState<number>(750);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [expandedScoreWorkerId, setExpandedScoreWorkerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch workers
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await mockStore.getWorkers();
        setWorkers(data);
      } catch (err) {
        console.error('Failed to load workers:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync params to state
  useEffect(() => {
    const s = searchParams.get('service');
    if (s) setSelectedService(s);
    const loc = searchParams.get('locality');
    if (loc) setSelectedLocality(loc);
  }, [searchParams]);

  // Customer reference coordinates based on selected locality
  const customerCoords = useMemo(() => {
    return LOCALITY_COORDINATES[selectedLocality] || LOCALITY_COORDINATES['Indiranagar'];
  }, [selectedLocality]);

  // Run Smart Hyperlocal Matching Engine
  const rankedEvaluations: MatchEvaluation[] = useMemo(() => {
    if (!workers.length) return [];

    let filtered = [...workers];

    if (onlyAvailable) {
      filtered = filtered.filter((w) => w.availability_status === 'available');
    }

    if (onlyVerified) {
      filtered = filtered.filter((w) => w.verification_status === 'verified');
    }

    return rankWorkers(filtered, {
      serviceId: selectedService || undefined,
      customerLat: customerCoords[0],
      customerLon: customerCoords[1],
      customerBudget: maxBudget,
      maxRadiusKm: maxDistance,
    });
  }, [workers, selectedService, customerCoords, maxBudget, maxDistance, onlyAvailable, onlyVerified]);

  const handleResetFilters = () => {
    setMaxDistance(25);
    setMaxBudget(1200);
    setSelectedService('');
    setSelectedLocality('Indiranagar');
    setOnlyAvailable(false);
    setOnlyVerified(false);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header & Apple Style Segmented Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#6366f1] dark:text-[#818cf8]" />
              <span>Deterministic Hyperlocal Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Specialist Directory
            </h1>
            <p className="text-[15px] sm:text-[17px] text-[#86868b] dark:text-[#98989d] mt-2 leading-relaxed">
              Verified independent tradespeople around <span className="font-semibold text-[#1d1d1f] dark:text-white">{selectedLocality}</span> (within {maxDistance} km)
            </p>
          </div>

          {/* Mobile Tab Control & Filter Toggle */}
          <div className="flex items-center gap-3">
            <div className="sm:hidden flex bg-black/[0.04] dark:bg-white/[0.08] p-1.5 rounded-full border border-black/[0.05] dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                  mobileTab === 'list' ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs' : 'text-[#86868b] dark:text-[#98989d]'
                }`}
              >
                List ({rankedEvaluations.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('map')}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                  mobileTab === 'map' ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs' : 'text-[#86868b] dark:text-[#98989d]'
                }`}
              >
                Map View
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-[#1d1d1f] dark:text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              {showFilters ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
            </button>
          </div>
        </div>

        {/* Apple Style Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-[#1c1c1e] p-7 rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Service selector */}
              <div>
                <label className="text-[13px] sm:text-[14px] font-semibold text-[#86868b] dark:text-[#98989d] mb-2 block">Service Category</label>
                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    setSearchParams((prev) => {
                      if (e.target.value) prev.set('service', e.target.value);
                      else prev.delete('service');
                      return prev;
                    });
                  }}
                  className="w-full text-[15px] font-medium bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-2xl p-3 text-[#1d1d1f] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="" className="dark:bg-[#1c1c1e]">All 10 Trade Services</option>
                  {DEMO_SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className="dark:bg-[#1c1c1e]">
                      {s.name} (from ₹{s.base_price_estimate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Locality selector */}
              <div>
                <label className="text-[13px] sm:text-[14px] font-semibold text-[#86868b] dark:text-[#98989d] mb-2 block">Your Locality</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => {
                    setSelectedLocality(e.target.value);
                    setSearchParams((prev) => {
                      prev.set('locality', e.target.value);
                      return prev;
                    });
                  }}
                  className="w-full text-[15px] font-medium bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-2xl p-3 text-[#1d1d1f] dark:text-white focus:outline-none cursor-pointer"
                >
                  {Object.keys(LOCALITY_COORDINATES).map((loc) => (
                    <option key={loc} value={loc} className="dark:bg-[#1c1c1e]">
                      {loc}, Bengaluru
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[13px] sm:text-[14px] font-semibold text-[#86868b] dark:text-[#98989d]">Target Budget</label>
                  <span className="text-[13px] font-bold text-[#1d1d1f] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] px-3 py-1 rounded-full">
                    ₹{maxBudget}
                  </span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="1500"
                  step="50"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#0071e3] dark:accent-[#0a84ff] cursor-pointer mt-1"
                />
              </div>

              {/* Max Distance Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[13px] sm:text-[14px] font-semibold text-[#86868b] dark:text-[#98989d]">Search Radius</label>
                  <span className="text-[13px] font-bold text-[#1d1d1f] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] px-3 py-1 rounded-full">
                    {maxDistance} km
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full accent-[#0071e3] dark:accent-[#0a84ff] cursor-pointer mt-1"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] text-[14px] sm:text-[15px]">
              <div className="flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2.5 cursor-pointer font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded accent-[#0071e3] dark:accent-[#0a84ff] h-4.5 w-4.5"
                  />
                  <span>Available Now Only</span>
                </label>

                <label className="inline-flex items-center gap-2.5 cursor-pointer font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="rounded accent-[#0071e3] dark:accent-[#0a84ff] h-4.5 w-4.5"
                  />
                  <span>Govt. ID Verified Only</span>
                </label>
              </div>

              <div className="flex items-center gap-5">
                <span className="text-[#86868b] dark:text-[#98989d]">
                  Showing <strong className="text-[#1d1d1f] dark:text-white font-bold">{rankedEvaluations.length}</strong> matching specialists
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[13px] font-semibold text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Split View: Map + Cards */}
        <div className="space-y-8">
          {/* Map display */}
          <div className={`${mobileTab === 'map' ? 'block' : 'hidden sm:block'} overflow-hidden rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs`}>
            <LeafletMap
              workers={rankedEvaluations.map((e) => e.worker)}
              selectedWorkerId={selectedWorkerId}
              onSelectWorker={(w) => setSelectedWorkerId(w.id)}
              userLocation={customerCoords}
              center={customerCoords}
              zoom={12}
              height="340px"
            />
          </div>

          {/* Cards List */}
          <div className={`${mobileTab === 'list' ? 'block' : 'hidden sm:block'}`}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
              </div>
            ) : rankedEvaluations.length === 0 ? (
              <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-16 text-center space-y-4 shadow-xs">
                <AlertCircle className="w-10 h-10 text-[#ff9500] mx-auto" />
                <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-white">No Specialists Match Current Filters</h3>
                <p className="text-[15px] text-[#86868b] dark:text-[#98989d] max-w-md mx-auto leading-relaxed">
                  Try increasing your budget target above ₹{maxBudget} or widening the search radius beyond {maxDistance} km.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-6 py-3 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[14px] font-semibold hover:bg-[#333336] dark:hover:bg-[#ebebee] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rankedEvaluations.map((item) => {
                  const { worker, totalScore, distanceKm, explanation, distanceScore, availabilityScore, ratingScore, affordabilityScore } = item;
                  const isSelected = worker.id === selectedWorkerId;
                  const isScoreExpanded = expandedScoreWorkerId === worker.id;

                  return (
                    <div
                      key={worker.id}
                      id={`worker-${worker.id}`}
                      className={`bg-white dark:bg-[#1c1c1e] rounded-[32px] border p-7 sm:p-8 shadow-xs apple-interactive-card flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0071e3] dark:border-[#0a84ff] ring-2 ring-[#0071e3]/20 dark:ring-[#0a84ff]/20 shadow-lg'
                          : 'border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.15]'
                      }`}
                    >
                      <div>
                        {/* Top Header & Match Score */}
                        <div className="flex items-start justify-between gap-3.5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={worker.avatar_url}
                                alt={worker.full_name}
                                className="w-16 h-16 rounded-full object-cover border border-black/[0.06] dark:border-white/[0.08]"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[19px] sm:text-[20px] text-[#1d1d1f] dark:text-white">{worker.full_name}</h3>
                                {worker.verification_status === 'verified' && (
                                  <BadgeCheck className="w-5 h-5 text-[#0071e3] dark:text-[#0a84ff]" />
                                )}
                              </div>
                              <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d] flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-4 h-4 text-[#86868b] dark:text-[#98989d]" />
                                <span>{worker.locality}</span>
                                <span className="font-semibold text-[#1d1d1f] dark:text-white">({distanceKm} km away)</span>
                              </p>
                            </div>
                          </div>

                          {/* Explainable Match Badge with toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedScoreWorkerId(isScoreExpanded ? null : worker.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-white text-[13px] font-semibold border border-black/[0.05] dark:border-white/[0.06] transition-colors apple-press-spring cursor-pointer"
                            title="Click to see score breakdown"
                          >
                            <Sparkles className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
                            <span>{totalScore}% Match</span>
                            <Info className="w-3.5 h-3.5 text-[#86868b] dark:text-[#98989d]" />
                          </button>
                        </div>

                        {/* Explainable Factor Breakdown */}
                        {isScoreExpanded && (
                          <div className="mt-4 p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] text-[14px] space-y-2.5 animate-apple-scale-in">
                            <div className="font-bold text-[#1d1d1f] dark:text-white flex justify-between">
                              <span>Hyperlocal Match Factors</span>
                              <span>Total Score: {totalScore}/100</span>
                            </div>
                            <div className="space-y-2 text-[#515154] dark:text-[#98989d]">
                              <div className="flex justify-between items-center">
                                <span>Distance Weight (35%):</span>
                                <strong className="text-[#1d1d1f] dark:text-white font-semibold">{distanceScore}/100 ({distanceKm} km)</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Availability Weight (25%):</span>
                                <strong className="text-[#1d1d1f] dark:text-white font-semibold">{availabilityScore}/100 ({worker.availability_status})</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Rating Weight (20%):</span>
                                <strong className="text-[#1d1d1f] dark:text-white font-semibold">{ratingScore}/100 ({worker.rating ? worker.rating.toFixed(1) : 'New'})</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Affordability Weight (20%):</span>
                                <strong className="text-[#1d1d1f] dark:text-white font-semibold">{affordabilityScore}/100 (₹{worker.starting_rate} vs ₹{maxBudget})</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Explainability Callout Tag */}
                        <div className="mt-4 px-4.5 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-3">
                          <Info className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff] shrink-0 mt-0.5" />
                          <span className="text-[14px] sm:text-[15px] text-[#515154] dark:text-[#98989d] leading-relaxed">
                            {explanation}
                          </span>
                        </div>

                        {/* Skills chips */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {worker.skills.map((s) => (
                            <span
                              key={s.id}
                              className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] text-[13px] font-semibold"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>

                        <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] mt-4 line-clamp-2 leading-relaxed">
                          {worker.bio}
                        </p>

                        {/* Metrics bar */}
                        <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426]">
                            <div className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d]">Rate Quote</div>
                            <div className="text-[19px] sm:text-[20px] font-bold text-[#1d1d1f] dark:text-white mt-0.5">₹{worker.starting_rate}</div>
                          </div>
                          <div className="p-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426]">
                            <div className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d]">Experience</div>
                            <div className="text-[19px] sm:text-[20px] font-bold text-[#1d1d1f] dark:text-white mt-0.5">{worker.experience_years} Years</div>
                          </div>
                          <div className="p-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426]">
                            <div className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d]">Rating</div>
                            <div className="text-[19px] sm:text-[20px] font-bold text-[#1d1d1f] dark:text-white flex items-center justify-center gap-1 mt-0.5">
                              <span className="text-[#ff9500] dark:text-[#ffd60a]">★</span>
                              <span>{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-7 pt-4 flex items-center gap-3">
                        <Link
                          to={`/worker-profile/${worker.id}`}
                          className="flex-1 text-center py-3.5 px-4 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[15px] font-semibold text-[#1d1d1f] dark:text-white transition-colors apple-press-spring"
                        >
                          Profile & Reviews
                        </Link>
                        <Link
                          to={`/book/${worker.id}?service=${worker.skills[0]?.id || ''}`}
                          className="flex-1 text-center py-3.5 px-4 rounded-full bg-[#1d1d1f] dark:bg-white hover:bg-[#333336] dark:hover:bg-[#ebebee] text-white dark:text-[#1d1d1f] text-[15px] font-semibold transition-colors shadow-xs apple-press-spring"
                        >
                          Book Specialist
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
