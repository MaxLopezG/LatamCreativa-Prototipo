
import React, { useState } from 'react';
import { CalendarDays, Filter, Plus, Search, MapPin } from 'lucide-react';
import { EVENT_ITEMS } from '../data/content';
import { EventCard } from '../components/cards/EventCard';
import { Pagination } from '../components/common/Pagination';
import { FilterPanel } from '../components/common/FilterPanel';

interface EventsViewProps {
  onEventSelect?: (id: string) => void;
  onCreateClick?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ onEventSelect, onCreateClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const eventTopics = [
    "Modelado 3D", "Animación", "Game Dev", "Concept Art", 
    "VFX", "Realidad Virtual", "Industria", "Networking"
  ];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-red-900 to-pink-900 p-8 mb-10 overflow-hidden shadow-2xl shadow-red-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/20">
                    <CalendarDays className="h-4 w-4" /> Agenda Creativa
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Conecta en vivo</h2>
                <p className="text-red-100 text-lg">Descubre conferencias, talleres y meetups para potenciar tu carrera.</p>
             </div>
             <button 
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-red-900 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg"
             >
                <Plus className="h-5 w-5" /> Crear Evento
             </button>
         </div>
         
         <div className="relative z-10 mt-8 max-w-xl">
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-red-200" />
                <input 
                    type="text" 
                    placeholder="Buscar eventos (ej. Blender, Madrid, Online...)" 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-red-200/70 focus:outline-none focus:border-white/50 transition-all"
                />
            </div>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm whitespace-nowrap">
                Todos
            </button>
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 whitespace-nowrap">
                Online
            </button>
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 whitespace-nowrap">
                Presencial
            </button>
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 whitespace-nowrap">
                Gratis
            </button>
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
                topics={eventTopics}
            />
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <select className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer">
              <option>Próximos</option>
              <option>Populares</option>
              <option>Nuevos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
        {EVENT_ITEMS.map((event) => (
          <EventCard 
             key={event.id} 
             event={event} 
             onClick={() => onEventSelect?.(event.id)}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};
