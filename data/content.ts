
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
  },
  {
    id: 'j2',
    title: '3D Animator (Rigger)',
    company: 'Globant',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=100&fit=crop',
    location: 'Bogotá, Colombia',
    type: 'Contract',
    level: 'Mid',
    postedAt: 'Hace 5 horas',
    tags: ['Maya', 'Python', 'Rigging'],
    isFeatured: false,
    domain: 'creative'
  },
  {
    id: 'j3',
    title: 'Senior React Developer',
    company: 'TechFlow',
    companyLogo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100&fit=crop',
    location: 'Remoto',
    type: 'Full-time',
    level: 'Senior',
    postedAt: 'Hace 1 día',
    salary: '$5,000 - $7,000 USD',
    tags: ['React', 'TypeScript', 'Node.js'],
    isFeatured: true,
    domain: 'dev'
  },
  {
    id: 'j4',
    title: 'Backend Engineer (Go)',
    company: 'CloudScale',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100&fit=crop',
    location: 'São Paulo, Brasil',
    type: 'Full-time',
    level: 'Mid',
    postedAt: 'Hace 3 días',
    tags: ['Go', 'Microservices', 'Kubernetes'],
    isFeatured: false,
    domain: 'dev'
  },
  {
    id: 'j5',
    title: 'VFX Artist (Real-time)',
    company: 'Epic Games',
    companyLogo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=100&fit=crop',
    location: 'Remoto',
    type: 'Full-time',
    level: 'Senior',
    postedAt: 'Hace 1 semana',
    tags: ['Niagara', 'Unreal Engine', 'Shaders'],
    isFeatured: true,
    domain: 'creative'
  }
];

// --- CHALLENGES ---
export const CHALLENGE_ITEMS: ChallengeItem[] = [
  {
    id: 'ch1',
    title: 'Neon Nights: Cyberpunk City',
    description: 'Crea un entorno urbano futurista utilizando luces de neón y atmósfera densa. El enfoque debe estar en la narrativa visual.',
    coverImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&fit=crop',
    sponsor: 'NVIDIA Studio',
    sponsorLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&fit=crop',
    deadline: '30 Nov, 2024',
    daysLeft: 12,
    participants: 450,
    prizes: ['RTX 4090', 'Suscripción Adobe 1 año', 'Mentoria con Senior Artist'],
    status: 'Active',
    tags: ['3D Environment', 'Cyberpunk', 'Render'],
    domain: 'creative'
  },
  {
    id: 'ch2',
    title: 'Hackathon AI Agents',
    description: 'Desarrolla un agente de IA autónomo capaz de resolver tareas complejas. Usa LangChain o AutoGPT.',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&fit=crop',
    sponsor: 'OpenAI',
    sponsorLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&fit=crop',
    deadline: '20 Dic, 2024',
    daysLeft: 30,
    participants: 200,
    prizes: ['$5000 USD', 'Créditos API', 'Acceso anticipado a GPT-5'],
    status: 'Active',
    tags: ['AI', 'Python', 'LLM'],
    domain: 'dev'
  },
  {
    id: 'ch3',
    title: 'Creature Design: The Deep Sea',
    description: 'Diseña una criatura marina alienígena. Debe ser biológicamente plausible pero aterradora.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&fit=crop',
    sponsor: 'Wacom',
    sponsorLogo: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?q=80&w=100&fit=crop',
    deadline: '15 Dic, 2024',
    daysLeft: 25,
    participants: 890,
    prizes: ['Wacom Cintiq Pro 24', 'ZBrush License', 'ArtStation Pro'],
    status: 'Voting',
    tags: ['Concept Art', 'Creature', 'Organic'],
    domain: 'creative'
  },
  {
    id: 'ch4',
    title: 'Speed Sculpt: Mythology',
    description: 'Escultura rápida de 3 horas sobre mitología griega. Enfoque en anatomía y gesto.',
    coverImage: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&fit=crop',
    sponsor: 'Pixologic',
    sponsorLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    deadline: '01 Nov, 2024',
    daysLeft: 0,
    participants: 1200,
    prizes: ['ZBrush Subscription', '3D Print of Model'],
    status: 'Closed',
    tags: ['Sculpting', 'Anatomy', 'Speed'],
    domain: 'creative'
  },
  {
    id: 'ch5',
    title: 'Pixel Art Jam: Retro Future',
    description: 'Crea un escenario isométrico en pixel art con temática retro-futurista.',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&fit=crop',
    sponsor: 'Aseprite',
    sponsorLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop',
    deadline: '10 Oct, 2024',
    daysLeft: 0,
    participants: 600,
    prizes: ['Aseprite License', 'Steam Gift Card'],
    status: 'Closed',
    tags: ['Pixel Art', '2D', 'Retro'],
    domain: 'creative'
  }
];

