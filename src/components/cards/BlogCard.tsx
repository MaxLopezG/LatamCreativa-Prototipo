
import React from 'react';
import { Calendar, Clock, MessageSquare, Heart, Lock, Bookmark } from 'lucide-react';
import { ArticleItem } from '../../types';
import { useAuthorInfo } from '../../hooks/useAuthorInfo';

interface BlogCardProps {
  article: ArticleItem;
  onClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ article, onClick, onSave }) => {
  // Live author lookup - fetches current name/avatar from user profile
  const { authorName, authorAvatar } = useAuthorInfo(
    article.authorId,
    article.author,
    article.authorAvatar
  );

  return (
    <article
      onClick={onClick}
      className="group flex flex-col h-full bg-[#1a1a1e] rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-rose-500/50 transition-all hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 cursor-pointer relative"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1e] to-transparent opacity-80"></div>

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); onSave?.(article.id, article.image); }}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/10 scale-90"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute top-3 left-3 bg-rose-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
          {article.category}
        </div>

        {/* Status Badges */}
        {article.status === 'draft' && (
          <div className="absolute bottom-3 left-3 bg-amber-500 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
            Borrador
          </div>
        )}
        {article.status === 'scheduled' && (
          <div className="absolute bottom-3 left-3 bg-blue-500 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
            Programado
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 -mt-6 relative z-10">
        <div className="flex items-center gap-2 mb-3 text-xs font-medium text-slate-400">
          <img src={authorAvatar} alt={authorName} loading="lazy" className="w-5 h-5 rounded-full ring-1 ring-white/20" />
          <span className="text-slate-300">{authorName}</span>
        </div>

        <h3 className="font-bold text-lg text-white mb-2 leading-tight group-hover:text-rose-400 transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
            {new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1 group-hover:text-rose-400 transition-colors">
              <Heart className="h-3.5 w-3.5" /> {article.likes}
            </div>
            <div className="flex items-center gap-1 group-hover:text-rose-400 transition-colors">
              <MessageSquare className="h-3.5 w-3.5" /> {article.comments}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
