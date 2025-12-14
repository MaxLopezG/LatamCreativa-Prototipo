
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare, Heart, Share2, Bookmark, CheckCircle2, ThumbsUp, Edit, Trash2, UserPlus, UserCheck } from 'lucide-react';

import { useArticle, useDeleteArticle, useRecommendedArticles, useSubscription, useArticleLike } from '../../hooks/useFirebase';
import { useAppStore } from '../../hooks/useAppStore';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { CommentsSection } from './components/CommentsSection';

interface BlogPostViewProps {
    articleId?: string;
    onBack: () => void;
    onAuthorClick?: (author: string | { name: string; avatar?: string; id?: string }) => void;
    onArticleSelect: (id: string) => void;
    onSave?: (id: string, image: string, type: string) => void;
    onShare?: () => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ articleId, onBack, onAuthorClick, onArticleSelect, onSave, onShare }) => {
    const { id: paramId } = useParams<{ id: string }>();
    const id = articleId || paramId;
    const { state, actions } = useAppStore();
    const navigate = useNavigate();

    const { article, loading: articleLoading } = useArticle(id);

    const { deletePost, loading: isDeleting } = useDeleteArticle();
    const { articles: recArticles } = useRecommendedArticles(id || '');

    const { isLiked, initialIsLiked, toggleLike } = useArticleLike(article?.id, state.user?.id);
    const { isSubscribed, loading: subLoading, toggleSubscription, subscriberCount } = useSubscription(article?.authorId || '', state.user?.id);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!article) return;
        try {
            await deletePost(article.id);
            actions.showToast('Artículo eliminado correctamente', 'success');
            setIsDeleteModalOpen(false);
            onBack();
        } catch (error) {
            console.error("Error caught in handleDelete:", error);
            actions.showToast('Error al eliminar el artículo', 'error');
            setIsDeleteModalOpen(false);
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

    return (
        <div className="max-w-[1800px] mx-auto transition-colors animate-fade-in pb-20">
            {/* Top Navigation Bar */}
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
                            onClick={toggleLike}
                            className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${isLiked
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                                : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'
                                }`}
                            title="Me gusta"
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-xs font-bold mt-1 block">{(article.likes || 0) + (isLiked ? 1 : 0) - (initialIsLiked ? 1 : 0)}</span>
                        </button>

                        <button
                            onClick={() => {
                                document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors flex flex-col items-center gap-1"
                            title="Ver Comentarios"
                        >
                            <MessageSquare className="h-5 w-5" />
                            <span className="text-xs font-bold mt-1 block">{article.comments || 0}</span>
                        </button>

                        <button
                            onClick={() => onSave?.(article.id, article.image, 'article')}
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
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                    className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                                    title="Eliminar Artículo"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                {/* Center Column - Article Content */}
                <article className="lg:col-span-8 lg:px-8">
                    <div className="mb-10 text-center lg:text-left">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                            {article.category}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-sm mx-2">•</span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-8 font-display">
                        {article.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-6 border-y border-slate-200 dark:border-white/10 py-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-white/10 cursor-pointer hover:ring-amber-500 transition-all"
                                onClick={() => {
                                    const cleanName = typeof article.author === 'object' ? (article.author as any).name || 'Unknown' : String(article.author);
                                    const cleanId = typeof article.authorId === 'object' ? (article.authorId as any).id || (article.authorId as any).uid : String(article.authorId || 'unknown');
                                    onAuthorClick?.({ name: cleanName, avatar: article.authorAvatar, id: cleanId });
                                }}
                            >
                                <img src={article.authorAvatar} alt={String(article.author)} className="h-full w-full object-cover" />
                            </div>

                            <div className="flex flex-col">
                                <div
                                    className="flex items-center gap-1.5 cursor-pointer group"
                                    onClick={() => {
                                        const cleanName = typeof article.author === 'object' ? (article.author as any).name || 'Unknown' : String(article.author);
                                        const cleanId = typeof article.authorId === 'object' ? (article.authorId as any).id || (article.authorId as any).uid : String(article.authorId || 'unknown');
                                        onAuthorClick?.({ name: cleanName, avatar: article.authorAvatar, id: cleanId });
                                    }}
                                >
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-none group-hover:text-amber-500 transition-colors">
                                        {typeof article.author === 'object' ? (article.author as any).name || String(article.author) : article.author}
                                    </h3>
                                    <CheckCircle2 className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subscriberCount} seguidores</span>
                            </div>

                            {!isAuthor && (
                                <button
                                    onClick={toggleSubscription}
                                    disabled={subLoading}
                                    className={`ml-4 h-10 px-6 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl ${isSubscribed
                                        ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 hover:shadow-amber-500/30'
                                        } ${subLoading ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'} `}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <UserCheck className="h-4 w-4" />
                                            Siguiendo
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            Seguir
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="lg:hidden flex items-center gap-3">
                            <button
                                onClick={toggleLike}
                                className={`p-2 rounded-full ${isLiked ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 bg-slate-100 dark:bg-white/5'}`}
                            >
                                <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-full text-slate-500 bg-slate-100 dark:bg-white/5">
                                <Share2 className="h-5 w-5" />
                            </button>
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
                                                ></iframe>
                                            </div>
                                        );
                                    }

                                    if (block.trim().match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i)) {
                                        return (
                                            <img key={index} src={block.trim()} alt="Article content" className="w-full rounded-xl my-6 shadow-md" />
                                        );
                                    }

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
                    </div>

                    <div className="flex flex-wrap gap-2 mt-12 mb-16 pt-8 border-t border-slate-200 dark:border-white/10">
                        {(article.tags && article.tags.length > 0 ? article.tags : []).map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-amber-500/10 hover:text-amber-500 cursor-pointer transition-colors border border-transparent hover:border-amber-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <CommentsSection articleId={article.id} />
                </article>

                {/* Right Sidebar - Recommended */}
                <aside className="lg:col-span-3 space-y-10">
                    <div className="sticky top-24">
                        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
                                Recomendados
                            </h3>

                            <div className="flex flex-col gap-6">
                                {recArticles.map((item) => (
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
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Artículo"
                message="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
                loading={isDeleting}
            />
        </div>
    );
};