// --- ARTIST DIRECTORY DATA ---
export const ARTIST_DIRECTORY: ArtistProfile[] = [
  {
    id: 'art1',
    name: 'Sofia Martinez',
    handle: '@sofia3d',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop',
    role: 'Character Artist',
    location: 'Buenos Aires, Argentina',
    skills: ['ZBrush', 'Maya', 'Substance'],
    followers: '12.5k',
    projects: 45,
    isPro: true,
    availableForWork: true,
    coverImage: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&fit=crop',
    domain: 'creative',
    level: 'Expert'
  },
  {
    id: 'dev1',
    name: 'Miguel Ángel',
    handle: '@miguelcode',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&fit=crop',
    role: 'Full Stack Developer',
    location: 'Medellín, Colombia',
    skills: ['React', 'Node.js', 'AWS'],
    followers: '3.2k',
    projects: 15,
    isPro: true,
    availableForWork: true,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&fit=crop',
    domain: 'dev',
    level: 'Pro'
  },
  {
    id: 'art2',
    name: 'Lucas Silva',
    handle: '@lucasvfx',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&fit=crop',
    role: 'VFX Artist',
    location: 'São Paulo, Brasil',
    skills: ['Houdini', 'Nuke', 'Unreal'],
    followers: '8.1k',
    projects: 22,
    isPro: false,
    availableForWork: false,
    coverImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&fit=crop',
    domain: 'creative',
    level: 'Novice'
  },
  {
    id: 'art3',
    name: 'Ana Torres',
    handle: '@anaconcept',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&fit=crop',
    role: 'Concept Artist',
    location: 'Santiago, Chile',
    skills: ['Photoshop', 'Blender', 'Procreate'],
    followers: '45k',
    projects: 120,
    isPro: true,
    availableForWork: true,
    coverImage: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=600&fit=crop',
    domain: 'creative',
    level: 'Master'
  }
];

// --- EVENT DATA ---
export const EVENT_ITEMS: EventItem[] = [
  {
    id: 'e1',
    title: 'Digital Sculpting Summit 2024',
    description: 'Únete a los mejores escultores digitales del mundo para un fin de semana de charlas, demos en vivo y networking. Aprende técnicas avanzadas en ZBrush y Blender.',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&fit=crop',
    organizer: 'Latam Creativa',
    organizerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&fit=crop',
    date: '15 Nov, 2024',
    month: 'NOV',
    day: '15',
    time: '10:00 AM - 6:00 PM',
    location: 'Online',
    type: 'Conferencia',
    price: 0,
    attendees: 1200,
    category: 'Escultura 3D',
    domain: 'creative'
  },
  {
    id: 'e2',
    title: 'React Conf Latam',
    description: 'La conferencia más grande de React en español. Charlas sobre Server Components, Performance y el futuro de la web.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&fit=crop',
    organizer: 'React Community',
    organizerAvatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=100&fit=crop',
    date: '20 Nov, 2024',
    month: 'NOV',
    day: '20',
    time: '9:00 AM - 5:00 PM',
    location: 'Bogotá, Colombia',
    type: 'Conferencia',
    price: 50,
    attendees: 500,
    category: 'Frontend',
    domain: 'dev'
  },
  {
    id: 'e3',
    title: 'Game Jam: Global Game Jam 2025',
    description: '48 horas para crear un juego desde cero. Únete a una de las sedes presenciales o participa online.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&fit=crop',
    organizer: 'GGJ Latam',
    organizerAvatar: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=100&fit=crop',
    date: '25 Ene, 2025',
    month: 'ENE',
    day: '25',
    time: '5:00 PM - Domingo',
    location: 'Híbrido',
    type: 'Hackathon',
    price: 0,
    attendees: 3500,
    category: 'Game Dev',
    domain: 'creative'
  }
];

