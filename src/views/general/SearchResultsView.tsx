
import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { EDUCATION_ITEMS, ASSET_ITEMS, FREELANCE_SERVICES } from '../../data/content';
import { useAppStore } from '../../hooks/useAppStore';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { EducationCard } from '../../components/cards/EducationCard';
import { AssetCard } from '../../components/cards/AssetCard';
import { BlogCard } from '../../components/cards/BlogCard';
import { ServiceCard } from '../../components/cards/ServiceCard';

interface SearchResultsViewProps {
  query: string;
  onItemSelect: (id: string, type: 'portfolio' | 'course' | 'asset' | 'blog' | 'service') => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, onItemSelect }) => {
  const { state } = useAppStore();
  const lowerQuery = query.toLowerCase();

  // Filter Data
  const portfolioResults = (state.createdItems || []).filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery) || item.artist.toLowerCase().includes(lowerQuery)
  );

  const courseResults = EDUCATION_ITEMS.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery)
  );

  const assetResults = ASSET_ITEMS.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery)
  );

  const blogResults = (state.blogPosts || []).filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery)
  );

  const serviceResults = FREELANCE_SERVICES.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery)
  );

  const hasResults = portfolioResults.length > 0 || courseResults.length > 0 || assetResults.length > 0 || blogResults.length > 0 || serviceResults.length > 0;

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
            {portfolioResults.slice(0, 6).map(item => (
              <PortfolioCard key={item.id} item={item} onClick={() => onItemSelect(item.id, 'portfolio')} />
            ))}
          </div>
        </section>
      )}

      {/* Course Results */}
      {courseResults.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cursos ({courseResults.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {courseResults.slice(0, 5).map(item => (
              <EducationCard key={item.id} course={item} onClick={() => onItemSelect(item.id, 'course')} />
            ))}
          </div>
        </section>
      )}

      {/* Asset Results */}
      {assetResults.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assets ({assetResults.length})</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {assetResults.slice(0, 6).map(item => (
              <AssetCard key={item.id} asset={item} onClick={() => onItemSelect(item.id, 'asset')} />
            ))}
          </div>
        </section>
      )}

      {/* Service Results */}
      {serviceResults.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Servicios Freelance ({serviceResults.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {serviceResults.slice(0, 5).map(item => (
              <ServiceCard key={item.id} service={item} onClick={() => onItemSelect(item.id, 'service')} />
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
            {blogResults.slice(0, 3).map(item => (
              <BlogCard key={item.id} article={item} onClick={() => onItemSelect(item.id, 'blog')} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
