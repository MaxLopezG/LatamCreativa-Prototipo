
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

export const ComingSoonView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-fade-in">
      <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Construction className="h-10 w-10 text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Próximamente</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Estamos construyendo esta funcionalidad. ¡Vuelve pronto para ver las novedades!
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>
    </div>
  );
};
