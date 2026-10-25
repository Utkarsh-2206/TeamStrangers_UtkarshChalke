import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Wrench,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Briefcase,
  LayoutDashboard,
  Check,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout, quickLogin } = useAuth();
  const { theme, actualTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-3.5 z-50 px-4 sm:px-6 transition-all duration-200">
      <div className="max-w-6xl mx-auto rounded-2xl bg-white/85 dark:bg-[#121215]/85 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between h-15 px-3.5 sm:px-5">
          {/* Left Side: Brand Logo + Primary Nav Links (Uneven Clerk-Inspired Grouping) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#09090b] dark:bg-white flex items-center justify-center text-white dark:text-[#09090b] shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[18px] sm:text-[19px] tracking-tight text-[#09090b] dark:text-[#f4f4f5]">
                  Kaam<span className="text-[#6366f1] dark:text-[#818cf8]">Connect</span>
                </span>
                <span className="text-[11px] font-semibold text-[#71717a] dark:text-[#a1a1aa] bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-md border border-black/[0.04] dark:border-white/[0.06] hidden sm:inline-block">
                  Hyperlocal
                </span>
              </div>
            </Link>

            {/* Subtle Divider */}
            <div className="h-4.5 w-[1px] bg-black/[0.08] dark:bg-white/[0.1] hidden md:block" />

            {/* Main Navigation Links (Left-Aligned next to Logo, Uneven layout) */}
            <nav className="hidden md:flex items-center gap-1 text-[14px]">
              <Link
                to="/services"
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                  isActive('/services')
                    ? 'bg-black/[0.06] dark:bg-white/[0.1] text-[#09090b] dark:text-white font-semibold'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#09090b] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                }`}
              >
                Services
              </Link>
              <Link
                to="/workers"
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                  isActive('/workers')
                    ? 'bg-black/[0.06] dark:bg-white/[0.1] text-[#09090b] dark:text-white font-semibold'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#09090b] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                }`}
              >
                Specialists
              </Link>
              <Link
                to="/about-safety"
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                  isActive('/about-safety')
                    ? 'bg-black/[0.06] dark:bg-white/[0.1] text-[#09090b] dark:text-white font-semibold'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#09090b] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                }`}
              >
                Safety & Trust
              </Link>
            </nav>
          </div>

          {/* Right Side: Auth / Controls (Clerk Style) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Switcher (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-[#09090b] dark:text-[#f4f4f5] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
              title={actualTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme appearance"
            >
              {actualTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#ffd60a]" />
              ) : (
                <Moon className="w-4 h-4 text-[#09090b]" />
              )}
            </button>

            {/* Persona Switcher (Clerk Style Badge, Strictly NO Dots) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-[#09090b] dark:text-[#f4f4f5] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
                title="Switch persona"
              >
                <User className="w-3.5 h-3.5 text-[#6366f1] dark:text-[#818cf8]" />
                <span className="text-[#71717a] dark:text-[#a1a1aa]">Role:</span>
                <span className="font-semibold capitalize text-[#09090b] dark:text-[#f4f4f5]">{role || 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717a] dark:text-[#a1a1aa]" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-2xl shadow-2xl border border-black/[0.08] dark:border-white/[0.12] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold text-[#71717a] dark:text-[#a1a1aa] tracking-wider uppercase">
                    Interactive Persona Switcher
                  </div>
                  <button
                    onClick={() => {
                      quickLogin('customer');
                      setDemoDropdownOpen(false);
                      navigate('/customer/dashboard');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] transition-colors flex items-center justify-between cursor-pointer ${
                      role === 'customer'
                        ? 'bg-[#6366f1]/10 dark:bg-[#6366f1]/20 text-[#6366f1] dark:text-[#818cf8] font-semibold'
                        : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#09090b] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Customer (Priya)</p>
                      <p className="text-[12px] text-[#71717a] dark:text-[#a1a1aa]">Browse, book & negotiate</p>
                    </div>
                    {role === 'customer' && <Check className="w-4 h-4 text-[#6366f1] dark:text-[#818cf8]" />}
                  </button>
                  <button
                    onClick={() => {
                      quickLogin('worker');
                      setDemoDropdownOpen(false);
                      navigate('/worker/dashboard');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] transition-colors flex items-center justify-between cursor-pointer ${
                      role === 'worker'
                        ? 'bg-[#6366f1]/10 dark:bg-[#6366f1]/20 text-[#6366f1] dark:text-[#818cf8] font-semibold'
                        : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#09090b] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Specialist (Rajesh)</p>
                      <p className="text-[12px] text-[#71717a] dark:text-[#a1a1aa]">Accept jobs & counteroffers</p>
                    </div>
                    {role === 'worker' && <Check className="w-4 h-4 text-[#6366f1] dark:text-[#818cf8]" />}
                  </button>
                  <button
                    onClick={() => {
                      quickLogin('admin');
                      setDemoDropdownOpen(false);
                      navigate('/admin/dashboard');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] transition-colors flex items-center justify-between cursor-pointer ${
                      role === 'admin'
                        ? 'bg-[#6366f1]/10 dark:bg-[#6366f1]/20 text-[#6366f1] dark:text-[#818cf8] font-semibold'
                        : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#09090b] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Admin Desk</p>
                      <p className="text-[12px] text-[#71717a] dark:text-[#a1a1aa]">Verify IDs & resolve disputes</p>
                    </div>
                    {role === 'admin' && <Check className="w-4 h-4 text-[#6366f1] dark:text-[#818cf8]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Link Based on Current Role (Clerk-style Button) */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs transition-all duration-150"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Customer Portal</span>
                  </Link>
                )}
                {role === 'worker' && (
                  <Link
                    to="/worker/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs transition-all duration-150"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Specialist Portal</span>
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs transition-all duration-150"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-[14px] font-medium text-[#09090b] dark:text-[#f4f4f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button & theme button */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#09090b] dark:text-[#f4f4f5] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle theme"
            >
              {actualTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#ffd60a]" />
              ) : (
                <Moon className="w-5 h-5 text-[#09090b]" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#09090b] dark:text-[#f4f4f5] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-[#121215]/95 backdrop-blur-xl px-5 pt-4 pb-7 space-y-4 rounded-b-2xl">
          <div className="grid grid-cols-2 gap-2.5 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <button
              onClick={() => {
                quickLogin('customer');
                setMobileMenuOpen(false);
                navigate('/customer/dashboard');
              }}
              className="px-3.5 py-2.5 text-[13px] font-semibold rounded-xl bg-black/[0.04] dark:bg-white/[0.08] text-[#09090b] dark:text-[#f4f4f5] text-center"
            >
              Customer Demo
            </button>
            <button
              onClick={() => {
                quickLogin('worker');
                setMobileMenuOpen(false);
                navigate('/worker/dashboard');
              }}
              className="px-3.5 py-2.5 text-[13px] font-semibold rounded-xl bg-black/[0.04] dark:bg-white/[0.08] text-[#09090b] dark:text-[#f4f4f5] text-center"
            >
              Specialist Demo
            </button>
          </div>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-[16px] font-semibold text-[#09090b] dark:text-[#f4f4f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
          >
            Services Catalog
          </Link>
          <Link
            to="/workers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-[16px] font-semibold text-[#09090b] dark:text-[#f4f4f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
          >
            Specialists & Map
          </Link>
          <Link
            to="/about-safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-[16px] font-semibold text-[#09090b] dark:text-[#f4f4f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
          >
            Safety & Verification
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
              <Link
                to={
                  role === 'customer'
                    ? '/customer/dashboard'
                    : role === 'worker'
                    ? '/worker/dashboard'
                    : '/admin/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center text-[15px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl shadow-xs"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="block w-full py-2.5 text-center text-[14px] font-medium text-rose-500"
              >
                Sign Out ({user?.full_name})
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-3 text-center text-[14px] font-semibold text-[#09090b] dark:text-[#f4f4f5] bg-black/[0.04] dark:bg-white/[0.08] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-3 text-center text-[14px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
