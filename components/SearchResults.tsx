'use client';

import React from 'react';
import { MapPin, Calendar, Star, Clock, Users, Newspaper } from 'lucide-react';
import { Event, HistoricalPlace, Influencer, Reporter } from '@/lib/types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface SearchResultsProps {
  results: {
    events?: { items: Event[]; total: number };
    places?: { items: HistoricalPlace[]; total: number };
    influencers?: { items: Influencer[] };
    reporters?: { items: Reporter[] };
  };
  loading: boolean;
  error: string | null;
  query: string;
  onLocationClick?: (locationId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  query,
  onLocationClick
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!query) {
    return null;
  }

  const hasResults = results.events?.items.length || results.places?.items.length || 
                    results.influencers?.items.length || results.reporters?.items.length;

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
        <p className="text-gray-600">Try searching for events, places, or people in Chhattisgarh</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Results</h2>
        <p className="text-gray-600">Found results for "{query}"</p>
      </div>

      {/* Events */}
      {results.events?.items.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-800">Events ({results.events.total})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.events.items.map(event => (
              <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold text-orange-600 uppercase">{event.category}</span>
                  <h4 className="font-bold text-lg mt-1 mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`, '_blank')}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Places */}
      {results.places?.items.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">Places ({results.places.total})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.places.items.map(place => (
              <div 
                key={place._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => onLocationClick?.(place._id)}
              >
                <img src={place.imageUrl} alt={place.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-green-600 uppercase">{place.category}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{place.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{place.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
                    }}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Influencers */}
      {results.influencers?.items.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-pink-500" />
            <h3 className="text-xl font-bold text-gray-800">Influencers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.influencers.items.map(influencer => (
              <div key={influencer._id} className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
                <img src={influencer.imageUrl} alt={influencer.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{influencer.name}</h4>
                  <p className="text-gray-600">@{influencer.username}</p>
                  <p className="text-pink-600 text-sm font-semibold">{influencer.category}</p>
                  <p className="text-gray-500 text-sm">{influencer.followers} followers</p>
                </div>
                <button
                  onClick={() => window.open(`https://instagram.com/${influencer.username}`, '_blank')}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reporters */}
      {results.reporters?.items.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">News Reporters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.reporters.items.map(reporter => (
              <div key={reporter._id} className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
                <img src={reporter.imageUrl} alt={reporter.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{reporter.name}</h4>
                  <p className="text-gray-600">@{reporter.username}</p>
                  <p className="text-blue-600 text-sm font-semibold">{reporter.outlet}</p>
                  <p className="text-gray-500 text-sm">{reporter.followers} followers</p>
                </div>
                <button
                  onClick={() => window.open(`https://instagram.com/${reporter.username}`, '_blank')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;