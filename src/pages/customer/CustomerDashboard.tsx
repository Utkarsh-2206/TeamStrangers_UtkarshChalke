import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  MessageSquare,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'needs_action' | 'active' | 'completed'>('all');

  const loadData = async () => {
    try {
      const data = await mockStore.getBookings(user?.id || 'cust-priya', 'customer');
      setBookings(data);
    } catch (err) {
      console.error('Failed to load customer bookings:', err);
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

  const negotiationsNeedingReply = bookings.filter((b) => {
    if (b.status !== 'negotiating') return false;
    const latestOffer = b.offers?.[b.offers.length - 1];
    return latestOffer && latestOffer.offered_by !== user?.id && latestOffer.status === 'pending';
  });

  const activeBookings = bookings.filter((b) =>
    ['pending', 'negotiating', 'accepted', 'in_progress'].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const displayedBookings = bookings.filter((b) => {
    if (activeTab === 'needs_action') {
      const latestOffer = b.offers?.[b.offers.length - 1];
      return b.status === 'negotiating' && latestOffer && latestOffer.offered_by !== user?.id && latestOffer.status === 'pending';
    }
    if (activeTab === 'active') {
      return ['pending', 'negotiating', 'accepted', 'in_progress'].includes(b.status);
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-apple-fade-up">
        {/* Welcome Apple Hero Card */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] p-8 sm:p-10 border border-black/[0.06] dark:border-white/[0.08] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              <MapPin className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#0a84ff]" />
              <span>Customer Portal • {user?.locality || 'Indiranagar'}, Bengaluru</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Welcome back, {user?.full_name || 'Priya'}
            </h1>
            <p className="text-[15px] sm:text-[17px] text-[#86868b] dark:text-[#98989d] max-w-xl leading-relaxed">
              Track live visits, review specialist counteroffers, and manage completed repairs with 100% price certainty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/workers"
              className="px-6 py-3.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-white font-semibold text-[15px] transition-colors apple-press-spring flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Specialists</span>
            </Link>
            <Link
              to="/book"
              className="px-6 py-3.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[15px] shadow-sm transition-colors apple-press-spring flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </Link>
          </div>
        </div>

        {/* Counteroffers Alert (if any) */}
        {negotiationsNeedingReply.length > 0 && (
          <div className="bg-[#ff9500]/10 dark:bg-[#ff9500]/15 rounded-[28px] border border-[#ff9500]/30 p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3 text-[#ff9500] dark:text-[#ffd60a]">
              <div className="w-9 h-9 rounded-2xl bg-[#ff9500]/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#ff9500] dark:text-[#ffd60a]" />
              </div>
              <div>
                <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1d1d1f] dark:text-white">
                  Counteroffers Awaiting Your Review ({negotiationsNeedingReply.length})
                </h2>
                <p className="text-[14px] text-[#86868b] dark:text-[#98989d]">
                  Specialists proposed an itemized price adjustment. Review or confirm the appointment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {negotiationsNeedingReply.map((b) => {
                const latestOffer = b.offers?.[b.offers.length - 1];
                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[16px] text-[#1d1d1f] dark:text-white">{b.worker_name}</span>
                        <span className="text-[12px] font-semibold text-[#0071e3] dark:text-[#0a84ff] bg-[#0071e3]/10 dark:bg-[#0a84ff]/20 px-2.5 py-0.5 rounded-full">
                          {b.service_name}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#86868b] dark:text-[#98989d] line-clamp-1 italic">
                        "{latestOffer?.message}"
                      </p>
                      <div className="text-[14px] flex items-center gap-2 pt-1">
                        <span className="text-[#86868b]">Counteroffer:</span>
                        <strong className="text-[#0071e3] dark:text-[#0a84ff] text-[16px] font-bold">
                          ₹{latestOffer?.amount}
                        </strong>
                        <span className="text-[12px] text-[#86868b]">
                          (Budget: ₹{b.customer_budget})
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/booking/${b.id}`}
                      className="px-5 py-2.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white text-[14px] font-semibold shrink-0 apple-press-spring transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Active Visits
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#0071e3] dark:text-[#0a84ff] mt-2 block">
              {activeBookings.length}
            </span>
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-1 block">Scheduled or underway</span>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              In Negotiation
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#ff9500] dark:text-[#ffd60a] mt-2 block">
              {bookings.filter((b) => b.status === 'negotiating').length}
            </span>
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-1 block">Price proposals open</span>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white mt-2 block">
              {completedBookings.length}
            </span>
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-1 block">Sign-off released</span>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-bold uppercase tracking-wider block">
              Perimeter
            </span>
            <span className="text-[20px] font-bold text-[#1d1d1f] dark:text-white mt-2 block truncate">
              {user?.locality || 'Indiranagar'}
            </span>
            <span className="text-[13px] text-[#34c759] font-semibold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full local coverage</span>
            </span>
          </div>
        </div>

        {/* Requests List Section */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-9 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1d1d1f] dark:text-white">
                Service Requests & Bookings
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#86868b] dark:text-[#98989d] mt-1">
                Monitor status, counteroffers, and release payment upon job completion.
              </p>
            </div>

            {/* Apple Capsule Segmented Tabs */}
            <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.06] p-1.5 rounded-full border border-black/[0.04] dark:border-white/[0.08] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('needs_action')}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'needs_action'
                    ? 'bg-[#ff9500] text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <span>Needs Action</span>
                {negotiationsNeedingReply.length > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-white text-[#ff9500] text-[11px] flex items-center justify-center font-bold">
                    {negotiationsNeedingReply.length}
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
                Active ({activeBookings.length})
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
                Completed ({completedBookings.length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {displayedBookings.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#34c759] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">
                  {activeTab === 'needs_action'
                    ? 'All counteroffers responded to!'
                    : 'No requests found in this view'}
                </h3>
                <p className="text-[15px] text-[#86868b] dark:text-[#98989d] mt-1.5 leading-relaxed">
                  Need reliable maintenance? Discover verified local electricians, plumbers, and carpenters.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  to="/workers"
                  className="px-6 py-3 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white font-semibold text-[15px] inline-flex items-center gap-2 apple-press-spring"
                >
                  <span>Explore Directory</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#242426] apple-interactive-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                      <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-medium">• #{b.id.slice(-6)}</span>
                    </div>

                    <p className="text-[15px] text-[#515154] dark:text-[#c7c7cc] line-clamp-1 leading-relaxed">
                      {b.job_description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[13px] sm:text-[14px] text-[#86868b] dark:text-[#98989d] pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#86868b]" />
                        {new Date(b.scheduled_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#86868b]" />
                        {b.locality}
                      </span>
                      <span>
                        Specialist: <strong className="text-[#1d1d1f] dark:text-white font-semibold">{b.worker_name}</strong>
                      </span>
                      <span className="bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-white px-3 py-0.5 rounded-full font-bold">
                        {b.agreed_price ? `Agreed: ₹${b.agreed_price}` : `Proposed: ₹${b.proposed_price}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                      to={`/booking/${b.id}`}
                      className="w-full md:w-auto px-6 py-3 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-semibold text-[15px] text-center transition-colors flex items-center justify-center gap-2 apple-press-spring cursor-pointer"
                    >
                      <span>Booking Timeline</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
