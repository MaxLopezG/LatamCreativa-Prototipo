/**
 * Service Coming Soon View
 * Displays a coming soon page with service-specific information
 */
import React from 'react';
import { ArrowLeft, Bell, Rocket, Timer, LucideIcon, Check } from 'lucide-react';

interface ServiceComingSoonProps {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    icon: LucideIcon;
    accentColor?: 'amber' | 'blue' | 'purple' | 'green';
}

export const ServiceComingSoon: React.FC<ServiceComingSoonProps> = ({
    title,
    subtitle,
    description,
    features,
    icon: Icon,
    accentColor = 'amber'
}) => {
    const colorClasses = {
        amber: {
            gradient: 'from-amber-400 to-orange-600',
            glow: 'bg-amber-500/20',
            button: 'from-amber-500 to-orange-600',
            shadow: 'shadow-amber-500/20',
            icon: 'text-amber-400',
            check: 'text-amber-500'
        },
        blue: {
            gradient: 'from-blue-400 to-cyan-500',
            glow: 'bg-blue-500/20',
            button: 'from-blue-500 to-cyan-600',
            shadow: 'shadow-blue-500/20',
            icon: 'text-blue-400',
            check: 'text-blue-500'
        },
        purple: {
            gradient: 'from-purple-400 to-pink-500',
            glow: 'bg-purple-500/20',
            button: 'from-purple-500 to-pink-600',
            shadow: 'shadow-purple-500/20',
            icon: 'text-purple-400',
            check: 'text-purple-500'
        },
        green: {
            gradient: 'from-emerald-400 to-teal-500',
            glow: 'bg-emerald-500/20',
            button: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/20',
            icon: 'text-emerald-400',
            check: 'text-emerald-500'
        }
    };

    const colors = colorClasses[accentColor];

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center p-6 overflow-hidden animate-fade-in">
            {/* Background Gradients */}
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${colors.glow} rounded-full blur-[120px] -z-10 animate-pulse`}></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-4xl w-full relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">

                    {/* Left: Service Info */}
                    <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl bg-black/40 backdrop-blur-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Timer className="h-3 w-3" /> Próximamente
                        </div>

                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.button} flex items-center justify-center mb-6 ${colors.shadow} shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                            {title}
                        </h1>
                        <p className={`text-lg font-medium bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
                            {subtitle}
                        </p>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            {description}
                        </p>

                        {/* Features List */}
                        <div className="space-y-3 mb-8">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full bg-white/5 flex items-center justify-center`}>
                                        <Check className={`w-3 h-3 ${colors.check}`} />
                                    </div>
                                    <span className="text-slate-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => window.history.back()}
                            className="text-slate-500 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Volver atrás
                        </button>
                    </div>

                    {/* Right: Newsletter Signup */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl bg-black/30 backdrop-blur-xl text-center">
                        <Rocket className={`w-12 h-12 ${colors.icon} mx-auto mb-6`} />
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Sé el primero en probarlo
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Únete a la lista de espera y te avisaremos cuando esté disponible.
                        </p>

                        <div className="space-y-3">
                            <div className="relative">
                                <Bell className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <button className={`w-full px-8 py-3 bg-gradient-to-r ${colors.button} text-white font-bold rounded-xl hover:shadow-lg ${colors.shadow} hover:scale-[1.02] transition-all flex items-center justify-center gap-2`}>
                                <Rocket className="h-4 w-4" />
                                Notificarme
                            </button>
                        </div>

                        <p className="text-slate-500 text-xs mt-4">
                            Sin spam. Solo una notificación cuando esté listo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceComingSoon;
