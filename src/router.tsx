
import React from 'react';
import { createBrowserRouter, Navigate, useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import { CollectionDetailView } from './views/CollectionDetailView'; // Import new view
import { UserProfileView } from './views/UserProfileView';
import { CartView } from './views/CartView';
import { SettingsView } from './views/SettingsView';
import { ProUpgradeView } from './views/ProUpgradeView';
import { MainLandingView } from './views/MainLandingView';
import { InfoView } from './views/InfoView';
import { SearchResultsView } from './views/SearchResultsView';

// Create Views
import { CreateProjectView } from './views/CreateProjectView';
import { CreateArticleView } from './views/CreateArticleView';
import { CreatePortfolioView } from './views/CreatePortfolioView';
import { CreateCourseView } from './views/CreateCourseView';
import { CreateAssetView } from './views/CreateAssetView';
import { CreateServiceView } from './views/CreateServiceView';
import { CreateForumPostView } from './views/CreateForumPostView';
import { CreateEventView } from './views/CreateEventView';

// --- WRAPPERS ---

const PortfolioDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <PortfolioPostView itemId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} onSave={actions.openSaveModal} />;
};

const BlogDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <BlogPostView articleId={id!} onBack={() => navigate(-1)} onArticleSelect={(newId) => navigate(`/blog/${newId}`)} onAuthorClick={(name) => navigate(`/user/${name}`)} onSave={actions.openSaveModal} />;
};

const CourseDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <CourseDetailView courseId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} onAddToCart={actions.addToCart} onBuyNow={(item) => { actions.addToCart(item); navigate('/cart'); }} />;
};

const AssetDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <AssetDetailView assetId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} onAddToCart={actions.addToCart} onBuyNow={(item) => { actions.addToCart(item); navigate('/cart'); }} onSave={actions.openSaveModal} />;
};

const ServiceDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <ServiceDetailView serviceId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} />;
};

const JobDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <JobDetailView jobId={id!} onBack={() => navigate(-1)} />;
};

const ProjectDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <ProjectDetailView projectId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} />;
};

const ChallengeDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ChallengeDetailView challengeId={id!} onBack={() => navigate(-1)} />;
};

const EventDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <EventDetailView eventId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} />;
};

const ForumDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  return <ForumDetailView postId={id!} onBack={() => navigate(-1)} onAuthorClick={(name) => navigate(`/user/${name}`)} />;
};

const SearchWrapper = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const handleItemSelect = (id: string, type: string) => {
     if(type === 'portfolio') navigate(`/portfolio/${id}`);
     if(type === 'course') navigate(`/education/${id}`);
     if(type === 'asset') navigate(`/market/${id}`);
     if(type === 'blog') navigate(`/blog/${id}`);
     if(type === 'service') navigate(`/freelance/${id}`);
  };

  return <SearchResultsView query={query} onItemSelect={handleItemSelect} />;
};

const UserProfileWrapper = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppStore();
  
  const authorName = username ? username.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Unknown';

  const handleItemSelect = (id: string, type: string) => {
     if(type === 'portfolio') navigate(`/portfolio/${id}`);
     if(type === 'course') navigate(`/education/${id}`);
     if(type === 'blog') navigate(`/blog/${id}`);
  };

  return <UserProfileView authorName={authorName} onBack={() => navigate(-1)} onItemSelect={handleItemSelect} onOpenChat={actions.openChatWithUser} />;
};

const FeedWrapper = () => {
    const navigate = useNavigate();
    const { state } = useAppStore();
    
    const handleItemSelect = (id: string, type: string) => {
        if(type === 'portfolio') navigate(`/portfolio/${id}`);
        if(type === 'course') navigate(`/education/${id}`);
        if(type === 'asset') navigate(`/market/${id}`);
        if(type === 'blog') navigate(`/blog/${id}`);
    };

    return <FeedView onNavigateToModule={(mod) => navigate(`/${mod}`)} onItemSelect={handleItemSelect} contentMode={state.contentMode} />;
};

const CollectionDetailWrapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const handleItemSelect = (itemId: string, type: string) => {
        if(type === 'portfolio') navigate(`/portfolio/${itemId}`);
        if(type === 'asset') navigate(`/market/${itemId}`);
    };

    return <CollectionDetailView collectionId={id!} onBack={() => navigate(-1)} onItemSelect={handleItemSelect} />;
};

function PortfolioWrapper() {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    return <PortfolioView activeCategory={state.activeCategory} onItemSelect={(id) => navigate(`/portfolio/${id}`)} onCreateClick={() => navigate('/create/portfolio')} onSave={actions.openSaveModal} contentMode={state.contentMode} />;
}

function BlogWrapper() {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    return <BlogView activeCategory={state.activeCategory} onArticleSelect={(id) => navigate(`/blog/${id}`)} onCreateClick={() => navigate('/create/article')} onSave={actions.openSaveModal} />;
}

function EducationWrapper() {
    const { state } = useAppStore();
    const navigate = useNavigate();
    return <EducationView activeCategory={state.activeCategory} onCourseSelect={(id) => navigate(`/education/${id}`)} onCreateClick={() => navigate('/create/course')} contentMode={state.contentMode} />;
}

function MarketWrapper() {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    return <AssetsView activeCategory={state.activeCategory} onAssetSelect={(id) => navigate(`/market/${id}`)} onCreateClick={() => navigate('/create/asset')} onSave={actions.openSaveModal} />;
}

