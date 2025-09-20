import React, { useState } from 'react';
import { X, Star, Instagram, AlertCircle, CheckCircle } from 'lucide-react';
import { membershipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'info' | 'apply' | 'success'>('info');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [bio, setBio] = useState('');
  const [sampleWork, setSampleWork] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bio.trim()) {
      setError('Please tell us about yourself');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await membershipAPI.applyForPlus({
        instagramHandle: instagramHandle.trim() || undefined,
        bio: bio.trim(),
        sampleWork: sampleWork.trim() || undefined
      });

      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('info');
    setInstagramHandle('');
    setBio('');
    setSampleWork('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Check if user already has plus membership or pending application
  const isPlusMember = user?.membershipLevel === 'plus';
  const isApproved = user?.approved;

  if (isPlusMember) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Plus Membership</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isApproved ? 'Plus Member' : 'Application Under Review'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isApproved 
                ? 'You can now share Instagram Reels and contribute content to SANSKRITI.'
                : 'Your Plus membership application is being reviewed. You\'ll be notified once approved.'
              }
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">SANSKRITI Plus</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === 'info' && (
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Become a Plus Member</h3>
              <p className="text-gray-600">
                Join our community of cultural creators and share your perspective on Chhattisgarh's heritage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-50 rounded-xl p-6">
                <Instagram className="w-8 h-8 text-pink-500 mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Share Instagram Reels</h4>
                <p className="text-gray-600 text-sm">
                  Upload and embed your Instagram Reels to showcase local culture, events, and places
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6">
                <Star className="w-8 h-8 text-orange-500 mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Creator Recognition</h4>
                <p className="text-gray-600 text-sm">
                  Get featured as a cultural creator and build your local influence
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Application Process</p>
                  <ul className="space-y-1">
                    <li>• Applications are reviewed to ensure quality content</li>
                    <li>• Focus on authentic cultural and heritage content</li>
                    <li>• Approval typically takes 1-3 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('apply')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-lg"
            >
              Apply for Plus Membership
            </button>
          </div>
        )}

        {step === 'apply' && (
          <form onSubmit={handleApply} className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Application Form</h3>
              <p className="text-gray-600">Tell us about yourself and your interest in cultural content</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle (Optional)
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="@yourusername"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You *
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Tell us about your interest in Chhattisgarh's culture and heritage..."
                  required
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Work (Optional)
                </label>
                <input
                  type="url"
                  value={sampleWork}
                  onChange={(e) => setSampleWork(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Link to your Instagram post, blog, or other work"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={() => setStep('info')}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for applying to become a Plus member. We'll review your application and notify you within 1-3 business days.
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipModal;