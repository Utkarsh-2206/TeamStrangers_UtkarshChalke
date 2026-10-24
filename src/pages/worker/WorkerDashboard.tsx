import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { WorkerProfile, Booking, AvailabilityStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StarRating } from '../../components/common/StarRating';
import {
  Briefcase,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Radio,
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

  // Handle availability toggle
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

  // Gross earnings from completed bookings
  const totalEarnings = completedJobs.reduce((sum, b) => sum + (b.agreed_price || 0), 0);

  // Filter based on activeTab
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
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome & Profile Status Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 z-10">
            <img
              src={
                worker?.avatar_url ||
                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'
              }
              alt={worker?.full_name || 'Worker'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold">{worker?.full_name || 'Rajesh Sharma'}</h1>
                <StatusBadge status={worker?.verification_status || 'verified'} type="verification" />
              </div>
              <p className="text-xs text-slate-300">
                {worker?.locality}, Bengaluru • Base Rate ₹{worker?.starting_rate} • {worker?.service_radius_km} km radius
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Aadhaar ID Verified Pro</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            {/* Interactive Availability Toggle */}
            <button
              type="button"
              onClick={handleToggleAvailability}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-xs ${
                worker?.availability_status === 'available'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white ring-2 ring-emerald-400/30'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full bg-white ${worker?.availability_status === 'available' ? 'animate-ping' : ''}`} />
              <span>
                {worker?.availability_status === 'available'
                  ? 'ONLINE: Receiving Local Jobs'
                  : 'PAUSED / OFF DUTY'}
              </span>
            </button>

            <Link
              to="/worker/profile-edit"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
            >
              Edit Rates & Skills
            </Link>
          </div>
        </div>

        {/* 1. METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Completed Earnings
            </span>
            <span className="text-2xl font-extrabold text-teal-700 mt-1 block">
              ₹{totalEarnings}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              100% direct take-home (₹0 cut)
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Incoming Inquiries
            </span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {incomingRequests.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Pending your acceptance</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Active / Scheduled
            </span>
            <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">
              {upcomingJobs.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">On current job queue</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Customer Rating
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {worker?.rating ? worker.rating.toFixed(1) : 'New'}
              </span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {worker?.review_count || 0} Verified Neighborhood Reviews
            </span>
          </div>
        </div>

        {/* 2. JOB WORKFLOW & TABS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Job Pipeline & Customer Inquiries</h2>
              <p className="text-xs text-slate-500">Manage incoming service leads, propose price adjustments, and track schedule</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('incoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'incoming'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Incoming Leads</span>
                {incomingRequests.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-amber-700 text-[10px] flex items-center justify-center font-extrabold">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('negotiating')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'negotiating'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Negotiations</span>
                {activeNegotiations.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-teal-800 text-white text-[10px] flex items-center justify-center font-extrabold">
                    {activeNegotiations.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Scheduled ({upcomingJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'completed'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Completed ({completedJobs.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {displayedList.length === 0 ? (
            <div className="text-center py-12 space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">No jobs in this category</h3>
              <p className="text-xs text-slate-500">
                {activeTab === 'incoming'
                  ? "You have answered all incoming leads. Keep your status 'ONLINE' to receive more local service requests!"
                  : 'Check your other tabs to see ongoing or completed jobs.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedList.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    b.status === 'pending'
                      ? 'bg-amber-50/40 border-amber-300'
                      : b.status === 'negotiating'
                      ? 'bg-teal-50/30 border-teal-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-slate-400">• Customer: <strong>{b.customer_name}</strong></span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{b.job_description}</p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {b.service_address} ({b.locality})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.scheduled_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>
                        Offered: <strong className="text-teal-700 font-extrabold">₹{b.proposed_price}</strong>
                      </span>
                      {b.agreed_price && (
                        <span>
                          Agreed: <strong className="text-emerald-700 font-extrabold">₹{b.agreed_price}</strong>
                        </span>
                      )}
                      <span>Budget Cap: ₹{b.customer_budget}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link
                      to={`/booking/${b.id}`}
                      className="w-full md:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {b.status === 'pending'
                          ? 'Respond / Counteroffer'
                          : b.status === 'negotiating'
                          ? 'View Offer Thread'
                          : b.status === 'accepted'
                          ? 'Open Arrival Controls'
                          : 'Job Details'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. PRO ADVICE CARD */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-3xl border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                KaamConnect Pro Earning Advantage
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Pros who keep their availability toggled ON during morning hours (8 AM - 12 PM) close 3x more bookings with ₹0 platform deductions.
              </p>
            </div>
          </div>
          <Link
            to="/worker/profile-edit"
            className="text-xs font-bold text-teal-800 hover:text-teal-900 bg-white px-3.5 py-2 rounded-xl border border-teal-200 shadow-2xs shrink-0"
          >
            Adjust Work Radius
          </Link>
        </div>
      </div>
    </div>
  );
};
