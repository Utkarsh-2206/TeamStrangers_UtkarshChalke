import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Shield, Sparkles, ArrowRight, UserCheck, Briefcase, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin, isSupabaseLive } = useAuth();
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900">
            Kaam<span className="text-teal-600">Connect</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to track your service bookings or manage incoming jobs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-3xl sm:px-10 space-y-6">
          {/* Quick Demo Switchers for Hackathon Evaluators */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant Hackathon Evaluator Login</span>
            </div>
            <p className="text-[11px] text-teal-700 leading-tight">
              Click below to test the platform immediately under different authorized roles:
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  quickLogin('customer');
                  routeByRole('customer');
                }}
                className="w-full py-2 px-3 rounded-xl bg-white border border-teal-300 hover:bg-teal-100/50 text-slate-800 text-xs font-bold flex items-center justify-between shadow-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>Customer (Priya Verma)</span>
                </div>
                <span className="text-[10px] text-teal-700 uppercase font-semibold">Indiranagar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin('worker');
                  routeByRole('worker');
                }}
                className="w-full py-2 px-3 rounded-xl bg-white border border-teal-300 hover:bg-teal-100/50 text-slate-800 text-xs font-bold flex items-center justify-between shadow-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Worker (Rajesh Electrician)</span>
                </div>
                <span className="text-[10px] text-indigo-700 uppercase font-semibold">Verified Pro</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin('admin');
                  routeByRole('admin');
                }}
                className="w-full py-2 px-3 rounded-xl bg-white border border-teal-300 hover:bg-teal-100/50 text-slate-800 text-xs font-bold flex items-center justify-between shadow-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-800" />
                  <span>Admin (Verification Desk)</span>
                </div>
                <span className="text-[10px] text-slate-700 uppercase font-semibold">Superadmin</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold">Or sign in with email</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
