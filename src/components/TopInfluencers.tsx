import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

interface Influencer {
  id: number;
  username: string;
  name: string;
  image: string;
  followers: string;
  category: string;
}

interface TopInfluencersProps {
  influencers: Influencer[];
}

const TopInfluencers: React.FC<TopInfluencersProps> = ({ influencers }) => {
  const handleVisitProfile = (username: string) => {
    window.open(`https://instagram.com/${username}`, '_blank');
  };

  return (
    <section className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Instagram className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Top Influencers</h2>
        </div>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {influencers.map(influencer => (
          <div key={influencer.id} className="flex-shrink-0 w-40 bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative mb-3">
              <img 
                src={influencer.image} 
                alt={influencer.name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-3 border-gradient-to-r from-pink-500 to-orange-500 p-0.5"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <Instagram className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h3 className="font-bold text-gray-800 text-sm mb-1">{influencer.name}</h3>
            <p className="text-gray-500 text-xs mb-1">@{influencer.username}</p>
            <p className="text-orange-600 text-xs font-semibold mb-2">{influencer.category}</p>
            <p className="text-gray-400 text-xs mb-3">{influencer.followers} followers</p>
            
            <button
              onClick={() => handleVisitProfile(influencer.username)}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded-lg text-xs font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-1"
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