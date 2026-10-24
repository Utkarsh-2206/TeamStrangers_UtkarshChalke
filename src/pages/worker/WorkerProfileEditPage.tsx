import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { WorkerProfile } from '../../types';
import { ArrowLeft, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export const WorkerProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [startingRate, setStartingRate] = useState<number>(450);
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(10);
  const [locality, setLocality] = useState('Indiranagar');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadWorker() {
      const workerId = user?.id || 'w-rajesh';
      const w = await mockStore.getWorkerById(workerId);
      if (w) {
        setWorker(w);
        setBio(w.bio || '');
        setExperienceYears(w.experience_years || 5);
        setStartingRate(w.starting_rate || 450);
        setServiceRadiusKm(w.service_radius_km || 10);
        setLocality(w.locality || 'Indiranagar');
      }
    }
    loadWorker();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;

    await mockStore.updateWorkerProfile(worker.id, {
      bio,
      experience_years: experienceYears,
      starting_rate: startingRate,
      service_radius_km: serviceRadiusKm,
      locality,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/worker/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Worker Portal</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Manage Profile & Pricing
              </h1>
              <p className="text-xs text-slate-500">
                Update your professional quote rates, service radius and description
              </p>
            </div>
            <ShieldCheck className="w-6 h-6 text-teal-600" />
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile preferences updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Starting Base Rate Quote (₹)
                </label>
                <input
                  type="number"
                  min="200"
                  max="5000"
                  step="50"
                  value={startingRate}
                  onChange={(e) => setStartingRate(Number(e.target.value))}
                  required
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  required
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Radius (km)
                </label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={serviceRadiusKm}
                  onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                  required
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Home Locality</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
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
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Updates</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
