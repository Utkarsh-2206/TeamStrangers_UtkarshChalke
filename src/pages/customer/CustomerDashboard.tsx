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
  Zap,
  Wrench,
  Hammer,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Filter,
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

  // Filter bookings according to activeTab
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
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold backdrop-blur-xs">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              <span>Customer Portal • {user?.locality || 'Indiranagar'}, Bengaluru</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name || 'Priya'}!
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
              Track live service visits, review worker counteroffers, and hire verified local talent with zero platform markup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <Link
              to="/workers"
              className="px-4 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-xs hover:bg-teal-50 transition-all flex items-center gap-1.5 hover:shadow"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Nearby Pros</span>
            </Link>
            <Link
              to="/book"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 border border-emerald-400 hover:shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking Request</span>
            </Link>
          </div>
        </div>

        {/* 1. NEGOTIATIONS REQUIRING IMMEDIATE RESPONSE */}
        {negotiationsNeedingReply.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-300 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-900">
                <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-amber-800 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold">
                    Worker Counteroffers Awaiting Your Review ({negotiationsNeedingReply.length})
                  </h2>
                  <p className="text-xs text-amber-700">
                    A pro has proposed a counter quote. Review, accept, or counter back to confirm the appointment.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {negotiationsNeedingReply.map((b) => {
                const latestOffer = b.offers?.[b.offers.length - 1];
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{b.worker_name}</span>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                          {b.service_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 italic">"{latestOffer?.message}"</p>
                      <div className="text-xs flex items-center gap-2 pt-0.5">
                        <span className="text-slate-400">Counteroffer:</span>
                        <strong className="text-teal-700 text-sm font-extrabold">₹{latestOffer?.amount}</strong>
                        <span className="text-[10px] text-slate-400">
                          (Budget: ₹{b.customer_budget})
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/booking/${b.id}`}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
                    >
                      Review Offer
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Active Requests
            </span>
            <span className="text-2xl font-extrabold text-teal-700 mt-1 block">
              {activeBookings.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Scheduled or underway</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Under Negotiation
            </span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {bookings.filter((b) => b.status === 'negotiating').length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Price proposals open</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Completed Jobs
            </span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {completedBookings.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Verified & reviewed</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Local Neighborhood
            </span>
            <span className="text-sm font-extrabold text-slate-800 mt-2 block truncate">
              {user?.locality || 'Indiranagar'}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Full radius coverage</span>
            </span>
          </div>
        </div>

        {/* 3. BOOKINGS WITH INTERACTIVE TABS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Service Requests & Visits</h2>
              <p className="text-xs text-slate-500">Track status, negotiate pricing, and manage completed jobs</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('needs_action')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                  activeTab === 'needs_action'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Needs Action</span>
                {negotiationsNeedingReply.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-amber-700 text-[10px] flex items-center justify-center font-extrabold">
                    {negotiationsNeedingReply.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'active'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Active ({activeBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'completed'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Completed ({completedBookings.length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {displayedBookings.length === 0 ? (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">
                  {activeTab === 'needs_action'
                    ? 'All counteroffers responded to!'
                    : 'No bookings found in this view'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Need quick repair or maintenance? Book top-rated local pros with transparent pricing.
                </p>
              </div>

              {/* Quick booking category chips */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Link
                  to="/workers?service=srv-elec"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-xs font-bold text-slate-700 transition-colors"
                >
                  ⚡ Electrician
                </Link>
                <Link
                  to="/workers?service=srv-plumb"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-xs font-bold text-slate-700 transition-colors"
                >
                  🔧 Plumber
                </Link>
                <Link
                  to="/workers?service=srv-clean"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-xs font-bold text-slate-700 transition-colors"
                >
                  ✨ House Cleaning
                </Link>
                <Link
                  to="/workers"
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
                >
                  Explore All Pros →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {displayedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-teal-300 transition-all bg-white hover:shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-slate-400 font-medium">• #{b.id.slice(-6)}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium line-clamp-1">{b.job_description}</p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.scheduled_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {b.locality}
                      </span>
                      <span>
                        Worker: <strong className="text-slate-800 font-semibold">{b.worker_name}</strong>
                      </span>
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md font-bold">
                        {b.agreed_price ? `Agreed: ₹${b.agreed_price}` : `Proposed: ₹${b.proposed_price}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link
                      to={`/booking/${b.id}`}
                      className="w-full md:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Booking Timeline & Controls</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
