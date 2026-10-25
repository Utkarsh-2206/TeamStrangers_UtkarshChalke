import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  BadgeCheck,
  Check,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Share2,
  Lock,
  ThumbsUp,
  ChevronRight,
} from 'lucide-react';
import { mockStore } from '../lib/mockStore';
import { WorkerProfile, Review } from '../types';
import { StarRating } from '../components/common/StarRating';
import { StatusBadge } from '../components/common/StatusBadge';
import { LeafletMap } from '../components/common/LeafletMap';

export const WorkerProfilePage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'coverage'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    async function loadWorker() {
      if (!workerId) return;
      setIsLoading(true);
      try {
        const found = await mockStore.getWorkerById(workerId);
        setWorker(found);
        if (found) {
          const revs = await mockStore.getReviewsForWorker(found.id);
          setReviews(revs);
        }
      } catch (err) {
        console.error('Failed to load worker profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWorker();
  }, [workerId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#0071e3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#ff9500] mx-auto" />
        <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Specialist Profile Not Found</h2>
        <Link to="/workers" className="text-[#0071e3] dark:text-[#0a84ff] font-semibold text-[15px] hover:underline inline-block">
          ← Back to Specialist Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 sm:pb-16 pt-8 transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-apple-fade-up">
        {/* Navigation & Share */}
        <div className="flex items-center justify-between">
          <Link
            to="/workers"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>Specialist Directory</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[#1d1d1f] dark:text-white text-[13px] font-semibold flex items-center gap-2 shadow-xs transition-colors apple-press-spring cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#86868b]" />
            <span>{copiedLink ? 'Link Copied' : 'Share Profile'}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden shadow-xs">
          {/* Apple Obsidian Header Band */}
          <div className="h-32 sm:h-40 bg-[#1d1d1f] dark:bg-[#161618] relative">
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white flex items-center gap-2 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              <span>Aadhaar Verified Specialist</span>
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-10 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative">
                  <img
                    src={worker.avatar_url}
                    alt={worker.full_name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] object-cover border-4 border-white dark:border-[#1c1c1e] shadow-lg bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                      {worker.full_name}
                    </h1>
                    {worker.verification_status === 'verified' && (
                      <BadgeCheck className="w-6 h-6 text-[#0071e3] dark:text-[#0a84ff]" />
                    )}
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d] flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-[#86868b] shrink-0" />
                    <span>{worker.locality}, Bengaluru</span>
                    <span>•</span>
                    <span>{worker.service_radius_km} km radius</span>
                  </p>
                  <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                    <StatusBadge status={worker.verification_status} type="verification" />
                    <span
                      className={`text-[13px] px-3 py-1 rounded-full font-semibold ${
                        worker.availability_status === 'available'
                          ? 'bg-[#34c759]/15 text-[#34c759] border border-[#34c759]/30'
                          : 'bg-[#ff9500]/15 text-[#ff9500] border border-[#ff9500]/30'
                      }`}
                    >
                      {worker.availability_status === 'available' ? 'Available Today' : 'Busy Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Booking CTA */}
              <div className="hidden sm:flex flex-col items-end gap-2 p-5 rounded-[22px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06]">
                <div className="text-right">
                  <span className="text-[12px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
                    Starting Base Quote
                  </span>
                  <span className="text-3xl font-bold text-[#0071e3] dark:text-[#0a84ff]">₹{worker.starting_rate}</span>
                </div>
                <Link
                  to={`/book/${worker.id}`}
                  className="px-7 py-3 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[15px] transition-colors shadow-sm apple-press-spring"
                >
                  Book Specialist
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 mt-8 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#242426] rounded-2xl">
                <span className="text-[12px] text-[#86868b] dark:text-[#98989d] font-medium block">Experience</span>
                <span className="text-[17px] sm:text-[18px] font-bold text-[#1d1d1f] dark:text-white mt-0.5 block">{worker.experience_years} Years</span>
              </div>
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#242426] rounded-2xl">
                <span className="text-[12px] text-[#86868b] dark:text-[#98989d] font-medium block">Completed Jobs</span>
                <span className="text-[17px] sm:text-[18px] font-bold text-[#1d1d1f] dark:text-white mt-0.5 block">{worker.completed_jobs_count}+ Completed</span>
              </div>
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#242426] rounded-2xl">
                <span className="text-[12px] text-[#86868b] dark:text-[#98989d] font-medium block">Customer Rating</span>
                <span className="text-[17px] sm:text-[18px] font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1 mt-0.5">
                  <span className="text-[#ff9500] dark:text-[#ffd60a]">★</span>
                  <span>{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                  <span className="text-[13px] text-[#86868b] font-normal">({worker.review_count})</span>
                </span>
              </div>
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#242426] rounded-2xl">
                <span className="text-[12px] text-[#86868b] dark:text-[#98989d] font-medium block">Direct Contact</span>
                <span className="text-[17px] sm:text-[18px] font-bold text-[#1d1d1f] dark:text-white font-mono mt-0.5 block">{worker.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs - Apple Segmented Control */}
        <div className="flex gap-1.5 p-1.5 bg-black/[0.04] dark:bg-white/[0.08] rounded-full w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            Overview & Skills
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <span>Verified Reviews</span>
            <span className="px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-white text-[12px] font-bold">
              {reviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer ${
              activeTab === 'coverage'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            Service Radius
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-apple-fade-up">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-10 shadow-xs space-y-6">
              <div>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1d1d1f] dark:text-white">
                  About {worker.full_name}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed mt-2">
                  {worker.bio}
                </p>
              </div>

              <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3.5">
                <h3 className="text-[13px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
                  Verified Trade Categories
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {worker.skills.map((s) => (
                    <div
                      key={s.id}
                      className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#242426] text-[#1d1d1f] dark:text-white text-[14px] font-semibold flex items-center gap-2 border border-black/[0.04] dark:border-white/[0.06]"
                    >
                      <Check className="w-4 h-4 text-[#34c759]" />
                      <span>{s.name} ({s.category})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Banner */}
            <div className="bg-[#1d1d1f] dark:bg-[#161618] text-white rounded-[32px] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl border border-transparent dark:border-white/[0.08]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#34c759] text-[13px] font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Escrow & Customer Confirmation Lock</span>
                </div>
                <h3 className="text-[20px] font-bold text-white">No advance payment required</h3>
                <p className="text-[15px] text-[#a1a1a6] max-w-lg leading-relaxed">
                  Propose your budget, agree on pricing upfront, and pay only after you personally inspect and confirm completed work.
                </p>
              </div>
              <Link
                to={`/book/${worker.id}`}
                className="px-8 py-3.5 rounded-full bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-semibold text-[15px] shrink-0 transition-colors shadow-sm apple-press-spring cursor-pointer"
              >
                Book {worker.full_name.split(' ')[0]}
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-10 shadow-xs space-y-8 animate-apple-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="space-y-1">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1d1d1f] dark:text-white">
                  Customer Reviews & Ratings
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d]">
                  Authentic ratings submitted by households following completed service appointments.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#f5f5f7] dark:bg-[#242426] p-5 rounded-2xl">
                <div className="text-4xl font-bold text-[#1d1d1f] dark:text-white">
                  {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}
                </div>
                <div className="space-y-1">
                  <StarRating rating={worker.rating} size="md" />
                  <span className="text-[13px] text-[#86868b] dark:text-[#98989d] block font-medium">
                    {reviews.length} verified ratings
                  </span>
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-16 text-[#86868b] dark:text-[#98989d] text-[15px] space-y-3">
                <ThumbsUp className="w-8 h-8 mx-auto text-[#86868b]/60" />
                <p>No customer reviews yet. Be the first to book and review {worker.full_name}!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[15px] text-[#1d1d1f] dark:text-white">{rev.customer_name || 'Customer'}</span>
                        <span className="text-[11px] text-[#34c759] bg-[#34c759]/10 px-2.5 py-0.5 rounded-full border border-[#34c759]/20 font-semibold">
                          Verified Job
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-[14px] sm:text-[15px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed">{rev.comment}</p>
                    <span className="text-[12px] text-[#86868b] dark:text-[#98989d] block">
                      {new Date(rev.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COVERAGE AREA */}
        {activeTab === 'coverage' && (
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-10 shadow-xs space-y-6 animate-apple-fade-up">
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1d1d1f] dark:text-white">Approximate Service Radius</h2>
              <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d] mt-1">
                Covers approx. {worker.service_radius_km} km radius around {worker.locality}. Exact residence coordinates are masked for specialist safety.
              </p>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-black/[0.06] dark:border-white/[0.08]">
              <LeafletMap
                workers={[worker]}
                selectedWorkerId={worker.id}
                center={[worker.latitude, worker.longitude]}
                zoom={13}
                height="380px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Booking Drawer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 apple-glass-nav px-6 py-4 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[11px] text-[#86868b] dark:text-[#98989d] block font-bold uppercase tracking-wider">Starting Quote</span>
          <span className="text-xl font-bold text-[#0071e3] dark:text-[#0a84ff]">₹{worker.starting_rate}</span>
        </div>
        <Link
          to={`/book/${worker.id}`}
          className="px-7 py-3 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white font-semibold text-[15px] apple-press-spring"
        >
          Book Specialist
        </Link>
      </div>
    </div>
  );
};
