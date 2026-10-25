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
  Check,
  Search,
  Clock,
  X,
  ChevronRight,
} from 'lucide-react';
import { DEMO_SERVICES } from '../lib/demoData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Hammer: <Hammer className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Paintbrush: <Paintbrush className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Utensils: <Utensils className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Flower2: <Flower2 className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] py-12 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-apple-fade-up">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] text-[13px] font-semibold border border-black/[0.06] dark:border-white/[0.08]">
              <Wrench className="w-3.5 h-3.5 text-[#6366f1] dark:text-[#818cf8]" />
              <span>Transparent Base Estimates • Verified Specialists</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Trade Services Directory
            </h1>
            <p className="text-[15px] sm:text-[17px] text-[#86868b] dark:text-[#98989d] leading-relaxed">
              Browse licensed and verified independent tradespeople with zero middleman fee inflation. Propose your budget and negotiate directly with nearby providers.
            </p>
          </div>

          {/* Apple Spotlight Search Input */}
          <div className="w-full md:w-88 relative">
            <Search className="w-4.5 h-4.5 text-[#86868b] absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, tasks, wiring..."
              className="w-full pl-11 pr-10 py-3 text-[15px] font-medium bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-full shadow-xs focus:outline-[#0071e3] text-[#1d1d1f] dark:text-white placeholder-[#86868b]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Apple Category Capsule Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all apple-press-spring cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-xs'
                  : 'bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-16 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-white">No Services Found</h3>
            <p className="text-[15px] text-[#86868b] dark:text-[#98989d] max-w-sm mx-auto leading-relaxed">
              We couldn't find any service matching "<strong>{searchQuery}</strong>". Try clearing your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-6 py-3 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[14px] font-semibold hover:bg-[#333336] transition-colors apple-press-spring cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-[#1c1c1e] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-7 shadow-xs apple-interactive-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.04] dark:border-white/[0.08] flex items-center justify-center text-[#1d1d1f] dark:text-white group-hover:bg-[#1d1d1f] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-[#1d1d1f] transition-all duration-300">
                      <div className="apple-symbol-bounce">
                        {ICON_MAP[service.icon_name] || <Wrench className="w-6 h-6" />}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[13px] font-medium text-[#86868b] dark:text-[#98989d] block">
                        Base Starting Rate
                      </span>
                      <span className="text-[20px] sm:text-[22px] font-bold text-[#0071e3] dark:text-[#0a84ff]">
                        ₹{service.base_price_estimate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] bg-black/[0.04] dark:bg-white/[0.08] px-3 py-0.5 rounded-full">
                      {service.category}
                    </span>
                    <span className="text-[12px] text-[#86868b] dark:text-[#98989d] font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>&lt; 30m response</span>
                    </span>
                  </div>

                  <h3 className="text-[19px] sm:text-[20px] font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] dark:group-hover:text-[#0a84ff] transition-colors mt-2">
                    {service.name}
                  </h3>
                  <p className="text-[15px] text-[#515154] dark:text-[#c7c7cc] leading-relaxed mt-2 mb-5">
                    {service.description}
                  </p>

                  {/* Popular Tasks */}
                  {service.popular_tasks && (
                    <div className="space-y-2 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                      <span className="text-[13px] font-bold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider block">
                        Common Tasks
                      </span>
                      {service.popular_tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-[14px] text-[#515154] dark:text-[#c7c7cc]">
                          <Check className="w-4 h-4 text-[#34c759] shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-7 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <Link
                    to={`/workers?service=${service.id}`}
                    className="w-full py-3.5 px-5 rounded-full bg-[#1d1d1f] dark:bg-white hover:bg-[#333336] dark:hover:bg-[#ebebee] text-white dark:text-[#1d1d1f] font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-xs apple-press-spring"
                  >
                    <span>View {service.name} Specialists</span>
                    <ChevronRight className="w-4 h-4" />
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
