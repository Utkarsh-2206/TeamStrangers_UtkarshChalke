import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../lib/mockStore';
import { WorkerProfile, Service } from '../../types';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { validatePriceOffer } from '../../utils/bookingRules';

export const CreateBookingPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workerId || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedService);

  const [jobDescription, setJobDescription] = useState('');
  const [serviceAddress, setServiceAddress] = useState(
    user?.locality ? `Flat 402, Green Palms, 12th Main, ${user.locality}` : ''
  );
  const [locality, setLocality] = useState(user?.locality || 'Indiranagar');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('11:00');
  const [customerBudget, setCustomerBudget] = useState<number>(550);
  const [proposedPrice, setProposedPrice] = useState<number>(450);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const [wList, sList] = await Promise.all([mockStore.getWorkers(), mockStore.getServices()]);
      setWorkers(wList);
      setServices(sList);

      if (workerId) {
        setSelectedWorkerId(workerId);
        const w = wList.find((item) => item.id === workerId);
        if (w) {
          if (w.skills.length > 0 && !preselectedService) {
            setSelectedServiceId(w.skills[0].id);
          }
          setProposedPrice(w.starting_rate || 450);
          setCustomerBudget((w.starting_rate || 450) + 100);
        }
      }
    }
    loadData();
  }, [workerId, preselectedService]);

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
  const selectedService = services.find((s) => s.id === selectedServiceId);

  // Dynamic feedback on offer vs worker base rate
  const offerDifference = selectedWorker ? proposedPrice - selectedWorker.starting_rate : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId || !selectedServiceId) {
      setError('Please select a service and an assigned professional.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please describe the work needed.');
      return;
    }
    if (!serviceAddress.trim()) {
      setError('Please provide a complete service address.');
      return;
    }

    const priceCheck = validatePriceOffer(proposedPrice);
    if (!priceCheck.valid) {
      setError(priceCheck.error || 'Invalid proposed price.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

      const newBooking = await mockStore.createBooking({
        customer_id: user?.id || 'cust-priya',
        customer_name: user?.full_name || 'Priya Verma',
        customer_phone: user?.phone || '+91 98765 11223',
        worker_id: selectedWorkerId,
        worker_name: selectedWorker?.full_name || 'Service Professional',
        worker_phone: selectedWorker?.phone || '+91 98765 00000',
        worker_starting_rate: selectedWorker?.starting_rate || 450,
        worker_avatar: selectedWorker?.avatar_url,
        service_id: selectedServiceId,
        service_name: selectedService?.name || 'Home Service',
        job_description: jobDescription,
        service_address: serviceAddress,
        locality: locality,
        latitude: selectedWorker?.latitude,
        longitude: selectedWorker?.longitude,
        scheduled_at: scheduledDateTime,
        customer_budget: customerBudget,
        proposed_price: proposedPrice,
      });

      navigate(`/booking/${newBooking.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/workers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Worker Discovery</span>
        </Link>

        {/* Stepper Header */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-xs">
            1. Select Trade
          </div>
          <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-xs">
            2. Scope & Time
          </div>
          <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-xs">
            3. Propose Price
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Transparent Price Proposal Protocol</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Service Booking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Specify your schedule, job details, and proposed price. The professional can accept directly or provide an itemized counteroffer.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Worker & Service Selection */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Professional & Service Trade
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Professional</label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => {
                      setSelectedWorkerId(e.target.value);
                      const w = workers.find((item) => item.id === e.target.value);
                      if (w) {
                        setProposedPrice(w.starting_rate || 450);
                        setCustomerBudget((w.starting_rate || 450) + 100);
                      }
                    }}
                    required
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  >
                    <option value="">Select a Professional</option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.full_name} ({w.locality} • Base ₹{w.starting_rate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Category</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Worker Mini Banner */}
              {selectedWorker && (
                <div className="p-3.5 rounded-2xl bg-white border border-teal-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedWorker.avatar_url}
                      alt={selectedWorker.full_name}
                      className="w-11 h-11 rounded-xl object-cover border border-teal-300"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{selectedWorker.full_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {selectedWorker.locality} • Base Quote: <strong className="text-teal-800">₹{selectedWorker.starting_rate}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    ★ {selectedWorker.rating ? selectedWorker.rating.toFixed(1) : 'New'}
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Job Details & Schedule */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Job Scope & Location Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe the Issue or Tasks Required
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. Master bedroom ceiling fan making loud noise and switchboard sparking. Also need 1 new power point."
                  required
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">House / Flat Address</label>
                  <input
                    type="text"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    placeholder="Flat 402, Green Palms, 12th Main"
                    required
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500"
                  >
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Koramangala">Koramangala</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="JP Nagar">JP Nagar</option>
                    <option value="Whitefield">Whitefield</option>
                    <option value="Jayanagar">Jayanagar</option>
                    <option value="Bellandur">Bellandur</option>
                    <option value="Marathahalli">Marathahalli</option>
                    <option value="Malleshwaram">Malleshwaram</option>
                    <option value="BTM Layout">BTM Layout</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-teal-500 font-medium"
                  >
                    <option value="09:00">09:00 AM - Morning Slot</option>
                    <option value="11:00">11:00 AM - Mid-Day Slot</option>
                    <option value="14:00">02:00 PM - Afternoon Slot</option>
                    <option value="16:30">04:30 PM - Evening Slot</option>
                    <option value="18:30">06:30 PM - Post-Office Slot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Transparent Price Proposal */}
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  3. Transparent Price Proposal
                </h3>
                <span className="text-[11px] font-bold text-teal-700">Zero Commission Deducted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Your Proposed Price</label>
                    <span className="text-base font-extrabold text-teal-800">₹{proposedPrice}</span>
                  </div>
                  <input
                    type="number"
                    min="150"
                    max="10000"
                    step="50"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    required
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-extrabold focus:outline-teal-500"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setProposedPrice(proposedPrice + 50)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      +₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setProposedPrice(proposedPrice + 100)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      +₹100
                    </button>
                    {selectedWorker && (
                      <button
                        type="button"
                        onClick={() => setProposedPrice(selectedWorker.starting_rate)}
                        className="px-2 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-[10px] font-bold text-teal-800 ml-auto"
                      >
                        Reset to Base (₹{selectedWorker.starting_rate})
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Maximum Budget Limit</label>
                    <span className="text-base font-extrabold text-slate-800">₹{customerBudget}</span>
                  </div>
                  <input
                    type="number"
                    min={proposedPrice}
                    max="15000"
                    step="50"
                    value={customerBudget}
                    onChange={(e) => setCustomerBudget(Number(e.target.value))}
                    required
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-extrabold focus:outline-teal-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Your spending cap if the worker counters for complex repairs.
                  </p>
                </div>
              </div>

              {/* Dynamic Guidance Note */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  offerDifference >= 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {offerDifference >= 0
                    ? `Your proposed price matches or exceeds worker's base quote (₹${selectedWorker?.starting_rate || 450}). High probability of instant acceptance!`
                    : `Your proposed price is ₹${Math.abs(offerDifference)} below the base quote. The professional may accept or propose a minor counteroffer.`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 hover:scale-101 cursor-pointer"
            >
              <span>{isSubmitting ? 'Submitting Request...' : 'Send Booking Request & Proposed Price'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
