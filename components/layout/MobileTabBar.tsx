
import React from 'react';
import { Home, Compass, PlusSquare, MessageCircle, User } from 'lucide-react';

interface MobileTabBarProps {
  activeModule: string;
  onNavigate: (moduleId: string) => void;
  onOpenChat: () => void;
  onCreateClick: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeModule, onNavigate, onOpenChat, onCreateClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#050506]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        
        <button 
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
            activeModule === 'home' || activeModule === 'landing' 
              ? 'text-amber-500' 
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
              ? 'text-amber-500' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Compass className={`h-6 w-6 ${activeModule === 'portfolio' ? 'fill-current' : ''}`} strokeWidth={activeModule === 'portfolio' ? 2 : 1.5} />
          <span className="text-[10px] font-medium">Explorar</span>
        </button>

        <div className="relative -top-5">
            <button 
                onClick={onCreateClick}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
            >
                <PlusSquare className="h-7 w-7" />
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
          onClick={() => onNavigate('settings')} // Linking to settings as a proxy for "My Profile" for now
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
            activeModule === 'settings' 
              ? 'text-amber-500' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className={`h-6 w-6 rounded-full overflow-hidden border-2 ${activeModule === 'settings' ? 'border-amber-500' : 'border-transparent'}`}>
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-medium">Yo</span>
        </button>

      </div>
    </div>
  );
};
