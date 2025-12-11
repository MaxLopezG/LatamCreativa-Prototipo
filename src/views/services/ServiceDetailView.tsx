
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Check, MessageSquare, Zap, Share2 } from 'lucide-react';
import { FREELANCE_SERVICES } from '../../data/content';

interface ServiceDetailViewProps {
  serviceId?: string;
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
  onShare?: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ serviceId, onBack, onAuthorClick, onShare }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = serviceId || paramId;
  const service = FREELANCE_SERVICES.find(s => s.id === id) || FREELANCE_SERVICES[0];
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');

  const currentPkg = service.packages[selectedPackage];

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in pb-20">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Freelance
        </button>
        <button 
          onClick={onShare}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors"
        >
             <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 md:px-10 py-10">
        
        <div className="lg:col-span-8 space-y-8">
           
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{service.title}</h1>
           
           <div className="flex items-center gap-4 py-4 border-y border-slate-200 dark:border-white/10">
               <img src={service.sellerAvatar} alt={service.seller} className="h-12 w-12 rounded-full object-cover" />
               <div>
                   <button onClick={() => onAuthorClick?.(service.seller)} className="font-bold text-slate-900 dark:text-white hover:underline">{service.seller}</button>
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                       <span className="text-amber-500 font-bold flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> {service.rating}</span>
                       <span>({service.reviewCount})</span>
                       <span>•</span>
                       <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-xs font-bold uppercase">{service.sellerLevel}</span>
                   </div>
               </div>
           </div>

           <div className="space-y-4">
               <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
                   <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
               </div>
           </div>

           <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
               <h3 className="font-bold text-slate-900 dark:text-white mb-4">Sobre este servicio</h3>
               <p>{service.description}</p>
               <p>
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                   Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
               </p>
               <h4 className="font-bold text-slate-900 dark:text-white mt-6 mb-2">¿Por qué elegirme?</h4>
               <ul className="list-disc pl-5 space-y-2">
                   <li>Comunicación rápida y fluida (Español/Inglés).</li>
                   <li>Más de 5 años de experiencia en la industria.</li>
                   <li>Garantía de satisfacción del 100%.</li>
               </ul>
           </div>

        </div>

        <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
                
                <div className="flex p-1 bg-slate-100 dark:bg-white/5 m-4 rounded-xl">
                    {['basic', 'standard', 'premium'].map((pkg) => (
                        <button 
                            key={pkg}
                            onClick={() => setSelectedPackage(pkg as any)}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${
                                selectedPackage === pkg 
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md transform scale-105' 
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'
                            }`}
                        >
                            {pkg === 'basic' ? 'Básico' : pkg === 'standard' ? 'Estándar' : 'Premium'}
                        </button>
                    ))}
                </div>

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-start mb-4 mt-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xl">{currentPkg.title}</h3>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">${currentPkg.price}</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 min-h-[60px] leading-relaxed">
                        {currentPkg.desc}
                    </p>

                    <div className="flex justify-between items-center gap-4 mb-6">
                        <div className="flex flex-col items-center flex-1 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            <Clock className="h-5 w-5 text-amber-500 mb-1" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{currentPkg.delivery}</span>
                            <span className="text-[10px] text-slate-500">Entrega</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            <Zap className="h-5 w-5 text-blue-500 mb-1" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{currentPkg.revisions}</span>
                            <span className="text-[10px] text-slate-500">Revisiones</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                            <Check className="h-5 w-5 text-green-500 shrink-0" /> Archivos fuente incluidos
                        </li>
                        <li className={`flex items-center gap-3 text-sm font-medium ${selectedPackage === 'basic' ? 'text-slate-400 decoration-slate-500/50 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                            <Check className={`h-5 w-5 shrink-0 ${selectedPackage === 'basic' ? 'text-slate-300 dark:text-slate-600' : 'text-green-500'}`} /> Uso comercial
                        </li>
                        <li className={`flex items-center gap-3 text-sm font-medium ${selectedPackage === 'premium' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 decoration-slate-500/50 line-through'}`}>
                            <Check className={`h-5 w-5 shrink-0 ${selectedPackage === 'premium' ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`} /> Render 4K Ultra HD
                        </li>
                    </div>

                    <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity mb-3 shadow-lg">
                        Continuar (${currentPkg.price})
                    </button>
                    <button className="w-full py-3 bg-transparent border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Contactar Vendedor
                    </button>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};
