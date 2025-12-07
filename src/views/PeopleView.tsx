
import React, { useState } from 'react';
import { UsersRound, Filter, Search } from 'lucide-react';
import { ARTIST_DIRECTORY } from '../data/content';
import { ArtistCard } from '../components/cards/ArtistCard';
import { Pagination } from '../components/common/Pagination';
import { FilterPanel } from '../components/common/FilterPanel';
import { useAppStore } from '../hooks/useAppStore';

interface PeopleViewProps {
  onProfileSelect?: (id: string) => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({ onProfileSelect }) => {
  const { state } = useAppStore();
  const { contentMode } = state;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const professions = [
    "Character Artist", "Environment Artist", "Animator 3D", "Animator 2D", 
    "Concept Artist", "UI/UX Designer", "VFX Artist", "Rigger", "Lighting Artist"
  ];

  // Filter artists based on the current mode
  const filteredArtists = ARTIST_DIRECTORY.filter(artist => 
    (artist.domain || 'creative') === contentMode
  );

  // Dynamic Styling based on mode
  const isDev = contentMode === 'dev';
  const bannerGradient = isDev ? 'from-blue-900 to-indigo-900' : 'from-teal-900 to-cyan-900';
  const shadowColor = isDev ? 'shadow-blue-900/20' : 'shadow-teal-900/20';
  const badgeStyle = isDev 
    ? 'bg-blue-500/20 text-blue-200 border-blue-500/20' 
    : 'bg-teal-500/20 text-teal-200 border-teal-500/20';
  const textColor = isDev ? 'text-blue-100' : 'text-teal-100';
  const iconColor = isDev ? 'text-blue-200' : 'text-teal-200';
  const searchPlaceholderColor = isDev ? 'placeholder-blue-200/70' : 'placeholder-teal-200/70';

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className={`relative rounded-2xl bg-gradient-to-r ${bannerGradient} p-8 mb-10 overflow-hidden shadow-2xl ${shadowColor} animate-fade-in transition-all duration-500`}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${badgeStyle}`}>
                <UsersRound className="h-4 w-4" /> {isDev ? 'Directorio de Desarrolladores' : 'Directorio de Talentos'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Conecta con {isDev ? 'Developers' : 'Creadores'}</h2>
            <p className={`${textColor} text-lg`}>
                {isDev 
                    ? 'Encuentra colaboradores técnicos, expertos en motores gráficos y programadores full-stack.'
                    : 'Descubre artistas increíbles, encuentra colaboradores o contrata expertos para tu próximo proyecto.'
                }
            </p>
         </div>
         
         <div className="relative z-10 mt-8 max-w-xl">
            <div className="relative">
                <Search className={`absolute left-4 top-3.5 h-5 w-5 ${iconColor}`} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, habilidad o rol..." 
                    className={`w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white ${searchPlaceholderColor} focus:outline-none focus:border-white/50 transition-all`}
                />
            </div>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isDev ? 'Desarrolladores Destacados' : 'Artistas Destacados'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {filteredArtists.length} perfiles activos
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative">
          <div className="relative">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                    isFilterOpen 
                    ? (isDev ? 'bg-blue-500 text-white border-blue-500' : 'bg-amber-500 text-white border-amber-500')
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
        {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
            <div key={artist.id}>
                <ArtistCard 
                    artist={artist} 
                    onClick={() => onProfileSelect?.(artist.name)}
                />
            </div>
            ))
        ) : (
            <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UsersRound className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No se encontraron perfiles en esta categoría.</p>
            </div>
        )}
      </div>

      {filteredArtists.length > 0 && <Pagination currentPage={1} onPageChange={() => {}} />}
    </div>
  );
};
