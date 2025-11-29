
import React, { useState, useRef, useEffect } from 'react';
import { Menu, UploadCloud, Bell, Plus, FileText, Layers, Video, Box, Users, Search, Command, Briefcase, MessageCircleQuestion, CalendarDays, Heart, UserPlus, Check, ShoppingCart, Building2 } from 'lucide-react';
import { Notification } from '../types';
import { ContentMode } from '../hooks/useAppStore';

interface HeaderProps {
  onMenuClick?: () => void;
  activeCategory?: string;
  onCreateAction?: (actionId: string) => void;
  onLogoClick?: () => void;
  onSearch?: (query: string) => void;
  cartCount?: number;
  onCartClick?: () => void;
  notifications?: Notification[];
  onMarkRead?: (id: number) => void;
  onMarkAllRead?: () => void;
  contentMode?: ContentMode;
}

export const Header = ({ 
  onMenuClick, 
  activeCategory = 'Home', 
  onCreateAction, 
  onLogoClick,
  onSearch,
  cartCount = 0,
  onCartClick,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  contentMode = 'creative'
}: HeaderProps) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch?.(searchQuery);
      setIsSearchFocused(false);
    }
  };

  const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBg = contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500';
  const accentHoverText = contentMode === 'dev' ? 'group-hover:text-blue-500' : 'group-hover:text-amber-500';
  const accentRing = contentMode === 'dev' ? 'ring-blue-500/20' : 'ring-amber-500/20';
  const accentBorder = contentMode === 'dev' ? 'border-blue-500/50' : 'border-amber-500/50';
  const shadowColor = contentMode === 'dev' ? 'shadow-blue-500/20' : 'shadow-amber-500/20';

  const createOptions = [
    { id: 'article', icon: FileText, label: 'Escribir Artículo', desc: 'Blog', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'portfolio', icon: Layers, label: 'Subir Proyecto', desc: 'Portafolio', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'course', icon: Video, label: 'Crear Curso', desc: 'Educación', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'asset', icon: Box, label: 'Vender Asset', desc: 'Mercado', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'service', icon: Briefcase, label: 'Ofrecer Servicio', desc: 'Freelance', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'service', icon: Building2, label: 'Publicar Empleo', desc: 'Jobs', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'project', icon: Users, label: 'Reclutar Equipo', desc: 'Proyectos', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'forum', icon: MessageCircleQuestion, label: 'Preguntar', desc: 'Foro', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'event', icon: CalendarDays, label: 'Publicar Evento', desc: 'Eventos', color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#030304]/80 px-6 md:px-8 backdrop-blur-xl absolute top-0 right-0 left-0 z-40 transition-colors">
      
      {/* LEFT: Logo & Mobile Menu */}
      <div className="flex items-center gap-5 w-1/3">
        <button onClick={onMenuClick} className="xl:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1">
          <Menu className="h-6 w-6" />
        </button>
        <button onClick={onLogoClick} className="flex flex-col hover:opacity-80 transition-opacity text-left">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">Latam<span className={accentText}>.</span>Creativa</span>
        </button>
      </div>

      {/* CENTER: Global Search Bar */}
      <div className="hidden md:flex justify-center w-1/3">
        <div className={`relative w-full max-w-md transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 transition-colors ${isSearchFocused ? accentText : 'text-slate-400'}`} />
            </div>
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Buscar artistas, cursos, assets..." 
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`block w-full pl-10 pr-12 py-2.5 border rounded-2xl text-sm font-medium transition-all ${
                    isSearchFocused 
                    ? `bg-white dark:bg-[#0A0A0C] ${accentBorder} ring-2 ${accentRing} text-slate-900 dark:text-white` 
                    : 'bg-slate-100 dark:bg-white/[0.05] border-transparent text-slate-600 dark:text-slate-300'
                } placeholder-slate-400 focus:outline-none`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10 bg-slate-200 dark:bg-white/5">
                    <Command className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">K</span>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center justify-end gap-3 md:gap-4 w-1/3">
        {/* Shopping Cart */}
        <button 
            onClick={onCartClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white group" 
            title="Carrito"
        >
          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className={`absolute top-2 right-2 h-3.5 w-3.5 rounded-full ${accentBg} ring-2 ring-white dark:ring-[#030304] flex items-center justify-center text-[8px] font-bold text-white`}>
                {cartCount}
            </span>
          )}
        </button>

        <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white group" title="Subir Rápido">
          <UploadCloud className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </button>
        
        {/* NOTIFICATIONS DROPDOWN */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors group ${
                    isNotificationsOpen 
                    ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                <Bell className={`h-5 w-5 ${isNotificationsOpen ? 'fill-current' : ''} group-hover:rotate-12 transition-transform`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#030304] flex items-center justify-center text-[9px] font-bold text-white">
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
                                    onClick={() => onMarkRead?.(notif.id)}
                                    className={`p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-amber-50/50 dark:bg-white/[0.03]' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        <img src={notif.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1A1A1C] rounded-full p-0.5 border border-slate-100 dark:border-white/10">
                                            {notif.type === 'comment' && <div className="bg-blue-500 rounded-full p-0.5"><FileText className="h-2 w-2 text-white"/></div>}
                                            {notif.type === 'follow' && <div className="bg-purple-500 rounded-full p-0.5"><UserPlus className="h-2 w-2 text-white"/></div>}
                                            {notif.type === 'like' && <div className="bg-red-500 rounded-full p-0.5"><Heart className="h-2 w-2 text-white fill-white"/></div>}
                                            {notif.type === 'system' && <div className="bg-green-500 rounded-full p-0.5"><Check className="h-2 w-2 text-white"/></div>}
                                            {notif.type === 'purchase' && <div className="bg-emerald-500 rounded-full p-0.5"><ShoppingCart className="h-2 w-2 text-white"/></div>}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900 dark:text-white leading-snug">
                                            <span className="font-bold">{notif.user}</span> {notif.content}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                                    </div>
                                    {!notif.read && <div className={`h-2 w-2 rounded-full ${accentBg} mt-1.5 shrink-0`}></div>}
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
        
        {/* CREATE BUTTON & DROPDOWN */}
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                className={`hidden md:flex rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 items-center gap-2 ${
                    isCreateMenuOpen 
                    ? `${accentBg} text-white shadow-lg ${shadowColor}` 
                    : 'bg-slate-900 dark:bg-white text-white dark:text-black'
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
                                    onCreateAction?.(item.id);
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
      </div>
    </header>
  );
};
