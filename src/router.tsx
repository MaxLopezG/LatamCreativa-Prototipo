import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { useAppStore } from './hooks/useAppStore';
import { Loader } from './components/common/Loader';

// --- Lazy Load Views (Optimized for named exports) ---
const HomeView = lazy(() => import('./views/HomeView').then(module => ({ default: module.HomeView })));
const FeedView = lazy(() => import('./views/FeedView').then(module => ({ default: module.FeedView })));
const PortfolioView = lazy(() => import('./views/PortfolioView').then(module => ({ default: module.PortfolioView })));
const PortfolioPostView = lazy(() => import('./views/PortfolioPostView').then(module => ({ default: module.PortfolioPostView })));
const BlogView = lazy(() => import('./views/BlogView').then(module => ({ default: module.BlogView })));
const BlogPostView = lazy(() => import('./views/BlogPostView').then(module => ({ default: module.BlogPostView })));
const EducationView = lazy(() => import('./views/EducationView').then(module => ({ default: module.EducationView })));
const CourseDetailView = lazy(() => import('./views/CourseDetailView').then(module => ({ default: module.CourseDetailView })));
const CoursePlayerView = lazy(() => import('./views/CoursePlayerView').then(module => ({ default: module.CoursePlayerView })));
const AssetsView = lazy(() => import('./views/AssetsView').then(module => ({ default: module.AssetsView })));
const AssetDetailView = lazy(() => import('./views/AssetDetailView').then(module => ({ default: module.AssetDetailView })));
const FreelanceView = lazy(() => import('./views/FreelanceView').then(module => ({ default: module.FreelanceView })));
const ServiceDetailView = lazy(() => import('./views/ServiceDetailView').then(module => ({ default: module.ServiceDetailView })));
const JobsView = lazy(() => import('./views/JobsView').then(module => ({ default: module.JobsView })));
const JobDetailView = lazy(() => import('./views/JobDetailView').then(module => ({ default: module.JobDetailView })));
const CommunityView = lazy(() => import('./views/CommunityView').then(module => ({ default: module.CommunityView })));
const ProjectDetailView = lazy(() => import('./views/ProjectDetailView').then(module => ({ default: module.ProjectDetailView })));
const ChallengesView = lazy(() => import('./views/ChallengesView').then(module => ({ default: module.ChallengesView })));
const ChallengeDetailView = lazy(() => import('./views/ChallengeDetailView').then(module => ({ default: module.ChallengeDetailView })));
const EventsView = lazy(() => import('./views/EventsView').then(module => ({ default: module.EventsView })));
const EventDetailView = lazy(() => import('./views/EventDetailView').then(module => ({ default: module.EventDetailView })));
const ForumView = lazy(() => import('./views/ForumView').then(module => ({ default: module.ForumView })));
const ForumDetailView = lazy(() => import('./views/ForumDetailView').then(module => ({ default: module.ForumDetailView })));
const PeopleView = lazy(() => import('./views/PeopleView').then(module => ({ default: module.PeopleView })));
const UserProfileView = lazy(() => import('./views/UserProfileView').then(module => ({ default: module.UserProfileView })));
const CartView = lazy(() => import('./views/CartView').then(module => ({ default: module.CartView })));
const SettingsView = lazy(() => import('./views/SettingsView').then(module => ({ default: module.SettingsView })));
const ProUpgradeView = lazy(() => import('./views/ProUpgradeView').then(module => ({ default: module.ProUpgradeView })));
const EarningsView = lazy(() => import('./views/EarningsView').then(module => ({ default: module.EarningsView })));
const SalesListView = lazy(() => import('./views/SalesListView').then(module => ({ default: module.SalesListView })));
const MainLandingView = lazy(() => import('./views/MainLandingView').then(module => ({ default: module.MainLandingView })));
const InfoView = lazy(() => import('./views/InfoView').then(module => ({ default: module.InfoView })));
const SearchResultsView = lazy(() => import('./views/SearchResultsView').then(module => ({ default: module.SearchResultsView })));
const ComingSoonView = lazy(() => import('./views/ComingSoonView').then(module => ({ default: module.ComingSoonView })));
const SuccessView = lazy(() => import('./views/SuccessView').then(module => ({ default: module.SuccessView })));

