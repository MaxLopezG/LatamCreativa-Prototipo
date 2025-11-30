
import React, { useState, useEffect } from 'react';
import { BlogView } from '../views/BlogView';
import { PortfolioView } from '../views/PortfolioView';
import { HomeView } from '../views/HomeView';
import { CategoryGridView } from '../views/CategoryGridView';
import { BlogPostView } from '../views/BlogPostView';
import { PortfolioPostView } from '../views/PortfolioPostView';
import { UserProfileView } from '../views/UserProfileView';
import { EducationView } from '../views/EducationView';
import { CourseDetailView } from '../views/CourseDetailView';
import { CoursePlayerView } from '../views/CoursePlayerView';
import { AssetsView } from '../views/AssetsView';
import { AssetDetailView } from '../views/AssetDetailView';
import { CommunityView } from '../views/CommunityView';
import { ProjectDetailView } from '../views/ProjectDetailView';
import { ProUpgradeView } from '../views/ProUpgradeView';
import { MainLandingView } from '../views/MainLandingView';
import { SettingsView } from '../views/SettingsView';
import { FreelanceView } from '../views/FreelanceView';
import { ServiceDetailView } from '../views/ServiceDetailView';
import { FeedView } from '../views/FeedView';
import { ForumView } from '../views/ForumView'; 
import { ForumDetailView } from '../views/ForumDetailView';
import { EventsView } from '../views/EventsView'; 
import { EventDetailView } from '../views/EventDetailView'; 
import { PeopleView } from '../views/PeopleView'; 
import { SearchResultsView } from '../views/SearchResultsView';
import { ChallengesView } from '../views/ChallengesView';
import { ChallengeDetailView } from '../views/ChallengeDetailView';
import { JobsView } from '../views/JobsView';
import { JobDetailView } from '../views/JobDetailView';
import { CollectionsView } from '../views/CollectionsView';
import { CartView } from '../views/CartView';
import { InfoView } from '../views/InfoView';

// Creation Views
import { CreateProjectView } from '../views/CreateProjectView';
import { CreateArticleView } from '../views/CreateArticleView';
import { CreatePortfolioView } from '../views/CreatePortfolioView';
import { CreateCourseView } from '../views/CreateCourseView';
import { CreateAssetView } from '../views/CreateAssetView';
import { CreateServiceView } from '../views/CreateServiceView';
import { CreateForumPostView } from '../views/CreateForumPostView';
import { CreateEventView } from '../views/CreateEventView'; 
import { CartItem } from '../types';
import { useAppStore } from '../hooks/useAppStore';

// Define the shape of props based on the return type of useAppStore
type AppState = ReturnType<typeof useAppStore>['state'];
type AppActions = ReturnType<typeof useAppStore>['actions'];

interface VideoContentProps {
  state: AppState;
  actions: AppActions;
}

