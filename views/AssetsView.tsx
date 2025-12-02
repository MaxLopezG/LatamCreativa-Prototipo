
import React from 'react';
import { Store, Filter, Box, Plus, Search, ShoppingBag, Tag } from 'lucide-react';
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
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1614726365723-49cfae96c69e?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Market Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/80 to-emerald-900/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-5xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-emerald-500/20 border border-emerald-400/30 backdrop-blur-md">
                  <Store className="h-3 w-3" /> Marketplace Oficial
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  Assets Premium para <br/><span className="text-emerald-400">Tus Proyectos</span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                  Modelos 3D, texturas, scripts y plugins listos para producción. Ahorra tiempo y eleva la calidad de tu trabajo.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                  <button 
                      onClick={onCreateClick}
                      className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
                  >
                      <Plus className="h-5 w-5" /> Vender Asset
                  </button>
                  <div className="relative flex-1 min-w-[260px] max-w-sm">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
                      <input 
                          type="text" 
                          placeholder="Buscar modelos, texturas..." 
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:bg-black/30 transition-all backdrop-blur-md"
                      />
                  </div>
              </div>
          </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="h-6 w-6 text-emerald-500" />
            {activeCategory === 'Home' ? 'Todos los Assets' : activeCategory}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {displayAssets.length} productos de alta calidad disponibles
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
              <option>Precio: Menor a Mayor</option>
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
