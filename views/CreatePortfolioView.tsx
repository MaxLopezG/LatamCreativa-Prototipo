
import React from 'react';
import { UploadCloud, X } from 'lucide-react';
import { CreatePageLayout } from '../components/layout/CreatePageLayout';

interface CreatePortfolioViewProps {
  onBack: () => void;
}

export const CreatePortfolioView: React.FC<CreatePortfolioViewProps> = ({ onBack }) => {
  return (
    <CreatePageLayout 
      title="Subir Proyecto" 
      onBack={onBack}
      actionColorClass="bg-amber-500 hover:bg-amber-600 text-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
             {/* Upload Area */}
             <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                 <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
                 <p className="text-lg font-bold text-slate-900 dark:text-white">Arrastra tus imágenes o videos aquí</p>
                 <p className="text-sm text-slate-500">o haz clic para explorar</p>
             </div>
             
             {/* Title & Desc */}
             <div className="space-y-4">
                 <input type="text" placeholder="Título del Proyecto" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
                 <textarea rows={5} placeholder="Descripción del proyecto..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-amber-500 outline-none resize-none"></textarea>
             </div>
         </div>

         <div className="space-y-6">
             <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4">Software Usado</h3>
                 <div className="flex flex-wrap gap-2 mb-3">
                     <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-sm flex items-center gap-2">Blender <X className="h-3 w-3 cursor-pointer"/></span>
                 </div>
                 <input type="text" placeholder="Agregar software..." className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-sm focus:outline-none focus:border-amber-500" />
             </div>
             
             <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4">Categoría</h3>
                 <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none">
                     <option>Modelado 3D</option>
                     <option>Concept Art</option>
                     <option>Animación</option>
                 </select>
             </div>
         </div>
      </div>
    </CreatePageLayout>
  );
};
