/**
 * ForumView - Main Forum Page
 * 
 * Página principal del foro que muestra categorías y listado de hilos.
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus,
    MessageCircleQuestion,
    Loader2,
    Filter,
    Hash,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useForumThreads } from '../../hooks/useForumHooks';
import { ThreadCard, ForumCategoryCard, ForumStats } from '../../components/forum';
import { FORUM_CATEGORIES } from '../../data/forumCategories';
import { ThreadSortOption } from '../../types/forum';
import { GuestLimitOverlay } from '../../components/common/GuestLimitOverlay';

// Limit for guest users
const GUEST_THREAD_LIMIT = 6;

interface ForumViewProps {
    activeCategory?: string;
    onThreadSelect?: (id: string) => void;
    onCreateClick?: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
    activeCategory: propCategory,
    onThreadSelect,
    onCreateClick
}) => {
    const navigate = useNavigate();
    const { slug: categorySlug } = useParams<{ slug?: string }>();
    const { state } = useAppStore();

    // Use URL category or prop category
    const activeCategory = categorySlug || propCategory || 'all';

    // Sort state
    const [sortBy, setSortBy] = useState<ThreadSortOption>('activity');
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Fetch threads
    const {
        threads,
        loading,
        error,
        hasMore,
        page,
        nextPage,
        prevPage,
        refresh
    } = useForumThreads(activeCategory === 'all' ? undefined : activeCategory, sortBy);

    const handleCreateClick = () => {
        if (onCreateClick) {
            onCreateClick();
        } else {
            navigate('/forum/new');
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        if (categoryId === 'all') {
            navigate('/forum');
        } else {
            const category = FORUM_CATEGORIES.find(c => c.id === categoryId);
            if (category) {
                navigate(`/forum/categoria/${category.slug}`);
            }
        }
    };

    // Get current category info
    const currentCategory = FORUM_CATEGORIES.find(c => c.slug === activeCategory || c.id === activeCategory);
    const displayedCategories = showAllCategories ? FORUM_CATEGORIES : FORUM_CATEGORIES.slice(0, 6);

    // Guest detection and limiting
    const isGuest = !state.user;
    const displayThreads = isGuest ? threads.slice(0, GUEST_THREAD_LIMIT) : threads;
    const hasMoreForGuests = isGuest && threads.length > GUEST_THREAD_LIMIT;

    return (
        <div className="min-h-screen pb-12 px-4 md:px-8 lg:px-12 pt-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <MessageCircleQuestion className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {activeCategory === 'all' ? 'Foro' : currentCategory?.name || 'Foro'}
                            </h1>
                            <p className="text-gray-400">
                                {activeCategory === 'all'
                                    ? 'Conecta con la comunidad creativa'
                                    : currentCategory?.description || 'Discusiones'}
                            </p>
                        </div>
                    </div>

                    {/* Create Thread Button */}
                    {state.user && (
                        <button
                            onClick={handleCreateClick}
                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Hilo
                        </button>
                    )}
                </div>

                {/* Breadcrumb for category view */}
                {activeCategory !== 'all' && (
                    <button
                        onClick={() => navigate('/forum')}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mt-3 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Volver a todas las categorías
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Categories Grid (shown on main forum page) */}
                    {activeCategory === 'all' && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-purple-400" />
                                    Categorías
                                </h2>
                                {FORUM_CATEGORIES.length > 6 && (
                                    <button
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        {showAllCategories ? 'Ver menos' : 'Ver todas'}
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayedCategories.map(category => (
                                    <ForumCategoryCard
                                        key={category.id}
                                        category={category}
                                        onClick={() => handleCategoryChange(category.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sort Tabs */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 p-1 bg-[#1a1a2e]/60 rounded-lg">
                            {[
                                { value: 'activity' as const, label: 'Recientes' },
                                { value: 'popular' as const, label: 'Populares' },
                                { value: 'unanswered' as const, label: 'Sin Resolver' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${sortBy === option.value
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Category filter (on category pages) */}
                        {activeCategory !== 'all' && (
                            <select
                                value={activeCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="px-4 py-2 bg-[#1a1a2e]/60 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:border-purple-500"
                            >
                                <option value="all">Todas las categorías</option>
                                {FORUM_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Threads List */}
                    <div className="space-y-4">
                        {loading && threads.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-400 mb-4">{error}</p>
                                <button
                                    onClick={refresh}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : threads.length === 0 ? (
                            <div className="text-center py-16 bg-[#1a1a2e]/40 rounded-xl border border-white/5">
                                <MessageCircleQuestion className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No hay hilos aún
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Sé el primero en iniciar una conversación
                                </p>
                                {state.user && (
                                    <button
                                        onClick={handleCreateClick}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Crear el primer hilo
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {displayThreads.map(thread => (
                                    <ThreadCard
                                        key={thread.id}
                                        thread={thread}
                                        onClick={() => {
                                            if (onThreadSelect) {
                                                onThreadSelect(thread.id);
                                            } else {
                                                navigate(`/forum/${thread.slug || thread.id}`);
                                            }
                                        }}
                                    />
                                ))}

                                {/* Guest limit overlay */}
                                {hasMoreForGuests && (
                                    <GuestLimitOverlay
                                        title="¿Quieres ver más discusiones?"
                                        description="Regístrate gratis para explorar todos los hilos y participar."
                                        itemType="hilos"
                                    />
                                )}

                                {/* Pagination - hide for guests */}
                                {!isGuest && (hasMore || page > 1) && (
                                    <div className="flex items-center justify-center gap-4 pt-6">
                                        <button
                                            onClick={prevPage}
                                            disabled={page === 1}
                                            className="flex items-center gap-1 px-4 py-2 bg-[#1a1a2e]/60 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Anterior
                                        </button>
                                        <span className="text-gray-400">
                                            Página {page}
                                        </span>
                                        <button
                                            onClick={nextPage}
                                            disabled={!hasMore}
                                            className="flex items-center gap-1 px-4 py-2 bg-[#1a1a2e]/60 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Siguiente
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
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
        </div>
    );
};

export default ForumView;
