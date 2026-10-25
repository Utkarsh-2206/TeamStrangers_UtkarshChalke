import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { DEMO_SERVICES } from '../lib/demoData';
import { Wrench, Shield, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Indiranagar');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([DEMO_SERVICES[0].id]);
  const [startingRate, setStartingRate] = useState<number>(400);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
      }
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const result = await register({
      fullName,
      email,
      phone,
      role,
      locality,
      city: 'Bengaluru',
      skills: role === 'worker' ? selectedSkills : undefined,
      startingRate: role === 'worker' ? startingRate : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      if (role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f5f7] dark:bg-[#000000] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-250">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3 animate-apple-fade-up">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] dark:bg-white flex items-center justify-center text-white dark:text-[#1d1d1f] shadow-md group-hover:scale-105 transition-transform duration-200">
            <Wrench className="w-6 h-6 apple-symbol-bounce" />
          </div>
          <span className="font-bold text-2xl sm:text-3xl text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Kaam<span className="text-[#0071e3] dark:text-[#0a84ff]">Connect</span>
          </span>
        </Link>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
          Create Your Account
        </h2>
        <p className="text-[16px] text-[#86868b] dark:text-[#98989d]">
          Join the direct network connecting verified tradespeople with urban households.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg animate-apple-fade-up delay-stagger-1">
        <div className="bg-white dark:bg-[#1c1c1e] py-8 px-6 sm:px-10 rounded-3xl shadow-sm border border-black/[0.08] dark:border-white/[0.1] space-y-6">
          {/* Role selector */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2.5">
              Select your primary intent:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all apple-press-spring cursor-pointer ${
                  role === 'customer'
                    ? 'border-[#0071e3] dark:border-[#0a84ff] bg-[#0071e3]/[0.06] dark:bg-[#0a84ff]/[0.12] ring-2 ring-[#0071e3]/20 dark:ring-[#0a84ff]/30'
                    : 'border-black/[0.08] dark:border-white/[0.1] hover:border-black/[0.15] dark:hover:border-white/[0.2] bg-black/[0.02] dark:bg-white/[0.04]'
                }`}
              >
                <UserCheck className={`w-6 h-6 ${role === 'customer' ? 'text-[#0071e3] dark:text-[#0a84ff]' : 'text-[#86868b] dark:text-[#98989d]'}`} />
                <div className="mt-3">
                  <div className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Hire Services</div>
                  <div className="text-[13px] text-[#86868b] dark:text-[#98989d]">Book trusted professionals</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all apple-press-spring cursor-pointer ${
                  role === 'worker'
                    ? 'border-[#0071e3] dark:border-[#0a84ff] bg-[#0071e3]/[0.06] dark:bg-[#0a84ff]/[0.12] ring-2 ring-[#0071e3]/20 dark:ring-[#0a84ff]/30'
                    : 'border-black/[0.08] dark:border-white/[0.1] hover:border-black/[0.15] dark:hover:border-white/[0.2] bg-black/[0.02] dark:bg-white/[0.04]'
                }`}
              >
                <Briefcase className={`w-6 h-6 ${role === 'worker' ? 'text-[#0071e3] dark:text-[#0a84ff]' : 'text-[#86868b] dark:text-[#98989d]'}`} />
                <div className="mt-3">
                  <div className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Provide Services</div>
                  <div className="text-[13px] text-[#86868b] dark:text-[#98989d]">Direct quotes, 0% fee</div>
                </div>
              </button>
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
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="w-full px-4 py-3 text-[16px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.15] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  required
                  className="w-full px-4 py-3 text-[16px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.15] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  required
                  className="w-full px-4 py-3 text-[16px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.15] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
                Locality / Area
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-4 py-3 text-[16px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.15] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all cursor-pointer"
              >
                <option value="Indiranagar">Indiranagar, Bengaluru</option>
                <option value="Koramangala">Koramangala, Bengaluru</option>
                <option value="HSR Layout">HSR Layout, Bengaluru</option>
                <option value="JP Nagar">JP Nagar, Bengaluru</option>
                <option value="Whitefield">Whitefield, Bengaluru</option>
                <option value="Jayanagar">Jayanagar, Bengaluru</option>
                <option value="Bellandur">Bellandur, Bengaluru</option>
                <option value="Marathahalli">Marathahalli, Bengaluru</option>
                <option value="Malleshwaram">Malleshwaram, Bengaluru</option>
                <option value="BTM Layout">BTM Layout, Bengaluru</option>
              </select>
            </div>

            {/* Worker-Specific Attributes */}
            {role === 'worker' && (
              <div className="pt-4 border-t border-black/[0.08] dark:border-white/[0.1] space-y-4 animate-apple-fade-up">
                <div>
                  <label className="block text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Select Your Services (Tap to toggle)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                    {DEMO_SERVICES.map((s) => {
                      const isSelected = selectedSkills.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleToggleSkill(s.id)}
                          className={`p-2.5 rounded-xl text-left text-[14px] font-medium border transition-all apple-press-spring cursor-pointer ${
                            isSelected
                              ? 'bg-[#0071e3]/10 dark:bg-[#0a84ff]/20 border-[#0071e3] dark:border-[#0a84ff] text-[#0071e3] dark:text-[#0a84ff] font-semibold'
                              : 'bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.1] text-[#515154] dark:text-[#a1a1a6]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Starting Base Rate
                    </label>
                    <span className="text-xl font-bold text-[#0071e3] dark:text-[#0a84ff]">
                      ₹{startingRate}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1200"
                    step="50"
                    value={startingRate}
                    onChange={(e) => setStartingRate(Number(e.target.value))}
                    className="w-full accent-[#0071e3] dark:accent-[#0a84ff] cursor-pointer h-2 bg-black/[0.1] dark:bg-white/[0.15] rounded-lg"
                  />
                  <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">
                    Customers see this baseline quote and can negotiate or counteroffer.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[15px] shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer apple-press-spring"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-[14px] text-[#86868b] dark:text-[#98989d] pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
