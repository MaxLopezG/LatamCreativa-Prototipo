
import React from 'react';
import { ArrowLeft, MoreHorizontal, Lock, Globe, Filter, Trash2 } from 'lucide-react';
import { USER_COLLECTIONS, PORTFOLIO_ITEMS, ASSET_ITEMS } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { AssetCard } from '../components/cards/AssetCard';

interface CollectionDetailViewProps {
  collectionId: string;
  onBack: () => void;
  onItemSelect: (id: string, type: string) => void;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({ collectionId, onBack, onItemSelect }) => {
  const collection = USER_COLLECTIONS.find(c => c.id === collectionId) || USER_COLLECTIONS[0];

  // Simulate saved items by taking a mix of portfolio and assets
  // In a real app, this would be fetched based on relationships
  const savedPortfolio = PORTFOLIO_ITEMS.slice(0, 4);
  const savedAssets = ASSET_ITEMS.slice(0, 2);

  return (
    <div className="max-w-[2560px] mx-auto animate-fade-in pb-20">
      
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Colecciones
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 md:px-10 py-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                  <div className="flex items-center gap-3 mb-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                          {collection.isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                          {collection.isPrivate ? 'Privada' : 'Pública'}
                      </span>
                      <span>•</span>
                      <span>Actualizada hace 2 días</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{collection.title}</h1>
                  <p className="text-slate-500 max-w-2xl text-lg">
                      Una colección curada de referencias e inspiración para proyectos futuros.
                  </p>
              </div>
              <div className="flex gap-3">
                  <button className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      Editar
                  </button>
                  <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                      Compartir
                  </button>
              </div>
          </div>

          <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex gap-6">
                  <button className="text-amber-500 border-b-2 border-amber-500 pb-4 -mb-4 font-bold text-sm">Todos ({savedPortfolio.length + savedAssets.length})</button>
                  <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white pb-4 -mb-4 font-medium text-sm transition-colors">Imágenes</button>
                  <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white pb-4 -mb-4 font-medium text-sm transition-colors">Assets</button>
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Filter className="h-4 w-4" /> Filtros
              </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {savedPortfolio.map(item => (
                  <div key={`p-${item.id}`} className="relative group">
                      <PortfolioCard 
                          item={item} 
                          onClick={() => onItemSelect(item.id, 'portfolio')} 
                      />
                      <button className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500" title="Eliminar de colección">
                          <Trash2 className="h-4 w-4" />
                      </button>
                  </div>
              ))}
              {savedAssets.map(item => (
                  <div key={`a-${item.id}`} className="relative group">
                      <AssetCard 
                          asset={item} 
                          onClick={() => onItemSelect(item.id, 'asset')} 
                      />
                      <button className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500" title="Eliminar de colección">
                          <Trash2 className="h-4 w-4" />
                      </button>
                  </div>
              ))}
          </div>

      </div>
    </div>
  );
};
