
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, X, Code, Palette, ChevronDown, ChevronRight, User, DollarSign, LogOut, Search, Loader2, Layers, Newspaper } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { PRIMARY_NAV_ITEMS, NAV_SECTIONS, NAV_SECTIONS_DEV, SUBSCRIPTIONS } from '../../data/navigation';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';
import { usersService } from '../../services/modules/users';
import { searchService, SearchResult } from '../../services/modules/search';

interface PrimarySidebarProps {
  activeModule?: string;
  onModuleSelect?: (moduleId: string) => void;
  contentMode: ContentMode;
  onToggleContentMode: () => void;
}

export const PrimarySidebar = ({ activeModule = 'portfolio', onModuleSelect, contentMode, onToggleContentMode }: PrimarySidebarProps) => {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();
  const { user } = state;
  // Active state colors based on mode
  const activeColorClass = contentMode === 'dev'
    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
    : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20';

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="hidden flex-col border-r border-white/10 md:flex z-50 bg-[#050506] w-[72px] 2xl:w-[88px] h-screen sticky top-0 transition-all duration-300">

      {/* Scrollable Navigation Area */}
      <div className="flex-1 flex flex-col w-full min-h-0 py-2 2xl:py-8">
        <nav className="flex-1 flex flex-col items-center w-full justify-evenly 2xl:justify-start 2xl:gap-5 min-h-0">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            const hoverClass = contentMode === 'dev'
              ? 'hover:bg-blue-500/10 hover:text-blue-500'
              : 'hover:bg-amber-500/10 hover:text-amber-500';

            return (
              <div key={item.id} className="relative group flex items-center justify-center visible">
                <button
                  onClick={() => onModuleSelect?.(item.id)}
                  className={`group flex transition-all duration-200 hover:scale-110 active:scale-95 w-7 h-7 2xl:w-12 2xl:h-12 rounded-lg 2xl:rounded-2xl items-center justify-center ${isActive
                    ? (contentMode === 'dev' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20')
                    : `text-neutral-500 ${hoverClass}`
                    }`}
                >
                  <item.icon className="w-[16px] h-[16px] 2xl:w-[26px] 2xl:h-[26px]" strokeWidth={1.5} />
                </button>
                {/* Coming Soon Badge */}
                {item.comingSoon && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                )}
                {/* Tooltip */}
                <div className={`absolute left-14 px-3 py-1.5 rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] ${contentMode === 'dev' ? 'bg-blue-600' : 'bg-amber-600'}`}>
                  {item.label}{item.comingSoon && ' (Próximamente)'}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="flex flex-col gap-2 2xl:gap-5 items-center pb-4 2xl:pb-8 shrink-0 bg-gradient-to-t from-[#050506] to-transparent w-full z-10" ref={profileMenuRef}>

        {/* Toggle Mode Button */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={onToggleContentMode}
            className={`group flex transition-all duration-200 hover:scale-110 active:scale-95 w-7 h-7 2xl:w-12 2xl:h-12 rounded-lg 2xl:rounded-2xl items-center justify-center text-white shadow-lg ${contentMode === 'dev'
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20'
              : 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/20'
              }`}
          >
            {contentMode === 'dev' ? <Code className="w-3.5 h-3.5 2xl:w-6 2xl:h-6" strokeWidth={2} /> : <Palette className="w-3.5 h-3.5 2xl:w-6 2xl:h-6" strokeWidth={2} />}
          </button>
          <div className={`absolute left-14 px-3 py-1.5 rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] ${contentMode === 'dev' ? 'bg-blue-600' : 'bg-amber-600'}`}>
            {contentMode === 'dev' ? 'Ir a Modo Creativo' : 'Ir a Modo Developer'}
          </div>
        </div>



        {/* Profile Picture & Menu / Login Button */}
        <div className="relative">
          {user && (
            <>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-7 h-7 2xl:h-12 2xl:w-12 overflow-hidden rounded-lg 2xl:rounded-2xl ring-1 ring-white/10 transition-transform hover:scale-105 cursor-pointer block"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover opacity-90 hover:opacity-100"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-0 left-16 w-56 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-fade-in origin-bottom-left">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                      <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email || 'Usuario'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onModuleSelect?.('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Mi Perfil
                  </button>

                  <button
                    onClick={() => {
                      onModuleSelect?.('earnings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    Mis Ganancias
                  </button>

                  <button
                    onClick={() => {
                      onModuleSelect?.('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Configuración
                  </button>

                  {/* Admin Dashboard - Only for Admins */}
                  {(user.isAdmin || user.email === 'admin@latamcreativa.com') && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-amber-500" />
                      Panel Admin
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      // 1. Optimistic UI update: Clear user immediately
                      actions.setUser(null);
                      // 2. Perform Firebase SignOut
                      await signOut(auth);
                      setIsProfileOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

interface SecondarySidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onSubscriptionSelect?: (authorName: string) => void;
  onProClick?: () => void;
  activeModule?: string;
  onModuleSelect?: (moduleId: string) => void;
  hiddenOnDesktop?: boolean;
  contentMode: ContentMode;
  onToggleContentMode: () => void;
}

export const SecondarySidebar = ({
  isOpen,
  onClose,
  activeCategory,
  onCategorySelect,
  onSubscriptionSelect,
  onProClick,
  activeModule,
  onModuleSelect,
  hiddenOnDesktop,
  contentMode,
  onToggleContentMode
}: SecondarySidebarProps) => {
  const { state } = useAppStore();
  const { user } = state;
  const navigate = useNavigate();

  // State for expanded menu items
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  // State for real subscriptions
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // State for mobile search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load expanded items from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('latamcreativa_menu_expanded');
      if (saved) {
        setExpandedItems(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Error loading expanded items from localStorage:', error);
    }
  }, []);

  // Save expanded items to localStorage when they change
  useEffect(() => {
    try {
      if (expandedItems.length > 0) {
        localStorage.setItem('latamcreativa_menu_expanded', JSON.stringify(expandedItems));
      }
    } catch (error) {
      console.warn('Error saving expanded items to localStorage:', error);
    }
  }, [expandedItems]);

  // Fetch Subscriptions
  useEffect(() => {
    const fetchSubs = async () => {
      if (!user) {
        setSubscriptions([]);
        return;
      }

      try {
        setLoadingSubs(true);
        const followingIds = await usersService.getFollowing(user.id);

        if (followingIds.length > 0) {
          // Fetch profiles in parallel
          const profilesPromises = followingIds.map(id => usersService.getUserProfile(id));
          const profiles = await Promise.all(profilesPromises);
          setSubscriptions(profiles.filter(p => p !== null));
        } else {
          setSubscriptions([]);
        }
      } catch (error) {
        console.error("Error loading subscriptions", error);
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchSubs();
  }, [user, state.subscriptionsTimestamp]); // Refetch when user changes OR timestamp updates

  // Debounced search effect for mobile
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchService.search(searchQuery.trim(), { maxResults: 6 });
        setSearchResults(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    setShowSuggestions(false);
    setSearchQuery('');
    onClose?.();

    switch (result.type) {
      case 'project':
        navigate(`/portfolio/${result.slug || result.id}`);
        break;
      case 'article':
        navigate(`/blog/${result.slug || result.id}`);
        break;
      case 'user':
        navigate(`/user/${result.username || result.id}`);
        break;
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
      onClose?.();
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return <Layers className="h-4 w-4" />;
      case 'article':
        return <Newspaper className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return 'Proyecto';
      case 'article':
        return 'Artículo';
      case 'user':
        return 'Usuario';
    }
  };

  // Switch sections based on mode
  const currentNavSections = contentMode === 'dev' ? NAV_SECTIONS_DEV : NAV_SECTIONS;

  const activeItemClass = contentMode === 'dev'
    ? 'bg-blue-500/10 ring-1 ring-inset ring-blue-500/20 text-blue-600 dark:text-blue-400'
    : 'bg-amber-500/10 ring-1 ring-inset ring-amber-500/20 text-amber-600 dark:text-amber-400';

  const activeIconClass = contentMode === 'dev'
    ? 'text-blue-500 dark:text-blue-400 bg-blue-500/20'
    : 'text-amber-500 dark:text-amber-400 bg-amber-500/20';

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  return (
    <>
      {/* Backdrop for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm xl:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 z-40 flex flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#08080A]
        transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        left-0 md:left-[88px] xl:left-0
        w-[85vw] max-w-[300px] md:w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${hiddenOnDesktop ? 'xl:hidden' : (isOpen ? 'xl:w-72 xl:translate-x-0 xl:static xl:bg-white/50 dark:xl:bg-[#08080A]/50 xl:backdrop-blur-md xl:h-screen xl:sticky xl:top-0' : 'xl:w-0 xl:translate-x-0 xl:static xl:border-none xl:overflow-hidden')}
      `}>
        <div className="flex h-20 items-center justify-between border-b border-slate-200 dark:border-white/[0.06] px-6 shrink-0 transition-colors">
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Menú {contentMode === 'dev' && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded ml-2">DEV</span>}</span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-5">

          {/* MOBILE SEARCH BAR */}
          <div className="relative mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader2 className={`h-4 w-4 animate-spin ${contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500'}`} />
                ) : (
                  <Search className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Buscar proyectos, artículos..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all ${showSuggestions
                  ? `bg-white dark:bg-[#0A0A0C] ${contentMode === 'dev' ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-amber-500/50 ring-2 ring-amber-500/20'} text-slate-900 dark:text-white`
                  : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-300'
                  } placeholder-slate-400 focus:outline-none`}
              />
            </div>

            {/* Search Results Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                {searchResults.length > 0 ? (
                  <div className="max-h-[280px] overflow-y-auto">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {searchResults.length} resultados
                      </span>
                    </div>
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group border-b border-slate-50 dark:border-white/5 last:border-b-0"
                      >
                        {/* Thumbnail */}
                        <div className={`w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${result.image ? '' : 'bg-slate-100 dark:bg-white/10'}`}>
                          {result.image ? (
                            <img
                              src={result.image}
                              alt=""
                              className={`w-full h-full object-cover ${result.type === 'user' ? 'rounded-full' : ''}`}
                            />
                          ) : (
                            <div className={`${result.type === 'project' ? 'text-amber-500' : result.type === 'article' ? 'text-rose-500' : 'text-blue-500'}`}>
                              {getResultIcon(result.type)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {result.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {result.subtitle}
                          </div>
                        </div>

                        {/* Type Badge */}
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded flex-shrink-0 ${result.type === 'project'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : result.type === 'article'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                          {getResultTypeLabel(result.type)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <Search className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Sin resultados para "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE ONLY: Primary Module Selection */}
          <div className="md:hidden mb-8">
            <h3 className="uppercase text-xs font-semibold text-slate-500 tracking-widest mb-4 px-2">Navegación Principal</h3>
            <div className="grid grid-cols-3 gap-2">
              {PRIMARY_NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onModuleSelect?.(item.id);
                    onClose?.();
                  }}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-colors ${activeModule === item.id
                    ? activeItemClass
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="h-px w-full bg-slate-200 dark:bg-white/10 my-6"></div>
          </div>



          {/* SECTIONED NAVIGATION */}
          <div className="space-y-8">
            {currentNavSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-3 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeCategory === item.label;
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isExpanded = expandedItems.includes(item.label);

                    // DEBUG RENDER


                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (hasSubItems) {
                              toggleExpand(item.label);
                            }
                            // Navigate to SEO-friendly route if slug exists
                            if (item.slug && item.slug !== 'home') {
                              const basePath = activeModule === 'blog' ? '/blog' : '/portfolio';
                              navigate(`${basePath}/categoria/${item.slug}`);
                              onClose?.();
                            } else if (item.slug === 'home') {
                              const basePath = activeModule === 'blog' ? '/blog' : '/portfolio';
                              navigate(basePath);
                              onClose?.();
                            } else {
                              onCategorySelect(item.label);
                              if (!hasSubItems) onClose?.();
                            }
                          }}
                          className={`w-full group flex items-center gap-3 rounded-xl p-2.5 px-3 transition-all cursor-pointer ${isActive
                            ? activeItemClass
                            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-400'
                            }`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? activeIconClass : 'text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-white/5 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                            }`}>
                            <item.icon className="h-4 w-4" strokeWidth={2} />
                          </div>
                          <div className="flex flex-1 flex-col min-w-0 text-left">
                            <h4 className={`text-sm font-medium truncate ${isActive ? 'text-slate-900 dark:text-white' : 'group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                              {item.label}
                            </h4>
                            <p className="text-[10px] truncate opacity-60">
                              {item.subLabel}
                            </p>
                          </div>
                          {hasSubItems && (
                            <div className="text-slate-400">
                              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </div>
                          )}
                        </button>

                        {/* Sub Items Menu */}
                        {isExpanded && hasSubItems && (
                          <div className="ml-11 mt-1 space-y-1 border-l-2 border-slate-100 dark:border-white/5 pl-2 animate-fade-in">
                            {item.subItems?.map(sub => (
                              <button
                                key={sub}
                                onClick={() => {
                                  onCategorySelect(sub);
                                  onClose?.();
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${activeCategory === sub
                                  ? (contentMode === 'dev' ? 'text-blue-500 bg-blue-500/10' : 'text-amber-500 bg-amber-500/10')
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                  }`}
                              >
                                <span className={`w-1 h-1 rounded-full ${activeCategory === sub ? (contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500') : 'bg-slate-400'}`}></span>
                                {sub}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent my-8"></div>

          {/* Subscriptions */}
          <div className="mb-8">
            <h3 className="uppercase text-xs font-semibold text-slate-500 tracking-widest mb-4 px-2">
              Suscripciones {loadingSubs && <span className="ml-2 opacity-50 animate-pulse">...</span>}
            </h3>

            <div className="space-y-3">
              {user && subscriptions.length === 0 && !loadingSubs && (
                <div className="px-2 text-sm text-slate-500 italic">No sigues a nadie aún.</div>
              )}

              {user && subscriptions.map((sub) => (
                <a
                  key={sub.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubscriptionSelect?.(sub.name);
                    navigate(`/user/${encodeURIComponent(sub.username || sub.name)}`, { state: { author: sub } });
                    onClose?.();
                  }}
                  className="group flex items-center gap-4 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-white/10">
                    <img src={sub.avatar || sub.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.name)}&background=random`} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" alt={sub.name} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{sub.name}</div>
                    {/* Assume users can be live if property exists, ignoring for now as not in profile usually */}
                    {/* {sub.isLive && <div className={`truncate text-xs font-medium ${contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500'}`}>En vivo</div>} */}
                  </div>
                  {/* {sub.isLive && <div className={`h-2 w-2 rounded-full ${contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>} */}
                </a>
              ))}

              {!user && (
                <div className="px-2 text-sm text-slate-500">Inicia sesión para ver tus suscripciones.</div>
              )}
            </div>
          </div>

          {/* MOBILE ONLY: User Profile & Settings */}
          <div className="md:hidden border-t border-slate-200 dark:border-white/10 pt-6 mb-6">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div
                className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
                onClick={() => {
                  if (!user) {
                    onModuleSelect?.('auth');
                  } else {
                    onModuleSelect?.('profile');
                    onClose?.();
                  }
                }}
              >
                <img
                  src={user ? user.avatar : "https://ui-avatars.com/api/?name=Guest&background=random"}
                  alt="User"
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user ? user.name : 'Invitado'}</h4>
                  <p className="text-xs text-slate-500">{user ? 'Ver perfil' : 'Iniciar Sesión'}</p>
                </div>
              </div>
              <button
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"
                onClick={() => {
                  onModuleSelect?.('settings');
                  onClose?.();
                }}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Added Earnings Button for Mobile */}
            <button
              onClick={() => {
                onModuleSelect?.('earnings');
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors mb-2"
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Mis Ganancias</span>
            </button>

            {/* Admin Dashboard - Mobile */}
            {user && (user.isAdmin || user.email === 'admin@latamcreativa.com') && (
              <button
                onClick={() => {
                  navigate('/admin');
                  onClose?.();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors mb-2"
              >
                <Settings className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">Panel Admin</span>
              </button>
            )}

            <button
              onClick={() => {
                onToggleContentMode();
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors mb-2"
            >
              {contentMode === 'dev' ? <Palette className="h-5 w-5" /> : <Code className="h-5 w-5" />}
              <span className="text-sm font-medium">{contentMode === 'dev' ? 'Modo Creativo' : 'Modo Developer'}</span>
            </button>
          </div>

        </div>

        {/* Pro Card */}
        <div className="p-5 mt-auto">
          <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-5 ${contentMode === 'dev' ? 'bg-gradient-to-br from-blue-900/80 to-blue-900/60' : 'bg-gradient-to-br from-amber-900/80 to-amber-900/60'}`}>
            <div className="relative z-10">
              <h4 className="mb-1.5 text-base font-semibold text-white">Mejorar a Pro</h4>
              <p className={`mb-4 text-sm ${contentMode === 'dev' ? 'text-blue-100/80' : 'text-amber-100/80'}`}>Desbloquea streaming 4K y descargas ilimitadas.</p>
              <button
                onClick={() => {
                  navigate('/pro');
                  if (window.innerWidth < 1280) onClose?.();
                }}
                className="w-full rounded-lg bg-white/20 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/30"
              >
                Ver más
              </button>
            </div>
            <div className={`absolute -right-4 -top-4 h-28 w-28 rounded-full blur-xl ${contentMode === 'dev' ? 'bg-blue-500/20' : 'bg-amber-500/20'}`}></div>
          </div>
        </div>
      </aside>
    </>
  );
};
