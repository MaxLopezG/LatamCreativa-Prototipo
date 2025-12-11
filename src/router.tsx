
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import {
  HomeView,
  CoursePlayerView,
  ServiceDetailView,
  JobDetailView,
  ChallengeDetailView,
  ForumDetailView,
  SuccessView,
  SettingsView,
  ProUpgradeView,
  EarningsView,
  InfoView,
  ComingSoonView,
  AdminDashboardView,
  // Wrappers
  SearchResultsWrapper,
  PortfolioWrapper,
  PortfolioPostWrapper,
  FeedWrapper,
  EducationWrapper,
  CartViewWrapper,
  AssetDetailWrapper,
  CourseDetailWrapper,
  ProjectDetailWrapper,
  EventDetailWrapper,
  ServicesHomeWrapper,
  AboutWrapper,
  UserProfileWrapper,
  BlogPostWrapper,
  SalesListWrapper,
  CollectionsWrapper,
  CollectionDetailWrapper,
  CreateWrapper,
  BlogWrapper,
  MarketWrapper,
  FreelanceWrapper,
  JobsWrapper,
  CommunityWrapper,
  ChallengesWrapper,
  EventsWrapper,
  ForumWrapper,
  PeopleWrapper,
  Suspended,
  SuspendedView
} from './router/RouteWrappers';

// --- Admin Views ---
// Keeping AdminLayout inline lazy load or move too? 
// Let's keep it consistent, though it was lazy loaded in original. 
// RouteWrappers handled the lazy loading for views. AdminLayout is a layout.
const AdminLayoutView = React.lazy(() => import('./layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));

// Lazy Load Create Views (passed to CreateWrapper)
// These were lazy loaded in router originally, now we need to import them to pass to CreateWrapper?
// Actually CreateWrapper took "Component".
// In RouteWrappers I didn't export CreatePortfolioView etc. I should check RouteWrappers again.
// Wait, I didn't export the underlying Create views in RouteWrappers. 
// I need to export them or import them here.
// Let's use the ones from RouteWrappers if I exported them? I didn't. 
// I should probably add them to RouteWrappers exports or import them here.
// The cleanest is to import them here using the new paths.

const CreateProjectView = React.lazy(() => import('./views/community/CreateProjectView').then(module => ({ default: module.CreateProjectView })));
const CreateArticleView = React.lazy(() => import('./views/blog/CreateArticleView').then(module => ({ default: module.CreateArticleView })));
const CreatePortfolioView = React.lazy(() => import('./views/portfolio/CreatePortfolioView').then(module => ({ default: module.CreatePortfolioView })));
const CreateCourseView = React.lazy(() => import('./views/education/CreateCourseView').then(module => ({ default: module.CreateCourseView })));
const CreateAssetView = React.lazy(() => import('./views/market/CreateAssetView').then(module => ({ default: module.CreateAssetView })));
const CreateServiceView = React.lazy(() => import('./views/services/CreateServiceView').then(module => ({ default: module.CreateServiceView })));
const CreateForumPostView = React.lazy(() => import('./views/community/CreateForumPostView').then(module => ({ default: module.CreateForumPostView })));
const CreateEventView = React.lazy(() => import('./views/community/CreateEventView').then(module => ({ default: module.CreateEventView })));

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <SuspendedView Component={React.lazy(() => import('./views/auth/AuthView').then(m => ({ default: m.AuthView })))} />
  },
  {
    path: 'admin',
    element: <Suspended><AdminLayoutView /></Suspended>,
    children: [
      { index: true, element: <Suspended><AdminDashboardView /></Suspended> },
      { path: 'users', element: <Suspended><AdminDashboardView /></Suspended> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <ServicesHomeWrapper /> },
      { path: 'home', element: <FeedWrapper /> },

      // Portfolio
      { path: 'portfolio', element: <PortfolioWrapper /> },
      { path: 'portfolio/:id', element: <PortfolioPostWrapper /> },
      { path: 'create/portfolio', element: <CreateWrapper Component={CreatePortfolioView} /> },

      // Blog
      { path: 'blog', element: <BlogWrapper /> },
      { path: 'blog/:id', element: <BlogPostWrapper /> },
      { path: 'create/article', element: <CreateWrapper Component={CreateArticleView} /> },

      // Education
      { path: 'education', element: <EducationWrapper /> },
      { path: 'education/:id', element: <CourseDetailWrapper /> },
      { path: 'create/course', element: <CreateWrapper Component={CreateCourseView} /> },

      // Market
      { path: 'market', element: <MarketWrapper /> },
      { path: 'market/:id', element: <AssetDetailWrapper /> },
      { path: 'create/asset', element: <CreateWrapper Component={CreateAssetView} /> },

      // Freelance
      { path: 'freelance', element: <FreelanceWrapper /> },
      { path: 'freelance/:id', element: <Suspended><ServiceDetailView onBack={() => window.history.back()} /></Suspended> },
      { path: 'create/service', element: <CreateWrapper Component={CreateServiceView} /> },

      // Jobs
      { path: 'jobs', element: <JobsWrapper /> },
      { path: 'jobs/:id', element: <Suspended><JobDetailView onBack={() => window.history.back()} /></Suspended> },

      // Community
      { path: 'community', element: <CommunityWrapper /> },
      { path: 'community/:id', element: <ProjectDetailWrapper /> },
      { path: 'create/project', element: <CreateWrapper Component={CreateProjectView} /> },

      // Challenges
      { path: 'challenges', element: <ChallengesWrapper /> },
      { path: 'challenges/:id', element: <Suspended><ChallengeDetailView onBack={() => window.history.back()} /></Suspended> },

      // Events
      { path: 'events', element: <EventsWrapper /> },
      { path: 'events/:id', element: <EventDetailWrapper /> },
      { path: 'create/event', element: <CreateWrapper Component={CreateEventView} /> },

      // Forum
      { path: 'forum', element: <ForumWrapper /> },
      { path: 'forum/:id', element: <Suspended><ForumDetailView onBack={() => window.history.back()} /></Suspended> },
      { path: 'create/forum', element: <CreateWrapper Component={CreateForumPostView} /> },

      // People
      { path: 'people', element: <PeopleWrapper /> },

      // User Profile
      { path: 'profile', element: <UserProfileWrapper /> },
      { path: 'user/:username', element: <UserProfileWrapper /> },

      // Personal & Utility
      { path: 'cart', element: <CartViewWrapper /> },
      { path: 'success', element: <SuspendedView Component={SuccessView} /> },
      { path: 'collections', element: <CollectionsWrapper /> },
      { path: 'collections/:id', element: <CollectionDetailWrapper /> },
      { path: 'settings', element: <SuspendedView Component={SettingsView} /> },
      { path: 'pro', element: <Suspended><ProUpgradeView onBack={() => window.history.back()} /></Suspended> },
      { path: 'earnings', element: <Suspended><EarningsView onBack={() => window.history.back()} /></Suspended> },
      { path: 'earnings/sales/:type', element: <SalesListWrapper /> },

      // Search
      { path: 'search', element: <SearchResultsWrapper /> },

      // Info Pages
      { path: 'about', element: <AboutWrapper /> },
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

