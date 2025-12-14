import React, { useState } from 'react';
import { Plus, Newspaper, Search, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useArticles } from '../../hooks/useFirebase';
import { BlogCard } from '../../components/cards/BlogCard';
import { NAV_SECTIONS } from '../../data/navigation';
import { BlogCategorySection } from './BlogCategorySection';

interface BlogViewProps {
  activeCategory: string;
  onArticleSelect?: (id: string) => void;
  onCreateClick?: () => void;
  onSave?: (id: string, image: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ activeCategory, onArticleSelect, onSave, onCreateClick }) => {
  const { state, actions } = useAppStore();
  const { articles: blogPosts, loading, hasMore, currentPage, nextPage, prevPage } = useArticles();
  const { sortOption } = state.blogState;


  const isHomeView = activeCategory === 'Home';

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#0f0f12] min-h-screen relative">



      {/* Cinematic Hero Banner */}
      <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 min-h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden mb-8 md:mb-12">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
            alt="Blog Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0f0f12]/80 to-[#0f0f12]"></div>

          {/* Vibrant Glows - Rose/Red Theme for Editorial/News */}
          <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-rose-600/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-red-900/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none mix-blend-screen"></div>
        </div>

        <div className="relative z-10 px-6 w-full max-w-5xl text-center pt-10 md:pt-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
            <Newspaper className="h-3 w-3" /> Blog & Noticias
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Historias que <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-300">Inspiran Creación</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Tutoriales en profundidad, entrevistas a expertos y las últimas novedades de la industria creativa y tecnológica.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar artículos, tutoriales, noticias..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-rose-500/50 transition-all backdrop-blur-xl shadow-2xl"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-all">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Toolbar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-end gap-6 mb-8 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all font-bold text-sm"
          >
            <Plus className="h-4 w-4" /> Escribir Artículo
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-rose-500" />
          {activeCategory === 'Home' ? 'Explora por Categoría' : `Artículos de ${activeCategory}`}
        </h2>
        <p className="text-slate-400 mt-1 text-sm">
          {activeCategory === 'Home' ? 'Descubre lo último en cada área creativa.' : `${blogPosts.length} historias curadas para ti.`}
        </p>
      </div>

      {/* Render Sections if Home, else render Feed */}
      {isHomeView ? (
        <div className="space-y-4">
          {/* Recent News Section (Always first) */}
          <BlogCategorySection
            title="Lo último"
            onArticleSelect={onArticleSelect}
            onSave={onSave}
          />

          {/* Render Sections from Navigation */}
          {NAV_SECTIONS.filter(s => s.title !== 'Descubrir').map((section, idx) => {
            // Flatten all subItems and labels to capture all potential category tags
            const allCategories = section.items.flatMap(item => [item.label, ...(item.subItems || [])]);

            return (
              <BlogCategorySection
                key={idx}
                title={section.title}
                categories={allCategories}
                onArticleSelect={onArticleSelect}
                onSave={onSave}
              />
            );
          })}

          <div className="text-center text-slate-500 mt-12 pb-20">
            <p>Selecciona una categoría del menú lateral para ver más.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 mb-16">
            {blogPosts.map((article) => (
              <BlogCard
                key={article.id}
                article={article}
                onClick={() => onArticleSelect?.(article.id)}
                onSave={onSave}
              />
            ))}

            {loading && blogPosts.length === 0 && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="aspect-[4/3] w-full bg-white/5 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-white/5 rounded"></div>
                  <div className="h-6 w-full bg-white/5 rounded"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-6 mt-12 pb-20">
            <button
              onClick={prevPage}
              disabled={currentPage === 1 || loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" /> Anterior
            </button>

            <span className="text-slate-400 font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              Página {currentPage}
            </span>

            <button
              onClick={nextPage}
              disabled={!hasMore || loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 disabled:bg-white/5 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Siguiente <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>

          {!hasMore && blogPosts.length > 0 && (
            <div className="text-center text-slate-500 mt-12 pb-20">
              <p>Has llegado al final. ¡Vuelve pronto por más!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
