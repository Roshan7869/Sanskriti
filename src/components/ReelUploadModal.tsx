import React, { useState } from 'react';
import { X, Upload, Instagram, AlertCircle } from 'lucide-react';
import { reelsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ReelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationId?: string;
  eventId?: string;
  onSuccess?: () => void;
}

const ReelUploadModal: React.FC<ReelUploadModalProps> = ({
  isOpen,
  onClose,
  locationId,
  eventId,
  onSuccess
}) => {
  const [reelUrl, setReelUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const validateInstagramUrl = (url: string): boolean => {
    const instagramPattern = /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/;
    return instagramPattern.test(url);
  };

  const extractInstagramId = (url: string): string | null => {
    const match = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
    return match ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInstagramUrl(reelUrl)) {
      setError('Please enter a valid Instagram post or reel URL');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption for your reel');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const instagramId = extractInstagramId(reelUrl);
      
      await reelsAPI.createReel({
        locationId,
        eventId,
        reelUrl: reelUrl.trim(),
        caption: caption.trim(),
        instagramId: instagramId || undefined
      });

      setReelUrl('');
      setCaption('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload reel');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Check if user has plus membership
  const isPlusMember = user?.membershipLevel === 'plus' && user?.approved;

  if (!isPlusMember) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Plus Membership Required</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="text-center py-6">
            <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              You need a Plus membership to upload Instagram Reels and contribute content to SANSKRITI.
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
            >
              Apply for Plus Membership
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Instagram className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-800">Share Instagram Reel</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Reel URL
            </label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="https://www.instagram.com/p/..."
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paste the URL of your Instagram post or reel
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Tell us about this place or event..."
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {caption.length}/500 characters
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-700">
                <p className="font-medium mb-1">Content Guidelines</p>
                <ul className="text-xs space-y-1">
                  <li>• Share authentic content about local culture and heritage</li>
                  <li>• Ensure your Instagram post is public</li>
                  <li>• Content will be reviewed before appearing on the site</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Share Reel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReelUploadModal;