
import React, { Suspense } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { Loader } from '../components/common/Loader';
import { lazyImport } from '../utils/lazyImport';

// Lazy Load Views - Only Portfolio, Blog, and User related
const HomeView = lazyImport(() => import('../views/general/HomeView').then(module => ({ default: module.HomeView })));
const PortfolioView = lazyImport(() => import('../views/portfolio/PortfolioView').then(module => ({ default: module.PortfolioView })));
const PortfolioPostView = lazyImport(() => import('../views/portfolio/PortfolioPostView').then(module => ({ default: module.PortfolioPostView })));
const BlogView = lazyImport(() => import('../views/blog/BlogView').then(module => ({ default: module.BlogView })));
const BlogPostView = lazyImport(() => import('../views/blog/BlogPostView').then(module => ({ default: module.BlogPostView })));
const UserProfileView = lazyImport(() => import('../views/user/UserProfileView').then(module => ({ default: module.UserProfileView })));
const SettingsView = lazyImport(() => import('../views/user/SettingsView').then(module => ({ default: module.SettingsView })));
const ProUpgradeView = lazyImport(() => import('../views/user/ProUpgradeView').then(module => ({ default: module.ProUpgradeView })));
const AboutView = lazyImport(() => import('../views/general/AboutView').then(module => ({ default: module.AboutView })));
const InfoView = lazyImport(() => import('../views/general/InfoView').then(module => ({ default: module.InfoView })));
const SearchResultsView = lazyImport(() => import('../views/general/SearchResultsView').then(module => ({ default: module.SearchResultsView })));
const ComingSoonView = lazyImport(() => import('../views/general/ComingSoonView'));
const SuccessView = lazyImport(() => import('../views/general/SuccessView').then(module => ({ default: module.SuccessView })));
const CollectionsView = lazyImport(() => import('../views/user/CollectionsView').then(module => ({ default: module.CollectionsView })));
const CollectionDetailView = lazyImport(() => import('../views/user/CollectionDetailView').then(module => ({ default: module.CollectionDetailView })));

// Helper to wrap components in Suspense
export const Suspended = ({ children }: { children?: React.ReactNode }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

// Wrappers
export function SearchResultsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const handleItemSelect = (id: string, type: string) => {
    if (type === 'portfolio') navigate(`/portfolio/${id}`);
    if (type === 'blog') navigate(`/blog/${id}`);
  };

  return (
    <Suspended>
      <SearchResultsView query={query} onItemSelect={handleItemSelect} />
    </Suspended>
  );
}



export function PortfolioWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para crear contenido', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <PortfolioView
        activeCategory={state.activeCategory}
        onItemSelect={(id) => navigate(`/portfolio/${id}`)}
        onCreateClick={() => handleCreateClick('/create/portfolio')}
        onSave={actions.openSaveModal}
        contentMode={state.contentMode}
      />
    </Suspended>
  );
}

export function PortfolioPostWrapper() {
  const { actions } = useAppStore();
  const navigate = useNavigate();
  return (
    <Suspended>
      <PortfolioPostView
        onBack={() => window.history.back()}
        onShare={actions.openShareModal}
        onSave={actions.openSaveModal}
        onAuthorClick={(user: any) => {
          const name = user.username || user.name || user;
          navigate(`/user/${encodeURIComponent(name)}`);
        }}
      />
    </Suspended>
  );
}

export function HomeWrapper() {
  const { state } = useAppStore();
  const navigate = useNavigate();

  // If user is logged in, show Social Feed. Otherwise, show Welcome/Landing Page.
  if (state.user) {
    // Lazy load SocialFeedView for authenticated users
    const SocialFeedView = lazyImport(() => import('../views/general/SocialFeedView').then(module => ({ default: module.SocialFeedView })));
    return (
      <Suspended>
        <SocialFeedView />
      </Suspended>
    );
  }

  // Not logged in - show Welcome landing page
  const WelcomeView = lazyImport(() => import('../views/general/WelcomeView').then(module => ({ default: module.WelcomeView })));
  return (
    <Suspended>
      <WelcomeView />
    </Suspended>
  );
}

export function AboutWrapper() {
  const navigate = useNavigate();
  return (
    <Suspended>
      <AboutView onNavigate={(path) => navigate(path)} />
    </Suspended>
  );
}

