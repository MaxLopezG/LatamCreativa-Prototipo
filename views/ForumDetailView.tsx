
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { FORUM_ITEMS } from '../data/content';

interface ForumDetailViewProps {
  postId?: string;
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
}

export const ForumDetailView: React.FC<ForumDetailViewProps> = ({ postId, onBack, onAuthorClick }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = postId || paramId;
  const post = FORUM_ITEMS.find(p => p.id === id) || FORUM_ITEMS[0];
  const [replyText, setReplyText] = useState('');

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 animate-fade-in pb-24">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] -mx-6 px-6 h-16 flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Foro
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-9">
              <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{post.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-500 border-b border-slate-200 dark:border-white/10 pb-6">
                      <span>Publicado {post.date}</span>
                      <span>Visto {post.views} veces</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium">{post.category}</span>
                  </div>
              </div>

              <div className="flex gap-6 mb-12">
                  <div className="flex flex-col items-center gap-2">
                      <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-orange-500 transition-colors">
                          <ArrowUp className="h-8 w-8" />
                      </button>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{post.votes}</span>
                      <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-orange-500 transition-colors">
                          <ArrowDown className="h-8 w-8" />
                      </button>
                  </div>

                  <div className="flex-1">
                      <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                          <p>{post.content}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                          {post.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
                                  {tag}
                              </span>
                          ))}
                      </div>

                      <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                              <button className="text-slate-500 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">Compartir</button>
                              <button className="text-slate-500 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">Reportar</button>
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl flex items-center gap-3 min-w-[200px]">
                              <img src={post.authorAvatar} alt={post.author} className="h-10 w-10 rounded-lg object-cover" />
                              <div>
                                  <div className="text-xs text-slate-500 mb-0.5">Preguntado por</div>
                                  <button onClick={() => onAuthorClick?.(post.author)} className="text-sm font-bold text-blue-500 hover:underline">{post.author}</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{post.replies.length} Respuestas</h3>
                  
                  <div className="space-y-8">
                      {post.replies.map(reply => (
                          <div key={reply.id} className={`flex gap-6 p-6 rounded-2xl border ${reply.isSolution ? 'bg-green-500/5 border-green-500/30' : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10'}`}>
                              <div className="flex flex-col items-center gap-2">
                                  <button className="p-1 hover:text-orange-500 text-slate-400"><ArrowUp className="h-6 w-6" /></button>
                                  <span className="font-bold text-slate-700 dark:text-slate-300">{reply.votes}</span>
                                  <button className="p-1 hover:text-orange-500 text-slate-400"><ArrowDown className="h-6 w-6" /></button>
                                  {reply.isSolution && (
                                      <div className="mt-2 text-green-500">
                                          <Check className="h-8 w-8" />
                                      </div>
                                  )}
                              </div>
                              <div className="flex-1">
                                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{reply.content}</p>
                                  <div className="flex items-center justify-end gap-3">
                                      <span className="text-xs text-slate-500">Respondido {reply.date}</span>
                                      <div className="flex items-center gap-2">
                                          <img src={reply.authorAvatar} alt={reply.author} className="h-6 w-6 rounded-full" />
                                          <button onClick={() => onAuthorClick?.(reply.author)} className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:underline">{reply.author}</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tu Respuesta</h3>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    placeholder="Escribe tu solución aquí..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors resize-none mb-4"
                  ></textarea>
                  <button className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                      Publicar Respuesta
                  </button>
              </div>

          </div>

          <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Estadísticas</h3>
                      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between">
                              <span>Preguntado</span>
                              <span className="text-slate-900 dark:text-white">{post.date}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Vistas</span>
                              <span className="text-slate-900 dark:text-white">{post.views}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Activo</span>
                              <span className="text-slate-900 dark:text-white">Hoy</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};
