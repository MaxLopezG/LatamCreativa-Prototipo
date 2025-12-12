
import React, { useState } from 'react';
import { Edit, Trash2, ThumbsUp } from 'lucide-react';
import { BlogComment } from '../../../types';
import { useCommentActions } from '../../../hooks/useFirebase';

interface CommentItemProps {
    comment: BlogComment;
    articleId: string;
    currentUserId?: string;
    onReply: (parentId: string, content: string) => void;
    onDelete: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    articleId,
    currentUserId,
    onReply,
    onDelete
}) => {
    const { like, update, remove } = useCommentActions();
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

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 space-y-6 pl-4 border-l-2 border-slate-100 dark:border-white/5">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                articleId={articleId}
                                currentUserId={currentUserId}
                                onReply={onReply}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
