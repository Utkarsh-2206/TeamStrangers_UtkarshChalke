import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Shield, Sparkles, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const routeByRole = (userRole?: string) => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    if (userRole === 'worker') {
      navigate('/worker/dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const result = await login(email);
    setIsSubmitting(false);

    if (result.success && result.user) {
      routeByRole(result.user.role);
    } else {
      setError(result.error || 'Failed to sign in.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f5f7] dark:bg-[#000000] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-250">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 animate-apple-fade-up">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] dark:bg-white flex items-center justify-center text-white dark:text-[#1d1d1f] shadow-md group-hover:scale-105 transition-transform duration-200">
            <Wrench className="w-6 h-6 apple-symbol-bounce" />
          </div>
          <span className="font-bold text-2xl sm:text-3xl text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Kaam<span className="text-[#0071e3] dark:text-[#0a84ff]">Connect</span>
          </span>
        </Link>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
          Welcome back
        </h2>
        <p className="text-[16px] text-[#86868b] dark:text-[#98989d]">
          Sign in to track service bookings or manage incoming jobs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-apple-fade-up delay-stagger-1">
        <div className="bg-white dark:bg-[#1c1c1e] py-8 px-6 sm:px-10 rounded-3xl shadow-sm border border-black/[0.08] dark:border-white/[0.1] space-y-6">
          {/* Quick Demo Switchers for Hackathon Evaluators */}
          <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              <Sparkles className="w-4 h-4 text-[#ff9500] dark:text-[#ffd60a]" />
              <span>Instant Evaluator Login</span>
            </div>
            <p className="text-[13px] text-[#86868b] dark:text-[#98989d] leading-relaxed">
              Tap below to experience the platform immediately under different verified roles:
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  quickLogin('customer');
                  routeByRole('customer');
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-[#2c2c2e] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] text-[14px] font-semibold flex items-center justify-between transition-all apple-press-spring cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
                  <span>Customer (Priya Verma)</span>
                </div>
                <span className="text-[12px] font-medium text-[#86868b] dark:text-[#98989d]">Indiranagar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin('worker');
                  routeByRole('worker');
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-[#2c2c2e] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] text-[14px] font-semibold flex items-center justify-between transition-all apple-press-spring cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#34c759]" />
                  <span>Specialist (Rajesh Pro)</span>
                </div>
                <span className="text-[12px] font-medium text-[#34c759]">Verified</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin('admin');
                  routeByRole('admin');
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-[#2c2c2e] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] text-[14px] font-semibold flex items-center justify-between transition-all apple-press-spring cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#ff9500]" />
                  <span>Admin Verification Desk</span>
                </div>
                <span className="text-[12px] font-medium text-[#ff9500]">Superadmin</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.08] dark:border-white/[0.1]" />
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="bg-white dark:bg-[#1c1c1e] px-3 text-[#86868b] dark:text-[#98989d] font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 text-[16px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.15] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all"
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-[16px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.15] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[15px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer apple-press-spring"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-[14px] text-[#86868b] dark:text-[#98989d] pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
