import React from 'react';
import { Upload } from 'lucide-react';

/** Modo de entrada actual para el uploader de medios */
type MediaMode = 'none' | 'youtube' | 'sketchfab';

/**
 * Props para el componente MediaUploader
 */
interface MediaUploaderProps {
    /** Modo de entrada: 'none' muestra botones, 'youtube' o 'sketchfab' muestran formularios */
    mode: MediaMode;
    /** Valor actual del input de URL de YouTube */
    youtubeLink: string;
    /** Valor actual del input de URL de Sketchfab */
    sketchfabLink: string;
    /** Se llama cuando cambia el input de URL de YouTube */
    onYoutubeLinkChange: (value: string) => void;
    /** Se llama cuando cambia el input de URL de Sketchfab */
    onSketchfabLinkChange: (value: string) => void;
    /** Se llama al hacer clic en "Subir Imágenes" */
    onUploadClick: () => void;
    /** Se llama al hacer clic en botón YouTube (cambia a modo youtube) */
    onYoutubeClick: () => void;
    /** Se llama al hacer clic en "Modelo 3D" (cambia a modo sketchfab) */
    onSketchfabClick: () => void;
    /** Se llama cuando el usuario confirma agregar un video de YouTube */
    onAddYoutube: () => void;
    /** Se llama cuando el usuario confirma agregar un modelo Sketchfab */
    onAddSketchfab: () => void;
    /** Se llama cuando el usuario cancela el modo actual */
    onCancel: () => void;
}

/**
 * Componente para agregar medios a la galería de un proyecto.
 * Soporta tres modos:
 * - `none`: Muestra botones para Upload, YouTube y Sketchfab
 * - `youtube`: Muestra formulario para URL de YouTube
 * - `sketchfab`: Muestra formulario para URL de Sketchfab
 * 
 * @example
 * ```tsx
 * <MediaUploader
 *   mode="none"
 *   youtubeLink=""
 *   sketchfabLink=""
 *   onUploadClick={() => fileInputRef.current?.click()}
 *   onYoutubeClick={() => setMode('youtube')}
 *   onSketchfabClick={() => setMode('sketchfab')}
 *   onAddYoutube={handleAddYoutube}
 *   onAddSketchfab={handleAddSketchfab}
 *   onCancel={() => setMode('none')}
 * />
 * ```
 */
export const MediaUploader: React.FC<MediaUploaderProps> = ({
    mode,
    youtubeLink,
    sketchfabLink,
    onYoutubeLinkChange,
    onSketchfabLinkChange,
    onUploadClick,
    onYoutubeClick,
    onSketchfabClick,
    onAddYoutube,
    onAddSketchfab,
    onCancel,
}) => {
    if (mode === 'none') {
        return (
            <div className="border-2 border-dashed border-white/[0.06] rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                    <div className="p-4 bg-white/[0.03] rounded-full text-slate-500">
                        <Upload className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-400">Añadir recursos multimedia</h4>
                    <p className="text-xs text-slate-600">Imágenes, Videos de YouTube o Modelos 3D</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={onUploadClick}
                        className="px-5 py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                        Subir Imágenes
                    </button>
                    <button
                        onClick={onYoutubeClick}
                        className="px-5 py-2.5 bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/20 rounded-lg font-bold text-sm hover:bg-[#FF0000]/20 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                        </svg>
                        YouTube
                    </button>
                    <button
                        onClick={onSketchfabClick}
                        className="px-5 py-2.5 bg-[#1CAAD9]/10 text-[#1CAAD9] border border-[#1CAAD9]/20 rounded-lg font-bold text-sm hover:bg-[#1CAAD9]/20 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0L1.75 6v12L12 24l10.25-6V6L12 0zm0 2.25l8 4.7v9.4l-8 4.7-8-4.7V7L12 2.25z" />
                            <path d="M12 7.5L6 11v5l6 3.5 6-3.5v-5L12 7.5z" />
                        </svg>
                        Modelo 3D
                    </button>
                </div>
            </div>
        );
    }

    if (mode === 'youtube') {
        return (
            <div className="border border-white/[0.06] bg-[#18181b] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                    </svg>
                    Añadir video de YouTube
                </h4>
                <div className="flex gap-2 w-full max-w-lg">
                    <input
                        type="text"
                        value={youtubeLink}
                        onChange={(e) => onYoutubeLinkChange(e.target.value)}
                        placeholder="Pega el enlace aquí (ej: https://www.youtube.com/watch?v=...)"
                        className="flex-1 bg-[#0d0d0f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder-slate-600"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && onAddYoutube()}
                    />
                    <button
                        onClick={onAddYoutube}
                        className="px-6 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-slate-200"
                    >
                        Añadir
                    </button>
                </div>
                <button onClick={onCancel} className="text-xs text-slate-500 hover:text-white underline">
                    Cancelar
                </button>
            </div>
        );
    }

    // mode === 'sketchfab'
    return (
        <div className="border border-white/[0.06] bg-[#18181b] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1CAAD9]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L1.75 6v12L12 24l10.25-6V6L12 0zm0 2.25l8 4.7v9.4l-8 4.7-8-4.7V7L12 2.25z" />
                    <path d="M12 7.5L6 11v5l6 3.5 6-3.5v-5L12 7.5z" />
                </svg>
                Añadir modelo 3D de Sketchfab
            </h4>
            <div className="flex gap-2 w-full max-w-lg">
                <input
                    type="text"
                    value={sketchfabLink}
                    onChange={(e) => onSketchfabLinkChange(e.target.value)}
                    placeholder="Pega el enlace (ej: https://sketchfab.com/3d-models/nombre-modelo-abc123...)"
                    className="flex-1 bg-[#0d0d0f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#1CAAD9] transition-colors placeholder-slate-600"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && onAddSketchfab()}
                />
                <button
                    onClick={onAddSketchfab}
                    className="px-6 py-2 bg-[#1CAAD9] text-white rounded-lg font-bold text-sm hover:bg-[#1CAAD9]/80"
                >
                    Añadir
                </button>
            </div>
            <button onClick={onCancel} className="text-xs text-slate-500 hover:text-white underline">
                Cancelar
            </button>
        </div>
    );
};
