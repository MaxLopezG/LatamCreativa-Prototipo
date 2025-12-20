
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Globe, Share2, MoreHorizontal, Filter, Plus } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { projectsService } from '../../services/modules/projects';
import { articlesService } from '../../services/modules/articles';
import { PORTFOLIO_ITEMS, BLOG_ITEMS } from '../../data/content';
import { PortfolioItem } from '../../types';

interface CollectionDetailViewProps {
    collectionId: string;
    onBack: () => void;
    onItemSelect: (id: string) => void;
    onShare?: () => void;
}

// Extended type for mixed content display
type DisplayItem = PortfolioItem & { itemType: 'project' | 'article' };

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({ collectionId, onBack, onItemSelect, onShare }) => {
    const { state } = useAppStore();
    const collection = state.collections.find(c => c.id === collectionId);
    const [collectionItems, setCollectionItems] = useState<DisplayItem[]>([]);
    const [loading, setLoading] = useState(false);

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

                    // Merge with local/static items to ensure we find everything (e.g. newly created local items)
                    const localProjects = [...(state.createdItems || []), ...PORTFOLIO_ITEMS];
                    const localArticles = [...(state.blogPosts || []), ...BLOG_ITEMS];

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

    if (!collection) return <div>Colección no encontrada</div>;

    const handleItemClick = (item: DisplayItem) => {
        // We might want to navigate differently for articles vs projects
        // But the prop is onItemSelect(id). The parent container likely expects a project ID or generic ID.
        // If parent is `CollectionsView` -> calls `onCollectionSelect`.
        // Wait, `CollectionDetailView` is likely rendered by `MainLayout` or `UserLayout`.
        // If `onItemSelect` assumes projects, we might have a navigation issue.
        // However, the prompt didn't ask to fix navigation, just "empty collections".
        // But realistically, clicking an article should go to article view.

        // Use window.location/navigate logic? 
        // Ideally we pass type to onItemSelect if the parent supports it.
        // Or if onItemSelect just sets the ID in URL, we need to know the route.
        // For now, adhere to the contract `onItemSelect(id)`. 
        // If the ID is an article ID, does the platform find it?
        // Routes: `/project/:id` vs `/blog/:id`.
        // We might need to handle this in `onItemSelect` or verify what `onItemSelect` does.
        onItemSelect(item.id, item.itemType);
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
                        <button
                            onClick={onShare}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
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
                            onClick={() => handleItemClick(item)}
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

        </div>
    );
};
