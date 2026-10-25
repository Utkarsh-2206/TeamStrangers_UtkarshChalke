import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { WorkerProfile, Booking, IssueReport } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
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

  const handleVerifyWorker = async (workerId: string, status: 'verified' | 'rejected') => {
    await mockStore.updateWorkerVerification(workerId, status);
    loadData();
  };

  const handleResolveIssue = async (issueId: string, status: 'resolved' | 'dismissed') => {
    await mockStore.updateIssueStatus(issueId, status);
    loadData();
  };

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] py-20 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] p-10 max-w-md w-full border border-black/[0.08] dark:border-white/[0.12] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Admin Desk Restricted</h2>
          <p className="text-[15px] text-[#86868b] dark:text-[#98989d] leading-relaxed">
            Admin console access is reserved for platform reviewers. You are currently browsing as a <strong>{role || 'guest'}</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => quickLogin('admin')}
              className="w-full py-3.5 px-6 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white font-semibold text-[15px] hover:bg-[#0077ed] transition-colors apple-press-spring cursor-pointer"
            >
              Switch to Demo Admin
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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-apple-fade-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
              <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              <span>Platform Integrity & Trust Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Administrator Oversight
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#86868b] dark:text-[#98989d] mt-1 leading-relaxed">
              Verify Aadhaar IDs, supervise customer disputes, and inspect real-time transaction metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => mockStore.resetToDemo()}
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[#1d1d1f] dark:text-white transition-colors flex items-center gap-2 apple-press-spring cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[12px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">Customers</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white block mt-1.5">{metrics.totalCustomers}</span>
              <span className="text-[12px] text-[#0071e3] dark:text-[#0a84ff] font-medium block mt-0.5">Active profiles</span>
            </div>
            <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[12px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">Specialists</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white block mt-1.5">{metrics.totalWorkers}</span>
              <span className="text-[12px] text-[#0071e3] dark:text-[#0a84ff] font-medium block mt-0.5">Local roster</span>
            </div>
            <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[12px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">Pending Review</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#ff9500] dark:text-[#ffd60a] block mt-1.5">{metrics.pendingVerifications}</span>
              <span className="text-[12px] text-[#ff9500] font-medium block mt-0.5">Queue items</span>
            </div>
            <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[12px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">Bookings</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#0071e3] dark:text-[#0a84ff] block mt-1.5">{metrics.totalBookings}</span>
              <span className="text-[12px] text-[#0071e3] dark:text-[#0a84ff] font-medium block mt-0.5">Platform visits</span>
            </div>
            <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[12px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">Disputes</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#ff3b30] block mt-1.5">{metrics.openIssues}</span>
              <span className="text-[12px] text-[#ff3b30] font-medium block mt-0.5">Open cases</span>
            </div>
            <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[12px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">Gross Volume</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#34c759] block mt-1.5">₹{metrics.grossBookingValue}</span>
              <span className="text-[12px] text-[#34c759] font-medium block mt-0.5">₹0 Commission</span>
            </div>
          </div>
        )}

        {/* Tabs & Content */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-9 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
            <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.06] p-1.5 rounded-full border border-black/[0.04] dark:border-white/[0.08] overflow-x-auto">
              <button
                onClick={() => setActiveTab('verifications')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'verifications'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <span>Specialist Verification Queue</span>
                {pendingWorkers.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ff9500] text-white text-[11px] flex items-center justify-center font-bold">
                    {pendingWorkers.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('issues')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'issues'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <span>Dispute Desk</span>
                {issues.filter((i) => i.status === 'open').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ff3b30] text-white text-[11px] flex items-center justify-center font-bold">
                    {issues.filter((i) => i.status === 'open').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                    : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Bookings Stream ({bookings.length})
              </button>
            </div>
          </div>

          {/* TAB 1: WORKER VERIFICATION QUEUE */}
          {activeTab === 'verifications' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                      verificationFilter === 'all'
                        ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]'
                        : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    All ({workers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationFilter('pending')}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                      verificationFilter === 'pending'
                        ? 'bg-[#ff9500] text-white'
                        : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    Pending ({pendingWorkers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationFilter('verified')}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                      verificationFilter === 'verified'
                        ? 'bg-[#34c759] text-white'
                        : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    Verified ({verifiedWorkers.length})
                  </button>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search specialist name or skill..."
                    className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.12] rounded-full focus:outline-[#0071e3] text-[#1d1d1f] dark:text-white"
                  />
                </div>
              </div>

              {filteredWorkers.length === 0 ? (
                <div className="text-center py-16 text-[15px] text-[#86868b] dark:text-[#98989d]">
                  No specialists match the selected criteria.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="p-6 rounded-[24px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.06] dark:border-white/[0.08] apple-interactive-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <img
                          src={worker.avatar_url}
                          alt={worker.full_name}
                          className="w-16 h-16 rounded-[20px] object-cover border border-black/[0.06] dark:border-white/[0.08] shrink-0"
                        />
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">{worker.full_name}</span>
                            <StatusBadge status={worker.verification_status} type="verification" />
                            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] font-medium">• {worker.phone}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            {worker.skills.map((s) => (
                              <span
                                key={s.id}
                                className="text-[12px] font-semibold bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full border border-black/[0.06] dark:border-white/[0.08]"
                              >
                                {s.name}
                              </span>
                            ))}
                            <span className="text-[13px] text-[#86868b] dark:text-[#98989d] ml-1">
                              • {worker.locality} ({worker.service_radius_km} km radius)
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 pt-1 text-[13px] text-[#86868b] dark:text-[#98989d]">
                            <span className="flex items-center gap-1.5 text-[#34c759] font-semibold">
                              <BadgeCheck className="w-4 h-4 text-[#34c759]" />
                              <span>Govt. Aadhaar ID Verified</span>
                            </span>
                            <span>• Base Rate ₹{worker.starting_rate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0">
                        {worker.verification_status !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyWorker(worker.id, 'verified')}
                            className="px-5 py-2.5 rounded-full bg-[#34c759] hover:bg-[#2fb34f] text-white font-semibold text-[14px] flex items-center gap-1.5 shadow-xs transition-colors apple-press-spring cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve Pro</span>
                          </button>
                        )}

                        {worker.verification_status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyWorker(worker.id, 'rejected')}
                            className="px-5 py-2.5 rounded-full border border-[#ff3b30]/30 text-[#ff3b30] hover:bg-[#ff3b30]/10 font-semibold text-[14px] flex items-center gap-1.5 transition-colors apple-press-spring cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
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
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">Escalated Disputes & Safety Reports</h3>
                  <p className="text-[14px] text-[#86868b] dark:text-[#98989d]">Mediated under KaamConnect FairPay guarantee</p>
                </div>
                <span className="text-[13px] text-[#86868b]">1-hour admin SLA</span>
              </div>

              {issues.length === 0 ? (
                <div className="text-center py-16 space-y-2 max-w-sm mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#34c759] mx-auto" />
                  <p className="text-[15px] text-[#86868b] dark:text-[#98989d] font-semibold">Zero open dispute complaints.</p>
                </div>
              ) : (
                issues.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-6 rounded-[24px] bg-[#ff3b30]/5 dark:bg-[#ff3b30]/10 border border-[#ff3b30]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[13px] text-[#ff3b30] uppercase tracking-wide">
                          {iss.issue_type}
                        </span>
                        <span
                          className={`text-[12px] font-bold px-3 py-0.5 rounded-full ${
                            iss.status === 'resolved'
                              ? 'bg-[#34c759]/15 text-[#34c759]'
                              : iss.status === 'dismissed'
                              ? 'bg-black/[0.05] dark:bg-white/[0.08] text-[#86868b]'
                              : 'bg-[#ff3b30]/15 text-[#ff3b30] animate-pulse'
                          }`}
                        >
                          {iss.status}
                        </span>
                      </div>
                      <p className="text-[15px] text-[#1d1d1f] dark:text-white font-medium leading-relaxed">
                        "{iss.description}"
                      </p>
                      <div className="text-[13px] text-[#86868b] dark:text-[#98989d]">
                        Reported by: <strong>{iss.reporter_name}</strong> • Booking ID: #{iss.booking_id.slice(-6)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {iss.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => handleResolveIssue(iss.id, 'resolved')}
                          className="px-5 py-2.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[14px] transition-colors apple-press-spring cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {iss.status !== 'dismissed' && (
                        <button
                          type="button"
                          onClick={() => handleResolveIssue(iss.id, 'dismissed')}
                          className="px-5 py-2.5 rounded-full border border-black/[0.1] dark:border-white/[0.12] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white font-semibold text-[14px] transition-colors apple-press-spring cursor-pointer"
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

          {/* TAB 3: PLATFORM BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-bold text-[18px] text-[#1d1d1f] dark:text-white">Platform Activity Stream</h3>
                <span className="text-[13px] text-[#86868b]">{bookings.length} jobs on platform</span>
              </div>

              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-[22px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-[16px] text-[#1d1d1f] dark:text-white">{b.service_name}</span>
                      <StatusBadge status={b.status} />
                      <span className="text-[13px] text-[#86868b]">#{b.id.slice(-6)}</span>
                    </div>
                    <p className="text-[14px] text-[#515154] dark:text-[#c7c7cc] line-clamp-1">{b.job_description}</p>
                    <div className="text-[13px] text-[#86868b] dark:text-[#98989d]">
                      Customer: <strong>{b.customer_name}</strong> ➔ Specialist: <strong>{b.worker_name}</strong> ({b.locality})
                    </div>
                  </div>
                  <div className="text-right sm:shrink-0">
                    <span className="font-bold text-[18px] text-[#0071e3] dark:text-[#0a84ff]">
                      ₹{b.agreed_price || b.proposed_price}
                    </span>
                    <span className="text-[12px] text-[#86868b] block mt-0.5">
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
