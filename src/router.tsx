
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import {
  SuccessView,
  SettingsView,
  ProUpgradeView,
  InfoView,
  ComingSoonView,
  AdminDashboardView,
  // Wrappers
  SearchResultsWrapper,
  PortfolioWrapper,
  PortfolioPostWrapper,
  HomeWrapper,
  AboutWrapper,
  UserProfileWrapper,
  BlogPostWrapper,
  CollectionsWrapper,
  CollectionDetailWrapper,
  CreateWrapper,
  BlogWrapper,
  Suspended,
  SuspendedView
} from './router/RouteWrappers';

import { lazyImport } from './utils/lazyImport';

// --- Admin Views ---
const AdminLayoutView = lazyImport(() => import('./layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));

// Lazy Load Create Views
const CreateArticleView = lazyImport(() => import('./views/blog/CreateArticleView').then(module => ({ default: module.CreateArticleView })));
const CreatePortfolioView = lazyImport(() => import('./views/portfolio/CreatePortfolioView').then(module => ({ default: module.CreatePortfolioView })));

// 404 View
const NotFoundView = lazyImport(() => import('./views/general/NotFoundView').then(module => ({ default: module.NotFoundView })));

// Service Coming Soon Pages
import { ForumComingSoon, JobsComingSoon, ProjectsComingSoon, ContestsComingSoon } from './views/general/ServicePages';

// New Services Coming Soon
const CoursesView = lazyImport(() => import('./views/general/CoursesView').then(module => ({ default: module.CoursesView })));
const FreelanceView = lazyImport(() => import('./views/general/FreelanceView').then(module => ({ default: module.FreelanceView })));

// Legal Pages
const TermsView = lazyImport(() => import('./views/legal/TermsView').then(module => ({ default: module.TermsView })));
const PrivacyView = lazyImport(() => import('./views/legal/PrivacyView').then(module => ({ default: module.PrivacyView })));

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <SuspendedView Component={lazyImport(() => import('./views/auth/AuthView').then(m => ({ default: m.AuthView })))} />
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
      // Home - Landing Page
      { index: true, element: <HomeWrapper /> },

      // Portfolio
      { path: 'portfolio', element: <PortfolioWrapper /> },
      { path: 'portfolio/categoria/:slug', element: <PortfolioWrapper /> },
      { path: 'portfolio/:id', element: <PortfolioPostWrapper /> },
      { path: 'create/portfolio', element: <CreateWrapper Component={CreatePortfolioView} /> },

      // Blog
      { path: 'blog', element: <BlogWrapper /> },
      { path: 'blog/categoria/:slug', element: <BlogWrapper /> },
      { path: 'blog/:id', element: <BlogPostWrapper /> },
      { path: 'create/article', element: <CreateWrapper Component={CreateArticleView} /> },

      // User Profile
      { path: 'profile', element: <UserProfileWrapper /> },
      { path: 'user/:username', element: <UserProfileWrapper /> },

      // Personal & Utility
      { path: 'success', element: <SuspendedView Component={SuccessView} /> },
      { path: 'collections', element: <CollectionsWrapper /> },
      { path: 'collections/:id', element: <CollectionDetailWrapper /> },
      { path: 'settings', element: <SuspendedView Component={SettingsView} /> },
      { path: 'pro', element: <Suspended><ProUpgradeView onBack={() => window.history.back()} /></Suspended> },

      // Search
      { path: 'search', element: <SearchResultsWrapper /> },

      // Info Pages
      { path: 'about', element: <AboutWrapper /> },
      { path: 'info/:pageId', element: <Suspended><InfoView pageId="" onBack={() => window.history.back()} /></Suspended> },

      // Fallback
      { path: 'info/help', element: <SuspendedView Component={ComingSoonView} /> },
      { path: 'info/guides', element: <SuspendedView Component={ComingSoonView} /> },

      // Coming Soon Services
      { path: 'forum', element: <ForumComingSoon /> },
      { path: 'jobs', element: <JobsComingSoon /> },
      { path: 'projects', element: <ProjectsComingSoon /> },
      { path: 'contests', element: <ContestsComingSoon /> },
      { path: 'courses', element: <SuspendedView Component={CoursesView} /> },
      { path: 'freelance', element: <SuspendedView Component={FreelanceView} /> },

      // Legal Pages
      { path: 'terms', element: <SuspendedView Component={TermsView} /> },
      { path: 'privacy', element: <SuspendedView Component={PrivacyView} /> },

      // 404 - Catch all unmatched routes
      { path: '*', element: <SuspendedView Component={NotFoundView} /> }
    ]
  }
]);
