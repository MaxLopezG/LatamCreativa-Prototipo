
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';

interface GuestLimitOverlayProps {
    title?: string;
    description?: string;
    itemType?: 'proyectos' | 'artículos' | 'hilos';
}

/**
 * Overlay component shown to non-logged users when they want to see more content.
 * Invites them to register or login.
 */
export const GuestLimitOverlay: React.FC<GuestLimitOverlayProps> = ({
    title = '¿Quieres ver más?',
    description = 'Únete a nuestra comunidad para acceder a todo el contenido.',
    itemType = 'proyectos'
}) => {
    const navigate = useNavigate();

    return (
        <div className="relative col-span-full">
            {/* Gradient fade overlay */}
            <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c21] to-transparent pointer-events-none z-10" />

            {/* Main CTA Card */}
            <div className="relative z-20 text-center py-16 px-6 bg-gradient-to-br from-[#1a1a2e]/80 to-[#1c1c21] rounded-3xl border border-white/10 backdrop-blur-md">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-amber-400" />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    {description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/register')}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 transition-all"
                    >
                        <UserPlus className="h-5 w-5" />
                        Crear cuenta gratis
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                    >
                        <LogIn className="h-5 w-5" />
                        Iniciar sesión
                    </button>
                </div>

                {/* Benefits */}
                <div className="mt-10 pt-8 border-t border-white/5">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Al registrarte podrás:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Ver todos los {itemType}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Subir tu propio contenido
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Interactuar con la comunidad
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
