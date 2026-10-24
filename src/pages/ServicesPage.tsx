import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Wrench,
  Hammer,
  Sparkles,
  Paintbrush,
  Cpu,
  Utensils,
  Home,
  Flower2,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Clock,
  HelpCircle,
  X,
} from 'lucide-react';
import { DEMO_SERVICES } from '../lib/demoData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  Wrench: <Wrench className="w-6 h-6 text-sky-500" />,
  Hammer: <Hammer className="w-6 h-6 text-orange-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-teal-500" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-indigo-500" />,
  Cpu: <Cpu className="w-6 h-6 text-blue-500" />,
  Utensils: <Utensils className="w-6 h-6 text-emerald-500" />,
  Home: <Home className="w-6 h-6 text-rose-500" />,
  Flower2: <Flower2 className="w-6 h-6 text-green-500" />,
  Truck: <Truck className="w-6 h-6 text-violet-500" />,
};

export const ServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(DEMO_SERVICES.map((s) => s.category)));
    return ['All', ...cats];
  }, []);

  const filteredServices = useMemo(() => {
    return DEMO_SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.popular_tasks?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Standardized Trade Catalog & Transparent Base Estimates</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Essential Household Services
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Find licensed and verified local blue-collar professionals with zero middleman fee inflation. Propose your budget and negotiate directly with nearby providers.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, tasks, wiring..."
              className="w-full pl-10 pr-9 py-2.5 text-xs font-medium bg-white border border-slate-200 rounded-2xl shadow-xs focus:outline-teal-500 text-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-teal-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Services Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any service matching "<strong>{searchQuery}</strong>". Try clearing your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {ICON_MAP[service.icon_name] || <Wrench className="w-6 h-6 text-teal-600" />}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Base Starting Rate
                      </span>
                      <span className="text-xl font-extrabold text-teal-800">
                        ₹{service.base_price_estimate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                      {service.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>&lt; 30m response</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors mt-1.5">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 mb-4">
                    {service.description}
                  </p>

                  {/* Popular Tasks */}
                  {service.popular_tasks && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Common Neighborhood Jobs
                      </span>
                      {service.popular_tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={`/workers?service=${service.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors group-hover:shadow-md"
                  >
                    <span>Find {service.name} Pros</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
