import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PrimarySidebar, SecondarySidebar } from '../components/Navigation';
import { Header } from '../components/Header';
import { Footer } from '../components/layout/Footer';
import { ChatWidget } from '../components/chat/ChatWidget';
import { MobileTabBar } from '../components/layout/MobileTabBar';
import { SaveToCollectionModal } from '../components/modals/SaveToCollectionModal';
import { ShareModal } from '../components/modals/ShareModal';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { OnboardingModal } from '../components/modals/OnboardingModal';

export const MainLayout: React.FC = () => {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Sync State with URL on mount and change
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            if (state.activeModule !== 'home') actions.handleModuleSelect('home');
        } else {
            // Extract the first segment: /portfolio/123 -> portfolio
            const moduleName = path.split('/')[1];
            // Only update if different and valid module
            if (moduleName && state.activeModule !== moduleName) {
                // We might want to validate against known modules, but strict checking isn't crucial for highlight only
                // Just ensuring we don't overwrite if it's a "detail" view that keeps the parent module active
                actions.handleModuleSelect(moduleName);
            }
        }
    }, [location.pathname]);

    const isLearningMode = state.activeModule === 'learning';
    const selectionColor = state.contentMode === 'dev' ? 'selection:bg-blue-500/30' : 'selection:bg-amber-500/30';

    // Navigation Handler to sync State + Router
    const handleModuleNavigation = (moduleId: string) => {
        actions.handleModuleSelect(moduleId);

        // Map module IDs to routes
        if (moduleId === 'home') navigate('/'); // Home is root
        else if (moduleId === 'learning') navigate('/education'); // Or keep state only? But likely /learning route exists? router says /learning 
        // Router says: path: '/learning/:courseId?'
        else navigate(`/${moduleId}`);
    };

    // Additional handler for Logo
    const handleLogoClick = () => {
        actions.handleModuleSelect('home');
        navigate('/');
    };

    // Handler for creating
    // If Create Actions need navigation, handle here, but they usually open Modals or change local state (createMode)
    // The Views handle createMode.

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
                    onModuleSelect={handleModuleNavigation}
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
                onModuleSelect={handleModuleNavigation}
                hiddenOnDesktop={isLearningMode || ['landing', 'home', 'settings', 'pro', 'search', 'collections', 'cart', 'people', 'community', 'events', 'profile'].includes(state.activeModule) || state.activeModule.startsWith('earnings') || state.activeModule.startsWith('info-') || !!state.viewingAuthorName}
                contentMode={state.contentMode}
                onToggleContentMode={actions.toggleContentMode}
            />

            <main className={`relative flex min-w-0 flex-1 flex-col overflow-hidden z-10 ${isLearningMode ? 'bg-[#0A0A0C]' : ''}`}>
                {!isLearningMode && (
                    <Header
                        onMenuClick={() => actions.setIsSidebarOpen(true)}
                        activeCategory={state.activeCategory}
                        onCreateAction={actions.handleCreateAction}
                        onLogoClick={handleLogoClick}
                        onSearch={actions.handleSearch}
                        cartCount={state.cartItems.length}
                        onCartClick={() => handleModuleNavigation('cart')}
                        notifications={state.notifications}
                        onMarkRead={actions.markNotificationRead}
                        onMarkAllRead={actions.markAllNotificationsRead}
                        contentMode={state.contentMode}
                        onLoginClick={() => navigate('/auth')}
                    />
                )}

                {/* Adjusted padding bottom for mobile tab bar, remove padding in learning mode */}
                <div className={`custom-scrollbar flex-1 overflow-y-auto ${isLearningMode ? 'pt-0' : 'pt-20'} pb-32 md:pb-0`}>
                    <div className="flex flex-col min-h-full">
                        <div className="flex-1">
                            {/* REPLACED VideoContent with Outlet */}
                            <Outlet />
                        </div>
                        {!isLearningMode && (
                            <Footer onNavigate={handleModuleNavigation} />
                        )}
                    </div>
                </div>
            </main>

            {!isLearningMode && state.user && (
                <ChatWidget
                    isOpen={state.isChatOpen}
                    onToggle={() => actions.setIsChatOpen(!state.isChatOpen)}
                    activeUserId={state.chatActiveUser}
                    onCloseChat={() => actions.setChatActiveUser(null)}
                    contentMode={state.contentMode}
                />
            )}

            {/* Mobile Tab Bar */}
            {!isLearningMode && (
                <MobileTabBar
                    activeModule={state.activeModule}
                    onNavigate={handleModuleNavigation}
                    onOpenChat={() => actions.setIsChatOpen(!state.isChatOpen)}
                    onCreateAction={actions.handleCreateAction}
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

            <ShareModal
                isOpen={state.isShareModalOpen}
                onClose={actions.closeShareModal}
            />

            <OnboardingModal />

            {/* Enhanced Toast Notification */}
            {state.toast && (
                <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-enter-up w-auto max-w-[90%] text-center">
                    <div className={`
            px-6 py-3 rounded-full shadow-2xl flex items-center justify-center gap-3 font-medium backdrop-blur-md border
            ${state.toast.type === 'success'
                            ? 'bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 border-green-500/30'
                            : state.toast.type === 'error'
                                ? 'bg-red-500/90 text-white border-red-400/30'
                                : 'bg-blue-500/90 text-white border-blue-400/30'
                        }
          `}>
                        {state.toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-600 shrink-0" />}
                        {state.toast.type === 'error' && <AlertCircle className="h-5 w-5 text-white shrink-0" />}
                        {state.toast.type === 'info' && <Info className="h-5 w-5 text-white shrink-0" />}
                        {state.toast.message}
                    </div>
                </div>
            )}

        </div>
    );
};
