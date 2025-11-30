
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, CheckCircle2, UserPlus, Mail, MessageSquare, Layers, Twitter, Instagram, Globe, MoreHorizontal, Briefcase, GraduationCap, UserCheck, Star, Heart, Lock, Check, Award, Zap, Trophy } from 'lucide-react';
import { PORTFOLIO_ITEMS, BLOG_ITEMS, EDUCATION_ITEMS, ARTIST_TIERS } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { BlogCard } from '../components/cards/BlogCard';
import { EducationCard } from '../components/cards/EducationCard';

interface UserProfileViewProps {
  authorName: string;
  onBack: () => void;
  onItemSelect: (id: string, type: 'portfolio' | 'blog' | 'course') => void;
  onOpenChat?: (authorName: string) => void;
}

// Mock Resume Data
const EXPERIENCE = [
  {
    id: 1,
    role: "Senior 3D Artist",
    company: "Ubisoft",
    period: "2021 - Presente",
    location: "Barcelona, España",
    description: "Liderando el equipo de entornos para proyectos AAA. Dirección artística y mentoría."
  },
  {
    id: 2,
    role: "Environment Artist",
    company: "Gameloft",
    period: "2018 - 2021",
    location: "Madrid, España",
    description: "Modelado y texturizado de escenarios para juegos móviles de alto rendimiento."
  },
  {
    id: 3,
    role: "Junior 3D Generalist",
    company: "Indie Studio X",
    period: "2016 - 2018",
    location: "Remoto",
    description: "Creación de props, personajes low-poly y animaciones básicas."
  }
];

