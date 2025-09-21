import { useState, useEffect } from 'react';
import { influencersAPI } from '@/lib/services/api';
import { Influencer } from '@/lib/types/api';

interface UseInfluencersParams {
  query?: string;
  page?: number;
  limit?: number;
}

export const useInfluencers = (params: UseInfluencersParams = {}) => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await influencersAPI.getInfluencers({
          page: params.page || 1,
          limit: params.limit || 5,
          query: params.query
        });
        
        setInfluencers(data.influencers);
        setPagination(data.pagination);
      } catch (err: any) {
        console.error('Failed to fetch influencers:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch influencers');
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, [params.query, params.page, params.limit]);

  return { influencers, loading, error, pagination };
};