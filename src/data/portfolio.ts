
import { PortfolioItem } from '../types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Cyberpunk Vendor',
    artist: 'Alejandro M.',
    artistAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&fit=crop',
    views: '12.5k',
    likes: '1.2k',
    category: 'Modelado 3D',
    description: 'Escena nocturna.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1200&fit=crop'],
    software: ['Blender']
  },
  {
    id: 'p_long',
    title: 'Un proyecto con un título extremadamente largo para probar cómo se comporta el truncado en la tarjeta de la interfaz de usuario',
    artist: 'Tester',
    artistAvatar: 'https://ui-avatars.com/api/?name=Test',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&fit=crop',
    views: '100',
    likes: '10',
    category: 'Test',
    domain: 'creative'
  },
  {
    id: 'p_dev1',
    title: 'E-commerce Platform',
    artist: 'David Code',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=600&fit=crop',
    views: '5.2k',
    likes: '340',
    category: 'Full Stack',
    description: 'Plataforma de comercio electrónico.',
    domain: 'dev',
    software: ['Next.js']
  }
];
