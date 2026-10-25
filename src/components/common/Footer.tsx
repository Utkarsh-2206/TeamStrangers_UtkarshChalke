import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#0a0a0c] text-[#86868b] dark:text-[#98989d] text-[13px] border-t border-black/[0.08] dark:border-white/[0.08] pt-12 pb-14 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Footnotes / Notice */}
        <div className="pb-8 mb-8 border-b border-black/[0.08] dark:border-white/[0.08] space-y-2.5 text-[12px] leading-relaxed text-[#86868b] dark:text-[#98989d]">
          <p>
            1. All verified professionals undergo mandatory multi-point document review, including government ID verification and skill endorsement, before public listing.
          </p>
          <p>
            2. Direct pricing quotes are established collaboratively between customers and service providers. KaamConnect levies 0% aggregator commission on independent worker earnings.
          </p>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-black/[0.08] dark:border-white/[0.08]">
          {/* Col 1 */}
          <div>
            <h4 className="text-[#1d1d1f] dark:text-white font-semibold text-[14px] mb-3.5 tracking-tight">
              Explore Services
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link to="/workers?service=srv-electrician" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-plumber" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Plumbers
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-carpenter" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Carpentry & Woodwork
                </Link>
              </li>
              <li>
                <Link to="/workers?service=srv-cleaning" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Deep House Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#0071e3] dark:text-[#0a84ff] hover:underline font-medium">
                  All 10 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[#1d1d1f] dark:text-white font-semibold text-[14px] mb-3.5 tracking-tight">
              Safety & Verification
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Govt. ID Verification
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Transparent Pricing Rules
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Customer Escrow Protection
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Dispute Resolution Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-[#1d1d1f] dark:text-white font-semibold text-[14px] mb-3.5 tracking-tight">
              For Specialists
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link to="/register" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Join as Independent Pro
                </Link>
              </li>
              <li>
                <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Zero Commission Guarantee
                </Link>
              </li>
              <li>
                <Link to="/worker/dashboard" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Specialist Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-[#1d1d1f] dark:text-white font-semibold text-[14px] mb-3.5 tracking-tight">
              KaamConnect
            </h4>
            <p className="leading-relaxed mb-3.5 text-[13px]">
              Connecting urban households with certified, local independent tradespeople through transparent pricing and smart hyperlocal matching.
            </p>
            <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-white font-medium text-[13px]">
              <Shield className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
              <span>National Prototype Edition</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#86868b] dark:text-[#98989d]">
          <p>© {new Date().getFullYear()} KaamConnect Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/about-safety" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <span>Bengaluru, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
