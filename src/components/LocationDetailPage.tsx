import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Instagram, Plus, ArrowLeft } from 'lucide-react';
import { placesAPI, reelsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LocationDetail, InstagramReel } from '../types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import InstagramReelEmbed from './InstagramReelEmbed';
import ReelUploadModal from './ReelUploadModal';

interface LocationDetailPageProps {
  locationId: string;
  onBack: () => void;
}

const LocationDetailPage: React.FC<LocationDetailPageProps> = ({ locationId, onBack }) => {
  const [location, setLocation] = useState<LocationDetail | null>(null);
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [reelsLoading, setReelsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLocationDetails();
    fetchLocationReels();
  }, [locationId]);

  const fetchLocationDetails = async () => {
    try {
      setLoading(true);
      const data = await placesAPI.getPlaceById(locationId);
      
      // Create enhanced location with map embed URL
      const enhancedLocation: LocationDetail = {
        ...data,
        reels: [],
        mapEmbedUrl: `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(data.title)},Chhattisgarh,India`
      };
      
      setLocation(enhancedLocation);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch location details');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationReels = async () => {
    try {
      setReelsLoading(true);
      const data = await reelsAPI.getReels({ locationId, limit: 20 });
      setReels(data.reels);
    } catch (err: any) {
      console.error('Failed to fetch reels:', err);
    } finally {
      setReelsLoading(false);
    }
  };

  const handleReelUploadSuccess = () => {
    fetchLocationReels();
  };

  const handleGetDirections = () => {
    if (location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Places</span>
          </button>
          <ErrorMessage message={error || 'Location not found'} />
        </div>
      </div>
    );
  }

  const isPlusMember = user?.membershipLevel === 'plus' && user?.approved;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Places</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative">
            <img 
              src={location.imageUrl} 
              alt={location.title}
              className="w-full h-64 lg:h-80 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                {location.category}
              </span>
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-700">{location.rating}</span>
            </div>
          </div>
          
          <div className="p-6 lg:p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 font-serif mb-4">{location.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{location.description}</p>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{location.title}, Chhattisgarh</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Open Daily</span>
                </div>
              </div>
              
              <button
                onClick={handleGetDirections}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Location</h2>
              </div>
              <div className="relative h-64 lg:h-80">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TvSMIo&q=${encodeURIComponent(location.title)},Chhattisgarh,India`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-2xl"
                />
              </div>
            </div>
          </div>

          {/* Instagram Reels Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Instagram className="w-6 h-6 text-pink-500" />
                    <h2 className="text-xl font-bold text-gray-800 font-serif">Instagram Reels</h2>
                  </div>
                  {isPlusMember && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Reel</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {reelsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : reels.length > 0 ? (
                  <div className="space-y-6">
                    {reels.map(reel => (
                      <InstagramReelEmbed
                        key={reel._id}
                        reelUrl={reel.reelUrl}
                        caption={reel.caption}
                        uploaderName={reel.uploaderName}
                        uploaderType={reel.uploaderType}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No reels shared yet</p>
                    {isPlusMember ? (
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
                      >
                        Share First Reel
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Plus members can share Instagram reels
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReelUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        locationId={locationId}
        onSuccess={handleReelUploadSuccess}
      />
    </div>
  );
};

export default LocationDetailPage;