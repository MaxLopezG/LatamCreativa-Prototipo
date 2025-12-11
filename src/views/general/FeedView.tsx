
import React, { useState, useRef } from 'react';
import {
  ArrowRight, Layers, GraduationCap, Store, Newspaper, Move3d, MonitorPlay, Palette, Gamepad2, Globe, Users,
  Code, Server, Database, Cloud, ChevronLeft, ChevronRight, PenTool, Box, Smartphone, Shield, TestTube, Cpu,
  Building2, Terminal, Camera, Layout, Music, Video, Shirt, BookOpen, Aperture, Bitcoin, Wifi, Activity,
  Glasses, ServerCog, Bot, PenLine
} from 'lucide-react';
import { PORTFOLIO_ITEMS, EDUCATION_ITEMS, ASSET_ITEMS, BLOG_ITEMS } from '../../data/content';
import { SUBSCRIPTIONS } from '../../data/navigation';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { EducationCard } from '../../components/cards/EducationCard';
import { AssetCard } from '../../components/cards/AssetCard';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';
import { StoryViewer, StoryUser } from '../../components/modals/StoryViewer';

interface FeedViewProps {
  onNavigateToModule: (moduleId: string) => void;
  onItemSelect: (id: string, type: 'portfolio' | 'course' | 'asset' | 'blog') => void;
  contentMode: ContentMode;
}

