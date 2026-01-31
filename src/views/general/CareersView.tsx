
import React, { useState } from 'react';
import { Briefcase, Globe, Clock, Heart, Users, Zap, ChevronRight, MapPin, Send, CheckCircle2, ArrowRight, Sparkles, Coffee, Laptop, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobPosition {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    color: string;
}

const jobPositions: JobPosition[] = [
    {
        id: '1',
        title: 'Senior React Developer',
        department: 'Ingeniería',
        location: 'Remoto (Latam)',
        type: 'Full-time',
        description: 'Buscamos un desarrollador React con experiencia en TypeScript y arquitecturas escalables para liderar el desarrollo de nuestra plataforma.',
        requirements: ['5+ años con React', 'TypeScript avanzado', 'Experiencia con Firebase', 'Inglés intermedio'],
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: '2',
        title: 'Product Designer (UI/UX)',
        department: 'Diseño',
        location: 'Remoto (Latam)',
        type: 'Full-time',
        description: 'Diseñador apasionado por crear experiencias digitales excepcionales. Trabajarás directamente con el equipo de producto.',
        requirements: ['Portfolio sólido', 'Figma avanzado', 'Design Systems', 'User Research'],
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: '3',
        title: 'Community Manager',
        department: 'Marketing',
        location: 'Remoto (Brasil)',
        type: 'Part-time',
        description: 'Buscamos alguien que ame la comunidad creativa y quiera ayudar a crecer nuestra presencia en Brasil.',
        requirements: ['Portugués nativo', 'Experiencia en redes sociales', 'Conocimiento de la industria creativa', 'Español básico'],
        color: 'from-amber-500 to-orange-500'
    }
];

const benefits = [
    { icon: Globe, title: 'Trabajo 100% Remoto', desc: 'Trabaja desde cualquier lugar de Latinoamérica o el mundo', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Clock, title: 'Horario Flexible', desc: 'Organiza tu tiempo como mejor te funcione', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Heart, title: 'Ambiente Creativo', desc: 'Equipo apasionado por el arte y la tecnología', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { icon: Laptop, title: 'Equipo Moderno', desc: 'Te proporcionamos las herramientas que necesites', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: Coffee, title: 'Work-Life Balance', desc: 'Priorizamos tu bienestar y salud mental', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Users, title: 'Equipo Global', desc: 'Colabora con talento de toda Latinoamérica', color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const applicationSteps = [
    { step: 1, title: 'Envía tu CV', desc: 'Cuéntanos sobre ti y envía tu portafolio' },
    { step: 2, title: 'Entrevista Inicial', desc: 'Videollamada de 30 min con nuestro equipo' },
    { step: 3, title: 'Challenge Técnico', desc: 'Proyecto pequeño para conocer tu trabajo' },
    { step: 4, title: '¡Bienvenido!', desc: 'Te unirás al equipo de Latam Creativa' },
];

export const CareersView: React.FC = () => {
    const navigate = useNavigate();
    const [expandedJob, setExpandedJob] = useState<string | null>(null);

    return (
        <div className="animate-fade-in">
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto pb-20 px-4 md:px-6 transition-all duration-300">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-[#18181b] border border-white/10 mt-6 min-h-[450px] flex items-center shadow-2xl">

                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10 px-6 md:px-16 w-full max-w-4xl py-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
                            <Briefcase className="h-3 w-3 text-amber-500" /> Únete al Equipo
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg transition-all duration-300">
                            Construye el futuro de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">economía creativa</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed drop-shadow-md">
                            Únete a un equipo remoto, diverso y apasionado. Estamos buscando personas que quieran impactar la vida de miles de artistas en Latinoamérica.
                        </p>
                        <a
                            href="#positions"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg shadow-white/10 group"
                        >
                            Ver Posiciones Abiertas
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute right-10 top-10 hidden lg:block">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-white/10 backdrop-blur-xl rotate-12 shadow-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-xl -rotate-6 shadow-xl"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-amber-500/50" />
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="py-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">¿Por qué trabajar con nosotros?</h2>
                    <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">Creemos que un equipo feliz crea productos increíbles. Por eso ofrecemos beneficios que realmente importan.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
                            >
                                <div className={`inline-flex p-3 rounded-xl ${benefit.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Positions */}
                <div id="positions" className="py-16 scroll-mt-24">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">Posiciones Abiertas</h2>
                    <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">Explora nuestras oportunidades actuales y encuentra tu lugar en el equipo.</p>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {jobPositions.map((job) => (
                            <div
                                key={job.id}
                                className="group rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-amber-500/30 transition-all duration-300 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${job.color}`}></div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.department}</span>
                                                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">{job.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${expandedJob === job.id ? 'rotate-90' : ''}`} />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${expandedJob === job.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6 border-t border-slate-200 dark:border-white/5 pt-4">
                                        <p className="text-slate-600 dark:text-slate-300 mb-4">{job.description}</p>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Requisitos:</h4>
                                        <ul className="space-y-1 mb-6">
                                            {job.requirements.map((req, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {req}
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href={`mailto:talento@latamcreativa.com?subject=Postulación: ${job.title}`}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors text-sm"
                                        >
                                            <Send className="h-4 w-4" /> Postularme
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Process */}
                <div className="py-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">Proceso de Aplicación</h2>
                    <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">Nuestro proceso es transparente y diseñado para conocerte como profesional y persona.</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {applicationSteps.map((step, i) => (
                            <div key={i} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xl mb-4 shadow-lg shadow-amber-500/20">
                                    {step.step}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500">{step.desc}</p>

                                {/* Connector Line */}
                                {i < applicationSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="rounded-3xl bg-gradient-to-br from-[#18181b] to-[#1a1a1f] border border-white/10 p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                    <div className="relative z-10">
                        <Zap className="h-12 w-12 text-amber-500 mx-auto mb-6" />
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">¿No encuentras tu posición ideal?</h2>
                        <p className="text-slate-400 max-w-xl mx-auto mb-8">
                            Siempre estamos buscando talento excepcional. Envíanos tu CV y cuéntanos cómo puedes aportar al equipo.
                        </p>
                        <a
                            href="mailto:talento@latamcreativa.com?subject=Candidatura Espontánea"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
                        >
                            <Send className="h-5 w-5" /> Enviar Candidatura Espontánea
                        </a>
                        <p className="text-slate-500 text-sm mt-6">
                            O escríbenos directamente a <span className="text-amber-500">talento@latamcreativa.com</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
