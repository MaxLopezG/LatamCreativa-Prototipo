
import React from 'react';
import { ArrowRight, Layers, GraduationCap, Store, Newspaper, Move3d, MonitorPlay, Palette, Gamepad2, Globe, Users, Code, Server, Database, Cloud } from 'lucide-react';
import { PORTFOLIO_ITEMS, EDUCATION_ITEMS, ASSET_ITEMS, BLOG_ITEMS } from '../data/content';
import { SUBSCRIPTIONS } from '../data/navigation';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { EducationCard } from '../components/cards/EducationCard';
import { AssetCard } from '../components/cards/AssetCard';
import { ContentMode } from '../hooks/useAppStore';

interface FeedViewProps {
  onNavigateToModule: (moduleId: string) => void;
  onItemSelect: (id: string, type: 'portfolio' | 'course' | 'asset' | 'blog') => void;
  contentMode: ContentMode;
}

export const FeedView: React.FC<FeedViewProps> = ({ onNavigateToModule, onItemSelect, contentMode }) => {
  
  // Filter content based on mode (default 'creative')
  const mode = contentMode || 'creative';
  
  // Increased slice to fill new grid
  const displayPortfolio = PORTFOLIO_ITEMS.filter(i => (i.domain || 'creative') === mode).slice(0, 6);
  const displayBlog = BLOG_ITEMS.filter(i => (i.domain || 'creative') === mode).slice(0, 5);
  const displayEducation = EDUCATION_ITEMS.filter(i => (i.domain || 'creative') === mode).slice(0, 4);
  const displayAssets = ASSET_ITEMS.filter(i => (i.domain || 'creative') === mode).slice(0, 5);

  const creativeCategories = [
      { label: 'Modelado 3D', icon: Move3d, color: 'from-blue-500 to-cyan-500' },
      { label: 'Animación', icon: MonitorPlay, color: 'from-purple-500 to-pink-500' },
      { label: 'Concept Art', icon: Palette, color: 'from-amber-500 to-orange-500' },
      { label: 'Game Dev', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
  ];

  const devCategories = [
      { label: 'Frontend', icon: Code, color: 'from-blue-500 to-cyan-500' },
      { label: 'Backend', icon: Server, color: 'from-green-500 to-emerald-500' },
      { label: 'DevOps', icon: Cloud, color: 'from-orange-500 to-red-500' },
      { label: 'Database', icon: Database, color: 'from-purple-500 to-pink-500' },
  ];

  const categories = mode === 'dev' ? devCategories : creativeCategories;

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
      
      {/* Live & Stories Rail */}
      <div className="w-full bg-[#050506] border-b border-white/5 py-4 overflow-x-auto scrollbar-hide">
          <div className="max-w-[2560px] mx-auto px-6 md:px-12 2xl:px-16 flex gap-6">
              {SUBSCRIPTIONS.map((sub) => (
                  <div key={sub.id} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
                      <div className={`p-[3px] rounded-full ${sub.isLive ? 'bg-gradient-to-tr from-amber-500 to-purple-600 animate-pulse' : 'bg-white/10 group-hover:bg-white/20'}`}>
                          <div className="h-16 w-16 rounded-full border-2 border-[#050506] overflow-hidden">
                              <img src={sub.image} alt={sub.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium group-hover:text-white transition-colors w-16 text-center truncate">{sub.name}</span>
                      {sub.isLive && <span className="text-[9px] bg-red-500 text-white px-1.5 rounded uppercase font-bold tracking-wider">Live</span>}
                  </div>
              ))}
              {Array.from({ length: 15 }).map((_, i) => (
                  <div key={`fake-${i}`} className="flex flex-col items-center gap-2 cursor-pointer group opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
                      <div className="p-[3px] rounded-full bg-white/10">
                          <div className="h-16 w-16 rounded-full border-2 border-[#050506] overflow-hidden bg-slate-800">
                              <img 
                                src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                                alt="" 
                              />
                          </div>
                      </div>
                      <span className="text-xs text-slate-500 w-16 text-center truncate">User {i + 1}</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
          <div className="absolute inset-0">
              <img 
                src={mode === 'dev' ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop" : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"} 
                alt="Latam Creativa Hero" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#030304] via-[#030304]/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 h-full w-full max-w-[2560px] mx-auto px-6 md:px-12 2xl:px-16 flex flex-col justify-center">
              <div className="max-w-3xl animate-slide-up">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badgeBg} text-xs font-bold uppercase tracking-widest mb-6 border backdrop-blur-md`}>
                      <Globe className="h-3 w-3" /> Comunidad Oficial
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display">
                      Latam Creativa <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientTitle}`}>{mode === 'dev' ? 'Developers' : 'Originals'}</span>
                  </h1>
                  <p className={`text-lg text-slate-300 mb-8 max-w-xl leading-relaxed border-l-4 ${mode === 'dev' ? 'border-blue-500' : 'border-amber-500'} pl-6`}>
                      {mode === 'dev' 
                        ? 'Recursos, librerías y tutoriales para desarrolladores de software en Latinoamérica.'
                        : 'Descubre las historias, tutoriales y proyectos exclusivos producidos por y para la comunidad.'
                      }
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => onNavigateToModule('blog')}
                        className={`px-6 py-3 bg-white text-black font-bold rounded-xl ${accentHoverBg} hover:text-white transition-colors shadow-lg`}
                      >
                          Leer Artículos
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="w-full max-w-[2560px] mx-auto px-6 md:px-12 2xl:px-16 -mt-8 relative z-20">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Main Content (Feed) - Full Width */}
              <div className="lg:col-span-12 space-y-16">
                  
                  {/* Quick Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((cat, idx) => (
                          <div key={idx} className="group relative h-20 rounded-xl bg-[#0A0A0C] border border-white/10 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform shadow-lg">
                              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${cat.color} transition-opacity`}></div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-4">
                                  <cat.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{cat.label}</span>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Featured Portfolio */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Layers className={`h-6 w-6 ${accentText}`} />
                        {mode === 'dev' ? 'Repositorios & Proyectos' : 'Tendencias'}
                      </h2>
                      <button onClick={() => onNavigateToModule('portfolio')} className={`text-sm font-bold text-slate-500 ${accentHoverText} transition-colors`}>Ver todo</button>
                    </div>
                    
                    {displayPortfolio.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {displayPortfolio.map(item => (
                            <PortfolioCard key={item.id} item={item} onClick={() => onItemSelect(item.id, 'portfolio')} />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">No hay proyectos destacados en este momento.</div>
                    )}
                  </section>

                  {/* Blog & News */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Newspaper className="h-6 w-6 text-blue-500" />
                        Noticias
                      </h2>
                      <button onClick={() => onNavigateToModule('blog')} className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Leer blog</button>
                    </div>

                    {displayBlog.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="group cursor-pointer relative h-[300px] rounded-2xl overflow-hidden" onClick={() => onItemSelect(displayBlog[0].id, 'blog')}>
                                <img src={displayBlog[0].image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded mb-2 inline-block">{displayBlog[0].category}</span>
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{displayBlog[0].title}</h3>
                                </div>
                            </div>
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
                        <div className="text-center py-10 text-slate-500">No hay noticias disponibles.</div>
                    )}
                  </section>

                  {/* Banner */}
                  <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 p-8 relative overflow-hidden flex items-center justify-between">
                      <div className="relative z-10 max-w-lg">
                          <h2 className="text-2xl font-bold text-white mb-2">¿Buscas equipo?</h2>
                          <p className="text-purple-200 text-sm mb-4">Únete a miles de {mode === 'dev' ? 'desarrolladores' : 'creativos'} en nuestra sección de Comunidad.</p>
                          <button onClick={() => onNavigateToModule('community')} className="px-6 py-2 bg-white text-purple-900 font-bold rounded-lg hover:scale-105 transition-transform text-sm">
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
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <GraduationCap className="h-6 w-6 text-emerald-500" />
                        Aprende
                      </h2>
                      <button onClick={() => onNavigateToModule('education')} className="text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors">Ver cursos</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {displayEducation.map(item => (
                        <EducationCard key={item.id} course={item} onClick={() => onItemSelect(item.id, 'course')} />
                      ))}
                    </div>
                  </section>

                  {/* Market */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Store className="h-6 w-6 text-purple-500" />
                        {mode === 'dev' ? 'Templates & Code' : 'Assets'}
                      </h2>
                      <button onClick={() => onNavigateToModule('market')} className="text-sm font-bold text-slate-500 hover:text-purple-500 transition-colors">Ir a la tienda</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {displayAssets.map(item => (
                        <AssetCard key={item.id} asset={item} onClick={() => onItemSelect(item.id, 'asset')} />
                      ))}
                    </div>
                  </section>

              </div>

          </div>
      </div>
    </div>
  );
};
