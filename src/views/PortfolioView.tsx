
import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { ContentMode } from '../hooks/useAppStore';

interface PortfolioViewProps {
  activeCategory: string;
  onItemSelect?: (id: string) => void;
  onCreateClick?: () => void;
  contentMode: ContentMode;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ activeCategory, onItemSelect, onCreateClick, contentMode }) => {
  
  const mode = contentMode || 'creative';

  // Filter items by mode
  const filteredItems = PORTFOLIO_ITEMS.filter(item => (item.domain || 'creative') === mode);

  // Apply Category Filter if not Home
  const displayItems = activeCategory === 'Home' 
    ? filteredItems 
    : filteredItems.filter(item => item.category === activeCategory);

  const accentText = mode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBg = mode === 'dev' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20';

  return (
    <div className="w-full max-w-[2560px] mx-auto px-4 md:px-10 2xl:px-16 pt-6 md:pt-8 pb-16 transition-colors">
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Layers className={`h-6 w-6 md:h-8 md:w-8 ${accentText}`} />
            Portafolio
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-lg">
            Descubre los mejores {mode === 'dev' ? 'proyectos de código' : 'trabajos'} de la comunidad en {activeCategory === 'Home' ? 'todas las categorías' : activeCategory}.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
             onClick={onCreateClick}
             className={`flex items-center gap-2 px-4 md:px-5 py-2 ${accentBg} text-white font-bold rounded-xl transition-colors shadow-lg text-sm md:text-base`}
          >
             <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Subir Proyecto</span><span className="sm:hidden">Subir</span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden md:block"></div>

          <span className="text-base text-slate-500 dark:text-slate-400 hidden sm:inline">Ordenar por:</span>
          <div className="flex gap-2">
            <button className="px-3 md:px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-white font-medium hover:bg-slate-300 dark:hover:bg-white/10 transition-colors text-xs md:text-sm">
              Tendencia
            </button>
            <button className="px-3 md:px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors text-xs md:text-sm">
              Recientes
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Increased density for smaller cards - xl:6, 2xl:7, 3xl:8 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6">
        {displayItems.length > 0 ? (
            displayItems.map((item) => (
            <PortfolioCard 
                key={item.id} 
                item={item} 
                onClick={() => onItemSelect?.(item.id)}
            />
            ))
        ) : (
            <div className="col-span-full py-20 text-center">
                <p className="text-slate-500 text-lg">No hay proyectos para mostrar en esta categoría.</p>
                <button onClick={onCreateClick} className={`mt-4 ${accentText} font-bold hover:underline`}>Sé el primero en subir uno</button>
            </div>
        )}
      </div>

      {displayItems.length > 0 && (
        <div className="mt-12 md:mt-16 flex justify-center">
            <button className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold hover:scale-105 transition-transform text-sm md:text-base">
            Cargar más proyectos
            </button>
        </div>
      )}
    </div>
  );
};
