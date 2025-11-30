
import React from 'react';
import { Bookmark, Plus, Lock, Globe, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { USER_COLLECTIONS } from '../data/content';
import { Link } from 'react-router-dom';
import { CollectionItem } from '../types';

interface CollectionsViewProps {
  collections?: CollectionItem[];
  onCreateClick?: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ collections = USER_COLLECTIONS, onCreateClick }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 mb-10 overflow-hidden border border-slate-700">
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-600">
                    <Bookmark className="h-4 w-4" /> Inspiración
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Tus Colecciones</h2>
                <p className="text-slate-400 text-lg">Organiza tus referencias, moodboards y proyectos favoritos.</p>
             </div>
             <button 
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
             >
                <Plus className="h-5 w-5" /> Nueva Colección
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {collections.map((col) => (
              <Link 
                key={col.id} 
                to={`/collections/${col.id}`}
                className="group cursor-pointer block"
              >
                  {/* Grid Preview */}
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden mb-4 grid grid-cols-2 gap-1 p-1 hover:ring-2 ring-amber-500/50 transition-all shadow-sm hover:shadow-lg">
                      {col.thumbnails.slice(0, 4).map((thumb, i) => (
                          <div key={i} className="relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-lg">
                              <img 
                                src={thumb} 
                                alt="" 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                              />
                          </div>
                      ))}
                      {/* Fill empty spots if less than 4 */}
                      {Array.from({ length: Math.max(0, 4 - col.thumbnails.length) }).map((_, i) => (
                          <div key={`empty-${i}`} className="bg-slate-200 dark:bg-white/5 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                          </div>
                      ))}
                  </div>

                  {/* Info */}
                  <div className="flex justify-between items-start">
                      <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-amber-500 transition-colors mb-1">{col.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span>{col.itemCount} items</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                  {col.isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                                  <span>{col.isPrivate ? 'Privado' : 'Público'}</span>
                              </div>
                          </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                      </button>
                  </div>
              </Link>
          ))}
          
          {/* Create New Card */}
          <div 
            onClick={onCreateClick}
            className="aspect-[4/5] sm:aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group"
          >
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8" />
              </div>
              <span className="font-bold">Crear nueva colección</span>
          </div>
      </div>

    </div>
  );
};
