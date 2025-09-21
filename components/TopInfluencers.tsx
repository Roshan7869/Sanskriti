'use client';

import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { useInfluencers } from '@/lib/hooks/useInfluencers';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TopInfluencers: React.FC = () => {
  const { influencers, loading, error } = useInfluencers({ limit: 5 });

  const handleVisitProfile = (username: string) => {
    window.open(`https://instagram.com/${username}`, '_blank');
  };

  if (loading) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Instagram className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Top Influencers</h2>
        </div>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Instagram className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Top Influencers</h2>
        </div>
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Instagram className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Top Influencers</h2>
        </div>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-4">
        {influencers.map(influencer => (
          <div key={influencer._id} className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center lg:text-left lg:flex lg:items-center lg:space-x-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative mb-3 lg:mb-0 lg:flex-shrink-0">
              <img 
                src={influencer.imageUrl} 
                alt={influencer.name}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto lg:mx-0 object-cover border-2 border-pink-500"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <Instagram className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="lg:flex-1">
              <h3 className="font-bold text-gray-800 text-sm lg:text-base mb-1">{influencer.name}</h3>
              <p className="text-gray-500 text-xs lg:text-sm mb-1">@{influencer.username}</p>
              <p className="text-orange-600 text-xs lg:text-sm font-semibold mb-2">{influencer.category}</p>
              <p className="text-gray-400 text-xs lg:text-sm mb-3 lg:mb-0">{influencer.followers} followers</p>
            </div>
            
            <button
              onClick={() => handleVisitProfile(influencer.username)}
              className="w-full lg:w-auto bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg text-xs lg:text-sm font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-1 lg:flex-shrink-0"
            >
              <span>Follow</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopInfluencers;