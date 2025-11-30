
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { CreatePageLayout } from '../components/layout/CreatePageLayout';

interface CreateArticleViewProps {
  onBack: () => void;
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = ({ onBack }) => {
  return (
    <CreatePageLayout 
      title="Escribir Artículo" 
      onBack={onBack}
      actionColorClass="bg-blue-500 hover:bg-blue-600 text-white"
    >
      <div className="space-y-8">
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
    </CreatePageLayout>
  );
};
