
import React from 'react';
import { Star, Clock, BarChart, PlayCircle } from 'lucide-react';
import { CourseItem } from '../../types';

interface EducationCardProps {
    course: CourseItem;
    onClick?: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({ course, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group flex flex-col gap-3 cursor-pointer"
        >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#1a1a1e] ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/10 hover:-translate-y-1 duration-300">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* Play Button Overlay (Reveals on Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                        <PlayCircle className="h-6 w-6 fill-white text-transparent" />
                    </div>
                </div>

                {/* Level Badge (Top Left) */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <BarChart className="h-3 w-3 text-blue-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{course.level}</span>
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {course.rating}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <Clock className="h-3 w-3" /> {course.duration}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="px-1 flex flex-col gap-1">
                <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-400 truncate max-w-[60%]">
                        {course.instructor}
                    </span>

                    <div className="flex items-center gap-2">
                        {course.originalPrice && (
                            <span className="text-xs text-slate-500 line-through decoration-slate-500 decoration-2">
                                ${course.originalPrice}
                            </span>
                        )}
                        <span className="text-base font-bold text-white bg-blue-600/10 px-2 py-0.5 rounded text-blue-400">
                            ${course.price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
