
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, CheckCircle2, ThumbsUp, ThumbsDown, Edit } from 'lucide-react';
import { BLOG_ITEMS, COMMENTS } from '../data/content';
import { useArticle, useDeleteArticle } from '../hooks/useFirebase';
import { useAppStore } from '../hooks/useAppStore';
import { Trash2 } from 'lucide-react';

interface BlogPostViewProps {
    articleId?: string;
    onBack: () => void;
    onAuthorClick?: (authorName: string) => void;
    onArticleSelect: (id: string) => void;
    onSave?: (id: string, image: string) => void;
    onShare?: () => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ articleId, onBack, onAuthorClick, onArticleSelect, onSave, onShare }) => {
    const { id: paramId } = useParams<{ id: string }>();
    const id = articleId || paramId;
    const { state, actions } = useAppStore();
    const navigate = useNavigate();

    // Use hook to fetch single article
    const { article, loading: articleLoading } = useArticle(id);
    const { deletePost, loading: isDeleting } = useDeleteArticle();

    // Fetch some articles for related (optional, or keep static)
    // For now, let's keep static related articles or fetch "latest"
    const relatedArticles = BLOG_ITEMS.filter(item => item.id !== id).slice(0, 3);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [userReaction, setUserReaction] = useState<'none' | 'liked' | 'disliked'>('none');

    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDelete = async () => {
        if (!article) return;

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            setTimeout(() => setIsConfirmingDelete(false), 3000); // Reset after 3s if not confirmed
            return;
        }

        try {
            await deletePost(article.id);
            actions.showToast('Artículo eliminado correctamente', 'success');
            onBack();
        } catch (error) {
            console.error("Error caught in handleDelete:", error);
            actions.showToast('Error al eliminar el artículo', 'error');
            setIsConfirmingDelete(false);
        }
    };

    if (articleLoading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando artículo...</div>;
    }

    if (!article) {
        return <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4">
            <p>Artículo no encontrado</p>
            <button onClick={onBack} className="text-amber-500 hover:underline">Volver</button>
        </div>;
    }

    const isAuthor = state.user?.name === article.author;

    // article is now the dynamic data


    return (

        <div className="max-w-[1800px] mx-auto transition-colors animate-fade-in pb-20">

            {/* Top Navigation Bar - Minimal */}
            <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 py-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Blog
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-10 py-10 relative">

                {/* Left Sidebar - Actions (Sticky) */}
                <aside className="hidden lg:flex lg:col-span-1 flex-col items-center gap-6 sticky top-24 h-fit">
                    <div className="flex flex-col gap-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-full items-center">
                        <button
                            onClick={() => setUserReaction(userReaction === 'liked' ? 'none' : 'liked')}
                            className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${userReaction === 'liked'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                                : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'
                                }`}
                            title="Me gusta"
                        >
                            <Heart className={`h-5 w-5 ${userReaction === 'liked' ? 'fill-current' : ''}`} />
                            <span className="text-xs font-bold mt-1 block">{article.likes + (userReaction === 'liked' ? 1 : 0)}</span>
                        </button>

                        <button
                            onClick={() => {
                                document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors flex flex-col items-center gap-1"
                            title="Ver Comentarios"
                        >
                            <MessageSquare className="h-5 w-5" />
                            <span className="text-xs font-bold mt-1 block">{COMMENTS.length}</span>
                        </button>

                        <button
                            onClick={() => onSave?.(article.id, article.image)}
                            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
                            title="Guardar"
                        >
                            <Bookmark className="h-5 w-5" />
                        </button>

                        <button
                            onClick={onShare}
                            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                            title="Compartir"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>

                        {isAuthor && (
                            <>
                                <div className="h-px w-8 bg-slate-200 dark:bg-white/10 my-1" />

                                <button
                                    onClick={() => navigate(`/create/article?edit=${article.id}`)}
                                    className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                                    title="Editar Artículo"
                                >
                                    <Edit className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={`p-3 rounded-xl transition-all ${isConfirmingDelete
                                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg ring-2 ring-red-300 dark:ring-red-900'
                                        : 'hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500'
                                        }`}
                                    title={isConfirmingDelete ? "Click para confirmar eliminar" : "Eliminar Artículo"}
                                >
                                    {isConfirmingDelete ? (
                                        <span className="text-[10px] font-bold">¿?</span>
                                    ) : (
                                        <Trash2 className="h-5 w-5" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                {/* Center Column - Article Content */}
                <article className="lg:col-span-8 lg:px-8">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                                {article.category}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-sm">•</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {article.readTime} de lectura
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-8 font-display">
                            {article.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-6 border-y border-slate-200 dark:border-white/10 py-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-white/10 cursor-pointer hover:ring-amber-500 transition-all"
                                    onClick={() => onAuthorClick?.(article.author)}
                                >
                                    <img src={article.authorAvatar} alt={article.author} className="h-full w-full object-cover" />
                                </div>

                                <div className="flex flex-col">
                                    <div
                                        className="flex items-center gap-1.5 cursor-pointer group"
                                        onClick={() => onAuthorClick?.(article.author)}
                                    >
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-none group-hover:text-amber-500 transition-colors">{article.author}</h3>
                                        <CheckCircle2 className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">128K suscriptores</span>
                                </div>

                                {!isAuthor && (
                                    <button
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                        className={`ml-2 h-9 px-5 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg ${isSubscribed
                                            ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                                            : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105'
                                            }`}
                                    >
                                        {isSubscribed ? 'Suscrito' : 'Suscribirse'}
                                    </button>
                                )}
                            </div>

                            {/* Mobile only actions row, visible on small screens */}
                            <div className="lg:hidden flex items-center gap-3">
                                <button
                                    onClick={() => setUserReaction(userReaction === 'liked' ? 'none' : 'liked')}
                                    className={`p - 2 rounded - full ${userReaction === 'liked' ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 bg-slate-100 dark:bg-white/5'} `}
                                >
                                    <ThumbsUp className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full text-slate-500 bg-slate-100 dark:bg-white/5">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose">
                        {article.content ? (
                            (() => {
                                const getYoutubeId = (url: string) => {
                                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                    const match = url.match(regExp);
                                    return (match && match[2].length === 11) ? match[2] : null;
                                };

                                return article.content.split('\n\n').map((block, index) => {
                                    const youtubeId = getYoutubeId(block.trim());

                                    if (youtubeId) {
                                        return (
                                            <div key={index} className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg my-8">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                                    title="YouTube video player"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="border-none"
                                                ></iframe >
                                            </div >
                                        );
                                    }

                                    // Basic Image Detection (Text starting with http and ending with image extension)
                                    if (block.trim().match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i)) {
                                        return (
                                            <img key={index} src={block.trim()} alt="Article content" className="w-full rounded-xl my-6 shadow-md" />
                                        );
                                    }

                                    // Default Text
                                    return (
                                        <div
                                            key={index}
                                            className="mb-6 whitespace-pre-wrap font-serif"
                                            dangerouslySetInnerHTML={{ __html: block }}
                                        />
                                    );
                                });
                            })()
                        ) : (
                            <>
                                <p className="lead text-2xl font-serif text-slate-600 dark:text-slate-200 mb-8 border-l-4 border-amber-500 pl-6 italic">
                                    {article.excerpt}
                                </p>
                                <p>
                                    Este artículo está en proceso de redacción. Vuelve pronto para leer el contenido completo sobre {article.title}.
                                </p>
                            </>
                        )}
                    </div >

                    <div className="flex flex-wrap gap-2 mt-12 mb-16 pt-8 border-t border-slate-200 dark:border-white/10">
                        {['3D', 'Tutorial', 'Industria', 'Career'].map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-amber-500/10 hover:text-amber-500 cursor-pointer transition-colors border border-transparent hover:border-amber-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <section id="comments-section" className="bg-slate-50 dark:bg-white/[0.02] -mx-6 md:-mx-10 px-6 md:px-10 py-12 border-t border-slate-200 dark:border-white/5 rounded-3xl">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <MessageSquare className="h-6 w-6 text-amber-500" />
                                Comentarios <span className="text-lg font-normal text-slate-500">({COMMENTS.length})</span>
                            </h3>

                            <div className="flex gap-4 mb-12">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop"
                                    alt="User"
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                                />
                                <div className="flex-1">
                                    <div className="relative">
                                        <textarea
                                            placeholder="Comparte tu opinión..."
                                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 min-h-[120px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none shadow-sm"
                                        ></textarea>
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <button className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
                                                Publicar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {COMMENTS.map((comment) => (
                                    <div key={comment.id} className="flex gap-4 group">
                                        <div className="shrink-0">
                                            <img src={comment.avatar} alt={comment.author} className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{comment.author}</h4>
                                                    <span className="text-xs text-slate-500">• {comment.timeAgo}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">
                                                {comment.content}
                                            </p>
                                            <div className="flex items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <button className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
                                                    <ThumbsUp className="h-3.5 w-3.5" /> {comment.likes}
                                                </button>
                                                <button className="hover:text-amber-500 transition-colors">Responder</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </article >

                {/* Right Sidebar - Recommended (Sticky or Scrolling) */}
                < aside className="lg:col-span-3 space-y-10" >
                    <div className="sticky top-24">
                        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
                                Recomendados
                            </h3>

                            <div className="flex flex-col gap-6">
                                {relatedArticles.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => onArticleSelect(item.id)}
                                        className="group flex gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors"
                                    >
                                        <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-white/5 relative">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-1">
                                                {item.category}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {item.readTime} de lectura
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside >

            </div >
        </div >
    );
};
