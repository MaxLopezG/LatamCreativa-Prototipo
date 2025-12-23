import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Video, Box, Newspaper, Plus, Trash2, Bookmark, Lock, GraduationCap } from 'lucide-react';
import { PortfolioCard } from '../../../components/cards/PortfolioCard';
import { BlogCard } from '../../../components/cards/BlogCard';
import { EducationCard } from '../../../components/cards/EducationCard';
import { AssetCard } from '../../../components/cards/AssetCard';
import { PortfolioItem, ArticleItem, CourseItem, AssetItem, CollectionItem } from '../../../types';

/** Identificadores válidos para las tabs del perfil */
type ProfileTab = 'portfolio' | 'courses' | 'assets' | 'blog' | 'saved' | 'collections' | 'membership';

/** Tipo unión para cualquier item que puede aparecer en la tab "guardados" */
type SavedItem = PortfolioItem | ArticleItem | CourseItem | AssetItem;

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
    /** Proyectos del portafolio del usuario */
    userPortfolio: PortfolioItem[];
    /** Cursos publicados por el usuario */
    userCourses: CourseItem[];
    /** Assets publicados por el usuario */
    userAssets: AssetItem[];
    /** Artículos del blog del usuario */
    userArticles: ArticleItem[];
    /** Items guardados/marcados por el usuario */
    savedItems: SavedItem[];
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
    /** Callback para acciones de crear (curso, asset) */
    onCreateAction: (type: string) => void;
    /** Callback para abrir el modal de crear publicación */
    onOpenCreatePostModal: () => void;
}


export const UserProfileTabs: React.FC<UserProfileTabsProps> = ({
    activeTab,
    setActiveTab,
    isOwnProfile,
    userPortfolio,
    userCourses,
    userAssets,
    userArticles,
    savedItems,
    userCollections,
    projectsLoading,
    articlesError,
    onDeleteProject,
    onSaveItem,
    onCreateAction,
    onOpenCreatePostModal
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

                {isOwnProfile && (
                    <button
                        onClick={() => setActiveTab('collections')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'collections'
                            ? 'text-amber-500 border-amber-500'
                            : 'text-slate-500 border-transparent hover:text-white'
                            }`}
                    >
                        <Layers className="h-4 w-4" /> Colecciones <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 ml-1">{userCollections.length}</span>
                    </button>
                )}
            </div>

            {/* TAB: PORTFOLIO */}
            {activeTab === 'portfolio' && (
                <>
                    {/* 1. Show existing projects */}
                    {userPortfolio.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 animate-slide-up">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
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

            {/* TAB: COURSES */}
            {activeTab === 'courses' && (
                <>
                    {userCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                            {userCourses.map((item) => (
                                <EducationCard
                                    key={item.id}
                                    course={item}
                                    onClick={() => navigate(`/course/${item.id}`)}
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
                                <button onClick={() => onCreateAction('course')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
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
                                    onClick={() => navigate(`/asset/${item.id}`)}
                                    onSave={onSaveItem}
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
                                <button onClick={() => onCreateAction('asset')} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
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
                                onClick={onOpenCreatePostModal}
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
                            <p className="text-slate-400 max-w-md mb-6">Escribe sobre tus experiencias y tutoriales.</p>
                            {isOwnProfile && (
                                <button onClick={onOpenCreatePostModal} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
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
                                    return <AssetCard key={item.id} asset={item} onClick={() => navigate(`/asset/${item.id}`)} onSave={onSaveItem} />;
                                } else if ('instructor' in item) { // Course
                                    return <EducationCard key={item.id} course={item} onClick={() => navigate(`/course/${item.id}`)} />;
                                } else if ('readTime' in item) { // Blog
                                    return <BlogCard key={item.id} article={item} onClick={() => navigate(`/blog/${item.id}`)} onSave={onSaveItem} />;
                                } else { // Portfolio
                                    return <PortfolioCard key={item.id} item={item} onClick={() => navigate(`/portfolio/${item.id}`)} onSave={onSaveItem} />;
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
        </div>
    );
};
