import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface EventsFeedProps {
  searchQuery?: string;
}

const EventsFeed: React.FC<EventsFeedProps> = ({ searchQuery }) => {
  const { events, loading, error } = useEvents({ query: searchQuery, limit: 5 });

  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
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
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-48 lg:h-56 object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {event.category}
                </span>
              </div>
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