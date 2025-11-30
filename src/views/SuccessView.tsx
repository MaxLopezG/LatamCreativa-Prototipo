
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Layers } from 'lucide-react';

export const SuccessView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-scale-up">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">¡Pago Exitoso!</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Gracias por tu compra. Hemos enviado el recibo a tu correo electrónico. Ya puedes acceder a tus nuevos recursos.
      </p>
      <div className="flex gap-4">
        <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
        >
            <Home className="h-4 w-4" /> Ir al Inicio
        </button>
        <button 
            onClick={() => navigate('/education')}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
        >
            <Layers className="h-4 w-4" /> Ver Mis Cursos
        </button>
      </div>
    </div>
  );
};
