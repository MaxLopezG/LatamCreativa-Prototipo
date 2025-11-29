
import React, { useState } from 'react';
import { ArrowLeft, MessageCircleQuestion, Tag } from 'lucide-react';

interface CreateForumPostViewProps {
  onBack: () => void;
}

export const CreateForumPostView: React.FC<CreateForumPostViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Hacer una Pregunta</h1>
        <button className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg text-sm hover:bg-orange-600">Publicar</button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
          
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <MessageCircleQuestion className="h-5 w-5 text-orange-500" /> Tu Duda
              </h2>
              <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Título</label>
                  <p className="text-xs text-slate-500 mb-2">Sé específico e imagina que le estás preguntando a otra persona.</p>
                  <input type="text" placeholder="Ej: ¿Cómo arreglo los artefactos de bakeado en normales?" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 outline-none" />
              </div>
              
              <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cuerpo</label>
                  <p className="text-xs text-slate-500 mb-2">Incluye toda la información necesaria para que alguien pueda responderte.</p>
                  <textarea rows={8} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 outline-none resize-none"></textarea>
              </div>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Tag className="h-5 w-5 text-orange-500" /> Detalles
              </h2>
              <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Categoría</label>
                  <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 outline-none">
                      <option>Modelado 3D</option>
                      <option>Texturizado</option>
                      <option>Animación</option>
                      <option>Game Dev</option>
                      <option>Hardware</option>
                      <option>Carrera</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Etiquetas</label>
                  <input type="text" placeholder="Ej: blender, error, render (separados por coma)" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 outline-none" />
              </div>
          </div>

      </div>
    </div>
  );
};