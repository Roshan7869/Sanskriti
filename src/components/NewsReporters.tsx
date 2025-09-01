import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { useReporters } from '../hooks/useReporters';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const NewsReporters: React.FC = () => {
  const { reporters, loading, error } = useReporters({ limit: 4 });

  const handleVisitProfile = (username: string) => {
    window.open(`https://instagram.com/${username}`, '_blank');
  };

  if (loading) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">News Reporters</h2>
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
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">News Reporters</h2>
        </div>
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">News Reporters</h2>
        </div>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-4">
        {reporters.map(reporter => (
          <div key={reporter._id} className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center lg:text-left lg:flex lg:items-center lg:space-x-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative mb-3 lg:mb-0 lg:flex-shrink-0">
              <img 
                src={reporter.imageUrl} 
                alt={reporter.name}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto lg:mx-0 object-cover border-3 border-gradient-to-r from-blue-500 to-indigo-500 p-0.5"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Newspaper className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="lg:flex-1">
              <h3 className="font-bold text-gray-800 text-sm lg:text-base mb-1">{reporter.name}</h3>
              <p className="text-gray-500 text-xs lg:text-sm mb-1">@{reporter.username}</p>
              <p className="text-blue-600 text-xs lg:text-sm font-semibold mb-2">{reporter.outlet}</p>
              <p className="text-gray-400 text-xs lg:text-sm mb-3 lg:mb-0">{reporter.followers} followers</p>
            </div>
            
            <button
              onClick={() => handleVisitProfile(reporter.username)}
              className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg text-xs lg:text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-1 lg:flex-shrink-0"
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