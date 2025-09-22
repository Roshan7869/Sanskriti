import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '@/lib/services/api';
import { Event } from '@/lib/types/api';

interface UseEventsParams {
  query?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export const useEvents = (params: UseEventsParams = {}) => {
  const queryKey = ['events', params];
  
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => eventsAPI.getEvents({
      page: params.page || 1,
      limit: params.limit || 10,
      query: params.query,
      category: params.category,
      location: params.location
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  return {
    events: data?.events || [],
    pagination: data?.pagination,
    loading,
    error: error?.message || null,
    refetch
  };
};