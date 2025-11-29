
import React, { useState } from 'react';
import { Briefcase, Filter, Plus, Search, TrendingUp } from 'lucide-react';
import { FREELANCE_SERVICES } from '../data/content';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Pagination } from '../components/common/Pagination';
import { FilterPanel } from '../components/common/FilterPanel';

interface FreelanceViewProps {
  activeCategory?: string;
  onServiceSelect?: (id: string) => void;
  onCreateClick?: () => void;
}

export const FreelanceView: React.FC<FreelanceViewProps> = ({ activeCategory = 'Home', onServiceSelect, onCreateClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredServices = activeCategory === 'Home'
    ? FREELANCE_SERVICES
    : FREELANCE_SERVICES.filter(s => s.category === activeCategory);

  const displayServices = filteredServices.length > 0 ? filteredServices : FREELANCE_SERVICES;

  const freelanceTopics = [
    "Modelado 3D", "Rigging", "Animación", "Concept Art", 
    "UI/UX Design", "Programación", "Música/SFX", "Edición de Video"
  ];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 mb-10 overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-700">
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/50 text-slate-200 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-600">
                    <Briefcase className="h-4 w-4" /> Freelance Market
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Contrata Talento Experto</h2>
                <p className="text-slate-400 text-lg">Encuentra artistas freelance para tu próximo proyecto o vende tus servicios.</p>
             </div>
             <button 
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
             >
                <Plus className="h-5 w-5" /> Ofrecer Servicio
             </button>
         </div>
         
         <div className="relative z-10 mt-8 max-w-xl">
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="¿Qué servicio estás buscando? (ej. Rigging, Concept Art...)" 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
            </div>
            
            {/* Popular Searches */}
            <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium"><TrendingUp className="h-3 w-3" /> Popular:</span>
                <div className="flex flex-wrap gap-2">
                    {['Rigging', 'Vtuber Model', 'UI Game', 'Pixel Art', 'Low Poly'].map(tag => (
                        <button key={tag} className="hover:text-white hover:underline transition-colors">{tag}</button>
                    ))}
                </div>
            </div>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeCategory === 'Home' ? 'Servicios Destacados' : `Servicios de ${activeCategory}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {displayServices.length} gigs disponibles
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
                topics={freelanceTopics}
            />
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <select className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer">
              <option>Recomendado</option>
              <option>Más vendidos</option>
              <option>Nuevos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-16">
        {displayServices.map((service) => (
          <ServiceCard 
             key={service.id} 
             service={service} 
             onClick={() => onServiceSelect?.(service.id)}
          />
        ))}
        {displayServices.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
                No hay servicios en esta categoría todavía.
            </div>
        )}
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};
