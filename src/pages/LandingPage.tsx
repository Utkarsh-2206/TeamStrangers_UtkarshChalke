import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  Check,
  ArrowRight,
  BadgeCheck,
  Wrench,
  Hammer,
  Sparkles,
  Paintbrush,
  Cpu,
  Utensils,
  Home,
  Flower2,
  Truck,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { DEMO_SERVICES, DEMO_WORKERS } from '../lib/demoData';
import { StarRating } from '../components/common/StarRating';
import { StatusBadge } from '../components/common/StatusBadge';

// Unified tonal icons matching Apple SF Symbols aesthetics
const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-7 h-7" />,
  Wrench: <Wrench className="w-7 h-7" />,
  Hammer: <Hammer className="w-7 h-7" />,
  Sparkles: <Sparkles className="w-7 h-7" />,
  Paintbrush: <Paintbrush className="w-7 h-7" />,
  Cpu: <Cpu className="w-7 h-7" />,
  Utensils: <Utensils className="w-7 h-7" />,
  Home: <Home className="w-7 h-7" />,
  Flower2: <Flower2 className="w-7 h-7" />,
  Truck: <Truck className="w-7 h-7" />,
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string>('');
  const [locality, setLocality] = useState<string>('Indiranagar');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedService) queryParams.set('service', selectedService);
    if (locality) queryParams.set('locality', locality);
    navigate(`/workers?${queryParams.toString()}`);
  };

  const featuredWorkers = DEMO_WORKERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-250">
      {/* 1. HERO SECTION - Apple Editorial Scale */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Clerk Style Pill Tag */}
          <div className="animate-apple-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/[0.08] dark:bg-[#6366f1]/[0.15] border border-[#6366f1]/20 text-[#09090b] dark:text-[#f4f4f5] text-[14px] sm:text-[15px] font-semibold tracking-tight mb-8">
            <ShieldCheck className="w-4 h-4 text-[#6366f1] dark:text-[#818cf8]" />
            <span>Hyperlocal Network • Aadhaar-Verified • 0% Worker Commission</span>
          </div>

          {/* Hero Typography - Apple Keynote Large & Bold */}
          <h1 className="animate-apple-fade-up delay-stagger-1 text-5xl sm:text-7xl font-bold tracking-[-0.035em] text-[#1d1d1f] dark:text-white max-w-4xl mx-auto leading-[1.06]">
            Expert hands.
            <br />
            <span className="text-[#86868b] dark:text-[#98989d]">Right in your neighborhood.</span>
          </h1>

          <p className="animate-apple-fade-up delay-stagger-2 mt-7 text-xl sm:text-2xl text-[#515154] dark:text-[#98989d] leading-relaxed max-w-3xl mx-auto font-normal">
            Connect directly with certified independent electricians, plumbers, carpenters, and domestic specialists. Transparent quotes, verified identities, zero middleman commission.
          </p>

          {/* Apple Spotlight Search Capsule with Liquid Glass & Spring */}
          <form
            onSubmit={handleSearch}
            className="animate-apple-fade-up delay-stagger-3 mt-12 p-3 sm:p-3.5 rounded-3xl sm:rounded-full bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_16px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center gap-3 max-w-3xl mx-auto transition-all"
          >
            {/* Service selector */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 sm:border-r border-black/[0.08] dark:border-white/[0.08]">
              <Search className="w-5 h-5 text-[#86868b] dark:text-[#98989d] shrink-0" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-transparent text-[16px] sm:text-[17px] font-medium text-[#1d1d1f] dark:text-white focus:outline-none cursor-pointer"
                aria-label="Select Trade or Service"
              >
                <option value="" className="dark:bg-[#1c1c1e] dark:text-white">All Services (Electrician, Plumber...)</option>
                {DEMO_SERVICES.map((s) => (
                  <option key={s.id} value={s.id} className="dark:bg-[#1c1c1e] dark:text-white">
                    {s.name} (from ₹{s.base_price_estimate})
                  </option>
                ))}
              </select>
            </div>

            {/* Locality input */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
              <MapPin className="w-5 h-5 text-[#86868b] dark:text-[#98989d] shrink-0" />
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Locality (e.g. Indiranagar)"
                className="w-full bg-transparent text-[16px] sm:text-[17px] font-medium text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-[#636366] focus:outline-none"
                aria-label="Locality"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-[16px] tracking-tight transition-all apple-press-spring flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
            >
              <span>Find Specialists</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Apple Stats Ribbon - High-Contrast Large Numbers */}
          <div className="animate-apple-fade-up delay-stagger-4 mt-16 pt-10 border-t border-black/[0.08] dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                2,400<span className="text-[#0071e3] dark:text-[#0a84ff]">+</span>
              </div>
              <div className="text-[15px] sm:text-[16px] font-medium text-[#86868b] dark:text-[#98989d] mt-1">Verified Specialists</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                &lt; 25<span className="text-[20px] font-medium text-[#86868b] dark:text-[#98989d] ml-1">min</span>
              </div>
              <div className="text-[15px] sm:text-[16px] font-medium text-[#86868b] dark:text-[#98989d] mt-1">Avg. Arrival Time</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                4.9<span className="text-[26px] font-medium text-[#ff9500] dark:text-[#ffd60a] ml-1">★</span>
              </div>
              <div className="text-[15px] sm:text-[16px] font-medium text-[#86868b] dark:text-[#98989d] mt-1">Customer Rating</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                ₹0<span className="text-[22px] font-medium text-[#86868b] dark:text-[#98989d] ml-1">Fee</span>
              </div>
              <div className="text-[15px] sm:text-[16px] font-medium text-[#86868b] dark:text-[#98989d] mt-1">To Trade Workers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES CATALOG - Apple Continuous Squircle Cards with Micro-Bounces */}
      <section className="py-24 bg-white dark:bg-[#000000] border-y border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wider text-[#0071e3] dark:text-[#0a84ff]">
                Services Catalog
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-2">
                Every trade. Fair, upfront estimates.
              </h2>
            </div>
            <Link
              to="/services"
              className="text-[16px] font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline flex items-center gap-1.5 mt-4 sm:mt-0"
            >
              <span>View all 10 categories</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {DEMO_SERVICES.map((service) => (
              <Link
                key={service.id}
                to={`/workers?service=${service.id}`}
                className="group p-6 rounded-[28px] bg-[#f5f5f7] dark:bg-[#1c1c1e] hover:bg-white dark:hover:bg-[#2c2c2e] border border-transparent hover:border-black/[0.08] dark:hover:border-white/[0.12] apple-interactive-card flex flex-col justify-between min-h-[210px] cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#2c2c2e] shadow-xs border border-black/[0.04] dark:border-white/[0.08] flex items-center justify-center text-[#1d1d1f] dark:text-white group-hover:bg-[#1d1d1f] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-[#1d1d1f] transition-all duration-300">
                  <div className="apple-symbol-bounce">
                    {ICON_MAP[service.icon_name] || <Wrench className="w-7 h-7" />}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="font-bold text-[18px] sm:text-[19px] text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] dark:group-hover:text-[#0a84ff] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[15px] font-medium text-[#86868b] dark:text-[#98989d] mt-1.5">
                    From ₹{service.base_price_estimate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SPECIALISTS - Apple Wallet / Pass Style with Spring Physics */}
      <section className="py-24 bg-[#f5f5f7] dark:bg-[#0a0a0c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wider text-[#0071e3] dark:text-[#0a84ff]">
                Nearby & Verified
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-2">
                Featured local specialists
              </h2>
            </div>
            <Link
              to="/workers"
              className="text-[16px] font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline flex items-center gap-1.5 mt-4 sm:mt-0"
            >
              <span>Explore full map & roster</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 shadow-xs apple-interactive-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={worker.avatar_url}
                        alt={worker.full_name}
                        className="w-16 h-16 rounded-full object-cover border border-black/[0.06] dark:border-white/[0.08]"
                      />
                      <div>
                        <h3 className="font-bold text-[19px] sm:text-[20px] text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                          <span>{worker.full_name}</span>
                          <BadgeCheck className="w-5 h-5 text-[#0071e3] dark:text-[#0a84ff]" />
                        </h3>
                        <p className="text-[14px] sm:text-[15px] font-medium text-[#86868b] dark:text-[#98989d] flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4 text-[#86868b] dark:text-[#98989d]" />
                          <span>{worker.locality}, Bengaluru</span>
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={worker.verification_status} type="verification" />
                  </div>

                  <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] mt-5 line-clamp-2 leading-relaxed">
                    {worker.bio}
                  </p>

                  <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d]">Starting Quote</div>
                      <div className="text-[22px] sm:text-[24px] font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                        ₹{worker.starting_rate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d]">Rating</div>
                      <div className="mt-0.5">
                        <StarRating rating={worker.rating} showCount reviewCount={worker.review_count} size="md" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <Link
                    to={`/worker-profile/${worker.id}`}
                    className="flex-1 text-center py-3 px-4 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[15px] font-semibold text-[#1d1d1f] dark:text-white transition-colors apple-press-spring"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/book/${worker.id}`}
                    className="flex-1 text-center py-3 px-4 rounded-full bg-[#1d1d1f] dark:bg-white hover:bg-[#333336] dark:hover:bg-[#ebebee] text-white dark:text-[#1d1d1f] text-[15px] font-semibold transition-colors shadow-xs apple-press-spring"
                  >
                    Request Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS - Apple Three Pillar Feature Architecture */}
      <section className="py-24 bg-white dark:bg-[#000000] border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[14px] font-bold uppercase tracking-wider text-[#0071e3] dark:text-[#0a84ff]">
              Simple & Direct
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-2">
              How KaamConnect works
            </h2>
            <p className="text-[#86868b] dark:text-[#98989d] text-[17px] sm:text-[19px] mt-3">
              From transparent discovery to completion in three frictionless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[32px] bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.04] dark:border-white/[0.08] apple-interactive-card flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs flex items-center justify-center font-bold text-[18px] mb-6">
                  01
                </div>
                <h3 className="font-bold text-[#1d1d1f] dark:text-white text-[22px] sm:text-[24px] mb-3">
                  Hyperlocal Discovery
                </h3>
                <p className="text-[16px] sm:text-[17px] text-[#515154] dark:text-[#98989d] leading-relaxed">
                  Pinpoint your locality. Deterministic Haversine distance matching surfaces verified independent tradespeople located within a 5-15 km radius.
                </p>
              </div>
              <div className="mt-8 text-[15px] font-semibold text-[#0071e3] dark:text-[#0a84ff]">
                Average response under 25 mins →
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.04] dark:border-white/[0.08] apple-interactive-card flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs flex items-center justify-center font-bold text-[18px] mb-6">
                  02
                </div>
                <h3 className="font-bold text-[#1d1d1f] dark:text-white text-[22px] sm:text-[24px] mb-3">
                  Direct Two-Way Pricing
                </h3>
                <p className="text-[16px] sm:text-[17px] text-[#515154] dark:text-[#98989d] leading-relaxed">
                  Propose your fair scope and budget. Specialists can accept or propose a transparent counteroffer. Zero hidden surge fees or middleman cuts.
                </p>
              </div>
              <div className="mt-8 text-[15px] font-semibold text-[#0071e3] dark:text-[#0a84ff]">
                100% price certainty before work begins →
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.04] dark:border-white/[0.08] apple-interactive-card flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs flex items-center justify-center font-bold text-[18px] mb-6">
                  03
                </div>
                <h3 className="font-bold text-[#1d1d1f] dark:text-white text-[22px] sm:text-[24px] mb-3">
                  Sign-off & Escrow Release
                </h3>
                <p className="text-[16px] sm:text-[17px] text-[#515154] dark:text-[#98989d] leading-relaxed">
                  Work is inspected by you upon arrival. Only after you provide explicit completion sign-off is the job marked finished and payment resolved.
                </p>
              </div>
              <div className="mt-8 text-[15px] font-semibold text-[#0071e3] dark:text-[#0a84ff]">
                Customer-locked escrow protection →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE - Apple Design Craft */}
      <section className="py-24 bg-[#f5f5f7] dark:bg-[#0a0a0c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-[14px] font-bold uppercase tracking-wider text-[#0071e3] dark:text-[#0a84ff]">
              Fair Market Architecture
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-2">
              Engineered for fairness
            </h2>
            <p className="text-[17px] text-[#86868b] dark:text-[#98989d] mt-2">
              How our community-first model compares to legacy gig aggregators.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-7 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#fafafc] dark:bg-[#242426] text-[14px] font-bold uppercase tracking-wider text-[#86868b] dark:text-[#98989d]">
              <div>Dimension</div>
              <div className="hidden sm:block">Traditional Platforms</div>
              <div className="hidden sm:block text-[#0071e3] dark:text-[#0a84ff]">KaamConnect</div>
            </div>

            <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-[16px] sm:text-[17px]">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-7 gap-3 sm:gap-5 items-center">
                <div className="font-bold text-[#1d1d1f] dark:text-white">Worker Commission</div>
                <div className="text-[#86868b] dark:text-[#98989d]">20% – 35% deducted from wage</div>
                <div className="font-semibold text-[#166534] dark:text-[#34c759] flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16a34a] dark:text-[#34c759]" />
                  <span>₹0 Commission (100% take-home)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-7 gap-3 sm:gap-5 items-center">
                <div className="font-bold text-[#1d1d1f] dark:text-white">Pricing Model</div>
                <div className="text-[#86868b] dark:text-[#98989d]">Surge algorithms & inspection fees</div>
                <div className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16a34a] dark:text-[#34c759]" />
                  <span>Transparent 2-way negotiation</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-7 gap-3 sm:gap-5 items-center">
                <div className="font-bold text-[#1d1d1f] dark:text-white">Specialist Dispatch</div>
                <div className="text-[#86868b] dark:text-[#98989d]">Opaque bot dispatch &gt;15 km</div>
                <div className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16a34a] dark:text-[#34c759]" />
                  <span>Haversine radius (&lt; 25 min arrival)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-7 gap-3 sm:gap-5 items-center">
                <div className="font-bold text-[#1d1d1f] dark:text-white">Payment Security</div>
                <div className="text-[#86868b] dark:text-[#98989d]">Upfront payment before job completion</div>
                <div className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16a34a] dark:text-[#34c759]" />
                  <span>Customer sign-off locked escrow</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-7 gap-3 sm:gap-5 items-center">
                <div className="font-bold text-[#1d1d1f] dark:text-white">Identity & Trust</div>
                <div className="text-[#86868b] dark:text-[#98989d]">Unchecked automated profiles</div>
                <div className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16a34a] dark:text-[#34c759]" />
                  <span>Aadhaar & manual admin review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRO CALL TO ACTION - Apple Dark Obsidian Card */}
      <section className="py-24 bg-white dark:bg-[#000000]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#1d1d1f] dark:bg-[#161618] text-white rounded-[36px] border border-transparent dark:border-white/[0.08] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="max-w-xl text-center md:text-left space-y-4">
              <span className="text-[14px] font-bold uppercase tracking-wider text-[#86868b] dark:text-[#98989d]">
                For Local Tradespeople
              </span>
              <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Build your independent trade.
              </h3>
              <p className="text-[16px] sm:text-[18px] text-[#a1a1a6] leading-relaxed font-normal">
                Join over 2,400 verified specialists across Bengaluru. Set your own quotes, define your service perimeter, and keep every rupee you earn.
              </p>
            </div>

            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-semibold text-[16px] tracking-tight shrink-0 transition-colors shadow-sm apple-press-spring cursor-pointer"
            >
              Register as Specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