// --- MEMBERSHIP TIERS ---
export const ARTIST_TIERS: MembershipTier[] = [
  {
    id: 't1',
    name: 'Supporter',
    price: 3,
    description: 'Apoya mi trabajo y obtén acceso anticipado a mis proyectos.',
    color: 'border-slate-500',
    perks: ['Acceso anticipado a posts', 'Insignia de Supporter', 'Canal exclusivo en Discord']
  },
  {
    id: 't2',
    name: 'Estudiante Pro',
    price: 10,
    description: 'Accede a los archivos fuente de mis tutoriales y desgloses.',
    color: 'border-amber-500',
    recommended: true,
    perks: ['Todo lo anterior', 'Archivos .BLEND y .SPP', 'Videos de timelapse completos', 'Descuento en la tienda']
  },
  {
    id: 't3',
    name: 'Mentoría',
    price: 50,
    description: 'Revisión mensual de tu portafolio y feedback directo.',
    color: 'border-purple-500',
    perks: ['Todo lo anterior', 'Feedback mensual en video', 'Llamada grupal mensual', 'Créditos en mis videos']
  }
];

// --- FORUM DATA ---
export const FORUM_ITEMS: ForumPost[] = [
  {
    id: 'fp1',
    title: '¿Problemas con el bake de normales en Substance Painter?',
    content: 'Hola a todos, estoy intentando bakear las normales de un modelo hard surface pero me salen artefactos extraños en los bordes curvos. He revisado los UVs y parecen estar bien. ¿Alguien sabe si es un problema de smoothing groups al exportar desde Blender?',
    author: 'Marcos3D',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&fit=crop',
    date: 'Hace 2 horas',
    category: 'Texturizado',
    tags: ['Substance', 'Baking', 'Blender'],
    views: 124,
    votes: 5,
    isSolved: false,
    domain: 'creative',
    replies: []
  },
  {
    id: 'fp_dev1',
    title: 'Error de hidratación en Next.js 14 con componentes de servidor',
    content: 'Tengo un error de "Hydration failed" cuando intento renderizar una fecha en el cliente que viene del servidor. ¿Cómo debo manejar las zonas horarias?',
    author: 'DevReact',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&fit=crop',
    date: 'Hace 1 hora',
    category: 'Frontend',
    tags: ['Next.js', 'React', 'Bug'],
    views: 56,
    votes: 3,
    isSolved: false,
    domain: 'dev',
    replies: []
  },
  {
    id: 'fp2',
    title: 'Mejor flujo de trabajo para retopología de personajes orgánicos',
    content: 'Estoy usando ZRemesher pero la topología no es lo suficientemente limpia para animación facial. ¿Recomiendan TopoGun o las herramientas nativas de Blender/Maya?',
    author: 'SculptMaster',
    authorAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100&fit=crop',
    date: 'Hace 5 horas',
    category: 'Modelado 3D',
    tags: ['Retopology', 'Character', 'Animation'],
    views: 89,
    votes: 12,
    isSolved: true,
    domain: 'creative',
    replies: []
  }
];

