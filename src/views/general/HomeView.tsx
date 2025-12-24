import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Briefcase, BookOpen, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { projectsService } from '../../services/modules/projects';
import { articlesService } from '../../services/modules/articles';
import { PortfolioItem, ArticleItem } from '../../types';
import { CATEGORY_ITEMS } from '../../data/navigation';
import { SEOHead } from '../../components/SEOHead';

interface HomeViewProps {
  onCategorySelect: (category: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioItem[]>([]);
  const [recentArticles, setRecentArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [projects, articles] = await Promise.all([
          projectsService.getRecentProjects(8),
          articlesService.getRecentArticles(4)
        ]);
        setFeaturedProjects(projects);
        setRecentArticles(articles);
      } catch (error) {
        console.error('Error fetching home content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#030304] transition-colors">
      <SEOHead
        title="Inicio"
        description="Conecta con artistas, desarrolladores y creativos de Latinoamérica. Comparte tu trabajo, aprende de los mejores y construye tu carrera."
        url="/"
        keywords={['arte 3D', 'diseño', 'portafolio', 'creativos latinoamericanos', 'artistas']}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/10 dark:from-amber-500/5 dark:to-rose-500/5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 dark:opacity-30" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 dark:opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Comunidad Creativa de Latinoamérica
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6 animate-fade-in">
              Donde el talento{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                latinoamericano
              </span>{' '}
              brilla
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl animate-fade-in">
              Conecta con artistas, desarrolladores y creativos. Comparte tu trabajo, aprende de los mejores y construye tu carrera.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <button
                onClick={() => navigate('/portfolio')}
                className="group flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
              >
                Explorar Portafolios
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/20 transition-all"
              >
                Crear Cuenta Gratis
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-slate-200 dark:border-white/10 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">1,000+</div>
                  <div className="text-sm text-slate-500">Creativos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10">
                  <Briefcase className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">500+</div>
                  <div className="text-sm text-slate-500">Proyectos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">100+</div>
                  <div className="text-sm text-slate-500">Artículos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-sm font-bold mb-2">
                <TrendingUp className="h-4 w-4" />
                DESTACADOS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Proyectos Recientes
              </h2>
            </div>
            <button
              onClick={() => navigate('/portfolio')}
              className="hidden md:flex items-center gap-2 text-amber-500 hover:text-amber-600 font-medium transition-colors"
            >
              Ver todos
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/portfolio/${project.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white font-bold line-clamp-1">{project.title}</h3>
                      <p className="text-white/70 text-sm">{project.artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/portfolio')}
            className="md:hidden w-full mt-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            Ver todos los proyectos
          </button>
        </div>
      </section>

      {/* ===== RECENT ARTICLES ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-rose-500 text-sm font-bold mb-2">
                <BookOpen className="h-4 w-4" />
                BLOG
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Artículos Recientes
              </h2>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="hidden md:flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              Ver todos
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/5 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => navigate(`/blog/${article.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 mb-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-rose-500 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <img
                      src={article.authorAvatar}
                      alt={article.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/blog')}
            className="md:hidden w-full mt-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            Ver todos los artículos
          </button>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-blue-500 text-sm font-bold mb-2">
              <Zap className="h-4 w-4" />
              EXPLORA
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Encuentra tu especialidad
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Descubre contenido organizado por categorías y encuentra exactamente lo que buscas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORY_ITEMS.filter(item => item.label !== 'Home').slice(0, 8).map((item) => (
              <button
                key={item.label}
                onClick={() => onCategorySelect?.(item.label)}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] hover:border-amber-500/50 dark:hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all hover:scale-105"
              >
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                  <item.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            ¿Listo para mostrar tu trabajo al mundo?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Únete a miles de creativos latinoamericanos que ya están compartiendo su talento y construyendo su red profesional.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
            >
              Crear mi Portafolio
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
            >
              Conocer más
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
