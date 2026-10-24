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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900">
            Kaam<span className="text-teal-600">Connect</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Join the hyperlocal network that connects skilled local professionals and households.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-3xl sm:px-10 space-y-6">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">I want to:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  role === 'customer'
                    ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <UserCheck className={`w-5 h-5 ${role === 'customer' ? 'text-teal-600' : 'text-slate-400'}`} />
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900">Hire Services</div>
                  <div className="text-[11px] text-slate-500">Find local skilled workers</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  role === 'worker'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <Briefcase className={`w-5 h-5 ${role === 'worker' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900">Work & Earn</div>
                  <div className="text-[11px] text-slate-500">Provide services directly</div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Neighborhood</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 text-slate-900"
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
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Your Services & Skills (Tap to select)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                    {DEMO_SERVICES.map((s) => {
                      const isSelected = selectedSkills.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleToggleSkill(s.id)}
                          className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-teal-50 border-teal-500 text-teal-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Starting Base Rate Quote</label>
                    <span className="text-xs font-extrabold text-teal-700">₹{startingRate}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1200"
                    step="50"
                    value={startingRate}
                    onChange={(e) => setStartingRate(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can always propose customized counteroffers for specific bookings.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
