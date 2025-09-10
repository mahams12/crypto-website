import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-black text-white border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-black"
                style={{ backgroundColor: '#FFD700' }}
              >
                C
              </div>
              <span className="text-xl font-bold text-white">Crypto Tracker</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Your trusted source for cryptocurrency news, market analysis, price predictions, and educational content. Stay ahead of the crypto market.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Crypto Tracker. All rights reserved.
            </p>
          </div>

          {/* Middle Section - News & Analysis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">News & Analysis</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Latest News
                </Link>
              </li>
              <li>
                <Link to="/opinion" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Opinion
                </Link>
              </li>
              <li>
                <Link to="/markets" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Predictions
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;