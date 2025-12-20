
import React, { Suspense } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { Loader } from '../components/common/Loader';
import { lazyImport } from '../utils/lazyImport';

// Lazy Load Views using new paths
const HomeView = lazyImport(() => import('../views/general/HomeView').then(module => ({ default: module.HomeView })));
const FeedView = lazyImport(() => import('../views/general/FeedView').then(module => ({ default: module.FeedView })));
const PortfolioView = lazyImport(() => import('../views/portfolio/PortfolioView').then(module => ({ default: module.PortfolioView })));
const PortfolioPostView = lazyImport(() => import('../views/portfolio/PortfolioPostView').then(module => ({ default: module.PortfolioPostView })));
const BlogView = lazyImport(() => import('../views/blog/BlogView').then(module => ({ default: module.BlogView })));
const BlogPostView = lazyImport(() => import('../views/blog/BlogPostView').then(module => ({ default: module.BlogPostView })));
const EducationView = lazyImport(() => import('../views/education/EducationView').then(module => ({ default: module.EducationView })));
const CourseDetailView = lazyImport(() => import('../views/education/CourseDetailView').then(module => ({ default: module.CourseDetailView })));
const CoursePlayerView = lazyImport(() => import('../views/education/CoursePlayerView').then(module => ({ default: module.CoursePlayerView })));
const AssetsView = lazyImport(() => import('../views/market/AssetsView').then(module => ({ default: module.AssetsView })));
const AssetDetailView = lazyImport(() => import('../views/market/AssetDetailView').then(module => ({ default: module.AssetDetailView })));
const FreelanceView = lazyImport(() => import('../views/services/FreelanceView').then(module => ({ default: module.FreelanceView })));
const ServiceDetailView = lazyImport(() => import('../views/services/ServiceDetailView').then(module => ({ default: module.ServiceDetailView })));
const JobsView = lazyImport(() => import('../views/services/JobsView').then(module => ({ default: module.JobsView })));
const JobDetailView = lazyImport(() => import('../views/services/JobDetailView').then(module => ({ default: module.JobDetailView })));
const CommunityView = lazyImport(() => import('../views/community/CommunityView').then(module => ({ default: module.CommunityView })));
const ProjectDetailView = lazyImport(() => import('../views/community/ProjectDetailView').then(module => ({ default: module.ProjectDetailView })));
const ChallengesView = lazyImport(() => import('../views/community/ChallengesView').then(module => ({ default: module.ChallengesView })));
const ChallengeDetailView = lazyImport(() => import('../views/community/ChallengeDetailView').then(module => ({ default: module.ChallengeDetailView })));
const EventsView = lazyImport(() => import('../views/community/EventsView').then(module => ({ default: module.EventsView })));
const EventDetailView = lazyImport(() => import('../views/community/EventDetailView').then(module => ({ default: module.EventDetailView })));
const ForumView = lazyImport(() => import('../views/community/ForumView').then(module => ({ default: module.ForumView })));
const ForumDetailView = lazyImport(() => import('../views/community/ForumDetailView').then(module => ({ default: module.ForumDetailView })));
const PeopleView = lazyImport(() => import('../views/user/PeopleView').then(module => ({ default: module.PeopleView })));
const UserProfileView = lazyImport(() => import('../views/user/UserProfileView').then(module => ({ default: module.UserProfileView })));
const CartView = lazyImport(() => import('../views/market/CartView').then(module => ({ default: module.CartView })));
const SettingsView = lazyImport(() => import('../views/user/SettingsView').then(module => ({ default: module.SettingsView })));
const ProUpgradeView = lazyImport(() => import('../views/user/ProUpgradeView').then(module => ({ default: module.ProUpgradeView })));
const EarningsView = lazyImport(() => import('../views/market/EarningsView').then(module => ({ default: module.EarningsView })));
const SalesListView = lazyImport(() => import('../views/market/SalesListView').then(module => ({ default: module.SalesListView })));

const ServicesHomeView = lazyImport(() => import('../views/services/ServicesHomeView').then(module => ({ default: module.ServicesHomeView })));
const AboutView = lazyImport(() => import('../views/general/AboutView').then(module => ({ default: module.AboutView })));
const InfoView = lazyImport(() => import('../views/general/InfoView').then(module => ({ default: module.InfoView })));
const SearchResultsView = lazyImport(() => import('../views/general/SearchResultsView').then(module => ({ default: module.SearchResultsView })));

const ComingSoonView = lazyImport(() => import('../views/general/ComingSoonView'));
const SuccessView = lazyImport(() => import('../views/general/SuccessView').then(module => ({ default: module.SuccessView })));
const CollectionsView = lazyImport(() => import('../views/user/CollectionsView').then(module => ({ default: module.CollectionsView })));
const CollectionDetailView = lazyImport(() => import('../views/user/CollectionDetailView').then(module => ({ default: module.CollectionDetailView })));
const AuthView = lazyImport(() => import('../views/auth/AuthView').then(module => ({ default: module.AuthView })));

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
    if (type === 'course') navigate(`/education/${id}`);
    if (type === 'asset') navigate(`/market/${id}`);
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

export function FeedWrapper() {
  const { state } = useAppStore();
  const navigate = useNavigate();

  const handleItemSelect = (id: string, type: string) => {
    if (type === 'portfolio') navigate(`/portfolio/${id}`);
    if (type === 'course') navigate(`/education/${id}`);
    if (type === 'asset') navigate(`/market/${id}`);
    if (type === 'blog') navigate(`/blog/${id}`);
  };

  return (
    <Suspended>
      <FeedView
        onNavigateToModule={(mod) => navigate(mod === 'home' ? '/' : `/${mod}`)}
        onItemSelect={handleItemSelect}
        contentMode={state.contentMode}
      />
    </Suspended>
  );
}

