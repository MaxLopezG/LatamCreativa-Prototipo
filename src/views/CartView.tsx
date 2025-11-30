
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, CreditCard, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ items, onRemove, onContinueShopping }) => {
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.18; 
  const total = subtotal + tax;

  const handleCheckout = () => {
      // Simulate API processing
      setTimeout(() => {
          navigate('/success');
      }, 500);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in p-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-center">
          Parece que aún no has añadido ningún curso o asset. Explora el mercado para encontrar recursos increíbles.
        </p>
        <button 
          onClick={onContinueShopping}
          className="px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
        >
          Explorar Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 animate-fade-in pb-24">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-amber-500" /> Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">${item.price}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-white/10 text-slate-500 mt-1">
                    {item.type}
                  </span>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Resumen del Pedido</h3>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 dark:border-white/10 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Impuestos (Est. 18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-amber-500">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 mb-4 flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" /> Proceder al Pago
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Pagos procesados de forma segura
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
