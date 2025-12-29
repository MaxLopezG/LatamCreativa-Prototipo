/**
 * ThreadView - Single Thread Page
 * 
 * Página de un hilo individual con sus respuestas.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Heart,
    Eye,
    MessageSquare,
    Clock,
    Share2,
    Flag,
    MoreVertical,
    Edit2,
    Trash2,
    Pin,
    Lock,
    CheckCircle2,
    Loader2,
    AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import {
    useForumThread,
    useForumReplies,
    useAddReply,
    useThreadLike,
    useThreadModeration,
    useReplyActions,
    useDeleteThread
} from '../../hooks/useForumHooks';
import { useAuthorInfo } from '../../hooks/useAuthorInfo';
import { ReplyCard, ForumEditor, ForumStats } from '../../components/forum';
import { getCategoryById, CATEGORY_COLOR_CLASSES } from '../../data/forumCategories';
import { ReplySortOption } from '../../types/forum';

interface ThreadViewProps {
    threadId?: string;
    onBack?: () => void;
}

/**
 * Calcula el tiempo transcurrido desde una fecha
 */
function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `hace ${diffMins} minutos`;
    if (diffHours < 24) return `hace ${diffHours} horas`;
    if (diffDays < 30) return `hace ${diffDays} días`;
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Detecta si el contenido es HTML (del editor WYSIWYG)
 */
function isHtmlContent(content: string): boolean {
    // Check for common HTML tags from TipTap
    return /<(p|div|h[1-6]|ul|ol|li|blockquote|img|a|strong|em|code|pre)[^>]*>/i.test(content);
}

/**
 * Renderiza contenido HTML (del editor WYSIWYG)
 */
function renderHtmlContent(content: string): React.ReactNode {
    return (
        <div
            className="prose prose-invert prose-sm max-w-none text-gray-300
                       prose-p:mb-3 prose-p:leading-relaxed
                       prose-headings:text-white prose-headings:font-semibold
                       prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-white prose-strong:font-semibold
                       prose-code:bg-black/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-400 prose-code:text-sm
                       prose-pre:bg-black/40 prose-pre:rounded-lg prose-pre:p-4
                       prose-img:max-w-full prose-img:rounded-lg prose-img:my-2
                       prose-blockquote:border-l-4 prose-blockquote:border-purple-500/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
                       prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

/**
 * Renderiza contenido Markdown (del editor Markdown para programación)
 */
function renderMarkdownContent(content: string): React.ReactNode {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';

    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={`code-${index}`} className="bg-black/40 rounded-lg p-4 my-3 overflow-x-auto">
                        <code className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                            {codeContent.trim()}
                        </code>
                    </pre>
                );
                codeContent = '';
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
        } else if (inCodeBlock) {
            codeContent += line + '\n';
        } else {
            // Process inline formatting
            let processedLine = line
                // Images
                .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2 inline-block" />')
                // Links
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-400 hover:underline" target="_blank" rel="noopener">$1</a>')
                // Bold
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                // Italic
                .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
                // Inline code
                .replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1.5 py-0.5 rounded text-purple-400 text-sm font-mono">$1</code>');

            // Handle quotes
            if (line.startsWith('> ')) {
                processedLine = `<span class="border-l-4 border-purple-500/50 pl-4 italic text-gray-400 block">${processedLine.slice(2)}</span>`;
            }

            // Handle list items
            if (line.startsWith('- ')) {
                processedLine = `<span class="block ml-4">• ${processedLine.slice(2)}</span>`;
            }

            if (line.trim()) {
                elements.push(
                    <p
                        key={index}
                        className="text-gray-300 mb-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: processedLine }}
                    />
                );
            } else {
                elements.push(<br key={index} />);
            }
        }
    });

    return elements;
}

/**
 * Renderiza contenido - detecta automáticamente HTML vs Markdown
 */
function renderContent(content: string): React.ReactNode {
    if (isHtmlContent(content)) {
        return renderHtmlContent(content);
    }
    return renderMarkdownContent(content);
}

