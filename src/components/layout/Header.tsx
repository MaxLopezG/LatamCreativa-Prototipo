import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Plus, FileText, Layers, Search, Command, Heart, UserPlus, Check, ShoppingCart, Trash2, Sparkles, Loader2, User, Newspaper } from 'lucide-react';
import { Notification } from '../../types';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';
import { searchService, SearchResult } from '../../services/modules/search';

interface HeaderProps {
    onMenuClick?: () => void;
    onLogoClick?: () => void;
    notifications?: Notification[];
    onMarkRead?: (id: string | number) => void;
    onMarkAllRead?: () => void;
    contentMode?: ContentMode;
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
}

export const Header = ({
    onMenuClick,
    onLogoClick,
    notifications = [],
    onMarkRead,
    onMarkAllRead,
    contentMode = 'creative',
    onLoginClick,
    onRegisterClick
}: HeaderProps) => {
    const { state, actions } = useAppStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Ctrl+K Shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
                setIsSearchFocused(true);
            }
            // Escape to close search
            if (e.key === 'Escape') {
                setShowSuggestions(false);
                setIsSearchFocused(false);
                searchInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsCreateMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search effect
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
                const results = await searchService.search(searchQuery.trim(), { maxResults: 8 });
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

    const handleSearchSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
            setSearchQuery('');
            setIsSearchFocused(false);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        setShowSuggestions(false);
        setSearchQuery('');
        setIsSearchFocused(false);

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

    const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
    const accentBg = contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500';
    const accentHoverText = contentMode === 'dev' ? 'group-hover:text-blue-500' : 'group-hover:text-amber-500';
    const accentRing = contentMode === 'dev' ? 'ring-blue-500/20' : 'ring-amber-500/20';
    const accentBorder = contentMode === 'dev' ? 'border-blue-500/50' : 'border-amber-500/50';
    const shadowColor = contentMode === 'dev' ? 'shadow-blue-500/20' : 'shadow-amber-500/20';

    const createOptions = [
        { id: 'portfolio', icon: Layers, label: 'Subir Proyecto', desc: 'Añadir a tu portafolio', color: 'text-amber-500', bg: 'bg-amber-500/10', route: '/create/portfolio' },
        { id: 'article', icon: FileText, label: 'Escribir Artículo', desc: 'Publicar en el blog', color: 'text-blue-500', bg: 'bg-blue-500/10', route: '/create/article' },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0d0d0f]/80 px-4 md:px-8 backdrop-blur-xl absolute top-0 right-0 left-0 z-40 transition-colors">

            {/* LEFT: Logo & Mobile Menu */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 md:w-1/3 md:flex-none">
                <button
                    onClick={onMenuClick}
                    className={`text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 ${location.pathname === '/' ? 'md:hidden' : ''}`}
                >
                    <Menu className="h-6 w-6" />
                </button>
                <button onClick={onLogoClick} className="flex flex-col hover:opacity-80 transition-opacity text-left">
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">Latam<span className={accentText}>.</span>Creativa</span>
                </button>
            </div>

            {/* CENTER: Global Search Bar */}
            <div className="hidden md:flex justify-center w-1/3" ref={searchContainerRef}>
                <div className={`relative w-full max-w-md transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {isSearching ? (
                            <Loader2 className={`h-4 w-4 animate-spin ${accentText}`} />
                        ) : (
                            <Search className={`h-4 w-4 transition-colors ${isSearchFocused ? accentText : 'text-slate-400'}`} />
                        )}
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        placeholder="Buscar proyectos, artículos, usuarios..."
                        onFocus={() => {
                            setIsSearchFocused(true);
                            if (searchResults.length > 0) setShowSuggestions(true);
                        }}
                        className={`block w-full pl-10 pr-12 py-2.5 border rounded-2xl text-sm font-medium transition-all ${isSearchFocused
                            ? `bg-white dark:bg-[#18181b] ${accentBorder} ring-2 ${accentRing} text-slate-900 dark:text-white`
                            : 'bg-slate-100 dark:bg-white/[0.05] border-transparent text-slate-600 dark:text-slate-300'
                            } placeholder-slate-400 focus:outline-none`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10 bg-slate-200 dark:bg-white/5">
                            <Command className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">K</span>
                        </div>
                    </div>

                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                            {searchResults.length > 0 ? (
                                <div className="max-h-[400px] overflow-y-auto">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {searchResults.length} resultados
                                        </span>
                                    </div>
                                    {searchResults.map((result) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => handleResultClick(result)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group border-b border-slate-50 dark:border-white/5 last:border-b-0"
                                        >
                                            {/* Thumbnail */}
                                            <div className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center ${result.image ? '' : 'bg-slate-100 dark:bg-white/10'}`}>
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
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                                    {result.title}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {result.subtitle}
                                                </div>
                                            </div>

                                            {/* Type Badge */}
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full flex-shrink-0 ${result.type === 'project'
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
                                <div className="px-4 py-8 text-center">
                                    <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No se encontraron resultados para "{searchQuery}"
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Intenta con otros términos de búsqueda
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center justify-end gap-2 md:gap-4 flex-1 md:w-1/3 md:flex-none">
                {state.user && (
                    <>
                        {/* Shopping Cart */}
                        {/* Shopping Cart - HIDDEN */}
                        {/* <button
                            onClick={onCartClick}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white group"
                            title="Carrito"
                        >
                            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className={`absolute top-2 right-2 h-3.5 w-3.5 rounded-full ${accentBg} ring-2 ring-white dark:ring-[#0d0d0f] flex items-center justify-center text-[8px] font-bold text-white`}>
                                    {cartCount}
                                </span>
                            )}
                        </button> */}

                        {/* NOTIFICATIONS DROPDOWN */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors group ${isNotificationsOpen
                                    ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Bell className={`h-5 w-5 ${isNotificationsOpen ? 'fill-current' : ''} group-hover:rotate-12 transition-transform`} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0d0d0f] flex items-center justify-center text-[9px] font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute top-full right-0 mt-4 w-80 md:w-96 rounded-2xl bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 shadow-2xl z-50 animate-fade-in origin-top-right ring-1 ring-black/5 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                                        <span className="font-bold text-slate-900 dark:text-white">Notificaciones</span>
                                        <button onClick={onMarkAllRead} className={`text-xs ${accentText} font-medium hover:underline`}>Marcar todo como leído</button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 text-sm">No tienes notificaciones nuevas.</div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => {
                                                        onMarkRead?.(notif.id);
                                                        if (notif.link) {
                                                            navigate(notif.link);
                                                            setIsNotificationsOpen(false);
                                                        }
                                                    }}
                                                    className={`relative p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 group ${!notif.read ? 'bg-amber-50/50 dark:bg-white/[0.03]' : ''}`}
                                                >
                                                    <div className="relative shrink-0">
                                                        <img src={notif.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1A1A1C] rounded-full p-0.5 border border-slate-100 dark:border-white/10">
                                                            {notif.type === 'comment' && <div className="bg-blue-500 rounded-full p-0.5"><FileText className="h-2 w-2 text-white" /></div>}
                                                            {notif.type === 'follow' && <div className="bg-purple-500 rounded-full p-0.5"><UserPlus className="h-2 w-2 text-white" /></div>}
                                                            {notif.type === 'like' && <div className="bg-red-500 rounded-full p-0.5"><Heart className="h-2 w-2 text-white fill-white" /></div>}
                                                            {notif.type === 'system' && <div className="bg-green-500 rounded-full p-0.5"><Check className="h-2 w-2 text-white" /></div>}
                                                            {notif.type === 'purchase' && <div className="bg-emerald-500 rounded-full p-0.5"><ShoppingCart className="h-2 w-2 text-white" /></div>}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-slate-900 dark:text-white leading-snug">
                                                            <span className="font-bold">{notif.user}</span> {notif.content}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {notif.category && (
                                                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                                                                    {notif.category}
                                                                </span>
                                                            )}
                                                            <p className="text-xs text-slate-400">
                                                                {(() => {
                                                                    try {
                                                                        const date = new Date(notif.time);
                                                                        const now = new Date();
                                                                        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                                                                        if (diffInSeconds < 60) return 'Hace un momento';
                                                                        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
                                                                        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
                                                                        if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
                                                                        return date.toLocaleDateString();
                                                                    } catch (e) {
                                                                        return notif.time;
                                                                    }
                                                                })()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                                        {!notif.read && <div className={`h-2 w-2 rounded-full ${accentBg} mt-1.5 mb-1`}></div>}

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                actions.deleteNotification(notif.id);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Eliminar notificación"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-slate-100 dark:border-white/5 text-center">
                                        <button className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white py-1">Ver historial completo</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ml-1 hidden h-8 w-px bg-slate-200 dark:bg-white/10 md:block"></div>
                    </>
                )}

                {/* Login Button for Guests */}
                {!state.user && (
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={onLoginClick}
                            className={`flex rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 items-center gap-2 ${contentMode === 'dev'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                }`}
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Iniciar Sesión</span>
                        </button>
                        <button
                            onClick={onRegisterClick}
                            className="group flex rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 ring-1 ring-white/20"
                        >
                            <Sparkles className="h-4 w-4 text-amber-100 group-hover:text-white transition-colors" />
                            <span>Registrarse</span>
                        </button>
                    </div>
                )}

                {/* CREATE BUTTON & DROPDOWN */}
                {state.user && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                            className={`hidden md:flex rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 items-center gap-2 ${isCreateMenuOpen
                                ? `${accentBg} text-white shadow-lg ${shadowColor}`
                                : 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                                }`}
                        >
                            <Plus className={`h-4 w-4 transition-transform ${isCreateMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
                            <span>Crear</span>
                        </button>

                        {isCreateMenuOpen && (
                            <div className="absolute top-full right-0 mt-4 w-80 rounded-2xl bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 animate-fade-in origin-top-right ring-1 ring-black/5">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-2 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Publicar en</span>
                                    <span className="text-sm bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-500 font-mono">Esc</span>
                                </div>
                                <div className="space-y-1">
                                    {createOptions.map((item, idx) => (
                                        <button
                                            key={`${item.id}-${idx}`}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                                            onClick={() => {
                                                setIsCreateMenuOpen(false);
                                                if (!state.user) {
                                                    actions.showToast('Debes iniciar sesión para crear contenido', 'info');
                                                    navigate('/auth');
                                                    return;
                                                }
                                                navigate(item.route);
                                            }}
                                        >
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className={`text-sm font-bold text-slate-900 dark:text-white ${accentHoverText} transition-colors`}>{item.label}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};