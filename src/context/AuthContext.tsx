import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { DEMO_PROFILES, DEMO_WORKERS } from '../lib/demoData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; user?: Profile; error?: string }>;
  quickLogin: (userType: 'customer' | 'worker' | 'admin') => void;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    locality: string;
    city: string;
    skills?: string[];
    startingRate?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kaamconnect_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    async function initAuth() {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } else {
          // Default start logged in as Customer (Priya Verma) for immediate demo ease
          const defaultUser = DEMO_PROFILES[0];
          setUser(defaultUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
        }
      } catch (err) {
        console.warn('Error loading auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, role?: UserRole): Promise<{ success: boolean; user?: Profile; error?: string }> => {
    setIsLoading(true);
    try {
      // Find matching demo profile or match by role
      let found = DEMO_PROFILES.find((p) => p.email?.toLowerCase() === email.toLowerCase());
      if (!found && role) {
        found = DEMO_PROFILES.find((p) => p.role === role);
      }
      if (!found) {
        // Create an ad-hoc profile for the email
        found = {
          id: `usr-${Date.now()}`,
          full_name: email.split('@')[0].toUpperCase(),
          email,
          phone: '+91 99887 76655',
          role: role || 'customer',
          locality: 'Indiranagar',
          city: 'Bengaluru',
          created_at: new Date().toISOString(),
        };
      }

      setUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      return { success: true, user: found };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userType: 'customer' | 'worker' | 'admin') => {
    let targetProfile: Profile | undefined;
    if (userType === 'customer') {
      targetProfile = DEMO_PROFILES.find((p) => p.id === 'cust-priya');
    } else if (userType === 'worker') {
      targetProfile = DEMO_PROFILES.find((p) => p.id === 'w-rajesh');
    } else if (userType === 'admin') {
      targetProfile = DEMO_PROFILES.find((p) => p.id === 'admin-super');
    }

    if (targetProfile) {
      setUser(targetProfile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetProfile));
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    locality: string;
    city: string;
    skills?: string[];
    startingRate?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const newUserId = `usr-${Date.now()}`;
      const newProfile: Profile = {
        id: newUserId,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        role: data.role,
        locality: data.locality,
        city: data.city || 'Bengaluru',
        created_at: new Date().toISOString(),
      };

      if (data.role === 'worker') {
        const allServices = await mockStore.getServices();
        const selectedSkills = allServices.filter((s) => data.skills?.includes(s.id));

        const newWorker = {
          ...newProfile,
          worker_id: newUserId,
          bio: 'Newly registered independent service professional.',
          experience_years: 1,
          starting_rate: data.startingRate || 400,
          service_radius_km: 10,
          latitude: 12.9716, // Bengaluru center
          longitude: 77.5946,
          availability_status: 'available' as const,
          verification_status: 'pending' as const,
          skills: selectedSkills.length ? selectedSkills : [allServices[0]],
          rating: 0,
          review_count: 0,
          completed_jobs_count: 0,
        };

        const existingWorkers = await mockStore.getWorkers();
        existingWorkers.unshift(newWorker);
        localStorage.setItem('kaamconnect_workers_v1', JSON.stringify(existingWorkers));
      }

      setUser(newProfile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        isSupabaseLive: isSupabaseConfigured,
        login,
        quickLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
