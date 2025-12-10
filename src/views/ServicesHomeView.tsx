
import React, { useState } from 'react';
import { Search, ArrowRight, Zap, Star, TrendingUp, ShieldCheck, PlayCircle, Heart, MessageSquare, Clock } from 'lucide-react';
import { PORTFOLIO_ITEMS, BLOG_ITEMS, ASSET_ITEMS } from '../data/content';

interface ServicesHomeViewProps {
    onNavigate: (moduleId: string) => void;
}

export const ServicesHomeView: React.FC<ServicesHomeViewProps> = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const services = [
        {
            id: 'market',
            title: 'Marketplace',
            subtitle: 'Assets de calidad AAA',
            image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&fit=crop', // Abstract 3D
            accent: 'from-emerald-500 to-teal-600',
            cols: 'col-span-12 md:col-span-8 lg:col-span-8',
            height: 'h-72 md:h-96',
            icon: TrendingUp
        },
        {
            id: 'education',
            title: 'Educación',
            subtitle: 'Domina nuevas habilidades',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&fit=crop', // Collaboration
            accent: 'from-blue-500 to-indigo-600',
            cols: 'col-span-12 md:col-span-4 lg:col-span-4',
            height: 'h-72 md:h-96',
            icon: PlayCircle
        },
        {
            id: 'portfolio',
            title: 'Portafolio',
            subtitle: 'Tu identidad creativa',
            image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&fit=crop', // Art/Paint
            accent: 'from-pink-500 to-rose-600',
            cols: 'col-span-6 md:col-span-4 lg:col-span-3',
            height: 'h-60 md:h-72',
            icon: Star
        },
        {
            id: 'freelance',
            title: 'Freelance',
            subtitle: 'Consigue proyectos',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&fit=crop', // Skyscrapers
            accent: 'from-cyan-500 to-sky-600',
            cols: 'col-span-6 md:col-span-4 lg:col-span-3',
            height: 'h-60 md:h-72',
            icon: ShieldCheck
        },
        {
            id: 'community',
            title: 'Comunidad',
            subtitle: 'Conecta y colabora',
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&fit=crop', // People
            accent: 'from-purple-500 to-violet-600',
            cols: 'col-span-6 md:col-span-4 lg:col-span-3',
            height: 'h-60 md:h-72',
            icon: Zap
        },
        {
            id: 'blog',
            title: 'Insights',
            subtitle: 'Tendencias y noticias',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&fit=crop', // Tech
            accent: 'from-amber-400 to-orange-500',
            cols: 'col-span-6 md:col-span-12 lg:col-span-3',
            height: 'h-60 md:h-72',
            icon: ArrowRight
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNavigate('search');
    };

    return (
        <div className="bg-[#0f0f12] min-h-screen text-slate-100 pb-20 font-sans selection:bg-amber-500/30">

            {/* Hero Section */}
            <div className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center">
                {/* Background with Slow Zoom Effect */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Background Image - Darker and more blended */}
                    <img
                        src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&fit=crop" // Abstract colorful fluid
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40 animate-subtle-zoom"
                    />

                    {/* Vibrant Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0f0f12]/50 to-[#0f0f12]"></div>

                    {/* Atmospheric Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                </div>

                <div className="relative z-30 w-full max-w-5xl px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg animate-fade-in-up">
                        <Zap className="h-3 w-3" /> Ahora en Beta Pública
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-2xl animate-fade-in-up delay-100">
                        Construye mundos <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">Imposibles.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                        El ecosistema definitivo para creadores digitales. <br /> Mercado, Aprendizaje y Comunidad.
                    </p>

                    {/* Search Bar Container */}
                    <div className={`relative max-w-2xl mx-auto group transition-all duration-300 transform ${isSearchFocused ? 'scale-105' : 'scale-100'} animate-fade-in-up delay-300`}>
                        <form onSubmit={handleSubmit} className="relative z-20">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className={`h-6 w-6 transition-colors ${isSearchFocused ? 'text-amber-500' : 'text-slate-400'}`} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                placeholder="Busca 'Environment Pack', 'Blender Course'..."
                                className="w-full py-5 pl-16 pr-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:bg-[#1a1a1e] transition-all text-lg shadow-2xl"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <button type="submit" className="p-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-colors font-bold">
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </form>

                        {/* Search Dropdown / Trending */}
                        <div className={`absolute top-full left-0 right-0 mt-2 bg-[#1a1a1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 origin-top z-10 ${isSearchFocused ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                            <div className="p-4">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Tendencias</div>
                                {['Unreal Engine 5 Assets', 'Cyberpunk Characters', 'Low Poly Nature', 'VFX Tutorials'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer text-slate-300 hover:text-white transition-colors">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up delay-500 opacity-0" style={{ animationFillMode: 'forwards' }}>
                        {['#3DModels', '#Textures', '#Animations', '#Plugins', '#Audio'].map(tag => (
                            <button key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-sm text-slate-400 hover:text-white transition-all">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-12 gap-5">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            onClick={() => onNavigate(service.id)}
                            className={`${service.cols} ${service.height} group relative rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10 hover:ring-white/30 transition-all duration-500 shadow-2xl transform hover:-translate-y-1`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background Image with Zoom on Hover */}
                            <img
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent opacity-90"></div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                            {/* Hover Reveal Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay`}></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="flex items-end justify-between">
                                    <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                                        <div className={`p-2 w-fit rounded-lg bg-white/10 backdrop-blur-md border border-white/10 mb-4 text-white group-hover:bg-white/20 transition-colors`}>
                                            <service.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-300 font-medium text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                            {service.subtitle}
                                        </p>
                                    </div>

                                    <div className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 shadow-lg hover:bg-amber-400">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Marketplace Section (Real Data) */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-24 mb-10 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Destacado esta semana</h2>
                    <p className="text-slate-400">Los mejores recursos seleccionados por nuestros editores</p>
                </div>
                <button onClick={() => onNavigate('market')} className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:text-amber-500 transition-colors px-4 py-2 rounded-full border border-white/10 hover:bg-white/5">
                    Ver todo el mercado <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-6 pb-4 md:grid md:grid-cols-4 lg:grid-cols-5 min-w-max md:min-w-0">
                    {ASSET_ITEMS.slice(0, 5).map((item, index) => (
                        <div key={item.id} className="group w-72 md:w-auto flex-shrink-0 cursor-pointer">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a1a1e] relative mb-4 ring-1 ring-white/5 hover:ring-amber-500/50 transition-all shadow-lg transform hover:-translate-y-2 duration-300">
                                <img
                                    src={item.thumbnail}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={item.title}
                                />

                                <div className="absolute top-3 left-3 flex gap-2">
                                    {index === 0 && <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wide">Best Seller</span>}
                                    {index === 2 && <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wide">New</span>}
                                </div>

                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-white border border-white/10 group-hover:bg-amber-500 group-hover:text-black group-hover:border-transparent transition-all">
                                    ${item.price}
                                </div>

                                {/* Quick Add overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                                    <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg">
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-white group-hover:text-amber-500 transition-colors truncate">{item.title}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden ring-1 ring-white/20">
                                        <img src={item.creatorAvatar} alt={item.creator} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm text-slate-400 hover:text-white transition-colors">{item.creator}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs text-slate-300 font-bold">{item.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Portfolios Section (Real Data) */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-16 mb-10 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Inspiración de la Comunidad</h2>
                    <p className="text-slate-400">Descubre lo que están creando otros artistas</p>
                </div>
                <button onClick={() => onNavigate('portfolio')} className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:text-pink-500 transition-colors px-4 py-2 rounded-full border border-white/10 hover:bg-white/5">
                    Explorar Portafolios <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PORTFOLIO_ITEMS.slice(0, 4).map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="aspect-video rounded-2xl overflow-hidden bg-[#1a1a1e] relative mb-3 ring-1 ring-white/5 hover:ring-pink-500/50 transition-all shadow-lg">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={item.title}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                                        <Heart className="h-3 w-3" /> {item.likes}
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-white group-hover:text-pink-500 transition-colors truncate">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden">
                                    <img src={item.artistAvatar} alt={item.artist} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs text-slate-400">{item.artist}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest From Blog Section (Real Data) */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-16 mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Últimas Noticias</h2>
                    <p className="text-slate-400">Tutoriales, entrevistas y novedades de la industria</p>
                </div>
                <button onClick={() => onNavigate('blog')} className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:text-blue-500 transition-colors px-4 py-2 rounded-full border border-white/10 hover:bg-white/5">
                    Ir al Blog <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BLOG_ITEMS.slice(0, 3).map((item) => (
                        <div key={item.id} className="group cursor-pointer bg-[#16161a] rounded-3xl p-4 hover:bg-[#1a1a1e] transition-colors border border-white/5 hover:border-white/10">
                            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-5">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={item.title}
                                />
                            </div>
                            <div className="px-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider">
                                    <span>{item.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                    <span className="text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {item.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                                    {item.excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-2">
                                        <img src={item.authorAvatar} alt={item.author} className="w-6 h-6 rounded-full" />
                                        <span className="text-xs text-slate-300">{item.author}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {item.likes}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {item.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Trust Ticker */}
            <div className="border-t border-white/5 py-12 bg-[#0f0f12]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-8">Con la confianza de creadores en</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos - Text for now */}
                        <span className="text-2xl font-black text-white">EPIC GAMES</span>
                        <span className="text-2xl font-black text-white">UNITY</span>
                        <span className="text-2xl font-black text-white">BLENDER</span>
                        <span className="text-2xl font-black text-white">ADOBE</span>
                        <span className="text-2xl font-black text-white">UBISOFT</span>
                    </div>
                </div>
            </div>

        </div>
    );
};
