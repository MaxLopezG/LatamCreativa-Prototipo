
import { FreelanceServiceItem } from '../types';

export const FREELANCE_SERVICES: FreelanceServiceItem[] = [
  {
    id: 'f1',
    title: 'Modelaré tu personaje 3D rico rico',
    seller: 'Anna 3D',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop',
    sellerLevel: 'Top Rated',
    thumbnail: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&fit=crop'],
    startingPrice: 50,
    rating: 4.9,
    reviewCount: 320,
    category: 'Modelado 3D',
    deliveryTime: '5 días',
    description: 'Personaje 3D de alta calidad.',
    domain: 'creative',
    packages: {
      basic: { price: 50, title: 'Básico', desc: 'Busto.', delivery: '3 días', revisions: 1 },
      standard: { price: 120, title: 'Estándar', desc: 'Cuerpo completo.', delivery: '7 días', revisions: 3 },
      premium: { price: 250, title: 'Premium', desc: 'Complejo.', delivery: '14 días', revisions: 5 }
    }
  }
];
