import { useState, useEffect } from 'react';
import { placesAPI } from '../services/api';
import { HistoricalPlace } from '../types/api';

interface UsePlacesParams {
  query?: string;
  page?: number;
  limit?: number;
}

export const usePlaces = (params: UsePlacesParams = {}) => {
  const [places, setPlaces] = useState<HistoricalPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await placesAPI.getPlaces({
          page: params.page || 1,
          limit: params.limit || 10,
          query: params.query
        });
        
        setPlaces(data.places);
        setPagination(data.pagination);
      } catch (err: any) {
        console.error('Failed to fetch places:', err);
        setError(err.response?.data?.error || 'Failed to fetch places');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [params.query, params.page, params.limit]);

  return { places, loading, error, pagination };
};