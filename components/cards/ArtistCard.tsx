
import React, { useState } from 'react';
import { MapPin, Users, Briefcase, UserPlus, CheckCircle2, MessageSquare } from 'lucide-react';
import { ArtistProfile } from '../../types';

interface ArtistCardProps {
  artist: ArtistProfile;
  onClick?: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Helper to determine frame style based on level
  const getLevelFrameClass = (level?: string) => {
    switch(level) {
        case 'Master': return 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-lg shadow-cyan-500/20';
        case 'Expert': return 'bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20';
        case 'Pro': return 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20';
        case 'Novice': return 'bg-slate-200 dark:bg-slate-700';
        default: return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  const levelFrameClass = getLevelFrameClass(artist.level);

  return (
    <div 
        onClick={onClick}
        className="group relative flex flex-col bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="h-24 bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <img src={artist.coverImage} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="px-5 pb-5 flex flex-col flex-1 relative">
        {/* Avatar with Dynamic Level Frame */}
        <div className="-mt-10 mb-3 flex justify-between items-end">
            <div className={`h-20 w-20 rounded-2xl p-[3px] ${levelFrameClass}`}>
                <div className="h-full w-full rounded-xl overflow-hidden border-2 border-white dark:border-[#0A0A0C] bg-slate-100 dark:bg-slate-800">
                    <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                </div>
            </div>
            
            {artist.availableForWork && (
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-[10px] font-bold uppercase rounded-lg mb-1">
                    Open to Work
                </span>
            )}
        </div>

        {/* Info */}
        <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {artist.name}
                </h3>
                {artist.isPro && <CheckCircle2 className="h-4 w-4 text-amber-500 fill-amber-500/20" />}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">{artist.role}</p>
            
            <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{artist.location}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {artist.followers}
                </div>
                <div className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {artist.projects} Proyectos
                </div>
            </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
            {artist.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    {skill}
                </span>
            ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFollowing(!isFollowing);
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isFollowing 
                    ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' 
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
            >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
            </button>
            <button 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold transition-colors"
            >
                <MessageSquare className="h-3.5 w-3.5" /> Mensaje
            </button>
        </div>
      </div>
    </div>
  );
};
