
import React, { useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PrimarySidebar, SecondarySidebar } from '../components/Navigation';
import { Header } from '../components/Header';
import { MobileTabBar } from '../components/layout/MobileTabBar';
import { ChatWidget } from '../components/chat/ChatWidget';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';

export const MainLayout: React.FC = () => {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever the path changes
  useEffect(() => {
    mainContentRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  // Helper to determine active module from path for UI highlighting
  const getActiveModule = () => {
    // extract first segment: /portfolio/123 -> portfolio
    const path = location.pathname.split('/')[1]; 
    return path || 'home';
  };

  const activeModule = getActiveModule();

  // Determine if secondary sidebar should be hidden
  const isFullWidthPage = ['events', 'people', 'community', 'learning', 'settings', 'pro', 'cart', 'user'].includes(activeModule);
  const isLanding = location.pathname === '/about' || location.pathname === '/';

  return (
    <div className={`flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#030304] text-slate-600 dark:text-slate-300 font-sans ${state.contentMode === 'dev' ? 'selection:bg-blue-500/30' : 'selection:bg-amber-500/30'} transition-colors duration-500 antialiased`}>
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 opacity-60 dark:opacity-100">
          <div className={`absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full ${state.contentMode === 'dev' ? 'bg-blue-600/10' : 'bg-blue-400/10'} dark:bg-[#0f172a]/40 blur-[150px] mix-blend-screen animate-pulse duration-[8000ms]`}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full ${state.contentMode === 'dev' ? 'bg-emerald-500/10' : 'bg-amber-500/10'} dark:bg-[#451a03]/30 blur-[150px] mix-blend-screen`}></div>
          <div className={`absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full ${state.contentMode === 'dev' ? 'bg-cyan-500/10' : 'bg-purple-500/10'} dark:bg-[#2e1065]/30 blur-[150px] mix-blend-screen animate-pulse duration-[12000ms]`}></div>
      </div>

      {/* Primary Sidebar - Hidden on Landing/About */}
      {!isLanding && (
        <PrimarySidebar 
          activeModule={activeModule}
          contentMode={state.contentMode}
          onToggleContentMode={actions.toggleContentMode}
        />
      )}

      {/* Secondary Sidebar - Drawer */}
      <SecondarySidebar 
        isOpen={state.isSidebarOpen} 
        onClose={() => actions.setIsSidebarOpen(false)}
        activeCategory={state.activeCategory} 
        onCategorySelect={actions.setActiveCategory}
        onSubscriptionSelect={(authorName) => navigate(`/user/${authorName.replace(/\s+/g, '-').toLowerCase()}`)}
        onProClick={() => navigate('/pro')}
        activeModule={activeModule}
        onModuleSelect={(moduleId) => navigate(`/${moduleId}`)}
        hiddenOnDesktop={isFullWidthPage || isLanding}
        contentMode={state.contentMode}
        onToggleContentMode={actions.toggleContentMode}
      />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden z-10">
        {!isLanding && (
            <Header 
              onMenuClick={() => actions.setIsSidebarOpen(true)}
              activeCategory={state.activeCategory}
              onLogoClick={() => navigate('/home')}
              onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
              cartCount={state.cartItems.length}
              onCartClick={() => navigate('/cart')}
              notifications={state.notifications}
              onMarkRead={actions.markNotificationRead}
              onMarkAllRead={actions.markAllNotificationsRead}
              contentMode={state.contentMode}
            />
        )}
        
        {/* Main Content Area with Outlet and Ref for Scroll Restoration */}
        <div 
          ref={mainContentRef}
          className={`custom-scrollbar flex-1 overflow-y-auto ${!isLanding ? 'pt-20' : ''} pb-20 md:pb-0`}
        >
          <Outlet />
        </div>
      </main>

      {/* Global Overlays */}
      <ChatWidget 
        isOpen={state.isChatOpen} 
        onToggle={() => actions.setIsChatOpen(!state.isChatOpen)}
        activeUserId={state.chatActiveUser}
        onCloseChat={() => actions.setChatActiveUser(null)}
        contentMode={state.contentMode}
      />

      <MobileTabBar 
        activeModule={activeModule}
        onNavigate={(path) => navigate(`/${path}`)}
        onOpenChat={() => actions.setIsChatOpen(!state.isChatOpen)}
        onCreateAction={(path) => navigate(path)}
      />

      {/* Toast Notification */}
      {state.toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-slide-up w-auto max-w-[90%] text-center">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center justify-center gap-3 font-medium">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            {state.toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
