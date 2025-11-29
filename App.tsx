
import React from 'react';
import { PrimarySidebar, SecondarySidebar } from './components/Navigation';
import { Header } from './components/Header';
import { VideoContent } from './components/VideoContent';
import { ChatWidget } from './components/chat/ChatWidget';
import { MobileTabBar } from './components/layout/MobileTabBar'; 
import { SaveToCollectionModal } from './components/modals/SaveToCollectionModal';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from './hooks/useAppStore';

const App: React.FC = () => {
  const { state, actions } = useAppStore();

  const isLearningMode = state.activeModule === 'learning';
  const selectionColor = state.contentMode === 'dev' ? 'selection:bg-blue-500/30' : 'selection:bg-amber-500/30';

  return (
    <div className={`flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#030304] text-slate-600 dark:text-slate-300 font-sans ${selectionColor} transition-colors duration-500 antialiased`}>
      
      {/* Enhanced Ambient Background - Hidden in learning mode for focus */}
      {!isLearningMode && (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 opacity-60 dark:opacity-100">
            <div className={`absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full ${state.contentMode === 'dev' ? 'bg-blue-600/10' : 'bg-blue-400/10'} dark:bg-[#0f172a]/40 blur-[150px] mix-blend-screen animate-pulse duration-[8000ms]`}></div>
            <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full ${state.contentMode === 'dev' ? 'bg-emerald-500/10' : 'bg-amber-500/10'} dark:bg-[#451a03]/30 blur-[150px] mix-blend-screen`}></div>
            <div className={`absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full ${state.contentMode === 'dev' ? 'bg-cyan-500/10' : 'bg-purple-500/10'} dark:bg-[#2e1065]/30 blur-[150px] mix-blend-screen animate-pulse duration-[12000ms]`}></div>
        </div>
      )}

      {/* Hide Primary Sidebar in Learning Mode */}
      {!isLearningMode && (
          <PrimarySidebar 
            activeModule={state.activeModule}
            onModuleSelect={actions.handleModuleSelect}
            contentMode={state.contentMode}
            onToggleContentMode={actions.toggleContentMode}
          />
      )}

      <SecondarySidebar 
        isOpen={state.isSidebarOpen} 
        onClose={() => actions.setIsSidebarOpen(false)}
        activeCategory={state.activeCategory} 
        onCategorySelect={actions.setActiveCategory}
        onSubscriptionSelect={actions.handleSubscriptionSelect}
        onProClick={actions.handleProClick}
        activeModule={state.activeModule}
        onModuleSelect={actions.handleModuleSelect}
        hiddenOnDesktop={isLearningMode || ['landing', 'home', 'settings', 'pro', 'search', 'collections', 'cart', 'people', 'community', 'events'].includes(state.activeModule) || !!state.viewingAuthorName}
        contentMode={state.contentMode}
      />

      <main className={`relative flex min-w-0 flex-1 flex-col overflow-hidden z-10 ${isLearningMode ? 'bg-[#0A0A0C]' : ''}`}>
        {!isLearningMode && (
            <Header 
              onMenuClick={() => actions.setIsSidebarOpen(true)}
              activeCategory={state.activeCategory}
              onCreateAction={actions.handleCreateAction}
              onLogoClick={() => actions.handleModuleSelect('home')}
              onSearch={actions.handleSearch}
              cartCount={state.cartItems.length}
              onCartClick={() => actions.handleModuleSelect('cart')}
              notifications={state.notifications}
              onMarkRead={actions.markNotificationRead}
              onMarkAllRead={actions.markAllNotificationsRead}
              contentMode={state.contentMode}
            />
        )}
        
        {/* Adjusted padding bottom for mobile tab bar, remove padding in learning mode */}
        <div className={`custom-scrollbar flex-1 overflow-y-auto ${isLearningMode ? 'pt-0' : 'pt-20'} pb-20 md:pb-0`}>
          <VideoContent 
            activeCategory={state.activeCategory} 
            onCategorySelect={actions.setActiveCategory}
            activeModule={state.activeModule}
            onModuleSelect={actions.handleModuleSelect}
            viewingAuthorName={state.viewingAuthorName}
            onAuthorClick={(name) => actions.setViewingAuthorName(name)}
            createMode={state.createMode}
            setCreateMode={actions.setCreateMode}
            searchQuery={state.searchQuery}
            onAddToCart={actions.addToCart}
            onRemoveFromCart={actions.removeFromCart}
            onBuyNow={actions.handleBuyNow}
            cartItems={state.cartItems}
            onOpenChat={actions.openChatWithUser}
            onOpenSaveModal={actions.openSaveModal}
            contentMode={state.contentMode}
          />
        </div>
      </main>

      {!isLearningMode && (
          <ChatWidget 
            isOpen={state.isChatOpen} 
            onToggle={() => actions.setIsChatOpen(!state.isChatOpen)}
            activeUserId={state.chatActiveUser}
            onCloseChat={() => actions.setChatActiveUser(null)}
          />
      )}

      {/* Mobile Tab Bar */}
      {!isLearningMode && (
          <MobileTabBar 
            activeModule={state.activeModule}
            onNavigate={actions.handleModuleSelect}
            onOpenChat={() => actions.setIsChatOpen(true)}
            onCreateClick={() => actions.setIsSidebarOpen(true)}
          />
      )}

      <SaveToCollectionModal 
        isOpen={state.isSaveModalOpen}
        onClose={actions.closeSaveModal}
        collections={state.collections}
        onSave={actions.saveToCollection}
        onCreate={actions.createCollection}
        itemImage={state.itemToSave?.image}
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

export default App;
