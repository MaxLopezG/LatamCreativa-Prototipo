
import React from 'react';
import { ArrowLeft, Lock, Globe, Share2, MoreHorizontal, Filter, Plus } from 'lucide-react';
import { USER_COLLECTIONS, PORTFOLIO_ITEMS } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';

interface CollectionDetailViewProps {
  collectionId: string;
  onBack: () => void;
  onItemSelect: (id: string) => void;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({ collectionId, onBack, onItemSelect }) => {
  const collection = USER_COLLECTIONS.find(c => c.id === collectionId) || USER_COLLECTIONS[0];
  
  // Simulation: We take a slice of portfolio items to represent the "saved" items in this collection
  // In a real app, the collection would store the IDs of the saved items.
  const collectionItems = PORTFOLIO_ITEMS.slice(0, collection.itemCount > 0 ? collection.itemCount : 4);

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-6 mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Colecciones
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">{collection.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        {collection.isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                        {collection.isPrivate ? 'Privada' : 'Pública'}
                    </span>
                    <span>•</span>
                    <span>{collectionItems.length} elementos guardados</span>
                    <span>•</span>
                    <span>Actualizada hace 2 días</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" /> Añadir
                </button>
            </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-8"></div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                 <Filter className="h-4 w-4" /> Filtrar
             </button>
             <input 
                type="text" 
                placeholder="Buscar en esta colección..." 
                className="bg-transparent border-b border-slate-200 dark:border-white/10 px-2 py-1.5 text-sm outline-none focus:border-amber-500 w-48"
             />
          </div>
          <select className="bg-transparent text-slate-500 text-sm font-medium outline-none cursor-pointer hover:text-slate-900 dark:hover:text-white">
              <option>Añadido recientemente</option>
              <option>Más antiguos</option>
          </select>
      </div>

      {/* Grid */}
      {collectionItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {collectionItems.map((item) => (
                <PortfolioCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => onItemSelect(item.id)}
                />
            ))}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Esta colección está vacía</p>
              <p className="text-sm">Explora el feed para guardar contenido aquí.</p>
          </div>
      )}

    </div>
  );
};
