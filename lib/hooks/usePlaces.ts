import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { placesAPI } from '@/lib/services/api';
import { HistoricalPlace } from '@/lib/types/api';

interface UsePlacesParams {
  query?: string;
  page?: number;
  limit?: number;
}

export const usePlaces = (params: UsePlacesParams = {}) => {
  const queryKey = ['places', params];
  
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => placesAPI.getPlaces({
      page: params.page || 1,
      limit: params.limit || 10,
      query: params.query
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  return {
    places: data?.places || [],
    pagination: data?.pagination,
    loading,
    error: error?.message || null,
    refetch
  };
};