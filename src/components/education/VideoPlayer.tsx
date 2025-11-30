
import React from 'react';
import { PlayCircle } from 'lucide-react';
import { ContentMode } from '../../hooks/useAppStore';

interface VideoPlayerProps {
  thumbnail: string;
  contentMode: ContentMode;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ thumbnail, contentMode }) => {
  const accentFill = contentMode === 'dev' ? 'fill-blue-500/20 text-blue-500' : 'fill-white/10 text-white';

  return (
    <div className="bg-black w-full aspect-video max-h-[70vh] flex items-center justify-center relative group">
       <img src={thumbnail} className="w-full h-full object-contain opacity-50" alt="" />
       <button className="absolute inset-0 flex items-center justify-center">
           <PlayCircle className={`h-20 w-20 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all ${accentFill}`} />
       </button>
       
       <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-full">
               <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer relative">
                   <div className={`absolute left-0 top-0 bottom-0 w-[30%] rounded-full ${contentMode === 'dev' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
               </div>
               <div className="flex justify-between text-xs font-bold text-white">
                   <span>05:32 / 12:20</span>
                   <span>1080p</span>
               </div>
           </div>
       </div>
    </div>
  );
};
