
import React, { useState } from 'react';
import { UsersRound, Filter, Search, Globe, Briefcase } from 'lucide-react';
import { ARTIST_DIRECTORY } from '../data/content';
import { ArtistCard } from '../components/cards/ArtistCard';
import { Pagination } from '../components/common/Pagination';
import { FilterPanel } from '../components/common/FilterPanel';

interface PeopleViewProps {
  onProfileSelect?: (id: string) => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({ onProfileSelect }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const professions = [
    "Character Artist", "Environment Artist", "Animator 3D", "Animator 2D", 
    "Concept Artist", "UI/UX Designer", "VFX Artist", "Rigger", "Lighting Artist"
  ];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-teal-900 to-cyan-900 p-8 mb-10 overflow-hidden shadow-2xl shadow-teal-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/20">
                <UsersRound className="h-4 w-4" /> Directorio de Talentos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Conecta con Creadores</h2>
            <p className="text-teal-100 text-lg">Descubre artistas increíbles, encuentra colaboradores o contrata expertos para tu próximo proyecto.</p>
         </div>
         
         <div className="relative z-10 mt-8 max-w-xl">
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-teal-200" />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, habilidad o rol..." 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-teal-200/70 focus:outline-none focus:border-white/50 transition-all"
                />
            </div>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Artistas Destacados
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {ARTIST_DIRECTORY.length} perfiles activos
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative">
          <div className="relative">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                    isFilterOpen 
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
            >
                <Filter className="h-4 w-4" /> Filtros
            </button>
            <FilterPanel 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
                topics={professions}
            />
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <select className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer">
              <option>Relevancia</option>
              <option>Más seguidores</option>
              <option>Nuevos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-16">
        {ARTIST_DIRECTORY.map((artist) => (
          <ArtistCard 
             key={artist.id} 
             artist={artist} 
             onClick={() => onProfileSelect?.(artist.name)}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};
