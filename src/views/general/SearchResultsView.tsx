
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Loader2, Layers, Newspaper, User, Filter, ArrowLeft, X } from 'lucide-react';
import { searchService, SearchResult } from '../../services/modules/search';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { BlogCard } from '../../components/cards/BlogCard';
import { projectsService } from '../../services/modules/projects';
import { articlesService } from '../../services/modules/articles';
import { usersService } from '../../services/modules/users';
import { PortfolioItem, ArticleItem } from '../../types';

type FilterType = 'all' | 'project' | 'article' | 'user';

interface SearchResultsViewProps {
  query?: string;
  onItemSelect?: (id: string, type: 'portfolio' | 'blog' | 'user') => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ onItemSelect }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Full data for cards
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Search on query change
  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchService.search(query.trim(), {
          maxResults: 50,
          type: activeFilter
        });
        setResults(searchResults);

        // Fetch full details for each type
        await fetchFullDetails(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, activeFilter]);

  // Fetch full details for display in cards
  const fetchFullDetails = async (searchResults: SearchResult[]) => {
    setLoadingDetails(true);
    try {
      const projectIds = searchResults.filter(r => r.type === 'project').map(r => r.id);
      const articleIds = searchResults.filter(r => r.type === 'article').map(r => r.id);
      const userResults = searchResults.filter(r => r.type === 'user');

      // Fetch projects
      if (projectIds.length > 0) {
        const projectsData = await projectsService.getProjectsByIds(projectIds);
        setProjects(projectsData);
      } else {
        setProjects([]);
      }

      // Fetch articles
      if (articleIds.length > 0) {
        const articlesData = await articlesService.getArticlesByIds(articleIds);
        setArticles(articlesData);
      } else {
        setArticles([]);
      }

      // For users, we already have basic info from search, but fetch full profiles
      if (userResults.length > 0) {
        const userProfiles = await Promise.all(
          userResults.map(u => usersService.getUserProfile(u.id))
        );
        setUsers(userProfiles.filter(u => u !== null));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const projectResults = results.filter(r => r.type === 'project');
  const articleResults = results.filter(r => r.type === 'article');
  const userResults = results.filter(r => r.type === 'user');

  const filterOptions: { id: FilterType; label: string; icon: typeof Layers; count: number }[] = [
    { id: 'all', label: 'Todos', icon: Search, count: results.length },
    { id: 'project', label: 'Proyectos', icon: Layers, count: projectResults.length },
    { id: 'article', label: 'Artículos', icon: Newspaper, count: articleResults.length },
    { id: 'user', label: 'Usuarios', icon: User, count: userResults.length },
  ];

  const hasResults = results.length > 0;

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in bg-[#1c1c21] min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Resultados de búsqueda
        </h1>
        {query && (
          <p className="text-slate-400">
            {loading ? 'Buscando...' : `${results.length} resultados para`}{' '}
            <span className="text-amber-500 font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar proyectos, artículos, usuarios, programas..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-24 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-6">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeFilter === filter.id
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
          >
            <filter.icon className="h-4 w-4" />
            <span>{filter.label}</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${activeFilter === filter.id
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-slate-500'
              }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {(loading || loadingDetails) && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
        </div>
      )}

      {/* No Query State */}
      {!query && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">¿Qué estás buscando?</h2>
          <p className="text-slate-400 max-w-md">
            Escribe el nombre de un proyecto, artículo, usuario, programa (como ZBrush, Blender) o categoría.
          </p>
        </div>
      )}

      {/* No Results State */}
      {query && !loading && !loadingDetails && !hasResults && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No encontramos resultados para "{query}"
          </h2>
          <p className="text-slate-400 max-w-md mb-6">
            Intenta con otras palabras clave o revisa la ortografía. También puedes navegar por las categorías.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/portfolio')}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              Ver Portafolio
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              Ver Blog
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !loadingDetails && hasResults && (
        <div className="space-y-12">

          {/* Projects Section */}
          {(activeFilter === 'all' || activeFilter === 'project') && projects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Layers className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Proyectos <span className="text-slate-500 font-normal">({projects.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {projects.map((project) => (
                  <PortfolioCard
                    key={project.id}
                    item={project}
                    onClick={() => {
                      onItemSelect?.(project.id, 'portfolio');
                      navigate(`/portfolio/${project.slug || project.id}`);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Articles Section */}
          {(activeFilter === 'all' || activeFilter === 'article') && articles.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <Newspaper className="h-5 w-5 text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Artículos <span className="text-slate-500 font-normal">({articles.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                  <BlogCard
                    key={article.id}
                    article={article}
                    onClick={() => {
                      onItemSelect?.(article.id, 'blog');
                      navigate(`/blog/${article.slug || article.id}`);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Users Section */}
          {(activeFilter === 'all' || activeFilter === 'user') && users.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Usuarios <span className="text-slate-500 font-normal">({users.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onItemSelect?.(user.id, 'user');
                      navigate(`/user/${user.username || user.id}`);
                    }}
                    className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-left"
                  >
                    <img
                      src={user.avatar || user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">
                        @{user.username || user.id?.slice(0, 8)}
                      </p>
                      {user.role || user.profession ? (
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {user.role || user.profession}
                        </p>
                      ) : null}
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 text-[10px] rounded ${skill.toLowerCase().includes(query.toLowerCase())
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-white/5 text-slate-400'
                                }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
