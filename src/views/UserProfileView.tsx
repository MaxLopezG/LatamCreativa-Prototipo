
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Twitter, Instagram, Globe, Layers, GraduationCap, MessageSquare, Star, Lock, Check } from 'lucide-react';
import { PORTFOLIO_ITEMS, BLOG_ITEMS, EDUCATION_ITEMS, ARTIST_TIERS, ARTIST_DIRECTORY } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { BlogCard } from '../components/cards/BlogCard';
import { EducationCard } from '../components/cards/EducationCard';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { GamificationBox } from '../components/profile/GamificationBox';
import { ExperienceTimeline } from '../components/profile/ExperienceTimeline';
import { useAppStore } from '../hooks/useAppStore';

// Mock Data (Static for now)
const EXPERIENCE = [
  { id: 1, role: "Senior 3D Artist", company: "Ubisoft", period: "2021 - Presente", location: "Barcelona, España", description: "Liderando el equipo de entornos para proyectos AAA." },
  { id: 2, role: "Environment Artist", company: "Gameloft", period: "2018 - 2021", location: "Madrid, España", description: "Modelado y texturizado de escenarios." }
];
const EDUCATION = [
  { id: 1, degree: "Máster en Arte Digital", school: "Voxel School", period: "2017 - 2018" }
];

