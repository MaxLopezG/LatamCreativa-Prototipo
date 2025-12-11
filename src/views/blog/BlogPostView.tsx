
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, CheckCircle2, ThumbsUp, ThumbsDown, Edit, Loader2, Send, X, UserPlus, UserCheck } from 'lucide-react';
import { BLOG_ITEMS } from '../../data/content';
import { useArticle, useDeleteArticle, useComments, useAddComment, useCommentActions, useRecommendedArticles, useSubscription, useArticleLike } from '../../hooks/useFirebase';
import { useAppStore } from '../../hooks/useAppStore';
import { Trash2 } from 'lucide-react';
import { BlogComment } from '../../types';

// ... (rest of imports are fine, just ensuring useCommentActions is imported)

// ... (BlogPostView component unchanged)

interface CommentItemProps {
    comment: BlogComment;
    articleId: string;
    currentUserId?: string;
    onReply: (parentId: string, content: string) => void;
    onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    articleId,
    currentUserId,
    onReply,
    onDelete
}) => {
    const { like, update, remove } = useCommentActions();
    // We don't need useAddComment here, as onReply will handle the submission to the parent.

    const [isEditing, setIsEditing] = useState(false);
    const [isReplyingOpen, setIsReplyingOpen] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');
    const [optimisticLikes, setOptimisticLikes] = useState(comment.likes);
    const [hasLiked, setHasLiked] = useState(false);
    const isOwner = currentUserId === comment.author;

    const handleLike = () => {
        if (hasLiked) return;
        setOptimisticLikes(prev => prev + 1);
        setHasLiked(true);
        like(articleId, comment.id);
    };

    const handleSaveEdit = async () => {
        if (editContent.trim() === '') return;
        await update(articleId, comment.id, editContent);
        setIsEditing(false);
        comment.content = editContent;
    };

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de eliminar este comentario?')) {
            await remove(articleId, comment.id);
            onDelete(comment.id);
        }
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || !currentUserId) return;

        // Call the onReply prop passed from the parent (CommentsSection)
        onReply(comment.id, replyContent);
        setReplyContent('');
        setIsReplyingOpen(false);
    };

    return (
        <div className="flex gap-4 group animate-fade-in relative">
            <div className={`shrink-0 ${comment.parentId ? 'w-8 h-8' : 'w-12 h-12'}`}>
                <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-full h-full rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-slate-900 dark:text-white ${comment.parentId ? 'text-xs' : 'text-sm'}`}>
                            {comment.author}
                        </h4>
                        <span className="text-xs text-slate-500">• {new Date(comment.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    {isOwner && !isEditing && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                title="Editar"
                            >
                                <Edit className="h-3 w-3" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="mb-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1.5 text-xs font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                        {comment.content}
                    </p>
                )}

                <div className="flex items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-amber-500' : 'hover:text-amber-500'}`}
                    >
                        <ThumbsUp className={`h-3.5 w-3.5 ${hasLiked ? 'fill-current' : ''}`} /> {optimisticLikes || 0}
                    </button>
                    <button
                        onClick={() => setIsReplyingOpen(!isReplyingOpen)}
                        className="hover:text-amber-500 transition-colors"
                    >
                        Responder
                    </button>
                </div>

                {/* Reply Input */}
                {isReplyingOpen && (
                    <div className="mt-4 flex gap-3 animate-fade-in">
                        <div className="flex-1">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Responder a ${comment.author}...`}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500 min-h-[80px]"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => setIsReplyingOpen(false)}
                                    className="px-3 py-1.5 text-xs font-bold text-slate-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={!replyContent.trim()}
                                    className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                                >
                                    Responder
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 space-y-6 pl-4 border-l-2 border-slate-100 dark:border-white/5">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                articleId={articleId}
                                currentUserId={currentUserId}
                                onReply={onReply} // Pass the onReply handler down for nested replies
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CommentsSection = ({ articleId }: { articleId: string }) => {
    const { comments: flatComments, loading, refresh, removeComment } = useComments(articleId);
    const { add, loading: isAdding } = useAddComment();
    const { state, actions } = useAppStore();
    const [newComment, setNewComment] = useState('');

    // Build tree
    const commentTree = React.useMemo(() => {
        const map = new Map<string, BlogComment>();
        const roots: BlogComment[] = [];

        // First pass: create copies and map them, ensuring replies array exists
        flatComments.forEach(c => {
            map.set(c.id, { ...c, replies: [] });
        });

        // Second pass: link them
        flatComments.forEach(c => {
            const comment = map.get(c.id)!;
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId)!.replies!.push(comment);
            } else {
                roots.push(comment);
            }
        });

        // Sort roots by date (newest first, assuming flatComments are already sorted this way)
        // If not, you might want to add a sort here: roots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // For replies, usually we want oldest first (conversation flow)
        // For this example, we'll assume the order from flatComments is sufficient for replies too.
        return roots;
    }, [flatComments]);

    const handleAddComment = async (parentId?: string, content?: string) => {
        const textToSubmit = content || newComment;

        if (!state.user) {
            actions.showToast("Debes iniciar sesión para comentar", "info");
            return;
        }

        if (!textToSubmit.trim()) return;

        try {
            await add(articleId, {
                author: state.user.name,
                avatar: state.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop',
                content: textToSubmit,
                parentId: parentId
            });
            if (!parentId) setNewComment(''); // Clear main comment input only
            refresh(); // Refresh all comments to show the new one
        } catch (error) {
            console.error(error);
            actions.showToast("Error al publicar el comentario", "error");
        }
    };

    return (
        <section id="comments-section" className="bg-slate-50 dark:bg-white/[0.02] -mx-6 md:-mx-10 px-6 md:px-10 py-12 border-t border-slate-200 dark:border-white/5 rounded-3xl">
            <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-amber-500" />
                    Comentarios <span className="text-lg font-normal text-slate-500">({flatComments.length})</span>
                </h3>

                {/* Main Comment Input */}
                <div className="flex gap-4 mb-12">
                    <img
                        src={state.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop"}
                        alt="User"
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div className="flex-1">
                        <div className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Comparte tu opinión..."
                                className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 min-h-[120px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none shadow-sm"
                            ></textarea>
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <button
                                    onClick={() => handleAddComment()}
                                    disabled={isAdding || !newComment.trim()}
                                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Publicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                        </div>
                    ) : flatComments.length === 0 ? (
                        <p className="text-center text-slate-500 italic">Sé el primero en comentar.</p>
                    ) : (
                        commentTree.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                articleId={articleId}
                                currentUserId={state.user?.name}
                                onReply={(parentId, content) => handleAddComment(parentId, content)}
                                onDelete={removeComment}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

interface BlogPostViewProps {
    articleId?: string;
    onBack: () => void;
    onAuthorClick?: (author: string | { name: string; avatar?: string; id?: string }) => void;
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
    const { article: fetchedArticle, loading: articleLoading } = useArticle(id);

    // Fallback/Merge logic for missing authorId (critical for Follow button)
    const article = React.useMemo(() => {
        if (!fetchedArticle) return null;

        if (!fetchedArticle.authorId) {
            const staticArticle = BLOG_ITEMS.find(i => i.id === id);
            if (staticArticle?.authorId) {
                return { ...fetchedArticle, authorId: staticArticle.authorId };
            }
            // Fallback generator if even static is missing
            if (fetchedArticle.author) {
                const generatedId = fetchedArticle.author.toLowerCase().replace(/\s+/g, '_');
                return { ...fetchedArticle, authorId: generatedId };
            }
        }
        return fetchedArticle;
    }, [fetchedArticle, id]);
    const { deletePost, loading: isDeleting } = useDeleteArticle();
    const { articles: recArticles, loading: relatedLoading } = useRecommendedArticles(id || '');

    // Persisted Like Hook
    const { isLiked, toggleLike } = useArticleLike(article?.id, state.user?.id);

    // Subscription Hook
    const { isSubscribed, loading: subLoading, toggleSubscription, subscriberCount } = useSubscription(article?.authorId || '', state.user?.id);

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
                            onClick={toggleLike}
                            className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${isLiked
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                                : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'
                                }`}
                            title="Me gusta"
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-xs font-bold mt-1 block">{article.likes + (isLiked ? 1 : 0)}</span>
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

                            {/* Mobile only actions row, visible on small screens */}
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

                    <CommentsSection articleId={article.id} />
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
                </aside >

            </div >
        </div >
    );
};


