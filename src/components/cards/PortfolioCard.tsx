
import React from 'react';
import { Eye, Heart, Lock } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick?: () => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="group relative break-inside-avoid cursor-pointer h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 bg-slate-900"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${item.isExclusive ? 'blur-[2px] group-hover:blur-0' : ''}`} 
        />

        {/* Lock Overlay for Exclusive Content */}
        {item.isExclusive && (
            <div className="absolute top-3 right-3 z-20">
                <div className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <Lock className="h-4 w-4 text-amber-400" />
                </div>
            </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                {item.category}
             </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
            
            {/* Content Container */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                
                <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-2 drop-shadow-md">
                    {item.title}
                </h3>

                <div className="flex items-center justify-between items-end">
                    {/* Artist Info */}
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full ring-1 ring-white/50 overflow-hidden">
                            <img src={item.artistAvatar} alt={item.artist} className="h-full w-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-white/90 truncate max-w-[100px]">{item.artist}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs font-semibold text-white/80">
                        <div className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {item.likes}
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> {item.views}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