export const ThreadView: React.FC<ThreadViewProps> = ({ threadId: propThreadId, onBack }) => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { state } = useAppStore();

    const threadSlugOrId = propThreadId || slug || '';

    // State
    const [replySort, setReplySort] = useState<ReplySortOption>('oldest');
    const [replyContent, setReplyContent] = useState('');
    const [showThreadMenu, setShowThreadMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [replyToId, setReplyToId] = useState<string | null>(null);

    // Hooks
    const { thread, loading: threadLoading, error: threadError } = useForumThread(threadSlugOrId);
    const { replies, loading: repliesLoading, refresh: refreshReplies } = useForumReplies(thread?.id, replySort);
    const { addReply, loading: addingReply } = useAddReply();
    const { liked, toggleLike, loading: likeLoading } = useThreadLike(thread?.id, state.user?.uid);
    const { markBestAnswer, close, pin, loading: moderationLoading } = useThreadModeration();
    const { remove: removeReply } = useReplyActions();
    const { deleteThread, loading: deletingThread } = useDeleteThread();

    // Category info
    const category = thread ? getCategoryById(thread.category) : null;
    const colorClasses = CATEGORY_COLOR_CLASSES[category?.color || 'gray'];

    // Live author lookup - fetches current name/avatar from user profile
    const { authorName, authorUsername, authorAvatar } = useAuthorInfo(
        thread?.authorId,
        thread?.authorName,
        thread?.authorAvatar
    );

    // Permissions
    const isAuthor = state.user?.uid === thread?.authorId;
    const isAdmin = state.user?.isAdmin;
    const canModerate = isAuthor || isAdmin;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/forum');
        }
    };

    const handleSubmitReply = async () => {
        if (!thread || !replyContent.trim()) return;

        const result = await addReply(thread.id, replyContent, replyToId || undefined);
        if (result) {
            setReplyContent('');
            setReplyToId(null);
            refreshReplies();
        }
    };

    const handleDeleteThread = async () => {
        if (!thread) return;

        setShowDeleteConfirm(false); // Close modal immediately
        const success = await deleteThread(thread.id);
        if (success) {
            navigate('/forum');
        } else {
            // Re-show modal if failed
            setShowDeleteConfirm(true);
        }
    };

    const handleMarkBestAnswer = async (replyId: string, isBest: boolean) => {
        if (!thread) return;
        await markBestAnswer(thread.id, replyId, isBest);
        refreshReplies();
    };

    const handleDeleteReply = async (replyId: string) => {
        if (!thread) return;
        await removeReply(thread.id, replyId);
        refreshReplies();
    };

    const handleShareThread = () => {
        if (navigator.share && thread) {
            navigator.share({
                title: thread.title,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // Could show a toast here
        }
    };

    // Loading state
    if (threadLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            </div>
        );
    }

    // Error or not found
    if (threadError || !thread) {
        return (
            <div className="text-center py-24">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Hilo no encontrado</h2>
                <p className="text-gray-400 mb-6">El hilo que buscas no existe o fue eliminado</p>
                <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                >
                    Volver al foro
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12 px-4 md:px-8 lg:px-12 pt-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Foro
                </button>
                <span>/</span>
                <button
                    onClick={() => navigate(`/forum/categoria/${category?.slug || thread.category}`)}
                    className="hover:text-white transition-colors"
                >
                    {category?.name || thread.category}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Thread Header */}
                    <article className="bg-[#1a1a2e]/60 border border-white/5 rounded-xl overflow-hidden">
                        {/* Badges */}
                        <div className="flex items-center gap-2 px-6 pt-5 pb-3">
                            {thread.isPinned && (
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                    <Pin className="w-3 h-3" />
                                    Fijado
                                </span>
                            )}
                            {thread.isClosed && (
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                                    <Lock className="w-3 h-3" />
                                    Cerrado
                                </span>
                            )}
                            {thread.isResolved && (
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Resuelto
                                </span>
                            )}
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`}>
                                {category?.name || thread.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white px-6 mb-4">
                            {thread.title}
                        </h1>

                        {/* Author */}
                        <div className="flex items-center justify-between px-6 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <img
                                    src={authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff`}
                                    alt={authorName}
                                    onClick={() => authorUsername && navigate(`/user/${authorUsername}`)}
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            onClick={() => authorUsername && navigate(`/user/${authorUsername}`)}
                                            className="text-white font-medium hover:text-purple-400 cursor-pointer transition-colors"
                                        >
                                            {authorName}
                                        </span>
                                        {thread.authorRole && (
                                            <span className="text-xs text-gray-500">
                                                {thread.authorRole}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {getTimeAgo(thread.createdAt)}
                                        {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
                                            <span>(editado)</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Thread Actions Menu */}
                            {state.user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowThreadMenu(!showThreadMenu)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {showThreadMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowThreadMenu(false)}
                                            />
                                            <div className="absolute right-0 top-10 z-20 w-52 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                                {isAuthor && (
                                                    <button
                                                        onClick={() => { navigate(`/forum/edit/${thread.id}`); setShowThreadMenu(false); }}
                                                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        Editar hilo
                                                    </button>
                                                )}
                                                {canModerate && (
                                                    <>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => { pin(thread.id, !thread.isPinned); setShowThreadMenu(false); }}
                                                                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                            >
                                                                <Pin className="w-4 h-4" />
                                                                {thread.isPinned ? 'Desfijar' : 'Fijar hilo'}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => { close(thread.id, !thread.isClosed); setShowThreadMenu(false); }}
                                                            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                        >
                                                            <Lock className="w-4 h-4" />
                                                            {thread.isClosed ? 'Abrir hilo' : 'Cerrar hilo'}
                                                        </button>
                                                    </>
                                                )}
                                                {isAuthor && (
                                                    <button
                                                        onClick={() => { setShowDeleteConfirm(true); setShowThreadMenu(false); }}
                                                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Eliminar hilo
                                                    </button>
                                                )}
                                                {!isAuthor && (
                                                    <button
                                                        onClick={() => { setShowReportModal(true); setShowThreadMenu(false); }}
                                                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                        Reportar
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="px-6 py-5">
                            {renderContent(thread.content)}
                        </div>

                        {/* Tags */}
                        {thread.tags && thread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-6 pb-4">
                                {thread.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/20">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleLike}
                                    disabled={likeLoading || !state.user}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${liked
                                        ? 'bg-pink-500/20 text-pink-400'
                                        : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                                        } ${!state.user ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                                    <span>{thread.likes}</span>
                                </button>
                                <span className="flex items-center gap-1.5 px-3 py-2 text-gray-400">
                                    <Eye className="w-5 h-5" />
                                    <span>{thread.views}</span>
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-2 text-gray-400">
                                    <MessageSquare className="w-5 h-5" />
                                    <span>{thread.replies}</span>
                                </span>
                            </div>
                            <button
                                onClick={handleShareThread}
                                className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Compartir
                            </button>
                        </div>
                    </article>

                    {/* Replies Section */}
                    <div className="space-y-4">
                        {/* Replies Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">
                                {thread.replies} {thread.replies === 1 ? 'Respuesta' : 'Respuestas'}
                            </h2>
                            <select
                                value={replySort}
                                onChange={(e) => setReplySort(e.target.value as ReplySortOption)}
                                className="px-3 py-2 bg-[#1a1a2e]/60 border border-white/10 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-purple-500"
                            >
                                <option value="oldest">Más antiguos</option>
                                <option value="newest">Más recientes</option>
                                <option value="likes">Más votados</option>
                            </select>
                        </div>

                        {/* Replies List */}
                        {repliesLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                            </div>
                        ) : replies.length === 0 ? (
                            <div className="text-center py-12 bg-[#1a1a2e]/40 rounded-xl border border-white/5">
                                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">
                                    No hay respuestas aún. ¡Sé el primero en responder!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {replies.map(reply => (
                                    <ReplyCard
                                        key={reply.id}
                                        reply={reply}
                                        threadAuthorId={thread.authorId}
                                        isThreadAuthor={isAuthor}
                                        onMarkBestAnswer={isAuthor ? handleMarkBestAnswer : undefined}
                                        onDelete={
                                            (state.user?.uid === reply.authorId || isAuthor)
                                                ? handleDeleteReply
                                                : undefined
                                        }
                                        onReply={!thread.isClosed ? setReplyToId : undefined}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Reply Editor */}
                        {state.user && !thread.isClosed ? (
                            <div className="mt-6">
                                {replyToId && (
                                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                                        <span>Respondiendo a un comentario</span>
                                        <button
                                            onClick={() => setReplyToId(null)}
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                                <ForumEditor
                                    value={replyContent}
                                    onChange={setReplyContent}
                                    placeholder="Escribe tu respuesta..."
                                    minHeight="120px"
                                    onSubmit={handleSubmitReply}
                                    submitLabel="Responder"
                                    isSubmitting={addingReply}
                                />
                            </div>
                        ) : thread.isClosed ? (
                            <div className="text-center py-6 bg-[#1a1a2e]/40 rounded-xl border border-white/5">
                                <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-400">Este hilo está cerrado y no acepta nuevas respuestas.</p>
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-[#1a1a2e]/40 rounded-xl border border-white/5">
                                <p className="text-gray-400">
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className="text-purple-400 hover:text-purple-300"
                                    >
                                        Inicia sesión
                                    </button>
                                    {' '}para responder a este hilo
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <ForumStats showRecentThreads={true} />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-3">¿Eliminar hilo?</h3>
                        <p className="text-gray-400 mb-6">
                            Esta acción no se puede deshacer. Se eliminarán todas las respuestas asociadas.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteThread}
                                disabled={deletingThread}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deletingThread ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreadView;
