
import React from 'react';
import { Users, Filter, Plus, Search } from 'lucide-react';
import { COMMUNITY_GROUPS } from '../data/content';
import { GroupCard } from '../components/cards/GroupCard';
import { Pagination } from '../components/common/Pagination';

interface CommunityViewProps {
  onProjectSelect?: (id: string) => void;
  onCreateProjectClick?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onProjectSelect, onCreateProjectClick }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 p-8 mb-10 overflow-hidden shadow-2xl shadow-purple-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                <Users className="h-4 w-4" /> Team Building
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Encuentra tu equipo ideal</h2>
            <p className="text-purple-100 text-lg">Únete a proyectos colaborativos, game jams y cortometrajes indie.</p>
         </div>
         <div className="relative z-10 mt-6 flex flex-wrap gap-4">
            <button 
                onClick={onCreateProjectClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
                <Plus className="h-5 w-5" /> Crear Proyecto
            </button>
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-purple-200" />
                <input 
                    type="text" 
                    placeholder="Buscar por rol (ej: Programador, Artista 2D)..." 
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder-purple-300 focus:outline-none focus:border-white/50 transition-colors"
                />
            </div>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Proyectos buscando colaboradores
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {COMMUNITY_GROUPS.length} equipos reclutando ahora
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
             <Filter className="h-4 w-4" /> Filtros
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <select className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer">
              <option>Recientes</option>
              <option>Más miembros</option>
              <option>Urgente</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 mb-16">
        {COMMUNITY_GROUPS.map((group) => (
          <GroupCard 
             key={group.id} 
             group={group} 
             onClick={() => onProjectSelect?.(group.id)}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};
