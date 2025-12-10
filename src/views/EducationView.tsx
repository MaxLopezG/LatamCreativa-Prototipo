
import React, { useState } from 'react';
import { GraduationCap, Filter, Plus, PlayCircle, BookOpen, Star, Library, Compass, ArrowUpDown } from 'lucide-react';
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

    // Mock Purchased Courses
    const purchasedCourses = EDUCATION_ITEMS.slice(0, 3);

    const displayCourses = viewMode === 'explore' ? exploreCourses : purchasedCourses;

    const educationTopics = [
        "Blender", "Maya", "ZBrush", "Unreal Engine", "Unity",
        "Substance Painter", "Houdini", "After Effects", "Photoshop"
    ];

    return (
        <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#0f0f12] min-h-screen">

            {/* Cinematic Hero Banner - Full Width */}
            <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 h-[500px] flex items-center justify-center overflow-hidden mb-12">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
                        alt="Education Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0f0f12]/80 to-[#0f0f12]"></div>

                    {/* Vibrant Glows - Blue/Indigo Theme */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                </div>

                <div className="relative z-10 px-6 w-full max-w-6xl py-12 flex flex-col md:flex-row gap-12 items-center justify-between">
                    <div className="max-w-2xl text-center md:text-left">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
                            <GraduationCap className="h-3 w-3" /> Academia Latam
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Domina el <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Futuro Creativo</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 max-w-xl leading-relaxed font-light">
                            Cursos creados por profesionales de la industria para {mode === 'dev' ? 'desarrolladores' : 'artistas digitales'}. Aprende a tu ritmo.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => setViewMode('library')}
                                className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2 hover:-translate-y-0.5"
                            >
                                <PlayCircle className="h-5 w-5" /> Empezar a Aprender
                            </button>
                            <button
                                onClick={onCreateClick}
                                className="px-8 py-3.5 bg-white/10 text-white border border-white/10 font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2"
                            >
                                <Plus className="h-5 w-5" /> Crear Curso
                            </button>
                        </div>
                    </div>

                    {/* Featured Course Widget (Desktop Only) */}
                    <div className="hidden lg:block bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl group/card cursor-pointer">
                        <div className="aspect-video rounded-xl overflow-hidden mb-4 relative bg-black">
                            <img src="https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=400&fit=crop" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt="Course" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <PlayCircle className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="text-white font-bold text-lg mb-1 leading-tight group-hover/card:text-blue-400 transition-colors">Master en Blender 4.0</div>
                        <div className="flex items-center gap-3 text-slate-400 text-xs mb-3">
                            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.9</span>
                            <span>• 12h de contenido</span>
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
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Compass className="h-4 w-4" /> Explorar
                    </button>
                    <button
                        onClick={() => setViewMode('library')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'library'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Library className="h-4 w-4" /> Mis Cursos
                    </button>
                </div>

                {/* Filters - Only show in Explore mode */}
                {viewMode === 'explore' && (
                    <div className="flex flex-wrap items-center gap-3 relative">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors font-medium text-sm backdrop-blur-sm ${isFilterOpen
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
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

                        <div className="h-8 w-px bg-white/10 hidden md:block mx-1"></div>

                        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
                            <span className="text-slate-500 text-xs uppercase font-bold mr-1">Ordenar:</span>Relevancia <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                        </button>
                    </div>
                )}
            </div>

            {/* Header Info */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {viewMode === 'explore' ? <BookOpen className="h-6 w-6 text-blue-500" /> : <Library className="h-6 w-6 text-blue-500" />}
                    {viewMode === 'explore'
                        ? (activeCategory === 'Home' ? 'Todos los Cursos' : `Cursos de ${activeCategory}`)
                        : 'Mis Cursos'}
                </h2>
                <p className="text-slate-400 mt-1 text-sm">
                    {viewMode === 'explore'
                        ? `${displayCourses.length} cursos disponibles para impulsar tu carrera`
                        : `${displayCourses.length} cursos en tu biblioteca`
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-16">
                {displayCourses.map((course) => (
                    <EducationCard
                        key={course.id}
                        course={course}
                        onClick={() => onCourseSelect?.(course.id)}
                    />
                ))}
                {displayCourses.length === 0 && (
                    <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="flex flex-col items-center">
                            <Library className="h-16 w-16 mb-4 text-blue-900/50" />
                            <p className="text-lg text-slate-400 mb-2">
                                {viewMode === 'library' ? 'Aún no has adquirido ningún curso.' : 'No hay cursos disponibles.'}
                            </p>
                            {viewMode === 'library' && (
                                <button onClick={() => setViewMode('explore')} className="mt-2 text-blue-400 hover:text-blue-300 font-bold hover:underline">
                                    Explorar catálogo
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {displayCourses.length > 0 && <Pagination currentPage={1} onPageChange={() => { }} />}
        </div>
    );
};
