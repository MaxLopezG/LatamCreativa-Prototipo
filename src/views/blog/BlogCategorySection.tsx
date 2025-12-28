import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Newspaper, ChevronLeft, ChevronRight, Code } from 'lucide-react';
import { ArticleItem } from '../../types';
import { articlesService } from '../../services/modules/articles';
import { BlogCard } from '../../components/cards/BlogCard';
import { ContentMode } from '../../hooks/useAppStore';

interface BlogCategorySectionProps {
    title: string;
    categories?: string[]; // Optional: if omitted, fetches newest articles globally
    onArticleSelect?: (id: string) => void;
    onSave?: (id: string, image: string) => void;
    contentMode?: ContentMode;
}

export const BlogCategorySection: React.FC<BlogCategorySectionProps> = ({
    title,
    categories,
    onArticleSelect,
    onSave,
    contentMode = 'creative'
}) => {
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const isDev = contentMode === 'dev';

    // Create a stable key for dependencies to prevent re-fetching on every render
    // simply because the parent passes a new array reference.
    const categoriesKey = JSON.stringify(categories);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                let fetched: ArticleItem[] = [];

                if (categories && categories.length > 0) {
                    // Fetch by specific categories (increased limit for carousel)
                    // Update: getArticlesByCategories now returns PaginatedResult
                    const result = await articlesService.getArticlesByCategories(categories, null, 10);
                    fetched = result.data;
                } else {
                    // Fetch recent (top 10 globally)
                    fetched = await articlesService.getRecentArticles(10);
                }

                // Filter by domain (default to 'creative' for legacy articles)
                const filteredByDomain = fetched.filter(article =>
                    (article.domain || 'creative') === contentMode
                );

                setArticles(filteredByDomain);
            } catch (error) {
                console.error(`Error loading section ${title}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();

        // Disable warning because we are using a stable stringified key for the array dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesKey, title, contentMode]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.75;
            const newScrollLeft = direction === 'right'
                ? container.scrollLeft + scrollAmount
                : container.scrollLeft - scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-12 relative group/section">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-rose-500 rounded-full"></span>
                    {title}
                </h3>
            </div>

            {/* Carousel Container */}
            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-rose-600 disabled:opacity-0 -ml-4 md:-ml-6 hidden md:flex items-center justify-center backdrop-blur-md"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Scrollable Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 md:gap-5 pb-4 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex-none w-[calc(50%-8px)] md:w-[calc(20%-12px)] animate-pulse flex flex-col gap-4">
                                <div className="aspect-[4/3] w-full bg-white/5 rounded-2xl"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-20 bg-white/5 rounded"></div>
                                    <div className="h-6 w-full bg-white/5 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <div key={article.id} className="flex-none w-[calc(50%-8px)] md:w-[calc(20%-12px)] snap-start">
                                <BlogCard
                                    article={article}
                                    onClick={() => onArticleSelect?.(article.id)}
                                    onSave={onSave}
                                    compact // Optional compact prop, handled by container width mostly
                                />
                            </div>
                        ))
                    ) : (
                        <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-8 py-10 text-center flex-none">
                            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-4">
                                <Newspaper className="h-6 w-6 text-slate-500" />
                            </div>
                            <h4 className="text-slate-300 font-medium mb-1">Aún no hay artículos</h4>
                            <p className="text-sm text-slate-500">Pronto publicaremos contenido en esta categoría.</p>
                        </div>
                    )}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-rose-600 -mr-4 md:-mr-6 hidden md:flex items-center justify-center backdrop-blur-md"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
