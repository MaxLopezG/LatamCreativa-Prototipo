/**
 * ReplyCard Component
 * 
 * Card para mostrar una respuesta dentro de un hilo del foro.
 * Incluye contenido, autor, likes, y acciones (editar, eliminar, reportar).
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    MoreVertical,
    Edit2,
    Trash2,
    Flag,
    Award,
    Reply as ReplyIcon,
    Check
} from 'lucide-react';
import { ForumReply } from '../../types/forum';
import { useReplyLike } from '../../hooks/useForumHooks';
import { useAppStore } from '../../hooks/useAppStore';

interface ReplyCardProps {
    reply: ForumReply;
    threadAuthorId: string;
    isThreadAuthor: boolean;
    onEdit?: (replyId: string) => void;
    onDelete?: (replyId: string) => void;
    onReport?: (replyId: string) => void;
    onMarkBestAnswer?: (replyId: string, isBest: boolean) => void;
    onReply?: (replyId: string) => void;
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
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 30) return `hace ${diffDays}d`;
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Renderiza contenido con soporte básico de markdown
 */
function renderContent(content: string): React.ReactNode {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                // End code block
                elements.push(
                    <pre key={`code-${index}`} className="bg-black/40 rounded-lg p-3 my-2 overflow-x-auto">
                        <code className="text-sm text-gray-300 font-mono">
                            {codeContent.trim()}
                        </code>
                    </pre>
                );
                codeContent = '';
                inCodeBlock = false;
            } else {
                // Start code block
                codeLanguage = line.slice(3).trim();
                inCodeBlock = true;
            }
        } else if (inCodeBlock) {
            codeContent += line + '\n';
        } else {
            // Regular line - handle inline code
            const parts = line.split(/(`[^`]+`)/g);
            const formattedParts = parts.map((part, partIndex) => {
                if (part.startsWith('`') && part.endsWith('`')) {
                    return (
                        <code
                            key={partIndex}
                            className="bg-black/30 px-1.5 py-0.5 rounded text-purple-400 text-sm font-mono"
                        >
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return part;
            });

            if (line.trim()) {
                elements.push(
                    <p key={index} className="text-gray-300 mb-2">
                        {formattedParts}
                    </p>
                );
            } else {
                elements.push(<br key={index} />);
            }
        }
    });

    return elements;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
    reply,
    threadAuthorId,
    isThreadAuthor,
    onEdit,
    onDelete,
    onReport,
    onMarkBestAnswer,
    onReply
}) => {
    const navigate = useNavigate();
    const { state } = useAppStore();
    const [showMenu, setShowMenu] = useState(false);
    const { liked, toggleLike, loading: likeLoading } = useReplyLike(
        reply.threadId,
        reply.id,
        state.user?.uid
    );

    const isAuthor = state.user?.uid === reply.authorId;
    const canMarkBest = isThreadAuthor && !reply.isBestAnswer;
    const canUnmarkBest = isThreadAuthor && reply.isBestAnswer;

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (reply.authorUsername) {
            navigate(`/user/${reply.authorUsername}`);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!state.user) {
            // Could show login modal here
            return;
        }
        await toggleLike();
    };

    return (
        <article
            className={`relative bg-[#1a1a2e]/40 border rounded-xl p-4 transition-all duration-200 ${reply.isBestAnswer
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-white/5 hover:border-white/10'
                }`}
        >
            {/* Best Answer Badge */}
            {reply.isBestAnswer && (
                <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    <Award className="w-3.5 h-3.5" />
                    Mejor Respuesta
                </div>
            )}

            {/* Header: Author + Actions */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img
                        src={reply.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.authorName)}&background=6366f1&color=fff`}
                        alt={reply.authorName}
                        onClick={handleAuthorClick}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span
                                onClick={handleAuthorClick}
                                className="text-white font-medium hover:text-purple-400 cursor-pointer transition-colors"
                            >
                                {reply.authorName}
                            </span>
                            {reply.authorId === threadAuthorId && (
                                <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-medium rounded">
                                    OP
                                </span>
                            )}
                            {reply.authorRole && (
                                <span className="text-xs text-gray-500">
                                    {reply.authorRole}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{getTimeAgo(reply.createdAt)}</span>
                            {reply.isEdited && (
                                <span>(editado)</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Menu */}
                {state.user && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-8 z-20 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                    {isAuthor && onEdit && (
                                        <button
                                            onClick={() => { onEdit(reply.id); setShowMenu(false); }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Editar
                                        </button>
                                    )}
                                    {isAuthor && onDelete && (
                                        <button
                                            onClick={() => { onDelete(reply.id); setShowMenu(false); }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                    )}
                                    {canMarkBest && onMarkBestAnswer && (
                                        <button
                                            onClick={() => { onMarkBestAnswer(reply.id, true); setShowMenu(false); }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                            Marcar como mejor
                                        </button>
                                    )}
                                    {canUnmarkBest && onMarkBestAnswer && (
                                        <button
                                            onClick={() => { onMarkBestAnswer(reply.id, false); setShowMenu(false); }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                            Desmarcar respuesta
                                        </button>
                                    )}
                                    {!isAuthor && onReport && (
                                        <button
                                            onClick={() => { onReport(reply.id); setShowMenu(false); }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
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
            <div className="prose prose-invert max-w-none text-gray-300">
                {renderContent(reply.content)}
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                <button
                    onClick={handleLike}
                    disabled={likeLoading || !state.user}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${liked
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'text-gray-500 hover:text-pink-400 hover:bg-pink-500/10'
                        } ${!state.user ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    <span>{reply.likes}</span>
                </button>

                {onReply && state.user && (
                    <button
                        onClick={() => onReply(reply.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                    >
                        <ReplyIcon className="w-4 h-4" />
                        Responder
                    </button>
                )}
            </div>
        </article>
    );
};

export default ReplyCard;
