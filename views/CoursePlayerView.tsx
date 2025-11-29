
import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, CheckCircle, FileText, Download, MessageSquare, ChevronDown, ChevronUp, Menu, Search, Award } from 'lucide-react';
import { EDUCATION_ITEMS } from '../data/content';

interface CoursePlayerViewProps {
  courseId?: string; // Optional for now, defaults to first
  onBack: () => void;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({ courseId, onBack }) => {
  const course = EDUCATION_ITEMS.find(c => c.id === courseId) || EDUCATION_ITEMS[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLecture, setCurrentLecture] = useState('1-1');

  // Mock Curriculum Data for the Player
  const MODULES = [
    {
      id: '1',
      title: 'Introducción y Fundamentos',
      duration: '45 min',
      lectures: [
        { id: '1-1', title: 'Bienvenida al curso', duration: '05:00', completed: true, type: 'video' },
        { id: '1-2', title: 'Interfaz y navegación', duration: '12:20', completed: true, type: 'video' },
        { id: '1-3', title: 'Configurando tu espacio', duration: '08:15', completed: false, type: 'video' },
        { id: '1-4', title: 'Recursos del módulo', duration: 'PDF', completed: false, type: 'resource' }
      ]
    },
    {
      id: '2',
      title: 'Modelado Hard Surface',
      duration: '2h 10m',
      lectures: [
        { id: '2-1', title: 'Blocking inicial', duration: '15:00', completed: false, type: 'video' },
        { id: '2-2', title: 'Técnicas de Bevel', duration: '22:30', completed: false, type: 'video' },
        { id: '2-3', title: 'Booleanos no destructivos', duration: '18:45', completed: false, type: 'video' },
        { id: '2-4', title: 'Limpieza de topología', duration: '25:00', completed: false, type: 'video' }
      ]
    },
    {
      id: '3',
      title: 'Texturizado y Shading',
      duration: '3h 05m',
      lectures: [
        { id: '3-1', title: 'Intro a UV Mapping', duration: '20:00', completed: false, type: 'video' },
        { id: '3-2', title: 'Creando materiales PBR', duration: '45:00', completed: false, type: 'video' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0C] text-white fixed inset-0 z-50 overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-16 bg-[#1C1D1F] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="border-l border-white/10 pl-4">
            <h1 className="font-bold text-sm md:text-base line-clamp-1">{course.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Tu progreso: 15%</span>
           </div>
           <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden hidden md:block">
              <div className="h-full bg-green-500 w-[15%]"></div>
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
        
        {/* Main Content (Video + Tabs) */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative">
           
           {/* Video Player Container */}
           <div className="bg-black w-full aspect-video max-h-[70vh] flex items-center justify-center relative group">
               {/* Mock Video Placeholder */}
               <img src={course.thumbnail} className="w-full h-full object-contain opacity-50" alt="" />
               <button className="absolute inset-0 flex items-center justify-center">
                   <PlayCircle className="h-20 w-20 text-white fill-white/10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               </button>
               
               {/* Video Controls Mock */}
               <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-full">
                       <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer relative">
                           <div className="absolute left-0 top-0 bottom-0 bg-red-600 w-[30%] rounded-full"></div>
                           <div className="absolute left-[30%] top-1/2 -translate-y-1/2 h-3 w-3 bg-red-600 rounded-full"></div>
                       </div>
                       <div className="flex justify-between text-xs font-bold">
                           <span>05:32 / 12:20</span>
                           <span>1080p</span>
                       </div>
                   </div>
               </div>
           </div>

           {/* Content Tabs */}
           <div className="flex-1 bg-[#0A0A0C]">
               <div className="border-b border-white/10 px-6">
                   <div className="flex gap-8">
                       {['overview', 'resources', 'qa'].map((tab) => (
                           <button
                             key={tab}
                             onClick={() => setActiveTab(tab as any)}
                             className={`py-4 text-sm font-bold border-b-2 transition-colors capitalize ${
                                 activeTab === tab ? 'text-amber-500 border-amber-500' : 'text-slate-400 border-transparent hover:text-white'
                             }`}
                           >
                               {tab === 'qa' ? 'Preguntas y Respuestas' : tab === 'overview' ? 'Descripción' : 'Recursos'}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="p-6 md:p-10 max-w-4xl">
                   {activeTab === 'overview' && (
                       <div className="space-y-6 animate-fade-in">
                           <h2 className="text-2xl font-bold">Sobre esta clase</h2>
                           <p className="text-slate-300 leading-relaxed">
                               En esta lección aprenderemos a navegar por la interfaz de usuario de manera eficiente. 
                               Configuraremos los atajos de teclado esenciales y prepararemos nuestro espacio de trabajo para el modelado.
                           </p>
                           <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
                               <img src={course.instructorAvatar} className="h-12 w-12 rounded-full object-cover" alt="" />
                               <div>
                                   <h4 className="font-bold text-white">{course.instructor}</h4>
                                   <p className="text-sm text-slate-400">Instructor Principal</p>
                                   <p className="text-sm text-slate-300 mt-2">
                                       "Recuerden que la organización es clave en proyectos grandes. Tómense el tiempo de configurar sus preferencias ahora."
                                   </p>
                               </div>
                           </div>
                       </div>
                   )}

                   {activeTab === 'resources' && (
                       <div className="space-y-4 animate-fade-in">
                           <h2 className="text-xl font-bold mb-4">Archivos descargables</h2>
                           {[
                               { name: 'Cheat Sheet de Atajos.pdf', size: '1.2 MB' },
                               { name: 'Escena Inicial.blend', size: '45 MB' },
                               { name: 'Referencias.zip', size: '120 MB' }
                           ].map((file, i) => (
                               <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                   <div className="flex items-center gap-3">
                                       <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                           <FileText className="h-5 w-5" />
                                       </div>
                                       <div>
                                           <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{file.name}</h4>
                                           <span className="text-xs text-slate-500">{file.size}</span>
                                       </div>
                                   </div>
                                   <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                                       <Download className="h-5 w-5" />
                                   </button>
                               </div>
                           ))}
                       </div>
                   )}

                   {activeTab === 'qa' && (
                       <div className="space-y-6 animate-fade-in">
                           <div className="flex gap-4">
                               <input type="text" placeholder="Buscar preguntas..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500" />
                               <button className="bg-amber-500 text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-amber-400">Nueva Pregunta</button>
                           </div>
                           
                           <div className="space-y-4">
                               {[1, 2].map((q) => (
                                   <div key={q} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                       <div className="flex items-start gap-3 mb-2">
                                           <img src={`https://ui-avatars.com/api/?name=Student+${q}&background=random`} className="h-8 w-8 rounded-full" alt="" />
                                           <div>
                                               <h4 className="font-bold text-sm text-white">¿Cómo activo el modo rayos X?</h4>
                                               <span className="text-xs text-slate-500">Hace 2 días</span>
                                           </div>
                                       </div>
                                       <p className="text-sm text-slate-300 ml-11 mb-3">No encuentro el atajo que mencionaste en el minuto 4:20.</p>
                                       <div className="ml-11 flex items-center gap-4 text-xs font-bold text-slate-500">
                                           <button className="flex items-center gap-1 hover:text-white"><MessageSquare className="h-3 w-3" /> 2 Respuestas</button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
           </div>
        </div>

        {/* Sidebar (Curriculum) */}
        <div className={`w-96 bg-[#1C1D1F] border-l border-white/10 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-40'}`}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-sm">Contenido del Curso</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><ArrowLeft className="h-5 w-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {MODULES.map((module) => (
                    <div key={module.id} className="border-b border-white/5">
                        <div className="bg-[#1C1D1F] p-4 sticky top-0 z-10 flex justify-between items-center cursor-pointer hover:bg-white/5">
                            <div>
                                <h4 className="font-bold text-sm text-white mb-1">{module.title}</h4>
                                <span className="text-xs text-slate-500">{module.lectures.length} clases • {module.duration}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="bg-[#0A0A0C]">
                            {module.lectures.map((lecture) => (
                                <div 
                                    key={lecture.id}
                                    onClick={() => setCurrentLecture(lecture.id)}
                                    className={`p-3 pl-4 flex gap-3 cursor-pointer border-l-4 transition-colors ${
                                        currentLecture === lecture.id 
                                        ? 'bg-white/10 border-amber-500' 
                                        : 'border-transparent hover:bg-white/5'
                                    }`}
                                >
                                    <div className="mt-0.5">
                                        {lecture.completed ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
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

      </div>
    </div>
  );
};
