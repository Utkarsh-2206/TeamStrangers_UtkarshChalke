import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  BadgeCheck,
  DollarSign,
  HelpCircle,
  Zap,
  Wrench,
  Hammer,
  Sparkles,
  Paintbrush,
  Cpu,
  Utensils,
  Home,
  Flower2,
  Truck,
} from 'lucide-react';
import { DEMO_SERVICES, DEMO_WORKERS } from '../lib/demoData';
import { StarRating } from '../components/common/StarRating';
import { StatusBadge } from '../components/common/StatusBadge';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  Wrench: <Wrench className="w-6 h-6 text-sky-500" />,
  Hammer: <Hammer className="w-6 h-6 text-orange-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-teal-500" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-indigo-500" />,
  Cpu: <Cpu className="w-6 h-6 text-blue-500" />,
  Utensils: <Utensils className="w-6 h-6 text-emerald-500" />,
  Home: <Home className="w-6 h-6 text-rose-500" />,
  Flower2: <Flower2 className="w-6 h-6 text-green-500" />,
  Truck: <Truck className="w-6 h-6 text-violet-500" />,
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
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Hyperlocal • Aadhaar-Verified • Zero Commission Gouging</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find Trusted Local Professionals in <span className="text-teal-600">Minutes.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Connect with nearby electricians, plumbers, carpenters, and domestic helpers at transparent, flexible prices. Direct negotiations with zero middlemen markups.
            </p>

            {/* Hyperlocal Search Box */}
            <form
              onSubmit={handleSearch}
              className="mt-8 p-3 rounded-2xl bg-white shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col md:flex-row items-center gap-3 max-w-4xl mx-auto"
            >
              <div className="flex-1 w-full flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200">
                <Search className="w-5 h-5 text-teal-600 shrink-0" />
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                  aria-label="Select Service"
                >
                  <option value="">All Services (Electrician, Plumber, Cleaner...)</option>
                  {DEMO_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (from ₹{s.base_price_estimate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full flex items-center gap-3 px-3 py-2">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Locality (e.g. Indiranagar, Koramangala)"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  aria-label="Locality"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>Find Professionals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-700 max-w-2xl mx-auto">
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="font-extrabold text-xl text-teal-600">2,400+</div>
                <div className="text-xs text-slate-500">Verified Pros</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="font-extrabold text-xl text-teal-600">&lt; 25 mins</div>
                <div className="text-xs text-slate-500">Avg. Arrival Time</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="font-extrabold text-xl text-teal-600">4.85 ★</div>
                <div className="text-xs text-slate-500">Verified Ratings</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="font-extrabold text-xl text-teal-600">₹0 Fee</div>
                <div className="text-xs text-slate-500">For Workers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICE CATEGORIES */}
      <section className="py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Explore Catalog</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Popular Household Services
              </h2>
            </div>
            <Link
              to="/services"
              className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2 md:mt-0"
            >
              <span>View All 10 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {DEMO_SERVICES.map((service) => (
              <Link
                key={service.id}
                to={`/workers?service=${service.id}`}
                className="group p-5 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-300 transition-all hover:shadow-md flex flex-col items-start justify-between min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {ICON_MAP[service.icon_name] || <Wrench className="w-6 h-6 text-teal-600" />}
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Starting from ₹{service.base_price_estimate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED NEARBY WORKERS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Top Rated & Nearby</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Verified Professionals
              </h2>
            </div>
            <Link
              to="/workers"
              className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2 md:mt-0"
            >
              <span>Explore Map & All Workers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar_url}
                        alt={worker.full_name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/20"
                      />
                      <div>
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                          <span>{worker.full_name}</span>
                          <BadgeCheck className="w-4 h-4 text-teal-600" />
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{worker.locality}, Bengaluru</span>
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={worker.verification_status} type="verification" />
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-2 leading-relaxed">
                    {worker.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Starting Quote</div>
                      <div className="text-base font-extrabold text-slate-900">₹{worker.starting_rate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Rating</div>
                      <StarRating rating={worker.rating} showCount reviewCount={worker.review_count} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Link
                    to={`/worker-profile/${worker.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/book/${worker.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Frictionless Lifecycle</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              How KaamConnect Works
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              From search to transparent pricing to job completion in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-600/20">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Hyperlocal Search</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your locality. Our Haversine engine matches nearby available experts within your budget.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-600/20">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Transparent Offers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Propose your price. Worker reviews the scope and can accept or submit a clear counteroffer.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-600/20">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Service & Sign-off</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Worker arrives and completes work. Only you as the customer can confirm final completion.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-600/20">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Verified Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leave authentic feedback. Builds neighborhood trust and rewards hard-working local professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS: CUSTOMERS VS WORKERS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Built Fair for Both Sides of the Market
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Empowering households with reliability while safeguarding workers' dignity and income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Benefits */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Benefits for Customers</h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Hidden Surge:</strong> Flexible budget proposal with mutual agreed pricing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Govt. ID Verification:</strong> Aadhaar/Police verification checked before booking.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Completion Lock:</strong> Workers cannot mark jobs done without your explicit sign-off.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Rapid Arrival:</strong> Haversine radius matching brings pros within 25 minutes.</span>
                </li>
              </ul>
            </div>

            {/* Worker Benefits */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Benefits for Workers</h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Aggregator Commission:</strong> Keep 100% of your hard-earned wages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Freedom to Counteroffer:</strong> Adjust quotes when job complexity is higher.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Choose Service Radius:</strong> Get jobs in your own neighborhood without long commutes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Direct Reputation Ownership:</strong> Build customer loyalty and repeat business.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Aggregators vs KaamConnect Comparison Table */}
          <div className="mt-16 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Fair Market Architecture</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Why KaamConnect Outperforms Legacy Platforms
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Comparing standard gig aggregators against our community-first hyperlocal model.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Feature / Guarantee</th>
                    <th className="py-3 px-4 text-slate-500">Traditional Gig Aggregators</th>
                    <th className="py-3 px-4 text-teal-800 bg-teal-50/70 rounded-t-xl font-extrabold">
                      KaamConnect Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Worker Commission Fee</td>
                    <td className="py-3.5 px-4 text-rose-600 font-medium">20% — 35% deducted from wage</td>
                    <td className="py-3.5 px-4 text-teal-700 font-extrabold bg-teal-50/70">
                      ₹0 Commission (100% direct take-home)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Pricing Transparency</td>
                    <td className="py-3.5 px-4 text-slate-600">Surge pricing & hidden inspection fees</td>
                    <td className="py-3.5 px-4 text-teal-700 font-extrabold bg-teal-50/70">
                      2-way transparent price negotiation
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Local Pro Matching</td>
                    <td className="py-3.5 px-4 text-slate-600">Opaque dispatch, workers travel &gt;15 km</td>
                    <td className="py-3.5 px-4 text-teal-700 font-extrabold bg-teal-50/70">
                      Haversine radius matching (&lt; 25 min arrival)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Payment Protection</td>
                    <td className="py-3.5 px-4 text-slate-600">Upfront payment before job completion</td>
                    <td className="py-3.5 px-4 text-teal-700 font-extrabold bg-teal-50/70">
                      Customer sign-off locked escrow release
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Worker Safety & Trust</td>
                    <td className="py-3.5 px-4 text-slate-600">Automated bot onboarding</td>
                    <td className="py-3.5 px-4 text-teal-700 font-extrabold bg-teal-50/70 rounded-b-xl">
                      Admin-reviewed Aadhaar verification
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING & SAFETY GUARANTEE */}
      <section className="py-20 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Safe & Accountable</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Transparent Pricing Meets Uncompromising Safety
              </h2>
              <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
                Traditional platforms either force fixed unrealistic rates that frustrate workers or blindside customers with surprise inspection fees. KaamConnect introduces transparent negotiation with safety guarantees.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-300" />
                  <span>Aadhaar-verified worker profiles approved by platform admins</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-300" />
                  <span>Emergency support & 24/7 dispute resolution helpline</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-300" />
                  <span>No prepayment scams — agree on price upfront, pay after satisfaction</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 space-y-6">
              <h3 className="font-bold text-lg text-white">Illustrative Testimonials (Demo)</h3>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <p className="italic text-teal-100">
                  "Found Rajesh for an MCB repair at 8 PM when my kitchen went dark. He was 1.5 km away and arrived in 20 minutes with the exact spare fuse. Transparent ₹450 charge. Incredible service!"
                </p>
                <div className="font-semibold text-white">— Priya V., Indiranagar Resident</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <p className="italic text-teal-100">
                  "Other apps take 25% cut and suspend our accounts arbitrarily. On KaamConnect, I quote fairly for complex jobs, talk directly to society residents, and make consistent weekly income."
                </p>
                <div className="font-semibold text-white">— Rajesh Sharma, Licensed Electrician</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WORKER CTA BANNER */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold">Are you a skilled local worker?</h3>
              <p className="text-teal-100 text-sm max-w-lg">
                Join 2,400+ professionals. Set your own prices, choose your work area, and receive verified job requests today.
              </p>
            </div>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-teal-900 font-extrabold text-sm shadow-md hover:bg-teal-50 transition-colors shrink-0"
            >
              Register as Worker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
