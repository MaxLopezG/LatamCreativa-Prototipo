
import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { ContentMode } from '../../hooks/useAppStore';

interface ExperienceTimelineProps {
  experience: any[];
  education: any[];
  contentMode: ContentMode;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experience, education, contentMode }) => {
  const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBorder = contentMode === 'dev' ? 'border-blue-500' : 'border-amber-500';

  return (
    <div className="space-y-10">
      {/* Experience Section */}
      <div className="pt-8 border-t border-white/5">
          <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Briefcase className={`h-5 w-5 ${accentText}`} /> Experiencia
          </h3>
          <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
              {experience.map((job) => (
                  <div key={job.id} className="relative">
                      <div className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#030304] border-2 ${accentBorder}`}></div>
                      
                      <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{job.role}</h4>
                      <div className={`text-sm 2xl:text-base ${accentText} font-medium mb-1`}>{job.company}</div>
                      <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">{job.period}</div>
                      
                      <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                          {job.description}
                      </p>
                  </div>
              ))}
          </div>
      </div>

      {/* Education Section */}
      <div className="pt-8 border-t border-white/5">
          <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" /> Educación
          </h3>
          <div className="space-y-4">
              {education.map((edu) => (
                  <div key={edu.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                      <h4 className="text-base 2xl:text-lg font-bold text-white">{edu.school}</h4>
                      <div className="text-sm 2xl:text-base text-slate-300 mb-1">{edu.degree}</div>
                      <div className="text-xs text-slate-500">{edu.period}</div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
