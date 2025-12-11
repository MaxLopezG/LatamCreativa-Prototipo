import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, CheckCircle2, UserPlus, Mail, MessageSquare, Layers, Twitter, Instagram, Globe, MoreHorizontal, Briefcase, GraduationCap, UserCheck, Zap, Award, Trophy, Bookmark, Heart, Lock, Plus, Image as ImageIcon, Video, Box, Newspaper, Download, PlayCircle, FileText, Settings, Github, Linkedin, Palette } from 'lucide-react';
import { PORTFOLIO_ITEMS, BLOG_ITEMS, EDUCATION_ITEMS, ASSET_ITEMS, ARTIST_TIERS, ARTIST_DIRECTORY } from '../../data/content';
import { PortfolioCard } from '../../components/cards/PortfolioCard';
import { BlogCard } from '../../components/cards/BlogCard';
import { EducationCard } from '../../components/cards/EducationCard';
import { AssetCard } from '../../components/cards/AssetCard';
import { useAppStore } from '../../hooks/useAppStore';
import { EditProfileModal } from '../../components/modals/EditProfileModal';
import { CreatePostModal } from '../../components/modals/CreatePostModal';
import { useUserArticles } from '../../hooks/useFirebase';
import { usersService } from '../../services/modules/users';
import { api } from '../../services/api';
import { EXPERIENCE, EDUCATION, LOCKED_POSTS } from '../../data/profileData';

