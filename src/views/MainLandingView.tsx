import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, GraduationCap, Store, Newspaper, Users, ArrowRight, Zap, Globe, Shield, Briefcase, Quote } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

export const MainLandingView: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'portfolio',
      title: 'Portafolio',
      desc: 'Muestra tu trabajo al mundo e inspírate.',
      icon: ImageIcon,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      border: 'hover:border-pink-500/50'
    },
    {
      id: 'education',
      title: 'Educación',
      desc: 'Aprende nuevas habilidades con cursos expertos.',
      icon: GraduationCap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/50'
    },
    {
      id: 'market',
      title: 'Mercado',
      desc: 'Compra y vende assets de alta calidad.',
      icon: Store,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/50'
    },
    {
      id: 'freelance',
      title: 'Freelance',
      desc: 'Contrata expertos o vende tus servicios.',
      icon: Briefcase,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      border: 'hover:border-cyan-500/50'
    },
    {
      id: 'community',
      title: 'Proyectos',
      desc: 'Encuentra equipo y colabora en proyectos.',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/50'
    },
    {
      id: 'blog',
      title: 'Blog',
      desc: 'Noticias, tutoriales y artículos de la industria.',
      icon: Newspaper,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/50'
    }
  ];

  return (
    <div className="animate-fade-in">
      
      <div className="max-w-[1600px] mx-auto pb-20 px-4 md:px-6">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0C] border border-white/10 mt-6 min-h-[500px] flex items-center shadow-2xl">
          
          {/* Mobile Background Image (Subtle) */}
          <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 lg:hidden"
              alt="Background"
          />

          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
          
          <div className="relative z-10 px-6 md:px-16 w-full max-w-4xl py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
              <Zap className="h-3 w-3 text-amber-500" /> La Plataforma #1 para Artistas
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              El ecosistema definitivo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Creativos Digitales</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed drop-shadow-md">
              Conecta, aprende, vende y colabora en un solo lugar. Latam Creativa unifica todas las herramientas que necesitas para impulsar tu carrera artística.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 w-full md:w-auto"
              >
                  Explorar Portafolios
              </button>
              <button 
                  onClick={() => navigate('/community')}
                  className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-md w-full md:w-auto"
              >
                  Unirse a la Comunidad
              </button>
            </div>
          </div>

          {/* Decorative Grid/Image on Right (Hidden on mobile) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block mask-linear-fade pointer-events-none">
              <div className="grid grid-cols-2 gap-4 opacity-40 transform rotate-12 scale-125 translate-x-20 -translate-y-20">
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 shadow-xl">
                          <img src={`https://images.unsplash.com/photo-${1550000000000 + i * 100000}-a83a8bd57fbe?q=80&w=400&fit=crop`} className="w-full h-full object-cover" alt="" />
                      </div>
                  ))}
              </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-10 py-12 border-b border-slate-200 dark:border-white/5">
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">50k+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Artistas Activos</div>
            </div>
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">1200+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Cursos Online</div>
            </div>
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">$2M+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Pagado a Creadores</div>
            </div>
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">25+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Países</div>
            </div>
        </div>

        {/* Services Grid */}
        <div className="py-16">
          <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Todo lo que necesitas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service) => (
                  <div 
                      key={service.id}
                      onClick={() => navigate(`/${service.id}`)}
                      className={`group relative p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 ${service.border}`}
                  >
                      <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                          <service.icon className={`h-7 w-7 ${service.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors">
                          {service.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                          {service.desc}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group-hover:gap-4 transition-all">
                          Explorar <ArrowRight className="h-4 w-4" />
                      </div>
                  </div>
              ))}
              
              {/* Pro Card */}
              <div 
                  onClick={() => navigate('/pro')}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/30"
              >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                      <Globe className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                      Hazte PRO
                  </h3>
                  <p className="text-amber-100 mb-8 leading-relaxed">
                      Sube de nivel con descargas ilimitadas, 0% de comisión y acceso a contenido exclusivo.
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                      Ver Planes <ArrowRight className="h-4 w-4" />
                  </div>
              </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-10 mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Lo que dicen los artistas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { text: "Latam Creativa ha cambiado mi carrera. Conseguí mi primer trabajo en un estudio AAA gracias a la sección de empleos.", author: "Sofía Martínez", role: "3D Artist @ Ubisoft" },
                    { text: "La calidad de los cursos es increíble. He aprendido más aquí en un mes que en dos años de universidad.", author: "Juan Pérez", role: "Indie Dev" },
                    { text: "Vender mis assets aquí es mucho más rentable que en otras tiendas. La comunidad es súper solidaria.", author: "Diego López", role: "Texture Artist" }
                ].map((testimonio, i) => (
                    <div key={i} className="bg-slate-100 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/5 relative">
                        <Quote className="h-8 w-8 text-amber-500 mb-4 opacity-50" />
                        <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">"{testimonio.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${testimonio.author}&background=random`} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{testimonio.author}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{testimonio.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Trust/Footer Section */}
        <div className="pb-10">
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-8 md:p-12 text-center">
                <Shield className="h-12 w-12 text-slate-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Construido para la comunidad</h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-8">
                    Latam Creativa es un proyecto dedicado a potenciar el talento en Latinoamérica. Sin algoritmos ocultos, solo arte puro.
                </p>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">UNREAL ENGINE</span>
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">BLENDER</span>
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">UNITY</span>
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">ADOBE</span>
                </div>
            </div>
        </div>

      </div>
      
      <Footer onNavigate={(path) => navigate(`/${path}`)} />
    </div>
  );
};

}

