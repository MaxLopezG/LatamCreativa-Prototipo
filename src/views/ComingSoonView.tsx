
import React from 'react';
import { ArrowLeft, Bell, Rocket, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ComingSoonView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center p-6 overflow-hidden animate-fade-in">
            {/* Background Gradients */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-75"></div>

            <div className="text-center max-w-2xl relative z-10 glass-panel p-12 rounded-3xl border border-white/5 shadow-2xl bg-black/40 backdrop-blur-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 animate-slide-up">
                    <Timer className="h-3 w-3" /> En Construcción
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display leading-tight animate-slide-up delay-100">
                    Algo épico <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">está llegando</span>
                </h1>

                <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto animate-slide-up delay-200">
                    Estamos trabajando duro para traerte esta funcionalidad.
                    Únete a la lista de espera para ser el primero en probarlo.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
                    <div className="relative w-full max-w-xs">
                        <Bell className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                        <input
                            type="email"
                            placeholder="tucorreo@ejemplo.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <Rocket className="h-4 w-4" />
                        Notificarme
                    </button>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="mt-12 text-slate-500 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto animate-slide-up delay-400"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver atrás
                </button>
            </div>
        </div>
    );
};
