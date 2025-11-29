
import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORY_CONTENT_MAP } from '../data/content';
import { VideoCard } from '../components/cards/VideoCard';
import { Pagination } from '../components/common/Pagination';

interface CategoryGridViewProps {
  activeCategory: string;
}

export const CategoryGridView: React.FC<CategoryGridViewProps> = ({ activeCategory }) => {
  const categoryVideos = CATEGORY_CONTENT_MAP[activeCategory] || [];

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{activeCategory}</h2>
        <div className="flex items-center gap-3">
            <span className="text-base text-slate-500 dark:text-slate-400">Ordenar por:</span>
            <button className="flex items-center gap-1.5 text-base font-medium text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400">
              Popular <ArrowUpDown className="h-4 w-4" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 mb-16">
        {categoryVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        {categoryVideos.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            <p>No se encontraron videos para esta categoría.</p>
          </div>
        )}
      </div>

      {categoryVideos.length > 0 && (
        <Pagination currentPage={1} onPageChange={() => {}} />
      )}
    </div>
  );
};
