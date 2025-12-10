
import React from 'react';
import { Star, Download, Heart, Bookmark, ShoppingBag } from 'lucide-react';
import { AssetItem } from '../../types';

interface AssetCardProps {
  asset: AssetItem;
  onClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, onSave }) => {

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(asset.id, asset.thumbnail);
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#1a1a1e] ring-1 ring-white/10 group-hover:ring-emerald-500/50 transition-all shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/10 hover:-translate-y-1 duration-300">
        <img
          src={asset.thumbnail}
          alt={asset.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-[-10px] group-hover:translate-y-0">
          <button
            onClick={handleSave}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/10 hover:border-white"
            title="Guardar"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        {/* Price Tag (Always Visible) */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-white border border-white/10 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-transparent transition-all shadow-lg">
          ${asset.price}
        </div>

        {/* Quick Add Button (Bottom Slide Up) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/95 to-transparent flex justify-center">
          <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm">
            <ShoppingBag className="h-4 w-4" /> Añadir
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="font-bold text-white leading-tight mb-1 truncate group-hover:text-emerald-400 transition-colors">
          {asset.title}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden ring-1 ring-white/20">
              <img src={asset.creatorAvatar} alt={asset.creator} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors truncate max-w-[80px]">
              {asset.creator}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-xs">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-300">{asset.rating}</span>
            <span className="text-slate-500 text-[10px]">({asset.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
