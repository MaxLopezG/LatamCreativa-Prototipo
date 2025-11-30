import React from 'react';
import { X, Globe, MapPin, Tag } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  topics: string[];
}

const COUNTRIES = [
  "Todos", "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", 
  "Costa Rica", "Ecuador", "El Salvador", "España", "Guatemala", 
  "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", 
  "Perú", "Rep. Dominicana", "Uruguay", "Venezuela"
];

const LANGUAGES = ["Español", "Inglés", "Portugués"];

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, topics }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Panel Container */}
      <div className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1A1A1C] 
          rounded-t-3xl shadow-2xl p-6 animate-slide-up
          md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto 
          md:w-80 md:rounded-2xl md:border md:border-slate-200 md:dark:border-white/10 md:origin-top-right
      `}>
        
        {/* Mobile Handle */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-6 md:hidden"></div>

        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Filtrar por</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 -mr-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar md:max-h-[400px]">
          
          {/* Country Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <MapPin className="h-3 w-3" /> País
            </label>
            <select className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 appearance-none">
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Globe className="h-3 w-3" /> Idioma
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                  <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 bg-transparent" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Topics Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Tag className="h-3 w-3" /> Temas
            </label>
            <div className="space-y-1 pr-1">
              {topics.map(topic => (
                <label key={topic} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 dark:border-white/20 checked:bg-amber-500 checked:border-amber-500 transition-all" />
                    <svg className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{topic}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            Limpiar
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
};