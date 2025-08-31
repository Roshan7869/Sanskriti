import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';

interface Place {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  category: string;
}

interface HistoricalPlacesProps {
  places: Place[];
}

const HistoricalPlaces: React.FC<HistoricalPlacesProps> = ({ places }) => {
  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <section className="px-4 lg:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Historical Places</h2>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
          Explore All
        </button>
      </div>
      
      <div className="space-y-6">
        {places.map(place => (
          <div key={place.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img 
                src={place.image} 
                alt={place.title}
                className="w-full h-48 lg:h-56 object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {place.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-semibold text-gray-700">{place.rating}</span>
              </div>
            </div>
            
            <div className="p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">{place.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{place.description}</p>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Bhilai, CG</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Open Daily</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleGetDirections(place.lat, place.lng)}
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

export default HistoricalPlaces;