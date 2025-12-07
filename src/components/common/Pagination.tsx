import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, onPageChange, totalPages = 8 }) => {
  return (
    <div className="flex justify-center items-center gap-3">
      <button 
        className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button className={`w-10 h-10 rounded-xl text-base font-semibold flex items-center justify-center transition-colors ${currentPage === 1 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
        1
      </button>
      <button className="w-10 h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-base font-medium flex items-center justify-center transition-colors">
        2
      </button>
      <button className="w-10 h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-base font-medium flex items-center justify-center transition-colors">
        3
      </button>
      <span className="w-10 h-10 text-slate-400 dark:text-slate-500 flex items-center justify-center text-lg">...</span>
      <button className="w-10 h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-base font-medium flex items-center justify-center transition-colors">
        {totalPages}
      </button>
      
      <button 
        className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
