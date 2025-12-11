
import React from 'react';
import { ArrowLeft, Box, UploadCloud, DollarSign } from 'lucide-react';

interface CreateAssetViewProps {
  onBack: () => void;
}

export const CreateAssetView: React.FC<CreateAssetViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Vender Asset</h1>
        <button className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-700">Publicar</button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Box className="h-5 w-5 text-emerald-500" /> Información del Producto
              </h2>
              <input type="text" placeholder="Nombre del Asset" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 outline-none" />
              <textarea rows={4} placeholder="Descripción técnica y características..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 outline-none resize-none"></textarea>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <UploadCloud className="h-5 w-5 text-emerald-500" /> Archivos
              </h2>
              <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <p className="font-bold text-slate-900 dark:text-white">Sube tu archivo .ZIP o .RAR</p>
                  <p className="text-sm text-slate-500">Máximo 2GB</p>
              </div>
          </div>

           <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <DollarSign className="h-5 w-5 text-emerald-500" /> Precio y Licencia
              </h2>
              <div className="flex gap-4">
                  <input type="number" placeholder="Precio ($)" className="w-1/3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 outline-none" />
                  <select className="w-1/3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 outline-none">
                      <option>Standard (Personal)</option>
                      <option>Editorial</option>
                  </select>
              </div>
          </div>
      </div>
    </div>
  );
};
