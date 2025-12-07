
import React from 'react';
import { Clock, Users, Trophy } from 'lucide-react';
import { ChallengeItem } from '../../types';

interface ChallengeCardProps {
  challenge: ChallengeItem;
  onClick?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-transform hover:-translate-y-2"
    >
      <img src={challenge.coverImage} alt={challenge.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      
      {/* Status Badge */}
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
            challenge.status === 'Active' ? 'bg-green-500 text-black' : 
            challenge.status === 'Voting' ? 'bg-amber-500 text-black' : 'bg-slate-500 text-white'
        }`}>
            {challenge.status === 'Active' ? 'Activo' : challenge.status === 'Voting' ? 'Votación' : 'Cerrado'}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
         {challenge.sponsor && (
             <div className="flex items-center gap-2 mb-3">
                 <span className="text-xs text-slate-400 font-bold uppercase">Patrocinado por</span>
                 <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-md">
                     <img src={challenge.sponsorLogo} alt={challenge.sponsor} className="h-4 w-4 rounded-full" />
                     <span className="text-xs font-bold text-white">{challenge.sponsor}</span>
                 </div>
             </div>
         )}
         
         <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors">{challenge.title}</h3>
         <p className="text-slate-300 text-sm line-clamp-2 mb-4">{challenge.description}</p>
         
         <div className="flex items-center justify-between pt-4 border-t border-white/10">
             <div className="flex items-center gap-4 text-xs font-bold text-white">
                 <div className="flex items-center gap-1.5 text-amber-400">
                     <Clock className="h-4 w-4" /> {challenge.daysLeft} días
                 </div>
                 <div className="flex items-center gap-1.5">
                     <Users className="h-4 w-4" /> {challenge.participants}
                 </div>
             </div>
             <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                 <Trophy className="h-4 w-4" /> {challenge.prizes[0]}
             </div>
         </div>
      </div>
    </div>
  );
};
