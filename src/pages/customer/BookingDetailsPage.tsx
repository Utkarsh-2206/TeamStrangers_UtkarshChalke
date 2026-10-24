import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { Booking, PriceOffer } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StarRating } from '../../components/common/StarRating';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  ShieldAlert,
  Send,
  Star,
  Sparkles,
  Phone,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Negotiation form state
  const [showCounterModal, setShowCounterModal] = useState<boolean>(false);
  const [counterAmount, setCounterAmount] = useState<number>(500);
  const [counterMessage, setCounterMessage] = useState<string>('');
  const [negotiationError, setNegotiationError] = useState<string | null>(null);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Issue report modal state
  const [showIssueModal, setShowIssueModal] = useState<boolean>(false);
  const [issueType, setIssueType] = useState<string>('Unsatisfactory Quality');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);

  const loadBooking = async () => {
    if (!bookingId) return;
    try {
      const b = await mockStore.getBookingById(bookingId);
      setBooking(b);
      if (b?.proposed_price) {
        setCounterAmount(b.proposed_price);
      }
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();

    // Listen for custom realtime events from mock store
    const handleUpdate = () => loadBooking();
    window.addEventListener('kaamconnect:data-changed', handleUpdate);
    return () => window.removeEventListener('kaamconnect:data-changed', handleUpdate);
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
        <Link to="/customer/dashboard" className="text-teal-600 font-bold hover:underline text-sm inline-block">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const latestOffer = booking.offers && booking.offers.length > 0 ? booking.offers[booking.offers.length - 1] : null;
  const isLatestOfferFromOtherParty = latestOffer && latestOffer.offered_by !== user?.id && latestOffer.status === 'pending';

  // Handle counteroffer submission
  const handleSendCounteroffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setNegotiationError(null);
    const result = await mockStore.submitPriceOffer(booking.id, {
      offered_by: user?.id || 'cust-priya',
      offered_by_role: (role as any) || 'customer',
      offered_by_name: user?.full_name || 'Customer',
      amount: counterAmount,
      message: counterMessage,
    });

    if (result.success && result.booking) {
      setBooking(result.booking);
      setShowCounterModal(false);
      setCounterMessage('');
    } else {
      setNegotiationError(result.error || 'Failed to submit counteroffer.');
    }
  };

  // Handle accepting offer
  const handleAcceptOffer = async (offerId: string) => {
    if (!booking) return;
    const result = await mockStore.acceptOffer(booking.id, offerId, (role as any) || 'customer');
    if (result.success && result.booking) {
      setBooking(result.booking);
    }
  };

  // Customer confirms completion
  const handleConfirmCompletion = async () => {
    if (!booking) return;
    setActionError(null);
    const result = await mockStore.updateBookingStatus(booking.id, 'completed', role || 'customer');
    if (result.success && result.booking) {
      setBooking(result.booking);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setShowReviewModal(true);
    } else {
      setActionError(result.error || 'Failed to complete booking.');
    }
  };

  // Worker starts job
  const handleStartJob = async () => {
    if (!booking) return;
    setActionError(null);
    const result = await mockStore.updateBookingStatus(booking.id, 'in_progress', role || 'worker');
    if (result.success && result.booking) {
      setBooking(result.booking);
    } else {
      setActionError(result.error || 'Failed to start job.');
    }
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    if (!booking) return;
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await mockStore.updateBookingStatus(booking.id, 'cancelled', (role as any) || 'customer');
      if (result.success && result.booking) {
        setBooking(result.booking);
      }
    }
  };

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    const res = await mockStore.submitReview({
      booking_id: booking.id,
      customer_id: booking.customer_id,
      customer_name: booking.customer_name || 'Priya Verma',
      worker_id: booking.worker_id,
      rating: reviewRating,
      comment: reviewComment,
    });

    if (res.success) {
      setShowReviewModal(false);
      setReviewSubmitted(true);
      loadBooking();
    }
  };

  // Submit issue report
  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    await mockStore.reportIssue({
      booking_id: booking.id,
      reported_by: user?.id || 'cust-priya',
      reporter_name: user?.full_name || 'Customer',
      issue_type: issueType,
      description: issueDescription,
    });

    setShowIssueModal(false);
    loadBooking();
  };

  // Lifecycle steps array
  const steps: { key: string; label: string }[] = [
    { key: 'pending', label: 'Requested' },
    { key: 'negotiating', label: 'Negotiation' },
    { key: 'accepted', label: 'Confirmed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'pending') return 0;
    if (status === 'negotiating') return 1;
    if (status === 'accepted') return 2;
    if (status === 'in_progress') return 3;
    if (status === 'completed') return 4;
    return -1;
  };

  const currentStepIdx = getStepIndex(booking.status);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to={role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* 1. VISUAL PROGRESS TRACKER */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Booking Lifecycle
            </h2>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Stage {currentStepIdx + 1} of 5: {steps[Math.max(0, currentStepIdx)]?.label || 'In Progress'}
            </span>
          </div>

          <div className="relative">
            {/* Background connecting bar */}
            <div className="absolute top-4 sm:top-5 left-6 right-6 h-0.5 sm:h-1 bg-slate-100 z-0 hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStepIdx / (steps.length - 1)) * 100))}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-5 relative z-10 gap-1 sm:gap-2">
              {steps.map((st, idx) => {
                const isPast = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={st.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-300 ${
                        isPast
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-teal-600 text-white ring-4 ring-teal-500/20 shadow-md scale-105'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs leading-tight font-bold transition-colors ${
                        isCurrent
                          ? 'text-teal-900 font-extrabold'
                          : isPast
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. MAIN DETAILS & PRICE CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Job Details */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {booking.service_name} Service
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                {booking.job_description}
              </h1>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Address:</strong> {booking.service_address} ({booking.locality})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Scheduled For:</strong>{' '}
                  {new Date(booking.scheduled_at).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at{' '}
                  {new Date(booking.scheduled_at).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-teal-700 font-medium block">
                  {booking.agreed_price ? 'Confirmed Agreed Price' : 'Currently Proposed Price'}
                </span>
                <span className="text-2xl font-extrabold text-teal-900">
                  ₹{booking.agreed_price || booking.proposed_price}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-500 block">Customer Budget Cap</span>
                <span className="font-bold text-slate-700">₹{booking.customer_budget}</span>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="pt-2 flex flex-col gap-2.5">
              {actionError && (
                <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                {/* If In Progress: Customer confirms, Worker sees on-site notice */}
                {booking.status === 'in_progress' && (
                  <>
                    {role !== 'worker' ? (
                      <button
                        type="button"
                        onClick={handleConfirmCompletion}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Confirm Job Completion & Sign Off</span>
                      </button>
                    ) : (
                      <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span>On-site service in progress. Awaiting customer completion sign-off.</span>
                      </div>
                    )}
                  </>
                )}

                {/* If Accepted: Worker starts, Customer sees arrival notice */}
                {booking.status === 'accepted' && (
                  <>
                    {role === 'worker' ? (
                      <button
                        type="button"
                        onClick={handleStartJob}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>I Have Arrived • Start Job</span>
                      </button>
                    ) : (
                      <div className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>Service scheduled. Professional will arrive on time.</span>
                      </div>
                    )}
                  </>
                )}

                {/* If Completed: Customer leaves review, Worker sees completion confirmation */}
                {booking.status === 'completed' && (
                  <>
                    {role !== 'worker' && !reviewSubmitted && (
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(true)}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Star className="w-4 h-4" />
                        <span>Rate & Review Worker</span>
                      </button>
                    )}
                    {role === 'worker' && (
                      <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Job completed and verified by customer. Earnings credited to your summary.</span>
                      </div>
                    )}
                  </>
                )}

                {/* Report Issue Button */}
                {['accepted', 'in_progress', 'completed'].includes(booking.status) && (
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(true)}
                    className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Issue</span>
                  </button>
                )}

                {/* Cancel Button */}
                {['pending', 'negotiating', 'accepted'].includes(booking.status) && (
                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Counterpart Card (Worker or Customer) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Assigned Professional
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={
                    booking.worker_avatar ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120'
                  }
                  alt={booking.worker_name}
                  className="w-12 h-12 rounded-full object-cover border border-teal-400"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{booking.worker_name}</h4>
                  <p className="text-xs text-slate-500">{booking.service_name}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.worker_phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Govt ID Verified</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 text-[11px] text-teal-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">KaamConnect FairPay Escrow:</strong>
                <p className="text-teal-800 text-[11px] mt-0.5 leading-relaxed">
                  No advance payment. Agreed price is locked upfront and released only after your personal satisfaction sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TRANSPARENT PRICE NEGOTIATION THREAD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Transparent Price Negotiation & Audit Log
                </h3>
                <p className="text-[11px] text-slate-500">
                  All price changes and counteroffers are permanently tracked for fairness and clarity.
                </p>
              </div>
            </div>
            {['pending', 'negotiating'].includes(booking.status) && (
              <button
                type="button"
                onClick={() => setShowCounterModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all hover:shadow flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>+ Propose Counteroffer</span>
              </button>
            )}
          </div>

          {/* Offers list */}
          <div className="space-y-3.5">
            {(!booking.offers || booking.offers.length === 0) && (
              <div className="text-center py-6 text-xs text-slate-400">
                No counteroffers exchanged yet. Initial quote of ₹{booking.proposed_price} is currently active.
              </div>
            )}

            {booking.offers?.map((offer, idx) => {
              const isMine = offer.offered_by === user?.id;
              const isPending = offer.status === 'pending';
              const isAccepted = offer.status === 'accepted';
              const isRejected = offer.status === 'rejected';

              return (
                <div
                  key={offer.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isAccepted
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/10'
                      : isPending
                      ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                      : isRejected
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">
                          {offer.offered_by_name}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            offer.offered_by_role === 'customer'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {offer.offered_by_role}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-900 animate-pulse'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        "{offer.message}"
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <span className="text-xl font-extrabold text-teal-900">
                        ₹{offer.amount}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(offer.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Accept offer button if pending and offered by other party */}
                  {isPending && !isMine && ['pending', 'negotiating'].includes(booking.status) && (
                    <div className="mt-4 pt-3.5 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-amber-900 font-semibold">
                        Awaiting your decision on this counteroffer:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCounterModal(true)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs transition-colors"
                        >
                          Counter Again
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept ₹{offer.amount} & Confirm</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COUNTEROFFER MODAL */}
        {showCounterModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Submit Counteroffer</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adjust price with 1-click presets or custom quote.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {negotiationError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{negotiationError}</span>
                </div>
              )}

              <form onSubmit={handleSendCounteroffer} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Proposed Amount (₹)</label>
                    <span className="text-[11px] text-slate-400">Budget: ₹{booking.customer_budget}</span>
                  </div>
                  <input
                    type="number"
                    min="150"
                    max="10000"
                    step="50"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(Number(e.target.value))}
                    required
                    className="w-full text-base font-extrabold bg-slate-50 border border-slate-200 rounded-xl p-3 text-teal-900 focus:outline-teal-500"
                  />

                  {/* 1-Click Quick Presets for Demo */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setCounterAmount(Math.max(150, counterAmount - 50))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      -₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterAmount(counterAmount + 50)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      +₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterAmount(counterAmount + 100)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      +₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterAmount(booking.proposed_price)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-[11px] font-bold transition-colors"
                    >
                      Reset to Initial (₹{booking.proposed_price})
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Explanation</label>
                  <textarea
                    rows={2}
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="e.g. Includes replacement parts cost and 2-hour guarantee"
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  />

                  {/* Quick Reason Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'Includes spare parts & wiring',
                      'Emergency priority response',
                      'Standard repair with 30-day warranty',
                      'Labour only (parts provided by customer)',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setCounterMessage(chip)}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-xs transition-colors"
                  >
                    Send Counteroffer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Rate & Review Worker</h3>
              <p className="text-xs text-slate-500">
                How was your service experience with <strong>{booking.worker_name}</strong>?
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="text-center py-2">
                  <StarRating rating={reviewRating} interactive onChange={(r) => setReviewRating(r)} size="lg" />
                  <span className="text-xs font-bold text-slate-700 block mt-2">{reviewRating} of 5 Stars</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Comment</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Arrived on time, fixed the issue cleanly, and very polite!"
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Skip for Now
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-xs"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ISSUE REPORT MODAL */}
        {showIssueModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Report Safety or Service Issue</h3>
              </div>
              <p className="text-xs text-slate-500">
                Our administrator desk will investigate and mediate this dispute within 1 hour.
              </p>

              <form onSubmit={handleSubmitIssue} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500 font-semibold"
                  >
                    <option value="Unsatisfactory Quality">Unsatisfactory Quality</option>
                    <option value="Worker No-Show / Delay">Worker No-Show / Delay</option>
                    <option value="Price Disagreement">Price Disagreement On-Site</option>
                    <option value="Safety or Behavior Concern">Safety or Behavior Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Provide clear details of what happened..."
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs"
                  >
                    Submit Issue to Admin Desk
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MOBILE STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Rate</span>
            <span className="text-base font-extrabold text-teal-900">
              ₹{booking.agreed_price || booking.proposed_price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {booking.status === 'in_progress' && role !== 'worker' && (
              <button
                type="button"
                onClick={handleConfirmCompletion}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
              >
                Sign Off & Pay
              </button>
            )}

            {booking.status === 'accepted' && role === 'worker' && (
              <button
                type="button"
                onClick={handleStartJob}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
              >
                Start Job
              </button>
            )}

            {['pending', 'negotiating'].includes(booking.status) && (
              <button
                type="button"
                onClick={() => setShowCounterModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs"
              >
                + Counteroffer
              </button>
            )}

            {booking.status === 'completed' && role !== 'worker' && !reviewSubmitted && (
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs"
              >
                Rate Worker
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
