
import React, { useState } from 'react';
import { Trophy, Flame, Timer, Search, Plus, Archive, Target } from 'lucide-react';
import { CHALLENGE_ITEMS } from '../data/content';
import { ChallengeCard } from '../components/cards/ChallengeCard';

interface ChallengesViewProps {
    onChallengeSelect?: (id: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ onChallengeSelect }) => {
  const [filter, setFilter] = useState<'active' | 'past'>('active');

  // Logic to show active/voting challenges in 'active' tab, and closed in 'past'
  const displayedChallenges = CHALLENGE_ITEMS.filter(c => {
      if (filter === 'active') return c.status !== 'Closed';
      return c.status === 'Closed';
  });

  // Always show a featured active challenge in the hero, regardless of list filter
  const heroChallenge = CHALLENGE_ITEMS.find(c => c.status === 'Active') || CHALLENGE_ITEMS[0];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Hero Banner (Always shows Featured Active Challenge) */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-10 group shadow-2xl">
          <img src={heroChallenge.coverImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          
          <div className="relative z-10 px-10 md:px-16 max-w-4xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                  <Flame className="h-3 w-3" /> Challenge Activo
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display">
                  {heroChallenge.title}
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-xl leading-relaxed line-clamp-2">
                  {heroChallenge.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-8">
                  <button 
                    onClick={() => onChallengeSelect?.(heroChallenge.id)}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-2xl shadow-white/20"
                  >
                      Participar Ahora
                  </button>
                  <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                          <Timer className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">Termina en</div>
                          <div className="text-xl font-bold text-white font-mono">{heroChallenge.daysLeft}d : 04h : 35m</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-1">
        
        {/* Tabs */}
        <div className="flex items-center gap-8">
            <button 
                onClick={() => setFilter('active')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                    filter === 'active' 
                    ? 'text-amber-500 border-amber-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                <Target className="h-4 w-4" /> Activos & Votación
            </button>
            <button 
                onClick={() => setFilter('past')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                    filter === 'past' 
                    ? 'text-amber-500 border-amber-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                <Archive className="h-4 w-4" /> Finalizados
            </button>
        </div>
        
        <div className="flex items-center gap-4 pb-4">
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
          {displayedChallenges.length > 0 ? (
              displayedChallenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    onClick={() => onChallengeSelect?.(challenge.id)}
                  />
              ))
          ) : (
              <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Archive className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">No hay retos en esta sección.</p>
              </div>
          )}
      </div>

    </div>
  );
};
