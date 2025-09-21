'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Newspaper } from 'lucide-react';
import { useMembers } from '@/lib/hooks/useMembers';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const FeaturedMembers: React.FC = () => {
  const { data, isLoading, isError, error } = useMembers({ limit: 8 });

  if (isLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner /></div>;
  }

  if (isError) {
    // Note: This will show an error until the backend endpoint is implemented.
    console.warn('Featured members endpoint is not yet implemented on the backend.');
    return <ErrorMessage message="Could not load featured members at this time." />;
  }

  const members = data?.members || [];

  if (members.length === 0) {
    return null; // Don't render the component if there are no featured members
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Featured Members</h2>
          <Link href="/members" className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {members.map(member => (
            <div key={member._id} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
              <img
                src={member.profileImage || '/default-avatar.png'}
                alt={member.username}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-orange-200"
                loading="lazy"
              />
              <h3 className="font-bold text-gray-800">{member.username}</h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{member.bio || 'Content Creator'}</p>
              <div className="flex justify-center space-x-3 mt-2">
                {member.socialLinks?.instagram && (
                  <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                    <Instagram size={20} />
                  </a>
                )}
                {member.socialLinks?.newsChannel && (
                   <a href={member.socialLinks.newsChannel} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                    <Newspaper size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMembers;
