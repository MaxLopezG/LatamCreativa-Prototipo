
import React from 'react';
import { Zap, Award, Trophy, GraduationCap } from 'lucide-react';
import { ContentMode } from '../../hooks/useAppStore';

interface GamificationBoxProps {
  contentMode: ContentMode;
}

export const GamificationBox: React.FC<GamificationBoxProps> = ({ contentMode }) => {
  const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBg = contentMode === 'dev' ? 'bg-blue-500' : 'bg-amber-500';
  const boxBorder = contentMode === 'dev' ? 'border-blue-500/30' : 'border-amber-500/30';
  const boxGradient = contentMode === 'dev' ? 'from-blue-900/40 to-slate-900' : 'from-amber-900/40 to-slate-900';

  return (
    <div className={`bg-gradient-to-br ${boxGradient} border ${boxBorder} p-6 rounded-2xl relative overflow-hidden transition-all duration-500`}>
        <div className="flex justify-between items-center mb-2">
            <h3 className={`${accentText} font-bold text-sm uppercase tracking-widest flex items-center gap-2`}>
                <Zap className="h-4 w-4" /> Nivel 15
            </h3>
            <span className="text-white font-bold text-sm">3,450 / 5,000 XP</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full mb-6">
            <div className={`h-full ${accentBg} rounded-full`} style={{ width: '70%' }}></div>
        </div>
        
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medallas</h4>
        <div className="flex gap-3">
            <div className={`h-10 w-10 ${accentBg}/10 border ${boxBorder} rounded-lg flex items-center justify-center ${accentText}`} title="Top Contributor">
                <Award className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-500" title="Challenge Winner">
                <Trophy className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-500" title="Course Creator">
                <GraduationCap className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold">
                +5
            </div>
        </div>
    </div>
  );
};
