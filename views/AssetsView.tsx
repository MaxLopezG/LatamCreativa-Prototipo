
import React from 'react';
import { Store, ArrowUpDown, Filter, Box, Plus } from 'lucide-react';
import { ASSET_ITEMS } from '../data/content';
import { AssetCard } from '../components/cards/AssetCard';
import { Pagination } from '../components/common/Pagination';

interface AssetsViewProps {
  activeCategory: string;
  onAssetSelect?: (id: string) => void;
  onCreateClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ activeCategory, onAssetSelect, onCreateClick, onSave }) => {
  const filteredAssets = activeCategory === 'Home' 
    ? ASSET_ITEMS 
    : ASSET_ITEMS.filter(a => a.category === activeCategory || activeCategory.includes(a.category));

  const displayAssets = filteredAssets.length > 0 ? filteredAssets : ASSET_ITEMS;

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 p-8 mb-10 overflow-hidden shadow-2xl shadow-emerald-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                    <Box className="h-4 w-4" /> Marketplace
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Recursos Premium</h2>
                <p className="text-emerald-100 text-lg">Modelos, texturas y herramientas listas para producción.</p>
             </div>
             <button 
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
             >
                <Plus className="h-5 w-5" /> Vender Asset
             </button>
         </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeCategory === 'Home' ? 'Todos los Assets' : activeCategory}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {displayAssets.length} productos disponibles
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
             <Filter className="h-4 w-4" /> Filtros
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

          <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">Ordenar por:</span>
          <select className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer">
              <option>Más populares</option>
              <option>Recientes</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-6 mb-16">
        {displayAssets.map((asset) => (
          <AssetCard 
             key={asset.id} 
             asset={asset} 
             onClick={() => onAssetSelect?.(asset.id)}
             onSave={onSave}
          />
        ))}
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};