#### 3. `src/components/Navigation.tsx` (Filtros que redirigen al feed)
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Search, X, Sun, Moon, Sliders, Code, Palette } from 'lucide-react';
import { PRIMARY_NAV_ITEMS, NAV_SECTIONS, NAV_SECTIONS_DEV, SUBSCRIPTIONS } from '../data/navigation';
import { ContentMode } from '../hooks/useAppStore';

interface PrimarySidebarProps {
  activeModule?: string;
  contentMode: ContentMode;
  onToggleContentMode: () => void;
}

export const PrimarySidebar = ({ activeModule, contentMode, onToggleContentMode }: PrimarySidebarProps) => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsSettingsOpen(false);
  };

  const activeColorClass = contentMode === 'dev' 
    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
    : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20';

  return (
    <aside className="hidden flex-col border-r border-slate-200 dark:border-white/[0.06] md:flex z-50 bg-white/90 dark:bg-[#050506]/90 w-[88px] pt-8 pb-8 backdrop-blur-xl items-center h-screen sticky top-0 transition-colors">
      
      <nav className="flex flex-1 flex-col gap-5 items-center w-full justify-start">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <div key={item.id} className="relative group flex items-center justify-center">
              <button
                onClick={() => navigate(`/${item.id}`)}
                className={`group flex transition-all w-12 h-12 rounded-2xl items-center justify-center ${
                  isActive
                    ? activeColorClass
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <item.icon className="w-[26px] h-[26px]" strokeWidth={1.5} />
              </button>
              <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col mt-auto gap-5 items-center relative" ref={menuRef}>
        
        <div className="relative group flex items-center justify-center">
            <button 
              onClick={onToggleContentMode}
              className={`group flex transition-all w-12 h-12 rounded-2xl items-center justify-center ${
                contentMode === 'dev' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              }`}
            >
              {contentMode === 'dev' ? <Code className="w-6 h-6" /> : <Palette className="w-6 h-6" />}
            </button>
            <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
               {contentMode === 'dev' ? 'Ir a Modo Creativo' : 'Ir a Modo Developer'}
            </div>
        </div>

        {isSettingsOpen && (
          <div className="absolute bottom-2 left-16 mb-2 w-64 rounded-xl bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 shadow-xl p-2 z-50 overflow-hidden animate-fade-in origin-bottom-left flex flex-col gap-1">
            <button 
              onClick={() => {
                navigate('/settings');
                setIsSettingsOpen(false);
              }} 
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-base font-medium transition-colors"
            >
              <Sliders className="w-5 h-5 text-slate-500" />
              Configuración
            </button>
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-base font-medium transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-slate-500" /> : <Moon className="w-5 h-5 text-slate-500" />}
              {isDark ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
          </div>
        )}

        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`group flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
            isSettingsOpen || activeModule === 'settings'
            ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Settings className="h-6 w-6" strokeWidth={1.5} />
        </button>
        
        <div 
          onClick={() => navigate('/user/alex-motion')}
          className="h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-white/10 transition-transform hover:scale-105 cursor-pointer"
        >
          <img 
            src="[https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop](https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop)" 
            alt="User" 
            className="h-full w-full object-cover opacity-90 hover:opacity-100" 
          />
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
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  const currentNavSections = contentMode === 'dev' ? NAV_SECTIONS_DEV : NAV_SECTIONS;

  useEffect(() => {
    if (isOpen) {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [isOpen]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const activeItemClass = contentMode === 'dev'
    ? 'bg-blue-500/10 ring-1 ring-inset ring-blue-500/20 text-blue-600 dark:text-blue-400'
    : 'bg-amber-500/10 ring-1 ring-inset ring-amber-500/20 text-amber-600 dark:text-amber-400';

  const activeIconClass = contentMode === 'dev'
    ? 'text-blue-500 dark:text-blue-400 bg-blue-500/20'
    : 'text-amber-500 dark:text-amber-400 bg-amber-500/20';

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm xl:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 z-40 flex w-72 flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#08080A]
        transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        left-0 md:left-[88px] xl:left-0
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
          
          <div className="md:hidden mb-8">
              <h3 className="uppercase text-xs font-semibold text-slate-500 tracking-widest mb-4 px-2">Navegación</h3>
              <div className="grid grid-cols-4 gap-2">
                  {PRIMARY_NAV_ITEMS.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => {
                            navigate(`/${item.id}`);
                            onClose?.();
                        }}
                        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-colors ${
                            activeModule === item.id 
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

          <div className="relative mb-8">
            <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar categorías..." 
              className={`w-full rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 outline-none transition-all focus:bg-white dark:focus:bg-white/[0.06] focus:ring-1 ${contentMode === 'dev' ? 'focus:border-blue-500/30 focus:ring-blue-500/30' : 'focus:border-amber-500/30 focus:ring-amber-500/30'}`} 
            />
          </div>

          <div className="space-y-8">
            {currentNavSections.map((section, idx) => (
                <div key={idx}>
                    <h3 className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-3 px-3">
                        {section.title}
                    </h3>
                    <div className="space-y-1">
                        {section.items.map((item) => {
                            const isActive = activeCategory === item.label;
                            return (
                                <a 
                                key={item.label}
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onCategorySelect(item.label);
                                    navigate('/home'); // <-- CRITICAL FIX: Navigate to home on filter
                                    onClose?.(); 
                                }}
                                className={`group flex items-center gap-3 rounded-xl p-2.5 px-3 transition-all ${
                                    isActive 
                                    ? activeItemClass 
                                    : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-400'
                                }`}
                                >
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                    isActive ? activeIconClass : 'text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-white/5 group-hover:text-slate-600 dark:group-hover:text-slate-300'
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
                                </a>
                            );
                        })}
                    </div>
                </div>
            ))}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent my-8"></div>

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
                        onClose?.(); 
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

          <div className="md:hidden border-t border-slate-200 dark:border-white/10 pt-6 mb-6">
              <div 
                className="flex items-center gap-3 px-2 mb-4 cursor-pointer" 
                onClick={() => {
                    navigate('/settings');
                    onClose?.();
                }}
              >
                  <img 
                      src="[https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop](https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop)" 
                      alt="User" 
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10" 
                  />
                  <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Alex Motion</h4>
                      <p className="text-xs text-slate-500">Ver perfil</p>
                  </div>
                  <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                      <Settings className="h-5 w-5" />
                  </button>
              </div>
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
              <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="text-sm font-medium">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>
          </div>

        </div>

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