
import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, Ticket, Globe, Video } from 'lucide-react';
import { EVENT_ITEMS } from '../../data/content';

interface EventDetailViewProps {
  eventId?: string;
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
  onShare?: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({ eventId, onBack, onAuthorClick, onShare }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = eventId || paramId;
  const event = EVENT_ITEMS.find(e => e.id === id) || EVENT_ITEMS[0];

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in pb-20">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Eventos
        </button>
        <button 
          onClick={onShare}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors"
        >
             <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 md:px-10 py-10">
          
          <div className="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-2xl bg-slate-800">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-4xl">
                  <div className="flex gap-3 mb-4">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-lg shadow-lg">
                          {event.type}
                      </span>
                      {event.location === 'Online' && (
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg shadow-lg flex items-center gap-1">
                              <Video className="h-3 w-3" /> Virtual
                          </span>
                      )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-sm">{event.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-300 text-sm md:text-base">
                      <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-white">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-red-500" />
                          <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-red-500" />
                          <span>{event.location}</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-8 space-y-10">
                  <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      <h3 className="font-bold text-slate-900 dark:text-white">Sobre el evento</h3>
                      <p>{event.description}</p>
                      <p>
                          Este evento es una oportunidad única para conectar con otros artistas y aprender de los líderes de la industria. 
                          Tendremos sesiones de Q&A, revisión de portafolios y mucho más.
                      </p>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/10 pt-8">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Organizado por</h3>
                      <div className="flex items-center gap-4 bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                          <img src={event.organizerAvatar} alt={event.organizer} className="h-16 w-16 rounded-full object-cover" />
                          <div className="flex-1">
                              <button onClick={() => onAuthorClick?.(event.organizer)} className="text-lg font-bold text-slate-900 dark:text-white hover:underline">{event.organizer}</button>
                              <p className="text-sm text-slate-500">Comunidad verificada • 12 Eventos realizados</p>
                          </div>
                          <button className="px-6 py-2 border border-slate-200 dark:border-white/10 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Seguir</button>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Cronograma</h3>
                      <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                              <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5">
                                  <div className="w-20 font-bold text-slate-500 text-sm pt-1">1{i}:00 PM</div>
                                  <div>
                                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Charla Principal: El Futuro del Arte Digital</h4>
                                      <p className="text-sm text-slate-500">Speaker Invitado - Sala A</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                  <div className="sticky top-24">
                      <div className="bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                          <div className="flex justify-between items-end mb-6">
                              <div>
                                  <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">Entrada</span>
                                  <div className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                                      {event.price === 0 ? 'Gratis' : `$${event.price}`}
                                  </div>
                              </div>
                              {event.price > 0 && <span className="text-xs text-slate-400 mb-1">+ tasas</span>}
                          </div>

                          <button className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 mb-4 flex items-center justify-center gap-2">
                              <Ticket className="h-5 w-5" />
                              {event.price === 0 ? 'Registrarse' : 'Comprar Entrada'}
                          </button>

                          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
                              <Users className="h-4 w-4" /> {event.attendees} personas asistirán
                          </div>

                          <div className="border-t border-slate-200 dark:border-white/10 pt-6 space-y-4">
                              <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                                  <div>
                                      <div className="font-bold text-slate-900 dark:text-white text-sm">Ubicación</div>
                                      <p className="text-sm text-slate-500">{event.location}</p>
                                      {event.location === 'Online' && <a href="#" className="text-xs text-blue-500 hover:underline">Ver enlace de stream</a>}
                                  </div>
                              </div>
                              <div className="flex items-start gap-3">
                                  <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                                  <div>
                                      <div className="font-bold text-slate-900 dark:text-white text-sm">Sitio Web</div>
                                      <a href="#" className="text-sm text-blue-500 hover:underline">latamcreativa.com/evento</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
