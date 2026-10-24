import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, PhoneCall, AlertTriangle, UserCheck, Scale, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutSafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Safety, Trust & Dignity Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Commitment to Safety and Fair Opportunities
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            KaamConnect solves the dual problem of home service reliability and blue-collar worker empowerment through transparent, accountable processes.
          </p>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Strict Govt. ID Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every worker profile undergoes manual administrator verification of official government IDs (Aadhaar / Voter ID / Trade Certificate). Verified pros display the green badge of trust. Unverified pros are transparently labeled.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Transparent Pricing Without Exploitation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traditional aggregators take 20-30% commissions or inflate customer rates arbitrarily. KaamConnect enables direct mutual negotiations with zero aggregator deductions, ensuring workers keep 100% of agreed compensation.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Customer Completion Sign-off Lock</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Workers cannot unilaterally mark jobs as completed without customer confirmation. This guarantees that you only sign off once the switchboard is working, the pipe leak has stopped, or the home is sparkling clean.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">4. Dispute & Safety Escalation Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an issue or delay occurs, both customers and workers can file an immediate issue report directly from the booking screen. Our administrator team reviews claims within 1 hour and mediates fair resolution.
            </p>
          </div>
        </div>

        {/* Emergency Assistance Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-teal-400" />
                <span>24/7 Safety & Assistance Helpline</span>
              </h3>
              <p className="text-xs text-slate-400">
                Toll-free emergency line for active bookings across all localities.
              </p>
            </div>
            <div className="text-xl font-extrabold text-teal-300 font-mono">
              1800-KAAM-TRUST (Toll Free)
            </div>
          </div>
        </div>

        {/* Back action */}
        <div className="text-center pt-4">
          <Link
            to="/workers"
            className="px-6 py-3 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
          >
            Find Nearby Verified Workers
          </Link>
        </div>
      </div>
    </div>
  );
};
