
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Target, MessageSquare, Share2, CheckCircle2, Briefcase, Zap, Flag, Layers, Clock } from 'lucide-react';
import { COMMUNITY_GROUPS } from '../data/content';

interface ProjectDetailViewProps {
  projectId?: string;
  onBack?: () => void;
  onAuthorClick?: (authorName: string) => void;
}

const PROJECT_UPDATES = [
  {
    id: 1,
    title: "Primer prototipo de mecánicas",
    date: "Hace 2 días",
    content: "Hemos logrado implementar el sistema básico de movimiento y combate. Aún falta pulir las animaciones, pero la base es sólida.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&fit=crop",
    author: "Alex Dev",
    likes: 12,
    comments: 4
  },
  {
    id: 2,
    title: "Concept Art de entornos finalizado",
    date: "Hace 1 semana",
    content: "Nuestros artistas han terminado los bocetos para la zona industrial. Buscamos transmitir una sensación de abandono tecnológico.",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&fit=crop",
    author: "Sarah Art",
    likes: 24,
    comments: 8
  },
  {
    id: 3,
    title: "Inicio del proyecto",
    date: "Hace 2 semanas",
    content: "¡Damos por iniciado el proyecto! El GDD está listo y estamos reclutando al equipo principal.",
    author: "Alex Dev",
    likes: 45,
    comments: 15
  }
];

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId, onBack, onAuthorClick }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = projectId || paramId;
  const project = COMMUNITY_GROUPS.find(g => g.id === id) || COMMUNITY_GROUPS[0];
  const [activeTab, setActiveTab] = useState<'info' | 'updates'>('info');
  const [isApplying, setIsApplying] = useState(false);

  const openPositions = project.rolesNeeded.map((role, index) => ({
    id: index,
    title: role,
    type: 'Colaboración',
    level: index === 0 ? 'Senior / Lead' : 'Intermedio',
    spots: 1,
    description: 'Buscamos a alguien apasionado que pueda comprometerse 5-10 horas semanales.'
  }));

  const handleBack = () => {
      if (onBack) onBack();
      else window.history.back();
  }

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in pb-20">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Comunidad
        </button>
        <div className="flex items-center gap-3">
           <button className="px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wide border border-purple-500/20">
             {project.status}
           </button>
           <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1"></div>
           <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <Share2 className="h-5 w-5" />
           </button>
           <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <Flag className="h-5 w-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6 md:px-10 py-10">
        
        <div className="lg:col-span-8 space-y-10">
           
           <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-8">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
                          {tag}
                       </span>
                    ))}
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 shadow-sm">{project.name}</h1>
              </div>
           </div>

           <div className="flex items-center gap-8 border-b border-slate-200 dark:border-white/10">
              <button 
                onClick={() => setActiveTab('info')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'info' 
                    ? 'text-purple-500 border-purple-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                  <Target className="h-4 w-4" /> Información
              </button>
              <button 
                onClick={() => setActiveTab('updates')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'updates' 
                    ? 'text-purple-500 border-purple-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                  <Layers className="h-4 w-4" /> Avances <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full ml-1">3</span>
              </button>
           </div>

           {activeTab === 'info' ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                  <div className="md:col-span-2 space-y-8">
                      <section>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Sobre el Proyecto</h2>
                          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                              <p className="text-lg leading-relaxed">{project.description}</p>
                              <p>
                                  Estamos desarrollando este proyecto con el objetivo de participar en la próxima Game Jam Global. 
                                  Buscamos crear una experiencia visual única mezclando estilos 2D y 3D.
                                  Actualmente tenemos el prototipo de las mecánicas principales y necesitamos ayuda con el arte y el pulido.
                              </p>
                          </div>
                      </section>

                      <section>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                              <Briefcase className="h-5 w-5 text-purple-500" /> Roles Disponibles
                          </h2>
                          <div className="space-y-4">
                              {openPositions.map((pos) => (
                                  <div key={pos.id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-5 rounded-xl hover:border-purple-500/50 transition-colors group">
                                      <div className="flex justify-between items-start mb-2">
                                          <div>
                                              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-purple-500 transition-colors">{pos.title}</h3>
                                              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                  <span>{pos.level}</span>
                                                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                                  <span>{pos.type}</span>
                                              </div>
                                          </div>
                                          <button 
                                            onClick={() => setIsApplying(true)}
                                            className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-sm hover:bg-purple-500 hover:text-white transition-colors"
                                          >
                                              Aplicar
                                          </button>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                          {pos.description}
                                      </p>
                                  </div>
                              ))}
                          </div>
                      </section>
                  </div>

                  <div className="space-y-6">
                      <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Líder del Proyecto</h3>
                          <div className="flex items-center gap-4 mb-4">
                              <img src={project.leaderAvatar} alt={project.leader} className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-500/20" />
                              <div>
                                  <button onClick={() => onAuthorClick?.(project.leader)} className="font-bold text-slate-900 dark:text-white hover:underline block">{project.leader}</button>
                                  <span className="text-xs text-slate-500">Creador</span>
                              </div>
                          </div>
                          <button className="w-full py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                              <MessageSquare className="h-4 w-4" /> Contactar
                          </button>
                      </div>

                      <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Equipo Actual</h3>
                          <div className="flex -space-x-3 overflow-hidden py-2 mb-4">
                              {[...Array(project.membersCount)].map((_, i) => (
                                  <img 
                                    key={i}
                                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#030304] object-cover"
                                    src={`https://ui-avatars.com/api/?name=Member+${i}&background=random`}
                                    alt=""
                                  />
                              ))}
                              <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#030304] bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                                  +{project.membersCount}
                              </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Users className="h-4 w-4" />
                              <span>{project.membersCount} miembros activos</span>
                          </div>
                      </div>

                      <div className="bg-purple-500/5 p-6 rounded-2xl border border-purple-500/20">
                          <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4" /> Estado
                          </h3>
                          <p className="text-slate-300 text-sm mb-4">
                              El proyecto está activo y reclutando. Se espera tener un MVP para finales de mes.
                          </p>
                          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                              <span>Progreso</span>
                              <span>35%</span>
                          </div>
                      </div>
                  </div>
               </div>
           ) : (
             <div className="max-w-3xl animate-slide-up space-y-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bitácora de Desarrollo</h2>
                    <button className="text-sm text-purple-500 font-bold hover:underline">Suscribirse a actualizaciones</button>
                </div>
                
                <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-3 space-y-12 pb-8">
                    {PROJECT_UPDATES.map((update) => (
                        <div key={update.id} className="relative pl-8 group">
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-50 dark:bg-[#030304] border-2 border-purple-500 group-hover:scale-125 transition-transform"></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {update.date}
                                </span>
                                <span className="hidden sm:inline text-slate-300">•</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                                    {update.title}
                                </h3>
                            </div>

                            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                                {update.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-slate-900">
                                        <img src={update.image} alt={update.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                        {update.content}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">Publicado por</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{update.author}</span>
                                        </div>
                                        <div className="flex gap-4 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1 hover:text-purple-500 cursor-pointer"><CheckCircle2 className="h-3.5 w-3.5" /> {update.likes} Likes</span>
                                            <span className="flex items-center gap-1 hover:text-purple-500 cursor-pointer"><MessageSquare className="h-3.5 w-3.5" /> {update.comments} Comentarios</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
           )}

        </div>

        <div className="lg:col-span-4">
           <div className="sticky top-24 bg-white dark:bg-[#0A0A0C] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¿Te interesa unirte?</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                   Revisa los roles disponibles y postula. Si no encuentras tu rol, puedes enviar una solicitud general.
               </p>
               
               <button className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 mb-3 flex items-center justify-center gap-2">
                   <Users className="h-5 w-5" /> Unirse al Equipo
               </button>
               <button className="w-full py-4 bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                   Guardar Proyecto
               </button>

               <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                   <div className="flex items-center gap-3 text-xs text-slate-500">
                       <Calendar className="h-4 w-4" />
                       <span>Publicado: {project.postedTime}</span>
                   </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};
