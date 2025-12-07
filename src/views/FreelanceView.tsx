
import React, { useState } from 'react';
import { Briefcase, Filter, Plus, Search, TrendingUp, UserCheck, Star } from 'lucide-react';
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
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Freelance Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/95 via-cyan-900/80 to-cyan-900/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-5xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-cyan-500/20 border border-cyan-400/30 backdrop-blur-md">
                  <Briefcase className="h-3 w-3" /> Talent Market
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  Contrata Expertos para <br/><span className="text-cyan-300">Tu Próximo Hit</span>
              </h1>
              <p className="text-lg md:text-xl text-cyan-100 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                  Encuentra artistas freelance verificados, desarrolladores y diseñadores listos para llevar tu proyecto al siguiente nivel.
              </p>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-2xl">
                  <div className="relative flex-1">
                      <Search className="absolute left-4 top-3.5 h-5 w-5 text-cyan-200" />
                      <input 
                          type="text" 
                          placeholder="¿Qué servicio buscas? (ej. Rigging, VFX...)" 
                          className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-white placeholder-cyan-200/70 focus:outline-none focus:ring-0"
                      />
                  </div>
                  <button 
                      onClick={onCreateClick}
                      className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                      <Plus className="h-5 w-5" /> Ofrecer Servicio
                  </button>
              </div>
              
              {/* Popular Tags */}
              <div className="flex items-center gap-3 mt-6 text-xs text-cyan-200/80">
                  <span className="font-bold uppercase tracking-wide flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Popular:</span>
                  <div className="flex gap-2">
                      {['Rigging 3D', 'Unreal C++', 'Pixel Art', 'Concept'].map(tag => (
                          <span key={tag} className="hover:text-white cursor-pointer underline decoration-cyan-500/50 hover:decoration-cyan-500 transition-all">{tag}</span>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-cyan-500" />
            {activeCategory === 'Home' ? 'Servicios Destacados' : `Servicios de ${activeCategory}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {displayServices.length} gigs disponibles por freelancers verificados
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
