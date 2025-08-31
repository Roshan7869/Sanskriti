import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EventsFeed from './components/EventsFeed';
import HistoricalPlaces from './components/HistoricalPlaces';
import TopInfluencers from './components/TopInfluencers';
import NewsReporters from './components/NewsReporters';
import BottomNavigation from './components/BottomNavigation';
import { data } from './data/sampleData';

function App() {
  const [selectedLocation, setSelectedLocation] = useState('Bhilai, CG');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const filteredEvents = data.events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 max-w-7xl mx-auto">
      <Header 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="pb-20 lg:pb-8">
        {activeTab === 'home' && (
          <>
            <Hero />
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:px-8">
              <div className="lg:col-span-8">
                <EventsFeed events={filteredEvents} />
                <HistoricalPlaces places={data.places} />
              </div>
              <div className="lg:col-span-4 lg:space-y-8">
                <TopInfluencers influencers={data.influencers} />
                <NewsReporters reporters={data.reporters} />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'explore' && (
          <div className="pt-20 px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.places.map(place => (
                <div key={place.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img src={place.image} alt={place.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{place.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{place.description}</p>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank')}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'events' && (
          <div className="pt-20 px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.events.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{event.category}</span>
                      <h3 className="font-bold text-lg mt-1">{event.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{event.location}</p>
                      <p className="text-gray-500 text-xs mt-2">{event.date}</p>
                    </div>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`, '_blank')}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="pt-20 px-4 lg:px-8 max-w-2xl lg:mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">U</span>
                </div>
                <h3 className="font-bold text-lg">Welcome to SANSKRITI</h3>
                <p className="text-gray-600">Discover the heritage of {selectedLocation}</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Saved Places</h4>
                  <p className="text-gray-600 text-sm">Save your favorite places to visit them later</p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Followed Influencers</h4>
                  <p className="text-gray-600 text-sm">Stay updated with local culture and events</p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Preferences</h4>
                  <p className="text-gray-600 text-sm">Current region: {selectedLocation}</p>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}

export default App;