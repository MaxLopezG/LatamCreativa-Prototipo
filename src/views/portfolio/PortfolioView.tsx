import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Layers, Plus, Image as ImageIcon, Filter, ArrowUpDown, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';
import { projectsService } from '../../services/modules/projects';
import { PortfolioItem } from '../../types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { NAV_SECTIONS, NAV_SECTIONS_DEV } from '../../data/navigation';
import { GuestLimitOverlay } from '../../components/common/GuestLimitOverlay';
import { MOCK_PORTFOLIO_ITEMS } from '../../data/mockPortfolio';

// Number of items to blur at the bottom for guests (creates visual fade effect)
const GUEST_BLUR_LAST_ITEMS = 5;

interface PortfolioViewProps {
  activeCategory: string;
  onItemSelect?: (id: string) => void;
  onCreateClick?: () => void;
  onSave?: (id: string, image: string) => void;
  contentMode: ContentMode;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ activeCategory, onItemSelect, onCreateClick, onSave, contentMode }) => {
  const { state } = useAppStore();
  const navigate = useNavigate();
  const mode = contentMode || 'creative';
  const { slug } = useParams<{ slug?: string }>();

  // Get category label from slug
  const categoryFromSlug = useMemo(() => {
    if (!slug) return null;
    const sections = mode === 'dev' ? NAV_SECTIONS_DEV : NAV_SECTIONS;
    for (const section of sections) {
      const item = section.items.find(i => i.slug === slug);
      if (item) return item.label;
    }
    return null;
  }, [slug, mode]);

  // Active category: use slug-derived category if available, otherwise prop
  const effectiveCategory = categoryFromSlug || activeCategory;

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // State to store the cursors for Firestore pagination
  const [pageCursors, setPageCursors] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);

  const fetchProjects = useCallback(async (pageNumber: number) => {
    if (pageNumber > pageCursors.length) {
      console.warn("Cannot jump to a non-sequential page. Fetching page 1.");
      setSearchParams({ page: '1' });
      return;
    }

    setLoading(true);
    setError(null);
    window.scrollTo(0, 0); // Scroll to top on new page

    try {
      const cursor = pageCursors[pageNumber - 1];
      const result = await projectsService.getProjects(cursor, 20);

      setProjects(result.data);
      setHasMore(result.hasMore);

      if (result.hasMore && pageNumber >= pageCursors.length) {
        setPageCursors(prev => [...prev, result.lastDoc]);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [pageCursors, setSearchParams]);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage, fetchProjects]);

  // Filter items by mode and status (only show published projects in public feed)
  const filteredItems = projects.filter(item => {
    // Default to 'creative' if domain is not set for backward compatibility
    const itemDomain = item.domain || 'creative';
    // Default to 'published' for backward compatibility with existing projects
    const itemStatus = item.status || 'published';
    // Only show published projects in the public feed
    return itemDomain === mode && itemStatus === 'published';
  });

  // Use mock data if no real projects are available (for design preview)
  const itemsToDisplay = filteredItems.length > 0
    ? filteredItems
    : MOCK_PORTFOLIO_ITEMS.filter(item => (item.domain || 'creative') === mode);
  const usingMockData = filteredItems.length === 0 && itemsToDisplay.length > 0;

  const handleNextPage = () => {
    if (!hasMore || loading) return;
    setSearchParams({ page: String(currentPage + 1) });
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || loading) return;
    setSearchParams({ page: String(currentPage - 1) });
  };

  // Apply Category Filter - use effectiveCategory (from slug or prop)
  const allDisplayItems = effectiveCategory === 'Home' || !effectiveCategory
    ? itemsToDisplay
    : itemsToDisplay.filter(item => item.category === effectiveCategory);

  // For guests: show all items but blur the last few + show CTA instead of pagination
  const isGuest = !state.user;
  const displayItems = allDisplayItems; // Show all items
  const blurStartIndex = isGuest ? Math.max(0, displayItems.length - GUEST_BLUR_LAST_ITEMS) : displayItems.length;
  const showGuestCTA = isGuest && displayItems.length > 0;

  const accentText = mode === 'dev' ? 'text-blue-500' : 'text-pink-500';
  const accentBg = mode === 'dev' ? 'bg-blue-600' : 'bg-pink-600';
  const accentGradient = mode === 'dev' ? 'from-blue-400 to-cyan-300' : 'from-pink-400 to-rose-300';

  // New vibrant background setup
  const heroImage = mode === 'dev'
    ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#1c1c21] min-h-screen">

      {/* Cinematic Hero Banner - Full Width */}
      <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 h-[500px] flex items-center justify-center overflow-hidden mb-12">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
            alt="Portfolio Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#1c1c21]/80 to-[#1c1c21]"></div>

          {/* Vibrant Glows */}
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${mode === 'dev' ? 'bg-blue-600/20' : 'bg-pink-600/20'} rounded-full blur-[150px] pointer-events-none mix-blend-screen`}></div>
          <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${mode === 'dev' ? 'bg-cyan-600/10' : 'bg-purple-600/10'} rounded-full blur-[150px] pointer-events-none mix-blend-screen`}></div>
        </div>

        <div className="relative z-10 px-6 w-full max-w-5xl text-center">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${mode === 'dev' ? 'text-blue-400' : 'text-pink-400'} text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg`}>
            <ImageIcon className="h-3 w-3" /> {mode === 'dev' ? 'Showcase Developer' : 'Inspiración Visual'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Descubre <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>Obras Maestras</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Explora {mode === 'dev' ? 'repositorios y snippets' : 'modelos 3D, concept art y animaciones'} creados por la comunidad más talentosa de Latam.
          </p>
        </div>
      </div>

      {/* Mock Data Banner */}
      {usingMockData && (
        <div className="relative z-10 mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm">
          <p className="text-amber-300 text-sm text-center">
            <span className="font-bold">✨ Datos de demostración:</span> Estos son proyectos de ejemplo para visualizar el diseño.
            Los proyectos reales aparecerán aquí cuando se publiquen.
          </p>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className={`h-6 w-6 ${accentText}`} />
            {effectiveCategory === 'Home' || !effectiveCategory ? 'Feed de Proyectos' : effectiveCategory}
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? 'Cargando proyectos...' : `Mostrando ${displayItems.length} resultados`}
            {slug && ` en "${effectiveCategory}"`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hide create button for guests */}
          {state.user && (
            <>
              <button
                onClick={onCreateClick}
                className={`flex items-center gap-2 px-6 py-2.5 ${accentBg} text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-${mode === 'dev' ? 'blue' : 'pink'}-500/20`}
              >
                <Plus className="h-4 w-4" /> {mode === 'dev' ? 'Compartir Código' : 'Subir Proyecto'}
              </button>
              <div className="h-8 w-px bg-white/10 hidden md:block mx-2"></div>
            </>
          )}

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <Filter className="h-4 w-4" /> Filtrar
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <span className="text-slate-500 text-xs uppercase font-bold mr-1">Ordenar:</span>Tendencia <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className={`h-12 w-12 animate-spin ${accentText}`} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-16">
          {displayItems.length > 0 ? (
            displayItems.map((item, index) => {
              // Apply blur effect to last items for guests
              const shouldBlur = isGuest && index >= blurStartIndex;
              const blurIntensity = shouldBlur ? Math.min((index - blurStartIndex + 1) * 2, 8) : 0;

              return (
                <div key={item.id} className="relative">
                  <div
                    className={shouldBlur ? 'pointer-events-none select-none transition-all' : ''}
                    style={shouldBlur ? { filter: `blur(${blurIntensity}px)`, opacity: 1 - (blurIntensity * 0.05) } : {}}
                  >
                    <PortfolioCard
                      item={item}
                      onClick={() => !shouldBlur && onItemSelect?.(item.id)}
                      onSave={!shouldBlur ? onSave : undefined}
                      hideSaveButton={shouldBlur}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg">No hay proyectos para mostrar en esta categoría.</p>
              {state.user && (
                <button onClick={onCreateClick} className={`mt-4 ${accentText} font-bold hover:underline`}>Sé el primero en subir uno</button>
              )}
            </div>
          )}

          {/* Guest CTA - Behance style */}
          {showGuestCTA && (
            <div className="col-span-full mt-8">
              {/* Gradient fade */}
              <div className="h-20 bg-gradient-to-t from-[#1c1c21] to-transparent -mt-20 relative z-10 pointer-events-none" />

              {/* CTA Section - Minimal like Behance */}
              <div className="text-center py-12 px-6">
                <p className="text-slate-300 text-lg mb-6">
                  <button
                    onClick={() => navigate('/register')}
                    className="text-amber-400 hover:text-amber-300 font-semibold hover:underline transition-colors"
                  >
                    Regístrate
                  </button>
                  {' '}o{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-amber-400 hover:text-amber-300 font-semibold hover:underline transition-colors"
                  >
                    Inicia sesión
                  </button>
                  {' '}para ver más proyectos personalizados a tus preferencias.
                </p>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                  >
                    Registrarse con Email
                  </button>
                  <span className="text-slate-500">o</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                    title="Continuar con Google"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls - hide for guests */}
      {!isGuest && !loading && (projects.length > 0 || currentPage > 1) && (
        <div className="mt-12 md:mt-16 flex justify-center items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="font-bold text-slate-400 text-sm">Página {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
