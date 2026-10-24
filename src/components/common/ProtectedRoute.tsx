import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isAuthenticated, isLoading, quickLogin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If role is specified and does not match
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const requiredRole = allowedRoles[0];

    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Role Permission Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This area requires <strong>{requiredRole.toUpperCase()}</strong> permissions. You are currently logged in as a <strong>{role.toUpperCase()}</strong> ({user.full_name}).
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => quickLogin(requiredRole)}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Switch to {requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} Demo Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <NavigateToOwnDashboard currentRole={role} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const NavigateToOwnDashboard: React.FC<{ currentRole: UserRole }> = ({ currentRole }) => {
  const target =
    currentRole === 'worker'
      ? '/worker/dashboard'
      : currentRole === 'admin'
      ? '/admin/dashboard'
      : '/customer/dashboard';

  return (
    <a
      href={target}
      className="block text-xs font-bold text-slate-500 hover:text-slate-800 py-1.5 transition-colors"
    >
      Return to My {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
    </a>
  );
};
