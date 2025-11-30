
import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Briefcase, Share2, Globe, ExternalLink } from 'lucide-react';
import { JOB_ITEMS } from '../data/content';

interface JobDetailViewProps {
  onBack: () => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({ onBack }) => {
  const { id } = useParams<{ id: string }>();
  const job = JOB_ITEMS.find(j => j.id === id) || JOB_ITEMS[0];

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in pb-20">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Empleos
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 md:px-10 py-10">
          
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0 border border-slate-200 dark:border-transparent">
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{job.title}</h1>
                          {job.isFeatured && (
                              <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold uppercase rounded-full">Destacado</span>
                          )}
                      </div>
                      <div className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-6 flex items-center gap-2">
                          <Building2 className="h-5 w-5" /> {job.company}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                              <Briefcase className="h-4 w-4 text-blue-500" />
                              <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span>{job.salary || 'Salario Competitivo'}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span>Publicado {job.postedAt}</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                      <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                          Aplicar Ahora
                      </button>
                      <button className="w-full py-3 bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          Guardar
                      </button>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              <div className="lg:col-span-8 space-y-8">
                  <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Descripción del Puesto</h3>
                      <p>
                          Estamos buscando un {job.title} talentoso y apasionado para unirse a nuestro equipo en {job.company}. 
                          En este rol, trabajarás estrechamente con el equipo de arte y diseño para crear experiencias visuales impactantes.
                      </p>
                      <p>
                          Buscamos a alguien con un fuerte sentido de la composición, color y narrativa visual, capaz de adaptarse a diferentes estilos artísticos.
                      </p>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Responsabilidades</h3>
                      <ul className="list-disc pl-5 space-y-2">
                          <li>Colaborar con directores de arte para definir el estilo visual.</li>
                          <li>Crear assets 3D de alta calidad optimizados para el motor del juego.</li>
                          <li>Participar en revisiones de arte y dar feedback constructivo.</li>
                          <li>Mentorear a artistas junior y ayudar a mejorar el pipeline.</li>
                      </ul>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Requisitos</h3>
                      <ul className="list-disc pl-5 space-y-2">
                          <li>+3 años de experiencia en la industria de videojuegos o cine.</li>
                          <li>Dominio de herramientas como Maya, Blender, ZBrush o Substance.</li>
                          <li>Experiencia con motores de juego (Unreal Engine 5 o Unity).</li>
                          <li>Portafolio demostrando habilidades en el área solicitada.</li>
                      </ul>
                  </div>

                  <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Habilidades Requeridas</h3>
                      <div className="flex flex-wrap gap-2">
                          {job.tags.map(tag => (
                              <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-6">Sobre la Empresa</h3>
                      
                      <div className="flex items-center gap-4 mb-6">
                          <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-slate-100" />
                          <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{job.company}</h4>
                              <a href="#" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                  Visitar sitio web <ExternalLink className="h-3 w-3" />
                              </a>
                          </div>
                      </div>

                      <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 mb-6">
                          <p>
                              Líderes en el desarrollo de experiencias interactivas y videojuegos AAA. 
                              Nos enfocamos en la innovación y la calidad artística.
                          </p>
                          <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-400" />
                              <span>{job.location.includes('Remoto') ? 'Global / Remoto' : job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Share2 className="h-4 w-4 text-slate-400" />
                              <span>500-1000 empleados</span>
                          </div>
                      </div>

                      <button className="w-full py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          Seguir Empresa
                      </button>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
