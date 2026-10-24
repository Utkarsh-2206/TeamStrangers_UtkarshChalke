import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Briefcase,
  Layers,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Kaam<span className="text-teal-600">Connect</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">
                  National MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5 font-medium">
                Local Skills • Fair Opportunities
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/services"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/services')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Services Catalog
            </Link>
            <Link
              to="/workers"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/workers')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Nearby Pros</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </Link>
            <Link
              to="/about-safety"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${
                isActive('/about-safety')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safety & Trust</span>
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Hackathon Demo Persona Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                title="Switch demo persona for testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Role:{' '}
                  <strong className="text-teal-700 capitalize">
                    {role || 'Guest'}
                  </strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Hackathon Personas
                  </div>
                  <button
                    onClick={() => {
                      quickLogin('customer');
                      setDemoDropdownOpen(false);
                      navigate('/customer/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Customer (Priya Verma)</p>
                      <p className="text-[11px] text-slate-500">Book services & negotiate rates</p>
                    </div>
                    {role === 'customer' && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      quickLogin('worker');
                      setDemoDropdownOpen(false);
                      navigate('/worker/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Worker (Rajesh Electrician)</p>
                      <p className="text-[11px] text-slate-500">Counteroffer & complete jobs</p>
                    </div>
                    {role === 'worker' && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      quickLogin('admin');
                      setDemoDropdownOpen(false);
                      navigate('/admin/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Admin (Verification Desk)</p>
                      <p className="text-[11px] text-slate-500">Approve IDs & resolve disputes</p>
                    </div>
                    {role === 'admin' && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Link Based on Current Role */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Customer Portal</span>
                  </Link>
                )}
                {role === 'worker' && (
                  <Link
                    to="/worker/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Worker Portal</span>
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
                >
                  Join as Pro
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => {
                quickLogin('customer');
                setMobileMenuOpen(false);
                navigate('/customer/dashboard');
              }}
              className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 text-center"
            >
              Customer Demo
            </button>
            <button
              onClick={() => {
                quickLogin('worker');
                setMobileMenuOpen(false);
                navigate('/worker/dashboard');
              }}
              className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-800 text-center"
            >
              Worker Demo
            </button>
          </div>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Services Catalog
          </Link>
          <Link
            to="/workers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Find Nearby Workers (Map)
          </Link>
          <Link
            to="/about-safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Safety & Verification
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={
                  role === 'customer'
                    ? '/customer/dashboard'
                    : role === 'worker'
                    ? '/worker/dashboard'
                    : '/admin/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-bold text-white bg-teal-600 rounded-xl"
              >
                Go to {role?.toUpperCase()} Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="block w-full py-2 text-center text-sm font-semibold text-rose-600"
              >
                Sign Out ({user?.full_name})
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-sm font-bold text-white bg-teal-600 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
