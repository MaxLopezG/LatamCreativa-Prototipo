
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: api.getFeed,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
};
