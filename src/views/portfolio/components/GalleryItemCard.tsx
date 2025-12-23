import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Representa un item individual en la galería.
 * Soporta imágenes, videos, embeds de YouTube y modelos 3D de Sketchfab.
 */
export interface GalleryItem {
    /** Identificador único del item de galería */
    id: string;
    /** Objeto File para uploads locales (antes de subir a storage) */
    file?: File;
    /** URL del item (para YouTube/Sketchfab o después de subir) */
    url?: string;
    /** URL de imagen de preview para mostrar en la tarjeta */
    preview: string;
    /** Descripción escrita por el usuario */
    caption: string;
    /** Tipo de contenido multimedia */
    type: 'image' | 'video' | 'youtube' | 'sketchfab';
}

/**
 * Props para el componente GalleryItemCard
 */
interface GalleryItemCardProps {
    /** El item de galería a mostrar */
    item: GalleryItem;
    /** Posición de este item en la galería (índice desde 0) */
    index: number;
    /** Número total de items (usado para deshabilitar botones arriba/abajo) */
    totalItems: number;
    /** Callback cuando se hace clic en el botón eliminar */
    onRemove: (id: string) => void;
    /** Callback para mover item arriba o abajo en la galería */
    onMove: (index: number, direction: 'up' | 'down') => void;
    /** Callback cuando cambia el texto del caption */
    onUpdateCaption: (id: string, caption: string) => void;
}

/**
 * Componente de tarjeta para mostrar items de galería (imágenes, videos de YouTube, modelos Sketchfab)
 * con preview, badge de tipo, controles de reorden y campo de caption.
 * 
 * @example
 * ```tsx
 * <GalleryItemCard
 *   item={galleryItem}
 *   index={0}
 *   totalItems={5}
 *   onRemove={(id) => handleRemove(id)}
 *   onMove={(idx, dir) => handleMove(idx, dir)}
 *   onUpdateCaption={(id, caption) => handleCaption(id, caption)}
 * />
 * ```
 */
export const GalleryItemCard: React.FC<GalleryItemCardProps> = ({
    item,
    index,
    totalItems,
    onRemove,
    onMove,
    onUpdateCaption,
}) => {
    return (
        <div className="bg-[#0A0A0C] border border-white/[0.06] rounded-2xl overflow-hidden animate-fade-in group hover:border-white/10 transition-colors">
            {/* Preview Area */}
            <div className="relative bg-black/50 min-h-[400px] flex items-center justify-center p-4">
                <img
                    src={item.preview}
                    alt={`Gallery ${index}`}
                    className="max-w-full max-h-[600px] object-contain shadow-2xl"
                />

                {/* YouTube Overlay */}
                {item.type === 'youtube' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl">
                            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Sketchfab Overlay */}
                {item.type === 'sketchfab' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-[#1CAAD9] flex items-center justify-center shadow-xl">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0L1.75 6v12L12 24l10.25-6V6L12 0zm0 2.25l8 4.7v9.4l-8 4.7-8-4.7V7L12 2.25z" />
                                <path d="M12 7.5L6 11v5l6 3.5 6-3.5v-5L12 7.5z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Delete Button */}
                <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                    <Trash2 className="h-5 w-5" />
                </button>

                {/* Reorder Buttons */}
                <div className="absolute top-4 right-16 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={() => onMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 bg-black/50 hover:bg-amber-500 text-white rounded-lg backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onMove(index, 'down')}
                        disabled={index === totalItems - 1}
                        className="p-1.5 bg-black/50 hover:bg-amber-500 text-white rounded-lg backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </div>

                {/* Type Badge */}
                <span className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm border border-white/10 flex items-center gap-2">
                    {item.type === 'youtube' ? (
                        <span className="text-red-500">YouTube</span>
                    ) : item.type === 'sketchfab' ? (
                        <span className="text-[#1CAAD9]">3D Model</span>
                    ) : (
                        'Imagen'
                    )} {index + 1}
                </span>
            </div>

            {/* Caption Input */}
            <div className="p-6 bg-[#0E0E10] border-t border-white/[0.06]">
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-500 font-bold text-xs">
                            Aa
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <textarea
                            value={item.caption}
                            onChange={(e) => onUpdateCaption(item.id, e.target.value)}
                            placeholder="Escribe una descripción, historia o contexto para esta imagen..."
                            className="w-full bg-transparent text-slate-300 placeholder-slate-600 text-sm focus:outline-none resize-none leading-relaxed border-none focus:ring-0 p-0"
                            rows={2}
                        />
                        <div className="h-px bg-white/[0.06] w-full" />
                        <div className="flex justify-end">
                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                                {item.caption.length}/500
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
