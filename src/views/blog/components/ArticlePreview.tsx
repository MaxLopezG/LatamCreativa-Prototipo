import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Eye, CheckCircle2 } from 'lucide-react';

/**
 * Representa un bloque de contenido en el artículo
 */
export interface ContentBlock {
    id: string;
    type: 'text' | 'image' | 'video';
    content: string;
}

/**
 * Props para el componente ArticlePreview
 */
interface ArticlePreviewProps {
    /** Título del artículo */
    title: string;
    /** Categoría del artículo */
    category: string;
    /** Tags del artículo */
    tags: string[];
    /** URL de imagen de portada */
    coverImage: string | null;
    /** Bloques de contenido */
    blocks: ContentBlock[];
    /** Info del autor */
    user: {
        name?: string;
        avatar?: string;
    } | null;
    /** Función para convertir URLs a links */
    linkifyText: (html: string) => string;
    /** Función para extraer ID de YouTube de URL */
    getYoutubeId: (url: string) => string | null;
}

/**
 * Componente de vista previa que renderiza un artículo exactamente como aparecerá al publicarse.
 * Usado en CreateArticleView para mostrar preview en vivo mientras se edita.
 */
export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
    title,
    category,
    tags,
    coverImage,
    blocks,
    user,
    linkifyText,
    getYoutubeId
}) => {
    return (
        <div className="max-w-[1800px] mx-auto transition-colors animate-fade-in pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-10 py-10 relative">

                {/* Left Sidebar - Actions Preview (disabled) */}
                <aside className="hidden lg:flex lg:col-span-1 flex-col items-center gap-6 sticky top-24 h-fit">
                    <div className="flex flex-col gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-sm w-full items-center">
                        <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                            <Heart className="h-5 w-5" />
                            <span className="text-xs font-bold mt-1 block">0</span>
                        </div>
                        <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-xs font-bold mt-1 block">0</span>
                        </div>
                        <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                            <Share2 className="h-5 w-5" />
                        </div>
                        <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                            <Bookmark className="h-5 w-5" />
                        </div>
                    </div>
                </aside>

                {/* Center Column - Article Content */}
                <article className="lg:col-span-8 lg:px-8">
                    <div className="mb-10 text-center lg:text-left">
                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
                            {category || 'Sin categoría'}
                        </span>
                        <span className="text-slate-500 text-sm mx-2">•</span>
                        <span className="text-slate-400 text-sm font-medium inline-flex items-center gap-1">
                            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 font-display">
                        {title || 'Sin Título'}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-6 border-y border-white/10 py-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/10">
                                <img
                                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'}
                                    alt="Author"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-lg text-white leading-none">{user?.name || 'Usuario'}</h3>
                                    <CheckCircle2 className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                                </div>
                                <span className="text-xs text-slate-400 font-medium">Vista previa</span>
                            </div>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="text-sm text-slate-400 italic">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cover Image */}
                    {coverImage && (
                        <div className="mb-12 rounded-3xl overflow-hidden aspect-video shadow-2xl">
                            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Content Blocks */}
                    <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-loose">
                        {blocks.map((block) => (
                            <div key={block.id} className="my-6">
                                {block.type === 'text' && (
                                    <div
                                        className="text-lg leading-relaxed font-serif whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ __html: linkifyText(block.content) }}
                                    />
                                )}
                                {block.type === 'image' && block.content && (
                                    <div className="rounded-xl overflow-hidden my-8 shadow-lg">
                                        <img src={block.content} alt="Content" className="w-full" />
                                    </div>
                                )}
                                {block.type === 'video' && getYoutubeId(block.content) && (
                                    <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg my-8">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${getYoutubeId(block.content)}`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="border-none"
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </article>

                {/* Right Sidebar - Preview Notice */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <Eye className="h-8 w-8 text-rose-500 mx-auto mb-3" />
                        <h4 className="font-bold text-white mb-2">Vista Previa</h4>
                        <p className="text-sm text-slate-400">Este es cómo se verá tu artículo cuando se publique.</p>
                    </div>
                </aside>

            </div>
        </div>
    );
};
