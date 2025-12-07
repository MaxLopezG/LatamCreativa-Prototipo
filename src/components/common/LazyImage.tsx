
import React, { useState, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  wrapperClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-white/5 ${wrapperClassName}`}>
      {/* Skeleton Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-slate-300 dark:bg-white/10" />
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
