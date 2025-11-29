
import React, { useState } from 'react';
import { ArrowLeft, FileText, Image as ImageIcon, Plus } from 'lucide-react';

interface CreateArticleViewProps {
  onBack: () => void;
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Escribir Artículo</h1>
        <button className="text-sm font-bold text-blue-500 hover:text-blue-400">Publicar</button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
          {/* Cover Image */}
          <div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
             <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
             <span className="text-slate-500 font-medium">Añadir portada</span>
          </div>

          {/* Title */}
          <input 
            type="text" 
            placeholder="Título del Artículo..." 
            className="w-full text-4xl font-bold bg-transparent border-none placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-0 px-0"
          />

          {/* Editor Placeholder */}
          <div className="min-h-[400px]">
             <textarea 
               placeholder="Escribe tu historia aquí..."
               className="w-full h-full min-h-[400px] bg-transparent border-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none px-0"
             ></textarea>
          </div>
      </div>
    </div>
  );
};