// --- FREELANCE SERVICES DATA ---
export const FREELANCE_SERVICES: FreelanceServiceItem[] = [
  {
    id: 'f1',
    title: 'Modelaré tu personaje 3D estilizado para videojuegos',
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
    description: 'Crearé un personaje 3D estilizado de alta calidad basado en tu concept art. Incluye topología optimizada para animación y texturas pintadas a mano.',
    domain: 'creative',
    packages: {
      basic: { price: 50, title: 'Básico', desc: 'Busto o Prop simple. Texturas básicas. 1 Revisión.', delivery: '3 días', revisions: 1 },
      standard: { price: 120, title: 'Estándar', desc: 'Personaje cuerpo completo. Rig básico. Texturas 2K.', delivery: '7 días', revisions: 3 },
      premium: { price: 250, title: 'Premium', desc: 'Personaje complejo + Accesorios. Rig avanzado facial. Texturas 4K. Archivos fuente.', delivery: '14 días', revisions: 5 }
    }
  },
  {
    id: 'fs_dev1',
    title: 'Desarrollaré tu API RESTful en Node.js y Express',
    seller: 'BackendPro',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    sellerLevel: 'Nivel 2',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&fit=crop'],
    startingPrice: 100,
    rating: 4.8,
    reviewCount: 45,
    category: 'Backend',
    deliveryTime: '7 días',
    description: 'API robusta, segura y documentada con Swagger. Incluye autenticación JWT y conexión a base de datos.',
    domain: 'dev',
    packages: {
        basic: { price: 100, title: 'Básico', desc: 'API simple con 5 endpoints. Sin auth.', delivery: '3 días', revisions: 1 },
        standard: { price: 250, title: 'Estándar', desc: 'API completa con Auth, DB y 15 endpoints.', delivery: '7 días', revisions: 2 },
        premium: { price: 500, title: 'Premium', desc: 'Arquitectura microservicios, tests y deploy.', delivery: '14 días', revisions: 3 }
    }
  },
  {
    id: 'f2',
    title: 'Rigging avanzado para personajes en Maya/Blender',
    seller: 'RigMaster',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&fit=crop',
    sellerLevel: 'Nivel 1',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=1200&fit=crop'],
    startingPrice: 80,
    rating: 4.7,
    reviewCount: 22,
    category: 'Animación',
    deliveryTime: '4 días',
    description: 'Rig corporal y facial completo listo para animación. Compatible con Unreal Engine y Unity.',
    domain: 'creative',
    packages: {
        basic: { price: 80, title: 'Básico', desc: 'Rig corporal bipedo standard.', delivery: '4 días', revisions: 2 },
        standard: { price: 150, title: 'Estándar', desc: 'Rig corporal + facial básico (blendshapes).', delivery: '7 días', revisions: 3 },
        premium: { price: 300, title: 'Premium', desc: 'Rig completo con controles avanzados y físicas.', delivery: '10 días', revisions: 5 }
    }
  }
];

// --- COMMUNITY GROUPS DATA ---
export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 'g1',
    name: 'Project Chronos - RPG Sci-Fi',
    description: 'Estamos creando un RPG de acción ambientado en una ciudad futurista. Buscamos artistas apasionados para completar nuestro equipo principal para la próxima Game Jam.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&fit=crop',
    leader: 'Alex Dev',
    leaderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    membersCount: 4,
    rolesNeeded: ['Concept Artist', 'Unity Developer', 'VFX Artist'],
    tags: ['Unity', 'RPG', 'Sci-Fi'],
    status: 'Reclutando',
    postedTime: 'Hace 2 horas',
    domain: 'creative'
  },
  {
    id: 'g_dev1',
    name: 'Open Source Library: React-Motion-X',
    description: 'Buscamos colaboradores para mantener y mejorar una librería de animaciones open source para React.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&fit=crop',
    leader: 'GitMaster',
    leaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    membersCount: 12,
    rolesNeeded: ['Maintainer', 'Contributor', 'Doc Writer'],
    tags: ['React', 'Open Source', 'TypeScript'],
    status: 'En Progreso',
    postedTime: 'Hace 1 día',
    domain: 'dev'
  },
  {
    id: 'g2',
    name: 'Cortometraje 2D: "El último árbol"',
    description: 'Animación tradicional frame-by-frame sobre la conservación ambiental. Estilo Ghibli.',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&fit=crop',
    leader: 'Maria Ani',
    leaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop',
    membersCount: 3,
    rolesNeeded: ['Background Artist', 'Clean-up Artist', 'Compositor'],
    tags: ['2D Animation', 'Short Film', 'Nature'],
    status: 'Reclutando',
    postedTime: 'Hace 3 días',
    domain: 'creative'
  }
];

