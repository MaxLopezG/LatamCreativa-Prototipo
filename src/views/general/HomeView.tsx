
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Layers, Newspaper, Move3d, MonitorPlay, Palette, Gamepad2, Globe, Users,
  Code, Server, Database, Cloud, ChevronLeft, ChevronRight, PenTool, Box, Smartphone, Shield, TestTube, Cpu,
  Building2, Terminal, Camera, Layout, Music, Video, Shirt, BookOpen, Aperture, Bitcoin, Wifi, Activity,
  Glasses, ServerCog, Bot, PenLine, Loader2
} from 'lucide-react';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { BlogCard } from '../../components/cards/BlogCard';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';
import { projectsService } from '../../services/modules/projects';
import { articlesService } from '../../services/modules/articles';
import { PortfolioItem, ArticleItem } from '../../types';

interface HomeViewProps {
  onNavigateToModule: (moduleId: string) => void;
  onItemSelect: (id: string, type: 'portfolio' | 'blog') => void;
  contentMode: ContentMode;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateToModule, onItemSelect, contentMode }) => {
  const { state } = useAppStore();
  const navigate = useNavigate();
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const blogScrollRef = useRef<HTMLDivElement>(null);

  // Filter content based on mode (default 'creative')
  const mode = contentMode || 'creative';

  // State for Firebase data
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch projects and articles in parallel
        const [projectsResult, articlesResult] = await Promise.all([
          projectsService.getProjects(null, 10),
          articlesService.getRecentArticles(10)
        ]);

        setProjects(projectsResult.data || []);
        setArticles(articlesResult || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter by mode and limit display
  const displayPortfolio = projects.filter(i => (i.domain || 'creative') === mode).slice(0, 6);
  const displayBlog = articles.filter(i => (i.domain || 'creative') === mode).slice(0, 5);

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

  // Generic Scroll Handler
  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const container = ref.current;
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Legacy scroll for categories (uses smaller amount)
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const { current } = categoriesScrollRef;
      const scrollAmount = 300;
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
                  <div
                    key={idx}
                    className="flex-shrink-0 w-36 md:w-44 group/card relative h-20 rounded-xl bg-[#0A0A0C] border border-white/10 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform shadow-lg"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(cat.label)}`)}
                  >
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

            {/* Featured Portfolio - Carousel */}
            <section className="relative group/portfolio">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Layers className={`h-5 w-5 md:h-6 md:w-6 ${accentText}`} />
                  {mode === 'dev' ? 'Repositorios & Proyectos' : 'Portafolios'}
                </h2>
                <button onClick={() => onNavigateToModule('portfolio')} className={`text-xs md:text-sm font-bold text-slate-500 ${accentHoverText} transition-colors`}>Ver todo</button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className={`h-10 w-10 animate-spin ${accentText}`} />
                </div>
              ) : displayPortfolio.length > 0 ? (
                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scrollContainer(portfolioScrollRef, 'left')}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white opacity-0 group-hover/portfolio:opacity-100 transition-opacity hover:bg-amber-600 -ml-4 items-center justify-center backdrop-blur-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Scrollable Container */}
                  <div
                    ref={portfolioScrollRef}
                    className="flex overflow-x-auto gap-4 md:gap-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {displayPortfolio.map(item => (
                      <div key={item.id} className="flex-none w-[calc(50%-8px)] md:w-[calc(20%-12px)] snap-start">
                        <PortfolioCard item={item} onClick={() => onItemSelect(item.id, 'portfolio')} />
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => scrollContainer(portfolioScrollRef, 'right')}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white opacity-0 group-hover/portfolio:opacity-100 transition-opacity hover:bg-amber-600 -mr-4 items-center justify-center backdrop-blur-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white/5 rounded-2xl border border-white/5">
                  No hay portafolios para mostrar en este momento.
                </div>
              )}
            </section>

            {/* Blog Articles - Carousel */}
            <section className="relative group/blog">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Newspaper className="h-5 w-5 md:h-6 md:w-6 text-rose-500" />
                  Artículos de Blog
                </h2>
                <button onClick={() => onNavigateToModule('blog')} className="text-xs md:text-sm font-bold text-slate-500 hover:text-rose-500 transition-colors">Ver más</button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
                </div>
              ) : displayBlog.length > 0 ? (
                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scrollContainer(blogScrollRef, 'left')}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white opacity-0 group-hover/blog:opacity-100 transition-opacity hover:bg-rose-600 -ml-4 items-center justify-center backdrop-blur-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Scrollable Container */}
                  <div
                    ref={blogScrollRef}
                    className="flex overflow-x-auto gap-4 md:gap-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {displayBlog.map(article => (
                      <div key={article.id} className="flex-none w-[calc(50%-8px)] md:w-[calc(20%-12px)] snap-start">
                        <BlogCard
                          article={article}
                          onClick={() => onItemSelect(article.id, 'blog')}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => scrollContainer(blogScrollRef, 'right')}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white opacity-0 group-hover/blog:opacity-100 transition-opacity hover:bg-rose-600 -mr-4 items-center justify-center backdrop-blur-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white/5 rounded-2xl border border-white/5">No hay artículos disponibles.</div>
              )}
            </section>

            {/* Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">¿Listo para compartir tu trabajo?</h2>
                <p className="text-purple-200 text-sm mb-4">Únete a miles de {mode === 'dev' ? 'desarrolladores' : 'creativos'} en nuestra plataforma.</p>
                <button onClick={() => onNavigateToModule('portfolio')} className="px-6 py-2 bg-white text-purple-900 font-bold rounded-lg hover:scale-105 transition-transform text-sm w-full md:w-auto">
                  Explorar Portafolios
                </button>
              </div>
              <div className="hidden md:block relative z-10">
                <Users className="h-24 w-24 text-white/20" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