function FreelanceWrapper() {
    const { state } = useAppStore();
    const navigate = useNavigate();
    return <FreelanceView activeCategory={state.activeCategory} onServiceSelect={(id) => navigate(`/freelance/${id}`)} onCreateClick={() => navigate('/create/service')} />;
}

function JobsWrapper() {
    const navigate = useNavigate();
    return <JobsView onJobSelect={(id) => navigate(`/jobs/${id}`)} onCreateClick={() => navigate('/create/service')} />;
}

function CommunityWrapper() {
    const navigate = useNavigate();
    return <CommunityView onProjectSelect={(id) => navigate(`/community/${id}`)} onCreateProjectClick={() => navigate('/create/project')} />;
}

function ChallengesWrapper() {
    const navigate = useNavigate();
    return <ChallengesView onChallengeSelect={(id) => navigate(`/challenges/${id}`)} />;
}

function EventsWrapper() {
    const navigate = useNavigate();
    return <EventsView onEventSelect={(id) => navigate(`/events/${id}`)} onCreateClick={() => navigate('/create/event')} />;
}

function ForumWrapper() {
    const navigate = useNavigate();
    return <ForumView onPostSelect={(id) => navigate(`/forum/${id}`)} onCreateClick={() => navigate('/create/forum')} />;
}

function PeopleWrapper() {
    const navigate = useNavigate();
    return <PeopleView onProfileSelect={(name) => navigate(`/user/${name.replace(/\s+/g, '-').toLowerCase()}`)} />;
}

function CollectionsWrapper() {
    const navigate = useNavigate();
    return <CollectionsView onCreateClick={() => navigate('/collections')} />;
}

function CartViewWrapper() {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    return <CartView items={state.cartItems} onRemove={actions.removeFromCart} onContinueShopping={() => navigate('/market')} />;
}

function InfoPageWrapper() {
    const { pageId } = useParams();
    const navigate = useNavigate();
    return <InfoView pageId={`info-${pageId}`} onBack={() => navigate(-1)} />;
}

function PlayerWrapper() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    return <CoursePlayerView courseId={courseId} onBack={() => navigate('/education')} />;
}

function CreateWrapper({ Component }: { Component: React.FC<{ onBack: () => void }> }) {
    const navigate = useNavigate();
    return <Component onBack={() => navigate(-1)} />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <MainLandingView /> }, 
      { path: 'home', element: <FeedWrapper /> },
      
      // Portfolio
      { path: 'portfolio', element: <PortfolioWrapper /> },
      { path: 'portfolio/:id', element: <PortfolioDetailWrapper /> },
      { path: 'create/portfolio', element: <CreateWrapper Component={CreatePortfolioView} /> },

      // Blog
      { path: 'blog', element: <BlogWrapper /> },
      { path: 'blog/:id', element: <BlogDetailWrapper /> },
      { path: 'create/article', element: <CreateWrapper Component={CreateArticleView} /> },

      // Education
      { path: 'education', element: <EducationWrapper /> },
      { path: 'education/:id', element: <CourseDetailWrapper /> },
      { path: 'create/course', element: <CreateWrapper Component={CreateCourseView} /> },

      // Market (Assets)
      { path: 'market', element: <MarketWrapper /> },
      { path: 'market/:id', element: <AssetDetailWrapper /> },
      { path: 'create/asset', element: <CreateWrapper Component={CreateAssetView} /> },

      // Freelance
      { path: 'freelance', element: <FreelanceWrapper /> },
      { path: 'freelance/:id', element: <ServiceDetailWrapper /> },
      { path: 'create/service', element: <CreateWrapper Component={CreateServiceView} /> },

      // Jobs
      { path: 'jobs', element: <JobsWrapper /> },
      { path: 'jobs/:id', element: <JobDetailWrapper /> },
      
      // Community & Projects
      { path: 'community', element: <CommunityWrapper /> }, 
      { path: 'community/:id', element: <ProjectDetailWrapper /> },
      { path: 'create/project', element: <CreateWrapper Component={CreateProjectView} /> },
      
      // Challenges
      { path: 'challenges', element: <ChallengesWrapper /> },
      { path: 'challenges/:id', element: <ChallengeDetailWrapper /> },

      // Events
      { path: 'events', element: <EventsWrapper /> },
      { path: 'events/:id', element: <EventDetailWrapper /> },
      { path: 'create/event', element: <CreateWrapper Component={CreateEventView} /> },

      // Forum
      { path: 'forum', element: <ForumWrapper /> },
      { path: 'forum/:id', element: <ForumDetailWrapper /> },
      { path: 'create/forum', element: <CreateWrapper Component={CreateForumPostView} /> },

      // People
      { path: 'people', element: <PeopleWrapper /> },

      // User Profile
      { path: 'user/:username', element: <UserProfileWrapper /> },

      // Personal
      { path: 'collections', element: <CollectionsWrapper /> },
      { path: 'collections/:id', element: <CollectionDetailWrapper /> }, // New Route
      { path: 'cart', element: <CartViewWrapper /> },
      { path: 'settings', element: <SettingsView /> },
      { path: 'pro', element: <ProUpgradeView onBack={() => window.history.back()} /> },
      
      // Search
      { path: 'search', element: <SearchWrapper /> },

      // Info Pages
      { path: 'about', element: <MainLandingView /> },
      { path: 'info/:pageId', element: <InfoPageWrapper /> }
    ]
  },
  {
    path: '/learning/:courseId?',
    element: <PlayerWrapper />
  }
]);