// --- ASSET MARKET DATA ---
export const ASSET_ITEMS: AssetItem[] = [
  {
    id: 'a1',
    title: 'Kitbash Urbano Cyberpunk Vol. 1',
    creator: 'Neon Assets',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&fit=crop'
    ],
    price: 29.99,
    rating: 4.8,
    reviewCount: 124,
    category: 'Modelos 3D',
    formats: ['FBX', 'OBJ', 'BLEND'],
    fileSize: '2.4 GB',
    license: 'Standard',
    likes: 450,
    description: 'Colección completa de más de 50 edificios y props callejeros para entornos sci-fi. Texturas PBR 4K incluidas.',
    domain: 'creative',
    technicalSpecs: {
      vertices: '1.2M',
      polygons: '1.1M',
      textures: true,
      materials: true,
      uvMapped: true
    }
  },
  {
    id: 'a_dev1',
    title: 'React Admin Dashboard Template',
    creator: 'UI Themes',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&fit=crop'],
    price: 49.00,
    rating: 4.9,
    reviewCount: 85,
    category: 'Templates',
    formats: ['React', 'Next.js', 'TS'],
    fileSize: '15 MB',
    license: 'Standard',
    likes: 200,
    description: 'Dashboard administrativo completo con gráficos, tablas y autenticación integrada. Construido con Tailwind CSS.',
    domain: 'dev',
    technicalSpecs: {}
  },
  {
    id: 'a2',
    title: 'Ultimate Nature Pack - Forest',
    creator: 'EcoDigital',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&fit=crop'],
    price: 39.99,
    rating: 4.7,
    reviewCount: 56,
    category: 'Modelos 3D',
    formats: ['Unreal', 'Unity', 'FBX'],
    fileSize: '4.1 GB',
    license: 'Standard',
    likes: 310,
    description: 'Árboles, rocas, hierba y plantas fotorealistas escaneadas. LODs incluidos para optimización.',
    domain: 'creative',
    technicalSpecs: {
        textures: true,
        materials: true
    }
  },
  {
    id: 'a3',
    title: 'Sci-Fi Weapon Sound Effects',
    creator: 'AudioLab',
    creatorAvatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&fit=crop'],
    price: 14.99,
    rating: 4.5,
    reviewCount: 30,
    category: 'Audio',
    formats: ['WAV', 'MP3'],
    fileSize: '500 MB',
    license: 'Standard',
    likes: 120,
    description: 'Más de 200 efectos de sonido de armas láser, explosiones y recargas futuristas.',
    domain: 'creative'
  },
  {
    id: 'a4',
    title: 'Stylized Dungeon Texture Set',
    creator: 'PixelForge',
    creatorAvatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&fit=crop'],
    price: 19.99,
    rating: 4.9,
    reviewCount: 210,
    category: 'Texturas',
    formats: ['PNG', 'TGA'],
    fileSize: '800 MB',
    license: 'Standard',
    likes: 550,
    description: 'Texturas tileables pintadas a mano para mazmorras y castillos. Normals y Height maps incluidos.',
    domain: 'creative',
    technicalSpecs: {
        textures: true
    }
  }
];

