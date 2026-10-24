import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, PhoneCall, Heart, CheckCircle2, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Kaam<span className="text-teal-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Local Skills. Trusted Services. Fair Opportunities." Connecting urban households with verified, skilled local blue-collar workers through transparent, flexible pricing and smart hyperlocal matching.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 w-fit">
              <Award className="w-4 h-4 text-amber-400" />
              <span>National Hackathon 24-Hr MVP Submission</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Explore Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/workers?service=srv-electrician" className="hover:text-teal-400 transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-plumber" className="hover:text-teal-400 transition-colors">
                  Plumbers
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-carpenter" className="hover:text-teal-400 transition-colors">
                  Carpenters
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-cleaning" className="hover:text-teal-400 transition-colors">
                  House Cleaning
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-appliance" className="hover:text-teal-400 transition-colors">
                  Appliance Repair
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Safety & Standards
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about-safety" className="hover:text-teal-400 transition-colors">
                  Govt. ID Verification
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-teal-400 transition-colors">
                  Transparent Pricing Rules
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-teal-400 transition-colors">
                  Customer Escrow & Safety
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-teal-400 transition-colors">
                  Dispute Resolution Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Helpline */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Hyperlocal Trust
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero middlemen commission gouging for independent workers</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Deterministic Haversine matching ensures nearby quick response</span>
              </div>
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>24/7 Helpline: 1800-KAAM-TRUST (Toll Free)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KaamConnect Technologies. Open-source prototype.</p>
          <p className="flex items-center gap-1">
            Built for National Hackathon with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & React + Supabase
          </p>
        </div>
      </div>
    </footer>
  );
};
