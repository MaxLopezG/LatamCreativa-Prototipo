
import React from 'react';
import { MessageCircleQuestion, Plus, Search, CheckCircle2 } from 'lucide-react';
import { FORUM_ITEMS } from '../data/content';
import { Pagination } from '../components/common/Pagination';

interface ForumViewProps {
  onPostSelect?: (id: string) => void;
  onCreateClick?: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({ onPostSelect, onCreateClick }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center mb-12 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-0 group-hover:saturate-100" 
            alt="Forum Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-950/95 via-orange-900/80 to-orange-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full max-w-4xl py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-orange-500/20 border border-orange-400/30 backdrop-blur-md">
                  <MessageCircleQuestion className="h-3 w-3" /> Foro de Ayuda
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
                  Pregunta, Responde y <br/><span className="text-orange-400">Comparte Conocimiento</span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-xl leading-relaxed drop-shadow-md">
                  La comunidad de Latam Creativa está aquí para resolver tus dudas técnicas y artísticas. Ninguna pregunta es pequeña.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                  <button 
                      onClick={onCreateClick}
                      className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-xl shadow-black/20 flex items-center gap-2"
                  >
                      <Plus className="h-5 w-5" /> Hacer Pregunta
                  </button>
                  <button className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md">
                      Explorar Soluciones
                  </button>
              </div>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main List */}
          <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-4">
                      <button className="text-slate-900 dark:text-white font-bold border-b-2 border-orange-500 pb-1">Recientes</button>
                      <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors pb-1">Más Votados</button>
                      <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors pb-1">Sin Respuesta</button>
                  </div>
                  <div className="relative hidden md:block">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar dudas..." 
                        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-orange-500"
                      />
                  </div>
              </div>

              <div className="space-y-4 mb-8">
                  {FORUM_ITEMS.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => onPostSelect?.(post.id)}
                        className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 rounded-2xl hover:border-orange-500/50 transition-all cursor-pointer group flex gap-6"
                      >
                          {/* Stats Side */}
                          <div className="flex flex-col items-center gap-2 min-w-[60px] text-xs text-slate-500">
                              <div className="font-bold text-slate-700 dark:text-slate-300">{post.votes} votos</div>
                              <div className={`px-2 py-1 rounded-lg border ${post.isSolved ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'border-transparent'}`}>
                                  {post.replies.length} resp.
                              </div>
                              <div>{post.views} vistas</div>
                          </div>

                          {/* Content Side */}
                          <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                                      {post.title}
                                  </h3>
                                  {post.isSolved && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                                  {post.content}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                  <div className="flex gap-2">
                                      {post.tags.map(tag => (
                                          <span key={tag} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                              {tag}
                                          </span>
                                      ))}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <img src={post.authorAvatar} alt={post.author} className="h-5 w-5 rounded-full" />
                                      <span className="text-orange-500">{post.author}</span>
                                      <span>•</span>
                                      <span>{post.date}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              <Pagination currentPage={1} onPageChange={() => {}} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Etiquetas Populares</h3>
                  <div className="flex flex-wrap gap-2">
                      {['Blender', 'Unity', 'C#', 'UV Mapping', 'ZBrush', 'Python', 'Render'].map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-orange-500/10 hover:text-orange-500 text-sm text-slate-600 dark:text-slate-400 transition-colors cursor-pointer border border-slate-200 dark:border-white/5">
                              {tag}
                          </span>
                      ))}
                  </div>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
                  <h3 className="font-bold text-orange-500 mb-2">Reglas del Foro</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                      <li>Sé respetuoso con otros artistas.</li>
                      <li>Busca antes de preguntar.</li>
                      <li>Incluye capturas de pantalla si es posible.</li>
                      <li>Marca la respuesta correcta si te ayudaron.</li>
                  </ul>
              </div>
          </div>

      </div>
    </div>
  );
};
