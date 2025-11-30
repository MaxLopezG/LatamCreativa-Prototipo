
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Menu, FileText, Download, MessageSquare } from 'lucide-react';
import { EDUCATION_ITEMS } from '../data/content';
import { VideoPlayer } from '../components/education/VideoPlayer';
import { CurriculumSidebar } from '../components/education/CurriculumSidebar';
import { useAppStore } from '../hooks/useAppStore';

interface CoursePlayerViewProps {
  courseId?: string;
  onBack?: () => void;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({ courseId: propCourseId, onBack }) => {
  const { courseId: paramCourseId } = useParams();
  const navigate = useNavigate();
  const { state } = useAppStore();
  
  const courseId = propCourseId || paramCourseId;
  const course = EDUCATION_ITEMS.find(c => c.id === courseId) || EDUCATION_ITEMS[0];
  
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const contentMode = state.contentMode;
  const accentText = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBorder = contentMode === 'dev' ? 'border-blue-500' : 'border-amber-500';
  const accentBg = contentMode === 'dev' ? 'bg-blue-500' : 'bg-green-500'; // Progress bar

  const MODULES = [
    {
      id: '1',
      title: 'Introducción',
      duration: '45 min',
      lectures: [
        { id: '1-1', title: 'Bienvenida', duration: '05:00', completed: true, type: 'video' },
        { id: '1-2', title: 'Setup', duration: '12:20', completed: true, type: 'video' }
      ]
    },
    {
      id: '2',
      title: 'Conceptos Avanzados',
      duration: '2h',
      lectures: [
        { id: '2-1', title: 'Deep Dive', duration: '15:00', completed: false, type: 'video' }
      ]
    }
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/education');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0C] text-white fixed inset-0 z-50 overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-16 bg-[#1C1D1F] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="border-l border-white/10 pl-4">
            <h1 className="font-bold text-sm md:text-base line-clamp-1">{course.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
              <Award className={`h-4 w-4 ${accentText}`} />
              <span>Tu progreso: 15%</span>
           </div>
           <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden hidden md:block">
              <div className={`h-full ${accentBg} w-[15%]`}></div>
           </div>
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/10"
           >
             <Menu className="h-5 w-5" />
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative">
           
           <VideoPlayer thumbnail={course.thumbnail} contentMode={contentMode} />

           <div className="flex-1 bg-[#0A0A0C]">
               <div className="border-b border-white/10 px-6">
                   <div className="flex gap-8">
                       {['overview', 'resources', 'qa'].map((tab) => (
                           <button
                             key={tab}
                             onClick={() => setActiveTab(tab as any)}
                             className={`py-4 text-sm font-bold border-b-2 transition-colors capitalize ${
                                 activeTab === tab ? `${accentText} ${accentBorder}` : 'text-slate-400 border-transparent hover:text-white'
                             }`}
                           >
                               {tab === 'qa' ? 'Preguntas' : tab === 'overview' ? 'Descripción' : 'Recursos'}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="p-6 md:p-10 max-w-4xl">
                   {activeTab === 'overview' && (
                       <div className="space-y-6 animate-fade-in">
                           <h2 className="text-2xl font-bold">Sobre esta clase</h2>
                           <p className="text-slate-300 leading-relaxed">
                               En esta lección aprenderemos los fundamentos esenciales.
                           </p>
                           <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
                               <img src={course.instructorAvatar} className="h-12 w-12 rounded-full object-cover" alt="" />
                               <div>
                                   <h4 className="font-bold text-white">{course.instructor}</h4>
                                   <p className="text-sm text-slate-400">Instructor</p>
                               </div>
                           </div>
                       </div>
                   )}
                   {activeTab === 'resources' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 ${contentMode === 'dev' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'} rounded-lg`}>
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Archivos del curso.zip</h4>
                                        <span className="text-xs text-slate-500">120 MB</span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                                    <Download className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                   )}
                   {activeTab === 'qa' && (
                       <div className="text-center py-10 text-slate-500">
                           <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                           <p>No hay preguntas aún.</p>
                       </div>
                   )}
               </div>
           </div>
        </div>

        <CurriculumSidebar 
            modules={MODULES} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            contentMode={contentMode}
        />

      </div>
    </div>
  );
};