// Lazy Load Create Views
const CreateProjectView = lazy(() => import('./views/CreateProjectView').then(module => ({ default: module.CreateProjectView })));
const CreateArticleView = lazy(() => import('./views/CreateArticleView').then(module => ({ default: module.CreateArticleView })));
const CreatePortfolioView = lazy(() => import('./views/CreatePortfolioView').then(module => ({ default: module.CreatePortfolioView })));
const CreateCourseView = lazy(() => import('./views/CreateCourseView').then(module => ({ default: module.CreateCourseView })));
const CreateAssetView = lazy(() => import('./views/CreateAssetView').then(module => ({ default: module.CreateAssetView })));
const CreateServiceView = lazy(() => import('./views/CreateServiceView').then(module => ({ default: module.CreateServiceView })));
const CreateForumPostView = lazy(() => import('./views/CreateForumPostView').then(module => ({ default: module.CreateForumPostView })));
const CreateEventView = lazy(() => import('./views/CreateEventView').then(module => ({ default: module.CreateEventView })));

// Helper to wrap components in Suspense
const Suspended = ({ children }: { children?: React.ReactNode }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

// Wrappers for injections
function PortfolioWrapper() {
    const { state, actions } = useAppStore();
    return (
      <Suspended>
        <PortfolioView activeCategory={state.activeCategory} onItemSelect={() => {}} onCreateClick={() => {}} onSave={actions.openSaveModal} contentMode={state.contentMode} />
      </Suspended>
    );
}

function PortfolioPostWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <PortfolioPostView onBack={() => window.history.back()} onShare={actions.openShareModal} onSave={actions.openSaveModal} />
      </Suspended>
    );
}

function FeedWrapper() {
    const { state, actions } = useAppStore();
    return (
      <Suspended>
        <FeedView onNavigateToModule={() => {}} onItemSelect={() => {}} contentMode={state.contentMode} />
      </Suspended>
    );
}

function EducationWrapper() {
    const { state } = useAppStore();
    return (
      <Suspended>
        <EducationView activeCategory={state.activeCategory} contentMode={state.contentMode} />
      </Suspended>
    );
}

function CartViewWrapper() {
    const { state, actions } = useAppStore();
    return (
      <Suspended>
        <CartView items={state.cartItems} onRemove={actions.removeFromCart} onContinueShopping={() => {}} />
      </Suspended>
    );
}

function AssetDetailWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <AssetDetailView onBack={() => window.history.back()} onAddToCart={actions.addToCart} onBuyNow={actions.handleBuyNow} onSave={actions.openSaveModal} onShare={actions.openShareModal} />
      </Suspended>
    );
}

function CourseDetailWrapper() {
    const { actions } = useAppStore();
    const navigate = useNavigate();
    return (
      <Suspended>
        <CourseDetailView 
            onBack={() => window.history.back()} 
            onAddToCart={actions.addToCart} 
            onBuyNow={actions.handleBuyNow}
            onStartCourse={(id) => navigate(`/learning/${id}`)}
            onShare={actions.openShareModal}
        />
      </Suspended>
    );
}

function ProjectDetailWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <ProjectDetailView onBack={() => window.history.back()} onShare={actions.openShareModal} />
      </Suspended>
    );
}

function EventDetailWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <EventDetailView onBack={() => window.history.back()} onShare={actions.openShareModal} />
      </Suspended>
    );
}

function MainLandingWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <MainLandingView onNavigate={actions.handleModuleSelect} />
      </Suspended>
    );
}

function UserProfileWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <UserProfileView 
            onBack={() => window.history.back()} 
            onItemSelect={(id, type) => console.log('Select item', id, type)} 
            onOpenChat={actions.openChatWithUser}
        />
      </Suspended>
    );
}

function BlogPostWrapper() {
    const { actions } = useAppStore();
    return (
      <Suspended>
        <BlogPostView onBack={() => window.history.back()} onArticleSelect={() => {}} onShare={actions.openShareModal} onSave={actions.openSaveModal} />
      </Suspended>
    );
}

function SalesListWrapper() {
    const { type } = useParams<{ type: string }>();
    return (
      <Suspended>
        <SalesListView type={type || 'asset'} onBack={() => window.history.back()} />
      </Suspended>
    );
}

function CreateWrapper({ Component }: { Component: React.FC<{ onBack: () => void }> }) {
    return (
      <Suspended>
        <Component onBack={() => window.history.back()} />
      </Suspended>
    );
}

