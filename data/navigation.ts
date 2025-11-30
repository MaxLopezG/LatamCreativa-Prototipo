
import {
  Home, Move3d, MonitorPlay, Clapperboard, Gamepad2, GraduationCap, Palette, Box, Users,
  ImageIcon, Store, Newspaper, Compass, Flame, Clock, Layout, Briefcase, MessageCircleQuestion, CalendarDays, UsersRound, Trophy, Building2, Bookmark,
  PenTool, Cuboid, Brush, Camera, Lightbulb, Code, Smartphone, Server, Database, Cloud, Cpu, Terminal
} from 'lucide-react';
import { NavItem, NavSection, Subscription, Chip, CategoryItem } from '../types';

// --- MAIN SIDEBAR MODULES (REORDERED LOGICALLY) ---
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  // 1. Navigation Base
  { id: 'home', icon: Home, label: 'Inicio' }, 

  // 2. Showcase (Visual Core)
  { id: 'portfolio', icon: ImageIcon, label: 'Portafolio' },

  // 3. Professional & Growth (Career/Money)
  { id: 'jobs', icon: Building2, label: 'Empleos' },
  { id: 'freelance', icon: Briefcase, label: 'Freelance' },
  { id: 'market', icon: Store, label: 'Mercado' },
  { id: 'education', icon: GraduationCap, label: 'Educación' },

  // 4. Collaboration & Community (Interaction)
  { id: 'community', icon: Users, label: 'Proyectos' }, 
  { id: 'challenges', icon: Trophy, label: 'Retos' },
  { id: 'events', icon: CalendarDays, label: 'Eventos' },
  { id: 'people', icon: UsersRound, label: 'Comunidad' }, 
  { id: 'forum', icon: MessageCircleQuestion, label: 'Foro' },

  // 5. Content & News
  { id: 'blog', icon: Newspaper, label: 'Blog' },

  // 6. Personal Utilities
  { id: 'collections', icon: Bookmark, label: 'Colecciones' }, 
];

// --- SECONDARY SIDEBAR ITEMS (CREATIVE) ---
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Descubrir',
    items: [
      { icon: Compass, label: 'Home', subLabel: 'Para ti', active: true },
      { icon: Flame, label: 'Tendencias', subLabel: 'Viral hoy' },
      { icon: Clock, label: 'Nuevos', subLabel: 'Recién salidos' },
    ]
  },
  {
    title: '3D & CGI',
    items: [
      { icon: Move3d, label: 'Modelado 3D', subLabel: 'Hard Surface, Organic' },
      { icon: Cuboid, label: 'Escultura', subLabel: 'ZBrush, Mudbox' },
      { icon: Brush, label: 'Texturizado', subLabel: 'Substance, Mari' },
      { icon: Users, label: 'ArchViz', subLabel: 'Interiores, Arquitectura' },
    ]
  },
  {
    title: 'Animación & Cine',
    items: [
      { icon: MonitorPlay, label: 'Animación 3D', subLabel: 'Personajes, Rigging' },
      { icon: Clapperboard, label: 'Animación 2D', subLabel: 'Tradicional, Cut-out' },
      { icon: Box, label: 'VFX', subLabel: 'Simulaciones, Comp' },
      { icon: Camera, label: 'Motion Graphics', subLabel: 'Publicidad, Title Seq' },
    ]
  },
  {
    title: 'Desarrollo de Juegos',
    items: [
      { icon: Gamepad2, label: 'Game Dev', subLabel: 'Unity, Unreal' },
      { icon: Lightbulb, label: 'Level Design', subLabel: 'Entornos, Lighting' },
    ]
  },
  {
    title: 'Arte 2D',
    items: [
      { icon: Palette, label: 'Concept Art', subLabel: 'Personajes, Fondos' },
      { icon: PenTool, label: 'Ilustración', subLabel: 'Digital, Vectorial' },
    ]
  }
];

// --- SECONDARY SIDEBAR ITEMS (DEVELOPER) ---
export const NAV_SECTIONS_DEV: NavSection[] = [
  {
    title: 'Descubrir',
    items: [
      { icon: Compass, label: 'Home', subLabel: 'Tech Feed', active: true },
      { icon: Flame, label: 'Tendencias', subLabel: 'GitHub Stars' },
      { icon: Clock, label: 'Nuevos', subLabel: 'Lanzamientos' },
    ]
  },
  {
    title: 'Desarrollo Web',
    items: [
      { icon: Code, label: 'Frontend', subLabel: 'React, Vue, Angular' },
      { icon: Server, label: 'Backend', subLabel: 'Node, Python, Go' },
      { icon: Palette, label: 'UI/UX Code', subLabel: 'CSS, Tailwind, Animation' },
    ]
  },
  {
    title: 'Infraestructura',
    items: [
      { icon: Cloud, label: 'DevOps', subLabel: 'AWS, Docker, K8s' },
      { icon: Database, label: 'Base de Datos', subLabel: 'SQL, NoSQL, Redis' },
    ]
  },
  {
    title: 'Emergentes',
    items: [
      { icon: Cpu, label: 'AI & ML', subLabel: 'LLMs, PyTorch, TensorFlow' },
      { icon: Smartphone, label: 'Mobile Dev', subLabel: 'iOS, Android, React Native' },
      { icon: Gamepad2, label: 'Game Code', subLabel: 'C++, C#, Shaders' },
    ]
  }
];

export const CATEGORY_ITEMS: CategoryItem[] = NAV_SECTIONS.flatMap(section => section.items);

export const SUBSCRIPTIONS: Subscription[] = [
  { id: '1', name: 'Motion School', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop', isLive: true },
  { id: '2', name: 'Design Daily', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop' },
  { id: '3', name: 'Code Master', image: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop' },
];

// --- HEADER CHIPS ---
const GENERAL_CHIPS: Chip[] = [
  { id: 'g1', label: 'Blender', image: 'https://ih1.redbubble.net/image.5193480187.3281/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.webp?w=800&q=80', active: true },
  { id: 'g2', label: 'Cinema 4D', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
  { id: 'g3', label: 'Unreal Engine', image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100&auto=format&fit=crop&q=60' },
  { id: 'g4', label: 'After Effects', image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=100&auto=format&fit=crop&q=60' },
  { id: 'g11', label: 'Otros programas' },
];

export const CATEGORY_CHIPS_MAP: Record<string, Chip[]> = {
  'Home': GENERAL_CHIPS,
};
