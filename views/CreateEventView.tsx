
import React from 'react';
import { ArrowLeft, CalendarDays, MapPin, Image as ImageIcon, DollarSign } from 'lucide-react';

interface CreateEventViewProps {
  onBack: () => void;
}

export const CreateEventView: React.FC<CreateEventViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Crear Evento</h1>
        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700">Publicar</button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
          
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <CalendarDays className="h-5 w-5 text-red-500" /> Información General
              </h2>
              <input type="text" placeholder="Nombre del Evento" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none" />
              <div className="flex gap-4">
                  <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tipo</label>
                      <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none">
                          <option>Webinar</option>
                          <option>Workshop</option>
                          <option>Meetup</option>
                          <option>Conferencia</option>
                      </select>
                  </div>
                  <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fecha</label>
                      <input type="date" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none" />
                  </div>
              </div>
              <textarea rows={4} placeholder="Descripción del evento..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none resize-none"></textarea>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <MapPin className="h-5 w-5 text-red-500" /> Ubicación
              </h2>
              <div className="flex gap-4">
                  <select className="w-1/3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none">
                      <option>Online</option>
                      <option>Presencial</option>
                  </select>
                  <input type="text" placeholder="Dirección o Enlace" className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none" />
              </div>
          </div>

          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <ImageIcon className="h-5 w-5 text-red-500" /> Banner
              </h2>
              <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <p className="font-bold text-slate-900 dark:text-white">Sube una imagen atractiva</p>
                  <p className="text-sm text-slate-500">1920x1080 recomendado</p>
              </div>
          </div>

           <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <DollarSign className="h-5 w-5 text-red-500" /> Entrada
              </h2>
              <div className="flex gap-4 items-center">
                  <input type="number" placeholder="Precio (0 para gratis)" className="w-1/3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-red-500 outline-none" />
                  <span className="text-sm text-slate-500">Dejar en 0 para eventos gratuitos.</span>
              </div>
          </div>

      </div>
    </div>
  );
};
