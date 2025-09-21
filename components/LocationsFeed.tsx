'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';
import { useLocations } from '@/lib/hooks/useLocations';
import { useAuth } from '@/lib/context/AuthContext';
import { profileAPI } from '@/lib/services/api';
import { Location } from '@/lib/types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface LocationsFeedProps {
  title: string;
  searchQuery?: string;
}

const LocationsFeed: React.FC<LocationsFeedProps> = ({ title, searchQuery }) => {
  const { data, isLoading, isError, error } = useLocations({ query: searchQuery, limit: 5 });
  const { user, isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (user?.favorites?.locations) {
      setFavoriteIds(new Set(user.favorites.locations));
    }
  }, [user]);

  const handleGetDirections = (e: React.MouseEvent, coordinates: [number, number]) => {
    e.stopPropagation();
    const [lng, lat] = coordinates;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const toggleFavorite = async (locationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      const isFavorite = favoriteIds.has(locationId);
      if (isFavorite) {
        await profileAPI.removeFromFavorites('locations', locationId);
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(locationId);
          return newSet;
        });
      } else {
        await profileAPI.addToFavorites('locations', locationId);
        setFavoriteIds(prev => new Set(prev).add(locationId));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (isLoading) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6">{title}</h2>
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6">{title}</h2>
        <ErrorMessage message={error.message} />
      </section>
    );
  }

  const locations = data?.locations || [];

  return (
    <section className="px-4 lg:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">{title}</h2>
        <Link href="/locations" className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          Explore All
        </Link>
      </div>

      <div className="space-y-6">
        {locations.map((location: Location) => (
          <Link key={location._id} href={`/location/${location._id}`} className="block">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="relative">
                <img
                  src={location.images[0] || '/placeholder.jpg'}
                  alt={location.name}
                  className="w-full h-48 lg:h-56 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {location.category}
                  </span>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={(e) => toggleFavorite(location._id, e)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    aria-label="Toggle Favorite"
                  >
                    <Heart className={`w-5 h-5 ${favoriteIds.has(location._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                )}
              </div>

              <div className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">{location.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{location.description}</p>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{location.address || 'View on map'}</span>
                  </div>
                  <button
                    onClick={(e) => handleGetDirections(e, location.coordinates.coordinates)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full lg:w-auto"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LocationsFeed;