interface UserProfileViewProps {
  authorName?: string;
  onBack?: () => void;
  onItemSelect?: (id: string, type: 'portfolio' | 'blog' | 'course') => void;
  onOpenChat?: (authorName: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = (props) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { actions, state } = useAppStore();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'courses' | 'membership'>('portfolio');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Normalize username for display
  const authorName = props.authorName || (username 
    ? username.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
    : 'Usuario');

  // Find detailed artist info if available, otherwise mock
  const artistDetails = ARTIST_DIRECTORY.find(a => a.name.toLowerCase() === authorName.toLowerCase()) || {
      name: authorName,
      role: state.contentMode === 'dev' ? 'Full Stack Developer' : 'Digital Artist',
      location: 'Remoto',
      isPro: true,
      avatar: `https://ui-avatars.com/api/?name=${authorName}&background=random`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop'
  };

  // Content Filtering based on Mode
  const mode = state.contentMode;
  
  const userPortfolio = PORTFOLIO_ITEMS.filter(p => (p.domain || 'creative') === mode).slice(0, 6);
  const userCourses = EDUCATION_ITEMS.filter(c => (c.domain || 'creative') === mode).slice(0, 3);
  const userBlog = BLOG_ITEMS.filter(b => (b.domain || 'creative') === mode).slice(0, 3);

  const exclusiveItems = [...userPortfolio.slice(0,2), ...userBlog.slice(0,1)].map(i => ({...i, isExclusive: true}));

  const accentText = mode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBorder = mode === 'dev' ? 'border-blue-500' : 'border-amber-500';

  const handleBack = () => {
      if (props.onBack) props.onBack();
      else navigate(-1);
  }

  const handleItemSelect = (id: string, type: 'portfolio' | 'blog' | 'course') => {
      if (props.onItemSelect) {
          props.onItemSelect(id, type);
      } else {
          // Route navigation fallback
          if (type === 'portfolio') navigate(`/portfolio/${id}`);
          if (type === 'course') navigate(`/education/${id}`);
          if (type === 'blog') navigate(`/blog/${id}`);
      }
  }

  const handleChat = (name: string) => {
      if (props.onOpenChat) props.onOpenChat(name);
      else actions.openChatWithUser(name);
  }

  return (
    <div className="w-full max-w-[2560px] mx-auto animate-fade-in pb-20">
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 pointer-events-none">
        <button 
          onClick={handleBack}
          className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <ProfileHeader 
        authorName={artistDetails.name}
        avatar={artistDetails.avatar}
        coverImage={artistDetails.coverImage}
        role={artistDetails.role}
        location={artistDetails.location}
        isPro={artistDetails.isPro || false}
        isFollowing={isFollowing}
        isFriend={isFriend}
        onFollow={() => setIsFollowing(!isFollowing)}
        onFriend={() => setIsFriend(!isFriend)}
        onMessage={() => handleChat(artistDetails.name)}
        contentMode={mode}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] 2xl:grid-cols-[450px_1fr] gap-12 px-6 md:px-12 2xl:px-20">
        
        {/* Left Sidebar */}
        <div className="space-y-10 order-2 lg:order-1">
            <GamificationBox contentMode={mode} />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-center">
                    <div className="text-xl 2xl:text-2xl font-bold text-white">125k</div>
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Vistas</div>
                </div>
                <div className="text-center border-l border-white/5">
                    <div className="text-xl 2xl:text-2xl font-bold text-white">4.2k</div>
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Likes</div>
                </div>
                <div className="text-center border-l border-white/5">
                    <div className="text-xl 2xl:text-2xl font-bold text-white">8.5k</div>
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Seguidores</div>
                </div>
            </div>

            {/* About */}
            <div>
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Sobre mí</h3>
                <p className="text-base 2xl:text-lg text-slate-400 leading-relaxed mb-6">
                    {mode === 'dev' 
                     ? 'Ingeniero de Software apasionado por el código limpio y arquitecturas escalables. Contribuidor Open Source.' 
                     : 'Apasionado por crear mundos inmersivos y contar historias. Especializado en Hard Surface y Diseño de Niveles.'}
                </p>
                <div className="flex gap-3">
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
                </div>
            </div>

            <ExperienceTimeline experience={EXPERIENCE} education={EDUCATION} contentMode={mode} />
        </div>

        {/* Main Content */}
        <div className="order-1 lg:order-2">
            <div className="flex items-center gap-6 md:gap-10 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide pb-2">
                <button onClick={() => setActiveTab('portfolio')} className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'portfolio' ? `${accentText} ${accentBorder}` : 'text-slate-500 border-transparent hover:text-white'}`}>
                    <Layers className="h-4 w-4" /> Portafolio
                </button>
                <button onClick={() => setActiveTab('courses')} className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'courses' ? `${accentText} ${accentBorder}` : 'text-slate-500 border-transparent hover:text-white'}`}>
                    <GraduationCap className="h-4 w-4" /> Cursos
                </button>
                <button onClick={() => setActiveTab('blog')} className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'blog' ? `${accentText} ${accentBorder}` : 'text-slate-500 border-transparent hover:text-white'}`}>
                    <MessageSquare className="h-4 w-4" /> Blog
                </button>
                <button onClick={() => setActiveTab('membership')} className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'membership' ? `${accentText} ${accentBorder}` : 'text-slate-500 border-transparent hover:text-white'}`}>
                    <Star className="h-4 w-4" /> Membresía
                </button>
            </div>

            {activeTab === 'portfolio' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5 animate-slide-up">
                    {userPortfolio.map(item => (
                        <PortfolioCard key={item.id} item={item} onClick={() => handleItemSelect(item.id, 'portfolio')} />
                    ))}
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-slide-up">
                    {userCourses.map(item => (
                        <EducationCard key={item.id} course={item} onClick={() => handleItemSelect(item.id, 'course')} />
                    ))}
                </div>
            )}

            {activeTab === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
                    {userBlog.map(item => (
                        <BlogCard key={item.id} article={item} onClick={() => handleItemSelect(item.id, 'blog')} />
                    ))}
                </div>
            )}

            {activeTab === 'membership' && (
                <div className="animate-slide-up space-y-12">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                        <h3 className="text-2xl font-bold text-white mb-2">Conviértete en miembro</h3>
                        <p className="text-slate-300 max-w-2xl text-lg">Únete a mi comunidad exclusiva.</p>
                    </div>
                    {/* Tiers would go here */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Lock className={`h-5 w-5 ${accentText}`} /> Contenido Exclusivo</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {exclusiveItems.map((item, idx) => (
                                item.category ? <PortfolioCard key={`exc-${idx}`} item={item as any} /> : <BlogCard key={`exc-b-${idx}`} article={item as any} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
