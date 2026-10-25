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
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Phone,
  AlertTriangle,
  ShieldCheck,
  Check,
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
    const handleUpdate = () => loadBooking();
    window.addEventListener('kaamconnect:data-changed', handleUpdate);
    return () => window.removeEventListener('kaamconnect:data-changed', handleUpdate);
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#0071e3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#ff9500] mx-auto" />
        <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Booking Not Found</h2>
        <Link to="/customer/dashboard" className="text-[#0071e3] dark:text-[#0a84ff] font-semibold text-[15px] hover:underline inline-block">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const latestOffer = booking.offers && booking.offers.length > 0 ? booking.offers[booking.offers.length - 1] : null;
  const isLatestOfferFromOtherParty = latestOffer && latestOffer.offered_by !== user?.id && latestOffer.status === 'pending';

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

  const handleAcceptOffer = async (offerId: string) => {
    if (!booking) return;
    const result = await mockStore.acceptOffer(booking.id, offerId, (role as any) || 'customer');
    if (result.success && result.booking) {
      setBooking(result.booking);
    }
  };

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

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await mockStore.updateBookingStatus(booking.id, 'cancelled', (role as any) || 'customer');
      if (result.success && result.booking) {
        setBooking(result.booking);
      }
    }
  };

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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-apple-fade-up">
        {/* Back Link & Badge */}
        <div className="flex items-center justify-between">
          <Link
            to={role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* 1. VISUAL PROGRESS TRACKER - Apple Segmented Tracker */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[13px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
              Live Service Lifecycle
            </h2>
            <span className="text-[13px] font-semibold text-[#0071e3] dark:text-[#0a84ff] bg-[#0071e3]/10 dark:bg-[#0a84ff]/20 px-3 py-1 rounded-full">
              Stage {currentStepIdx + 1} of 5: {steps[Math.max(0, currentStepIdx)]?.label || 'In Progress'}
            </span>
          </div>

          <div className="relative">
            {/* Connecting Bar */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-black/[0.04] dark:bg-white/[0.08] z-0 hidden sm:block rounded-full">
              <div
                className="h-full bg-[#0071e3] dark:bg-[#0a84ff] transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStepIdx / (steps.length - 1)) * 100))}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-5 relative z-10 gap-2">
              {steps.map((st, idx) => {
                const isPast = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={st.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${
                        isPast
                          ? 'bg-[#34c759] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white ring-4 ring-[#0071e3]/20 dark:ring-[#0a84ff]/30 shadow-md scale-105'
                          : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] dark:text-[#98989d]'
                      }`}
                    >
                      {isPast ? <Check className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-[12px] sm:text-[13px] leading-tight font-semibold transition-colors ${
                        isCurrent
                          ? 'text-[#1d1d1f] dark:text-white font-bold'
                          : isPast
                          ? 'text-[#1d1d1f] dark:text-white'
                          : 'text-[#86868b] dark:text-[#98989d]'
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
          <div className="md:col-span-2 bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-9 shadow-xs space-y-6">
            <div>
              <span className="text-[13px] font-bold text-[#0071e3] dark:text-[#0a84ff] uppercase tracking-wider">
                {booking.service_name} Service
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-1.5 leading-snug">
                {booking.job_description}
              </h1>
            </div>

            <div className="space-y-3 text-[14px] sm:text-[15px] text-[#515154] dark:text-[#c7c7cc] pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#86868b] shrink-0" />
                <span>
                  <strong>Address:</strong> {booking.service_address} ({booking.locality})
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4.5 h-4.5 text-[#86868b] shrink-0" />
                <span>
                  <strong>Scheduled:</strong>{' '}
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
            <div className="p-6 rounded-[24px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-medium block">
                  {booking.agreed_price ? 'Confirmed Agreed Rate' : 'Currently Proposed Rate'}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-[#0071e3] dark:text-[#0a84ff] mt-1 block">
                  ₹{booking.agreed_price || booking.proposed_price}
                </span>
              </div>
              <div className="text-right text-[13px]">
                <span className="text-[#86868b] dark:text-[#98989d] block">Customer Spending Cap</span>
                <span className="font-bold text-[18px] text-[#1d1d1f] dark:text-white block mt-0.5">
                  ₹{booking.customer_budget}
                </span>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="pt-2 flex flex-col gap-3">
              {actionError && (
                <div className="w-full p-3.5 rounded-2xl bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] text-[14px] flex items-center gap-2.5 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {/* If In Progress: Customer confirms, Worker sees on-site notice */}
                {booking.status === 'in_progress' && (
                  <>
                    {role !== 'worker' ? (
                      <button
                        type="button"
                        onClick={handleConfirmCompletion}
                        className="px-7 py-3.5 rounded-full bg-[#34c759] hover:bg-[#2fb34f] text-white font-semibold text-[15px] shadow-sm transition-all flex items-center gap-2 apple-press-spring cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Confirm Job Completion & Release Escrow</span>
                      </button>
                    ) : (
                      <div className="px-5 py-3 rounded-full bg-[#0071e3]/10 text-[#0071e3] dark:text-[#0a84ff] text-[14px] font-semibold flex items-center gap-2 border border-[#0071e3]/20">
                        <Clock className="w-4.5 h-4.5 animate-pulse" />
                        <span>On-site service in progress. Awaiting customer confirmation sign-off.</span>
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
                        className="px-7 py-3.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[15px] shadow-sm transition-all flex items-center gap-2 apple-press-spring cursor-pointer"
                      >
                        <Clock className="w-5 h-5" />
                        <span>I Have Arrived • Start Job</span>
                      </button>
                    ) : (
                      <div className="px-5 py-3 rounded-full bg-[#34c759]/10 text-[#34c759] text-[14px] font-semibold flex items-center gap-2 border border-[#34c759]/20">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                        <span>Service appointment confirmed. Specialist scheduled to arrive.</span>
                      </div>
                    )}
                  </>
                )}

                {/* If Completed */}
                {booking.status === 'completed' && (
                  <>
                    {role !== 'worker' && !reviewSubmitted && (
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(true)}
                        className="px-6 py-3.5 rounded-full bg-[#ff9500] hover:bg-[#e08300] text-white font-semibold text-[15px] shadow-xs transition-colors flex items-center gap-2 apple-press-spring cursor-pointer"
                      >
                        <span>Rate & Review Specialist</span>
                      </button>
                    )}
                    {role === 'worker' && (
                      <div className="px-5 py-3 rounded-full bg-[#34c759]/10 text-[#34c759] text-[14px] font-semibold flex items-center gap-2 border border-[#34c759]/20">
                        <Sparkles className="w-4.5 h-4.5" />
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
                    className="px-5 py-3 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-[#ff3b30]/10 text-[#ff3b30] font-semibold text-[14px] transition-colors flex items-center gap-1.5 apple-press-spring cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Report Issue</span>
                  </button>
                )}

                {/* Cancel Button */}
                {['pending', 'negotiating', 'accepted'].includes(booking.status) && (
                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="px-5 py-3 rounded-full border border-black/[0.1] dark:border-white/[0.12] text-[#86868b] hover:text-[#ff3b30] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] font-semibold text-[14px] transition-colors apple-press-spring cursor-pointer"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Specialist Card */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[13px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider block mb-4">
                Assigned Specialist
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={
                    booking.worker_avatar ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120'
                  }
                  alt={booking.worker_name}
                  className="w-14 h-14 rounded-full object-cover border border-black/[0.08] dark:border-white/[0.12]"
                />
                <div>
                  <h4 className="font-bold text-[17px] text-[#1d1d1f] dark:text-white">{booking.worker_name}</h4>
                  <p className="text-[14px] text-[#86868b] dark:text-[#98989d]">{booking.service_name}</p>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5 text-[14px] text-[#515154] dark:text-[#c7c7cc]">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#86868b]" />
                  <span>{booking.worker_phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
                  <span className="font-semibold text-[#34c759]">Aadhaar Govt ID Verified</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] text-[13px] text-[#515154] dark:text-[#c7c7cc] space-y-1">
              <strong className="font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
                <span>FairPay Escrow Protection</span>
              </strong>
              <p className="leading-relaxed">
                Zero advance payment. Price is locked upfront and transferred to the specialist only upon your final satisfaction sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* 3. TRANSPARENT PRICE NEGOTIATION THREAD */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-9 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] text-[#0071e3] dark:text-[#0a84ff] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] sm:text-[20px] text-[#1d1d1f] dark:text-white">
                  Transparent Two-Way Negotiation Thread
                </h3>
                <p className="text-[14px] text-[#86868b] dark:text-[#98989d]">
                  Every counteroffer and itemized cost note is audited and logged in real-time.
                </p>
              </div>
            </div>
            {['pending', 'negotiating'].includes(booking.status) && (
              <button
                type="button"
                onClick={() => setShowCounterModal(true)}
                className="px-6 py-3 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white text-[14px] font-semibold shadow-xs transition-all apple-press-spring flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>+ Propose Counteroffer</span>
              </button>
            )}
          </div>

          {/* Offers list */}
          <div className="space-y-4">
            {(!booking.offers || booking.offers.length === 0) && (
              <div className="text-center py-8 text-[15px] text-[#86868b] dark:text-[#98989d]">
                No counteroffers exchanged yet. Initial quote of ₹{booking.proposed_price} is currently active.
              </div>
            )}

            {booking.offers?.map((offer) => {
              const isMine = offer.offered_by === user?.id;
              const isPending = offer.status === 'pending';
              const isAccepted = offer.status === 'accepted';
              const isRejected = offer.status === 'rejected';

              return (
                <div
                  key={offer.id}
                  className={`p-6 rounded-[24px] border transition-all ${
                    isAccepted
                      ? 'bg-[#34c759]/10 border-[#34c759]/30 ring-2 ring-[#34c759]/15'
                      : isPending
                      ? 'bg-[#ff9500]/10 border-[#ff9500]/30 shadow-xs'
                      : isRejected
                      ? 'bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] opacity-60'
                      : 'bg-[#f5f5f7] dark:bg-[#242426] border-black/[0.06] dark:border-white/[0.08]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[16px] text-[#1d1d1f] dark:text-white">
                          {offer.offered_by_name}
                        </span>
                        <span className="text-[12px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-white">
                          {offer.offered_by_role}
                        </span>
                        <span
                          className={`text-[12px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            isAccepted
                              ? 'bg-[#34c759]/20 text-[#34c759]'
                              : isPending
                              ? 'bg-[#ff9500]/20 text-[#ff9500] animate-pulse'
                              : 'bg-black/[0.05] text-[#86868b]'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>
                      <p className="text-[15px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed font-medium">
                        "{offer.message}"
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.06] dark:border-white/[0.08]">
                      <span className="text-2xl sm:text-3xl font-bold text-[#0071e3] dark:text-[#0a84ff]">
                        ₹{offer.amount}
                      </span>
                      <span className="text-[12px] text-[#86868b] mt-0.5">
                        {new Date(offer.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Accept offer button if pending and offered by other party */}
                  {isPending && !isMine && ['pending', 'negotiating'].includes(booking.status) && (
                    <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[14px] text-[#ff9500] font-semibold">
                        Awaiting your decision on this counteroffer:
                      </span>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setShowCounterModal(true)}
                          className="px-5 py-2.5 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[#1d1d1f] dark:text-white font-semibold text-[14px] transition-colors apple-press-spring cursor-pointer"
                        >
                          Counter Again
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-6 py-2.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[14px] shadow-xs transition-colors flex items-center gap-2 apple-press-spring cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
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
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-black/[0.08] dark:border-white/[0.12] space-y-6 animate-apple-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">Submit Counteroffer</h3>
                  <p className="text-[14px] text-[#86868b] dark:text-[#98989d] mt-1">
                    Adjust price with 1-click presets or custom quote.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {negotiationError && (
                <div className="p-3.5 rounded-2xl bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] text-[14px] flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{negotiationError}</span>
                </div>
              )}

              <form onSubmit={handleSendCounteroffer} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-white">
                      Proposed Amount (₹)
                    </label>
                    <span className="text-[13px] text-[#86868b]">Budget Cap: ₹{booking.customer_budget}</span>
                  </div>
                  <input
                    type="number"
                    min="150"
                    max="10000"
                    step="50"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(Number(e.target.value))}
                    required
                    className="w-full text-2xl font-bold bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-4 text-[#0071e3] dark:text-[#0a84ff] focus:outline-[#0071e3]"
                  />

                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setCounterAmount(Math.max(150, counterAmount - 50))}
                      className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[13px] font-bold text-[#1d1d1f] dark:text-white apple-press-spring cursor-pointer"
                    >
                      -₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterAmount(counterAmount + 50)}
                      className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[13px] font-bold text-[#1d1d1f] dark:text-white apple-press-spring cursor-pointer"
                    >
                      +₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterAmount(counterAmount + 100)}
                      className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[13px] font-bold text-[#1d1d1f] dark:text-white apple-press-spring cursor-pointer"
                    >
                      +₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterAmount(booking.proposed_price)}
                      className="px-3.5 py-1.5 rounded-full bg-[#0071e3]/10 dark:bg-[#0a84ff]/20 text-[#0071e3] dark:text-[#0a84ff] text-[13px] font-bold ml-auto apple-press-spring cursor-pointer"
                    >
                      Reset (₹{booking.proposed_price})
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-white mb-2">
                    Reason / Itemized Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="e.g. Includes replacement parts cost and 30-day warranty"
                    required
                    className="w-full text-[15px] bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />

                  {/* Quick Reason Chips */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {[
                      'Includes spare parts & wiring',
                      'Emergency priority response',
                      'Standard repair with warranty',
                      'Labour only (parts provided)',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setCounterMessage(chip)}
                        className="text-[12px] font-medium px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#515154] dark:text-[#c7c7cc] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(false)}
                    className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white font-semibold text-[15px] hover:bg-[#0077ed] transition-colors apple-press-spring cursor-pointer shadow-xs"
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
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-black/[0.08] dark:border-white/[0.12] space-y-6 animate-apple-scale-in">
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">Rate & Review Specialist</h3>
              <p className="text-[15px] text-[#86868b] dark:text-[#98989d]">
                How was your service experience with <strong>{booking.worker_name}</strong>?
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="text-center py-2">
                  <StarRating rating={reviewRating} interactive onChange={(r) => setReviewRating(r)} size="lg" />
                  <span className="text-[15px] font-bold text-[#1d1d1f] dark:text-white block mt-3">
                    {reviewRating} of 5 Stars
                  </span>
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-white mb-2">Review Comment</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Arrived on time, fixed the issue cleanly, and very professional!"
                    required
                    className="w-full text-[15px] bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white font-semibold text-[15px] hover:bg-[#0077ed] transition-colors apple-press-spring cursor-pointer shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ISSUE REPORT MODAL */}
        {showIssueModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-black/[0.08] dark:border-white/[0.12] space-y-6 animate-apple-scale-in">
              <div className="flex items-center gap-2.5 text-[#ff3b30]">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">Report Service Concern</h3>
              </div>
              <p className="text-[14px] text-[#86868b] dark:text-[#98989d]">
                Our administrator desk will investigate and mediate this issue within 1 hour under FairPay terms.
              </p>

              <form onSubmit={handleSubmitIssue} className="space-y-6">
                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-white mb-2">Issue Category</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full text-[15px] bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3] font-medium"
                  >
                    <option value="Unsatisfactory Quality">Unsatisfactory Quality</option>
                    <option value="Worker No-Show / Delay">Worker No-Show / Delay</option>
                    <option value="Price Disagreement">Price Disagreement On-Site</option>
                    <option value="Safety or Behavior Concern">Safety or Behavior Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-white mb-2">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Provide clear details of what occurred..."
                    required
                    className="w-full text-[15px] bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#ff3b30] text-white font-semibold text-[15px] hover:bg-[#d93025] transition-colors apple-press-spring cursor-pointer shadow-xs"
                  >
                    Submit Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
