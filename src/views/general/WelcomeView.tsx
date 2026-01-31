
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Sparkles, Users, Briefcase, GraduationCap, Trophy,
    Layers, Newspaper, MessageCircle, Play, Star, TrendingUp, Globe,
    ChevronRight, Zap, Heart, Eye
} from 'lucide-react';
import { projectsService } from '../../services/modules/projects';
import { PortfolioItem } from '../../types';

export const WelcomeView: React.FC = () => {
    const navigate = useNavigate();
    const [featuredProjects, setFeaturedProjects] = useState<PortfolioItem[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fetch some featured projects for the showcase
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const result = await projectsService.getProjects(null, 8);
                setFeaturedProjects(result.data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    // Auto-slide featured projects
    useEffect(() => {
        if (featuredProjects.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % Math.min(featuredProjects.length, 4));
        }, 4000);
        return () => clearInterval(interval);
    }, [featuredProjects.length]);

    const features = [
        { icon: Layers, title: 'Portafolio', desc: 'Muestra tus mejores proyectos creativos', color: 'from-amber-500 to-orange-600' },
        { icon: Newspaper, title: 'Blog', desc: 'Comparte tutoriales y conocimientos', color: 'from-rose-500 to-pink-600' },
        { icon: MessageCircle, title: 'Foro', desc: 'Conecta con otros creativos', color: 'from-blue-500 to-cyan-600' },
        { icon: Briefcase, title: 'Freelance', desc: 'Encuentra oportunidades de trabajo', color: 'from-emerald-500 to-teal-600' },
        { icon: GraduationCap, title: 'Cursos', desc: 'Aprende de los mejores', color: 'from-purple-500 to-violet-600' },
        { icon: Trophy, title: 'Concursos', desc: 'Compite y gana premios', color: 'from-yellow-500 to-amber-600' },
    ];

    const stats = [
        { value: '10K+', label: 'Creativos', icon: Users },
        { value: '50K+', label: 'Proyectos', icon: Layers },
        { value: '100+', label: 'Tutoriales', icon: Play },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d0f] overflow-hidden">

            {/* Hero Section - Full Screen */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    {/* Gradient Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[200px]" />

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                </div>

                {/* Floating Project Cards (Background Decoration) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {featuredProjects.slice(0, 4).map((project, idx) => (
                        <div
                            key={project.id}
                            className={`absolute w-48 h-32 rounded-xl overflow-hidden shadow-2xl border border-white/10 opacity-30 hover:opacity-50 transition-opacity
                ${idx === 0 ? 'top-[15%] left-[10%] rotate-[-8deg]' : ''}
                ${idx === 1 ? 'top-[20%] right-[12%] rotate-[6deg]' : ''}
                ${idx === 2 ? 'bottom-[25%] left-[8%] rotate-[4deg]' : ''}
                ${idx === 3 ? 'bottom-[20%] right-[10%] rotate-[-5deg]' : ''}
              `}
                            style={{ animationDelay: `${idx * 0.5}s` }}
                        >
                            <img src={project.coverImage || project.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    ))}
                </div>

                {/* Main Hero Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium text-white/80">La comunidad creativa de Latinoamérica</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight animate-slide-up">
                        Donde el <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">talento</span>
                        <br />
                        se encuentra
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Únete a miles de artistas 3D, animadores, diseñadores y desarrolladores que comparten su trabajo, aprenden y crecen juntos.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={() => navigate('/register')}
                            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            Crear cuenta gratis
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                        >
                            Iniciar sesión
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <stat.icon className="h-5 w-5 text-amber-500" />
                                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                                </div>
                                <span className="text-sm text-slate-500">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Todo lo que necesitas para <span className="text-amber-500">crecer</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Una plataforma completa diseñada para impulsar tu carrera creativa
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.desc}</p>
                                <ChevronRight className="absolute top-6 right-6 h-5 w-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            {featuredProjects.length > 0 && (
                <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                                <TrendingUp className="h-4 w-4" />
                                Proyectos destacados
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Inspírate con el talento de la comunidad
                            </h2>
                        </div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredProjects.slice(0, 8).map((project, idx) => (
                                <div
                                    key={project.id}
                                    className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/portfolio/${project.slug || project.id}`)}
                                >
                                    <img
                                        src={project.coverImage || project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-semibold text-sm truncate">{project.title}</h3>
                                        <p className="text-white/60 text-xs truncate">{project.author?.name || 'Artista'}</p>
                                    </div>
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs">
                                            <Heart className="h-3 w-3" />
                                            {project.likeCount || 0}
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs">
                                            <Eye className="h-3 w-3" />
                                            {project.viewCount || 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Explore CTA */}
                        <div className="text-center mt-12">
                            <button
                                onClick={() => navigate('/portfolio')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                            >
                                Explorar más proyectos
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA Section */}
            <section className="relative py-32 px-6">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-rose-600/20 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Globe className="h-4 w-4 text-amber-400" />
                        <span className="text-sm text-white/80">Únete a la comunidad</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        ¿Listo para mostrar <br />tu talento al mundo?
                    </h2>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                        Crea tu perfil gratis, sube tu portafolio y conecta con oportunidades en toda Latinoamérica.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="group w-full sm:w-auto px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-amber-400 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                        >
                            <Zap className="h-5 w-5" />
                            Comenzar ahora
                        </button>
                        <button
                            onClick={() => navigate('/about')}
                            className="w-full sm:w-auto px-10 py-5 text-white font-semibold hover:text-amber-400 transition-colors flex items-center justify-center gap-2"
                        >
                            Conocer más
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Bottom Gradient */}
            <div className="h-32 bg-gradient-to-t from-[#0d0d0f] to-transparent" />

        </div>
    );
};
