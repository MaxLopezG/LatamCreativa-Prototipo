
import React from 'react';
import { Star, Clock, BarChart } from 'lucide-react';
import { CourseItem } from '../../types';

interface EducationCardProps {
  course: CourseItem;
  onClick?: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({ course, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/10"
    >
      
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {course.bestseller && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-md shadow-lg shadow-amber-500/20">
                Bestseller
            </div>
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="px-6 py-2 bg-white text-black font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                Ver Curso
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-amber-500 transition-colors">
            {course.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
            {course.instructor}
        </p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-bold text-amber-500">{course.rating}</span>
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(course.rating) ? 'fill-amber-500 text-amber-500' : 'fill-slate-300 dark:fill-slate-700 text-transparent'}`} />
                ))}
            </div>
            <span className="text-xs text-slate-400">({course.reviewCount.toLocaleString()})</span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500 mb-3">
            <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {course.duration}
            </div>
            <div className="flex items-center gap-1">
                <BarChart className="h-3 w-3" /> {course.level}
            </div>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
            <span className="text-lg font-bold text-slate-900 dark:text-white">${course.price}</span>
            {course.originalPrice && (
                <span className="text-sm text-slate-400 line-through">${course.originalPrice}</span>
            )}
        </div>
      </div>
    </div>
  );
};
