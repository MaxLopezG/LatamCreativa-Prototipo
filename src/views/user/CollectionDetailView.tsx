
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, Globe, Share2, Trash2, Edit3, X, Check, Loader2, Plus } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { projectsService } from '../../services/modules/projects';
import { articlesService } from '../../services/modules/articles';
import { collectionsService } from '../../services/modules/collections';
import { PortfolioItem, CollectionItem } from '../../types';

interface CollectionDetailViewProps {
    collectionId: string;
    onBack: () => void;
    onItemSelect: (id: string) => void;
    onShare?: () => void;
}

// Extended type for mixed content display
type DisplayItem = PortfolioItem & { itemType: 'project' | 'article' };

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({ collectionId, onBack, onItemSelect, onShare }) => {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ownerId = searchParams.get('owner');

    // First try to find in user's own collections
    const ownCollection = state.collections.find(c => c.id === collectionId);
    // State for external (other user's) collection
    const [externalCollection, setExternalCollection] = useState<CollectionItem | null>(null);
    const [loadingCollection, setLoadingCollection] = useState(false);

    // Use own collection if found, otherwise use external
    const collection = ownCollection || externalCollection;

    const [collectionItems, setCollectionItems] = useState<DisplayItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    // Edit/Delete modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editIsPrivate, setEditIsPrivate] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Check if current user is the owner
    const isOwner = state.user && ownCollection;

    // Fetch external collection if not found in own collections
    useEffect(() => {
        const fetchExternalCollection = async () => {
            if (!ownCollection && ownerId) {
                setLoadingCollection(true);
                try {
                    const col = await collectionsService.getCollectionById(ownerId, collectionId);
                    setExternalCollection(col);
                } catch (error) {
                    console.error('Error fetching external collection:', error);
                } finally {
                    setLoadingCollection(false);
                }
            }
        };
        fetchExternalCollection();
    }, [ownCollection, ownerId, collectionId]);

    useEffect(() => {
        const fetchItems = async () => {
            if (collection?.items && collection.items.length > 0) {
                setLoading(true);
                try {
                    const allIds = collection.items.map((item: any) => typeof item === 'string' ? item : item.id);

                    // 2. Fetch from BOTH services for all IDs to be robust against type mismatches
                    // This handles cases where an item is saved as 'project' but is actually an 'article' (or vice versa)
                    const [projects, articles] = await Promise.all([
                        allIds.length > 0 ? projectsService.getProjectsByIds(allIds) : Promise.resolve([]),
                        allIds.length > 0 ? articlesService.getArticlesByIds(allIds) : Promise.resolve([])
                    ]);

                    // Merge with local items from state (for optimistic updates)
                    const localProjects = state.createdItems || [];
                    const localArticles = state.blogPosts || [];

                    const allProjects = [...projects];
                    // Add local projects if matched by ID and not already in fetched list
                    localProjects.forEach(lp => {
                        if (allIds.includes(lp.id) && !allProjects.find(p => p.id === lp.id)) {
                            allProjects.push(lp);
                        }
                    });

                    const allArticles = [...articles];
                    localArticles.forEach(la => {
                        if (allIds.includes(la.id) && !allArticles.find(a => a.id === la.id)) {
                            allArticles.push(la);
                        }
                    });

                    // 3. Normalize Articles to match PortfolioItem shape for the Card
                    const normalizedArticles: DisplayItem[] = allArticles.map(a => ({
                        id: a.id,
                        title: a.title,
                        image: a.image,
                        views: String(a.views || 0),
                        likes: String(a.likes || 0),
                        artist: typeof a.author === 'object' ? (a.author as any).name || 'Unknown' : a.author || 'Unknown',
                        artistAvatar: a.authorAvatar,
                        category: a.category,
                        isPrivate: a.isExclusive,
                        itemType: 'article' as const
                    } as unknown as DisplayItem));

                    const normalizedProjects: DisplayItem[] = allProjects.map(p => ({
                        ...p,
                        itemType: 'project' as const
                    }));

                    // 4. Merge and Restore Order
                    const projectMap = new Map(normalizedProjects.map(p => [p.id, p]));
                    const articleMap = new Map(normalizedArticles.map(a => [a.id, a]));
                    const finalItems: DisplayItem[] = [];

                    collection.items.forEach((ref: any) => {
                        const id = typeof ref === 'string' ? ref : ref.id;
                        // Determine expected type to look in correct map
                        const type = typeof ref === 'string' ? 'project' : ref.type || 'project';

                        if (type === 'article') {
                            if (articleMap.has(id)) {
                                finalItems.push(articleMap.get(id)!);
                            } else if (projectMap.has(id)) {
                                // Fallback: Saved as article but is project
                                const item = projectMap.get(id)!;
                                finalItems.push({ ...item, itemType: 'project' });
                            }
                        } else {
                            if (projectMap.has(id)) {
                                finalItems.push(projectMap.get(id)!);
                            } else if (articleMap.has(id)) {
                                // Fallback: Saved as project (or undefined) but is article
                                const item = articleMap.get(id)!;
                                finalItems.push({ ...item, itemType: 'article' });
                            }
                        }
                    });

                    setCollectionItems(finalItems);
                } catch (e) {
                    console.error("Error loading collection items", e);
                } finally {
                    setLoading(false);
                }
            } else {
                setCollectionItems([]);
            }
        };

        fetchItems();
    }, [collection]);

    // Show loading while fetching external collection
    if (loadingCollection) {
        return (
            <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit mb-8"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver
                </button>
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Colección no encontrada</h2>
                    <p className="text-slate-500">La colección que buscas no existe o es privada.</p>
                </div>
            </div>
        );
    }

    const handleItemClick = (item: DisplayItem) => {
        onItemSelect(item.id, item.itemType);
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!state.user || removingId) return;

        setRemovingId(itemId);

        // Optimistic UI update
        setCollectionItems(prev => prev.filter(item => item.id !== itemId));

        try {
            await collectionsService.removeFromCollection(state.user.id, collectionId, itemId);
            actions.showToast('Elemento eliminado de la colección', 'success');
            // Refetch collections to update the count in sidebar/other views
            actions.fetchCollections();
        } catch (error) {
            console.error('Error removing item:', error);
            actions.showToast('Error al eliminar elemento', 'error');
            // Rollback - refetch items
            // For simplicity, we'll just show error; a full rollback would require re-fetching
        } finally {
            setRemovingId(null);
        }
    };

    // Open edit modal with current values
    const handleOpenEdit = () => {
        setEditTitle(collection.title);
        setEditIsPrivate(collection.isPrivate || false);
        setIsEditModalOpen(true);
    };

    // Save edited collection
    const handleSaveEdit = async () => {
        if (!state.user || !editTitle.trim()) return;

        setIsSaving(true);
        try {
            await collectionsService.updateCollection(state.user.id, collectionId, {
                title: editTitle.trim(),
                isPrivate: editIsPrivate
            });
            actions.showToast('Colección actualizada', 'success');
            actions.fetchCollections();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating collection:', error);
            actions.showToast('Error al actualizar colección', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Delete entire collection
    const handleDeleteCollection = async () => {
        if (!state.user) return;

        setIsDeleting(true);
        try {
            await actions.deleteCollection(collectionId);
            setIsDeleteModalOpen(false);
            navigate('/profile');
        } catch (error) {
            console.error('Error deleting collection:', error);
            actions.showToast('Error al eliminar colección', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">

            {/* Header */}
            <div className="flex flex-col gap-6 mb-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a Colecciones
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">{collection.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                {collection.isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                                {collection.isPrivate ? 'Privada' : 'Pública'}
                            </span>
                            <span>•</span>
                            <span>{collectionItems.length} elementos guardados</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <>
                                <button
                                    onClick={handleOpenEdit}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    title="Editar colección"
                                >
                                    <Edit3 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="p-2.5 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    title="Eliminar colección"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={onShare}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            title="Compartir"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-8"></div>

            {/* Grid */}
            {loading ? (
                <div className="py-20 text-center text-slate-500">Cargando elementos...</div>
            ) : collectionItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {collectionItems.map((item) => (
                        <PortfolioCard
                            key={item.id}
                            item={item}
                            itemType={item.itemType}
                            showTypeBadge={true}
                            hideSaveButton={true}
                            onClick={() => handleItemClick(item)}
                            extraAction={
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveItem(item.id);
                                    }}
                                    disabled={removingId === item.id}
                                    className={`pointer-events-auto p-2 rounded-full transition-all shadow-lg ${removingId === item.id
                                        ? 'bg-slate-500/90 cursor-wait'
                                        : 'bg-red-500/90 hover:bg-red-600 hover:scale-110'
                                        } text-white`}
                                    title="Eliminar de colección"
                                >
                                    <Trash2 className={`h-4 w-4 ${removingId === item.id ? 'animate-pulse' : ''}`} />
                                </button>
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="text-lg font-medium">Esta colección está vacía</p>
                    <p className="text-sm">Explora el feed para guardar contenido aquí.</p>
                </div>
            )}

            {/* Edit Collection Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setIsEditModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Editar Colección</h3>
                            <button onClick={() => !isSaving && setIsEditModalOpen(false)} className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    placeholder="Nombre de la colección"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editIsPrivate}
                                    onChange={(e) => setEditIsPrivate(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 dark:border-white/20 text-amber-500 focus:ring-amber-500/50"
                                />
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Colección privada</span>
                                </div>
                            </label>
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                disabled={isSaving}
                                className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving || !editTitle.trim()}
                                className="flex-1 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Collection Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-red-500">Eliminar Colección</h3>
                            <button onClick={() => !isDeleting && setIsDeleteModalOpen(false)} className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <p className="text-slate-600 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar la colección <strong className="text-slate-900 dark:text-white">"{collection.title}"</strong>?
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                Esta acción es permanente. Los elementos guardados no serán eliminados, solo la colección.
                            </p>
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteCollection}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
