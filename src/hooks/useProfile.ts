
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useProfile = (username?: string) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => username ? api.getUserProfile(username) : Promise.resolve(undefined),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useArtistDirectory = () => {
  return useQuery({
    queryKey: ['directory'],
    queryFn: api.getArtistDirectory,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
