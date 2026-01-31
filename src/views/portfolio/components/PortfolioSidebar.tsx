import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, UserPlus, Briefcase, Edit } from 'lucide-react';
import { PortfolioItem } from '../../../types';

/**
 * Información del perfil del autor mostrada en el sidebar
 */
interface AuthorProfile {
    /** Nombre de display */
    name?: string;
    /** URL del avatar */
    avatar?: string;
    /** Rol/título profesional */
    role?: string;
    /** Ubicación geográfica */
    location?: string;
    /** Username único para URL del perfil */
    username?: string;
    /** Si el autor está disponible para trabajar */
    availableForWork?: boolean;
}

/**
 * Proyecto relacionado mostrado en la sección "Más del Autor"
 */
interface RelatedProject {
    /** ID del proyecto para navegación */
    id: string;
    /** Título del proyecto */
    title: string;
    /** Imagen principal */
    image?: string;
    /** Alternativa: imagen de portada */
    coverImage?: string;
}

/**
 * Props para el componente PortfolioSidebar
 */
interface PortfolioSidebarProps {
    /** El item de portafolio que se está viendo */
    item: PortfolioItem;
    /** Datos del perfil del autor */
    authorProfile: AuthorProfile | null;
    /** Si el usuario actual es dueño del proyecto */
    isOwner: boolean;
    /** Si el usuario actual sigue al autor */
    isFollowing: boolean;
    /** Si la acción de seguir está en progreso */
    isFollowLoading: boolean;
    /** Conteo total de likes */
    likeCount: number;
    /** Conteo total de comentarios */
    commentsCount: number;
    /** Otros proyectos del mismo autor */
    relatedProjects: RelatedProject[];
    /** Se llama cuando se hace clic en la tarjeta del autor */
    onAuthorClick?: (username: string) => void;
    /** Se llama cuando se hace clic en seguir/dejar de seguir */
    onFollowToggle: () => void;
}

/**
 * Componente sidebar para la vista de proyecto de portafolio.
 * Muestra:
 * - Tarjeta del autor con avatar, nombre, rol y badge de disponibilidad
 * - Estadísticas (vistas, likes, comentarios)
 * - Tags/categorías
 * - Lista de colaboradores
 * - Grid de proyectos relacionados
 * 
 * Muestra acciones diferentes según si el usuario es dueño (Editar) o visitante (Seguir/Contratar).
 */
export const PortfolioSidebar: React.FC<PortfolioSidebarProps> = ({
    item,
    authorProfile,
    isOwner,
    isFollowing,
    isFollowLoading,
    likeCount,
    commentsCount,
    relatedProjects,
    onAuthorClick,
    onFollowToggle,
}) => {
    const navigate = useNavigate();
    const displayRelated = relatedProjects.slice(0, 4);

    return (
        <aside className="lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">

                {/* Author Card */}
                <div className="bg-[#18181b] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-purple-500"></div>

                    <div
                        className="flex items-center gap-4 mb-6 cursor-pointer"
                        onClick={() => onAuthorClick?.(authorProfile?.username || item.artistUsername || item.artist)}
                    >
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-amber-500 to-transparent">
                                <div className="h-full w-full rounded-full bg-black p-[2px]">
                                    <img
                                        src={authorProfile?.avatar || item.artistAvatar}
                                        alt={authorProfile?.name || item.artist}
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                                <CheckCircle2 className="h-4 w-4 text-white fill-blue-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg hover:underline decoration-amber-500 underline-offset-4 decoration-2">
                                {authorProfile?.name || item.artist}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs text-slate-400">{authorProfile?.role}</p>
                                {(authorProfile?.availableForWork || item.availableForWork) === true && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        Disponible
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">
                                {authorProfile?.location}
                            </p>
                        </div>
                    </div>

                    {!isOwner ? (
                        /* Visitor View: Seguir + Contratar */
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onFollowToggle}
                                disabled={isFollowLoading}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFollowing
                                    ? 'bg-white/5 text-white border border-white/5'
                                    : 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                                    }`}
                            >
                                {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                {isFollowing ? 'Siguiendo' : 'Seguir'}
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
                                <Briefcase className="h-4 w-4" /> Contactar
                            </button>
                        </div>
                    ) : (
                        /* Owner View: Solo Editar (full width) */
                        <button
                            onClick={() => navigate(`/create/portfolio?edit=${item.id}`)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                        >
                            <Edit className="h-4 w-4" /> Editar Proyecto
                        </button>
                    )}
                </div>

                {/* Stats Card */}
                <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5">
                    <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/5">
                        <div>
                            <div className="text-white font-bold">{(item.views || 0).toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Vistas</div>
                        </div>
                        <div>
                            <div className="text-white font-bold">{likeCount.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Likes</div>
                        </div>
                        <div>
                            <div className="text-white font-bold">{commentsCount}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Coment.</div>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                        {(item.tags && item.tags.length > 0 ? item.tags : [item.category]).map(tag => (
                            <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Collaborators */}
                <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Colaboradores</h4>
                    <div className="flex flex-wrap gap-2">
                        {item.collaborators && item.collaborators.length > 0 ? (
                            item.collaborators.map(person => (
                                <span key={person} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                                    @{person}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-600 italic">Sin colaboradores</span>
                        )}
                    </div>
                </div>

                {/* More from Author/Category */}
                {displayRelated.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Más de {item.artist}</h4>
                            <button className="text-xs text-amber-500 hover:underline font-bold">Ver todo</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {displayRelated.map(rel => (
                                <div
                                    key={rel.id}
                                    className="group aspect-square rounded-xl bg-white/5 overflow-hidden cursor-pointer relative"
                                    onClick={() => navigate(`/portfolio/${rel.id}`)}
                                >
                                    <img src={rel.image || rel.coverImage} alt={rel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                        <span className="text-xs font-bold text-white line-clamp-1">{rel.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </aside>
    );
};
