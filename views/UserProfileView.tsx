
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, CheckCircle2, UserPlus, Mail, MessageSquare, Layers, Twitter, Instagram, Globe, MoreHorizontal, Briefcase, GraduationCap, UserCheck, Zap, Award, Trophy, Bookmark, Heart, Lock, Plus, Image as ImageIcon, Video, Box, Newspaper, Download, PlayCircle, FileText } from 'lucide-react';
import { PORTFOLIO_ITEMS, BLOG_ITEMS, EDUCATION_ITEMS, ASSET_ITEMS, ARTIST_TIERS, ARTIST_DIRECTORY } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { BlogCard } from '../components/cards/BlogCard';
import { EducationCard } from '../components/cards/EducationCard';
import { AssetCard } from '../components/cards/AssetCard';
import { useAppStore } from '../hooks/useAppStore';

interface UserProfileViewProps {
  authorName?: string;
  onBack: () => void;
  onItemSelect: (id: string, type: 'portfolio' | 'blog' | 'course' | 'asset') => void;
  onOpenChat?: (authorName: string) => void;
}

// Extended Experience Data
const EXPERIENCE = [
  {
    id: 1,
    role: "Senior 3D Artist",
    company: "Ubisoft",
    period: "2021 - Presente",
    location: "Barcelona, España",
    description: "Liderando el equipo de entornos para proyectos AAA no anunciados. Responsable de la coherencia visual, optimización de assets mediante Nanite/Lumen y mentoría de artistas junior."
  },
  {
    id: 2,
    role: "Environment Artist",
    company: "Gameloft",
    period: "2018 - 2021",
    location: "Madrid, España",
    description: "Modelado y texturizado de escenarios para juegos móviles de alto rendimiento (Asphalt 9). Colaboración estrecha con Game Designers para asegurar la jugabilidad en circuitos."
  },
  {
    id: 3,
    role: "Freelance 3D Generalist",
    company: "Varios Clientes",
    period: "2015 - 2018",
    location: "Remoto",
    description: "Creación de assets 3D para publicidad, visualización arquitectónica y prototipos indie. Clientes incluyen agencias de marketing y estudios pequeños en Latam."
  }
];

// New Education Data
const EDUCATION = [
  {
    id: 1,
    degree: "Máster en Arte para Videojuegos",
    school: "Voxel School",
    period: "2016 - 2017",
    description: "Especialización intensiva en escultura digital con ZBrush, texturizado PBR y motores gráficos en tiempo real."
  },
  {
    id: 2,
    degree: "Grado en Diseño Multimedial",
    school: "Universidad de Palermo",
    period: "2011 - 2015",
    description: "Formación integral en diseño, teoría del color, composición visual y fundamentos de animación."
  }
];

