
import React from 'react';
import { MapPin, Briefcase, Clock, Building2 } from 'lucide-react';
import { JobItem } from '../../types';

interface JobCardProps {
  job: JobItem;
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl border transition-all cursor-pointer ${
          job.isFeatured 
          ? 'bg-slate-900/50 dark:bg-white/[0.03] border-amber-500/30 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10' 
          : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
      }`}
    >
      <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-1">
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
          </div>
      </div>
      
      <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{job.title}</h3>
              {job.isFeatured && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black w-fit">Destacado</span>
              )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">
              <Building2 className="h-4 w-4" /> {job.company}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
              </div>
              <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {job.type} • {job.level}
              </div>
              <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {job.postedAt}
              </div>
          </div>
      </div>

      <div className="flex flex-col items-end gap-3 min-w-[140px]">
          <div className="flex flex-wrap justify-end gap-2">
              {job.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {tag}
                  </span>
              ))}
          </div>
          <button className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg w-full md:w-auto">
              Aplicar
          </button>
      </div>
    </div>
  );
};
