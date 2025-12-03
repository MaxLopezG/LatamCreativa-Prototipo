import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: api.getFeed,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};