export const VideoContent: React.FC<VideoContentProps> = ({ state, actions }) => {
  // Consolidated state for selected items across all modules
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Destructure for easier access
  const { activeModule, activeCategory, createMode, viewingAuthorName, searchQuery, cartItems, contentMode } = state;
  const { 
    setActiveCategory, 
    handleModuleSelect: onModuleSelect, 
    setViewingAuthorName: onAuthorClick, 
    setCreateMode, 
    addToCart: onAddToCart, 
    removeFromCart: onRemoveFromCart, 
    handleBuyNow: onBuyNow, 
    openChatWithUser: onOpenChat, 
    openSaveModal: onOpenSaveModal 
  } = actions;

  // Reset selected item if module or category changes
  useEffect(() => {
    // Keep selection if moving to player
    if (activeModule === 'learning') return;
    
    setSelectedItemId(null);
    if (onAuthorClick) onAuthorClick(null);
  }, [activeModule, activeCategory]);

  const handleAuthorClick = (authorName: string) => {
    onAuthorClick?.(authorName);
  };

  const handleProfileItemSelect = (id: string, type: 'portfolio' | 'blog' | 'course') => {
      onAuthorClick?.(null); // Close profile
      
      // Determine target module based on item type to ensure correct view rendering
      if (type === 'portfolio') onModuleSelect?.('portfolio');
      if (type === 'course') onModuleSelect?.('education');
      if (type === 'blog') onModuleSelect?.('blog');
      
      setSelectedItemId(id);
  };

  // Generic handler for cross-module navigation (e.g. from Feed or Search)
  const handleItemSelect = (id: string, type: 'portfolio' | 'course' | 'asset' | 'blog' | 'service') => {
      const typeToModuleMap: Record<string, string> = {
          portfolio: 'portfolio',
          course: 'education',
          asset: 'market',
          blog: 'blog',
          service: 'freelance'
      };
      
      const targetModule = typeToModuleMap[type];
      if (targetModule) {
          onModuleSelect?.(targetModule);
          setSelectedItemId(id);
      }
  };

  // Custom handler to go to course player
  const handleStartLearning = (item: CartItem) => {
      onModuleSelect?.('learning');
      setSelectedItemId(item.id);
  };

  // Render container with padding for mobile navbar
  const renderContent = () => {
      // --- LANDING PAGE (acting as About Us or Intro) ---
      if (activeModule === 'landing' || activeModule === 'info-about') {
          return <MainLandingView onNavigate={onModuleSelect || (() => {})} />;
      }

      // --- INFO PAGES (Static) ---
      if (activeModule.startsWith('info-')) {
          return <InfoView pageId={activeModule} onBack={() => onModuleSelect?.('home')} />;
      }

      // --- SEARCH MODULE ---
      if (activeModule === 'search') {
          return <SearchResultsView query={searchQuery || ''} onItemSelect={handleItemSelect} />;
      }

      // --- CART MODULE ---
      if (activeModule === 'cart') {
          return <CartView items={cartItems} onRemove={onRemoveFromCart || (() => {})} onContinueShopping={() => onModuleSelect?.('market')} />;
      }

      // --- SETTINGS PAGE ---
      if (activeModule === 'settings') return <SettingsView />;

      // --- PRO UPGRADE PAGE ---
      if (activeModule === 'pro') return <ProUpgradeView onBack={() => {}} />;

      // --- HOME FEED MODULE ---
      if (activeModule === 'home') return <FeedView onNavigateToModule={onModuleSelect || (() => {})} onItemSelect={handleItemSelect} contentMode={contentMode} />;

      // --- LEARNING (LMS) MODULE ---
      if (activeModule === 'learning') {
          return <CoursePlayerView courseId={selectedItemId || undefined} onBack={() => onModuleSelect?.('education')} />;
      }

      // --- USER PROFILE OVERLAY/VIEW ---
      if (viewingAuthorName) {
          return (
              <UserProfileView 
                authorName={viewingAuthorName}
                onBack={() => onAuthorClick?.(null)}
                onItemSelect={handleProfileItemSelect}
                onOpenChat={onOpenChat}
              />
          );
      }

      // --- MODULE ROUTING ---
      
      // COLLECTIONS
      if (activeModule === 'collections') return <CollectionsView onCreateClick={() => {}} />;

      // CHALLENGES
      if (activeModule === 'challenges') {
          if (selectedItemId) return <ChallengeDetailView challengeId={selectedItemId} onBack={() => setSelectedItemId(null)} />;
          return <ChallengesView onChallengeSelect={setSelectedItemId} />;
      }

      // JOBS
      if (activeModule === 'jobs') {
          if (createMode === 'service') return <CreateServiceView onBack={() => setCreateMode('none')} />;
          if (selectedItemId) return <JobDetailView jobId={selectedItemId} onBack={() => setSelectedItemId(null)} />;
          return <JobsView onCreateClick={() => setCreateMode('service')} onJobSelect={setSelectedItemId} />;
      }

      // PEOPLE
      if (activeModule === 'people') return <PeopleView onProfileSelect={handleAuthorClick} />;

      // EVENTS
      if (activeModule === 'events') {
        if (createMode === 'event') return <CreateEventView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <EventDetailView eventId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} />;
        return <EventsView onEventSelect={setSelectedItemId} onCreateClick={() => setCreateMode('event')} />;
      }

      // FORUM
      if (activeModule === 'forum') {
        if (createMode === 'forum') return <CreateForumPostView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <ForumDetailView postId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} />;
        return <ForumView onPostSelect={setSelectedItemId} onCreateClick={() => setCreateMode('forum')} />;
      }

      // FREELANCE
      if (activeModule === 'freelance') {
        if (createMode === 'service') return <CreateServiceView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <ServiceDetailView serviceId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} />;
        return <FreelanceView activeCategory={activeCategory} onCreateClick={() => setCreateMode('service')} onServiceSelect={setSelectedItemId} />;
      }

      // ASSETS (MARKET)
      if (activeModule === 'market') {
        if (createMode === 'asset') return <CreateAssetView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <AssetDetailView assetId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} onAddToCart={onAddToCart} onBuyNow={onBuyNow} onSave={onOpenSaveModal} />;
        return <AssetsView activeCategory={activeCategory} onAssetSelect={setSelectedItemId} onCreateClick={() => setCreateMode('asset')} onSave={onOpenSaveModal} />;
      }

      // EDUCATION
      if (activeModule === 'education') {
        if (createMode === 'course') return <CreateCourseView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <CourseDetailView courseId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} onAddToCart={onAddToCart} onBuyNow={handleStartLearning} />;
        return <EducationView activeCategory={activeCategory} onCourseSelect={setSelectedItemId} onCreateClick={() => setCreateMode('course')} contentMode={contentMode} />;
      }

      // BLOG
      if (activeModule === 'blog') {
        if (createMode === 'article') return <CreateArticleView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <BlogPostView articleId={selectedItemId} onBack={() => setSelectedItemId(null)} onArticleSelect={setSelectedItemId} onAuthorClick={handleAuthorClick} onSave={onOpenSaveModal} />;
        return <BlogView activeCategory={activeCategory} onArticleSelect={setSelectedItemId} onCreateClick={() => setCreateMode('article')} onSave={onOpenSaveModal} />;
      }

      // PORTFOLIO
      if (activeModule === 'portfolio') {
        if (createMode === 'portfolio') return <CreatePortfolioView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <PortfolioPostView itemId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} onSave={onOpenSaveModal} />;
        return <PortfolioView activeCategory={activeCategory} onItemSelect={setSelectedItemId} onCreateClick={() => setCreateMode('portfolio')} onSave={onOpenSaveModal} contentMode={contentMode} />;
      }

      // COMMUNITY (PROJECTS)
      if (activeModule === 'community') {
        if (createMode === 'project') return <CreateProjectView onBack={() => setCreateMode('none')} />;
        if (selectedItemId) return <ProjectDetailView projectId={selectedItemId} onBack={() => setSelectedItemId(null)} onAuthorClick={handleAuthorClick} />;
        return <CommunityView onProjectSelect={setSelectedItemId} onCreateProjectClick={() => setCreateMode('project')} />;
      }

      // HOME / DEFAULT
      if (activeCategory === 'Home') {
        return <HomeView onCategorySelect={setActiveCategory || (() => {})} />;
      }

      return <CategoryGridView activeCategory={activeCategory} />;
  }

  // Wrap in a div to add pb-20 on mobile to prevent content from being hidden behind the bottom tab bar
  return (
    <div className={`pb-20 md:pb-0 ${activeModule === 'learning' ? 'bg-[#0A0A0C] min-h-screen' : ''}`}>
      {renderContent()}
    </div>
  );
};
