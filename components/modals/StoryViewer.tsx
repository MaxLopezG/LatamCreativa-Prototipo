
import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  isLive?: boolean;
}

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
  users: StoryUser[];
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ isOpen, onClose, initialIndex, users }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const STORY_DURATION = 5000; // 5 seconds per story
  
  // Mock story images based on index to ensure consistency
  const getStoryImage = (index: number) => {
    const seed = users[index]?.id || index;
    return `https://images.unsplash.com/photo-${1550000000000 + (index * 123456) % 1000000}?q=80&w=800&h=1200&fit=crop`;
  };

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 50)); // Update every 50ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isOpen, isPaused]);

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setProgress(0); // Restart current story
    }
  };

  if (!isOpen) return null;

  const currentUser = users[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Close Button (Desktop) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-2 text-white/50 hover:text-white transition-colors hidden md:block"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Flex Wrapper for Arrows + Content */}
      <div className="relative z-[105] flex items-center justify-center w-full h-full pointer-events-none md:gap-16">
        
        {/* Desktop Prev Arrow */}
        <button 
            className="pointer-events-auto p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:flex items-center justify-center hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
            onClick={handlePrev}
            disabled={currentIndex === 0 && progress < 5}
        >
            <ChevronLeft className="h-8 w-8" />
        </button>

        {/* Main Story Container */}
        <div className="pointer-events-auto relative w-full h-full md:w-[400px] md:h-[85vh] md:rounded-3xl overflow-hidden bg-black shadow-2xl animate-fade-in ring-1 ring-white/10">
            
            {/* Story Image */}
            <div 
                className="absolute inset-0 bg-slate-900"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <img 
                    src={getStoryImage(currentIndex)} 
                    alt="Story" 
                    className="w-full h-full object-cover animate-fade-in" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"></div>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                {users.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-white transition-all duration-100 ease-linear ${
                                idx < currentIndex ? 'w-full' : 
                                idx === currentIndex ? 'w-full' : 'w-0'
                            }`}
                            style={{ 
                                width: idx === currentIndex ? `${progress}%` : undefined,
                                transition: idx === currentIndex ? 'none' : undefined 
                            }}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full p-[2px] ${currentUser.isLive ? 'bg-gradient-to-tr from-red-500 to-orange-500' : 'bg-gradient-to-tr from-amber-500 to-purple-600'}`}>
                        <img 
                            src={currentUser.avatar} 
                            className="w-full h-full rounded-full object-cover border-2 border-black"
                            alt={currentUser.name}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm shadow-sm">{currentUser.name}</span>
                            <span className="text-white/60 text-xs font-medium">3h</span>
                        </div>
                        {currentUser.isLive && (
                            <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">En Vivo</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors md:hidden">
                        <X className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Tap Navigation Zones (Mobile/Tablet primarily) */}
            <div className="absolute inset-0 flex z-10 md:hidden">
                <div className="w-1/3 h-full" onClick={handlePrev}></div>
                <div className="w-2/3 h-full" onClick={handleNext}></div>
            </div>

            {/* Footer / Interactions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:pb-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder={`Responder a ${currentUser.name}...`}
                            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all text-sm backdrop-blur-md"
                        />
                    </div>
                    <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-white active:scale-90 transform duration-200">
                        <Heart className="h-7 w-7" />
                    </button>
                    <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-white active:scale-90 transform duration-200">
                        <Send className="h-7 w-7" />
                    </button>
                </div>
            </div>

        </div>

        {/* Desktop Next Arrow */}
        <button 
            className="pointer-events-auto p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:flex items-center justify-center hover:scale-110"
            onClick={handleNext}
        >
            <ChevronRight className="h-8 w-8" />
        </button>

      </div>
    </div>
  );
};