// --- PORTFOLIO DATA (EXPANDED) ---
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Cyberpunk Street Vendor',
    artist: 'Alejandro M.',
    artistAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&fit=crop',
    views: '12.5k',
    likes: '1.2k',
    category: 'Modelado 3D',
    description: 'Una escena nocturna inspirada en las calles de Neo-Tokyo. Modelado en Blender y texturizado en Substance Painter.',
    domain: 'creative',
    images: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1200&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&fit=crop', 
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&fit=crop'
    ],
    software: ['Blender', 'Substance Painter', 'Photoshop']
  },
  {
    id: 'p2',
    title: 'Ancient Warrior Character',
    artist: 'Sofia R.',
    artistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&fit=crop',
    views: '8.2k',
    likes: '950',
    category: 'Escultura',
    description: 'Escultura digital de un guerrero antiguo. Enfoque en anatomía y detalles de armadura desgastada.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1200&fit=crop'],
    software: ['ZBrush', 'Maya', 'Marmoset']
  },
  {
    id: 'p3',
    title: 'Isometric Room Design',
    artist: 'Kenji S.',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&fit=crop',
    views: '15k',
    likes: '2.1k',
    category: 'Concept Art',
    description: 'Diseño isométrico de una habitación de hacker. Iluminación y composición en Blender.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&fit=crop'],
    software: ['Blender', 'Cycles']
  },
  {
    id: 'p4',
    title: 'Abstract Motion Loop',
    artist: 'Elena G.',
    artistAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&fit=crop',
    views: '5.6k',
    likes: '400',
    category: 'Motion Graphics',
    description: 'Loop abstracto creado con Cinema 4D y X-Particles.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&fit=crop'],
    software: ['Cinema 4D', 'Redshift']
  },
  {
    id: 'p5',
    title: 'Realistic Portrait Study',
    artist: 'Marco P.',
    artistAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&fit=crop',
    views: '10k',
    likes: '1.5k',
    category: 'Modelado 3D',
    description: 'Estudio de retrato realista. Piel con texturing.xyz y pelo con XGen.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&fit=crop'],
    software: ['Maya', 'Arnold', 'ZBrush']
  },
  {
    id: 'p6',
    title: 'Stylized Game Asset: Sword',
    artist: 'Anna L.',
    artistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=600&fit=crop',
    views: '3.4k',
    likes: '250',
    category: 'Game Dev',
    description: 'Espada estilizada pintada a mano para un RPG de fantasía.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&fit=crop'],
    software: ['Blender', 'Substance Painter']
  },
  {
    id: 'p7',
    title: 'Post-Apocalyptic Environment',
    artist: 'David B.',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=600&fit=crop',
    views: '18k',
    likes: '2.8k',
    category: 'Modelado 3D',
    description: 'Entorno de juego en Unreal Engine 5 utilizando Lumen y Nanite.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=1200&fit=crop'],
    software: ['Unreal Engine 5', 'Quixel Megascans']
  },
  {
    id: 'p8',
    title: '2D Animation Reel 2024',
    artist: 'Clara M.',
    artistAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&fit=crop',
    views: '9.1k',
    likes: '800',
    category: 'Animación 2D',
    description: 'Recopilación de mis mejores trabajos de animación tradicional y cut-out del año.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&fit=crop'],
    software: ['Toon Boom Harmony', 'After Effects']
  },
  {
    id: 'p9',
    title: 'Creature Concept: Swamp Lurker',
    artist: 'Tom H.',
    artistAvatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&fit=crop',
    views: '6.7k',
    likes: '550',
    category: 'Concept Art',
    description: 'Diseño de criatura para un juego de terror. Bocetos y render final.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&fit=crop'],
    software: ['Photoshop', 'ZBrush']
  },
  {
    id: 'p10',
    title: 'VFX Explosion Study',
    artist: 'Lucas S.',
    artistAvatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&fit=crop',
    views: '4.2k',
    likes: '320',
    category: 'VFX',
    description: 'Simulación de explosión y humo en Houdini, renderizado en Mantra.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&fit=crop'],
    software: ['Houdini', 'Nuke']
  },
  {
    id: 'p11',
    title: 'Pixel Art City',
    artist: 'PixelJunkie',
    artistAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&fit=crop',
    views: '11k',
    likes: '1.8k',
    category: 'Arte 2D',
    description: 'Escena urbana detallada en pixel art. Paleta de colores limitada.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&fit=crop'],
    software: ['Aseprite']
  },
  {
    id: 'p12',
    title: 'ArchViz Interior: Minimalist Loft',
    artist: 'Sarah Arch',
    artistAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&fit=crop',
    views: '14k',
    likes: '2.5k',
    category: 'ArchViz',
    description: 'Visualización arquitectónica fotorrealista de un loft minimalista.',
    domain: 'creative',
    images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&fit=crop'],
    software: ['3ds Max', 'Corona Renderer']
  },
  {
    id: 'p_dev1',
    title: 'E-commerce Platform: ShopNext',
    artist: 'David Code',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=600&fit=crop',
    views: '5.2k',
    likes: '340',
    category: 'Full Stack',
    description: 'Plataforma de comercio electrónico completa con carrito, pagos via Stripe y panel de administración.',
    domain: 'dev',
    software: ['Next.js', 'Stripe', 'PostgreSQL']
  },
  {
    id: 'p_dev2',
    title: 'AI Chatbot Interface',
    artist: 'Sarah UI',
    artistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&fit=crop',
    views: '8.1k',
    likes: '600',
    category: 'UI/UX Design',
    description: 'Diseño de interfaz para un asistente virtual impulsado por IA. Enfoque en accesibilidad y micro-interacciones.',
    domain: 'dev',
    software: ['Figma', 'React']
  },
  {
    id: 'p_dev3',
    title: '3D Portfolio Website',
    artist: 'WebWizard',
    artistAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&fit=crop',
    views: '9.5k',
    likes: '1.1k',
    category: 'Frontend',
    description: 'Sitio web personal interactivo utilizando Three.js y React Fiber para mostrar modelos 3D en la web.',
    domain: 'dev',
    software: ['React Three Fiber', 'WebGL']
  },
  {
    id: 'p_dev4',
    title: 'DevOps CI/CD Pipeline Visualizer',
    artist: 'CloudNinja',
    artistAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=600&fit=crop',
    views: '3.2k',
    likes: '210',
    category: 'DevOps',
    description: 'Herramienta para visualizar pipelines de Jenkins y GitHub Actions en tiempo real.',
    domain: 'dev',
    software: ['D3.js', 'Docker', 'Go']
  }
];

