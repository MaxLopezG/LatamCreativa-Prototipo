import React from 'react';
import { MapPin, Link as LinkIcon, Calendar, CheckCircle2, UserPlus, MessageSquare, Settings } from 'lucide-react';
import { User } from '../../../types';

interface UserProfileHeaderProps {
    displayUser: User;
    isOwnProfile: boolean;
    isFollowing: boolean;
    isFollowLoading: boolean;
    onFollowToggle: () => void;
    onOpenChat?: (name: string) => void;
    onEditProfile: () => void;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
    displayUser,
    isOwnProfile,
    isFollowing,
    isFollowLoading,
    onFollowToggle,
    onOpenChat,
    onEditProfile
}) => {
    const name = displayUser.name || 'Unknown User';
    const availableForWork = displayUser.availableForWork;
    const socialLinks = displayUser.socialLinks || {};

    // Simplified Level Logic for pure display (can be prop if needed dynamic)
    const getLevelFrameClass = (role?: string) => {
        // Simple logic based on role for now as per previous implementation
        if (role === 'Creative Member') return 'bg-slate-200 dark:bg-slate-700';
        return 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-2xl shadow-amber-500/30';
    };

    const levelFrameClass = getLevelFrameClass(displayUser.role);

    return (
        <>
            {/* Banner Area */}
            <div className="relative h-[250px] md:h-[350px] 2xl:h-[450px] w-full overflow-hidden">
                <img
                    src={displayUser.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/40 to-transparent"></div>
            </div>

            {/* Profile Header Info */}
            <div className="px-6 md:px-12 2xl:px-20 relative -mt-20 md:-mt-24 z-10 mb-16">
                <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">

                    {/* Avatar with Level Frame */}
                    <div className="relative group">
                        <div className={`h-32 w-32 md:h-40 md:w-40 2xl:h-48 2xl:w-48 rounded-3xl p-[4px] ${levelFrameClass}`}>
                            <div className="h-full w-full rounded-2xl overflow-hidden bg-[#0d0d0f] border-4 border-[#0d0d0f]">
                                <img
                                    src={displayUser.avatar}
                                    alt={name}
                                    className="w-full h-full object-cover bg-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="flex-1 pb-2 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-white tracking-tight">{name}</h1>
                            {availableForWork && (
                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ml-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Disponible
                                </span>
                            )}
                        </div>
                        <p className="text-lg md:text-xl 2xl:text-2xl text-slate-300 font-light mb-4">{displayUser.role}</p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 2xl:text-base text-slate-400">
                            {displayUser.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    {displayUser.location}
                                </div>
                            )}
                            {(socialLinks.website || socialLinks.artstation) && (
                                <div className="flex items-center gap-1.5">
                                    <LinkIcon className="h-4 w-4 text-slate-500" />
                                    <a
                                        href={socialLinks.website ? (socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`) : `https://artstation.com/${socialLinks.artstation}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-amber-500 transition-colors truncate max-w-[200px] md:max-w-none"
                                    >
                                        {socialLinks.website
                                            ? socialLinks.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
                                            : `artstation.com/${socialLinks.artstation}`
                                        }
                                    </a>
                                </div>
                            )}
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
                                    onClick={onFollowToggle}
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
                                onClick={onEditProfile}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/10 transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
