
import { PortfolioItem, ArticleItem, VideoSuggestion, Comment, CourseItem, AssetItem, CommunityGroup, FreelanceServiceItem, MembershipTier, ForumPost, EventItem, ArtistProfile, ChallengeItem, JobItem, CollectionItem } from '../types';

// --- JOB LISTINGS ---
export const JOB_ITEMS: JobItem[] = [
  {
    id: 'j1',
    title: 'Senior Environment Artist',
    company: 'Ubisoft',
    companyLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&fit=crop',
    location: 'Remoto / Ciudad de México',
    type: 'Full-time',
    level: 'Senior',
    postedAt: 'Hace 2 días',
    salary: '$4,000 - $6,000 USD',
    tags: ['Unreal Engine', '3D Modeling', 'AAA'],
    isFeatured: true,
    domain: 'creative'
  }
];

// --- CHALLENGES ---
export const CHALLENGE_ITEMS: ChallengeItem[] = [
  {
    id: 'ch1',
    title: 'Neon Nights: Cyberpunk City',
    description: 'Crea un entorno urbano futurista.',
    coverImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&fit=crop',
    sponsor: 'NVIDIA Studio',
    sponsorLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&fit=crop',
    deadline: '30 Nov, 2024',
    daysLeft: 12,
    participants: 450,
    prizes: ['RTX 4090'],
    status: 'Active',
    tags: ['3D', 'Cyberpunk'],
    domain: 'creative'
  }
];

// --- ARTIST DIRECTORY ---
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
    avatar: 'https://ui-avatars.com/api/?name=G+U&background=random', // Edge case: Generated avatar
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

// --- EVENTS ---
export const EVENT_ITEMS: EventItem[] = [
  {
    id: 'e1',
    title: 'Digital Sculpting Summit 2024',
    description: 'Evento online.',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&fit=crop',
    organizer: 'Latam Creativa',
    organizerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&fit=crop',
    date: '15 Nov, 2024',
    month: 'NOV',
    day: '15',
    time: '10:00 AM',
    location: 'Online',
    type: 'Conferencia',
    price: 0,
    attendees: 1200,
    category: '3D',
    domain: 'creative'
  }
];

// --- TIERS ---
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

// --- FORUM ---
export const FORUM_ITEMS: ForumPost[] = [
  {
    id: 'fp1',
    title: '¿Problemas con el bake?',
    content: 'Ayuda con substance.',
    author: 'Marcos3D',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&fit=crop',
    date: 'Hace 2 horas',
    category: 'Texturizado',
    tags: ['Substance'],
    views: 124,
    votes: 5,
    isSolved: false,
    domain: 'creative',
    replies: []
  }
];

// --- FREELANCE ---
export const FREELANCE_SERVICES: FreelanceServiceItem[] = [
  {
    id: 'f1',
    title: 'Modelaré tu personaje 3D estilizado',
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

// --- COMMUNITY ---
export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 'g1',
    name: 'Project Chronos',
    description: 'RPG Sci-Fi.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&fit=crop',
    leader: 'Alex Dev',
    leaderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    membersCount: 4,
    rolesNeeded: ['Concept Artist'],
    tags: ['Unity'],
    status: 'Reclutando',
    postedTime: 'Hace 2 horas',
    domain: 'creative'
  }
];

// --- ASSETS ---
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
    title: 'Free Texture Pack', // Edge case: Free item
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

// --- PORTFOLIO ---
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
    title: 'Un proyecto con un título extremadamente largo para probar cómo se comporta el truncado en la tarjeta de la interfaz de usuario', // Edge case
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

// --- BLOG ---
export const BLOG_ITEMS: ArticleItem[] = [
  {
    id: 'b1',
    title: 'Futuro del Render',
    excerpt: 'UE5 está cambiando todo.',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&fit=crop',
    author: 'Carlos Ruiz',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop',
    date: '12 Oct',
    readTime: '5 min',
    category: 'Tech',
    likes: 342,
    comments: 15,
    domain: 'creative'
  }
];

// --- EDUCATION ---
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

export const COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: "Excelente tutorial.",
    timeAgo: '2d',
    likes: 24
  }
];

export const UP_NEXT: VideoSuggestion[] = [];
export const HOME_FEED_VIDEOS: VideoSuggestion[] = [
    { id: 'h1', title: 'UE5 Lighting', channel: 'Unreal Sensei', views: '250K', timeAgo: '1d', duration: '24:12', thumbnail: 'https://images.unsplash.com/photo-1616428330761-d7037f4044a8?q=80&w=400&fit=crop' }
];

export const USER_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col1',
    title: 'Inspiración',
    itemCount: 42,
    isPrivate: false,
    thumbnails: ['https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&fit=crop']
  }
];

export const CATEGORY_CONTENT_MAP: Record<string, VideoSuggestion[]> = {
  'Home': HOME_FEED_VIDEOS
};
