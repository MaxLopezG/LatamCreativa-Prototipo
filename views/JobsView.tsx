
import React, { useState } from 'react';
import { Building2, Search, MapPin, Briefcase, Filter, Plus, Globe } from 'lucide-react';
import { JOB_ITEMS } from '../data/content';
import { JobCard } from '../components/cards/JobCard';
import { Pagination } from '../components/common/Pagination';
import { FilterPanel } from '../components/common/FilterPanel';

interface JobsViewProps {
    onCreateClick?: () => void;
    onJobSelect?: (id: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ onCreateClick, onJobSelect }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const jobTopics = ["Full-time", "Contract", "Remote", "Junior", "Senior", "Lead", "Art Director"];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Jobs Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-5xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg border border-slate-600 backdrop-blur-md">
                  <Building2 className="h-3 w-3" /> Bolsa de Trabajo
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  Construye tu Carrera <br/><span className="text-blue-300">En la Industria</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                  Conectamos a los mejores estudios de Latinoamérica y el mundo con talento como tú. Remoto, híbrido o presencial.
              </p>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-3xl">
                  <div className="relative flex-1">
                      <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                      <input 
                          type="text" 
                          placeholder="Cargo, palabra clave o empresa..." 
                          className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-white placeholder-slate-300 focus:outline-none focus:ring-0"
                      />
                  </div>
                  <div className="h-px md:h-auto md:w-px bg-white/20 my-2 md:my-0"></div>
                  <div className="relative flex-1 md:max-w-xs">
                      <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                      <input 
                          type="text" 
                          placeholder="Ubicación (ej: Remoto)" 
                          className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-white placeholder-slate-300 focus:outline-none focus:ring-0"
                      />
                  </div>
                  <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                      Buscar
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="space-y-8">
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-6 sticky top-24">
                  <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Filter className="h-4 w-4" /> Filtros
                      </h3>
                      <button className="text-xs text-blue-500 font-bold hover:underline">Limpiar</button>
                  </div>

                  <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Modalidad</h4>
                      <div className="space-y-2">
                          {['Remoto', 'Híbrido', 'Presencial'].map(loc => (
                              <label key={loc} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors -mx-2">
                                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500 bg-white dark:bg-white/5">
                                      <input type="checkbox" className="opacity-0 absolute" />
                                  </div>
                                  <span className="text-sm text-slate-600 dark:text-slate-300">{loc}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-white/5"></div>

                  <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Experiencia</h4>
                      <div className="space-y-2">
                          {['Junior (0-2 años)', 'Mid-Level (2-5 años)', 'Senior (+5 años)', 'Lead / Director'].map(lvl => (
                              <label key={lvl} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors -mx-2">
                                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500 bg-white dark:bg-white/5">
                                      <input type="checkbox" className="opacity-0 absolute" />
                                  </div>
                                  <span className="text-sm text-slate-600 dark:text-slate-300">{lvl}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-white/5"></div>

                  <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tipo de Contrato</h4>
                      <div className="flex flex-wrap gap-2">
                          {['Full-time', 'Freelance', 'Part-time', 'Pasantía'].map(type => (
                              <span key={type} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                  {type}
                              </span>
                          ))}
                      </div>
                  </div>
                  
                  <button 
                    onClick={onCreateClick}
                    className="w-full py-3 bg-white border border-slate-200 dark:border-white/10 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                      <Plus className="h-4 w-4" /> Publicar Empleo
                  </button>
              </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{JOB_ITEMS.length} empleos encontrados</span>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                      Ordenar por: 
                      <select className="bg-transparent font-bold text-slate-900 dark:text-white outline-none cursor-pointer">
                          <option>Más recientes</option>
                          <option>Relevancia</option>
                      </select>
                  </div>
              </div>

              {JOB_ITEMS.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={() => onJobSelect?.(job.id)}
                  />
              ))}

              <div className="pt-8">
                  <Pagination currentPage={1} onPageChange={() => {}} />
              </div>
          </div>

      </div>
    </div>
  );
};
