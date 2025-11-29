
import React from 'react';
import { Star, Download, Heart, Bookmark } from 'lucide-react';
import { AssetItem } from '../../types';

interface AssetCardProps {
  asset: AssetItem;
  onClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, onSave }) => {
  return (
    <div 
        onClick={onClick}
        className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/10 relative"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={asset.thumbnail} 
          alt={asset.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide rounded border border-white/10">
                {asset.formats[0]}
            </span>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onSave?.(asset.id, asset.thumbnail);
                }}
                className="p-2 bg-white text-black rounded-full hover:bg-slate-200 shadow-lg"
                title="Guardar"
            >
                <Bookmark className="h-4 w-4" />
            </button>
            <button className="p-2 bg-white text-black rounded-full hover:bg-slate-200 shadow-lg">
                <Heart className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                {asset.title}
            </h3>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">
            por <span className="text-slate-700 dark:text-slate-300 hover:underline">{asset.creator}</span>
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{asset.rating}</span>
                <span className="text-xs text-slate-400">({asset.reviewCount})</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">${asset.price}</span>
        </div>
      </div>
    </div>
  );
};
