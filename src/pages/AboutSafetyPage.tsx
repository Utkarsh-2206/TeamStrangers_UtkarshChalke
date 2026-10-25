import React from 'react';
import { ShieldCheck, Lock, PhoneCall, AlertTriangle, UserCheck, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutSafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-14 transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 animate-apple-fade-up">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] text-[13px] font-semibold border border-black/[0.06] dark:border-white/[0.08]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6366f1] dark:text-[#818cf8]" />
            <span>Safety, Trust & Dignity Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            Safety built into every interaction.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#86868b] dark:text-[#98989d] leading-relaxed">
            KaamConnect guarantees reliability for urban households and financial dignity for independent blue-collar specialists through transparent, verified mechanisms.
          </p>
        </div>

        {/* 4 Pillars of Trust - Apple Squircle Cards with Spring Physics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1c1c1e] p-8 sm:p-9 rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs apple-interactive-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white flex items-center justify-center font-semibold">
              <UserCheck className="w-6 h-6 text-[#0071e3] dark:text-[#0a84ff]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-white">1. Government ID Verification</h3>
            <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed">
              Every specialist profile undergoes multi-stage manual administrator verification of official government credentials (Aadhaar, Voter ID, and trade certifications). Verified specialists display the trusted blue badge.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-8 sm:p-9 rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs apple-interactive-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white flex items-center justify-center font-semibold">
              <Scale className="w-6 h-6 text-[#0071e3] dark:text-[#0a84ff]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-white">2. Transparent Pricing Without Exploitation</h3>
            <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed">
              Traditional aggregators extract 20% to 35% commission or inflate customer rates arbitrarily. KaamConnect enables direct mutual quotes with zero aggregator deductions, ensuring tradespeople keep 100% of their earnings.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-8 sm:p-9 rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs apple-interactive-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white flex items-center justify-center font-semibold">
              <Lock className="w-6 h-6 text-[#0071e3] dark:text-[#0a84ff]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-white">3. Customer Completion Sign-off Lock</h3>
            <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed">
              Specialists cannot unilaterally mark jobs as completed without customer confirmation. This guarantees that you only sign off once electrical wiring is restored, leaks are resolved, or cleaning is thoroughly completed.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] p-8 sm:p-9 rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs apple-interactive-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white flex items-center justify-center font-semibold">
              <AlertTriangle className="w-6 h-6 text-[#ff9500] dark:text-[#ffd60a]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-white">4. Dedicated Resolution Support</h3>
            <p className="text-[15px] sm:text-[16px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed">
              In the rare event of a dispute or misunderstanding, both customers and specialists can file an immediate report. Platform administrators review cases with direct mediation and transparent resolution.
            </p>
          </div>
        </div>

        {/* Apple Dark Obsidian Assistance Card */}
        <div className="bg-[#1d1d1f] dark:bg-[#161618] text-white rounded-[32px] p-8 sm:p-12 shadow-2xl border border-transparent dark:border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="text-[22px] font-bold flex items-center gap-2.5">
                <PhoneCall className="w-6 h-6 text-[#0071e3] dark:text-[#0a84ff]" />
                <span>24/7 Safety & Assistance Helpline</span>
              </h3>
              <p className="text-[15px] text-[#86868b] dark:text-[#98989d]">
                Toll-free emergency line for active bookings across all Bengaluru localities.
              </p>
            </div>
            <div className="text-2xl font-bold tracking-tight text-white font-mono bg-white/10 px-6 py-3 rounded-full border border-white/15">
              1800-KAAM-TRUST
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link
            to="/workers"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white text-[16px] font-semibold transition-colors shadow-sm apple-press-spring cursor-pointer"
          >
            <span>Explore Verified Specialists</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