export const FeedView: React.FC<FeedViewProps> = ({ onNavigateToModule, onItemSelect, contentMode }) => {
  const { state } = useAppStore();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  // Filter content based on mode (default 'creative')
  const mode = contentMode || 'creative';

  // Merge static and created items
  const allPortfolioItems = [...(state.createdItems || []), ...PORTFOLIO_ITEMS];
  const allBlogItems = [...(state.blogPosts || []), ...BLOG_ITEMS];

  // Increased slice to fill new grid
  const displayPortfolio = allPortfolioItems.filter(i => (i.domain || 'creative') === mode).slice(0, 6);
  const displayBlog = allBlogItems.filter(i => (i.domain || 'creative') === mode).slice(0, 5);
  const displayEducation = EDUCATION_ITEMS.filter(i => (i.domain || 'creative') === mode).slice(0, 4);
  const displayAssets = ASSET_ITEMS.filter(i => (i.domain || 'creative') === mode).slice(0, 5);

  // Consolidate all users for the Stories Rail
  // Merge real subscriptions with generated users for a consistent list
  const storyUsers: StoryUser[] = [
    ...SUBSCRIPTIONS.map(s => ({
      id: s.id,
      name: s.name,
      avatar: s.image,
      isLive: s.isLive
    })),
    ...Array.from({ length: 15 }).map((_, i) => ({
      id: `fake-${i}`,
      name: `User ${i + 1}`,
      avatar: `https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`,
      isLive: false
    }))
  ];

  // Extended Categories for Scrolling
  const creativeCategories = [
    { label: 'Modelado 3D', icon: Move3d, color: 'from-blue-500 to-cyan-500' },
    { label: 'Animación', icon: MonitorPlay, color: 'from-purple-500 to-pink-500' },
    { label: 'Concept Art', icon: Palette, color: 'from-amber-500 to-orange-500' },
    { label: 'Game Dev', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
    { label: 'VFX', icon: Box, color: 'from-red-500 to-pink-600' },
    { label: 'ArchViz', icon: Building2, color: 'from-slate-500 to-gray-600' },
    { label: 'Ilustración', icon: PenTool, color: 'from-pink-500 to-rose-500' },
    { label: 'VR / AR', icon: Globe, color: 'from-cyan-500 to-blue-600' },
    { label: 'Fotografía', icon: Camera, color: 'from-indigo-500 to-blue-600' },
    { label: 'Diseño Gráfico', icon: Layout, color: 'from-orange-400 to-red-500' },
    { label: 'Música & SFX', icon: Music, color: 'from-rose-500 to-pink-600' },
    { label: 'Edición Video', icon: Video, color: 'from-blue-600 to-indigo-600' },
    { label: 'Moda 3D', icon: Shirt, color: 'from-fuchsia-500 to-purple-600' },
    { label: 'Escritura', icon: BookOpen, color: 'from-emerald-600 to-teal-500' },
    { label: 'Motion', icon: Aperture, color: 'from-yellow-500 to-orange-500' },
  ];

  const devCategories = [
    { label: 'Frontend', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { label: 'Backend', icon: Server, color: 'from-green-500 to-emerald-500' },
    { label: 'DevOps', icon: Cloud, color: 'from-orange-500 to-red-500' },
    { label: 'Database', icon: Database, color: 'from-purple-500 to-pink-500' },
    { label: 'Mobile', icon: Smartphone, color: 'from-teal-500 to-green-400' },
    { label: 'Seguridad', icon: Shield, color: 'from-red-600 to-red-400' },
    { label: 'QA Testing', icon: TestTube, color: 'from-yellow-500 to-amber-500' },
    { label: 'AI & ML', icon: Cpu, color: 'from-indigo-500 to-purple-500' },
    { label: 'Terminal', icon: Terminal, color: 'from-gray-600 to-gray-400' },
    { label: 'Blockchain', icon: Bitcoin, color: 'from-orange-400 to-yellow-500' },
    { label: 'IoT', icon: Wifi, color: 'from-cyan-600 to-blue-600' },
    { label: 'Data Science', icon: Activity, color: 'from-emerald-500 to-teal-600' },
    { label: 'XR Dev', icon: Glasses, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'SysAdmin', icon: ServerCog, color: 'from-slate-600 to-gray-500' },
    { label: 'Robótica', icon: Bot, color: 'from-red-500 to-orange-600' },
    { label: 'System Design', icon: PenLine, color: 'from-blue-400 to-indigo-500' },
  ];

  const categories = mode === 'dev' ? devCategories : creativeCategories;

  // Scroll Handler
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const { current } = categoriesScrollRef;
      const scrollAmount = 300; // Adjust scroll distance
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Theme colors
  const accentText = mode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentHoverText = mode === 'dev' ? 'hover:text-blue-500' : 'hover:text-amber-500';
  const accentHoverBg = mode === 'dev' ? 'hover:bg-blue-500' : 'hover:bg-amber-500';
  const gradientTitle = mode === 'dev'
    ? 'from-blue-400 to-cyan-500'
    : 'from-amber-400 to-orange-500';

  const badgeBg = mode === 'dev' ? 'bg-blue-500/20 border-blue-500/20 text-blue-400' : 'bg-amber-500/20 border-amber-500/20 text-amber-400';

  return (
    <div className="animate-fade-in pb-20">

      {/* Story Viewer Overlay */}
      <StoryViewer
        isOpen={activeStoryIndex !== null}
        onClose={() => setActiveStoryIndex(null)}
        initialIndex={activeStoryIndex || 0}
        users={storyUsers}
      />

      {/* Live & Stories Rail */}
      <div className="w-full bg-[#050506] border-b border-white/5 py-4 overflow-x-auto scrollbar-hide">
        <div className="max-w-[2560px] mx-auto px-4 md:px-12 2xl:px-16 flex gap-4 md:gap-6">
          {storyUsers.map((user, index) => (
            <div
              key={user.id}
              className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
              onClick={() => setActiveStoryIndex(index)}
            >
              <div className={`p-[3px] rounded-full transition-all ${user.isLive ? 'bg-gradient-to-tr from-amber-500 to-purple-600 animate-pulse' : 'bg-gradient-to-tr from-white/20 to-white/5 group-hover:from-amber-500 group-hover:to-purple-600'}`}>
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-[#050506] overflow-hidden bg-slate-800 relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium group-hover:text-white transition-colors w-16 text-center truncate">{user.name}</span>
              {user.isLive && <span className="text-[9px] bg-red-500 text-white px-1.5 rounded uppercase font-bold tracking-wider absolute -mt-4">Live</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Hero Section */}
      <div className="relative w-full min-h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={mode === 'dev' ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop" : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"}
            alt="Latam Creativa Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030304] via-[#030304]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full w-full max-w-[2560px] mx-auto px-4 md:px-12 2xl:px-16 flex flex-col justify-center py-12 md:py-0">
          <div className="max-w-3xl animate-slide-up">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badgeBg} text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border backdrop-blur-md`}>
              <Globe className="h-3 w-3" /> Comunidad Oficial
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight font-display">
              Latam Creativa <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientTitle}`}>{mode === 'dev' ? 'Developers' : 'Originals'}</span>
            </h1>
            <p className={`text-sm md:text-lg text-slate-300 mb-6 md:mb-8 max-w-xl leading-relaxed border-l-4 ${mode === 'dev' ? 'border-blue-500' : 'border-amber-500'} pl-4 md:pl-6`}>
              {mode === 'dev'
                ? 'Recursos, librerías y tutoriales para desarrolladores de software en Latinoamérica.'
                : 'Descubre las historias, tutoriales y proyectos exclusivos producidos por y para la comunidad.'
              }
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigateToModule('blog')}
                className={`px-6 py-3 bg-white text-black font-bold rounded-xl ${accentHoverBg} hover:text-white transition-colors shadow-lg text-sm md:text-base`}
              >
                Leer Artículos
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[2560px] mx-auto px-4 md:px-12 2xl:px-16 -mt-8 relative z-20">

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Content (Feed) - Full Width */}
          <div className="lg:col-span-12 space-y-16">

            {/* Quick Categories Carousel */}
            <div className="relative group">
              {/* Left Gradient/Arrow */}
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-[#030304] to-transparent z-10 pointer-events-none"></div>
              <button
                onClick={() => scrollCategories('left')}
                className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 -ml-3"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Scroll Container */}
              <div
                ref={categoriesScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
              >
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex-shrink-0 w-36 md:w-44 group/card relative h-20 rounded-xl bg-[#0A0A0C] border border-white/10 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform shadow-lg">
                    <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-10 bg-gradient-to-br ${cat.color} transition-opacity`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-4">
                      <cat.icon className="h-6 w-6 text-white group-hover/card:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-400 group-hover/card:text-white transition-colors">{cat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Gradient/Arrow */}
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-[#030304] to-transparent z-10 pointer-events-none"></div>
              <button
                onClick={() => scrollCategories('right')}
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 -mr-3"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Featured Portfolio */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Layers className={`h-5 w-5 md:h-6 md:w-6 ${accentText}`} />
                  {mode === 'dev' ? 'Repositorios & Proyectos' : 'Tendencias'}
                </h2>
                <button onClick={() => onNavigateToModule('portfolio')} className={`text-xs md:text-sm font-bold text-slate-500 ${accentHoverText} transition-colors`}>Ver todo</button>
              </div>

              {displayPortfolio.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {displayPortfolio.map(item => (
                    <PortfolioCard key={item.id} item={item} onClick={() => onItemSelect(item.id, 'portfolio')} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white/5 rounded-2xl border border-white/5">
                  No hay proyectos destacados en este momento.
                </div>
              )}
            </section>

            {/* Blog & News */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Newspaper className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
                  Noticias
                </h2>
                <button onClick={() => onNavigateToModule('blog')} className="text-xs md:text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Leer blog</button>
              </div>

              {displayBlog.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Featured Article */}
                  <div className="group cursor-pointer relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden" onClick={() => onItemSelect(displayBlog[0].id, 'blog')}>
                    <img src={displayBlog[0].image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded mb-2 inline-block">{displayBlog[0].category}</span>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{displayBlog[0].title}</h3>
                    </div>
                  </div>

                  {/* List of Articles */}
                  <div className="flex flex-col gap-4">
                    {displayBlog.slice(1, 4).map(item => (
                      <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-white dark:bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-slate-200 dark:border-white/5" onClick={() => onItemSelect(item.id, 'blog')}>
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-blue-500 uppercase mb-1">{item.category}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug text-sm">{item.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white/5 rounded-2xl border border-white/5">No hay noticias disponibles.</div>
              )}
            </section>

            {/* Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">¿Buscas equipo?</h2>
                <p className="text-purple-200 text-sm mb-4">Únete a miles de {mode === 'dev' ? 'desarrolladores' : 'creativos'} en nuestra sección de Comunidad.</p>
                <button onClick={() => onNavigateToModule('community')} className="px-6 py-2 bg-white text-purple-900 font-bold rounded-lg hover:scale-105 transition-transform text-sm w-full md:w-auto">
                  Encontrar Equipo
                </button>
              </div>
              <div className="hidden md:block relative z-10">
                <Users className="h-24 w-24 text-white/20" />
              </div>
            </div>

            {/* Education */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
                  Aprende
                </h2>
                <button onClick={() => onNavigateToModule('education')} className="text-xs md:text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors">Ver cursos</button>
              </div>
              {displayEducation.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayEducation.map(item => (
                    <EducationCard key={item.id} course={item} onClick={() => onItemSelect(item.id, 'course')} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white/5 rounded-2xl border border-white/5">
                  No hay cursos disponibles en este momento.
                </div>
              )}
            </section>

            {/* Market */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Store className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
                  {mode === 'dev' ? 'Templates & Code' : 'Assets'}
                </h2>
                <button onClick={() => onNavigateToModule('market')} className="text-xs md:text-sm font-bold text-slate-500 hover:text-purple-500 transition-colors">Ir a la tienda</button>
              </div>
              {displayAssets.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {displayAssets.map(item => (
                    <AssetCard key={item.id} asset={item} onClick={() => onItemSelect(item.id, 'asset')} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white/5 rounded-2xl border border-white/5">
                  No hay assets disponibles en este momento.
                </div>
              )}
            </section>

          </div>

        </div>
      </div>
    </div>
  );
};