// Mock Locked Content for Membership Tab
const LOCKED_POSTS = [
    {
        id: 'l1',
        title: 'Archivos Fuente: Cyberpunk Scene',
        type: 'Download',
        date: 'Hace 2 días',
        image: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop',
        tier: 'Estudiante Pro'
    },
    {
        id: 'l2',
        title: 'Tutorial Exclusivo: Shaders Avanzados',
        type: 'Video',
        date: 'Hace 5 días',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
        tier: 'Supporter'
    },
    {
        id: 'l3',
        title: 'Brush Pack V2 - Early Access',
        type: 'Asset',
        date: 'Hace 1 semana',
        image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop',
        tier: 'Estudiante Pro'
    }
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({ authorName, onBack, onItemSelect, onOpenChat }) => {
  const { state, actions } = useAppStore();
  const { username } = useParams<{ username: string }>();
  
  // Determine if viewing own profile or public profile
  const isOwnProfile = !authorName && (!username || username === 'me');
  
  // Fallback to "Alex Motion" if no specific user is passed and it's own profile, otherwise use the param
  const displayUser = isOwnProfile ? state.user : {
      name: authorName || username || 'Unknown User',
      id: 'unknown',
      avatar: 'https://ui-avatars.com/api/?background=random',
      role: 'Digital Artist',
      location: 'Latam'
  };

  const name = displayUser.name;
  
  const [activeTab, setActiveTab] = useState<'portfolio' | 'courses' | 'assets' | 'blog' | 'saved' | 'collections' | 'membership'>('portfolio');
  const [isFollowing, setIsFollowing] = useState(false);

  // Attempt to find artist level from directory if exists (Mock logic)
  const directoryArtist = ARTIST_DIRECTORY.find(a => a.name === name);
  const artistLevel = directoryArtist?.level || 'Pro'; 

  const getLevelFrameClass = (level?: string) => {
    switch(level) {
        case 'Master': return 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/30';
        case 'Expert': return 'bg-gradient-to-tr from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30';
        case 'Pro': return 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-2xl shadow-amber-500/30';
        case 'Novice': return 'bg-slate-200 dark:bg-slate-700';
        default: return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  const levelFrameClass = getLevelFrameClass(artistLevel);

  // --- Dynamic Content Logic ---

  // 1. Portfolio / Creations
  const userPortfolio = useMemo(() => {
      if (isOwnProfile) return state.createdItems;
      return PORTFOLIO_ITEMS.filter(p => p.artist === name);
  }, [isOwnProfile, state.createdItems, name]);

  // 2. Courses
  const userCourses = useMemo(() => {
      const courses = EDUCATION_ITEMS.filter(c => c.instructor === name);
      // Mock content for demo if empty and own profile
      if (isOwnProfile && courses.length === 0) {
          return EDUCATION_ITEMS.slice(0, 2).map((c, i) => ({
              ...c,
              id: `my-course-${i}`,
              instructor: name,
              instructorAvatar: displayUser.avatar,
              title: i === 0 ? "Master en Blender 4.0" : "Iluminación Cinemática"
          }));
      }
      return courses;
  }, [name, isOwnProfile, displayUser.avatar]);

  // 3. Assets
  const userAssets = useMemo(() => {
      const assets = ASSET_ITEMS.filter(a => a.creator === name);
      // Mock content for demo if empty and own profile
      if (isOwnProfile && assets.length === 0) {
          return ASSET_ITEMS.slice(0, 2).map((a, i) => ({
              ...a,
              id: `my-asset-${i}`,
              creator: name,
              creatorAvatar: displayUser.avatar,
              title: i === 0 ? "Sci-Fi Kitbash Vol. 1" : "Texturas Procedurales"
          }));
      }
      return assets;
  }, [name, isOwnProfile, displayUser.avatar]);

  // 4. Blog
  const userArticles = useMemo(() => {
      const articles = BLOG_ITEMS.filter(b => b.author === name);
      // Mock content for demo if empty and own profile
      if (isOwnProfile && articles.length === 0) {
          return BLOG_ITEMS.slice(0, 2).map((b, i) => ({
              ...b,
              id: `my-blog-${i}`,
              author: name,
              authorAvatar: displayUser.avatar,
              title: i === 0 ? "Mi flujo de trabajo en 2024" : "Consejos para Juniors"
          }));
      }
      return articles;
  }, [name, isOwnProfile, displayUser.avatar]);

  // 5. Saved Items (Likes)
  const savedItems = useMemo(() => {
      if (!isOwnProfile) return []; 
      
      const portfolioLikes = PORTFOLIO_ITEMS.filter(i => state.likedItems.includes(i.id));
      const educationLikes = EDUCATION_ITEMS.filter(i => state.likedItems.includes(i.id));
      const assetLikes = ASSET_ITEMS.filter(i => state.likedItems.includes(i.id));
      const blogLikes = BLOG_ITEMS.filter(i => state.likedItems.includes(i.id));

      return [...portfolioLikes, ...educationLikes, ...assetLikes, ...blogLikes];
  }, [isOwnProfile, state.likedItems]);

  // 6. Collections
  const userCollections = useMemo(() => {
      if (isOwnProfile) return state.collections;
      return []; 
  }, [isOwnProfile, state.collections]);

  return (
    <div className="w-full max-w-[2560px] mx-auto animate-fade-in pb-20">
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors font-medium text-sm border border-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
      </div>

      {/* Banner Area */}
      <div className="relative h-[250px] md:h-[350px] 2xl:h-[450px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/40 to-transparent"></div>
      </div>

      {/* Profile Header Info */}
      <div className="px-6 md:px-12 2xl:px-20 relative -mt-20 md:-mt-24 z-10 mb-16">
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
            
            {/* Avatar with Level Frame */}
            <div className="relative group">
                <div className={`h-32 w-32 md:h-40 md:w-40 2xl:h-48 2xl:w-48 rounded-3xl p-[4px] ${levelFrameClass}`}>
                    <div className="h-full w-full rounded-2xl overflow-hidden bg-[#030304] border-4 border-[#030304]">
                        <img 
                            src={displayUser.avatar} 
                            alt={name} 
                            className="w-full h-full object-cover bg-slate-800"
                        />
                    </div>
                </div>
                {/* Status Indicator */}
                <div className="absolute bottom-3 right-3 h-5 w-5 md:h-6 md:w-6 rounded-full bg-green-500 border-4 border-[#030304]" title="Disponible para trabajar"></div>
            </div>

            {/* Info Text */}
            <div className="flex-1 pb-2 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-white tracking-tight">{name}</h1>
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 2xl:h-8 2xl:w-8 text-amber-500 fill-amber-500/20" />
                    <span className="px-2 py-0.5 rounded text-[10px] 2xl:text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/20 uppercase tracking-wider ml-2">{artistLevel}</span>
                </div>
                <p className="text-lg md:text-xl 2xl:text-2xl text-slate-300 font-light mb-4">{displayUser.role}</p>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 2xl:text-base text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {displayUser.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <LinkIcon className="h-4 w-4 text-slate-500" />
                        <a href="#" className="hover:text-amber-500 transition-colors truncate max-w-[200px] md:max-w-none">artstation.com/{name.replace(/\s/g, '').toLowerCase()}</a>
                    </div>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        Se unió en Mayo 2021
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pb-2 w-full md:w-auto mt-2 md:mt-0">
                {!isOwnProfile && (
                    <>
                        <button 
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                isFollowing 
                                ? 'bg-white/10 text-white hover:bg-white/20' 
                                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                            }`}
                        >
                            {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                            {isFollowing ? 'Siguiendo' : 'Seguir'}
                        </button>

                        <button 
                            onClick={() => onOpenChat?.(name)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Mensaje
                        </button>
                    </>
                )}
                
                {isOwnProfile && (
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/10">
                        Editar Perfil
                    </button>
                )}

                <button className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>

      {/* Content Layout - Fixed Sidebar Width for Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] 2xl:grid-cols-[450px_1fr] gap-12 px-6 md:px-12 2xl:px-20">
        
        {/* Left Sidebar (Stats, About, Experience) */}
        <div className="space-y-10 order-2 lg:order-1">
            
            {/* Gamification Level Box */}
            <div className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-6 rounded-2xl relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-16 -mt-16 opacity-20 bg-amber-500`}></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 text-white">
                            <Zap className="h-4 w-4 text-amber-400" /> 
                            Nivel {artistLevel === 'Master' ? '50' : artistLevel === 'Expert' ? '35' : '15'}
                        </h3>
                        <span className="text-white font-bold text-sm">3,450 / 5,000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: '70%' }}></div>
                    </div>
                    
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medallas</h4>
                    <div className="flex gap-3">
                        <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center text-amber-500" title="Top Contributor">
                            <Award className="h-5 w-5" />
                        </div>
                        <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-500" title="Challenge Winner">
                            <Trophy className="h-5 w-5" />
                        </div>
                        <div className="h-10 w-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold">
                            +5
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-center">
                    <div className="text-xl 2xl:text-2xl font-bold text-white">125k</div>
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Vistas</div>
                </div>
                <div className="text-center border-l border-white/5">
                    <div className="text-xl 2xl:text-2xl font-bold text-white">4.2k</div>
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Likes</div>
                </div>
                <div className="text-center border-l border-white/5">
                    <div className="text-xl 2xl:text-2xl font-bold text-white">8.5k</div>
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Seguidores</div>
                </div>
            </div>

            {/* About */}
            <div>
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Sobre mí</h3>
                <p className="text-base 2xl:text-lg text-slate-400 leading-relaxed mb-6">
                    Apasionado por crear mundos inmersivos y contar historias a través del entorno. 
                    Especializado en Hard Surface y Diseño de Niveles para videojuegos AAA.
                </p>
                <div className="flex gap-3">
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
                </div>
            </div>

            {/* Experience Section */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-amber-500" /> Experiencia
                </h3>
                <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                    {EXPERIENCE.map((job) => (
                        <div key={job.id} className="relative">
                            <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#030304] border-2 border-amber-500"></div>
                            
                            <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{job.role}</h4>
                            <div className="text-sm 2xl:text-base text-amber-500 font-medium mb-1">{job.company}</div>
                            <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">{job.period} • {job.location}</div>
                            
                            <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                {job.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education Section */}
            <div className="pt-8 border-t border-white/5 mt-8">
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" /> Educación
                </h3>
                <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                    {EDUCATION.map((edu) => (
                        <div key={edu.id} className="relative">
                            <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#030304] border-2 border-blue-500"></div>
                            
                            <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{edu.degree}</h4>
                            <div className="text-sm 2xl:text-base text-blue-400 font-medium mb-1">{edu.school}</div>
                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">{edu.period}</div>
                            <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                {edu.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Content (Tabs & Grid) */}
        <div className="order-1 lg:order-2">
            {/* Tabs */}
            <div className="flex items-center gap-6 md:gap-10 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide pb-2">
                <button 
                    onClick={() => setActiveTab('portfolio')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'portfolio' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Layers className="h-4 w-4" /> Portafolio <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userPortfolio.length}</span>
                </button>

                <button 
                    onClick={() => setActiveTab('courses')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'courses' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Video className="h-4 w-4" /> Cursos <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userCourses.length}</span>
                </button>

                <button 
                    onClick={() => setActiveTab('assets')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'assets' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Box className="h-4 w-4" /> Assets <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userAssets.length}</span>
                </button>

                <button 
                    onClick={() => setActiveTab('blog')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'blog' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Newspaper className="h-4 w-4" /> Blog <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userArticles.length}</span>
                </button>
                
                {isOwnProfile && (
                    <>
                        <button 
                            onClick={() => setActiveTab('saved')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                                activeTab === 'saved' 
                                ? 'text-amber-500 border-amber-500' 
                                : 'text-slate-500 border-transparent hover:text-white'
                            }`}
                        >
                            <Bookmark className="h-4 w-4" /> Guardados <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{savedItems.length}</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('collections')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                                activeTab === 'collections' 
                                ? 'text-amber-500 border-amber-500' 
                                : 'text-slate-500 border-transparent hover:text-white'
                            }`}
                        >
                            <Layers className="h-4 w-4" /> Colecciones <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userCollections.length}</span>
                        </button>
                    </>
                )}

                <button 
                    onClick={() => setActiveTab('membership')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'membership' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Heart className="h-4 w-4" /> Membresía
                </button>
            </div>

            {/* TAB: PORTFOLIO */}
            {activeTab === 'portfolio' && (
                <>
                    {userPortfolio.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 animate-slide-up">
                            {userPortfolio.map((item: any) => (
                                <PortfolioCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => onItemSelect(item.id, 'portfolio')} 
                                    onSave={actions.openSaveModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Layers className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin proyectos publicados</h3>
                            <p className="text-slate-400 max-w-md mb-6">Comparte tus creaciones con la comunidad.</p>
                            {isOwnProfile && (
                                <button onClick={() => actions.handleCreateAction('portfolio')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Crear Proyecto
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* TAB: COURSES */}
            {activeTab === 'courses' && (
                <>
                    {userCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                            {userCourses.map((item) => (
                                <EducationCard 
                                    key={item.id} 
                                    course={item} 
                                    onClick={() => onItemSelect(item.id, 'course')} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <GraduationCap className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin cursos publicados</h3>
                            <p className="text-slate-400 max-w-md mb-6">Enseña lo que sabes y gana dinero.</p>
                            {isOwnProfile && (
                                <button onClick={() => actions.handleCreateAction('course')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Crear Curso
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* TAB: ASSETS */}
            {activeTab === 'assets' && (
                <>
                    {userAssets.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-slide-up">
                            {userAssets.map((item) => (
                                <AssetCard 
                                    key={item.id} 
                                    asset={item} 
                                    onClick={() => onItemSelect(item.id, 'asset')} 
                                    onSave={actions.openSaveModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Box className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin assets publicados</h3>
                            <p className="text-slate-400 max-w-md mb-6">Vende tus modelos, texturas y herramientas.</p>
                            {isOwnProfile && (
                                <button onClick={() => actions.handleCreateAction('asset')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Vender Asset
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* TAB: BLOG */}
            {activeTab === 'blog' && (
                <>
                    {userArticles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                            {userArticles.map((item) => (
                                <BlogCard 
                                    key={item.id} 
                                    article={item} 
                                    onClick={() => onItemSelect(item.id, 'blog')} 
                                    onSave={actions.openSaveModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Newspaper className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin artículos publicados</h3>
                            <p className="text-slate-400 max-w-md mb-6">Escribe sobre tus experiencias y tutoriales.</p>
                            {isOwnProfile && (
                                <button onClick={() => actions.handleCreateAction('article')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Escribir Artículo
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* TAB: SAVED (LIKES) */}
            {activeTab === 'saved' && (
                <>
                    {savedItems.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 animate-slide-up">
                            {savedItems.map((item: any) => {
                                // Simple type guard or rendering logic
                                if ('price' in item && 'fileSize' in item) { // Asset
                                    return <AssetCard key={item.id} asset={item} onClick={() => onItemSelect(item.id, 'asset')} onSave={actions.openSaveModal} />;
                                } else if ('instructor' in item) { // Course
                                    return <EducationCard key={item.id} course={item} onClick={() => onItemSelect(item.id, 'course')} />;
                                } else if ('readTime' in item) { // Blog
                                    return <BlogCard key={item.id} article={item} onClick={() => onItemSelect(item.id, 'blog')} onSave={actions.openSaveModal} />;
                                } else { // Portfolio
                                    return <PortfolioCard key={item.id} item={item} onClick={() => onItemSelect(item.id, 'portfolio')} onSave={actions.openSaveModal} />;
                                }
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                            <Bookmark className="h-12 w-12 mb-4 opacity-20" />
                            <p>No tienes elementos guardados.</p>
                        </div>
                    )}
                </>
            )}

            {/* TAB: COLLECTIONS */}
            {activeTab === 'collections' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up">
                    {userCollections.map((col) => (
                        <div key={col.id} className="group cursor-pointer">
                            <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden mb-4 grid grid-cols-2 gap-1 p-1 hover:ring-2 ring-amber-500/50 transition-all shadow-sm hover:shadow-lg relative">
                                {col.thumbnails.slice(0, 4).map((thumb, i) => (
                                    <div key={i} className="relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-lg">
                                        <img src={thumb} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                {Array.from({ length: Math.max(0, 4 - col.thumbnails.length) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="bg-slate-200 dark:bg-white/5 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                                    </div>
                                ))}
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1">{col.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{col.itemCount} items</span>
                                {col.isPrivate && <Lock className="h-3 w-3" />}
                            </div>
                        </div>
                    ))}
                    {userCollections.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500">
                            <p>No tienes colecciones aún.</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: MEMBERSHIP */}
            {activeTab === 'membership' && (
                <div className="animate-slide-up space-y-12">
                    {/* Intro */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Conviértete en miembro</h3>
                        <p className="text-slate-300 max-w-2xl text-lg">
                            Únete a mi comunidad exclusiva para obtener acceso a archivos fuente, tutoriales avanzados y mentoría directa.
                        </p>
                    </div>

                    {/* Tiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ARTIST_TIERS.map((tier) => (
                            <div key={tier.id} className={`relative bg-white/5 rounded-2xl border flex flex-col p-6 transition-transform hover:-translate-y-1 ${tier.color} ${tier.recommended ? 'border-2 shadow-xl shadow-amber-500/10' : 'border-white/10'}`}>
                                {tier.recommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
                                        Recomendado
                                    </div>
                                )}
                                <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                                <div className="text-3xl font-bold text-white mb-4">
                                    ${tier.price} <span className="text-sm font-normal text-slate-500">/mes</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
                                    {tier.description}
                                </p>
                                <button className={`w-full py-3 rounded-xl font-bold mb-6 transition-colors ${tier.recommended ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white text-black hover:bg-slate-200'}`}>
                                    Unirse
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Locked Exclusive Content Section */}
                    <div className="pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-amber-500" />
                            Contenido Exclusivo para Miembros
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {LOCKED_POSTS.map((post, idx) => (
                                <div key={post.id} className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-white/5 aspect-video hover:border-amber-500/30 transition-colors">
                                    {/* Blurred Image Background */}
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover blur-md opacity-40 transform scale-110" />

                                    {/* Content & Lock Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center bg-black/40 backdrop-blur-sm">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                            {post.type === 'Download' ? <Download className="h-6 w-6 text-amber-500" /> : 
                                             post.type === 'Video' ? <PlayCircle className="h-6 w-6 text-amber-500" /> :
                                             post.type === 'Asset' ? <Box className="h-6 w-6 text-amber-500" /> :
                                             <FileText className="h-6 w-6 text-amber-500" />}
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{post.title}</h4>
                                        <p className="text-amber-400/80 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20 px-2 py-0.5 rounded bg-amber-500/10">
                                            Requiere: {post.tier}
                                        </p>
                                        <p className="text-slate-400 text-xs mb-4">Publicado {post.date}</p>
                                        <button className="px-5 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-200 shadow-lg flex items-center gap-2">
                                            <Lock className="h-3 w-3" /> Desbloquear
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>

      </div>
    </div>
  );
};
