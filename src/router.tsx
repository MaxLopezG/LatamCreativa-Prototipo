
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { useAppStore } from './hooks/useAppStore';

// Views
import { HomeView } from './views/HomeView';
import { FeedView } from './views/FeedView';
import { PortfolioView } from './views/PortfolioView';
import { PortfolioPostView } from './views/PortfolioPostView';
import { BlogView } from './views/BlogView';
import { BlogPostView } from './views/BlogPostView';
import { EducationView } from './views/EducationView';
import { CourseDetailView } from './views/CourseDetailView';
import { CoursePlayerView } from './views/CoursePlayerView';
import { AssetsView } from './views/AssetsView';
import { AssetDetailView } from './views/AssetDetailView';
import { FreelanceView } from './views/FreelanceView';
import { ServiceDetailView } from './views/ServiceDetailView';
import { JobsView } from './views/JobsView';
import { JobDetailView } from './views/JobDetailView';
import { CommunityView } from './views/CommunityView';
import { ProjectDetailView } from './views/ProjectDetailView';
import { ChallengesView } from './views/ChallengesView';
import { ChallengeDetailView } from './views/ChallengeDetailView';
import { EventsView } from './views/EventsView';
import { EventDetailView } from './views/EventDetailView';
import { ForumView } from './views/ForumView';
import { ForumDetailView } from './views/ForumDetailView';
import { PeopleView } from './views/PeopleView';
import { CollectionsView } from './views/CollectionsView';
import { CollectionDetailView } from './views/CollectionDetailView';
import { UserProfileView } from './views/UserProfileView';
import { CartView } from './views/CartView';
import { SettingsView } from './views/SettingsView';
import { ProUpgradeView } from './views/ProUpgradeView';
import { MainLandingView } from './views/MainLandingView';
import { InfoView } from './views/InfoView';
import { SearchResultsView } from './views/SearchResultsView';
import { ComingSoonView } from './views/ComingSoonView';
import { SuccessView } from './views/SuccessView';

// Create Views
import { CreateProjectView } from './views/CreateProjectView';
import { CreateArticleView } from './views/CreateArticleView';
import { CreatePortfolioView } from './views/CreatePortfolioView';
import { CreateCourseView } from './views/CreateCourseView';
import { CreateAssetView } from './views/CreateAssetView';
import { CreateServiceView } from './views/CreateServiceView';
import { CreateForumPostView } from './views/CreateForumPostView';
import { CreateEventView } from './views/CreateEventView';

// Wrappers for injections
function PortfolioWrapper() {
    const { state, actions } = useAppStore();
    return <PortfolioView activeCategory={state.activeCategory} onItemSelect={() => {}} onCreateClick={() => {}} contentMode={state.contentMode} />;
}

function FeedWrapper() {
    const { state, actions } = useAppStore();
    return <FeedView onNavigateToModule={() => {}} onItemSelect={() => {}} contentMode={state.contentMode} />;
}

function EducationWrapper() {
    const { state } = useAppStore();
    return <EducationView activeCategory={state.activeCategory} contentMode={state.contentMode} />;
}

function CartViewWrapper() {
    const { state, actions } = useAppStore();
    return <CartView items={state.cartItems} onRemove={actions.removeFromCart} onContinueShopping={() => {}} />;
}

function AssetDetailWrapper() {
    const { actions } = useAppStore();
    return <AssetDetailView onBack={() => window.history.back()} onAddToCart={actions.addToCart} onBuyNow={actions.handleBuyNow} />;
}

function CourseDetailWrapper() {
    const { id } = useParams<{ id: string }>();
    const { actions } = useAppStore();
    return <CourseDetailView courseId={id} onBack={() => window.history.back()} onAddToCart={actions.addToCart} onBuyNow={actions.handleBuyNow} />;
}

function CollectionDetailWrapper() {
    return <CollectionDetailView onBack={() => window.history.back()} onItemSelect={() => {}} />;
}

function CreateWrapper({ Component }: { Component: React.FC<{ onBack: () => void }> }) {
    return <Component onBack={() => window.history.back()} />;
}

// Router Configuration
import { useParams } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <MainLandingView /> }, 
      { path: 'home', element: <FeedWrapper /> },
      
      // Portfolio
      { path: 'portfolio', element: <PortfolioWrapper /> },
      { path: 'portfolio/:id', element: <PortfolioPostView onBack={() => window.history.back()} /> },
      { path: 'create/portfolio', element: <CreateWrapper Component={CreatePortfolioView} /> },

      // Blog
      { path: 'blog', element: <BlogView activeCategory="Home" /> },
      { path: 'blog/:id', element: <BlogPostView onBack={() => window.history.back()} onArticleSelect={() => {}} /> },
      { path: 'create/article', element: <CreateWrapper Component={CreateArticleView} /> },

      // Education
      { path: 'education', element: <EducationWrapper /> },
      { path: 'education/:id', element: <CourseDetailWrapper /> },
      { path: 'create/course', element: <CreateWrapper Component={CreateCourseView} /> },

      // Market
      { path: 'market', element: <AssetsView activeCategory="Home" /> },
      { path: 'market/:id', element: <AssetDetailWrapper /> },
      { path: 'create/asset', element: <CreateWrapper Component={CreateAssetView} /> },

      // Freelance
      { path: 'freelance', element: <FreelanceView /> },
      { path: 'freelance/:id', element: <ServiceDetailView onBack={() => window.history.back()} /> },
      { path: 'create/service', element: <CreateWrapper Component={CreateServiceView} /> },

      // Jobs
      { path: 'jobs', element: <JobsView /> },
      { path: 'jobs/:id', element: <JobDetailView onBack={() => window.history.back()} /> },
      
      // Community
      { path: 'community', element: <CommunityView /> }, 
      { path: 'community/:id', element: <ProjectDetailView onBack={() => window.history.back()} /> },
      { path: 'create/project', element: <CreateWrapper Component={CreateProjectView} /> },
      
      // Challenges
      { path: 'challenges', element: <ChallengesView /> },
      { path: 'challenges/:id', element: <ChallengeDetailView onBack={() => window.history.back()} /> },

      // Events
      { path: 'events', element: <EventsView /> },
      { path: 'events/:id', element: <EventDetailView onBack={() => window.history.back()} /> },
      { path: 'create/event', element: <CreateWrapper Component={CreateEventView} /> },

      // Forum
      { path: 'forum', element: <ForumView /> },
      { path: 'forum/:id', element: <ForumDetailView onBack={() => window.history.back()} /> },
      { path: 'create/forum', element: <CreateWrapper Component={CreateForumPostView} /> },

      // People
      { path: 'people', element: <PeopleView /> },

      // User Profile
      { path: 'user/:username', element: <UserProfileView /> },

      // Personal & Utility
      { path: 'collections', element: <CollectionsView /> },
      { path: 'collections/:id', element: <CollectionDetailWrapper /> },
      { path: 'cart', element: <CartViewWrapper /> },
      { path: 'success', element: <SuccessView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: 'pro', element: <ProUpgradeView onBack={() => window.history.back()} /> },
      
      // Search
      { path: 'search', element: <SearchResultsView query="" onItemSelect={() => {}} /> },

      // Info Pages
      { path: 'about', element: <MainLandingView /> },
      { path: 'info/:pageId', element: <InfoView pageId="" onBack={() => window.history.back()} /> },
      
      // Fallback
      { path: 'info/help', element: <ComingSoonView /> },
      { path: 'info/guides', element: <ComingSoonView /> }
    ]
  },
  {
    path: '/learning/:courseId?',
    element: <CoursePlayerView onBack={() => window.history.back()} />
  }
]);
