import { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import { Event } from '../types/api';

interface UseEventsParams {
  query?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export const useEvents = (params: UseEventsParams = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await eventsAPI.getEvents({
          page: params.page || 1,
          limit: params.limit || 10,
          query: params.query,
          category: params.category,
          location: params.location
        });
        
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (err: any) {
        console.error('Failed to fetch events:', err);
        setError(err.response?.data?.error || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [params.query, params.category, params.location, params.page, params.limit]);

  return { events, loading, error, pagination };
};