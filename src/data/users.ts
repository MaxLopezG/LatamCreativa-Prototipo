
import { ArtistProfile, MembershipTier } from '../types';

export const ARTIST_DIRECTORY: ArtistProfile[] = [
  {
    id: 'art1',
    name: 'Sofia Martinez',
    handle: '@sofia3d',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop',
    role: 'Character Artist',
    location: 'Buenos Aires',
    skills: ['ZBrush', 'Maya'],
    followers: '12.5k',
    projects: 45,
    isPro: true,
    availableForWork: true,
    coverImage: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&fit=crop',
    domain: 'creative'
  },
  {
    id: 'ghost1',
    name: 'Ghost User',
    handle: '@ghost',
    avatar: 'https://ui-avatars.com/api/?name=G+U&background=random',
    role: 'Junior Dev',
    location: 'Unknown',
    skills: ['HTML'],
    followers: '0',
    projects: 0,
    isPro: false,
    availableForWork: false,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&fit=crop',
    domain: 'dev'
  }
];

export const ARTIST_TIERS: MembershipTier[] = [
  {
    id: 't1',
    name: 'Supporter',
    price: 3,
    description: 'Apoyo básico.',
    color: 'border-slate-500',
    perks: ['Acceso anticipado']
  }
];
