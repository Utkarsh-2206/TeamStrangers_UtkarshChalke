import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Briefcase,
  Shield,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const JudgeDemoBar: React.FC = () => {
  const { user, role, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSwitch = (targetRole: 'customer' | 'worker' | 'admin') => {
    quickLogin(targetRole);
    if (targetRole === 'customer') navigate('/customer/dashboard');
    else if (targetRole === 'worker') navigate('/worker/dashboard');
    else if (targetRole === 'admin') navigate('/admin/dashboard');
  };

  const handleReset = () => {
    mockStore.resetToDemo();
    setResetMessage('Data reset');
    setTimeout(() => setResetMessage(null), 2500);
  };

  return (
    <aside
      aria-label="Evaluation Persona Switcher"
      className="fixed bottom-6 right-6 z-40 select-none"
    >
      <div className="bg-[#1d1d1f]/95 dark:bg-[#1c1c1e]/95 text-white backdrop-blur-2xl border border-white/15 rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] p-3 transition-all duration-300 ease-out">
        {/* Compact Dynamic Island Pill */}
        <div
          className="flex items-center gap-2.5 px-2 py-1 cursor-pointer apple-press-spring"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Sparkles className="w-4 h-4 text-[#818cf8]" />
          <div className="text-[14px] font-semibold tracking-tight flex items-center gap-1.5">
            <span>Demo Mode:</span>
            <span className="text-[#818cf8] capitalize font-bold">
              {role || 'Guest'}
            </span>
          </div>

          <div className="text-white/60 hover:text-white transition-colors ml-1">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>

        {/* Expandable Menu with Apple Spring Transition */}
        {isExpanded && (
          <div className="pt-3 mt-2 border-t border-white/10 space-y-3 animate-apple-scale-in min-w-[260px]">
            <div className="text-[12px] uppercase tracking-wider text-white/50 font-bold px-1">
              Switch Test Persona
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSwitch('customer')}
                className={`py-2 px-2.5 rounded-2xl text-[13px] font-semibold flex flex-col items-center justify-center gap-1.5 transition-all apple-press-spring cursor-pointer ${
                  role === 'customer'
                    ? 'bg-white text-[#1d1d1f] shadow-md font-bold'
                    : 'bg-white/10 text-white hover:bg-white/18'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitch('worker')}
                className={`py-2 px-2.5 rounded-2xl text-[13px] font-semibold flex flex-col items-center justify-center gap-1.5 transition-all apple-press-spring cursor-pointer ${
                  role === 'worker'
                    ? 'bg-white text-[#1d1d1f] shadow-md font-bold'
                    : 'bg-white/10 text-white hover:bg-white/18'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Pro</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitch('admin')}
                className={`py-2 px-2.5 rounded-2xl text-[13px] font-semibold flex flex-col items-center justify-center gap-1.5 transition-all apple-press-spring cursor-pointer ${
                  role === 'admin'
                    ? 'bg-white text-[#1d1d1f] shadow-md font-bold'
                    : 'bg-white/10 text-white hover:bg-white/18'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 px-1">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Restore fresh demo dataset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Store</span>
              </button>

              {resetMessage && (
                <span className="text-[12px] text-[#34c759] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{resetMessage}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
