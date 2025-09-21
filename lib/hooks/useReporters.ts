import { useState, useEffect } from 'react';
import { reportersAPI } from '@/lib/services/api';
import { Reporter } from '@/lib/types/api';

interface UseReportersParams {
  query?: string;
  page?: number;
  limit?: number;
}

export const useReporters = (params: UseReportersParams = {}) => {
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchReporters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await reportersAPI.getReporters({
          page: params.page || 1,
          limit: params.limit || 4,
          query: params.query
        });
        
        setReporters(data.reporters);
        setPagination(data.pagination);
      } catch (err: any) {
        console.error('Failed to fetch reporters:', err);
        setError(err.response?.data?.error || 'Failed to fetch reporters');
      } finally {
        setLoading(false);
      }
    };

    fetchReporters();
  }, [params.query, params.page, params.limit]);

  return { reporters, loading, error, pagination };
};