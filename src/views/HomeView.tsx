import React from 'react';
import { Play, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { HOME_FEED_VIDEOS } from '../data/content';
import { CATEGORY_ITEMS } from '../data/navigation';
import { VideoSuggestion } from '../types';

interface HomeViewProps {
  onCategorySelect: (category: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onCategorySelect }) => {
  return (
    <div className="max-w-[2200px] mx-auto md:px-10 md:py-10 pt-8 px-6 pb-16 transition-colors">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8">Tendencias Ahora</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOME_FEED_VIDEOS.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
                <img 
                  src={video.thumbnail} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={video.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-3 right-3">
                    <span className="rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
                      {video.duration}
                    </span>
                  </div>
                </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <Play className="h-8 w-8 fill-white text-white" />
                    </div>
                 </div>
              </div>
              <div className="mt-4">
                <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {video.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{video.channel}</p>
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {video.views} • {video.timeAgo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent my-12"></div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8">Explorar Temas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORY_ITEMS.filter(item => item.label !== 'Home').map((item) => (
            <button
              key={item.label}
              onClick={() => onCategorySelect?.(item.label)}
              className="group flex flex-col gap-4 rounded-3xl bg-white dark:bg-white/[0.03] p-6 ring-1 ring-slate-200 dark:ring-white/[0.06] shadow-sm dark:shadow-none transition-all hover:bg-slate-50 dark:hover:bg-white/[0.08] hover:scale-[1.02] text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-amber-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  <item.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="h-9 w-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowUpDown className="h-5 w-5 text-slate-400 -rotate-90" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-500 mt-1.5">
                  {item.subLabel}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
