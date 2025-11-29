
import React, { useState } from 'react';
import { Building2, Search, MapPin, Briefcase, Filter, Plus } from 'lucide-react';
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
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-10 transition-colors animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
          <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                  <Building2 className="h-10 w-10 text-blue-500" /> Bolsa de Trabajo
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                  Encuentra tu próximo rol en los mejores estudios de Latinoamérica y el mundo.
              </p>
          </div>
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
              <Plus className="h-5 w-5" /> Publicar Empleo
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="space-y-8">
              <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cargo, palabra clave o empresa..." 
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                  />
              </div>

              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-6">
                  <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" /> Ubicación
                      </h3>
                      <div className="space-y-2">
                          {['Remoto', 'Híbrido', 'Presencial'].map(loc => (
                              <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500">
                                      <input type="checkbox" className="opacity-0 absolute" />
                                  </div>
                                  <span className="text-sm text-slate-600 dark:text-slate-300">{loc}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-slate-400" /> Nivel de Experiencia
                      </h3>
                      <div className="space-y-2">
                          {['Junior', 'Mid-Level', 'Senior', 'Lead', 'Director'].map(lvl => (
                              <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500">
                                      <input type="checkbox" className="opacity-0 absolute" />
                                  </div>
                                  <span className="text-sm text-slate-600 dark:text-slate-300">{lvl}</span>
                              </label>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-900 dark:text-white">{JOB_ITEMS.length} empleos encontrados</span>
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
