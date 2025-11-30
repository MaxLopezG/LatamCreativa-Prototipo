
import { AssetItem } from '../types';

export const ASSET_ITEMS: AssetItem[] = [
  {
    id: 'a1',
    title: 'Kitbash Urbano Cyberpunk',
    creator: 'Neon Assets',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&fit=crop'],
    price: 29.99,
    rating: 4.8,
    reviewCount: 124,
    category: 'Modelos 3D',
    formats: ['FBX'],
    fileSize: '2.4 GB',
    license: 'Standard',
    likes: 450,
    description: 'Colección sci-fi.',
    domain: 'creative',
    technicalSpecs: { textures: true, materials: true }
  },
  {
    id: 'a_free',
    title: 'Free Texture Pack',
    creator: 'Freebie',
    creatorAvatar: 'https://ui-avatars.com/api/?name=Free',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&fit=crop'],
    price: 0,
    rating: 4.5,
    reviewCount: 2000,
    category: 'Texturas',
    formats: ['PNG'],
    fileSize: '100 MB',
    license: 'Standard',
    likes: 5000,
    description: 'Free textures.',
    domain: 'creative'
  }
];
