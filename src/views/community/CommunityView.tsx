
import React, { useState } from 'react';
import { Users, Filter, Plus, Search, Layers, Compass, ArrowUpDown } from 'lucide-react';
import { COMMUNITY_GROUPS } from '../../data/content';
import { GroupCard } from '../../components/cards/GroupCard';
import { Pagination } from '../../components/common/Pagination';

interface CommunityViewProps {
  onProjectSelect?: (id: string) => void;
  onCreateProjectClick?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onProjectSelect, onCreateProjectClick }) => {
  const [viewMode, setViewMode] = useState<'explore' | 'my-projects'>('explore');

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#0f0f12] min-h-screen">

      {/* Cinematic Hero Banner */}
      <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 h-[500px] flex items-center justify-center overflow-hidden mb-12">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
            alt="Community Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0f0f12]/80 to-[#0f0f12]"></div>

          {/* Vibrant Glows - Amber/Purple Theme */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
        </div>

        <div className="relative z-10 px-6 w-full max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
            <Users className="h-3 w-3" /> Team Building
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Construye el Futuro <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">En Equipo</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Únete a proyectos colaborativos, game jams y cortometrajes indie. Encuentra los roles que faltan en tu squad.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por rol (ej: Modelador, Dev, Concept Art...)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all backdrop-blur-xl shadow-2xl"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Toolbar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/10 w-fit">
          <button
            onClick={() => setViewMode('explore')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'explore'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Compass className="h-4 w-4" /> Explorar
          </button>
          <button
            onClick={() => setViewMode('my-projects')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'my-projects'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Layers className="h-4 w-4" /> Mis Proyectos
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onCreateProjectClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all font-bold text-sm"
          >
            <Plus className="h-4 w-4" /> Iniciar Proyecto
          </button>

          <div className="h-8 w-px bg-white/10 hidden md:block mx-1"></div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <Filter className="h-4 w-4" /> Filtros
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <span className="text-slate-500 text-xs uppercase font-bold mr-1">Ordenar:</span>Urgente <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-500" /> Proyectos Activos
        </h2>
        <p className="text-slate-400 mt-1 text-sm">
          {COMMUNITY_GROUPS.length} equipos reclutando talento ahora mismo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 mb-16">
        {COMMUNITY_GROUPS.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onClick={() => onProjectSelect?.(group.id)}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => { }} />
    </div>
  );
};
