'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EventsFeed from '@/components/EventsFeed';
import LocationsFeed from '@/components/LocationsFeed';
import FeaturedMembers from '@/components/FeaturedMembers';
import BottomNavigation from '@/components/BottomNavigation';
import AuthModal from '@/components/AuthModal';
import MembershipModal from '@/components/MembershipModal';
import { useAuth } from '@/lib/context/AuthContext';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const { user } = useAuth();

  // A simple router (for demonstration)
  const renderContent = () => {
    if (searchQuery) {
      // Search results would be rendered here
      return <div className="pt-32 px-4 lg:px-8">Searching for "{searchQuery}"...</div>;
    }

    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero />
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:px-8">
              <div className="lg:col-span-8">
                <LocationsFeed title="Featured Locations" />
                <EventsFeed />
              </div>
              <div className="lg:col-span-4 lg:space-y-8">
                <FeaturedMembers />
              </div>
            </div>
          </>
        );
      case 'explore':
        return (
          <div className="pt-20 px-4 lg:px-8">
            <LocationsFeed title="Explore All Locations" />
          </div>
        );
      case 'events':
        return (
          <div className="pt-20 px-4 lg:px-8">
            <EventsFeed />
          </div>
        );
      case 'profile':
        return (
          <div className="pt-20 px-4 lg:px-8 max-w-2xl lg:mx-auto">
             <div className="bg-white rounded-xl shadow-lg p-6">
              {user ? (
                <>
                  <h3 className="font-bold text-lg">Welcome, {user.username}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      user.membershipStatus === 'plus_approved'
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.membershipStatus.replace('_', ' ')}
                    </span>
                  </div>
                  {user.membershipStatus === 'regular' && (
                    <button
                      onClick={() => setShowMembershipModal(true)}
                      className="w-full mt-4 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600"
                    >
                      Apply for Plus Membership
                    </button>
                  )}
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">Welcome to Tourista</h3>
                  <p className="text-gray-600">Join our community to discover amazing places.</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
                  >
                    Sign In / Register
                  </button>
                </>
              )}
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAuthClick={() => setShowAuthModal(true)}
        appName="Tourista"
      />

      <main className="pb-20 lg:pb-8">
        {renderContent()}
      </main>
      
      <div className="lg:hidden">
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            {['home', 'explore', 'events', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {tab}
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
    </div>
  );
}
