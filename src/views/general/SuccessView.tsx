
import React, { useEffect } from 'react';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';

export const SuccessView: React.FC = () => {
  const { actions } = useAppStore();

  useEffect(() => {
    // Clear cart on mount
    actions.clearCart();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in w-full max-w-4xl mx-auto">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30 animate-enter-up">
        <Check className="h-12 w-12 text-white animate-bounce" strokeWidth={3} />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in delay-100">
        ¡Pago Exitoso!
      </h1>
      
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mb-10 leading-relaxed animate-fade-in delay-200">
        ¡Gracias por tu compra! Hemos enviado el recibo y los enlaces de acceso a tu correo electrónico.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fade-in delay-300">
        <button 
          onClick={() => actions.handleModuleSelect('home')}
          className="flex-1 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2"
        >
          Volver al Inicio
        </button>
        <button 
          onClick={() => actions.handleModuleSelect('market')}
          className="flex-1 px-8 py-4 bg-transparent border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" /> Seguir explorando
        </button>
      </div>
    </div>
  );
};
