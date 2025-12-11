
import React, { useState } from 'react';
import { Bookmark, Plus, Lock, Globe, MoreHorizontal, Image as ImageIcon, Search } from 'lucide-react';
import { USER_COLLECTIONS } from '../../data/content';
import { PortfolioCard } from '../../components/cards/PortfolioCard';

interface CollectionsViewProps {
  onCreateClick?: () => void;
  onCollectionSelect?: (id: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ onCreateClick, onCollectionSelect }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Collections Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-5xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg border border-slate-600 backdrop-blur-md">
                  <Bookmark className="h-3 w-3" /> Biblioteca Personal
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  Organiza tu <br/><span className="text-amber-400">Inspiración</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                  Guarda referencias, crea moodboards y organiza los mejores proyectos de la comunidad en colecciones temáticas.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                  <button 
                      onClick={onCreateClick}
                      className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
                  >
                      <Plus className="h-5 w-5" /> Nueva Colección
                  </button>
                  <div className="relative flex-1 min-w-[260px] max-w-sm">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
                      <input 
                          type="text" 
                          placeholder="Buscar en tus colecciones..." 
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:bg-black/30 transition-all backdrop-blur-md"
                      />
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {/* Create New Card */}
          <div 
            onClick={onCreateClick}
            className="aspect-[4/5] sm:aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group"
          >
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Plus className="h-8 w-8" />
              </div>
              <span className="font-bold">Crear nueva colección</span>
          </div>

          {USER_COLLECTIONS.map((col) => (
              <div 
                key={col.id} 
                className="group cursor-pointer"
                onClick={() => onCollectionSelect?.(col.id)}
              >
                  {/* Grid Preview */}
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden mb-4 grid grid-cols-2 gap-1 p-1 hover:ring-2 ring-amber-500/50 transition-all shadow-sm hover:shadow-lg relative">
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
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl pointer-events-none"></div>
                  </div>

                  {/* Info */}
                  <div className="flex justify-between items-start px-1">
                      <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-amber-500 transition-colors mb-1">{col.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-medium bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">{col.itemCount} items</span>
                              <div className="flex items-center gap-1 opacity-70">
                                  {col.isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                                  <span>{col.isPrivate ? 'Privado' : 'Público'}</span>
                              </div>
                          </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                      </button>
                  </div>
              </div>
          ))}
      </div>

    </div>
  );
};
