
import React from 'react';
import { MessageCircleQuestion, Plus, Search, CheckCircle2, ArrowUp, MessageSquare } from 'lucide-react';
import { FORUM_ITEMS } from '../data/content';
import { Pagination } from '../components/common/Pagination';

interface ForumViewProps {
    onPostSelect?: (id: string) => void;
    onCreateClick?: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({ onPostSelect, onCreateClick }) => {
    return (
        <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#0f0f12] min-h-screen">

            {/* Cinematic Hero Banner */}
            <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 h-[450px] flex items-center justify-center overflow-hidden mb-12">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 animate-subtle-zoom"
                        alt="Forum Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0f0f12]/90 to-[#0f0f12]"></div>

                    {/* Vibrant Glows - Orange/Violet Theme */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                </div>

                <div className="relative z-10 px-6 w-full max-w-4xl text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
                        <MessageCircleQuestion className="h-3 w-3" /> Foro de Ayuda
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        Pregunta, Responde y <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Comparte Conocimiento</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed font-light">
                        La comunidad de Latam Creativa está aquí para resolver tus dudas técnicas y artísticas.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={onCreateClick}
                            className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/40 flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" /> Hacer Pregunta
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-md shadow-lg">
                            Explorar Soluciones
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">

                {/* Main List */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <div className="flex gap-6">
                            <button className="text-white font-bold border-b-2 border-orange-500 pb-4 -mb-[17px]">Recientes</button>
                            <button className="text-slate-500 hover:text-white transition-colors pb-4 -mb-[17px]">Más Votados</button>
                            <button className="text-slate-500 hover:text-white transition-colors pb-4 -mb-[17px]">Sin Respuesta</button>
                        </div>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar dudas..."
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-orange-500/50 text-white w-64 focus:bg-white/10 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {FORUM_ITEMS.map(post => (
                            <div
                                key={post.id}
                                onClick={() => onPostSelect?.(post.id)}
                                className="group relative bg-[#1a1a1e] border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-orange-500/5 flex gap-6"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] rounded-2xl transition-colors pointer-events-none"></div>

                                {/* Stats Side */}
                                <div className="flex flex-col items-center gap-3 min-w-[60px] pt-1">
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-400 transition-colors">
                                        <ArrowUp className="h-5 w-5 mb-1" />
                                        <span className="font-bold text-lg leading-none">{post.votes}</span>
                                    </div>
                                    <div className={`flex flex-col items-center px-2 py-1.5 rounded-lg border text-xs font-medium w-full ${post.isSolved
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-white/5 text-slate-400 border-white/5'
                                        }`}>
                                        <MessageSquare className="h-3.5 w-3.5 mb-1 opacity-70" />
                                        <span>{post.replies.length}</span>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 leading-tight">
                                            {post.title}
                                        </h3>
                                        {post.isSolved && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20 whitespace-nowrap">
                                                <CheckCircle2 className="h-3 w-3" /> Resuelto
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px] text-slate-400 group-hover:border-orange-500/20 group-hover:text-slate-300 transition-colors">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <img src={post.authorAvatar} alt={post.author} className="h-5 w-5 rounded-full ring-1 ring-white/10" />
                                            <span className="text-orange-400 font-medium hover:underline">{post.author}</span>
                                            <span>•</span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={1} onPageChange={() => { }} />
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-[#1a1a1e] border border-white/10 p-6 rounded-2xl sticky top-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Search className="h-4 w-4 text-orange-500" /> Etiquetas Populares
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Blender', 'Unity', 'C#', 'UV Mapping', 'ZBrush', 'Python', 'Render'].map(tag => (
                                <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 text-sm text-slate-400 transition-colors cursor-pointer border border-white/5 hover:border-orange-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="font-bold text-orange-400 mb-3 text-sm uppercase tracking-wider">Reglas Rápidas</h3>
                            <ul className="text-sm text-slate-400 space-y-3 pl-4">
                                <li className="list-disc marker:text-orange-500/50">Sé respetuoso con otros artistas.</li>
                                <li className="list-disc marker:text-orange-500/50">Busca antes de preguntar.</li>
                                <li className="list-disc marker:text-orange-500/50">Incluye capturas si puedes.</li>
                                <li className="list-disc marker:text-orange-500/50">Marca la mejor respuesta.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
