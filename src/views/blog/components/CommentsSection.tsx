
import React, { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { BlogComment } from '../../../types';
import { useComments, useAddComment } from '../../../hooks/useFirebase';
import { useAppStore } from '../../../hooks/useAppStore';
import { CommentItem } from './CommentItem';

export const CommentsSection = ({ articleId }: { articleId: string }) => {
    const { comments: flatComments, loading, refresh, removeComment } = useComments(articleId);
    const { add, loading: isAdding } = useAddComment();
    const { state, actions } = useAppStore();
    const [newComment, setNewComment] = useState('');

    const commentTree = React.useMemo(() => {
        const map = new Map<string, BlogComment>();
        const roots: BlogComment[] = [];

        flatComments.forEach(c => {
            map.set(c.id, { ...c, replies: [] });
        });

        flatComments.forEach(c => {
            const comment = map.get(c.id)!;
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId)!.replies!.push(comment);
            } else {
                roots.push(comment);
            }
        });

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
            if (!parentId) setNewComment('');
            refresh();
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
