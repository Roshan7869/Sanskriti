import React, { useEffect, useRef } from 'react';
import { ExternalLink, Play } from 'lucide-react';

interface InstagramReelEmbedProps {
  reelUrl: string;
  caption?: string;
  uploaderName: string;
  uploaderType: 'admin' | 'creator';
  className?: string;
}

const InstagramReelEmbed: React.FC<InstagramReelEmbedProps> = ({
  reelUrl,
  caption,
  uploaderName,
  uploaderType,
  className = ''
}) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.src = '//www.instagram.com/embed.js';
      document.body.appendChild(script);
    }
  }, [reelUrl]);

  const extractInstagramId = (url: string): string | null => {
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const instagramId = extractInstagramId(reelUrl);

  const handleOpenInstagram = () => {
    window.open(reelUrl, '_blank');
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              uploaderType === 'admin' ? 'bg-orange-500' : 'bg-pink-500'
            }`}>
              {uploaderName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{uploaderName}</p>
              <p className="text-xs text-gray-500 capitalize">{uploaderType}</p>
            </div>
          </div>
          <button
            onClick={handleOpenInstagram}
            className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">View on Instagram</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {instagramId ? (
          <div ref={embedRef}>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={reelUrl}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '3px',
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: '1px',
                maxWidth: '540px',
                minWidth: '326px',
                padding: 0,
                width: '99.375%'
              }}
            >
              <div style={{ padding: '16px' }}>
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Loading Instagram Reel...</p>
                  </div>
                </div>
              </div>
            </blockquote>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-100">
            <div className="text-center">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Invalid Instagram URL</p>
              <button
                onClick={handleOpenInstagram}
                className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Open Link
              </button>
            </div>
          </div>
        )}
      </div>

      {caption && (
        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed">{caption}</p>
        </div>
      )}
    </div>
  );
};

// Extend window interface for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default InstagramReelEmbed;