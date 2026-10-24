import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ArrowLeft, Calendar, MapPin, Search } from 'lucide-react';

export const BookingHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await mockStore.getBookings(user?.id || 'cust-priya', 'customer');
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active' && !['pending', 'negotiating', 'accepted', 'in_progress'].includes(b.status)) return false;
    if (filter === 'completed' && b.status !== 'completed') return false;
    if (filter === 'cancelled' && b.status !== 'cancelled') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.service_name?.toLowerCase().includes(q) ||
        b.worker_name?.toLowerCase().includes(q) ||
        b.job_description.toLowerCase().includes(q) ||
        b.locality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking History</h1>
              <p className="text-xs text-slate-500">Track and review all your past and active service appointments</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by worker, service..."
                className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl w-60 focus:outline-teal-500"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-slate-100 pb-3 text-xs font-bold">
            {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                  filter === tab ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No bookings match the filter criteria.</p>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{b.job_description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Pro: {b.worker_name}</span>
                      <span>•</span>
                      <span>{new Date(b.scheduled_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-teal-700 font-bold">₹{b.agreed_price || b.proposed_price}</span>
                    </div>
                  </div>

                  <Link
                    to={`/booking/${b.id}`}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 text-xs font-semibold text-slate-800 shadow-xs"
                  >
                    View Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
