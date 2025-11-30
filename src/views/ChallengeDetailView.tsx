
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Trophy, Target, AlertCircle, Share2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { CHALLENGE_ITEMS, PORTFOLIO_ITEMS } from '../data/content';
import { PortfolioCard } from '../components/cards/PortfolioCard';

interface ChallengeDetailViewProps {
  challengeId?: string;
  onBack: () => void;
}

export const ChallengeDetailView: React.FC<ChallengeDetailViewProps> = ({ challengeId, onBack }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = challengeId || paramId;
  const challenge = CHALLENGE_ITEMS.find(c => c.id === id) || CHALLENGE_ITEMS[0];
  const [activeTab, setActiveTab] = useState<'brief' | 'entries'>('brief');

  const entries = PORTFOLIO_ITEMS.slice(0, 8);

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in pb-20">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Retos
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 md:px-10 py-8">
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 min-h-[400px] flex items-end">
              <img src={challenge.coverImage} alt={challenge.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/60 to-transparent"></div>
              
              <div className="relative z-10 p-8 md:p-12 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="max-w-3xl">
                          <div className="flex items-center gap-3 mb-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                  challenge.status === 'Active' ? 'bg-green-500 text-black' : 
                                  challenge.status === 'Voting' ? 'bg-amber-500 text-black' : 'bg-slate-500 text-white'
                              }`}>
                                  {challenge.status === 'Active' ? 'En curso' : challenge.status}
                              </span>
                              {challenge.sponsor && (
                                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                      <span className="text-xs text-slate-300 uppercase font-bold">Patrocinado por</span>
                                      <img src={challenge.sponsorLogo} alt={challenge.sponsor} className="h-4 w-4 rounded-full" />
                                      <span className="text-xs font-bold text-white">{challenge.sponsor}</span>
                                  </div>
                              )}
                          </div>
                          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight font-display">{challenge.title}</h1>
                          <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium">
                              <div className="flex items-center gap-2">
                                  <Clock className="h-5 w-5 text-amber-500" />
                                  <span>Quedan {challenge.daysLeft} días</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Users className="h-5 w-5 text-blue-500" />
                                  <span>{challenge.participants} participantes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Trophy className="h-5 w-5 text-purple-500" />
                                  <span>{challenge.prizes.length} premios</span>
                              </div>
                          </div>
                      </div>

                      <button className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-colors shadow-xl shadow-amber-500/20 flex items-center gap-2 transform hover:scale-105 duration-200">
                          <UploadCloud className="h-5 w-5" />
                          Enviar Entrada
                      </button>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-8">
                  
                  <div className="flex items-center gap-8 border-b border-slate-200 dark:border-white/10 mb-8">
                      <button 
                        onClick={() => setActiveTab('brief')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'brief' 
                            ? 'text-amber-500 border-amber-500' 
                            : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                          <Target className="h-4 w-4" /> Brief & Reglas
                      </button>
                      <button 
                        onClick={() => setActiveTab('entries')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'entries' 
                            ? 'text-amber-500 border-amber-500' 
                            : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                          <ImageIcon className="h-4 w-4" /> Entradas <span className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full ml-1 text-slate-500">{entries.length}</span>
                      </button>
                  </div>

                  {activeTab === 'brief' ? (
                      <div className="space-y-10 animate-fade-in">
                          <section className="prose prose-slate dark:prose-invert max-w-none">
                              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">El Desafío</h2>
                              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                                  {challenge.description}
                              </p>
                              <p className="text-slate-600 dark:text-slate-300">
                                  Queremos ver cómo imaginas el futuro. Tu tarea es crear una escena renderizada en 3D que capture la esencia de una metrópolis cyberpunk, 
                                  pero con tu propio giro artístico. No te limites a los clichés de neón; piensa en la arquitectura, la decadencia, la tecnología y la vida cotidiana.
                              </p>
                              
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Requisitos de entrega</h3>
                              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                                  <li>Imagen final renderizada en al menos 1920x1080px.</li>
                                  <li>Al menos 2 imágenes del proceso (wireframe, clay render, bocetos).</li>
                                  <li>Breve descripción del concepto y software utilizado.</li>
                                  <li>No se permite el uso de IA generativa para la imagen final.</li>
                              </ul>
                          </section>

                          <section>
                              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                  <Trophy className="h-6 w-6 text-purple-500" /> Premios
                              </h2>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                      <div className="h-16 w-16 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-amber-500/30">1</div>
                                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1er Lugar</h3>
                                      <p className="text-amber-600 dark:text-amber-400 font-medium">{challenge.prizes[0]}</p>
                                      <p className="text-xs text-slate-500 mt-2">+ Badge de Ganador</p>
                                  </div>
                                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center text-center hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                                      <div className="h-12 w-12 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-900 dark:text-white text-xl font-bold mb-4">2</div>
                                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2do Lugar</h3>
                                      <p className="text-slate-600 dark:text-slate-400 font-medium">{challenge.prizes[1]}</p>
                                  </div>
                                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center text-center hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                                      <div className="h-12 w-12 bg-orange-800/50 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
                                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3er Lugar</h3>
                                      <p className="text-slate-600 dark:text-slate-400 font-medium">{challenge.prizes[2]}</p>
                                  </div>
                              </div>
                          </section>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                          {entries.map(entry => (
                              <PortfolioCard key={entry.id} item={entry} onClick={() => {}} />
                          ))}
                      </div>
                  )}

              </div>

              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Fechas Importantes</h3>
                      <div className="space-y-4 relative border-l-2 border-slate-200 dark:border-white/10 ml-2 pl-6 pb-2">
                          <div className="relative">
                              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-green-500"></div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Inicio</h4>
                              <p className="text-xs text-slate-500">01 Nov, 2024</p>
                          </div>
                          <div className="relative">
                              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cierre de Entregas</h4>
                              <p className="text-xs text-slate-500">{challenge.deadline}</p>
                          </div>
                          <div className="relative">
                              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-slate-300 dark:bg-white/20"></div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Anuncio de Ganadores</h4>
                              <p className="text-xs text-slate-500">10 Dic, 2024</p>
                          </div>
                      </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
                      <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                              <h3 className="font-bold text-blue-500 text-sm mb-1">¿Dudas sobre el reto?</h3>
                              <p className="text-xs text-slate-400 mb-3">Únete al canal oficial de Discord para preguntar a los organizadores y compartir tu progreso.</p>
                              <button className="text-xs font-bold text-blue-400 hover:text-blue-300 underline">Ir al Foro de Discusión</button>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
