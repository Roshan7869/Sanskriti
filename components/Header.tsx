'use client';

import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  setSelectedLocation,
  searchQuery,
  setSearchQuery,
  onAuthClick
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const locations = [
    'Bhilai, CG',
    'Durg, CG',
    'Raipur, CG'
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 max-w-7xl mx-auto">
      <div className="px-4 lg:px-8 py-3">
        {/* Top row with logo and location */}
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className="flex items-center space-x-3">
            <Image 
              src="/Gemini_Generated_Image_ocwun2ocwun2ocwu.png" 
              alt="SANSKRITI Logo" 
              width={40}
              height={40}
              className="rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 font-serif">SANSKRITI</h1>
              <p className="text-xs lg:text-sm text-gray-600">Heritage & Culture</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-2 bg-orange-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm lg:text-base font-medium text-gray-700">{selectedLocation}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {showLocationDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[160px] lg:min-w-[200px] z-10">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location);
                      setShowLocationDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm lg:text-base text-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search places, events, celebrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-base"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;