export function EducationWrapper() {
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
      <EducationView
        activeCategory={state.activeCategory}
        onCourseSelect={(id) => navigate(`/education/${id}`)}
        onCreateClick={() => handleCreateClick('/create/course')}
        contentMode={state.contentMode}
      />
    </Suspended>
  );
}

export function CartViewWrapper() {
  const { state, actions } = useAppStore();
  return (
    <Suspended>
      <CartView items={state.cartItems} onRemove={actions.removeFromCart} onContinueShopping={() => { }} />
    </Suspended>
  );
}

export function AssetDetailWrapper() {
  const { actions } = useAppStore();
  return (
    <Suspended>
      <AssetDetailView onBack={() => window.history.back()} onAddToCart={actions.addToCart} onBuyNow={actions.handleBuyNow} onSave={actions.openSaveModal} onShare={actions.openShareModal} />
    </Suspended>
  );
}

export function CourseDetailWrapper() {
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

export function ProjectDetailWrapper() {
  const { actions } = useAppStore();
  return (
    <Suspended>
      <ProjectDetailView onBack={() => window.history.back()} onShare={actions.openShareModal} />
    </Suspended>
  );
}

export function EventDetailWrapper() {
  const { actions } = useAppStore();
  return (
    <Suspended>
      <EventDetailView onBack={() => window.history.back()} onShare={actions.openShareModal} />
    </Suspended>
  );
}

export function ServicesHomeWrapper() {
  const { actions } = useAppStore();
  const navigate = useNavigate();

  const handleNavigate = (moduleId: string) => {
    if (moduleId === 'about') navigate('/about');
    else {
      actions.handleModuleSelect(moduleId);
      if (moduleId === 'education') navigate('/education');
      else if (moduleId === 'market') navigate('/market');
      else navigate(`/${moduleId}`);
    }
  };

  return (
    <Suspended>
      <ServicesHomeView onNavigate={handleNavigate} />
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
          else if (type === 'course') navigate(`/education/${id}`);
          else if (type === 'asset') navigate(`/market/${id}`);
        }}
        onOpenChat={actions.openChatWithUser}
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

export function SalesListWrapper() {
  const { type } = useParams<{ type: string }>();
  return (
    <Suspended>
      <SalesListView type={type || 'asset'} onBack={() => window.history.back()} />
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

export function MarketWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para vender un asset', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <AssetsView
        activeCategory={state.activeCategory}
        onAssetSelect={(id) => navigate(`/market/${id}`)}
        onCreateClick={() => handleCreateClick('/create/asset')}
        onSave={actions.openSaveModal}
      />
    </Suspended>
  );
}

export function FreelanceWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para ofrecer un servicio', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <FreelanceView
        activeCategory={state.activeCategory}
        onServiceSelect={(id) => navigate(`/freelance/${id}`)}
        onCreateClick={() => handleCreateClick('/create/service')}
      />
    </Suspended>
  );
}

export function JobsWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para publicar un empleo', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <JobsView
        onJobSelect={(id) => navigate(`/jobs/${id}`)}
        onCreateClick={() => handleCreateClick('/create/service')}
      />
    </Suspended>
  );
}

export function CommunityWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para crear un proyecto', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <CommunityView
        onProjectSelect={(id) => navigate(`/community/${id}`)}
        onCreateProjectClick={() => handleCreateClick('/create/project')}
      />
    </Suspended>
  );
}

export function ChallengesWrapper() {
  const navigate = useNavigate();
  return (
    <Suspended>
      <ChallengesView
        onChallengeSelect={(id) => navigate(`/challenges/${id}`)}
      />
    </Suspended>
  );
}

export function EventsWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para publicar un evento', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <EventsView
        onEventSelect={(id) => navigate(`/events/${id}`)}
        onCreateClick={() => handleCreateClick('/create/event')}
      />
    </Suspended>
  );
}

export function ForumWrapper() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();

  const handleCreateClick = (path: string) => {
    if (!state.user) {
      actions.showToast('Debes iniciar sesión para preguntar en el foro', 'info');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <Suspended>
      <ForumView
        onPostSelect={(id) => navigate(`/forum/${id}`)}
        onCreateClick={() => handleCreateClick('/create/forum')}
      />
    </Suspended>
  );
}

export function PeopleWrapper() {
  const { actions } = useAppStore();
  const navigate = useNavigate();
  return (
    <Suspended>
      <PeopleView
        onProfileSelect={(user: any) => {
          const name = user.username || user.name || user;
          actions.setViewingAuthor(user);
          navigate(`/user/${encodeURIComponent(name)}`);
        }}
      />
    </Suspended>
  );
}

// Simple wrapper for views that don't need prop injection but need Suspense
export const SuspendedView = ({ Component, ...props }: { Component: React.FC<any>, [key: string]: any }) => (
  <Suspended><Component {...props} /></Suspended>
);

// --- Admin Views ---
const AdminLayoutView = lazyImport(() => import('../layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazyImport(() => import('../views/admin/AdminDashboardView').then(module => ({ default: module.AdminDashboardView })));

// Exports for direct use in router
export {
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
  AdminDashboard as AdminDashboardView // Re-export if needed or import directly in router
};
