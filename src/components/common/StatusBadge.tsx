import React from 'react';
import { BookingStatus, VerificationStatus } from '../../types';
import { ShieldCheck, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus | VerificationStatus;
  type?: 'booking' | 'verification';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'booking' }) => {
  if (type === 'verification') {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#f0fdf4] dark:bg-[#14532d]/40 text-[#166534] dark:text-[#4ade80] border border-[#bbf7d0]/60 dark:border-[#22c55e]/30">
            <ShieldCheck className="w-4 h-4 text-[#15803d] dark:text-[#4ade80]" />
            <span>Govt. Verified</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#fffbeb] dark:bg-[#78350f]/30 text-[#92400e] dark:text-[#fde68a] border border-[#fde68a]/60 dark:border-[#f59e0b]/30">
            <Clock className="w-4 h-4 text-[#b45309] dark:text-[#fde68a]" />
            <span>Review Pending</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#fef2f2] dark:bg-[#7f1d1d]/30 text-[#991b1b] dark:text-[#fca5a5] border border-[#fecaca]/60 dark:border-[#ef4444]/30">
            <AlertCircle className="w-4 h-4 text-[#b91c1c] dark:text-[#fca5a5]" />
            <span>Not Verified</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#f5f5f7] dark:bg-white/[0.08] text-[#86868b] dark:text-[#98989d] border border-black/[0.05] dark:border-white/[0.08]">
            Unverified
          </span>
        );
    }
  }

  // Booking statuses
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#fffbeb] dark:bg-[#78350f]/20 text-[#92400e] dark:text-[#fde68a] border border-[#fde68a]/50 dark:border-[#f59e0b]/20">
          <Clock className="w-3.5 h-3.5 text-[#b45309] dark:text-[#fde68a]" />
          <span>Awaiting Response</span>
        </span>
      );
    case 'negotiating':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#eff6ff] dark:bg-[#1e3a8a]/20 text-[#1e40af] dark:text-[#93c5fd] border border-[#bfdbfe]/50 dark:border-[#3b82f6]/20">
          <Clock className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#93c5fd]" />
          <span>Price Discussion</span>
        </span>
      );
    case 'accepted':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#f0fdf4] dark:bg-[#14532d]/30 text-[#166534] dark:text-[#4ade80] border border-[#bbf7d0]/50 dark:border-[#22c55e]/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#4ade80]" />
          <span>Confirmed</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#f5f3ff] dark:bg-[#4c1d95]/20 text-[#5b21b6] dark:text-[#c4b5fd] border border-[#ddd6fe]/50 dark:border-[#8b5cf6]/20">
          <Clock className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#c4b5fd]" />
          <span>In Progress</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#f0fdf4] dark:bg-[#14532d]/30 text-[#166534] dark:text-[#4ade80] border border-[#bbf7d0]/50 dark:border-[#22c55e]/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#4ade80]" />
          <span>Completed</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#fef2f2] dark:bg-[#7f1d1d]/20 text-[#991b1b] dark:text-[#fca5a5] border border-[#fecaca]/50 dark:border-[#ef4444]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#dc2626] dark:text-[#fca5a5]" />
          <span>Cancelled</span>
        </span>
      );
    case 'disputed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-medium bg-[#fff1f2] dark:bg-[#881337]/20 text-[#9f1239] dark:text-[#fda4af] border border-[#fecdd3]/50 dark:border-[#f43f5e]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#e11d48] dark:text-[#fda4af]" />
          <span>In Review</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-medium bg-black/[0.04] dark:bg-white/[0.08] text-[#09090b] dark:text-white border border-black/[0.05] dark:border-white/[0.08]">
          {status}
        </span>
      );
  }
};
