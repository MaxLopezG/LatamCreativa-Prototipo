import React from 'react';
import { Lock, Bookmark } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { useAppStore } from '../../hooks/useAppStore';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick?: () => void;
  onSave?: (id: string, image: string, type: 'project' | 'article') => void;
  itemType?: 'project' | 'article';
  extraAction?: React.ReactNode; // New prop for additional actions
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick, onSave, itemType = 'project', extraAction }) => {
  const { state, actions } = useAppStore();


  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(item.id, item.image, itemType);
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col gap-3 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#1a1a1e] ring-1 ring-white/10 group-hover:ring-white/30 transition-all shadow-lg group-hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/10">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges & Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-20 pointer-events-none">
          <button
            type="button"
            onClick={handleSave}
            className="pointer-events-auto p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/10 hover:border-white"
            title="Guardar en colección"
          >
            <Bookmark className="h-4 w-4" />
          </button>

          {/* Render extra actions (like Delete) here */}
          {extraAction}
        </div>

        {item.isPrivate && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 z-20">
            <Lock className="h-3 w-3 text-slate-300" />
          </div>
        )}

        {/* Info Overlay (Inside Image) */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end z-10">
          <h3 className="font-bold text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <img
              src={item.artistAvatar}
              alt={item.artist}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="text-xs text-slate-300 font-medium truncate">{item.artist}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
