'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Clock, Instagram, Plus, ArrowLeft } from 'lucide-react';
import { useLocationById } from '@/lib/hooks/useLocations';
import { useAuth } from '@/lib/context/AuthContext';
import { Content } from '@/lib/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import InstagramReelEmbed from '@/components/InstagramReelEmbed';
import ReelUploadModal from '@/components/ReelUploadModal';

// A placeholder for fetching content related to a location.
// In a real app, this would be another custom hook e.g., useContents({ locationId })
const useLocationContent = (locationId: string): { contents: Content[], isLoading: boolean } => {
  // This is mock data until the backend content endpoint is ready
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [locationId]);

  return { contents, isLoading };
};

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;
  
  const { data: location, isLoading, isError, error } = useLocationById(locationId);
  const { contents, isLoading: reelsLoading } = useLocationContent(locationId);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  const handleGetDirections = () => {
    if (location) {
      const [lng, lat] = location.coordinates.coordinates;
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    }
  };

  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !location) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <ErrorMessage message={error?.message || 'Location not found'} />
        </div>
      </div>
    );
  }

  const isPlusMember = user?.membershipStatus === 'plus_approved';
  const [lng, lat] = location.coordinates.coordinates;
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <img src={location.images[0]} alt={location.name} className="w-full h-64 lg:h-80 object-cover" />
          <div className="p-6 lg:p-8">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
              {location.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 font-serif my-4">{location.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{location.description}</p>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center text-gray-500">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{location.address || 'Location on map'}</span>
              </div>
              <button onClick={handleGetDirections} className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Directions
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b"><h2 className="text-2xl font-bold text-gray-800 font-serif">Location Map</h2></div>
              <div className="relative h-80"><iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 font-serif flex items-center"><Instagram className="w-6 h-6 mr-2 text-pink-500" />Reels</h2>
                {isPlusMember && <button onClick={() => setShowUploadModal(true)} className="flex items-center space-x-1 bg-pink-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600"><Plus className="w-4 h-4" /><span>Add</span></button>}
              </div>
              <div className="p-6">
                {reelsLoading ? <div className="flex justify-center py-8"><LoadingSpinner /></div>
                : contents.length > 0 ? <div className="space-y-6">{contents.map(c => <div key={c._id}>Mock Content</div>)}</div>
                : <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No reels shared for this location yet.</p>
                    {isPlusMember && <button onClick={() => setShowUploadModal(true)} className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600">Share First Reel</button>}
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPlusMember && <ReelUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} locationId={locationId} onSuccess={() => {}} />}
    </div>
  );
}
