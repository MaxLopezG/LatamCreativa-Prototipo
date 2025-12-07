
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="w-full h-full animate-fade-in">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden relative">
                    <div className="aspect-[4/5] w-full bg-slate-200 dark:bg-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
