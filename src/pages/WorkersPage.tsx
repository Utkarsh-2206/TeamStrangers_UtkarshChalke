import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Filter,
  SlidersHorizontal,
  BadgeCheck,
  Zap,
  ArrowUpDown,
  Navigation,
  Info,
  Calendar,
  CheckCircle,
  AlertCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DEMO_SERVICES } from '../lib/demoData';
import { mockStore } from '../lib/mockStore';
import { WorkerProfile, MatchEvaluation } from '../types';
import { rankWorkers, evaluateWorkerMatch } from '../utils/matching';
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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Mobile Segmented Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Deterministic Scoring Engine</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• 0.35 Dist + 0.25 Avail + 0.20 Rate + 0.20 Afford</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Hyperlocal Worker Discovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing scored & verified pros around <strong className="text-slate-800">{selectedLocality}</strong> (within {maxDistance} km)
            </p>
          </div>

          {/* Mobile Tab Control & Filter Toggle */}
          <div className="flex items-center gap-2">
            <div className="sm:hidden flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mobileTab === 'list' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                List ({rankedEvaluations.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mobileTab === 'map' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Map View
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              {showFilters ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        {showFilters && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Service selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Service Category</label>
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
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-teal-500"
                >
                  <option value="">All 10 Trade Services</option>
                  {DEMO_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (from ₹{s.base_price_estimate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Locality selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Locality / Area</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => {
                    setSelectedLocality(e.target.value);
                    setSearchParams((prev) => {
                      prev.set('locality', e.target.value);
                      return prev;
                    });
                  }}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-teal-500"
                >
                  {Object.keys(LOCALITY_COORDINATES).map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}, Bengaluru
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Max Budget Target</label>
                  <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
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
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Max Distance Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Search Radius</label>
                  <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
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
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Available Now Only</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Govt. ID Verified Only</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">
                  Found <strong className="text-slate-900">{rankedEvaluations.length}</strong> eligible workers
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Split View: Map + Cards */}
        <div className="space-y-6">
          {/* Map display: Always visible on desktop, or when mobileTab === 'map' on mobile */}
          <div className={`${mobileTab === 'map' ? 'block' : 'hidden sm:block'}`}>
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

          {/* Cards List: Visible when mobileTab === 'list' or on desktop */}
          <div className={`${mobileTab === 'list' ? 'block' : 'hidden sm:block'}`}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
              </div>
            ) : rankedEvaluations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No Professionals Match Current Criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try increasing your budget target above ₹{maxBudget} or widening the search radius beyond {maxDistance} km.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rankedEvaluations.map((item) => {
                  const { worker, totalScore, distanceKm, explanation, distanceScore, availabilityScore, ratingScore, affordabilityScore } = item;
                  const isSelected = worker.id === selectedWorkerId;
                  const isScoreExpanded = expandedScoreWorkerId === worker.id;

                  return (
                    <div
                      key={worker.id}
                      id={`worker-${worker.id}`}
                      className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-500 ring-3 ring-teal-500/20 shadow-md'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Top Header & Match Score */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={worker.avatar_url}
                                alt={worker.full_name}
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/20 shadow-xs"
                              />
                              <span
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  worker.availability_status === 'available'
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                                title={worker.availability_status}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-base text-slate-900">{worker.full_name}</h3>
                                {worker.verification_status === 'verified' && (
                                  <BadgeCheck className="w-4 h-4 text-teal-600" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{worker.locality}</span>
                                <span className="font-semibold text-teal-700">({distanceKm} km away)</span>
                              </p>
                            </div>
                          </div>

                          {/* Explainable Match Badge with toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedScoreWorkerId(isScoreExpanded ? null : worker.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
                            title="Click to see score breakdown"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{totalScore}% Match</span>
                            <Info className="w-3 h-3 text-teal-600 ml-0.5" />
                          </button>
                        </div>

                        {/* Explainable Factor Breakdown (Visible on toggle or hover) */}
                        {isScoreExpanded && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-[11px] space-y-2 animate-fadeIn">
                            <div className="font-bold text-teal-900 flex justify-between">
                              <span>Smart Match Score Breakdown</span>
                              <span>Total: {totalScore}/100</span>
                            </div>
                            <div className="space-y-1.5 text-slate-600">
                              <div className="flex justify-between items-center">
                                <span>Distance Factor (35% wt):</span>
                                <strong className="text-slate-800">{distanceScore}/100 ({distanceKm} km)</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Availability Factor (25% wt):</span>
                                <strong className="text-slate-800">{availabilityScore}/100 ({worker.availability_status})</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Rating Factor (20% wt):</span>
                                <strong className="text-slate-800">{ratingScore}/100 ({worker.rating || 'New'})</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Affordability Factor (20% wt):</span>
                                <strong className="text-slate-800">{affordabilityScore}/100 (₹{worker.starting_rate} vs ₹{maxBudget})</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Explainability Callout Tag */}
                        <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] font-medium text-slate-600 leading-tight">
                            {explanation}
                          </span>
                        </div>

                        {/* Skills chips */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {worker.skills.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded-md bg-teal-50/70 text-teal-800 text-[11px] font-semibold"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                          {worker.bio}
                        </p>

                        {/* Metrics bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-slate-50">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Rate Quote</div>
                            <div className="text-sm font-extrabold text-slate-900">₹{worker.starting_rate}</div>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Experience</div>
                            <div className="text-sm font-extrabold text-slate-900">{worker.experience_years} Years</div>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Rating</div>
                            <div className="text-sm font-extrabold text-amber-600 flex items-center justify-center gap-1">
                              <span>★</span>
                              <span>{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 flex items-center gap-2">
                        <Link
                          to={`/worker-profile/${worker.id}`}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          Profile & Reviews
                        </Link>
                        <Link
                          to={`/book/${worker.id}?service=${worker.skills[0]?.id || ''}`}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          Book & Propose Price
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
