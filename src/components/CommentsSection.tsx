import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Trash2, Send, Reply } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { timeAgo } from '../utils/helpers';
import { useAuthorInfo } from '../hooks/useAuthorInfo';

/**
 * Interfaz unificada de comentario que funciona con comentarios de Portfolio y Blog.
 * Maneja diferencias de nombres de campos entre los dos sistemas.
 */
interface Comment {
    id: string;
    authorId: string;
    authorName?: string;
    author?: string;
    authorUsername?: string;
    authorAvatar?: string;
    avatar?: string;
    text?: string;
    content?: string;
    createdAt?: string;
    date?: string;
    likes?: number;
    parentId?: string;
}

/**
 * Componente para mostrar info del autor con lookup en vivo
 */
interface AuthorDisplayProps {
    comment: Comment;
    onClick?: () => void;
    className?: string;
    avatarClassName?: string;
    nameClassName?: string;
    showAvatar?: boolean;
    showName?: boolean;
}

const AuthorDisplay: React.FC<AuthorDisplayProps> = ({
    comment,
    onClick,
    className = '',
    avatarClassName = 'h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all',
    nameClassName = 'font-bold text-slate-900 dark:text-white text-sm hover:text-amber-500 cursor-pointer',
    showAvatar = true,
    showName = true
}) => {
    // Live author lookup - fetches current name/avatar from user profile
    const { authorName, authorAvatar, authorUsername } = useAuthorInfo(
        comment.authorId,
        comment.authorName || comment.author,
        comment.authorAvatar || comment.avatar
    );

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    if (showAvatar && !showName) {
        return (
            <img
                src={authorAvatar || '/default-avatar.png'}
                alt={authorName || 'Usuario'}
                className={avatarClassName}
                onClick={handleClick}
            />
        );
    }

    if (showName && !showAvatar) {
        return (
            <span className={nameClassName} onClick={handleClick}>
                {authorName || 'Usuario'}
            </span>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {showAvatar && (
                <img
                    src={authorAvatar || '/default-avatar.png'}
                    alt={authorName || 'Usuario'}
                    className={avatarClassName}
                    onClick={handleClick}
                />
            )}
            {showName && (
                <span className={nameClassName} onClick={handleClick}>
                    {authorName || 'Usuario'}
                </span>
            )}
        </div>
    );
};

/**
 * Props para el componente CommentsSection
 */
interface CommentsSectionProps {
    /** Array de comentarios a mostrar */
    comments: Comment[];
    /** Si los comentarios están cargando */
    isLoading?: boolean;
    /** ID del autor del contenido (para permisos de eliminación) */
    contentAuthorId?: string;
    /** Callback para agregar un nuevo comentario */
    onAddComment: (text: string) => Promise<void>;
    /** Callback para eliminar un comentario */
    onDeleteComment: (commentId: string) => Promise<void>;
    /** Callback para alternar like en un comentario */
    onLikeComment: (commentId: string) => Promise<void>;
    /** Callback para agregar respuesta a un comentario */
    onAddReply: (parentId: string, text: string) => Promise<void>;
    /** Mapa de IDs de comentarios a estado de like */
    commentLikes: Record<string, boolean>;
}

/**
 * Componente reutilizable de sección de comentarios para publicaciones de Portfolio y Blog.
 * Incluye input, lista, likes, respuestas y funcionalidad de eliminación.
 */
export const CommentsSection: React.FC<CommentsSectionProps> = ({
    comments,
    isLoading = false,
    contentAuthorId,
    onAddComment,
    onDeleteComment,
    onLikeComment,
    onAddReply,
    commentLikes,
}) => {
    const navigate = useNavigate();
    const { state, actions } = useAppStore();

    const [newComment, setNewComment] = useState('');
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isAddingReply, setIsAddingReply] = useState(false);

    // Separate root comments and replies
    const rootComments = useMemo(() =>
        comments
            .filter(c => !c.parentId)
            .sort((a, b) =>
                new Date(b.createdAt || b.date || 0).getTime() -
                new Date(a.createdAt || a.date || 0).getTime()
            ),
        [comments]
    );

    const getReplies = (parentId: string) =>
        comments
            .filter(c => c.parentId === parentId)
            .sort((a, b) =>
                new Date(a.createdAt || a.date || 0).getTime() -
                new Date(b.createdAt || b.date || 0).getTime()
            );

    // Helpers to get text and date (keep these simple, author is handled by AuthorDisplay)
    const getText = (c: Comment) => c.text || c.content || '';
    const getDate = (c: Comment) => c.createdAt || c.date || '';

    const handleAddComment = async () => {
        if (!newComment.trim() || !state.user) {
            if (!state.user) actions.showToast('Inicia sesión para comentar', 'info');
            return;
        }
        setIsAddingComment(true);
        try {
            await onAddComment(newComment.trim());
            setNewComment('');
        } catch (error: any) {
            actions.showToast(error.message || 'Error al comentar', 'error');
        } finally {
            setIsAddingComment(false);
        }
    };

    const handleStartReply = (commentId: string) => {
        if (!state.user) {
            actions.showToast('Inicia sesión para responder', 'info');
            return;
        }
        setReplyingTo(commentId);
        setReplyText('');
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handleSubmitReply = async (parentId: string) => {
        if (!replyText.trim() || !state.user) return;
        setIsAddingReply(true);
        try {
            await onAddReply(parentId, replyText.trim());
            setReplyingTo(null);
            setReplyText('');
        } catch (error: any) {
            actions.showToast(error.message || 'Error al responder', 'error');
        } finally {
            setIsAddingReply(false);
        }
    };

    const canDelete = (commentAuthorId: string) =>
        state.user?.id === commentAuthorId || state.user?.id === contentAuthorId;

    return (
        <div className="pt-8 border-t border-slate-200 dark:border-white/10">
            {/* Header */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                Comentarios
                <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">
                    ({comments.length})
                </span>
            </h3>

            {/* Comment Input */}
            {state.user ? (
                <div className="flex gap-4 mb-8 bg-slate-50 dark:bg-[#18181b] p-4 rounded-xl border border-slate-200 dark:border-white/5">
                    <img
                        src={state.user.avatar}
                        alt="Tu avatar"
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-500/20"
                    />
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            rows={2}
                            disabled={isAddingComment}
                            className="w-full bg-transparent text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none resize-none"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleAddComment}
                                disabled={isAddingComment || !newComment.trim()}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="h-4 w-4" />
                                {isAddingComment ? 'Publicando...' : 'Comentar'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 bg-slate-50 dark:bg-white/5 rounded-xl mb-8 border border-slate-200 dark:border-white/10">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        <button onClick={() => navigate('/login')} className="text-amber-500 hover:underline font-bold">
                            Inicia sesión
                        </button>{' '}
                        para comentar
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center text-slate-400 py-8">Cargando comentarios...</div>
                ) : rootComments.length > 0 ? (
                    rootComments.map((comment) => (
                        <div key={comment.id} className="border-b border-slate-100 dark:border-white/5 pb-6 last:border-0">
                            <div className="flex gap-4">
                                <AuthorDisplay
                                    comment={comment}
                                    onClick={() => comment.authorUsername && navigate(`/user/${comment.authorUsername}`)}
                                    showName={false}
                                    avatarClassName="h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AuthorDisplay
                                            comment={comment}
                                            onClick={() => comment.authorUsername && navigate(`/user/${comment.authorUsername}`)}
                                            showAvatar={false}
                                            nameClassName="font-bold text-slate-900 dark:text-white text-sm hover:text-amber-500 cursor-pointer"
                                        />
                                        <span className="text-xs text-slate-400">{timeAgo(getDate(comment))}</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap mb-2">
                                        {getText(comment)}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => onLikeComment(comment.id)}
                                            className={`text-xs flex items-center gap-1 transition-colors ${commentLikes[comment.id]
                                                ? 'text-red-500'
                                                : 'text-slate-400 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart className={`h-3.5 w-3.5 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                                            {comment.likes || 0}
                                        </button>
                                        <button
                                            onClick={() => handleStartReply(comment.id)}
                                            className="text-xs text-slate-400 hover:text-amber-500 flex items-center gap-1"
                                        >
                                            <Reply className="h-3.5 w-3.5" />
                                            Responder
                                        </button>
                                        {canDelete(comment.authorId) && (
                                            <button
                                                onClick={() => onDeleteComment(comment.id)}
                                                className="text-xs text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Reply Form */}
                                    {replyingTo === comment.id && (
                                        <div className="mt-4 flex gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-lg">
                                            <img src={state.user?.avatar} alt="" className="h-8 w-8 rounded-full" />
                                            <div className="flex-1">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Escribe tu respuesta..."
                                                    rows={2}
                                                    disabled={isAddingReply}
                                                    className="w-full bg-transparent text-slate-700 dark:text-slate-300 placeholder-slate-400 text-xs focus:outline-none resize-none"
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={handleCancelReply} className="text-xs text-slate-400 hover:text-slate-600">
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={() => handleSubmitReply(comment.id)}
                                                        disabled={isAddingReply || !replyText.trim()}
                                                        className="px-3 py-1 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 disabled:opacity-50"
                                                    >
                                                        {isAddingReply ? 'Enviando...' : 'Responder'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Replies */}
                                    {getReplies(comment.id).length > 0 && (
                                        <div className="mt-4 ml-4 border-l-2 border-slate-100 dark:border-white/10 pl-4 space-y-4">
                                            {getReplies(comment.id).map((reply) => (
                                                <div key={reply.id} className="flex gap-3">
                                                    <AuthorDisplay
                                                        comment={reply}
                                                        onClick={() => reply.authorUsername && navigate(`/user/${reply.authorUsername}`)}
                                                        showName={false}
                                                        avatarClassName="h-8 w-8 rounded-full object-cover cursor-pointer"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <AuthorDisplay
                                                                comment={reply}
                                                                onClick={() => reply.authorUsername && navigate(`/user/${reply.authorUsername}`)}
                                                                showAvatar={false}
                                                                nameClassName="font-bold text-slate-900 dark:text-white text-xs hover:text-amber-500 cursor-pointer"
                                                            />
                                                            <span className="text-[10px] text-slate-400">{timeAgo(getDate(reply))}</span>
                                                            {canDelete(reply.authorId) && (
                                                                <button
                                                                    onClick={() => onDeleteComment(reply.id)}
                                                                    className="text-slate-400 hover:text-red-500"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-wrap">
                                                            {getText(reply)}
                                                        </p>
                                                        <button
                                                            onClick={() => onLikeComment(reply.id)}
                                                            className={`text-[10px] flex items-center gap-1 mt-1 ${commentLikes[reply.id]
                                                                ? 'text-red-500'
                                                                : 'text-slate-400 hover:text-red-500'
                                                                }`}
                                                        >
                                                            <Heart className={`h-2.5 w-2.5 ${commentLikes[reply.id] ? 'fill-current' : ''}`} />
                                                            {reply.likes || 0}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-400 dark:text-slate-500 py-8">
                        Sé el primero en comentar.
                    </div>
                )}
            </div>
        </div>
    );
};
