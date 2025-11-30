
import React from 'react';
import { MapPin, Link as LinkIcon, Calendar, CheckCircle2, Heart, UserPlus, UserCheck, MessageSquare, MoreHorizontal } from 'lucide-react';
import { ContentMode } from '../../hooks/useAppStore';

interface ProfileHeaderProps {
  authorName: string;
  avatar: string;
  coverImage: string;
  role: string;
  location: string;
  isPro: boolean;
  isFollowing: boolean;
  isFriend: boolean;
  onFollow: () => void;
  onFriend: () => void;
  onMessage: () => void;
  contentMode: ContentMode;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  authorName,
  avatar,
  coverImage,
  role,
  location,
  isPro,
  isFollowing,
  isFriend,
  onFollow,
  onFriend,
  onMessage,
  contentMode
}) => {
  const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBg = contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500';
  const accentBorder = contentMode === 'dev' ? 'border-blue-500' : 'border-amber-500';
  const accentHoverBg = contentMode === 'dev' ? 'hover:bg-blue-600' : 'hover:bg-amber-600';
  const accentShadow = contentMode === 'dev' ? 'shadow-blue-500/20' : 'shadow-amber-500/20';

  return (
    <>
      {/* Banner Area */}
      <div className="relative h-[250px] md:h-[350px] 2xl:h-[450px] w-full overflow-hidden">
        <img 
          src={coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/40 to-transparent"></div>
      </div>

      {/* Profile Header Info */}
      <div className="px-6 md:px-12 2xl:px-20 relative -mt-20 md:-mt-24 z-10 mb-16">
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
            
            {/* Avatar */}
            <div className="relative group">
                <div className="h-32 w-32 md:h-40 md:w-40 2xl:h-48 2xl:w-48 rounded-3xl p-1 bg-[#030304] ring-1 ring-white/10 overflow-hidden shadow-2xl">
                    <img 
                        src={avatar} 
                        alt={authorName} 
                        className="w-full h-full object-cover rounded-2xl bg-slate-800"
                    />
                </div>
                <div className={`absolute bottom-3 right-3 h-5 w-5 md:h-6 md:w-6 rounded-full border-4 border-[#030304] ${contentMode === 'dev' ? 'bg-green-500' : 'bg-green-500'}`} title="Disponible"></div>
            </div>

            {/* Info Text */}
            <div className="flex-1 pb-2 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-white tracking-tight">{authorName}</h1>
                    {isPro && (
                      <>
                        <CheckCircle2 className={`h-5 w-5 md:h-6 md:w-6 2xl:h-8 2xl:w-8 ${accentText} fill-current bg-white rounded-full`} />
                        <span className={`px-2 py-0.5 rounded text-[10px] 2xl:text-xs font-bold ${accentText} ${accentBorder} border bg-opacity-10 bg-black uppercase tracking-wider ml-2`}>Pro</span>
                      </>
                    )}
                </div>
                <p className="text-lg md:text-xl 2xl:text-2xl text-slate-300 font-light mb-4">{role}</p>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 2xl:text-base text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {location}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <LinkIcon className="h-4 w-4 text-slate-500" />
                        <a href="#" className={`transition-colors truncate max-w-[200px] md:max-w-none hover:${accentText}`}>
                          latam.creativa/{authorName.replace(/\s/g, '').toLowerCase()}
                        </a>
                    </div>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        Se unió en Mayo 2021
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pb-2 w-full md:w-auto mt-2 md:mt-0">
                <button 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-lg"
                >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    Unirse
                </button>

                <button 
                    onClick={onFollow}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : `${accentBg} text-white ${accentHoverBg} shadow-lg ${accentShadow}`
                    }`}
                >
                    {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                </button>

                <button 
                    onClick={onFriend}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                        isFriend 
                        ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' 
                        : 'bg-transparent border-white/20 text-white hover:bg-white/10'
                    }`}
                >
                    {isFriend ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFriend ? 'Amigo' : 'Agregar'}
                </button>

                <button 
                    onClick={onMessage}
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
    </>
  );
};
