
import React, { useState } from 'react';
import { CalendarDays, Filter, Plus, Search, MapPin, Ticket } from 'lucide-react';
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
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Events Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-900/80 to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-6xl py-12 flex flex-col md:flex-row gap-12 items-center justify-between">
              <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-red-600/20 border border-red-500/30 backdrop-blur-md">
                      <Ticket className="h-3 w-3" /> Agenda Creativa
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                      Conecta con la <br/><span className="text-red-300">Industria en Vivo</span>
                  </h1>
                  <p className="text-lg md:text-xl text-red-100 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                      Descubre conferencias, talleres y meetups exclusivos. El lugar donde artistas y desarrolladores comparten conocimiento.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                      <button 
                          onClick={onCreateClick}
                          className="px-8 py-4 bg-white text-red-900 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
                      >
                          <Plus className="h-5 w-5" /> Crear Evento
                      </button>
                      <div className="relative flex-1 min-w-[260px] max-w-sm">
                          <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
                          <input 
                              type="text" 
                              placeholder="Buscar eventos..." 
                              className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:bg-black/30 transition-all backdrop-blur-md"
                          />
                      </div>
                  </div>
              </div>
              
              {/* Featured Event Widget */}
              <div className="hidden lg:block bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                   <div className="flex items-center gap-3 mb-3 text-red-300 font-bold text-xs uppercase tracking-wider">
                      <CalendarDays className="h-4 w-4" /> Próximo Highlight
                   </div>
                   <div className="text-white font-bold text-2xl mb-2 leading-tight">Digital Sculpting Summit</div>
                   <div className="text-white/70 text-sm mb-4">15 Noviembre, 2024</div>
                   <button className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
                      Ver Detalles
                   </button>
              </div>
          </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm whitespace-nowrap shadow-md">
                Todos
            </button>
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 whitespace-nowrap transition-colors">
                Online
            </button>
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 whitespace-nowrap transition-colors">
                Presencial
            </button>
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 whitespace-nowrap transition-colors">
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
