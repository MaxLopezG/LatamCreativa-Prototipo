
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string; // Added ID for state management
  icon: LucideIcon;
  label?: string;
  active?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: CategoryItem[];
}

export interface CategoryItem {
  icon: LucideIcon;
  label: string;
  subLabel?: string;
  active?: boolean;
  hasUpdate?: boolean;
  subItems?: string[]; // Software/Tools list
}

export interface Subscription {
  id: string;
  name: string;
  image: string;
  isLive?: boolean;
}

export interface Chip {
  id: string;
  label: string;
  image?: string;
  active?: boolean;
}

export type ItemType = 'project' | 'article' | 'portfolio' | 'course' | 'asset' | 'service' | 'job' | 'event' | 'forum' | 'collection';
export type CreateMode = 'none' | ItemType; // CreateMode tracks ItemType roughly

export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  timeAgo: string;
  likes: number;
  parentId?: string;
  replies?: BlogComment[];
}

export interface VideoSuggestion {
  id: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
  thumbnail: string;
}

// New Interface for Membership Tiers (Patreon style)
export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  perks: string[];
  recommended?: boolean;
}

// New Interface for Portfolio
export interface PortfolioItem {
  id: string;
  title: string;
  artist: string;
  artistId?: string; // Made optional for backward compatibility, but should be populated for new items
  artistAvatar: string;
  image: string;
  views: string;
  likes: string;
  category: string;
  isExclusive?: boolean; // Locked content
  description?: string; // New: Specific project description
  images?: string[]; // New: Project gallery (wireframes, details)
  software?: string[]; // New: Software used
  domain?: 'creative' | 'dev'; // For filtering mode
}

// New Interface for Blog Articles
export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  likes: number;
  comments: number;
  isExclusive?: boolean; // Locked content
  content?: string; // New: Full article content
  domain?: 'creative' | 'dev';
  role?: string;
  tags?: string[];
}

// New Interface for Education Courses
export interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  students: number;
  price: number;
  originalPrice?: number;
  duration: string;
  lectures: number;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
  bestseller?: boolean;
  category: string;
  updatedDate: string;
  domain?: 'creative' | 'dev';
}

// New Interface for Asset Market
export interface AssetItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  thumbnail: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  formats: string[]; // e.g. FBX, OBJ, BLEND
  fileSize: string;
  license: 'Standard' | 'Editorial';
  likes: number;
  description: string;
  technicalSpecs?: {
    vertices?: string;
    polygons?: string;
    textures?: boolean;
    materials?: boolean;
    rigged?: boolean;
    animated?: boolean;
    uvMapped?: boolean;
  };
  domain?: 'creative' | 'dev';
}

// New Interface for Freelance Services (Fiverr style)
export interface FreelanceServiceItem {
  id: string;
  title: string;
  seller: string;
  sellerAvatar: string;
  sellerLevel: 'Nuevo' | 'Nivel 1' | 'Nivel 2' | 'Top Rated';
  thumbnail: string;
  images: string[];
  startingPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  deliveryTime: string; // e.g. "3 días"
  description: string;
  packages: {
    basic: { price: number; title: string; desc: string; delivery: string; revisions: number };
    standard: { price: number; title: string; desc: string; delivery: string; revisions: number };
    premium: { price: number; title: string; desc: string; delivery: string; revisions: number };
  };
  domain?: 'creative' | 'dev';
}

export interface VideoPageData {
  title: string;
  channelName: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  timeAgo: string;
  description: string;
  thumbnail: string;
  videoUrl?: string; // Optional real video URL
  likes: string;
  isLiked?: boolean; // Initial state
}

// New Interface for Community Groups
export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  image: string;
  leader: string;
  leaderAvatar: string;
  membersCount: number;
  rolesNeeded: string[]; // e.g. ["Programador Unity", "Concept Artist"]
  tags: string[];
  status: 'Reclutando' | 'En Progreso' | 'Finalizado';
  postedTime: string;
  domain?: 'creative' | 'dev';
}

