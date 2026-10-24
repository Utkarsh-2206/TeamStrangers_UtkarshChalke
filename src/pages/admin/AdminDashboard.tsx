import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { WorkerProfile, Booking, IssueReport } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Briefcase,
  DollarSign,
  Search,
  Filter,
  Lock,
  ArrowRight,
  FileText,
  BadgeCheck,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, role, quickLogin } = useAuth();

  const [metrics, setMetrics] = useState<any>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'issues' | 'bookings'>('verifications');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, wList, bList, iList] = await Promise.all([
        mockStore.getAdminMetrics(),
        mockStore.getWorkers(),
        mockStore.getBookings(undefined, 'admin'),
        mockStore.getIssues(),
      ]);
      setMetrics(m);
      setWorkers(wList);
      setBookings(bList);
      setIssues(iList);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('kaamconnect:data-changed', handleUpdate);
    return () => window.removeEventListener('kaamconnect:data-changed', handleUpdate);
  }, []);

  // Handle worker verification approve/reject
  const handleVerifyWorker = async (workerId: string, status: 'verified' | 'rejected') => {
    await mockStore.updateWorkerVerification(workerId, status);
    loadData();
  };

  // Handle issue resolution
  const handleResolveIssue = async (issueId: string, status: 'resolved' | 'dismissed') => {
    await mockStore.updateIssueStatus(issueId, status);
    loadData();
  };

  // Enforce authorized admin access
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Restricted Administrator Area</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Admin console access is restricted to authorized platform personnel. You are currently logged in as a <strong>{role || 'guest'}</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => quickLogin('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
            >
              Switch to Demo Administrator Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingWorkers = workers.filter((w) => w.verification_status === 'pending');
  const verifiedWorkers = workers.filter((w) => w.verification_status === 'verified');

  const filteredWorkers = workers.filter((w) => {
    if (verificationFilter === 'pending' && w.verification_status !== 'pending') return false;
    if (verificationFilter === 'verified' && w.verification_status !== 'verified') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = w.full_name.toLowerCase().includes(q);
      const matchLoc = w.locality.toLowerCase().includes(q);
      const matchSkill = w.skills.some((s) => s.name.toLowerCase().includes(q));
      return matchName || matchLoc || matchSkill;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-teal-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Integrity & Trust Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrator Oversight & Verification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review government ID proofs, supervise booking disputes, and track hyperlocal metrics with real-time database updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => mockStore.resetToDemo()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed Data</span>
            </button>
          </div>
        </div>

        {/* 1. METRICS CARDS */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customers</span>
              <span className="text-2xl font-extrabold text-slate-900 block mt-1">{metrics.totalCustomers}</span>
              <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">Verified Accounts</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pros</span>
              <span className="text-2xl font-extrabold text-slate-900 block mt-1">{metrics.totalWorkers}</span>
              <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">Local Skilled Network</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
              <span className="text-2xl font-extrabold text-amber-600 block mt-1">{metrics.pendingVerifications}</span>
              <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Requires Decision</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
              <span className="text-2xl font-extrabold text-teal-700 block mt-1">{metrics.totalBookings}</span>
              <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">Hyperlocal Volume</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispute Desk</span>
              <span className="text-2xl font-extrabold text-rose-600 block mt-1">{metrics.openIssues}</span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Open Escalations</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Volume</span>
              <span className="text-xl font-extrabold text-teal-800 block mt-1">₹{metrics.grossBookingValue}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">₹0 Platform Cut</span>
            </div>
          </div>
        )}

        {/* 2. TABS & MAIN CONSOLE */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('verifications')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'verifications'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Worker Verification Queue</span>
                {pendingWorkers.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] flex items-center justify-center font-extrabold">
                    {pendingWorkers.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('issues')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'issues'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Reported Issues & Disputes</span>
                {issues.filter((i) => i.status === 'open').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-extrabold">
                    {issues.filter((i) => i.status === 'open').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Platform Bookings ({bookings.length})
              </button>
            </div>
          </div>

          {/* TAB 1: WORKER VERIFICATION QUEUE */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      verificationFilter === 'all'
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    All Pros ({workers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationFilter('pending')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      verificationFilter === 'pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Pending Review ({pendingWorkers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationFilter('verified')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      verificationFilter === 'verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Verified ({verifiedWorkers.length})
                  </button>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pro name or skill..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                  />
                </div>
              </div>

              {filteredWorkers.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No workers match the selected filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <img
                          src={worker.avatar_url}
                          alt={worker.full_name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{worker.full_name}</span>
                            <StatusBadge status={worker.verification_status} type="verification" />
                            <span className="text-xs text-slate-400 font-medium">• {worker.phone}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {worker.skills.map((s) => (
                              <span
                                key={s.id}
                                className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                              >
                                {s.name}
                              </span>
                            ))}
                            <span className="text-[11px] text-slate-500 ml-1">
                              • {worker.locality} ({worker.service_radius_km} km radius)
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Govt. Aadhaar ID on File</span>
                            </span>
                            <span>• Base ₹{worker.starting_rate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                        {worker.verification_status !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyWorker(worker.id, 'verified')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Verification</span>
                          </button>
                        )}

                        {worker.verification_status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyWorker(worker.id, 'rejected')}
                            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ISSUES & DISPUTES */}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Escalated Disputes & Safety Reports</h3>
                  <p className="text-xs text-slate-500">Mediated under KaamConnect FairPay guarantee</p>
                </div>
                <span className="text-xs text-slate-400">1-hour admin mediation SLA</span>
              </div>

              {issues.length === 0 ? (
                <div className="text-center py-10 space-y-2 max-w-sm mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">Zero open dispute complaints.</p>
                </div>
              ) : (
                issues.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-rose-900 uppercase tracking-wide">
                          {iss.issue_type}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            iss.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : iss.status === 'dismissed'
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}
                        >
                          {iss.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">"{iss.description}"</p>
                      <div className="text-[11px] text-slate-500">
                        Reported by: <strong>{iss.reporter_name}</strong> • Booking ID: {iss.booking_id}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {iss.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => handleResolveIssue(iss.id, 'resolved')}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                      {iss.status !== 'dismissed' && (
                        <button
                          type="button"
                          onClick={() => handleResolveIssue(iss.id, 'dismissed')}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ALL PLATFORM BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900">Platform Bookings Stream</h3>
                <span className="text-xs text-slate-400">Total {bookings.length} jobs on platform</span>
              </div>

              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                      <span className="text-slate-400">#{b.id.slice(-6)}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{b.job_description}</p>
                    <div className="text-[11px] text-slate-500">
                      Customer: <strong>{b.customer_name}</strong> ➔ Worker: <strong>{b.worker_name}</strong> ({b.locality})
                    </div>
                  </div>
                  <div className="text-right sm:shrink-0">
                    <span className="font-extrabold text-teal-800 text-sm">
                      ₹{b.agreed_price || b.proposed_price}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
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
