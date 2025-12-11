
import React from 'react';
import { Layers, Plus, Image as ImageIcon, Search, Filter, ArrowUpDown } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../../data/content';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';

interface PortfolioViewProps {
  activeCategory: string;
  onItemSelect?: (id: string) => void;
  onCreateClick?: () => void;
  onSave?: (id: string, image: string) => void;
  contentMode: ContentMode;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ activeCategory, onItemSelect, onCreateClick, onSave, contentMode }) => {


  const { state } = useAppStore();
  const createdItems = state.createdItems || []; // Keep for optimistic updates if needed, but prefer fetched data
  const mode = contentMode || 'creative';

  const [fetchedProjects, setFetchedProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // Use the feed API which returns paginated results
        // Passing null as cursor to get first page
        const result = await import('../../services/api').then(m => m.api.getFeed(null, 20));
        setFetchedProjects(result.data);
      } catch (error) {
        console.error("Failed to load portfolio projects:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [mode]); // Reload if mode changes, though getFeed might need mode filtering in future

  // Merge: Fetched Real Data + Static Data
  // We prioritize fetched data.
  // Note: 'createdItems' from store might duplicate fetched data if we are not careful, 
  // but for now we'll assume fetchedProjects is the source of truth for global feed.
  const allItems = [...fetchedProjects, ...PORTFOLIO_ITEMS];

  // Filter items by mode
  const filteredItems = allItems.filter(item => (item.domain || 'creative') === mode);

  // Apply Category Filter if not Home
  const displayItems = activeCategory === 'Home'
    ? filteredItems
    : filteredItems.filter(item => item.category === activeCategory);

  const accentText = mode === 'dev' ? 'text-blue-500' : 'text-pink-500';
  const accentBg = mode === 'dev' ? 'bg-blue-600' : 'bg-pink-600';
  const accentGradient = mode === 'dev' ? 'from-blue-400 to-cyan-300' : 'from-pink-400 to-rose-300';

  // New vibrant background setup
  const heroImage = mode === 'dev'
    ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#0f0f12] min-h-screen">

      {/* Cinematic Hero Banner - Full Width */}
      <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 h-[500px] flex items-center justify-center overflow-hidden mb-12">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
            alt="Portfolio Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0f0f12]/80 to-[#0f0f12]"></div>

          {/* Vibrant Glows */}
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${mode === 'dev' ? 'bg-blue-600/20' : 'bg-pink-600/20'} rounded-full blur-[150px] pointer-events-none mix-blend-screen`}></div>
          <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${mode === 'dev' ? 'bg-cyan-600/10' : 'bg-purple-600/10'} rounded-full blur-[150px] pointer-events-none mix-blend-screen`}></div>
        </div>

        <div className="relative z-10 px-6 w-full max-w-5xl text-center">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${mode === 'dev' ? 'text-blue-400' : 'text-pink-400'} text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg`}>
            <ImageIcon className="h-3 w-3" /> {mode === 'dev' ? 'Showcase Developer' : 'Inspiración Visual'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Descubre <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>Obras Maestras</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Explora {mode === 'dev' ? 'repositorios y snippets' : 'modelos 3D, concept art y animaciones'} creados por la comunidad más talentosa de Latam.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={`Buscar en ${activeCategory === 'Home' ? 'todo' : activeCategory}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white/20 transition-all backdrop-blur-xl shadow-2xl"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className={`p-2 rounded-xl ${accentBg} text-white hover:brightness-110 transition-all`}>
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className={`h-6 w-6 ${accentText}`} />
            {activeCategory === 'Home' ? 'Feed de Proyectos' : activeCategory}
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            Mostrando {displayItems.length} resultados ordenados por relevancia
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onCreateClick}
            className={`flex items-center gap-2 px-6 py-2.5 ${accentBg} text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-${mode === 'dev' ? 'blue' : 'pink'}-500/20`}
          >
            <Plus className="h-4 w-4" /> {mode === 'dev' ? 'Compartir Código' : 'Subir Proyecto'}
          </button>

          <div className="h-8 w-px bg-white/10 hidden md:block mx-2"></div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <Filter className="h-4 w-4" /> Filtrar
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <span className="text-slate-500 text-xs uppercase font-bold mr-1">Ordenar:</span>Tendencia <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-16">
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={() => onItemSelect?.(item.id)}
              onSave={onSave}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg">No hay proyectos para mostrar en esta categoría.</p>
            <button onClick={onCreateClick} className={`mt-4 ${accentText} font-bold hover:underline`}>Sé el primero en subir uno</button>
          </div>
        )}
      </div>

      {displayItems.length > 0 && (
        <div className="mt-12 md:mt-16 flex justify-center">
          <button className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all text-sm md:text-base backdrop-blur-md">
            Cargar más proyectos
          </button>
        </div>
      )}
    </div>
  );
};
