'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EventsFeed from '@/components/EventsFeed';
import HistoricalPlaces from '@/components/HistoricalPlaces';
import TopInfluencers from '@/components/TopInfluencers';
import NewsReporters from '@/components/NewsReporters';
import BottomNavigation from '@/components/BottomNavigation';
import AuthModal from '@/components/AuthModal';
import MembershipModal from '@/components/MembershipModal';
import SearchResults from '@/components/SearchResults';
import EventCalendar from '@/components/EventCalendar';
import WeatherWidget from '@/components/WeatherWidget';
import FavoritesManager from '@/components/FavoritesManager';
import NotificationCenter from '@/components/NotificationCenter';
import LazySection from '@/components/LazySection';
import { usePlaces } from '@/lib/hooks/usePlaces';
import { useEvents } from '@/lib/hooks/useEvents';
import { searchAPI } from '@/lib/services/api';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState('Bhilai, CG');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Fetch data for explore and events tabs
  const { places } = usePlaces({ limit: 20 });
  const { events } = useEvents({ limit: 20 });

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const results = await searchAPI.search({ query: query.trim(), type: 'all' });
      setSearchResults(results.results);
    } catch (err: any) {
      setSearchError(err.response?.data?.error || 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  const handleLocationClick = (locationId: string) => {
    router.push(`/location/${locationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 max-w-7xl mx-auto">
      <Header 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAuthClick={() => setShowAuthModal(true)}
      />
      
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(true)}
        className="fixed top-4 right-4 z-40 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 lg:top-6 lg:right-6"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </button>
      
      <main className="pb-20 lg:pb-8">
        {/* Search Results */}
        {searchQuery && (
          <div className="pt-32 px-4 lg:px-8">
            <SearchResults
              results={searchResults || {}}
              loading={searchLoading}
              error={searchError}
              query={searchQuery}
              onLocationClick={handleLocationClick}
            />
          </div>
        )}
        
        {/* Main Content - only show when not searching */}
        {!searchQuery && (
          <>
        {activeTab === 'home' && (
          <>
            <Hero />
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:px-8">
              <div className="lg:col-span-8">
                <LazySection>
                  <EventsFeed searchQuery={searchQuery} />
                </LazySection>
                <LazySection>
                  <HistoricalPlaces 
                    searchQuery={searchQuery} 
                    onLocationClick={handleLocationClick}
                  />
                </LazySection>
              </div>
              <div className="lg:col-span-4 lg:space-y-8">
                <LazySection>
                  <WeatherWidget location={selectedLocation} />
                </LazySection>
                <LazySection>
                  <TopInfluencers />
                </LazySection>
                <LazySection>
                  <NewsReporters />
                </LazySection>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'explore' && (
          <LazySection>
            <div className="pt-20 px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Places</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {places.map(place => (
                  <div 
                    key={place._id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleLocationClick(place._id)}
                  >
                    <img src={place.imageUrl} alt={place.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{place.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{place.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-orange-600 uppercase">{place.category}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{place.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
                        }}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Get Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </LazySection>
        )}
        
        {activeTab === 'events' && (
          <LazySection>
            <div className="pt-20 px-4 lg:px-8 space-y-8">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                  <EventCalendar />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Events</h2>
                  <div className="space-y-4">
                    {events.slice(0, 3).map(event => (
                      <div key={event._id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start space-x-3">
                          <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-orange-600 uppercase">{event.category}</span>
                            <h4 className="font-bold text-sm mt-1">{event.title}</h4>
                            <p className="text-gray-600 text-xs mt-1">{event.location}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LazySection>
        )}
        
        {activeTab === 'profile' && (
          <div className="pt-20 px-4 lg:px-8 max-w-2xl lg:mx-auto">
            <div className="space-y-8">
              {user ? (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{user.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <h3 className="font-bold text-lg">Welcome, {user.email.split('@')[0]}</h3>
                      <p className="text-gray-600">{user.region}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          user.membershipLevel === 'plus' 
                            ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.membershipLevel === 'plus' ? 'Plus Member' : 'Basic Member'}
                        </span>
                      </div>
                    </div>
                    
                    {user.membershipLevel === 'basic' && (
                      <button
                        onClick={() => setShowMembershipModal(true)}
                        className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 mb-4"
                      >
                        Upgrade to Plus
                      </button>
                    )}
                  </div>
                  
                  <FavoritesManager onLocationClick={handleLocationClick} />
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">?</span>
                    </div>
                    <h3 className="font-bold text-lg">Welcome to SANSKRITI</h3>
                    <p className="text-gray-600">Discover the heritage of {selectedLocation}</p>
                  </div>
                  
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
          </>
        )}
      </main>
      
      <div className="lg:hidden">
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'explore', label: 'Explore Places' },
              { id: 'events', label: 'Events' },
              { id: 'profile', label: 'Profile' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <MembershipModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
      />
      
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}