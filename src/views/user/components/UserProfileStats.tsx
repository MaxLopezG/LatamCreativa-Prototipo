import React from 'react';

interface UserProfileStatsProps {
    stats: {
        views: number;
        likes: number;
        followers: number;
    };
}

export const UserProfileStats: React.FC<UserProfileStatsProps> = ({ stats }) => {
    return (
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
    );
};
