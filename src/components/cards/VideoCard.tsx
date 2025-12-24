import React from 'react';
import { Play } from 'lucide-react';
import { VideoSuggestion } from '../../types';

interface VideoCardProps {
  video: VideoSuggestion;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      <div className="mt-4 flex gap-3.5">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <img src={`https://ui-avatars.com/api/?name=${video.channel}&background=random`} alt={video.channel} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
            {video.title}
          </h3>
          <div className="mt-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{video.channel}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {video.views} • {video.timeAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