const EDUCATION = [
  {
    id: 1,
    degree: "Máster en Arte Digital",
    school: "Voxel School",
    period: "2017 - 2018",
    description: "Especialización en escultura digital."
  },
  {
    id: 2,
    degree: "Grado en Diseño",
    school: "U. Complutense",
    period: "2013 - 2017",
    description: "Fundamentos de diseño visual."
  }
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({ authorName, onBack, onItemSelect, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'courses' | 'membership'>('portfolio');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Mock filtering based on name (in a real app, use ID)
  const userPortfolio = PORTFOLIO_ITEMS.filter(p => p.artist === authorName).length > 0 
    ? PORTFOLIO_ITEMS.filter(p => p.artist === authorName)
    : PORTFOLIO_ITEMS.slice(0, 6); // Fallback data
  
  const userBlog = BLOG_ITEMS.slice(0, 3); // Fallback data for demo

  // Filter courses by instructor
  const userCourses = EDUCATION_ITEMS.filter(c => c.instructor === authorName);
  // Fallback for demo if no courses found matching exact name, show a couple random ones
  const displayCourses = userCourses.length > 0 ? userCourses : EDUCATION_ITEMS.slice(0, 2);

  // Locked/Exclusive Content for Membership Tab
  const exclusiveItems = [
      ...userPortfolio.map(i => ({...i, isExclusive: true})).slice(0,2),
      ...userBlog.map(i => ({...i, isExclusive: true})).slice(0,1)
  ];

  return (
    <div className="w-full max-w-[2560px] mx-auto animate-fade-in pb-20">
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Banner Area */}
      <div className="relative h-[250px] md:h-[350px] 2xl:h-[450px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        {/* Stronger gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/40 to-transparent"></div>
      </div>

      {/* Profile Header Info */}
      <div className="px-6 md:px-12 2xl:px-20 relative -mt-20 md:-mt-24 z-10 mb-16">
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
            
            {/* Avatar */}
            <div className="relative group">
                <div className="h-32 w-32 md:h-40 md:w-40 2xl:h-48 2xl:w-48 rounded-3xl p-1 bg-[#030304] ring-1 ring-white/10 overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop" 
                        alt={authorName} 
                        className="w-full h-full object-cover rounded-2xl bg-slate-800"
                    />
                </div>
                <div className="absolute bottom-3 right-3 h-5 w-5 md:h-6 md:w-6 rounded-full bg-green-500 border-4 border-[#030304]" title="Disponible para trabajar"></div>
            </div>

            {/* Info Text */}
            <div className="flex-1 pb-2 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-white tracking-tight">{authorName}</h1>
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 2xl:h-8 2xl:w-8 text-amber-500 fill-amber-500/20" />
                    <span className="px-2 py-0.5 rounded text-[10px] 2xl:text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/20 uppercase tracking-wider ml-2">Pro</span>
                </div>
                <p className="text-lg md:text-xl 2xl:text-2xl text-slate-300 font-light mb-4">Senior 3D Artist & Concept Designer</p>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 2xl:text-base text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        Barcelona, España
                    </div>
                    <div className="flex items-center gap-1.5">
                        <LinkIcon className="h-4 w-4 text-slate-500" />
                        <a href="#" className="hover:text-amber-500 transition-colors truncate max-w-[200px] md:max-w-none">artstation.com/{authorName.replace(/\s/g, '').toLowerCase()}</a>
                    </div>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        Se unió en Mayo 2021
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pb-2 w-full md:w-auto mt-2 md:mt-0">
                {/* Membership Button */}
                <button 
                    onClick={() => setActiveTab('membership')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-lg"
                >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    Unirse
                </button>

                {/* Follow Button */}
                <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                    }`}
                >
                    {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                </button>

                {/* Friend Button - NEW */}
                <button 
                    onClick={() => setIsFriend(!isFriend)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                        isFriend 
                        ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' 
                        : 'bg-transparent border-white/20 text-white hover:bg-white/10'
                    }`}
                >
                    {isFriend ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFriend ? 'Amigo' : 'Agregar'}
                </button>

                {/* Message Button */}
                <button 
                    onClick={() => onOpenChat?.(authorName)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                    <MessageSquare className="h-4 w-4" />
                    Mensaje
                </button>

                <button className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>

      {/* Content Layout - Fixed Sidebar Width for Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] 2xl:grid-cols-[450px_1fr] gap-12 px-6 md:px-12 2xl:px-20">
        
        {/* Left Sidebar (Stats, About, Experience) */}
        <div className="space-y-10 order-2 lg:order-1">
            
            {/* Gamification Level Box */}
            <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-amber-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Nivel 15
                    </h3>
                    <span className="text-white font-bold text-sm">3,450 / 5,000 XP</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mb-6">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
                
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medallas</h4>
                <div className="flex gap-3">
                    <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center text-amber-500" title="Top Contributor">
                        <Award className="h-5 w-5" />
                    </div>
                    <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-500" title="Challenge Winner">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-500" title="Course Creator">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="h-10 w-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold">
                        +5
                    </div>
                </div>
            </div>

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
                    Apasionado por crear mundos inmersivos y contar historias a través del entorno. 
                    Especializado en Hard Surface y Diseño de Niveles para videojuegos AAA.
                    Siempre buscando nuevos retos y colaboraciones.
                </p>
                <div className="flex gap-3">
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] transition-colors"><Twitter className="h-5 w-5" /></a>
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-[#E1306C]/20 hover:text-[#E1306C] transition-colors"><Instagram className="h-5 w-5" /></a>
                    <a href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-amber-500/20 hover:text-amber-500 transition-colors"><Globe className="h-5 w-5" /></a>
                </div>
            </div>

            {/* Skills */}
            <div>
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                    {['Blender', 'Unreal Engine 5', 'ZBrush', 'Substance', 'Photoshop', 'Marmoset'].map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-300">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Experience Section */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-amber-500" /> Experiencia
                </h3>
                <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                    {EXPERIENCE.map((job) => (
                        <div key={job.id} className="relative">
                            <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#030304] border-2 border-amber-500"></div>
                            
                            <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{job.role}</h4>
                            <div className="text-sm 2xl:text-base text-amber-500 font-medium mb-1">{job.company}</div>
                            <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">{job.period}</div>
                            
                            <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                {job.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education Section */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-500" /> Educación
                </h3>
                <div className="space-y-4">
                    {EDUCATION.map((edu) => (
                        <div key={edu.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                            <h4 className="text-base 2xl:text-lg font-bold text-white">{edu.school}</h4>
                            <div className="text-sm 2xl:text-base text-slate-300 mb-1">{edu.degree}</div>
                            <div className="text-xs text-slate-500">{edu.period}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Content (Tabs & Grid) */}
        <div className="order-1 lg:order-2">
            {/* Tabs */}
            <div className="flex items-center gap-6 md:gap-10 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide pb-2">
                <button 
                    onClick={() => setActiveTab('portfolio')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'portfolio' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Layers className="h-4 w-4" /> Portafolio <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userPortfolio.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('courses')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'courses' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <GraduationCap className="h-4 w-4" /> Cursos <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{displayCourses.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('blog')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'blog' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <MessageSquare className="h-4 w-4" /> Blog <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userBlog.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('membership')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'membership' 
                        ? 'text-amber-500 border-amber-500' 
                        : 'text-slate-500 border-transparent hover:text-white'
                    }`}
                >
                    <Star className="h-4 w-4" /> Membresía
                </button>
            </div>

            {/* Grid Content - Aligned with main Portfolio View */}
            {activeTab === 'portfolio' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5 animate-slide-up">
                    {userPortfolio.map(item => (
                        <PortfolioCard 
                            key={item.id} 
                            item={item} 
                            onClick={() => onItemSelect(item.id, 'portfolio')} 
                        />
                    ))}
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-slide-up">
                    {displayCourses.map(item => (
                        <EducationCard 
                            key={item.id} 
                            course={item} 
                            onClick={() => onItemSelect(item.id, 'course')} 
                        />
                    ))}
                </div>
            )}

            {activeTab === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
                    {userBlog.map(item => (
                        <BlogCard 
                            key={item.id} 
                            article={item} 
                            onClick={() => onItemSelect(item.id, 'blog')} 
                        />
                    ))}
                </div>
            )}

            {activeTab === 'membership' && (
                <div className="animate-slide-up space-y-12">
                    
                    {/* Intro */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Conviértete en miembro</h3>
                        <p className="text-slate-300 max-w-2xl text-lg">
                            Únete a mi comunidad exclusiva para obtener acceso a archivos fuente, tutoriales avanzados y mentoría directa.
                        </p>
                    </div>

                    {/* Tiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ARTIST_TIERS.map((tier) => (
                            <div key={tier.id} className={`relative bg-white/5 rounded-2xl border flex flex-col p-6 transition-transform hover:-translate-y-1 ${tier.color} ${tier.recommended ? 'border-2 shadow-xl shadow-amber-500/10' : 'border-white/10'}`}>
                                {tier.recommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
                                        Recomendado
                                    </div>
                                )}
                                <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                                <div className="text-3xl font-bold text-white mb-4">
                                    ${tier.price} <span className="text-sm font-normal text-slate-500">/mes</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
                                    {tier.description}
                                </p>
                                <button className={`w-full py-3 rounded-xl font-bold mb-6 transition-colors ${tier.recommended ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white text-black hover:bg-slate-200'}`}>
                                    Unirse
                                </button>
                                <ul className="space-y-3 mt-auto">
                                    {tier.perks.map((perk, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <Check className={`h-4 w-4 shrink-0 mt-0.5 ${tier.recommended ? 'text-amber-500' : 'text-slate-500'}`} />
                                            <span>{perk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Exclusive Content Preview */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-amber-500" /> Contenido Exclusivo para Miembros
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {exclusiveItems.map((item, idx) => (
                                item.category ? (
                                    <PortfolioCard 
                                        key={`exc-${idx}`} 
                                        item={item as any} 
                                        onClick={() => {}} 
                                    />
                                ) : (
                                    <BlogCard
                                        key={`exc-b-${idx}`}
                                        article={item as any}
                                        onClick={() => {}}
                                    />
                                )
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
