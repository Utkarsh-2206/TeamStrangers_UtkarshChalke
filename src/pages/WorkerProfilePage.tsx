import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  BadgeCheck,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  Share2,
  Lock,
  ThumbsUp,
  Award,
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Worker Profile Not Found</h2>
        <Link to="/workers" className="text-teal-600 font-bold hover:underline text-sm inline-block">
          ← Back to All Workers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 sm:pb-16 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Share */}
        <div className="flex items-center justify-between">
          <Link
            to="/workers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery Search</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Subtle Accent Cover */}
          <div className="h-28 sm:h-36 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 relative">
            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aadhaar Verified Professional</span>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-14 sm:-mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative">
                  <img
                    src={worker.avatar_url}
                    alt={worker.full_name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                  />
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                      worker.availability_status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    title={worker.availability_status}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{worker.full_name}</h1>
                    {worker.verification_status === 'verified' && (
                      <BadgeCheck className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{worker.locality}, Bengaluru</span>
                    <span className="text-slate-300">•</span>
                    <span>{worker.service_radius_km} km coverage</span>
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <StatusBadge status={worker.verification_status} type="verification" />
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        worker.availability_status === 'available'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {worker.availability_status === 'available' ? 'Available Today' : 'Busy Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Booking CTA */}
              <div className="hidden sm:flex flex-col items-end gap-2 p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Starting Base Quote
                  </span>
                  <span className="text-2xl font-extrabold text-teal-900">₹{worker.starting_rate}</span>
                </div>
                <Link
                  to={`/book/${worker.id}`}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all hover:scale-102"
                >
                  Book & Propose Price
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Trade Experience</span>
                <span className="text-base font-extrabold text-slate-900">{worker.experience_years} Years</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Jobs Completed</span>
                <span className="text-base font-extrabold text-slate-900">{worker.completed_jobs_count}+ Done</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Rating</span>
                <span className="text-base font-extrabold text-amber-600 flex items-center gap-1">
                  <span>★</span>
                  <span>{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                  <span className="text-xs text-slate-400 font-normal">({worker.review_count})</span>
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Direct Contact</span>
                <span className="text-base font-extrabold text-slate-900">{worker.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview & Skills
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Verified Reviews</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
              {reviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'coverage' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Coverage Area Map
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900">About {worker.full_name}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{worker.bio}</p>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Verified Trade Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((s) => (
                    <div
                      key={s.id}
                      className="px-3.5 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{s.name} ({s.category})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Escrow & Satisfaction Lock</span>
                </div>
                <h3 className="text-base font-bold">No advance payment required</h3>
                <p className="text-xs text-slate-400 max-w-lg">
                  Propose your budget, agree on pricing upfront, and pay only after you personally confirm completion and inspect the work on site.
                </p>
              </div>
              <Link
                to={`/book/${worker.id}`}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shrink-0 shadow-md transition-colors"
              >
                Book {worker.full_name.split(' ')[0]} Now
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">Customer Reviews & Ratings</h2>
                <p className="text-xs text-slate-500">
                  Authentic ratings submitted by households after completed service appointments.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-3xl font-extrabold text-slate-900">
                  {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}
                </div>
                <div className="space-y-1">
                  <StarRating rating={worker.rating} size="sm" />
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {reviews.length} verified ratings
                  </span>
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <ThumbsUp className="w-8 h-8 mx-auto text-slate-300" />
                <p>No customer reviews yet. Be the first to book and review {worker.full_name}!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.customer_name || 'Customer'}</span>
                        <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
                          Verified Job
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Approximate Service Radius</h2>
              <p className="text-xs text-slate-500">
                Covers approx. {worker.service_radius_km} km radius around {worker.locality}. Private home coordinates are masked for worker safety.
              </p>
            </div>

            <LeafletMap
              workers={[worker]}
              selectedWorkerId={worker.id}
              center={[worker.latitude, worker.longitude]}
              zoom={13}
              height="350px"
            />
          </div>
        )}
      </div>

      {/* Sticky Mobile Booking Drawer / Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Base Quote</span>
          <span className="text-lg font-extrabold text-teal-800">₹{worker.starting_rate}</span>
        </div>
        <Link
          to={`/book/${worker.id}`}
          className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-600/20"
        >
          Book & Propose Price
        </Link>
      </div>
    </div>
  );
};
