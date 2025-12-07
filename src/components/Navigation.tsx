
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Search, X, Sliders, Code, Palette, ChevronDown, ChevronRight, User, DollarSign, LogOut } from 'lucide-react';
import { PRIMARY_NAV_ITEMS, NAV_SECTIONS, NAV_SECTIONS_DEV, SUBSCRIPTIONS } from '../data/navigation';
import { ContentMode } from '../hooks/useAppStore';

interface PrimarySidebarProps {
  activeModule?: string;
  onModuleSelect?: (moduleId: string) => void;
  contentMode: ContentMode;
  onToggleContentMode: () => void;
}

export const PrimarySidebar = ({ activeModule = 'portfolio', onModuleSelect, contentMode, onToggleContentMode }: PrimarySidebarProps) => {
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
    <aside className="hidden flex-col border-r border-slate-200 dark:border-white/[0.06] md:flex z-50 bg-white/90 dark:bg-[#050506]/90 w-[72px] 2xl:w-[88px] h-screen sticky top-0 transition-all duration-300">

      {/* Scrollable Navigation Area */}
      <div className="flex-1 flex flex-col w-full overflow-y-auto scrollbar-hide pt-4 pb-2 2xl:pt-8 2xl:pb-8">
        <nav className="flex flex-col gap-2 2xl:gap-5 items-center w-full justify-start">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <div key={item.id} className="relative group flex items-center justify-center shrink-0">
                <button
                  onClick={() => onModuleSelect?.(item.id)}
                  className={`group flex transition-all duration-200 hover:scale-110 active:scale-95 w-9 h-9 2xl:w-12 2xl:h-12 rounded-xl 2xl:rounded-2xl items-center justify-center ${isActive
                    ? activeColorClass
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                  <item.icon className="w-[18px] h-[18px] 2xl:w-[26px] 2xl:h-[26px]" strokeWidth={1.5} />
                </button>
                {/* Tooltip */}
                <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="flex flex-col gap-3 2xl:gap-5 items-center pb-4 2xl:pb-8 shrink-0 bg-gradient-to-t from-white dark:from-[#050506] to-transparent w-full z-10" ref={profileMenuRef}>

        {/* Toggle Mode Button */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={onToggleContentMode}
            className={`group flex transition-all duration-200 hover:scale-110 active:scale-95 w-9 h-9 2xl:w-12 2xl:h-12 rounded-xl 2xl:rounded-2xl items-center justify-center ${contentMode === 'dev'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              }`}
          >
            {contentMode === 'dev' ? <Code className="w-[18px] h-[18px] 2xl:w-6 2xl:h-6" /> : <Palette className="w-[18px] h-[18px] 2xl:w-6 2xl:h-6" />}
          </button>
          <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
            {contentMode === 'dev' ? 'Ir a Modo Creativo' : 'Ir a Modo Developer'}
          </div>
        </div>

        {/* Settings Button */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={() => onModuleSelect?.('settings')}
            className={`group flex w-9 h-9 2xl:w-12 2xl:h-12 items-center justify-center rounded-xl 2xl:rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 ${activeModule === 'settings'
              ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
          >
            <Settings className="h-[18px] w-[18px] 2xl:h-6 2xl:w-6" strokeWidth={1.5} />
          </button>
          <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
            Configuración
          </div>
        </div>

        {/* Profile Picture & Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 2xl:h-12 2xl:w-12 overflow-hidden rounded-xl 2xl:rounded-2xl ring-1 ring-slate-200 dark:ring-white/10 transition-transform hover:scale-105 cursor-pointer block"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="User"
              className="h-full w-full object-cover opacity-90 hover:opacity-100"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-0 left-16 w-56 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-fade-in origin-bottom-left">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Alex Motion</p>
                  <p className="text-[10px] text-slate-500 truncate">alex@latam.creativa</p>
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

              <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>

              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
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
  // State for expanded menu items
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
        transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        left-0 md:left-[88px] xl:left-0
        w-[85vw] max-w-[300px] md:w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${hiddenOnDesktop ? 'xl:hidden' : 'xl:static xl:translate-x-0 xl:bg-white/50 dark:xl:bg-[#08080A]/50 xl:backdrop-blur-md xl:h-screen xl:sticky xl:top-0'}
      `}>
        <div className="flex h-20 items-center justify-between border-b border-slate-200 dark:border-white/[0.06] px-6 shrink-0 transition-colors">
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Menú {contentMode === 'dev' && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded ml-2">DEV</span>}</span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white xl:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-5">

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

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              className={`w-full rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 outline-none transition-all focus:bg-white dark:focus:bg-white/[0.06] focus:ring-1 ${contentMode === 'dev' ? 'focus:border-blue-500/30 focus:ring-blue-500/30' : 'focus:border-amber-500/30 focus:ring-amber-500/30'}`}
            />
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

                    return (
                      <div key={item.label}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (hasSubItems) {
                              toggleExpand(item.label);
                              onCategorySelect(item.label);
                            } else {
                              onCategorySelect(item.label);
                              onClose?.();
                            }
                          }}
                          className={`group flex items-center gap-3 rounded-xl p-2.5 px-3 transition-all cursor-pointer ${isActive
                            ? activeItemClass
                            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-400'
                            }`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? activeIconClass : 'text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-white/5 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                            }`}>
                            <item.icon className="h-4 w-4" strokeWidth={2} />
                          </div>
                          <div className="flex flex-1 flex-col min-w-0">
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
                        </a>

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
            <h3 className="uppercase text-xs font-semibold text-slate-500 tracking-widest mb-4 px-2">Suscripciones</h3>
            <div className="space-y-3">
              {SUBSCRIPTIONS.map((sub) => (
                <a
                  key={sub.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubscriptionSelect?.(sub.name);
                    onClose?.(); // Auto close on mobile
                  }}
                  className="group flex items-center gap-4 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-white/10">
                    <img src={sub.image} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" alt={sub.name} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{sub.name}</div>
                    {sub.isLive && <div className={`truncate text-xs font-medium ${contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500'}`}>En vivo</div>}
                  </div>
                  {sub.isLive && <div className={`h-2 w-2 rounded-full ${contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>}
                </a>
              ))}
            </div>
          </div>

          {/* MOBILE ONLY: User Profile & Settings */}
          <div className="md:hidden border-t border-slate-200 dark:border-white/10 pt-6 mb-6">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div
                className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
                onClick={() => {
                  onModuleSelect?.('profile');
                  onClose?.();
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="User"
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Alex Motion</h4>
                  <p className="text-xs text-slate-500">Ver perfil</p>
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
                  onProClick?.();
                  onClose?.();
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
