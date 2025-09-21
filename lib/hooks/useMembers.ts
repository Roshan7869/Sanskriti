import { useQuery } from '@tanstack/react-query';
import { membersAPI } from '@/lib/services/api';
import { Member } from '@/lib/types/api';

const staleTime = 1000 * 60 * 5; // 5 minutes

export const useMembers = (params?: { limit?: number }) => {
  return useQuery<{ members: Member[] }, Error>({
    queryKey: ['members', params],
    queryFn: () => membersAPI.getFeaturedMembers(params),
    staleTime,
    enabled: !!params,
  });
};
