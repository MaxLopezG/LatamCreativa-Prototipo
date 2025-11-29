
import React from 'react';
import { Star, Clock } from 'lucide-react';
import { FreelanceServiceItem } from '../../types';

interface ServiceCardProps {
  service: FreelanceServiceItem;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={service.thumbnail} 
          alt={service.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Level Badge Overlay */}
        <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-lg border backdrop-blur-md ${
                service.sellerLevel === 'Top Rated' 
                ? 'bg-amber-500 text-white border-amber-400' 
                : 'bg-black/60 text-white border-white/20'
            }`}>
                {service.sellerLevel}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-3 mb-3">
            <img src={service.sellerAvatar} alt={service.seller} className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline">{service.seller}</span>
        </div>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mb-3 group-hover:text-amber-500 transition-colors leading-snug">
            {service.title}
        </h3>
        
        <div className="flex items-center gap-1 mb-4">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">{service.rating}</span>
            <span className="text-xs text-slate-500">({service.reviewCount})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {service.deliveryTime}
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">A partir de</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">${service.startingPrice}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
