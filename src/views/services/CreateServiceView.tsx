
import React from 'react';
import { ArrowLeft, Briefcase, DollarSign, Image as ImageIcon } from 'lucide-react';

interface CreateServiceViewProps {
  onBack: () => void;
}

export const CreateServiceView: React.FC<CreateServiceViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Crear Nuevo Servicio</h1>
        <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm hover:opacity-90">Publicar</button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
          
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Briefcase className="h-5 w-5 text-slate-500" /> Detalles del Servicio
              </h2>
              <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Título del Gig</label>
                  <input type="text" placeholder="Ej: Haré modelado 3D de personajes..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Categoría</label>
                  <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-amber-500 outline-none">
                      <option>Modelado 3D</option>
                      <option>Animación</option>
                      <option>Concept Art</option>
                      <option>Rigging</option>
                  </select>
              </div>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <DollarSign className="h-5 w-5 text-slate-500" /> Paquetes y Precios
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Básico', 'Estándar', 'Premium'].map((pkg) => (
                      <div key={pkg} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-3">
                          <h3 className="font-bold text-center border-b border-slate-200 dark:border-white/10 pb-2">{pkg}</h3>
                          <input type="text" placeholder="Nombre del paquete" className="w-full bg-white dark:bg-black/20 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-amber-500 outline-none" />
                          <textarea rows={3} placeholder="Descripción..." className="w-full bg-white dark:bg-black/20 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-amber-500 outline-none resize-none"></textarea>
                          <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">$</span>
                              <input type="number" placeholder="Precio" className="w-full bg-white dark:bg-black/20 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-amber-500 outline-none" />
                          </div>
                          <select className="w-full bg-white dark:bg-black/20 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-amber-500 outline-none">
                              <option>Entrega: 1 día</option>
                              <option>Entrega: 3 días</option>
                              <option>Entrega: 7 días</option>
                          </select>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <ImageIcon className="h-5 w-5 text-slate-500" /> Galería
              </h2>
              <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <p className="font-bold text-slate-900 dark:text-white">Sube imágenes de muestra</p>
                  <p className="text-sm text-slate-500">Muestra tu mejor trabajo para atraer clientes</p>
              </div>
          </div>

      </div>
    </div>
  );
};
