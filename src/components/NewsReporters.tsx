import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface Reporter {
  id: number;
  username: string;
  name: string;
  image: string;
  followers: string;
  outlet: string;
}

interface NewsReportersProps {
  reporters: Reporter[];
}

const NewsReporters: React.FC<NewsReportersProps> = ({ reporters }) => {
  const handleVisitProfile = (username: string) => {
    window.open(`https://instagram.com/${username}`, '_blank');
  };

  return (
    <section className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">News Reporters</h2>
        </div>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {reporters.map(reporter => (
          <div key={reporter.id} className="flex-shrink-0 w-40 bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative mb-3">
              <img 
                src={reporter.image} 
                alt={reporter.name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-3 border-gradient-to-r from-blue-500 to-indigo-500 p-0.5"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Newspaper className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h3 className="font-bold text-gray-800 text-sm mb-1">{reporter.name}</h3>
            <p className="text-gray-500 text-xs mb-1">@{reporter.username}</p>
            <p className="text-blue-600 text-xs font-semibold mb-2">{reporter.outlet}</p>
            <p className="text-gray-400 text-xs mb-3">{reporter.followers} followers</p>
            
            <button
              onClick={() => handleVisitProfile(reporter.username)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg text-xs font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-1"
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

export default NewsReporters;