// New Interface for Events
export interface EventItem {
  id: string;
  title: string;
  description: string;
  image: string;
  organizer: string;
  organizerAvatar: string;
  date: string;
  month: string;
  day: string;
  time: string;
  location: string; // "Online" or City/Address
  type: 'Webinar' | 'Workshop' | 'Conferencia' | 'Meetup' | 'Hackathon';
  price: number; // 0 for free
  attendees: number;
  category: string;
  domain?: 'creative' | 'dev';
}

// --- FORUM INTERFACES ---
export interface ForumReply {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  isSolution?: boolean;
  votes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  category: string;
  tags: string[];
  views: number;
  votes: number;
  replies: ForumReply[];
  isSolved: boolean;
  domain?: 'creative' | 'dev';
}

// --- ARTIST DIRECTORY INTERFACE ---
export interface ArtistProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  location: string;
  skills: string[];
  followers: string;
  projects: number;
  isPro?: boolean;
  availableForWork?: boolean;
  coverImage: string;
  domain?: 'creative' | 'dev';
  level?: 'Novice' | 'Pro' | 'Expert' | 'Master'; // New Level System
}

// --- CHAT INTERFACES ---
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or friend ID
  text: string;
  timestamp: string;
}

// --- SHOPPING CART & NOTIFICATIONS ---
export interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  type: 'course' | 'asset' | 'service';
}

export interface Notification {
  id: string | number;
  type: 'comment' | 'follow' | 'system' | 'like' | 'purchase';
  user: string;
  avatar: string;
  content: string;
  category?: string;
  link?: string;
  time: string;
  read: boolean;
}

// --- CHALLENGES INTERFACE ---
export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  sponsor?: string;
  sponsorLogo?: string;
  deadline: string;
  daysLeft: number;
  participants: number;
  prizes: string[];
  status: 'Active' | 'Voting' | 'Closed';
  tags: string[];
  domain?: 'creative' | 'dev';
}

// --- JOBS INTERFACE ---
export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  postedAt: string;
  salary?: string;
  tags: string[];
  isFeatured?: boolean;
  domain?: 'creative' | 'dev';
}

// --- COLLECTIONS / MOODBOARDS INTERFACE ---
export interface SavedItemReference {
  id: string;
  type: ItemType;
  addedAt: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  itemCount: number;
  thumbnails: string[];
  isPrivate: boolean;
  items?: SavedItemReference[];
  createdAt?: string;
}

// --- SALES & EARNINGS INTERFACE ---
export type SaleStatus = 'Active' | 'Paused' | 'Draft';

export interface SaleItem {
  id: string;
  title: string;
  image: string;
  dateCreated: string;
  price: number;
  salesCount: number;
  totalRevenue: number;
  status: SaleStatus;
  rating: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof SaleItem;
  direction: SortDirection;
}

export interface ExperienceItem {
  id: number | string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export interface EducationItem {
  id: number | string;
  degree: string;
  school: string;
  period: string;
  description: string;
}

export interface UserStats {
  views: number;
  likes: number;
  followers: number;
  following: number;
}

export interface User {
  id: string; // O 'uid', unifica esto con tu store
  email: string;
  name: string; // Display Name
  firstName?: string; // Nuevo
  lastName?: string;  // Nuevo
  username?: string;  // Nuevo (Vital para Onboarding)
  photoURL?: string;
  avatar?: string; // Alias for photoURL to maintain compatibility
  role?: string;      // 'Creative Member' | 'Client'
  location?: string;  // País
  country?: string;   // Alias for location
  city?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: SocialLinks; // Asegúrate de importar o definir SocialLinks
  isProfileComplete?: boolean; // Flag del Onboarding
  isAdmin?: boolean;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  stats?: UserStats;
  createdAt?: string;
  availableForWork?: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  artstation?: string;
  instagram?: string;
  website?: string;
  twitter?: string; // Kept for compatibility
  github?: string;  // Kept for compatibility
}

