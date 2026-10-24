import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UserCheck,
  Briefcase,
  Shield,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
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
    setResetMessage('Data restored!');
    setTimeout(() => setResetMessage(null), 2500);
  };

  return (
    <aside
      aria-label="Hackathon Evaluator Quick Switcher"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto shadow-2xl rounded-2xl transition-all"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-3 shadow-xl space-y-2">
        {/* Header Toggle */}
        <div className="flex items-center justify-between gap-3 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-white tracking-wide flex items-center gap-1.5">
                <span>Judge Quick Switcher</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-[10px] text-slate-400">
                Active:{' '}
                <strong className="text-teal-300 capitalize">
                  {user?.full_name || role || 'Guest'}
                </strong>{' '}
                ({role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 hover:text-white">
            <span className="text-[10px] uppercase font-bold sm:inline hidden">
              {isExpanded ? 'Hide' : 'Quick Switch'}
            </span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>

        {/* Expandable Persona Selector */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-800 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSwitch('customer')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'customer'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitch('worker')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'worker'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Worker</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitch('admin')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-400 font-semibold transition-colors"
                title="Restore fresh demo dataset"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Seed</span>
              </button>

              {resetMessage && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
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
