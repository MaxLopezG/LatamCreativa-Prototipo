
import React from 'react';
import { Users, Clock, Zap } from 'lucide-react';
import { CommunityGroup } from '../../types';

interface GroupCardProps {
    group: CommunityGroup;
    onClick?: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group flex flex-col h-full bg-[#1a1a1e] rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-purple-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 duration-300"
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                    src={group.image}
                    alt={group.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1e] via-transparent to-transparent opacity-90"></div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide rounded-lg border border-white/10 shadow-lg ${group.status === 'Reclutando' ? 'bg-green-500/80' : 'bg-blue-500/80'
                        }`}>
                        {group.status}
                    </span>
                </div>

                {/* Roles Needed (Overlay) */}
                <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex flex-wrap gap-1.5">
                        {group.rolesNeeded.slice(0, 3).map((role) => (
                            <span key={role} className="px-2 py-0.5 bg-black/60 text-purple-300 rounded text-[10px] font-bold border border-purple-500/20 backdrop-blur-sm">
                                {role}
                            </span>
                        ))}
                        {group.rolesNeeded.length > 3 && (
                            <span className="px-2 py-0.5 bg-black/60 text-slate-300 rounded text-[10px] font-bold border border-white/10 backdrop-blur-sm">
                                +{group.rolesNeeded.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 pt-2">
                <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                    {group.name}
                </h3>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {group.description}
                </p>


                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden ring-1 ring-white/20">
                            <img src={group.leaderAvatar} alt={group.leader} className="h-full w-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-slate-300">@{group.leader}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {group.membersCount}
                        </div>
                        {/* Random Activity Indicator for vibe */}
                        <div className="flex items-center gap-1 text-amber-500/80">
                            <Zap className="h-3.5 w-3.5 fill-current" /> Activo
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
