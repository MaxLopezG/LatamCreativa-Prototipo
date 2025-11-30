
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShieldCheck, Download, Layers, ShoppingCart, Maximize2, Bookmark, MessageSquare, ThumbsUp, Box, Rotate3d } from 'lucide-react';
import { ASSET_ITEMS } from '../data/content';
import { CartItem } from '../types';

interface AssetDetailViewProps {
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
  onAddToCart?: (item: CartItem) => void;
  onBuyNow?: (item: CartItem) => void;
  onSave?: (id: string, image: string) => void;
}

export const AssetDetailView: React.FC<AssetDetailViewProps> = ({ onBack, onAuthorClick, onAddToCart, onBuyNow, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const asset = ASSET_ITEMS.find(a => a.id === id) || ASSET_ITEMS[0];
  const [activeImage, setActiveImage] = useState(asset.images[0]);
  const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
  const [rotation, setRotation] = useState(0);

  const itemPayload: CartItem = {
      id: asset.id,
      title: asset.title,
      price: asset.price,
      thumbnail: asset.thumbnail,
      type: 'asset'
  };

  const handleAddToCart = () => {
    onAddToCart?.(itemPayload);
  };

  const handleBuyNow = () => {
    onBuyNow?.(itemPayload);
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in pb-20">
      
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la Tienda
        </button>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => onSave?.(asset.id, asset.thumbnail)}
             className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
             title="Guardar"
           >
             <Bookmark className="h-5 w-5" />
           </button>
           <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <Heart className="h-5 w-5" />
           </button>
           <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
             <Share2 className="h-5 w-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6 md:px-10 py-10">
        
        <div className="lg:col-span-8 space-y-10">
           
           <div className="space-y-4">
              
              <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden group border border-slate-200 dark:border-white/5 shadow-inner">
                 
                 {viewMode === 'gallery' ? (
                     <>
                        <img src={activeImage} alt={asset.title} className="w-full h-full object-cover transition-opacity duration-300" />
                        <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="h-5 w-5" />
                        </button>
                     </>
                 ) : (
                     <div className="w-full h-full bg-[#1A1A1C] flex items-center justify-center relative cursor-move overflow-hidden">
                         <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                             backgroundSize: '40px 40px',
                             transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
                         }}></div>
                         
                         <div className="relative z-10 transition-transform duration-100 ease-out" style={{ transform: `rotateY(${rotation}deg)` }}>
                             <img src={asset.thumbnail} alt="3D Model" className="max-h-[300px] object-contain drop-shadow-2xl" />
                         </div>

                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full px-6 py-2 flex items-center gap-6 border border-white/10">
                             <Rotate3d className="h-5 w-5 text-white animate-spin-slow" />
                             <input 
                                type="range" 
                                min="0" max="360" 
                                value={rotation} 
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                className="w-48 accent-amber-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                             />
                             <div className="text-xs font-mono text-slate-300 w-12 text-center">{rotation}°</div>
                         </div>

                         <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest pointer-events-none select-none">
                             Interactive 3D Preview
                         </div>
                     </div>
                 )}

                 <div className="absolute bottom-4 right-4 flex bg-black/70 backdrop-blur-md rounded-xl p-1 border border-white/10">
                     <button 
                        onClick={() => setViewMode('gallery')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
                            viewMode === 'gallery' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                        }`}
                     >
                         <Layers className="h-3 w-3" /> Galería
                     </button>
                     <button 
                        onClick={() => setViewMode('3d')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
                            viewMode === '3d' ? 'bg-amber-500 text-white' : 'text-white hover:bg-white/10'
                        }`}
                     >
                         <Box className="h-3 w-3" /> Vista 3D
                     </button>
                 </div>
              </div>
              
              {viewMode === 'gallery' && (
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                     {asset.images.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`w-32 aspect-video rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                                activeImage === img ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                           <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
              )}
           </div>

           <div className="bg-white dark:bg-white/[0.02] p-8 rounded-2xl border border-slate-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Descripción</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                 <p>{asset.description}</p>
                 <p>
                    Ideal para proyectos de visualización arquitectónica o videojuegos en tiempo real.
                    Todos los materiales están configurados para PBR (Physically Based Rendering) y se incluyen mapas de normales, rugosidad y oclusión ambiental.
                 </p>
                 <h3 className="text-lg font-bold mt-6 mb-3 text-slate-900 dark:text-white">Contenido del Pack:</h3>
                 <ul className="list-disc pl-5 space-y-1">
                    <li>Modelos 3D optimizados (.FBX, .OBJ)</li>
                    <li>Texturas 4K (.PNG) - Diffuse, Normal, Roughness, AO, Metalness</li>
                    <li>Escena de demostración (.BLEND) con iluminación configurada</li>
                    <li>Documentación PDF de uso</li>
                 </ul>
              </div>
           </div>

           <div className="bg-white dark:bg-white/[0.02] p-8 rounded-2xl border border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                 <Layers className="h-5 w-5 text-amber-500" /> Detalles Técnicos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
                 <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Formatos</div>
                    <div className="font-medium text-slate-900 dark:text-white flex flex-wrap gap-1">
                        {asset.formats.map(f => <span key={f} className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-xs">{f}</span>)}
                    </div>
                 </div>
                 <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Tamaño</div>
                    <div className="font-medium text-slate-900 dark:text-white">{asset.fileSize}</div>
                 </div>
                 {asset.technicalSpecs?.vertices && (
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Vértices</div>
                        <div className="font-medium text-slate-900 dark:text-white">{asset.technicalSpecs.vertices}</div>
                    </div>
                 )}
                 {asset.technicalSpecs?.polygons && (
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Polígonos</div>
                        <div className="font-medium text-slate-900 dark:text-white">{asset.technicalSpecs.polygons}</div>
                    </div>
                 )}
                 <div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Texturas</div>
                     <div className="font-medium text-slate-900 dark:text-white">{asset.technicalSpecs?.textures ? 'Sí (4K)' : 'No'}</div>
                 </div>
                 <div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Materiales</div>
                     <div className="font-medium text-slate-900 dark:text-white">{asset.technicalSpecs?.materials ? 'Sí (PBR)' : 'No'}</div>
                 </div>
                 <div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">UV Mapped</div>
                     <div className="font-medium text-slate-900 dark:text-white">{asset.technicalSpecs?.uvMapped ? 'Sí' : 'No'}</div>
                 </div>
                 <div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-bold">Rigged</div>
                     <div className="font-medium text-slate-900 dark:text-white">{asset.technicalSpecs?.rigged ? 'Sí' : 'No'}</div>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-white/[0.02] p-8 rounded-2xl border border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                 <MessageSquare className="h-5 w-5 text-blue-500" /> Reseñas ({asset.reviewCount})
              </h2>
              
              <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 pb-6 border-b border-slate-200 dark:border-white/5 last:border-0 last:pb-0">
                          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                              <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-slate-900 dark:text-white text-sm">Usuario {i}</span>
                                  <div className="flex">
                                      {[...Array(5)].map((_, s) => (
                                          <Star key={s} className={`h-3 w-3 ${s < 5 ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`} />
                                      ))}
                                  </div>
                                  <span className="text-xs text-slate-500">hace 2 días</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                                  Excelente calidad. Las texturas son muy detalladas y la topología es perfecta para juegos. Recomendado 100%.
                              </p>
                              <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" /> Útil
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
              <button className="w-full mt-6 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Ver todas las reseñas
              </button>
           </div>

        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="sticky top-24 space-y-6">
              
              <div className="bg-white dark:bg-[#0A0A0C] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{asset.title}</h1>
                 
                 <div className="flex items-center gap-2 mb-6">
                    <div className="flex">
                       {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(asset.rating) ? 'fill-amber-500 text-amber-500' : 'fill-slate-300 dark:fill-slate-700 text-transparent'}`} />
                       ))}
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">({asset.reviewCount} reseñas)</span>
                 </div>

                 <div className="text-4xl font-bold text-slate-900 dark:text-white mb-6">${asset.price}</div>

                 <div className="space-y-3 mb-6">
                     <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-500/5 cursor-pointer relative transition-colors">
                         <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm mb-1">
                             <span>Licencia Standard</span>
                             <span>${asset.price}</span>
                         </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400">Uso personal y comercial (1 proyecto final).</p>
                         <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-amber-500"></div>
                     </div>
                     <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors opacity-70 hover:opacity-100">
                         <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm mb-1">
                             <span>Licencia Extendida</span>
                             <span>${(asset.price * 3).toFixed(2)}</span>
                         </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400">Uso comercial ilimitado y redistribución.</p>
                     </div>
                 </div>

                 <button 
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 mb-3"
                 >
                     <ShoppingCart className="h-5 w-5" />
                     Añadir al Carrito
                 </button>
                 <button 
                    onClick={handleBuyNow}
                    className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                 >
                     Comprar Ahora
                 </button>

                 <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
                     <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                         <ShieldCheck className="h-5 w-5 text-green-500" />
                         <span>Pago seguro y encriptado</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                         <Download className="h-5 w-5 text-blue-500" />
                         <span>Descarga inmediata tras el pago</span>
                     </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center gap-4 hover:border-amber-500/30 transition-colors cursor-pointer" onClick={() => onAuthorClick?.(asset.creator)}>
                 <img src={asset.creatorAvatar} alt={asset.creator} className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5" />
                 <div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Creado por</div>
                     <span className="font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors">
                         {asset.creator}
                     </span>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};
