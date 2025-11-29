
import React from 'react';
import { Users, Clock } from 'lucide-react';
import { CommunityGroup } from '../../types';

interface GroupCardProps {
  group: CommunityGroup;
  onClick?: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/10"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={group.image} 
          alt={group.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide rounded border border-white/10 ${
                group.status === 'Reclutando' ? 'bg-green-600/80' : 'bg-blue-600/80'
            }`}>
                {group.status}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors mb-2 text-lg">
            {group.name}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {group.description}
        </p>

        {/* Roles Needed */}
        <div className="mb-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Se busca:</h4>
            <div className="flex flex-wrap gap-2">
                {group.rolesNeeded.map((role) => (
                    <span key={role} className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded text-xs font-medium border border-amber-500/20">
                        {role}
                    </span>
                ))}
            </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src={group.leaderAvatar} alt={group.leader} className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Líder: {group.leader}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {group.membersCount}
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {group.postedTime}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
