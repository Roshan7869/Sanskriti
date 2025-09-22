'use client';

import React from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { useEvents } from '@/lib/hooks/useEvents';
import { useAuth } from '@/lib/context/AuthContext';
import { profileAPI } from '@/lib/services/api';
import { Event } from '@/lib/types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import OptimizedImage from './OptimizedImage';
import LazySection from './LazySection';

interface EventsFeedProps {
  searchQuery?: string;
}

const EventsFeed: React.FC<EventsFeedProps> = ({ searchQuery }) => {
  const { events, loading, error } = useEvents({ query: searchQuery, limit: 5 });
  const { user, isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (user?.favorites?.events) {
      setFavoriteIds(new Set(user.favorites.events.map((e: any) => e._id || e)));
    }
  }, [user]);

  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const toggleFavorite = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }

    try {
      const isFavorite = favoriteIds.has(eventId);
      
      if (isFavorite) {
        await profileAPI.removeFromFavorites('events', eventId);
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await profileAPI.addToFavorites('events', eventId);
        setFavoriteIds(prev => new Set(prev).add(eventId));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6">Upcoming Events</h2>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 lg:px-0 py-8">
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6">Upcoming Events</h2>
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Upcoming Events</h2>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-6">
        {events.map(event => (
          <div key={event._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <OptimizedImage
                src={event.imageUrl} 
                alt={event.title}
                width={800}
                height={224}
                className="w-full h-48 lg:h-56"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, 800px"
                placeholder="blur"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {event.category}
                </span>
              </div>
              {isAuthenticated && (
                <button
                  onClick={(e) => toggleFavorite(event._id, e)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${
                    favoriteIds.has(event._id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-600'
                  }`} />
                </button>
              )}
            </div>
            
            <div className="p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleGetDirections(event.coordinates.lat, event.coordinates.lng)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full lg:w-auto"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsFeed;