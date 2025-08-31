import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  lat: number;
  lng: number;
  image: string;
  date: string;
  description: string;
}

interface EventsFeedProps {
  events: Event[];
}

const EventsFeed: React.FC<EventsFeedProps> = ({ events }) => {
  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <section className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Upcoming Events</h2>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleGetDirections(event.lat, event.lng)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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