export function UserProfileWrapper() {
  const { actions } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const authorFromState = location.state?.author;

  return (
    <Suspended>
      <UserProfileView
        author={authorFromState}
        onBack={() => window.history.back()}
        onItemSelect={(id, type) => {
          if (type === 'blog') navigate(`/blog/${id}`);
          else if (type === 'portfolio') navigate(`/portfolio/${id}`);
        }}
      />
    </Suspended>
  );
}

export function BlogPostWrapper() {
  const { actions } = useAppStore();
  const navigate = useNavigate();
  return (
    <Suspended>
      <BlogPostView
        onBack={() => window.history.back()}
        onArticleSelect={(id) => navigate(`/blog/${id}`)}
        onShare={actions.openShareModal}
        onSave={actions.openSaveModal}
        onAuthorClick={(author: any) => {
          const name = typeof author === 'object' ? author.name : author;
          const target = typeof author === 'object' ? (author.username || author.name) : author;
          navigate(`/user/${encodeURIComponent(target)}`, { state: { author: typeof author === 'object' ? author : { name: author } } });
        }}
      />
    </Suspended>
  );
}

export function CollectionsWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para crear colecciones', 'info');
      navigate('/auth');
      return;
    }
    actions.openSaveModal('', '', 'collection');
  };

  return (
    <Suspended>
      <CollectionsView
        onCreateClick={handleCreateClick}
        onCollectionSelect={(id) => navigate(`/collections/${id}`)}
      />
    </Suspended>
  );
}

export function CollectionDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const { actions } = useAppStore();
  const navigate = useNavigate();

  const handleItemSelect = (itemId: string, type: string = 'project') => {
    if (type === 'article') {
      navigate(`/blog/${itemId}`);
    } else {
      navigate(`/portfolio/${itemId}`);
    }
  };

  return (
    <Suspended>
      <CollectionDetailView
        collectionId={id || ''}
        onBack={() => window.history.back()}
        onItemSelect={handleItemSelect}
        onShare={actions.openShareModal}
      />
    </Suspended>
  );
}

export function CreateWrapper({ Component }: { Component: React.FC<{ onBack: () => void }> }) {
  return (
    <Suspended>
      <Component onBack={() => window.history.back()} />
    </Suspended>
  );
}

export function BlogWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para escribir un artículo', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <BlogView
        activeCategory={state.activeCategory}
        onArticleSelect={(id) => navigate(`/blog/${id}`)}
        onCreateClick={() => handleCreateClick('/create/article')}
        onSave={actions.openSaveModal}
      />
    </Suspended>
  );
}

// --- Forum ---
const ForumView = lazyImport(() => import('../views/forum/ForumView').then(module => ({ default: module.ForumView })));
const ThreadView = lazyImport(() => import('../views/forum/ThreadView').then(module => ({ default: module.ThreadView })));
const CreateThreadView = lazyImport(() => import('../views/forum/CreateThreadView').then(module => ({ default: module.CreateThreadView })));
const EditThreadView = lazyImport(() => import('../views/forum/EditThreadView').then(module => ({ default: module.EditThreadView })));

export function ForumWrapper() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  return (
    <Suspended>
      <ForumView
        activeCategory={slug}
        onThreadSelect={(id) => navigate(`/forum/${id}`)}
        onCreateClick={() => navigate('/forum/new')}
      />
    </Suspended>
  );
}

export function ForumCategoryWrapper() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  return (
    <Suspended>
      <ForumView
        activeCategory={slug}
        onThreadSelect={(id) => navigate(`/forum/${id}`)}
        onCreateClick={() => navigate('/forum/new')}
      />
    </Suspended>
  );
}

export function ThreadWrapper() {
  return (
    <Suspended>
      <ThreadView />
    </Suspended>
  );
}

export function CreateThreadWrapper() {
  return (
    <Suspended>
      <CreateThreadView />
    </Suspended>
  );
}

export function EditThreadWrapper() {
  return (
    <Suspended>
      <EditThreadView />
    </Suspended>
  );
}

// Simple wrapper for views that don't need prop injection but need Suspense
export const SuspendedView = ({ Component, ...props }: { Component: React.FC<any>, [key: string]: any }) => (
  <Suspended><Component {...props} /></Suspended>
);

// --- Admin Views ---
const AdminDashboard = lazyImport(() => import('../views/admin/AdminDashboardView').then(module => ({ default: module.AdminDashboardView })));

// Exports for direct use in router
export {
  SuccessView,
  SettingsView,
  ProUpgradeView,
  InfoView,
  ComingSoonView,
  AdminDashboard as AdminDashboardView
};

