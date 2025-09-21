'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Star, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { profileAPI } from '@/lib/services/api';
import { Event, HistoricalPlace } from '@/lib/types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface FavoritesManagerProps {
  onLocationClick?: (locationId: string) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({ onLocationClick }) => {
  const [favorites, setFavorites] = useState<{
    events: Event[];
    places: HistoricalPlace[];
  }>({ events: [], places: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'places'>('events');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await profileAPI.getProfile();
      setFavorites({
        events: data.user.favorites?.events || [],
        places: data.user.favorites?.places || []
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (type: 'events' | 'places', itemId: string) => {
    try {
      await profileAPI.removeFromFavorites(type, itemId);
      setFavorites(prev => ({
        ...prev,
        [type]: prev[type].filter((item: any) => item._id !== itemId)
      }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove from favorites');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Save Your Favorites</h3>
        <p className="text-gray-600 mb-6">Sign in to save places and events you want to visit</p>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300">
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <ErrorMessage message={error} onRetry={fetchFavorites} />
      </div>
    );
  }

  const currentFavorites = favorites[activeTab];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800 font-serif">My Favorites</h2>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'events'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Events ({favorites.events.length})
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'places'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Places ({favorites.places.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {currentFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'events' ? (
                <Calendar className="w-8 h-8 text-gray-400" />
              ) : (
                <MapPin className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No {activeTab} saved yet
            </h3>
            <p className="text-gray-600">
              Start exploring and save your favorite {activeTab} to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentFavorites.map((item: any) => (
              <div key={item._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                    onClick={() => activeTab === 'places' && onLocationClick?.(item._id)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    
                    {activeTab === 'events' ? (
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                        <span className="text-orange-600 font-semibold">{item.category}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        if (activeTab === 'events') {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`, '_blank');
                        } else {
                          onLocationClick?.(item._id);
                        }
                      }}
                      className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                    >
                      {activeTab === 'events' ? 'Directions' : 'View'}
                    </button>
                    <button
                      onClick={() => removeFromFavorites(activeTab, item._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesManager;