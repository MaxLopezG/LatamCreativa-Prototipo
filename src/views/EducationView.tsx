
import React, { useState } from 'react';
import { GraduationCap, Filter, Plus, PlayCircle, BookOpen, Star, Library, Compass } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'explore' | 'library'>('explore');

  // Filter by mode
  const mode = contentMode || 'creative';
  const modeFilteredCourses = EDUCATION_ITEMS.filter(c => (c.domain || 'creative') === mode);

  // Filter by category (Only applies to explore mode)
  const exploreCourses = activeCategory === 'Home' 
    ? modeFilteredCourses 
    : modeFilteredCourses.filter(c => c.category === activeCategory || activeCategory === 'Educación');

  // Mock Purchased Courses (Simulating user owns a few specific courses)
  // In a real app, this would come from user profile/purchases
  const purchasedCourses = EDUCATION_ITEMS.slice(0, 3); 

  const displayCourses = viewMode === 'explore' ? exploreCourses : purchasedCourses;

  const educationTopics = [
    "Blender", "Maya", "ZBrush", "Unreal Engine", "Unity", 
    "Substance Painter", "Houdini", "After Effects", "Photoshop"
  ];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-10 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Education Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-blue-900/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-6xl py-12 flex flex-col md:flex-row gap-12 items-center justify-between">
             <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-blue-500/20 border border-blue-400/30 backdrop-blur-md">
                    <GraduationCap className="h-3 w-3" /> Academia Latam
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                    Domina las Herramientas <br/><span className="text-blue-400">Del Futuro</span>
                </h1>
                <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                    Cursos creados por profesionales de la industria para {mode === 'dev' ? 'desarrolladores' : 'artistas digitales'}. Aprende a tu ritmo.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                    <button 
                        onClick={onCreateClick}
                        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> Crear Curso
                    </button>
                    <button 
                        onClick={() => setViewMode('library')}
                        className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md flex items-center gap-2"
                    >
                        <PlayCircle className="h-5 w-5" /> Empezar a Aprender
                    </button>
                </div>
             </div>

             {/* Featured Course Widget */}
             <div className="hidden lg:block bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl group/card">
                 <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                    <img src="https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=400&fit=crop" className="w-full h-full object-cover" alt="Course" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <PlayCircle className="h-10 w-10 text-white" />
                    </div>
                 </div>
                 <div className="text-white font-bold text-lg mb-1 leading-tight">Master en Blender 4.0</div>
                 <div className="flex items-center gap-2 text-blue-200 text-xs mb-3">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> 4.9</span>
                    <span>• 12h de contenido</span>
                 </div>
                 <button className="w-full py-2 bg-white text-blue-900 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                    Ver Curso
                 </button>
             </div>
          </div>
      </div>

      {/* Tabs & Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-1">
        <div className="flex items-center gap-8">
            <button 
                onClick={() => setViewMode('explore')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                    viewMode === 'explore' 
                    ? 'text-blue-500 border-blue-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                <Compass className="h-4 w-4" /> Explorar
            </button>
            <button 
                onClick={() => setViewMode('library')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                    viewMode === 'library' 
                    ? 'text-blue-500 border-blue-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                <Library className="h-4 w-4" /> Cursos Adquiridos
            </button>
        </div>

        {/* Filters - Only show in Explore mode */}
        {viewMode === 'explore' && (
            <div className="flex flex-wrap items-center gap-3 relative pb-4">
                <div className="relative">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                            isFilterOpen 
                            ? 'bg-blue-500 text-white border-blue-500' 
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
        )}
      </div>

      {/* Header Info for Tab */}
      <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {viewMode === 'explore' 
                ? (activeCategory === 'Home' ? 'Todos los Cursos' : `Cursos de ${activeCategory}`) 
                : 'Mis Cursos'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {viewMode === 'explore' 
                ? `${displayCourses.length} cursos disponibles` 
                : `${displayCourses.length} cursos listos para ver`
            }
          </p>
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
            <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400">
                {viewMode === 'library' ? (
                    <div className="flex flex-col items-center">
                        <Library className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg">Aún no has adquirido ningún curso.</p>
                        <button onClick={() => setViewMode('explore')} className="mt-4 text-blue-500 hover:underline">
                            Explorar catálogo
                        </button>
                    </div>
                ) : (
                    <p>No hay cursos disponibles para este filtro.</p>
                )}
            </div>
        )}
      </div>

      {displayCourses.length > 0 && <Pagination currentPage={1} onPageChange={() => {}} />}
    </div>
  );
};