// --- BLOG DATA (EXPANDED) ---
export const BLOG_ITEMS: ArticleItem[] = [
  {
    id: 'b1',
    title: 'El Futuro del Renderizado en Tiempo Real',
    excerpt: 'Analizamos cómo Unreal Engine 5 está cambiando la industria del cine y la animación.',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&fit=crop',
    author: 'Carlos Ruiz',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop',
    date: '12 Oct, 2023',
    readTime: '5 min',
    category: 'Tecnología',
    likes: 342,
    comments: 15,
    domain: 'creative',
    content: `<p class="lead">La convergencia entre el cine y los videojuegos es más real que nunca...</p>`
  },
  {
    id: 'b2',
    title: '10 Tips para mejorar tu portafolio de Concept Art',
    excerpt: 'Directores de arte comparten qué buscan exactamente cuando contratan a un artista junior.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&fit=crop',
    author: 'Elena Art',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop',
    date: '05 Nov, 2023',
    readTime: '6 min',
    category: 'Carrera',
    likes: 520,
    comments: 23,
    domain: 'creative',
    content: `<p>Tu portafolio es tu carta de presentación. Aquí te decimos cómo pulirlo.</p>`
  },
  {
    id: 'b3',
    title: 'Introducción a Rigging en Blender',
    excerpt: 'Aprende los fundamentos para crear huesos y controladores para tus personajes.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=600&fit=crop',
    author: 'RigDoctor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    date: '20 Nov, 2023',
    readTime: '10 min',
    category: 'Tutorial',
    likes: 890,
    comments: 67,
    domain: 'creative',
    content: `<p>El rigging puede parecer intimidante, pero con Rigify es más fácil de lo que crees.</p>`
  },
  {
    id: 'b4',
    title: 'IA Generativa: ¿Herramienta o Amenaza?',
    excerpt: 'Un debate sobre el impacto de Midjourney y Stable Diffusion en el trabajo del artista.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&fit=crop',
    author: 'TechDaily',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&fit=crop',
    date: '01 Dic, 2023',
    readTime: '8 min',
    category: 'Opinión',
    likes: 1500,
    comments: 340,
    domain: 'creative',
    content: `<p>La inteligencia artificial ha llegado para quedarse. ¿Cómo nos adaptamos?</p>`
  },
  {
    id: 'b_dev1',
    title: '¿Por qué TypeScript ganó la guerra?',
    excerpt: 'Un análisis profundo sobre la adopción masiva de TypeScript en el desarrollo web moderno.',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&fit=crop',
    author: 'Dev Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?q=80&w=100&fit=crop',
    date: '15 Nov, 2023',
    readTime: '8 min',
    category: 'Frontend',
    likes: 1200,
    comments: 45,
    domain: 'dev',
    content: `<p class="lead">JavaScript es el lenguaje de la web, pero TypeScript es el lenguaje de la escalabilidad.</p>`
  }
];

