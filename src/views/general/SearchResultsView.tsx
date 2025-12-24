
import React from 'react';
import { Search } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { BlogCard } from '../../components/cards/BlogCard';

interface SearchResultsViewProps {
  query: string;
  onItemSelect: (id: string, type: 'portfolio' | 'blog') => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, onItemSelect }) => {
  const { state } = useAppStore();
  const lowerQuery = query.toLowerCase();

  // Filter Data - Only Portfolio and Blog
  const portfolioResults = (state.createdItems || []).filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery) || item.artist.toLowerCase().includes(lowerQuery)
  );

  const blogResults = (state.blogPosts || []).filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery)
  );

  const hasResults = portfolioResults.length > 0 || blogResults.length > 0;

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No encontramos resultados para "{query}"</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Intenta con otras palabras clave o revisa la ortografía. También puedes navegar por las categorías.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resultados de búsqueda: <span className="text-amber-500">"{query}"</span></h1>
      </div>

      {/* Portfolio Results */}
      {portfolioResults.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Portafolio ({portfolioResults.length})</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {portfolioResults.slice(0, 12).map(item => (
              <PortfolioCard key={item.id} item={item} onClick={() => onItemSelect(item.id, 'portfolio')} />
            ))}
          </div>
        </section>
      )}

      {/* Blog Results */}
      {blogResults.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Artículos ({blogResults.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogResults.slice(0, 6).map(item => (
              <BlogCard key={item.id} article={item} onClick={() => onItemSelect(item.id, 'blog')} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
