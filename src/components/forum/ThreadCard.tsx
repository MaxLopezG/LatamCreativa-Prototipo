/**
 * ThreadCard Component
 * 
 * Card para mostrar preview de un hilo en listados del foro.
 * Incluye título, autor, categoría, tags, stats y badges.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Eye,
    Heart,
    Pin,
    Lock,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { ForumThread } from '../../types/forum';
import { getCategoryById, CATEGORY_COLOR_CLASSES } from '../../data/forumCategories';

interface ThreadCardProps {
    thread: ForumThread;
    onClick?: () => void;
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
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffWeeks < 4) return `${diffWeeks}sem`;
    return `${Math.floor(diffDays / 30)}mes`;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onClick }) => {
    const navigate = useNavigate();
    const category = getCategoryById(thread.category);
    const colorClasses = CATEGORY_COLOR_CLASSES[category?.color || 'gray'];

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/forum/${thread.slug || thread.id}`);
        }
    };

    return (
        <article
            onClick={handleClick}
            className="group relative bg-[#1a1a2e]/60 hover:bg-[#1a1a2e]/80 border border-white/5 hover:border-white/10 rounded-xl p-4 cursor-pointer transition-all duration-200"
        >
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                        <Pin className="w-3 h-3" />
                        Fijado
                    </span>
                )}
                {thread.isClosed && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                        <Lock className="w-3 h-3" />
                        Cerrado
                    </span>
                )}
                {thread.isResolved && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Resuelto
                    </span>
                )}
                {/* Category badge */}
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`}>
                    {category?.name || thread.category}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                {thread.title}
            </h3>

            {/* Excerpt */}
            {thread.excerpt && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {thread.excerpt}
                </p>
            )}

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {thread.tags.slice(0, 4).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-md hover:bg-white/10 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                    {thread.tags.length > 4 && (
                        <span className="text-gray-500 text-xs">
                            +{thread.tags.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Bottom row: Author + Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                {/* Author */}
                <div className="flex items-center gap-2">
                    <img
                        src={thread.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.authorName)}&background=6366f1&color=fff`}
                        alt={thread.authorName}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-300 hover:text-white transition-colors">
                            {thread.authorName}
                        </span>
                        {thread.authorRole && (
                            <span className="text-xs text-gray-500">
                                · {thread.authorRole}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1" title="Respuestas">
                        <MessageSquare className="w-4 h-4" />
                        {thread.replies}
                    </span>
                    <span className="flex items-center gap-1" title="Vistas">
                        <Eye className="w-4 h-4" />
                        {thread.views}
                    </span>
                    <span className="flex items-center gap-1" title="Likes">
                        <Heart className="w-4 h-4" />
                        {thread.likes}
                    </span>
                    <span className="flex items-center gap-1" title="Última actividad">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(thread.lastActivityAt)}
                    </span>
                </div>
            </div>
        </article>
    );
};

export default ThreadCard;
