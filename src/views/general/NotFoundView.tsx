
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';

export const NotFoundView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center animate-fade-in">

                {/* Animated 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[180px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-blue-500/20 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Página no encontrada
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2 group"
                    >
                        <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Ir al Inicio
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Volver Atrás
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-sm text-slate-500 mb-4">O explora estas secciones:</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => navigate('/portfolio')}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Compass className="h-4 w-4" />
                            Portafolio
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Blog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