interface UserProfileViewProps {
    author?: { name: string; avatar?: string; id?: string } | null;
    authorName?: string;
    onBack: () => void;
    onItemSelect: (id: string, type: 'portfolio' | 'blog' | 'course' | 'asset') => void;
    onOpenChat?: (authorName: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ author, authorName, onBack, onItemSelect, onOpenChat }) => {
    const { state, actions } = useAppStore();
    const { username } = useParams<{ username: string }>();
    const [fetchedUser, setFetchedUser] = useState<any>(null); // Store fetched profile data

    // Robust check for Own Profile
    const isOwnProfile = useMemo(() => {
        // 1. If currently viewing /profile (no args) or /user/me
        if (!author && !authorName && (!username || username === 'me')) return true;

        // 2. If logged in, compare with current user
        if (state.user) {
            const currentName = state.user.name;
            const currentId = state.user.id;

            // Check ID match (if author prop has ID)
            if (author?.id && author.id === currentId) return true;

            // Check Name match (author prop, authorName prop, or URL param)
            const targetName = author?.name || authorName || (username ? decodeURIComponent(username) : '');
            if (targetName === currentName) return true;
        }

        return false;
    }, [state.user, author, authorName, username]);

    // Fetch real user data if we have an ID or Name
    useEffect(() => {
        const fetchUserData = async () => {
            if (isOwnProfile) return;

            let userData = null;

            // 1. Try by ID
            if (author?.id && author.id !== 'unknown') {
                userData = await api.getUserProfile(author.id);
            }

            // 2. Fallback: Try by Name if no user found by ID
            if (!userData) {
                const targetName = author?.name || authorName;
                if (targetName && targetName !== 'Unknown User') {
                    // Sanitize name if it's an object/string mess
                    const cleanName = typeof targetName === 'object'
                        ? (targetName as any).name || (targetName as any).displayName || ''
                        : String(targetName);

                    if (cleanName) {
                        userData = await api.getUserProfileByName(cleanName);
                    }
                }
            }

            if (userData) {
                setFetchedUser(userData);
            }
        };
        fetchUserData();
    }, [author?.id, author?.name, authorName, isOwnProfile]);

    // Helper to check if a name is valid/useful
    const isValidName = (n: any) => {
        if (!n) return false;
        const s = String(n).trim();
        if (s === 'Unknown User' || s === 'unknown user' || s === 'Unknown' || s === '[object Object]') return false;
        if (s.includes('Unknown User')) return false; // Catch "Unknown User (Mock)" etc
        return true;
    };

    const getDisplayName = () => {
        // 1. Prioritize author passed prop if it's valid (Visual Consistency)
        if (author?.name && isValidName(author.name)) return author.name;

        // 2. Try fetched user name (if author prop wasn't valid)
        if (fetchedUser?.name && isValidName(fetchedUser.name)) return fetchedUser.name;

        // 3. Try other props
        if (authorName && isValidName(authorName)) return authorName;
        if (username && isValidName(username)) return username;

        return 'Unknown User';
    };

    const finalName = getDisplayName();

    // Safe user object creation
    const displayUser = isOwnProfile ? (state.user || {
        name: 'Usuario Nuevo',
        id: 'new-user',
        avatar: 'https://ui-avatars.com/api/?name=U&background=random',
        role: 'Creative Member',
        location: 'Latam',
        email: '',
        createdAt: new Date().toISOString()
    }) : {
        name: finalName,
        id: fetchedUser?.id || author?.id || 'unknown',
        avatar: fetchedUser?.avatar || author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=random&size=512`,
        role: fetchedUser?.role || 'Digital Artist',
        location: fetchedUser?.location || 'Latam',
        bio: fetchedUser?.bio,
        createdAt: fetchedUser?.createdAt,
        skills: fetchedUser?.skills,
        experience: fetchedUser?.experience,
        education: fetchedUser?.education,
        socialLinks: fetchedUser?.socialLinks
    };

    const sanitizeName = (val: any) => {
        if (!val) return 'Unknown User';
        if (typeof val === 'string' && val === '[object Object]') return 'Unknown User';
        if (typeof val === 'object') {
            return val.name || val.displayName || val.userName || 'Unknown User';
        }
        return String(val);
    };

    const name = sanitizeName(displayUser.name);

    const [activeTab, setActiveTab] = useState<'portfolio' | 'courses' | 'assets' | 'blog' | 'saved' | 'collections' | 'membership'>('portfolio');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    // const { state, actions } = useAppStore(); // Removed duplicate

    // Check initial subscription status
    useEffect(() => {
        const checkStatus = async () => {
            if (state.user && displayUser.id) {
                const status = await usersService.getSubscriptionStatus(displayUser.id, state.user.id);
                setIsFollowing(status);
            }
        };
        checkStatus();
    }, [state.user, displayUser.id]);

    const handleFollowToggle = async () => {
        if (!state.user) {
            actions.showToast("Inicia sesión para seguir a creadores", "info");
            return;
        }

        try {
            setIsFollowLoading(true);
            const targetId = displayUser.id || displayUser.name; // Fallback? UsersService expects ID. 
            // NOTE: displayUser here might be a constructed object if coming from API or route. 
            // In UserProfileView, displayUser comes from props or lookup.
            // If displayUser.id is missing, this will fail. 
            // Assuming displayUser HAS id as it's fetched from 'usersService.getUserProfile' or 'usersService.getUserProfileByName'
            if (!targetId) {
                console.error("No user ID found for follow");
                return;
            }

            if (isFollowing) {
                await usersService.unsubscribeFromUser(targetId, state.user.id);
                actions.showToast(`Dejaste de seguir a ${name}`, 'success');
            } else {
                await usersService.subscribeToUser(targetId, state.user.id);
                actions.showToast(`Ahora sigues a ${name}`, 'success');
            }
            setIsFollowing(!isFollowing);
            actions.triggerSubscriptionUpdate();
        } catch (error) {
            console.error("Follow error:", error);
            actions.showToast("Error al actualizar seguimiento", "error");
        } finally {
            setIsFollowLoading(false);
        }
    };
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    // Attempt to find artist level from directory if exists (Mock logic)
    const directoryArtist = ARTIST_DIRECTORY.find(a => a.name === name);
    const artistLevel = isOwnProfile ? (displayUser.role === 'Creative Member' ? 'Novice' : 'Pro') : (directoryArtist?.level || 'Pro');

    // --- Dynamic Data for Own Profile vs Demo Profile ---
    const showMockData = !isOwnProfile && name !== 'Usuario Nuevo';

    // Stats
    const stats = showMockData ? { views: '125k', likes: '4.2k', followers: '8.5k' } : { views: 0, likes: 0, followers: 0 };

    // About
    const aboutText = showMockData
        ? "Apasionado por crear mundos inmersivos y contar historias a través del entorno. Especializado en Hard Surface y Diseño de Niveles para videojuegos AAA. Siempre buscando optimizar flujos de trabajo con herramientas procedimentales."
        : (displayUser['bio'] || "¡Hola! Soy un nuevo miembro de la comunidad creativa.");

    // Experience & Education
    const experienceList = showMockData ? EXPERIENCE : (isOwnProfile ? (displayUser['experience'] || []) : []);
    const educationList = showMockData ? EDUCATION : (isOwnProfile ? (displayUser['education'] || []) : []);

    // Extended Profile Data
    const skills = showMockData ? ['ZBrush', 'Maya', 'Substance Painter', 'Unreal Engine 5'] : (displayUser['skills'] || []);
    const socialLinks = isOwnProfile ? (displayUser['socialLinks'] || {}) : {};
    const availableForWork = showMockData ? true : (displayUser['availableForWork'] || false);

    const getLevelFrameClass = (level?: string) => {
        switch (level) {
            case 'Master': return 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/30';
            case 'Expert': return 'bg-gradient-to-tr from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30';
            case 'Pro': return 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-2xl shadow-amber-500/30';
            case 'Novice': return 'bg-slate-200 dark:bg-slate-700';
            default: return 'bg-slate-200 dark:bg-slate-700';
        }
    };

    const levelFrameClass = getLevelFrameClass(artistLevel);

    // --- Dynamic Content Logic ---

    // 1. Portfolio / Creations
    const userPortfolio = useMemo(() => {
        if (isOwnProfile) return state.createdItems;
        return PORTFOLIO_ITEMS.filter(p => p.artist === name);
    }, [isOwnProfile, state.createdItems, name]);

    // 2. Courses
    const userCourses = useMemo(() => {
        const courses = EDUCATION_ITEMS.filter(c => c.instructor === name);
        return courses;
    }, [name]);

    // 3. Assets
    const userAssets = useMemo(() => {
        const assets = ASSET_ITEMS.filter(a => a.creator === name);
        return assets;
    }, [name]);


    // 4. Blog
    const { articles: userArticles, loading: articlesLoading, error: articlesError } = useUserArticles(name);


    // 5. Saved Items (Likes)
    const savedItems = useMemo(() => {
        if (!isOwnProfile) return [];

        const portfolioLikes = PORTFOLIO_ITEMS.filter(i => state.likedItems.includes(i.id));
        const educationLikes = EDUCATION_ITEMS.filter(i => state.likedItems.includes(i.id));
        const assetLikes = ASSET_ITEMS.filter(i => state.likedItems.includes(i.id));
        const blogLikes = BLOG_ITEMS.filter(i => state.likedItems.includes(i.id));

        return [...portfolioLikes, ...educationLikes, ...assetLikes, ...blogLikes];
    }, [isOwnProfile, state.likedItems]);

    // 6. Collections
    const userCollections = useMemo(() => {
        if (isOwnProfile) return state.collections;
        return [];
    }, [isOwnProfile, state.collections]);

    return (
        <div className="w-full max-w-[2560px] mx-auto animate-fade-in pb-20">

            {/* Edit Modal */}
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            <CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)} />

            {/* Navigation */}
            <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 pointer-events-none">
                <button
                    onClick={onBack}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors font-medium text-sm border border-white/10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver</span>
                </button>
            </div>

            {/* Banner Area */}
            <div className="relative h-[250px] md:h-[350px] 2xl:h-[450px] w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/40 to-transparent"></div>
            </div>

            {/* Profile Header Info */}
            <div className="px-6 md:px-12 2xl:px-20 relative -mt-20 md:-mt-24 z-10 mb-16">
                <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">

                    {/* Avatar with Level Frame */}
                    <div className="relative group">
                        <div className={`h-32 w-32 md:h-40 md:w-40 2xl:h-48 2xl:w-48 rounded-3xl p-[4px] ${levelFrameClass}`}>
                            <div className="h-full w-full rounded-2xl overflow-hidden bg-[#030304] border-4 border-[#030304]">
                                <img
                                    src={displayUser.avatar}
                                    alt={name}
                                    className="w-full h-full object-cover bg-slate-800"
                                />
                            </div>
                        </div>
                        {/* Status Indicator */}
                        <div className={`absolute bottom-3 right-3 h-5 w-5 md:h-6 md:w-6 rounded-full border-4 border-[#030304] ${availableForWork ? 'bg-green-500' : 'bg-slate-500'}`} title={availableForWork ? "Disponible para trabajar" : "No disponible"}></div>
                    </div>

                    {/* Info Text */}
                    <div className="flex-1 pb-2 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-white tracking-tight">{name}</h1>
                            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 2xl:h-8 2xl:w-8 text-amber-500 fill-amber-500/20" />
                            <span className="px-2 py-0.5 rounded text-[10px] 2xl:text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/20 uppercase tracking-wider ml-2">{artistLevel}</span>
                        </div>
                        <p className="text-lg md:text-xl 2xl:text-2xl text-slate-300 font-light mb-4">{displayUser.role}</p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 2xl:text-base text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                {displayUser.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <LinkIcon className="h-4 w-4 text-slate-500" />
                                <a href="#" className="hover:text-amber-500 transition-colors truncate max-w-[200px] md:max-w-none">artstation.com/{name.replace(/\s/g, '').toLowerCase()}</a>
                            </div>
                            <div className="flex items-center gap-1.5 hidden sm:flex">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                Se unió en {displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'Mayo 2021'}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pb-2 w-full md:w-auto mt-2 md:mt-0">
                        {!isOwnProfile && (
                            <>
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={isFollowLoading}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isFollowing
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                                        } ${isFollowLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                    {isFollowLoading ? 'Procesando...' : (isFollowing ? 'Siguiendo' : 'Seguir')}
                                </button>

                                <button
                                    onClick={() => onOpenChat?.(name)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border bg-transparent border-white/20 text-white hover:bg-white/10"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Mensaje
                                </button>
                            </>
                        )}

                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/10 transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Editar Perfil
                            </button>
                        )}


                    </div>
                </div>
            </div>

            {/* Content Layout - Fixed Sidebar Width for Large Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] 2xl:grid-cols-[450px_1fr] gap-12 px-6 md:px-12 2xl:px-20">

                {/* Left Sidebar (Stats, About, Experience) */}
                <div className="space-y-10 order-2 lg:order-1">

                    {/* Gamification Level Box */}
                    <div className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-6 rounded-2xl relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-16 -mt-16 opacity-20 bg-amber-500`}></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 text-white">
                                    <Zap className="h-4 w-4 text-amber-400" />
                                    Nivel {artistLevel === 'Master' ? '50' : artistLevel === 'Expert' ? '35' : artistLevel === 'Pro' ? '15' : '1'}
                                </h3>
                                <span className="text-white font-bold text-sm">{showMockData ? '3,450 / 5,000 XP' : '0 / 100 XP'}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
                                <div className="h-full rounded-full bg-amber-500" style={{ width: '70%' }}></div>
                            </div>

                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medallas</h4>
                            <div className="flex gap-3">
                                <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center text-amber-500" title="Top Contributor">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-500" title="Challenge Winner">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div className="h-10 w-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold">
                                    +5
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-center">
                            <div className="text-xl 2xl:text-2xl font-bold text-white">{stats.views}</div>
                            <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Vistas</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-xl 2xl:text-2xl font-bold text-white">{stats.likes}</div>
                            <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Likes</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-xl 2xl:text-2xl font-bold text-white">{stats.followers}</div>
                            <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Seguidores</div>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Sobre mí</h3>
                        <p className="text-base 2xl:text-lg text-slate-400 leading-relaxed mb-6">
                            {aboutText}
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            {/* Social Links Dynamic Rendering */}
                            {/* Social Links Dynamic Rendering */}
                            {(() => {
                                const getSocialUrl = (baseUrl: string, handle: string) => {
                                    if (!handle) return '';
                                    if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
                                    return `${baseUrl}${handle.replace(/^@/, '')}`;
                                };

                                return (
                                    <>
                                        {socialLinks.artstation && (
                                            <a href={getSocialUrl('https://artstation.com/', socialLinks.artstation)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#13AFF0] hover:bg-[#13AFF0]/10 transition-colors" title="ArtStation">
                                                <Palette className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialLinks.linkedin && (
                                            <a href={getSocialUrl('https://linkedin.com/in/', socialLinks.linkedin)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors" title="LinkedIn">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialLinks.twitter && (
                                            <a href={getSocialUrl('https://twitter.com/', socialLinks.twitter)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-colors" title="Twitter">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialLinks.instagram && (
                                            <a href={getSocialUrl('https://instagram.com/', socialLinks.instagram)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#E4405F] hover:bg-[#E4405F]/10 transition-colors" title="Instagram">
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialLinks.github && (
                                            <a href={getSocialUrl('https://github.com/', socialLinks.github)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="GitHub">
                                                <Github className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialLinks.website && (
                                            <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors" title="Website">
                                                <Globe className="h-5 w-5" />
                                            </a>
                                        )}
                                    </>
                                );
                            })()}

                            {/* Show defaults if no links and it's own profile */}
                            {isOwnProfile && Object.values(socialLinks).every(v => !v) && (
                                <p className="text-sm text-slate-500 italic">No has añadido redes sociales.</p>
                            )}
                        </div>

                        {/* Skills Section */}
                        {skills.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Habilidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 text-sm font-medium hover:border-amber-500/30 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Experience Section */}
                    <div className="pt-8 border-t border-white/5">
                        <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-amber-500" /> Experiencia
                        </h3>
                        <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                            {experienceList.length > 0 ? experienceList.map((job) => (
                                <div key={job.id} className="relative">
                                    <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#030304] border-2 border-amber-500"></div>

                                    <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{job.role}</h4>
                                    <div className="text-sm 2xl:text-base text-amber-500 font-medium mb-1">{job.company}</div>
                                    <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">{job.period} • {job.location}</div>

                                    <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-sm text-slate-600 italic">No hay experiencia registrada aún.</div>
                            )}
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="pt-8 border-t border-white/5 mt-8">
                        <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-500" /> Educación
                        </h3>
                        <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                            {educationList.length > 0 ? educationList.map((edu) => (
                                <div key={edu.id} className="relative">
                                    <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#030304] border-2 border-blue-500"></div>

                                    <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{edu.degree}</h4>
                                    <div className="text-sm 2xl:text-base text-blue-400 font-medium mb-1">{edu.school}</div>
                                    <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">{edu.period}</div>
                                    <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                        {edu.description}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-sm text-slate-600 italic">No hay educación registrada aún.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content (Tabs & Grid) */}
                <div className="order-1 lg:order-2">
                    {/* Tabs */}
                    <div className="flex items-center gap-6 md:gap-10 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide pb-2">
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'portfolio'
                                ? 'text-amber-500 border-amber-500'
                                : 'text-slate-500 border-transparent hover:text-white'
                                }`}
                        >
                            <Layers className="h-4 w-4" /> Portafolio <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userPortfolio.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'courses'
                                ? 'text-amber-500 border-amber-500'
                                : 'text-slate-500 border-transparent hover:text-white'
                                }`}
                        >
                            <Video className="h-4 w-4" /> Cursos <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userCourses.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('assets')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'assets'
                                ? 'text-amber-500 border-amber-500'
                                : 'text-slate-500 border-transparent hover:text-white'
                                }`}
                        >
                            <Box className="h-4 w-4" /> Assets <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userAssets.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('blog')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'blog'
                                ? 'text-amber-500 border-amber-500'
                                : 'text-slate-500 border-transparent hover:text-white'
                                }`}
                        >
                            <Newspaper className="h-4 w-4" /> Blog <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userArticles.length}</span>
                        </button>

                        {isOwnProfile && (
                            <>
                                <button
                                    onClick={() => setActiveTab('saved')}
                                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'saved'
                                        ? 'text-amber-500 border-amber-500'
                                        : 'text-slate-500 border-transparent hover:text-white'
                                        }`}
                                >
                                    <Bookmark className="h-4 w-4" /> Guardados <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{savedItems.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('collections')}
                                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'collections'
                                        ? 'text-amber-500 border-amber-500'
                                        : 'text-slate-500 border-transparent hover:text-white'
                                        }`}
                                >
                                    <Layers className="h-4 w-4" /> Colecciones <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userCollections.length}</span>
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setActiveTab('membership')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'membership'
                                ? 'text-amber-500 border-amber-500'
                                : 'text-slate-500 border-transparent hover:text-white'
                                }`}
                        >
                            <Heart className="h-4 w-4" /> Membresía
                        </button>
                    </div>

                    {/* TAB: PORTFOLIO */}
                    {activeTab === 'portfolio' && (
                        <>
                            {userPortfolio.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 animate-slide-up">
                                    {userPortfolio.map((item) => (
                                        <PortfolioCard
                                            key={item.id}
                                            item={item}
                                            onClick={() => onItemSelect(item.id, 'portfolio')}
                                            onSave={actions.openSaveModal}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <Layers className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Sin proyectos publicados</h3>
                                    <p className="text-slate-400 max-w-md mb-6">Comparte tus creaciones con la comunidad.</p>
                                    {isOwnProfile && (
                                        <button onClick={() => actions.handleCreateAction('portfolio')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                            <Plus className="h-4 w-4" /> Crear Proyecto
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: COURSES */}
                    {activeTab === 'courses' && (
                        <>
                            {userCourses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                                    {userCourses.map((item) => (
                                        <EducationCard
                                            key={item.id}
                                            course={item}
                                            onClick={() => onItemSelect(item.id, 'course')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <GraduationCap className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Sin cursos publicados</h3>
                                    <p className="text-slate-400 max-w-md mb-6">Enseña lo que sabes y gana dinero.</p>
                                    {isOwnProfile && (
                                        <button onClick={() => actions.handleCreateAction('course')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                            <Plus className="h-4 w-4" /> Crear Curso
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: ASSETS */}
                    {activeTab === 'assets' && (
                        <>
                            {userAssets.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-slide-up">
                                    {userAssets.map((item) => (
                                        <AssetCard
                                            key={item.id}
                                            asset={item}
                                            onClick={() => onItemSelect(item.id, 'asset')}
                                            onSave={actions.openSaveModal}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <Box className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Sin assets publicados</h3>
                                    <p className="text-slate-400 max-w-md mb-6">Vende tus modelos, texturas y herramientas.</p>
                                    {isOwnProfile && (
                                        <button onClick={() => actions.handleCreateAction('asset')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                            <Plus className="h-4 w-4" /> Vender Asset
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: BLOG */}
                    {activeTab === 'blog' && (
                        <>
                            {articlesError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 flex items-center gap-3">
                                    <div className="shrink-0 p-2 bg-red-500/20 rounded-lg">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <div className="text-sm break-words flex-1">
                                        <p className="font-bold">Error cargando artículos</p>
                                        <p className="opacity-80">
                                            {articlesError.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                                part.match(/^https?:\/\//) ? (
                                                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-400 block mt-1">
                                                        ➡️ Haz clic aquí para crear el índice necesario
                                                    </a>
                                                ) : part
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* Header Actions for Blog */}
                            {isOwnProfile && (
                                <div className="mb-8 flex justify-end">
                                    <button
                                        onClick={() => setIsCreatePostModalOpen(true)}
                                        className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                                    >
                                        <Plus className="h-4 w-4" /> Nueva Historia
                                    </button>
                                </div>
                            )}

                            {userArticles.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                                    {userArticles.map((item) => (
                                        <BlogCard
                                            key={item.id}
                                            article={item}
                                            onClick={() => onItemSelect(item.id, 'blog')}
                                            onSave={actions.openSaveModal}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <Newspaper className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Sin artículos publicados</h3>
                                    <p className="text-slate-400 max-w-md mb-6">Escribe sobre tus experiencias y tutoriales.</p>
                                    {isOwnProfile && (
                                        <button onClick={() => setIsCreatePostModalOpen(true)} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                            <Plus className="h-4 w-4" /> Escribir Artículo
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: SAVED (LIKES) */}
                    {activeTab === 'saved' && (
                        <>
                            {savedItems.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 animate-slide-up">
                                    {savedItems.map((item) => {
                                        // Simple type guard or rendering logic
                                        if ('price' in item && 'fileSize' in item) { // Asset
                                            return <AssetCard key={item.id} asset={item} onClick={() => onItemSelect(item.id, 'asset')} onSave={actions.openSaveModal} />;
                                        } else if ('instructor' in item) { // Course
                                            return <EducationCard key={item.id} course={item} onClick={() => onItemSelect(item.id, 'course')} />;
                                        } else if ('readTime' in item) { // Blog
                                            return <BlogCard key={item.id} article={item} onClick={() => onItemSelect(item.id, 'blog')} onSave={actions.openSaveModal} />;
                                        } else { // Portfolio
                                            return <PortfolioCard key={item.id} item={item} onClick={() => onItemSelect(item.id, 'portfolio')} onSave={actions.openSaveModal} />;
                                        }
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                                    <Bookmark className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No tienes elementos guardados.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: COLLECTIONS */}
                    {activeTab === 'collections' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up">
                            {userCollections.map((col) => (
                                <div key={col.id} className="group cursor-pointer">
                                    <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden mb-4 grid grid-cols-2 gap-1 p-1 hover:ring-2 ring-amber-500/50 transition-all shadow-sm hover:shadow-lg relative">
                                        {col.thumbnails.slice(0, 4).map((thumb, i) => (
                                            <div key={i} className="relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-lg">
                                                <img src={thumb} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                        {Array.from({ length: Math.max(0, 4 - col.thumbnails.length) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="bg-slate-200 dark:bg-white/5 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                    <h4 className="font-bold text-white text-sm mb-1">{col.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{col.itemCount} items</span>
                                        {col.isPrivate && <Lock className="h-3 w-3" />}
                                    </div>
                                </div>
                            ))}
                            {userCollections.length === 0 && (
                                <div className="col-span-full py-20 text-center text-slate-500">
                                    <p>No tienes colecciones aún.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: MEMBERSHIP */}
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
                                    </div>
                                ))}
                            </div>

                            {/* Locked Exclusive Content Section */}
                            <div className="pt-8 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-amber-500" />
                                    Contenido Exclusivo para Miembros
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {LOCKED_POSTS.map((post, idx) => (
                                        <div key={post.id} className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-white/5 aspect-video hover:border-amber-500/30 transition-colors">
                                            {/* Blurred Image Background */}
                                            <img src={post.image} alt={post.title} className="w-full h-full object-cover blur-md opacity-40 transform scale-110" />

                                            {/* Content & Lock Overlay */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center bg-black/40 backdrop-blur-sm">
                                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                                    {post.type === 'Download' ? <Download className="h-6 w-6 text-amber-500" /> :
                                                        post.type === 'Video' ? <PlayCircle className="h-6 w-6 text-amber-500" /> :
                                                            post.type === 'Asset' ? <Box className="h-6 w-6 text-amber-500" /> :
                                                                <FileText className="h-6 w-6 text-amber-500" />}
                                                </div>
                                                <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{post.title}</h4>
                                                <p className="text-amber-400/80 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20 px-2 py-0.5 rounded bg-amber-500/10">
                                                    Requiere: {post.tier}
                                                </p>
                                                <p className="text-slate-400 text-xs mb-4">Publicado {post.date}</p>
                                                <button className="px-5 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-200 shadow-lg flex items-center gap-2">
                                                    <Lock className="h-3 w-3" /> Desbloquear
                                                </button>
                                            </div>
                                        </div>
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