// Simple wrappers for views that don't need prop injection but need Suspense
const SuspendedView = ({ Component, ...props }: { Component: React.FC<any>, [key: string]: any }) => (
  <Suspended><Component {...props} /></Suspended>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <MainLandingWrapper /> }, 
      { path: 'home', element: <FeedWrapper /> },
      
      // Portfolio
      { path: 'portfolio', element: <PortfolioWrapper /> },
      { path: 'portfolio/:id', element: <PortfolioPostWrapper /> },
      { path: 'create/portfolio', element: <CreateWrapper Component={CreatePortfolioView} /> },

      // Blog
      { path: 'blog', element: <SuspendedView Component={BlogView} activeCategory="Home" /> },
      { path: 'blog/:id', element: <BlogPostWrapper /> },
      { path: 'create/article', element: <CreateWrapper Component={CreateArticleView} /> },

      // Education
      { path: 'education', element: <EducationWrapper /> },
      { path: 'education/:id', element: <CourseDetailWrapper /> },
      { path: 'create/course', element: <CreateWrapper Component={CreateCourseView} /> },

      // Market
      { path: 'market', element: <SuspendedView Component={AssetsView} activeCategory="Home" /> },
      { path: 'market/:id', element: <AssetDetailWrapper /> },
      { path: 'create/asset', element: <CreateWrapper Component={CreateAssetView} /> },

      // Freelance
      { path: 'freelance', element: <SuspendedView Component={FreelanceView} /> },
      { path: 'freelance/:id', element: <Suspended><ServiceDetailView onBack={() => window.history.back()} /></Suspended> },
      { path: 'create/service', element: <CreateWrapper Component={CreateServiceView} /> },

      // Jobs
      { path: 'jobs', element: <SuspendedView Component={JobsView} /> },
      { path: 'jobs/:id', element: <Suspended><JobDetailView onBack={() => window.history.back()} /></Suspended> },
      
      // Community
      { path: 'community', element: <SuspendedView Component={CommunityView} /> }, 
      { path: 'community/:id', element: <ProjectDetailWrapper /> },
      { path: 'create/project', element: <CreateWrapper Component={CreateProjectView} /> },
      
      // Challenges
      { path: 'challenges', element: <SuspendedView Component={ChallengesView} /> },
      { path: 'challenges/:id', element: <Suspended><ChallengeDetailView onBack={() => window.history.back()} /></Suspended> },

      // Events
      { path: 'events', element: <SuspendedView Component={EventsView} /> },
      { path: 'events/:id', element: <EventDetailWrapper /> },
      { path: 'create/event', element: <CreateWrapper Component={CreateEventView} /> },

      // Forum
      { path: 'forum', element: <SuspendedView Component={ForumView} /> },
      { path: 'forum/:id', element: <Suspended><ForumDetailView onBack={() => window.history.back()} /></Suspended> },
      { path: 'create/forum', element: <CreateWrapper Component={CreateForumPostView} /> },

      // People
      { path: 'people', element: <SuspendedView Component={PeopleView} /> },

      // User Profile
      { path: 'user/:username', element: <UserProfileWrapper /> },

      // Personal & Utility
      { path: 'cart', element: <CartViewWrapper /> },
      { path: 'success', element: <SuspendedView Component={SuccessView} /> },
      { path: 'settings', element: <SuspendedView Component={SettingsView} /> },
      { path: 'pro', element: <Suspended><ProUpgradeView onBack={() => window.history.back()} /></Suspended> },
      { path: 'earnings', element: <Suspended><EarningsView onBack={() => window.history.back()} /></Suspended> },
      { path: 'earnings/sales/:type', element: <SalesListWrapper /> },
      
      // Search
      { path: 'search', element: <Suspended><SearchResultsView query="" onItemSelect={() => {}} /></Suspended> },

      // Info Pages
      { path: 'about', element: <MainLandingWrapper /> },
      { path: 'info/:pageId', element: <Suspended><InfoView pageId="" onBack={() => window.history.back()} /></Suspended> },
      
      // Fallback
      { path: 'info/help', element: <SuspendedView Component={ComingSoonView} /> },
      { path: 'info/guides', element: <SuspendedView Component={ComingSoonView} /> }
    ]
  },
  {
    path: '/learning/:courseId?',
    element: <Suspended><CoursePlayerView onBack={() => window.history.back()} /></Suspended>
  }
]);