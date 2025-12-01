
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageSquare, Briefcase, UserPlus, CheckCircle2, Maximize2, X } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../data/content';

interface PortfolioPostViewProps {
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
}

export const PortfolioPostView: React.FC<PortfolioPostViewProps> = ({ onBack, onAuthorClick }) => {
  const { id } = useParams<{ id: string }>();
  const item = PORTFOLIO_ITEMS.find(p => p.id === id) || PORTFOLIO_ITEMS[0];
  const relatedItems = PORTFOLIO_ITEMS.filter(p => p.id !== id && p.category === item.category).slice(0, 4);

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const projectImages = item.images && item.images.length > 0 
    ? item.images 
    : [
        item.image, 
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1600&auto=format&fit=crop'
      ];

  const softwares = item.software && item.software.length > 0
    ? item.software.map(s => ({ name: s, color: 'bg-slate-200 dark:bg-white/10' }))
    : [
        { name: 'Blender', color: 'bg-orange-500' },
        { name: 'Substance Painter', color: 'bg-green-500' },
        { name: 'Photoshop', color: 'bg-blue-500' }
      ];

  return (
    <div className="max-w-[1800px] mx-auto animate-fade-in pb-20 relative">
      
      {lightboxImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightboxImage(null)}>
            <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <X className="h-8 w-8" />
            </button>
            <img src={lightboxImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}

      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{item.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
               <span>por <button onClick={() => onAuthorClick?.(item.artist)} className="text-slate-900 dark:text-white font-medium hover:text-amber-500 hover:underline">{item.artist}</button></span>
               <span>•</span>
               <span className="text-amber-500">{item.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
             onClick={() => setIsLiked(!isLiked)}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
               isLiked 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
             }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isLiked ? 'Te gusta' : 'Me gusta'}</span>
          </button>
          
          <button className="p-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-10 py-8">
        <div className="lg:col-span-9 space-y-8">
          <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-slate-900">
             <img 
                src={projectImages[0]} 
                alt="Main View" 
                className="w-full h-auto block" 
                onClick={() => setLightboxImage(projectImages[0])}
             />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                 <button className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 pointer-events-auto font-medium">
                     <Maximize2 className="h-4 w-4" /> Ampliar
                 </button>
             </div>
          </div>

          <div className="py-6 border-b border-slate-200 dark:border-white/10">
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sobre el proyecto</h3>
             <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
               <p>
                 {item.description || "Este proyecto es una exploración personal utilizando nuevas técnicas de modelado y texturizado. El objetivo era lograr un acabado de alta calidad optimizado para renderizado en tiempo real."}
               </p>
             </div>
          </div>

          {projectImages.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectImages.slice(1).map((img, index) => (
                  <div 
                      key={index} 
                      className={`relative group rounded-xl overflow-hidden cursor-zoom-in bg-slate-900 shadow-lg ${projectImages.length === 3 && index === 1 ? 'md:col-span-2' : ''}`}
                      onClick={() => setLightboxImage(img)}
                  >
                    <img src={img} alt={`Detail ${index + 1}`} className="w-full h-full object-cover min-h-[300px]" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white">
                            <Maximize2 className="h-5 w-5" />
                        </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="pt-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Comentarios
            </h3>
            <div className="flex gap-4 mb-8">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop" alt="Me" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                   <textarea 
                     className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white text-base focus:outline-none focus:border-amber-500 transition-colors resize-none"
                     placeholder="Deja un comentario constructivo..."
                     rows={3}
                   ></textarea>
                   <div className="flex justify-end mt-2">
                      <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity">Publicar</button>
                   </div>
                </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-3 space-y-6">
            <div className="sticky top-24">
                
                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none mb-6">
                    <div className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors" onClick={() => onAuthorClick?.(item.artist)}>
                        <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-white/10">
                            <img src={item.artistAvatar} alt={item.artist} className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.artist}</h3>
                                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Senior 3D Artist</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                       <button 
                         onClick={() => setIsFollowing(!isFollowing)}
                         className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isFollowing 
                            ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                         }`}
                       >
                           {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                           {isFollowing ? 'Siguiendo' : 'Seguir'}
                       </button>
                       <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 text-sm font-semibold transition-opacity">
                           <Briefcase className="h-4 w-4" />
                           Contratar
                       </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Estadísticas</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{item.views}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Vistas</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{item.likes}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Likes</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">124</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Coment.</div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Software Usado</h4>
                    <div className="flex flex-wrap gap-2">
                        {softwares.map(soft => (
                            <div key={soft.name} className={`flex items-center gap-2 px-3 py-2 ${soft.color} bg-opacity-20 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5`}>
                                {soft.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                        {[item.category, 'ArtStation', 'Digital Art', 'Render'].map(tag => (
                             <span key={tag} className="px-3 py-1 rounded bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-400 font-medium hover:bg-amber-500/10 hover:text-amber-500 cursor-pointer transition-colors border border-transparent hover:border-amber-500/20">
                                 #{tag}
                             </span>
                        ))}
                    </div>
                </div>

                 <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Más del artista</h4>
                        <button onClick={() => onAuthorClick?.(item.artist)} className="text-xs text-amber-500 hover:text-amber-400 font-bold">Ver todo</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {relatedItems.map(rel => (
                            <div key={rel.id} onClick={() => {}} className="aspect-square rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-slate-200 dark:border-white/5">
                                <img src={rel.image} alt={rel.title} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0A0A0C] border-t border-slate-200 dark:border-white/10 p-4 lg:hidden flex items-center justify-between z-40 safe-area-pb">
           <div className="flex items-center gap-4">
               <button className="flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors">
                   <Heart className="h-6 w-6" />
                   <span className="text-[10px] mt-1 font-bold">{item.likes}</span>
               </button>
               <button className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                   <MessageSquare className="h-6 w-6" />
                   <span className="text-[10px] mt-1 font-bold">124</span>
               </button>
           </div>
           <button className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20">Contratar</button>
      </div>
    </div>
  );
};
