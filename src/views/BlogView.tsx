
import React from 'react';
import { ArrowUpDown, Plus, Newspaper, BookOpen } from 'lucide-react';
import { BlogCard } from '../components/cards/BlogCard';
import { Pagination } from '../components/common/Pagination';
import { useAppStore } from '../hooks/useAppStore';
import { CreatePostModal } from '../components/modals/CreatePostModal';

interface BlogViewProps {
  activeCategory: string;
  onArticleSelect?: (id: string) => void;
  onCreateClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ activeCategory, onArticleSelect, onSave }) => {
  const { state } = useAppStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const blogPosts = state.blogPosts;

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Blog Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/60 to-transparent"></div>

        <div className="relative z-10 px-8 md:px-16 w-full max-w-4xl py-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-blue-500/20 border border-blue-400/30 backdrop-blur-md">
            <Newspaper className="h-3 w-3" /> Blog & Noticias
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
            Historias que <br /><span className="text-blue-400">Inspiran Creación</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed drop-shadow-md">
            Tutoriales en profundidad, entrevistas a expertos y las últimas novedades de la industria creativa y tecnológica.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Escribir Artículo
            </button>
            <button className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Leer Destacados
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeCategory === 'Home' ? 'Últimos Artículos' : `Artículos de ${activeCategory}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Descubre {blogPosts.length} historias curadas para ti.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-slate-500 dark:text-slate-400 hidden sm:inline">Ordenar por:</span>
          <button className="flex items-center gap-1.5 text-base font-medium text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400">
            Más recientes <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 mb-16">
        {blogPosts.map((article) => (
          <BlogCard
            key={article.id}
            article={article}
            onClick={() => onArticleSelect?.(article.id)}
            onSave={onSave}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => { }} />
    </div>
  );
};
