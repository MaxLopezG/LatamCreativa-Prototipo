
import React from 'react';
import { MessageCircleQuestion, Plus, Search, MessageSquare, Eye, ArrowUp, CheckCircle2 } from 'lucide-react';
import { FORUM_ITEMS } from '../data/content';
import { Pagination } from '../components/common/Pagination';

interface ForumViewProps {
  onPostSelect?: (id: string) => void;
  onCreateClick?: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({ onPostSelect, onCreateClick }) => {
  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-orange-900 to-red-900 p-8 mb-10 overflow-hidden shadow-2xl shadow-orange-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20">
                    <MessageCircleQuestion className="h-4 w-4" /> Foro de Ayuda
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Pregunta, Responde, Aprende</h2>
                <p className="text-orange-100 text-lg">La comunidad está aquí para ayudarte con tus dudas técnicas y artísticas.</p>
             </div>
             <button 
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 bg-white text-orange-900 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
             >
                <Plus className="h-5 w-5" /> Hacer Pregunta
             </button>
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