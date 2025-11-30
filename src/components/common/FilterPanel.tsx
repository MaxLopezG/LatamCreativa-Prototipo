
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
      {/* Backdrop: Dark overlay on mobile (modal style), transparent on desktop (dropdown style) */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:bg-transparent transition-colors" 
        onClick={onClose}
      ></div>
      
      {/* Panel Container: Bottom Sheet on Mobile, Dropdown on Desktop */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-3xl border-t border-slate-200 dark:border-white/10 
        bg-white dark:bg-[#1A1A1C] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] 
        p-6 animate-slide-up
        
        md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:mt-2 md:w-80 
        md:rounded-2xl md:border md:shadow-2xl md:origin-top-right
      `}>
        
        {/* Mobile Drag Handle */}
        <div className="md:hidden w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-base">Filtrar por</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 md:space-y-5 max-h-[60vh] md:max-h-none overflow-y-auto custom-scrollbar pb-20 md:pb-0">
          
          {/* Country Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <MapPin className="h-3 w-3" /> País
            </label>
            <select className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-lg px-4 md:px-3 py-3 md:py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500">
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
                <label key={lang} className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-white/5 px-4 md:px-3 py-2 md:py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                  <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 bg-transparent h-4 w-4" />
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
            <div className="max-h-48 md:max-h-32 overflow-y-auto custom-scrollbar space-y-1 pr-1">
              {topics.map(topic => (
                <label key={topic} className="flex items-center gap-3 md:gap-2 p-2 md:p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                  <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 bg-transparent h-4 w-4" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{topic}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3 sticky bottom-0 bg-white dark:bg-[#1A1A1C] pb-safe md:static">
          <button onClick={onClose} className="flex-1 py-3 md:py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 rounded-xl md:bg-transparent">
            Limpiar
          </button>
          <button onClick={onClose} className="flex-1 py-3 md:py-2 bg-amber-500 text-white font-bold rounded-xl md:rounded-lg text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
};
