
import React from 'react';
import { MessageSquare, ArrowUpDown, Plus } from 'lucide-react';
import { BLOG_ITEMS } from '../data/content';
import { BlogCard } from '../components/cards/BlogCard';
import { Pagination } from '../components/common/Pagination';

interface BlogViewProps {
  activeCategory: string;
  onArticleSelect?: (id: string) => void;
  onCreateClick?: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ activeCategory, onArticleSelect, onCreateClick }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-amber-500" />
            Blog & Noticias
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Artículos destacados sobre {activeCategory === 'Home' ? 'toda la industria' : activeCategory}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={onCreateClick}
             className="flex items-center gap-2 px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
             <Plus className="h-4 w-4" /> Escribir Artículo
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden md:block"></div>

          <span className="text-base text-slate-500 dark:text-slate-400 hidden sm:inline">Ordenar por:</span>
          <button className="flex items-center gap-1.5 text-base font-medium text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400">
            Más recientes <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 mb-16">
        {BLOG_ITEMS.map((article) => (
          <BlogCard 
            key={article.id} 
            article={article} 
            onClick={() => onArticleSelect?.(article.id)}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};
