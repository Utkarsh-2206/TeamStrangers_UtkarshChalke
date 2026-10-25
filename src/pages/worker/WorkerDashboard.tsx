import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { WorkerProfile, Booking, AvailabilityStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'negotiating' | 'active' | 'completed'>('incoming');

  const loadData = async () => {
    try {
      const workerId = user?.id || 'w-rajesh';
      const [w, bList] = await Promise.all([
        mockStore.getWorkerById(workerId),
        mockStore.getBookings(workerId, 'worker'),
      ]);
      setWorker(w);
      setBookings(bList);
    } catch (err) {
      console.error('Failed to load worker dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('kaamconnect:data-changed', handleUpdate);
    return () => window.removeEventListener('kaamconnect:data-changed', handleUpdate);
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!worker) return;
    const nextStatus: AvailabilityStatus =
      worker.availability_status === 'available' ? 'busy' : 'available';

    await mockStore.updateWorkerAvailability(worker.id, nextStatus);
    setWorker({ ...worker, availability_status: nextStatus });
  };

  const incomingRequests = bookings.filter((b) => b.status === 'pending');
  const activeNegotiations = bookings.filter((b) => b.status === 'negotiating');
  const upcomingJobs = bookings.filter((b) => ['accepted', 'in_progress'].includes(b.status));
  const completedJobs = bookings.filter((b) => b.status === 'completed');

  const totalEarnings = completedJobs.reduce((sum, b) => sum + (b.agreed_price || 0), 0);

  const getTabBookings = () => {
    switch (activeTab) {
      case 'incoming':
        return incomingRequests;
      case 'negotiating':
        return activeNegotiations;
      case 'active':
        return upcomingJobs;
      case 'completed':
        return completedJobs;
      default:
        return bookings;
    }
  };

  const displayedList = getTabBookings();

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-apple-fade-up">
        {/* Apple Specialist Profile Hero Card */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] p-8 sm:p-10 border border-black/[0.06] dark:border-white/[0.08] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <img
              src={
                worker?.avatar_url ||
                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'
              }
              alt={worker?.full_name || 'Worker'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] object-cover border border-black/[0.08] dark:border-white/[0.12] shadow-sm"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                  {worker?.full_name || 'Rajesh Sharma'}
                </h1>
                <StatusBadge status={worker?.verification_status || 'verified'} type="verification" />
              </div>
              <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d]">
                {worker?.locality}, Bengaluru • Base Rate ₹{worker?.starting_rate} • {worker?.service_radius_km} km radius
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[12px] font-semibold text-[#34c759] bg-[#34c759]/10 border border-[#34c759]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aadhaar Verified Independent Trade</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Availability Toggle */}
            <button
              type="button"
              onClick={handleToggleAvailability}
              className={`px-5 py-3 rounded-full text-[14px] font-semibold flex items-center gap-2.5 transition-all apple-press-spring cursor-pointer shadow-xs ${
                worker?.availability_status === 'available'
                  ? 'bg-[#16a34a] text-white hover:bg-[#15803d]'
                  : 'bg-[#ea580c] text-white hover:bg-[#c2410c]'
              }`}
            >
              <span>
                {worker?.availability_status === 'available'
                  ? 'ONLINE • Receiving Jobs'
                  : 'PAUSED / OFF DUTY'}
              </span>
            </button>

            <Link
              to="/worker/profile-edit"
              className="px-5 py-3 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-white text-[14px] font-semibold transition-colors apple-press-spring"
            >
              Edit Rates & Skills
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Completed Earnings
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#34c759] mt-2 block">
              ₹{totalEarnings}
            </span>
            <span className="text-[13px] text-[#34c759] font-semibold mt-1 block">
              100% direct take-home (₹0 cut)
            </span>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Incoming Inquiries
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#ff9500] dark:text-[#ffd60a] mt-2 block">
              {incomingRequests.length}
            </span>
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-1 block">Awaiting response</span>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Scheduled Jobs
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#0071e3] dark:text-[#0a84ff] mt-2 block">
              {upcomingJobs.length}
            </span>
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-1 block">Confirmed pipeline</span>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Customer Rating
            </span>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white">
                {worker?.rating ? worker.rating.toFixed(1) : 'New'}
              </span>
              <span className="text-2xl text-[#ff9500] dark:text-[#ffd60a]">★</span>
            </div>
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-1 block">
              {worker?.review_count || 0} Verified Reviews
            </span>
          </div>
        </div>

        {/* Job Pipeline & Tabs */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-9 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1d1d1f] dark:text-white">
                Job Pipeline & Leads
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d] mt-1">
                Manage incoming customer inquiries, propose transparent counteroffers, and trigger arrival.
              </p>
            </div>

            {/* Apple Segmented Control Tabs */}
            <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.06] p-1.5 rounded-full border border-black/[0.04] dark:border-white/[0.08] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('incoming')}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'incoming'
                    ? 'bg-[#ff9500] text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <span>Incoming Leads</span>
                {incomingRequests.length > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-white text-[#ff9500] text-[11px] flex items-center justify-center font-bold">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('negotiating')}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'negotiating'
                    ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <span>Negotiations</span>
                {activeNegotiations.length > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-white text-[#0071e3] text-[11px] flex items-center justify-center font-bold">
                    {activeNegotiations.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'active'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Scheduled ({upcomingJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Completed ({completedJobs.length})
              </button>
            </div>
          </div>

          {/* List Content */}
          {displayedList.length === 0 ? (
            <div className="text-center py-16 space-y-3 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] flex items-center justify-center mx-auto">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">No jobs in this category</h3>
              <p className="text-[15px] text-[#86868b] dark:text-[#98989d] leading-relaxed">
                {activeTab === 'incoming'
                  ? "You have answered all incoming leads. Keep your status 'ONLINE' to receive more local service requests!"
                  : 'Check your other pipeline tabs to see ongoing or completed jobs.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedList.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#242426] apple-interactive-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                      <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-medium">• Customer: <strong>{b.customer_name}</strong></span>
                    </div>

                    <p className="text-[15px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed">{b.job_description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[13px] sm:text-[14px] text-[#86868b] dark:text-[#98989d] pt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#86868b]" />
                        {b.service_address} ({b.locality})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#86868b]" />
                        {new Date(b.scheduled_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>
                        Offered: <strong className="text-[#0071e3] dark:text-[#0a84ff] font-bold">₹{b.proposed_price}</strong>
                      </span>
                      {b.agreed_price && (
                        <span>
                          Agreed: <strong className="text-[#34c759] font-bold">₹{b.agreed_price}</strong>
                        </span>
                      )}
                      <span>Budget Cap: ₹{b.customer_budget}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link
                      to={`/booking/${b.id}`}
                      className="w-full md:w-auto px-6 py-3 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-semibold text-[15px] shadow-sm text-center transition-colors flex items-center justify-center gap-2 apple-press-spring"
                    >
                      <span>
                        {b.status === 'pending'
                          ? 'Respond / Counteroffer'
                          : b.status === 'negotiating'
                          ? 'View Offer Thread'
                          : b.status === 'accepted'
                          ? 'Arrival Controls'
                          : 'Job Details'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pro Advantage Apple Card */}
        <div className="p-7 rounded-[28px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] text-[#1d1d1f] dark:text-white uppercase tracking-wider">
                Direct Earnings Guarantee
              </h4>
              <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d] mt-1 leading-relaxed">
                KaamConnect guarantees 0% commission deductions. Every single rupee paid by customers goes directly to your bank account or UPI.
              </p>
            </div>
          </div>
          <Link
            to="/worker/profile-edit"
            className="text-[14px] font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline shrink-0"
          >
            Adjust Work Radius →
          </Link>
        </div>
      </div>
    </div>
  );
};
