
import { CourseItem } from '../types';

export const EDUCATION_ITEMS: CourseItem[] = [
  {
    id: 'c1',
    title: 'Blender 4.0 Pro',
    instructor: 'Carlos Rodriguez',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=600&fit=crop',
    rating: 4.8,
    reviewCount: 2340,
    students: 15400,
    price: 14.99,
    originalPrice: 89.99,
    duration: '22h',
    lectures: 145,
    level: 'Principiante',
    bestseller: true,
    category: '3D',
    updatedDate: 'Oct 2023',
    domain: 'creative'
  },
  {
    id: 'c_dev1',
    title: 'React Advanced Patterns',
    instructor: 'Fernando Dev',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&fit=crop',
    rating: 4.9,
    reviewCount: 500,
    students: 3000,
    price: 19.99,
    duration: '10h',
    lectures: 40,
    level: 'Avanzado',
    category: 'Frontend',
    updatedDate: 'Nov 2023',
    domain: 'dev'
  }
];
