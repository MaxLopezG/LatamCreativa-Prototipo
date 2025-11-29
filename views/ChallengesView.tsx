
import React from 'react';
import { Trophy, Flame, Timer, Search, Plus } from 'lucide-react';
import { CHALLENGE_ITEMS } from '../data/content';
import { ChallengeCard } from '../components/cards/ChallengeCard';

interface ChallengesViewProps {
    onChallengeSelect?: (id: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ onChallengeSelect }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-16 group">
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          
          <div className="relative z-10 px-10 md:px-16 max-w-4xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                  <Flame className="h-3 w-3" /> Challenge Activo
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display">
                  Neon Nights: <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Cyberpunk City</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
                  Diseña el entorno urbano definitivo. Demuestra tus habilidades en iluminación y composición para ganar una RTX 4090.
              </p>
              
              <div className="flex flex-wrap items-center gap-8">
                  <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-2xl shadow-white/20">
                      Participar Ahora
                  </button>
                  <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                          <Timer className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">Termina en</div>
                          <div className="text-xl font-bold text-white font-mono">12d : 04h : 35m</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            Explorar Retos
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Participa en competiciones de la comunidad para mejorar tu portafolio.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar retos..." 
                    className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 w-64"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm hover:opacity-90">
                <Plus className="h-4 w-4" /> Sugerir Tema
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {CHALLENGE_ITEMS.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onClick={() => onChallengeSelect?.(challenge.id)}
              />
          ))}
      </div>

    </div>
  );
};
