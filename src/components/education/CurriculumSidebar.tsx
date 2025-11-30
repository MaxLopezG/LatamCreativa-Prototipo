
import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ContentMode } from '../../hooks/useAppStore';

interface CurriculumSidebarProps {
  modules: any[];
  isOpen: boolean;
  onClose: () => void;
  contentMode: ContentMode;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({ modules, isOpen, onClose, contentMode }) => {
  const [currentLecture, setCurrentLecture] = useState('1-1');
  const accentBorder = contentMode === 'dev' ? 'border-blue-500' : 'border-amber-500';
  const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-green-500';

  return (
    <div className={`w-96 bg-[#1C1D1F] border-l border-white/10 flex flex-col transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-40'}`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Contenido</h3>
            <button onClick={onClose} className="md:hidden text-slate-400"><ArrowLeft className="h-5 w-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {modules.map((module) => (
                <div key={module.id} className="border-b border-white/5">
                    <div className="bg-[#1C1D1F] p-4 sticky top-0 z-10 flex justify-between items-center cursor-pointer hover:bg-white/5">
                        <div>
                            <h4 className="font-bold text-sm text-white mb-1">{module.title}</h4>
                            <span className="text-xs text-slate-500">{module.lectures.length} clases • {module.duration}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="bg-[#0A0A0C]">
                        {module.lectures.map((lecture: any) => (
                            <div 
                                key={lecture.id}
                                onClick={() => setCurrentLecture(lecture.id)}
                                className={`p-3 pl-4 flex gap-3 cursor-pointer border-l-4 transition-colors ${
                                    currentLecture === lecture.id 
                                    ? `bg-white/10 ${accentBorder}` 
                                    : 'border-transparent hover:bg-white/5'
                                }`}
                            >
                                <div className="mt-0.5">
                                    {lecture.completed ? (
                                        <CheckCircle className={`h-4 w-4 ${accentText}`} />
                                    ) : lecture.type === 'video' ? (
                                        <PlayCircle className={`h-4 w-4 ${currentLecture === lecture.id ? 'text-white' : 'text-slate-500'}`} />
                                    ) : (
                                        <FileText className="h-4 w-4 text-slate-500" />
                                    )}
                                </div>
                                <div>
                                    <h5 className={`text-sm mb-0.5 ${currentLecture === lecture.id ? 'text-white font-bold' : 'text-slate-300'}`}>
                                        {lecture.title}
                                    </h5>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        {lecture.type === 'video' ? <PlayCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                        {lecture.duration}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
