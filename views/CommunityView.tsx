
import React from 'react';
import { Users, Filter, Plus, Search, Layers } from 'lucide-react';
import { COMMUNITY_GROUPS } from '../data/content';
import { GroupCard } from '../components/cards/GroupCard';
import { Pagination } from '../components/common/Pagination';

interface CommunityViewProps {
  onProjectSelect?: (id: string) => void;
  onCreateProjectClick?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onProjectSelect, onCreateProjectClick }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Community Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-900/80 to-purple-900/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-5xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-purple-500/20 border border-purple-400/30 backdrop-blur-md">
                  <Users className="h-3 w-3" /> Team Building
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  Construye el Futuro <br/><span className="text-purple-300">En Equipo</span>
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                  Únete a proyectos colaborativos, game jams y cortometrajes indie. Encuentra los roles que faltan en tu squad.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                  <button 
                      onClick={onCreateProjectClick}
                      className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
                  >
                      <Plus className="h-5 w-5" /> Iniciar Proyecto
                  </button>
                  <div className="relative flex-1 min-w-[260px] max-w-md">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
                      <input 
                          type="text" 
                          placeholder="Buscar por rol (ej: Modelador, Dev...)" 
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:bg-black/30 transition-all backdrop-blur-md"
                      />
                  </div>
              </div>
          </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-500" /> Proyectos Activos
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {COMMUNITY_GROUPS.length} equipos reclutando ahora mismo
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
