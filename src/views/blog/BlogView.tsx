import React from 'react';
import { Plus, Newspaper, Loader2, ArrowLeft, ArrowRight, Code, Palette, Info } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useArticles } from '../../hooks/useFirebase';
import { BlogCard } from '../../components/cards/BlogCard';
import { NAV_SECTIONS, NAV_SECTIONS_DEV } from '../../data/navigation';
import { BlogCategorySection } from './BlogCategorySection';
import { GuestLimitOverlay } from '../../components/common/GuestLimitOverlay';
import { MOCK_BLOG_ARTICLES } from '../../data/mockBlog';

// Limit for guest users
const GUEST_ITEM_LIMIT = 6;

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
  const { contentMode } = state;

  // Select navigation sections based on mode
  const currentSections = contentMode === 'dev' ? NAV_SECTIONS_DEV : NAV_SECTIONS;

  // Filter articles by domain (default to 'creative' for legacy articles)
  const filteredPosts = blogPosts.filter(article =>
    (article.domain || 'creative') === contentMode
  );

  // Usar datos mock si no hay artículos reales
  const articlesToDisplay = filteredPosts.length > 0
    ? filteredPosts
    : MOCK_BLOG_ARTICLES.filter(article => (article.domain || 'creative') === contentMode);
  const usingMockData = filteredPosts.length === 0 && articlesToDisplay.length > 0;

  // Mode-specific styling
  const isDev = contentMode === 'dev';
  const accentColor = isDev ? 'blue' : 'rose';
  const accentText = isDev ? 'text-blue-400' : 'text-rose-400';
  const accentBg = isDev ? 'bg-blue-600' : 'bg-rose-600';
  const accentBgHover = isDev ? 'hover:bg-blue-500' : 'hover:bg-rose-500';
  const accentBorder = isDev ? 'border-blue-500/30' : 'border-rose-500/30';
  const accentBgLight = isDev ? 'bg-blue-500/10' : 'bg-rose-500/10';

  const isHomeView = activeCategory === 'Home';

  // Guest detection and limiting
  const isGuest = !state.user;

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#1c1c21] min-h-screen relative">



      {/* Cinematic Hero Banner */}
      <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 min-h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden mb-8 md:mb-12">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
            alt="Blog Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#1c1c21]/80 to-[#1c1c21]"></div>

          {/* Vibrant Glows - Dynamic based on mode */}
          <div className={`absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] ${isDev ? 'bg-blue-600/20' : 'bg-rose-600/20'} rounded-full blur-[100px] md:blur-[150px] pointer-events-none mix-blend-screen`}></div>
          <div className={`absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] ${isDev ? 'bg-cyan-900/10' : 'bg-red-900/10'} rounded-full blur-[100px] md:blur-[150px] pointer-events-none mix-blend-screen`}></div>
        </div>

        <div className="relative z-10 px-6 w-full max-w-5xl text-center pt-10 md:pt-0">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${accentText} text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg`}>
            {isDev ? <Code className="h-3 w-3" /> : <Newspaper className="h-3 w-3" />} {isDev ? 'Dev Blog' : 'Blog & Noticias'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            {isDev ? 'Código que' : 'Historias que'} <br /><span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDev ? 'from-blue-400 to-cyan-300' : 'from-rose-400 to-red-300'}`}>{isDev ? 'Transforma Ideas' : 'Inspiran Creación'}</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            {isDev ? 'Tutoriales de programación, arquitectura de software y las últimas tendencias en desarrollo.' : 'Tutoriales en profundidad, entrevistas a expertos y las últimas novedades de la industria creativa y tecnológica.'}
          </p>
        </div>
      </div>

      {/* Navigation & Toolbar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-end gap-6 mb-8 border-b border-white/10 pb-6">
        {/* Hide create button for guests */}
        {state.user && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateClick}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${accentBorder} ${accentBgLight} ${accentText} hover:opacity-80 transition-all font-bold text-sm`}
            >
              <Plus className="h-4 w-4" /> Escribir Artículo
            </button>
          </div>
        )}
      </div>

      {/* Mock Data Banner */}
      {usingMockData && (
        <div className="relative z-10 mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm">
          <p className="text-amber-300 text-sm text-center flex items-center justify-center gap-2">
            <Info className="h-4 w-4" />
            <span><strong>✨ Datos de demostración:</strong> Estos son artículos de ejemplo para visualizar el diseño.</span>
          </p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {isDev ? <Code className={`h-6 w-6 text-blue-500`} /> : <Newspaper className={`h-6 w-6 text-rose-500`} />}
          {activeCategory === 'Home' ? 'Explora por Categoría' : `Artículos de ${activeCategory}`}
        </h2>
        <p className="text-slate-400 mt-1 text-sm">
          {activeCategory === 'Home' ? (isDev ? 'Descubre lo último en desarrollo.' : 'Descubre lo último en cada área creativa.') : `${articlesToDisplay.length} historias curadas para ti.`}
        </p>
      </div>

      {/* Render Sections if Home, else render Feed */}
      {
        isHomeView ? (
          <div className="space-y-4">
            {/* Recent News Section (Always first) */}
            <BlogCategorySection
              title="Lo último"
              onArticleSelect={onArticleSelect}
              onSave={onSave}
              contentMode={contentMode}
            />

            {/* Render Sections from Navigation - use currentSections based on mode */}
            {currentSections.filter(s => s.title !== 'Descubrir').map((section, idx) => {
              // Flatten all subItems and labels to capture all potential category tags
              const allCategories = section.items.flatMap(item => [item.label, ...(item.subItems || [])]);

              return (
                <BlogCategorySection
                  key={idx}
                  title={section.title}
                  categories={allCategories}
                  onArticleSelect={onArticleSelect}
                  onSave={onSave}
                  contentMode={contentMode}
                />
              );
            })}

            <div className="text-center text-slate-500 mt-12 pb-20">
              <p>Selecciona una categoría del menú lateral para ver más.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-16">
              {/* Filter out drafts and scheduled from public feed, limit for guests */}
              {(() => {
                const publishedArticles = blogPosts.filter(article => !article.status || article.status === 'published');
                const displayArticles = isGuest ? publishedArticles.slice(0, GUEST_ITEM_LIMIT) : publishedArticles;
                const hasMoreForGuests = isGuest && publishedArticles.length > GUEST_ITEM_LIMIT;

                return (
                  <>
                    {displayArticles.map((article) => (
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

                    {/* Guest limit overlay */}
                    {hasMoreForGuests && (
                      <GuestLimitOverlay
                        title="¿Quieres leer más artículos?"
                        description="Regístrate gratis para acceder a todos los artículos y tutoriales."
                        itemType="artículos"
                      />
                    )}
                  </>
                );
              })()}
            </div>

            {/* Pagination - hide for guests */}
            {!isGuest && (
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
            )}

            {!isGuest && !hasMore && blogPosts.length > 0 && (
              <div className="text-center text-slate-500 mt-12 pb-20">
                <p>Has llegado al final. ¡Vuelve pronto por más!</p>
              </div>
            )}
          </>
        )}
    </div>
  );
};
