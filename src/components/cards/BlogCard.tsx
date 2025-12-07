
import React from 'react';
import { Calendar, Clock, MessageSquare, Heart, Lock, Bookmark } from 'lucide-react';
import { ArticleItem } from '../../types';

interface BlogCardProps {
  article: ArticleItem;
  onClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ article, onClick, onSave }) => {
  return (
    <article 
      onClick={onClick}
      className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer relative"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${article.isExclusive ? 'blur-[2px]' : ''}`} 
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
            {article.category}
          </span>
        </div>

        {/* Save Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onSave?.(article.id, article.image);
                }}
                className="h-8 w-8 rounded-full bg-black/60 hover:bg-amber-500 backdrop-blur-md flex items-center justify-center text-white transition-colors shadow-lg border border-white/20"
                title="Guardar"
             >
                <Bookmark className="h-4 w-4" />
             </button>
        </div>

        {/* Lock Overlay */}
        {article.isExclusive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Lock className="h-5 w-5 text-white" />
                </div>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{article.date}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{article.readTime}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
          <div className="flex items-center gap-2">
            <img src={article.authorAvatar} alt={article.author} className="h-6 w-6 rounded-full object-cover" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{article.author}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
              <Heart className="h-3.5 w-3.5" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{article.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
