import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Newspaper, Plus, Trash2, Bookmark, Lock } from 'lucide-react';
import { PortfolioCard } from '../../../components/cards/PortfolioCard';
import { BlogCard } from '../../../components/cards/BlogCard';
import { PortfolioItem, ArticleItem, CollectionItem } from '../../../types';

/** Identificadores válidos para las tabs del perfil */
type ProfileTab = 'portfolio' | 'blog' | 'collections';

/**
 * Props para el componente UserProfileTabs
 */
interface UserProfileTabsProps {
    /** Tab activa actualmente */
    activeTab: ProfileTab;
    /** Callback para cambiar la tab activa */
    setActiveTab: (tab: ProfileTab) => void;
    /** Si está viendo su propio perfil (habilita acciones de editar/eliminar) */
    isOwnProfile: boolean;
    /** ID del usuario cuyo perfil se está viendo */
    profileUserId: string;
    /** Proyectos del portafolio del usuario */
    userPortfolio: PortfolioItem[];
    /** Artículos del blog del usuario */
    userArticles: ArticleItem[];
    /** Colecciones del usuario */
    userCollections: CollectionItem[];
    /** Si los proyectos están cargando */
    projectsLoading: boolean;
    /** Mensaje de error cuando falla la carga de artículos */
    articlesError: string | null;
    /** Callback para eliminar un proyecto */
    onDeleteProject: (id: string) => void;
    /** Callback para guardar/marcar un item */
    onSaveItem: (id: string, image: string, type?: string) => void;
}


export const UserProfileTabs: React.FC<UserProfileTabsProps> = ({
    activeTab,
    setActiveTab,
    isOwnProfile,
    profileUserId,
    userPortfolio,
    userArticles,
    userCollections,
    projectsLoading,
    articlesError,
    onDeleteProject,
    onSaveItem
}) => {
    const navigate = useNavigate();

    return (
        <div>
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
                    onClick={() => setActiveTab('blog')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'blog'
                        ? 'text-amber-500 border-amber-500'
                        : 'text-slate-500 border-transparent hover:text-white'
                        }`}
                >
                    <Newspaper className="h-4 w-4" /> Blog <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userArticles.length}</span>
                </button>

                {/* Show collections tab: always for own profile, or if other user has public collections */}
                {(isOwnProfile || userCollections.length > 0) && (
                    <button
                        onClick={() => setActiveTab('collections')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'collections'
                            ? 'text-amber-500 border-amber-500'
                            : 'text-slate-500 border-transparent hover:text-white'
                            }`}
                    >
                        <Bookmark className="h-4 w-4" /> Colecciones <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userCollections.length}</span>
                    </button>
                )}
            </div>

            {/* TAB: PORTFOLIO */}
            {activeTab === 'portfolio' && (
                <>
                    {/* 1. Show existing projects */}
                    {userPortfolio.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                            {userPortfolio.map((item) => (
                                <div key={item.id} className="relative group">
                                    <PortfolioCard
                                        item={item}
                                        onClick={() => navigate(`/portfolio/${item.id}`)}
                                        onSave={onSaveItem}
                                        extraAction={
                                            isOwnProfile ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteProject(item.id);
                                                    }}
                                                    className="pointer-events-auto p-2 bg-red-500/90 text-white rounded-full transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                                                    title="Eliminar proyecto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            ) : undefined
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 2. Loading state */}
                    {projectsLoading && userPortfolio.length === 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    )}

                    {/* 3. Empty state */}
                    {!projectsLoading && userPortfolio.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Layers className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin proyectos publicados</h3>
                            <p className="text-slate-400 max-w-md mb-6">Comparte tus creaciones con la comunidad.</p>
                            {isOwnProfile && (
                                <button onClick={() => navigate('/create/portfolio')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Crear Proyecto
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

                    {userArticles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                            {userArticles.map((item) => (
                                <BlogCard
                                    key={item.id}
                                    article={item}
                                    onClick={() => navigate(`/blog/${item.id}`)}
                                    onSave={onSaveItem}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Newspaper className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin artículos publicados</h3>
                            <p className="text-slate-400 max-w-md">Este usuario aún no ha escrito artículos.</p>
                        </div>
                    )}
                </>
            )}

            {/* TAB: COLLECTIONS */}
            {activeTab === 'collections' && (
                <>
                    {userCollections.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up">
                            {userCollections.map((collection) => (
                                <button
                                    key={collection.id}
                                    onClick={() => navigate(`/collections/${collection.id}?owner=${profileUserId}`)}
                                    className="group relative rounded-2xl overflow-hidden bg-[#1a1a1e] ring-1 ring-white/10 hover:ring-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 text-left"
                                >
                                    {/* Thumbnails Grid */}
                                    <div className="aspect-square grid grid-cols-2 gap-0.5 bg-black/50">
                                        {(collection.thumbnails || []).slice(0, 4).map((thumb, i) => (
                                            <div key={i} className="bg-slate-800 overflow-hidden">
                                                <img
                                                    src={thumb}
                                                    alt=""
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                        {/* Fill empty slots */}
                                        {Array.from({ length: Math.max(0, 4 - (collection.thumbnails?.length || 0)) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="bg-slate-800/50 flex items-center justify-center">
                                                <Bookmark className="h-6 w-6 text-slate-600" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors truncate">
                                                {collection.title}
                                            </h3>
                                            {collection.isPrivate && <Lock className="h-3 w-3 text-slate-500 shrink-0" />}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {collection.itemCount || 0} {(collection.itemCount || 0) === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Bookmark className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Sin colecciones</h3>
                            <p className="text-slate-400 max-w-md">
                                Guarda proyectos y artículos en colecciones para organizarlos.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
