
import React, { useState } from 'react';
import { Home, Compass, Plus, MessageCircle, User, FileText, Layers, Video, Box, Briefcase, Building2, Users, MessageCircleQuestion, CalendarDays, X } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';

interface MobileTabBarProps {
  activeModule: string;
  onNavigate: (moduleId: string) => void;
  onOpenChat: () => void;
  onCreateAction: (actionId: string) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeModule, onNavigate, onOpenChat, onCreateAction }) => {
  const { state } = useAppStore();
  const { contentMode } = state;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDev = contentMode === 'dev';
  
  // Dynamic Styles based on Content Mode
  const accentText = isDev ? 'text-blue-500' : 'text-amber-500';
  const fabBg = isDev ? 'bg-blue-600' : 'bg-amber-500';
  const fabShadow = isDev ? 'shadow-blue-600/30' : 'shadow-amber-500/30';
  const borderAccent = isDev ? 'border-blue-500' : 'border-amber-500';

  const createOptions = [
    { id: 'article', icon: FileText, label: 'Artículo', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'portfolio', icon: Layers, label: 'Proyecto', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'course', icon: Video, label: 'Curso', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'asset', icon: Box, label: 'Asset', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'service', icon: Briefcase, label: 'Servicio', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'job', icon: Building2, label: 'Empleo', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'project', icon: Users, label: 'Equipo', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'forum', icon: MessageCircleQuestion, label: 'Duda', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'event', icon: CalendarDays, label: 'Evento', color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const handleCreate = (id: string) => {
    onCreateAction(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Creation Menu */}
      <div className={`fixed bottom-24 left-4 right-4 z-[70] bg-white dark:bg-[#1A1A1C] rounded-3xl p-6 shadow-2xl transition-all duration-300 origin-bottom border border-slate-200 dark:border-white/10 ${isMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crear Nuevo</h3>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-slate-400">
                  <X className="h-5 w-5" />
              </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
              {createOptions.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleCreate(item.id)}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} shadow-sm`}>
                          <item.icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#050506]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-[60] md:hidden pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          
          <button 
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
              activeModule === 'home' || activeModule === 'landing' 
                ? accentText 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Home className={`h-6 w-6 ${activeModule === 'home' ? 'fill-current' : ''}`} strokeWidth={activeModule === 'home' ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>

          <button 
            onClick={() => onNavigate('portfolio')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
              activeModule === 'portfolio' || activeModule === 'market' 
                ? accentText 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Compass className={`h-6 w-6 ${activeModule === 'portfolio' ? 'fill-current' : ''}`} strokeWidth={activeModule === 'portfolio' ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Explorar</span>
          </button>

          <div className="relative -top-5">
              <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg ${fabShadow} transition-transform ${isMenuOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-black rotate-45' : `${fabBg} hover:scale-105`}`}
              >
                  <Plus className="h-7 w-7" />
              </button>
          </div>

          <button 
            onClick={onOpenChat}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Chat</span>
          </button>

          <button 
            onClick={() => onNavigate('profile')} 
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
              activeModule === 'profile' 
                ? accentText 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <div className={`h-6 w-6 rounded-full overflow-hidden border-2 ${activeModule === 'profile' ? borderAccent : 'border-transparent'}`}>
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-medium">Yo</span>
          </button>

        </div>
      </div>
    </>
  );
};
