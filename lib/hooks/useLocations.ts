import { useQuery } from '@tanstack/react-query';
import { locationsAPI } from '@/lib/services/api';
import { Location } from '@/lib/types/api';

const staleTime = 1000 * 60 * 5; // 5 minutes

interface UseLocationsParams {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export const useLocations = (params: UseLocationsParams) => {
  return useQuery<{ locations: Location[]; pagination: any }, Error>({
    queryKey: ['locations', params],
    queryFn: () => locationsAPI.getLocations(params),
    staleTime,
  });
};

export const useLocationById = (id: string) => {
  return useQuery<Location, Error>({
    queryKey: ['location', id],
    queryFn: () => locationsAPI.getLocationById(id),
    staleTime,
    enabled: !!id, // Only run query if id is provided
  });
};
