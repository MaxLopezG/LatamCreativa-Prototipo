
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
      {/* Backdrop to close on click outside */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose}></div>
      
      <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-5 animate-fade-in origin-top-right">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
          <h3 className="font-bold text-slate-900 dark:text-white">Filtrar por</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          
          {/* Country Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <MapPin className="h-3 w-3" /> País
            </label>
            <select className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500">
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
                <label key={lang} className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors">
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
            <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1 pr-1">
              {topics.map(topic => (
                <label key={topic} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                  <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 bg-transparent" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{topic}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            Limpiar
          </button>
          <button onClick={onClose} className="flex-1 py-2 bg-amber-500 text-white font-bold rounded-lg text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
};
