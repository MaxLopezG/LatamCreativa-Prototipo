
import React, { useState } from 'react';
import { GraduationCap, Filter, Plus } from 'lucide-react';
import { EDUCATION_ITEMS } from '../data/content';
import { EducationCard } from '../components/cards/EducationCard';
import { Pagination } from '../components/common/Pagination';
import { FilterPanel } from '../components/common/FilterPanel';
import { ContentMode } from '../hooks/useAppStore';

interface EducationViewProps {
  activeCategory: string;
  onCourseSelect?: (id: string) => void;
  onCreateClick?: () => void;
  contentMode: ContentMode;
}

export const EducationView: React.FC<EducationViewProps> = ({ activeCategory, onCourseSelect, onCreateClick, contentMode }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter by mode
  const mode = contentMode || 'creative';
  const modeFilteredCourses = EDUCATION_ITEMS.filter(c => (c.domain || 'creative') === mode);

  // Filter by category
  const displayCourses = activeCategory === 'Home' 
    ? modeFilteredCourses 
    : modeFilteredCourses.filter(c => c.category === activeCategory || activeCategory === 'Educación');

  const educationTopics = [
    "Blender", "Maya", "ZBrush", "Unreal Engine", "Unity", 
    "Substance Painter", "Houdini", "After Effects", "Photoshop"
  ];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-8 mb-10 overflow-hidden shadow-2xl shadow-blue-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                    <GraduationCap className="h-4 w-4" /> Academia
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Aprende sin límites</h2>
                <p className="text-blue-100 text-lg">Cursos creados por profesionales de la industria para {mode === 'dev' ? 'desarrolladores' : 'artistas digitales'}.</p>
             </div>
             <button 
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
             >
                <Plus className="h-5 w-5" /> Crear Curso
             </button>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeCategory === 'Home' ? 'Todos los Cursos' : `Cursos de ${activeCategory}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {displayCourses.length} resultados encontrados
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
                topics={educationTopics}
            />
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <select className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer">
              <option>Más vendidos</option>
              <option>Mejor valorados</option>
              <option>Nuevos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 mb-16">
        {displayCourses.map((course) => (
          <EducationCard 
             key={course.id} 
             course={course} 
             onClick={() => onCourseSelect?.(course.id)}
          />
        ))}
        {displayCourses.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">
                No hay cursos disponibles para este modo.
            </div>
        )}
      </div>

      {displayCourses.length > 0 && <Pagination currentPage={1} onPageChange={() => {}} />}
    </div>
  );
};
