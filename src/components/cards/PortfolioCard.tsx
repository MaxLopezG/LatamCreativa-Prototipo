
import React from 'react';
import { Eye, Heart, Lock, Bookmark } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { useAppStore } from '../../hooks/useAppStore';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick, onSave }) => {
  const { state, actions } = useAppStore();
  const isLiked = state.likedItems.includes(item.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.toggleLike(item.id);
  };

  // Helper to display likes count
  const getDisplayLikes = () => {
    if (item.likes.includes('k')) return item.likes;
    const baseLikes = parseInt(item.likes, 10) || 0;
    return isLiked ? baseLikes + 1 : baseLikes;
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(item.id, item.image);
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col gap-3 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#1a1a1e] ring-1 ring-white/10 group-hover:ring-white/30 transition-all shadow-lg group-hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/10">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay (Always subtle, darker on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <button
            onClick={handleSave}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/10 hover:border-white"
            title="Guardar en colección"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        {item.isPrivate && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
            <Lock className="h-3 w-3 text-slate-300" />
          </div>
        )}

        {/* Bottom Stats (Only on Hover) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all ${isLiked ? 'text-amber-500' : 'text-white'}`}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-amber-500' : ''}`} />
              <span className="text-xs font-bold">{getDisplayLikes()}</span>
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <Eye className="h-3 w-3" /> {item.views}
          </div>
        </div>
      </div>

      {/* Title and Artist Info */}
      <div className="flex items-start justify-between gap-4 px-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
            <img
              src={item.artistAvatar}
              alt={item.artist}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-sm text-slate-200 truncate group-hover:text-amber-400 transition-colors leading-tight">
              {item.title}
            </h3>
            <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate">
              {item.artist}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
