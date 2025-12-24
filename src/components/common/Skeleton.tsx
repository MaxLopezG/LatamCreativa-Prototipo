
import React from 'react';

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton component with shimmer animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div
        className={`bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-shimmer rounded-lg ${className}`}
        style={{ backgroundSize: '2000px 100%' }}
    />
);

/**
 * Portfolio card skeleton for loading states in grid views
 */
export const PortfolioCardSkeleton: React.FC = () => (
    <div className="rounded-2xl overflow-hidden bg-[#0A0A0C] border border-white/5">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    </div>
);

/**
 * Blog card skeleton for loading states in blog views
 */
export const BlogCardSkeleton: React.FC = () => (
    <div className="rounded-2xl overflow-hidden bg-[#0A0A0C] border border-white/5">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Grid of portfolio skeletons
 */
export const PortfolioGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {Array.from({ length: count }).map((_, i) => (
            <PortfolioCardSkeleton key={i} />
        ))}
    </div>
);

/**
 * Grid of blog skeletons
 */
export const BlogGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <BlogCardSkeleton key={i} />
        ))}
    </div>
);

/**
 * User profile header skeleton
 */
export const ProfileHeaderSkeleton: React.FC = () => (
    <div className="relative">
        <Skeleton className="h-48 md:h-64 w-full rounded-none" />
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-[#030304]" />
            <div className="mb-4 space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    </div>
);

/**
 * Text content skeleton (for descriptions, etc.)
 */
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
    <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
            />
        ))}
    </div>
);
