
import React from 'react';
import { Layers, Plus, Image as ImageIcon, Search, Filter, ArrowUpDown } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { ContentMode } from '../hooks/useAppStore';

interface PortfolioViewProps {
  activeCategory: string;
  onItemSelect?: (id: string) => void;
  onCreateClick?: () => void;
  onSave?: (id: string, image: string) => void;
  contentMode: ContentMode;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ activeCategory, onItemSelect, onCreateClick, onSave, contentMode }) => {
  
  const mode = contentMode || 'creative';

  // Filter items by mode
  const filteredItems = PORTFOLIO_ITEMS.filter(item => (item.domain || 'creative') === mode);

  // Apply Category Filter if not Home
  const displayItems = activeCategory === 'Home' 
    ? filteredItems 
    : filteredItems.filter(item => item.category === activeCategory);

  const accentText = mode === 'dev' ? 'text-blue-500' : 'text-pink-500';
  const accentBg = mode === 'dev' ? 'bg-blue-600' : 'bg-pink-600';
  const accentGradient = mode === 'dev' ? 'from-blue-400 to-cyan-300' : 'from-pink-400 to-rose-300';
  const heroImage = mode === 'dev' 
    ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src={heroImage} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Portfolio Hero" 
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${mode === 'dev' ? 'from-blue-950/95 via-blue-900/80' : 'from-slate-950/95 via-slate-900/80'} to-transparent mix-blend-multiply`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-5xl py-12">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${mode === 'dev' ? 'bg-blue-500 border-blue-400/30 shadow-blue-500/20' : 'bg-pink-500 border-pink-400/30 shadow-pink-500/20'} text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg border backdrop-blur-md`}>
                  <ImageIcon className="h-3 w-3" /> {mode === 'dev' ? 'Showcase Developer' : 'Inspiración Visual'}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  El Escaparate del <br/><span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>Talento Latino</span>
              </h1>
              <p className={`text-lg md:text-xl ${mode === 'dev' ? 'text-blue-100' : 'text-pink-100'} mb-8 max-w-xl leading-relaxed drop-shadow-md`}>
                  Explora miles de {mode === 'dev' ? 'repositorios, snippets y proyectos open source' : 'proyectos de 3D, animación, concept art y diseño'} creados por la comunidad.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                  <button 
                      onClick={onCreateClick}
                      className={`px-8 py-4 ${accentBg} text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-xl shadow-black/20 flex items-center gap-2`}
                  >
                      <Plus className="h-5 w-5" /> {mode === 'dev' ? 'Compartir Código' : 'Subir Proyecto'}
                  </button>
                  <div className="relative flex-1 min-w-[260px] max-w-sm">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
                      <input 
                          type="text" 
                          placeholder={`Buscar en ${activeCategory === 'Home' ? 'todo' : activeCategory}...`}
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:bg-black/30 transition-all backdrop-blur-md"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Layers className={`h-6 w-6 ${accentText}`} />
            {activeCategory === 'Home' ? 'Feed de Proyectos' : activeCategory}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Mostrando {displayItems.length} resultados ordenados por relevancia
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
             <Filter className="h-4 w-4" /> Filtrar
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm">
             Tendencia <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Increased density for smaller cards - xl:6, 2xl:7, 3xl:8 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6 mb-16">
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
            <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No hay proyectos para mostrar en esta categoría.</p>
                <button onClick={onCreateClick} className={`mt-4 ${accentText} font-bold hover:underline`}>Sé el primero en subir uno</button>
            </div>
        )}
      </div>

      {displayItems.length > 0 && (
        <div className="mt-12 md:mt-16 flex justify-center">
            <button className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold hover:scale-105 transition-transform text-sm md:text-base shadow-lg">
                Cargar más proyectos
            </button>
        </div>
      )}
    </div>
  );
};
