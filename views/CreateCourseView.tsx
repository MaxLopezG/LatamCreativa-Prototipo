
import React from 'react';
import { ArrowLeft, GraduationCap, Video, DollarSign, Plus } from 'lucide-react';

interface CreateCourseViewProps {
  onBack: () => void;
}

export const CreateCourseView: React.FC<CreateCourseViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Crear Nuevo Curso</h1>
        <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">Guardar</button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <GraduationCap className="h-5 w-5 text-blue-500" /> Información Básica
              </h2>
              <input type="text" placeholder="Título del Curso" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              <textarea rows={4} placeholder="Lo que aprenderán los estudiantes..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 outline-none resize-none"></textarea>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Video className="h-5 w-5 text-blue-500" /> Contenido
              </h2>
              <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4 text-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-dashed">
                 <Plus className="h-8 w-8 mx-auto mb-2" />
                 <span>Agregar Sección o Clase</span>
              </div>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <DollarSign className="h-5 w-5 text-blue-500" /> Precio
              </h2>
              <div className="flex gap-4">
                  <input type="number" placeholder="Precio ($)" className="w-1/3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
          </div>
      </div>
    </div>
  );
};
