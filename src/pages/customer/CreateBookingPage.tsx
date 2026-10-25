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
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  BadgeCheck,
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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-apple-fade-up">
        <Link
          to="/workers"
          className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Specialist Directory</span>
        </Link>

        {/* Apple Segmented Step Indicator */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-[13px] sm:text-[14px] font-semibold">
          <div className="py-3 px-4 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-xs">
            1. Trade & Pro
          </div>
          <div className="py-3 px-4 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]">
            2. Scope & Time
          </div>
          <div className="py-3 px-4 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]">
            3. Price Proposal
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-10 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
              <ShieldCheck className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
              <span>Two-Way Negotiation Protocol • 0% Worker Commission</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Create Service Request
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#86868b] dark:text-[#98989d] mt-2 leading-relaxed">
              Define the problem scope, schedule your preferred visit slot, and propose a fair price.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] text-[14px] font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Specialist & Service Trade */}
            <div className="p-6 rounded-[24px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] space-y-5">
              <h2 className="text-[14px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
                1. Professional & Trade Service
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Assigned Specialist
                  </label>
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
                    className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  >
                    <option value="">Select a Specialist</option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id} className="dark:bg-[#1c1c1e]">
                        {w.full_name} ({w.locality} • Starting ₹{w.starting_rate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Service Category
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                    className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="dark:bg-[#1c1c1e]">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Worker Mini Apple Pass */}
              {selectedWorker && (
                <div className="p-4.5 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={selectedWorker.avatar_url}
                      alt={selectedWorker.full_name}
                      className="w-13 h-13 rounded-full object-cover border border-black/[0.06] dark:border-white/[0.08]"
                    />
                    <div>
                      <div className="font-bold text-[16px] text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                        <span>{selectedWorker.full_name}</span>
                        <BadgeCheck className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
                      </div>
                      <div className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d] mt-0.5">
                        {selectedWorker.locality} • Starting Quote: <strong className="text-[#1d1d1f] dark:text-white font-bold">₹{selectedWorker.starting_rate}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-[#ff9500] dark:text-[#ffd60a] bg-[#ff9500]/10 px-3 py-1 rounded-full">
                    ★ {selectedWorker.rating ? selectedWorker.rating.toFixed(1) : 'New'}
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Scope & Schedule */}
            <div className="p-6 rounded-[24px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] space-y-5">
              <h2 className="text-[14px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
                2. Job Scope & Location Details
              </h2>

              <div>
                <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  Describe the Issue or Tasks Required
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. Master bedroom ceiling fan making loud humming noise and switchboard sparking. Also need 1 new socket installed."
                  required
                  className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-4 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Service Address
                  </label>
                  <input
                    type="text"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    placeholder="Flat 402, Green Palms, 12th Main"
                    required
                    className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Locality
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
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
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                    Preferred Time Slot
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-3.5 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
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
            <div className="p-6 rounded-[24px] bg-[#f5f5f7] dark:bg-[#242426] border border-black/[0.04] dark:border-white/[0.06] space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
                  3. Transparent Price Proposal
                </h2>
                <span className="text-[13px] font-bold text-[#34c759]">₹0 Platform Commission</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[14px] font-bold text-[#1d1d1f] dark:text-white">Your Proposed Price</label>
                    <span className="text-2xl font-bold text-[#0071e3] dark:text-[#0a84ff]">₹{proposedPrice}</span>
                  </div>
                  <input
                    type="number"
                    min="150"
                    max="10000"
                    step="50"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    required
                    className="w-full text-[17px] font-bold bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-3 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setProposedPrice(proposedPrice + 50)}
                      className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[13px] font-bold text-[#1d1d1f] dark:text-white apple-press-spring cursor-pointer"
                    >
                      +₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setProposedPrice(proposedPrice + 100)}
                      className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[13px] font-bold text-[#1d1d1f] dark:text-white apple-press-spring cursor-pointer"
                    >
                      +₹100
                    </button>
                    {selectedWorker && (
                      <button
                        type="button"
                        onClick={() => setProposedPrice(selectedWorker.starting_rate)}
                        className="px-3 py-1.5 rounded-xl bg-[#0071e3]/10 dark:bg-[#0a84ff]/20 text-[13px] font-bold text-[#0071e3] dark:text-[#0a84ff] ml-auto apple-press-spring cursor-pointer"
                      >
                        Reset (₹{selectedWorker.starting_rate})
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1e] p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[14px] font-bold text-[#1d1d1f] dark:text-white">Maximum Budget Limit</label>
                    <span className="text-2xl font-bold text-[#1d1d1f] dark:text-white">₹{customerBudget}</span>
                  </div>
                  <input
                    type="number"
                    min={proposedPrice}
                    max="15000"
                    step="50"
                    value={customerBudget}
                    onChange={(e) => setCustomerBudget(Number(e.target.value))}
                    required
                    className="w-full text-[17px] font-bold bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-3 text-[#1d1d1f] dark:text-white focus:outline-[#0071e3]"
                  />
                  <p className="text-[13px] text-[#86868b] dark:text-[#98989d]">
                    Your absolute maximum spending limit if work requires unexpected materials.
                  </p>
                </div>
              </div>

              {/* Dynamic Guidance Note */}
              <div
                className={`p-4 rounded-2xl border text-[14px] font-medium flex items-center gap-3 ${
                  offerDifference >= 0
                    ? 'bg-[#34c759]/10 border-[#34c759]/20 text-[#34c759]'
                    : 'bg-[#ff9500]/10 border-[#ff9500]/20 text-[#ff9500]'
                }`}
              >
                <Sparkles className="w-5 h-5 shrink-0" />
                <span>
                  {offerDifference >= 0
                    ? `Your proposed price matches or exceeds worker's base quote (₹${selectedWorker?.starting_rate || 450}). High probability of instant acceptance!`
                    : `Your proposed price is ₹${Math.abs(offerDifference)} below the base quote. The professional may propose a minor counteroffer.`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] text-white font-semibold text-[16px] tracking-tight transition-all apple-press-spring flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Send Booking Request & Proposed Price'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