// --- EDUCATION DATA (EXPANDED) ---
export const EDUCATION_ITEMS: CourseItem[] = [
  {
    id: 'c1',
    title: 'Blender 4.0: De Cero a Profesional',
    instructor: 'Carlos Rodriguez',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=600&fit=crop',
    rating: 4.8,
    reviewCount: 2340,
    students: 15400,
    price: 14.99,
    originalPrice: 89.99,
    duration: '22h 30m',
    lectures: 145,
    level: 'Principiante',
    bestseller: true,
    category: 'Modelado 3D',
    updatedDate: 'Oct 2023',
    domain: 'creative'
  },
  {
    id: 'c2',
    title: 'ZBrush: Escultura de Personajes Avanzada',
    instructor: 'Sofia Martinez',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?q=80&w=600&fit=crop',
    rating: 4.9,
    reviewCount: 890,
    students: 5200,
    price: 24.99,
    originalPrice: 99.99,
    duration: '18h 15m',
    lectures: 80,
    level: 'Avanzado',
    category: 'Escultura',
    updatedDate: 'Sep 2023',
    domain: 'creative'
  },
  {
    id: 'c3',
    title: 'Unreal Engine 5 para Cine y TV',
    instructor: 'Virtual Prod',
    instructorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1616428330761-d7037f4044a8?q=80&w=600&fit=crop',
    rating: 4.7,
    reviewCount: 450,
    students: 2100,
    price: 19.99,
    originalPrice: 79.99,
    duration: '15h 45m',
    lectures: 65,
    level: 'Intermedio',
    category: 'VFX',
    updatedDate: 'Dic 2023',
    domain: 'creative'
  },
  {
    id: 'c4',
    title: 'Concept Art de Escenarios con Photoshop',
    instructor: 'Ana Torres',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&fit=crop',
    rating: 4.6,
    reviewCount: 1200,
    students: 8900,
    price: 12.99,
    originalPrice: 49.99,
    duration: '8h 20m',
    lectures: 40,
    level: 'Principiante',
    category: 'Concept Art',
    updatedDate: 'Ago 2023',
    domain: 'creative'
  },
  {
    id: 'c_dev1',
    title: 'React Avanzado: Patrones de Diseño',
    instructor: 'Fernando Dev',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&fit=crop',
    rating: 4.9,
    reviewCount: 500,
    students: 3000,
    price: 19.99,
    originalPrice: 79.99,
    duration: '10h 15m',
    lectures: 40,
    level: 'Avanzado',
    category: 'Frontend',
    updatedDate: 'Nov 2023',
    domain: 'dev'
  }
];

// --- VIDEO / FEED DATA ---
export const COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: "La forma en que explicaste las fuerzas de campo cambió completamente mi flujo de trabajo. ¡Increíble tutorial como siempre!",
    timeAgo: 'hace 2 días',
    likes: 24
  }
];

export const UP_NEXT: VideoSuggestion[] = [
  {
    id: '1',
    title: 'Entornos Cyberpunk en Blender',
    channel: 'Neon Arts',
    views: '45K vistas',
    timeAgo: 'hace 2 días',
    duration: '10:24',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop'
  }
];

export const HOME_FEED_VIDEOS: VideoSuggestion[] = [
  {
    id: 'h1',
    title: 'Iluminación Cinemática en Unreal Engine 5',
    channel: 'Unreal Sensei',
    views: '250K vistas',
    timeAgo: 'hace 1 día',
    duration: '24:12',
    thumbnail: 'https://images.unsplash.com/photo-1616428330761-d7037f4044a8?q=80&w=400&auto=format&fit=crop'
  }
];

export const USER_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col1',
    title: 'Inspiración Cyberpunk',
    itemCount: 42,
    isPrivate: false,
    thumbnails: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&fit=crop'
    ]
  },
  {
    id: 'col2',
    title: 'Referencias Anatomía',
    itemCount: 15,
    isPrivate: true,
    thumbnails: [
      'https://images.unsplash.com/photo-1579783902614-a3fb39279c71?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&fit=crop'
    ]
  }
];

// Fallback / Content Map logic
export const CATEGORY_CONTENT_MAP: Record<string, VideoSuggestion[]> = {
  'Home': HOME_FEED_VIDEOS
};
