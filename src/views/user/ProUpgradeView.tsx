
import React, { useState } from 'react';
import { ArrowLeft, Check, Star, Zap, Crown, Shield, Download, Rocket } from 'lucide-react';

interface ProUpgradeViewProps {
  onBack: () => void;
}

export const ProUpgradeView: React.FC<ProUpgradeViewProps> = ({ onBack }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const features = [
    { icon: Zap, title: "Velocidad Ilimitada", desc: "Descargas de assets sin restricciones de velocidad." },
    { icon: Download, title: "Acceso Offline", desc: "Descarga cursos completos para ver sin internet." },
    { icon: Shield, title: "Licencia Comercial", desc: "Uso comercial incluido en todos los assets gratuitos." },
    { icon: Star, title: "Contenido Exclusivo", desc: "Acceso a tutoriales y recursos solo para miembros." },
  ];

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in pb-20">
      
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0d0d0f]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Crown className="h-5 w-5 fill-current" />
            <span>Latam Creativa PRO</span>
        </div>
      </div>

      <div className="px-6 py-12 md:py-20 flex flex-col items-center text-center relative overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 max-w-2xl mx-auto mb-16">
             <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                 Sube de Nivel
             </span>
             <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                 Desbloquea tu máximo potencial creativo
             </h1>
             <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                 Únete a los profesionales que usan Latam Creativa Pro para acelerar su carrera, acceder a recursos premium y conectar con la élite de la industria.
             </p>
         </div>

         {/* Features Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20 relative z-10">
             {features.map((feat, idx) => (
                 <div key={idx} className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                     <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                         <feat.icon className="h-6 w-6" />
                     </div>
                     <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">{feat.desc}</p>
                 </div>
             ))}
         </div>

         {/* Pricing Section */}
         <div className="w-full max-w-5xl mx-auto relative z-10">
             
             {/* Toggle */}
             <div className="flex justify-center mb-10">
                 <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-xl flex relative">
                     <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                            billingCycle === 'monthly' 
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                     >
                         Mensual
                     </button>
                     <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            billingCycle === 'yearly' 
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                     >
                         Anual <span className="text-[10px] bg-green-500 text-white px-1.5 rounded py-0.5">-20%</span>
                     </button>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                 
                 {/* Free Plan */}
                 <div className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl border border-slate-200 dark:border-white/10">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gratis</h3>
                     <p className="text-sm text-slate-500 mb-6">Para entusiastas que están empezando.</p>
                     <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">$0 <span className="text-sm font-normal text-slate-500">/mes</span></div>
                     <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-8">
                         Plan Actual
                     </button>
                     <ul className="space-y-4 text-left">
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> Acceso a cursos gratuitos
                         </li>
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> Portafolio básico
                         </li>
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> Comunidad pública
                         </li>
                     </ul>
                 </div>

                 {/* PRO Plan */}
                 <div className="bg-[#18181b] dark:bg-black p-8 rounded-3xl border-2 border-amber-500 relative transform md:scale-110 shadow-2xl shadow-amber-500/20">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                         Más Popular
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                         <Crown className="h-5 w-5 text-amber-500 fill-current" /> Pro
                     </h3>
                     <p className="text-sm text-slate-400 mb-6">Para artistas que buscan la excelencia.</p>
                     <div className="text-4xl font-bold text-white mb-6">
                         ${billingCycle === 'yearly' ? '12' : '15'} 
                         <span className="text-sm font-normal text-slate-500">/mes</span>
                     </div>
                     <button className="w-full py-3 rounded-xl bg-amber-500 font-bold text-white hover:bg-amber-600 transition-colors mb-8 shadow-lg shadow-amber-500/25">
                         Mejorar Ahora
                     </button>
                     <ul className="space-y-4 text-left">
                         <li className="flex items-start gap-3 text-sm text-white">
                             <div className="bg-amber-500/20 p-0.5 rounded-full"><Check className="h-3.5 w-3.5 text-amber-500 shrink-0" /></div> 
                             Todo lo de Gratis
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white">
                             <div className="bg-amber-500/20 p-0.5 rounded-full"><Check className="h-3.5 w-3.5 text-amber-500 shrink-0" /></div>
                             Streaming en 4K
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white">
                             <div className="bg-amber-500/20 p-0.5 rounded-full"><Check className="h-3.5 w-3.5 text-amber-500 shrink-0" /></div>
                             Descargas ilimitadas de Assets
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white">
                             <div className="bg-amber-500/20 p-0.5 rounded-full"><Check className="h-3.5 w-3.5 text-amber-500 shrink-0" /></div>
                             Insignia Pro en perfil
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white">
                             <div className="bg-amber-500/20 p-0.5 rounded-full"><Check className="h-3.5 w-3.5 text-amber-500 shrink-0" /></div>
                             0% comisión en ventas
                         </li>
                     </ul>
                 </div>

                 {/* Studio Plan */}
                 <div className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl border border-slate-200 dark:border-white/10">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Studio</h3>
                     <p className="text-sm text-slate-500 mb-6">Para equipos y agencias pequeñas.</p>
                     <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">$49 <span className="text-sm font-normal text-slate-500">/mes</span></div>
                     <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-8">
                         Contactar Ventas
                     </button>
                     <ul className="space-y-4 text-left">
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> 5 Cuentas Pro
                         </li>
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> Panel de administración
                         </li>
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> Facturación centralizada
                         </li>
                         <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                             <Check className="h-5 w-5 text-slate-400 shrink-0" /> Soporte prioritario 24/7
                         </li>
                     </ul>
                 </div>

             </div>
         </div>

         {/* FAQ CTA */}
         <div className="mt-20 relative z-10">
             <p className="text-slate-500 dark:text-slate-400 text-sm">
                 ¿Tienes preguntas? <a href="#" className="text-amber-500 hover:underline">Revisa nuestras preguntas frecuentes</a> o contacta a soporte.
             </p>
         </div>

      </div>
    </div>
  );
};
