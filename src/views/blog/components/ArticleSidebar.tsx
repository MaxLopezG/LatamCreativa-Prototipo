import React, { useRef, useEffect } from 'react';
import { Save, Calendar, ChevronDown, Check, X, Layers, Hash } from 'lucide-react';

/**
 * Item de navegación para dropdown de categorías
 */
interface NavItem {
    label: string;
    icon: React.FC<{ className?: string }>;
    subItems?: string[];
}

interface NavSection {
    title: string;
    items: NavItem[];
}

/**
 * Props para el componente ArticleSidebar
 */
interface ArticleSidebarProps {
    /** Si el artículo está siendo editado (vs creado) */
    isEditMode: boolean;
    /** Si una operación de publicar/guardar está en progreso */
    isPublishing: boolean;
    /** Categoría seleccionada actualmente */
    category: string;
    /** Si el dropdown de categoría está abierto */
    isCategoryOpen: boolean;
    /** Callback para alternar dropdown de categoría */
    setIsCategoryOpen: (open: boolean) => void;
    /** Callback cuando se selecciona categoría */
    setCategory: (cat: string) => void;
    /** Referencia para dropdown de categoría (para clic afuera) */
    categoryRef: React.RefObject<HTMLDivElement>;
    /** Secciones de categorías disponibles */
    sections: NavSection[];
    /** Tags actuales */
    tags: string[];
    /** Valor del input de tag */
    tagInput: string;
    /** Callback cuando cambia el input de tag */
    setTagInput: (val: string) => void;
    /** Callback cuando se presiona tecla en input de tag */
    handleAddTag: (e: React.KeyboardEvent) => void;
    /** Callback para agregar un tag */
    addTag: (tag: string) => void;
    /** Callback para eliminar un tag */
    removeTag: (tag: string) => void;
    /** Tags sugeridos basados en categoría */
    suggestedTags: string[];
    /** Callback para botón de publicar */
    handlePublish: () => void;
    /** Callback para botón de guardar borrador */
    handleSaveDraft: () => void;
}

/**
 * Componente sidebar para el editor de artículos.
 * Contiene:
 * - Botones de Publicar/Borrador/Programar
 * - Selector de categoría con dropdown
 * - Input de tags con sugerencias
 */
export const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
    isEditMode,
    isPublishing,
    category,
    isCategoryOpen,
    setIsCategoryOpen,
    setCategory,
    categoryRef,
    sections,
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    addTag,
    removeTag,
    suggestedTags,
    handlePublish,
    handleSaveDraft
}) => {
    return (
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">

            {/* Publish Actions Panel */}
            <div className="bg-[#18181b] p-6 rounded-xl border border-white/[0.06] shadow-xl shadow-black/20 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Publicación</h3>

                {/* Publish Button */}
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPublishing ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Publicando...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            <span>{isEditMode ? 'Guardar Cambios' : 'Publicar'}</span>
                        </>
                    )}
                </button>

                {/* Save Draft Button */}
                <button
                    onClick={handleSaveDraft}
                    disabled={isPublishing}
                    className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    Guardar Borrador
                </button>

                {/* Schedule (PRO) */}
                <div className="relative group">
                    <button
                        disabled
                        className="w-full py-3 bg-transparent border border-white/[0.06] text-slate-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                    >
                        <Calendar className="h-4 w-4" />
                        Programar
                    </button>
                    <span className="absolute top-1/2 -translate-y-1/2 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        PRO
                    </span>
                </div>
            </div>

            {/* Category & Tags Panel */}
            <div className="bg-[#18181b] p-6 rounded-xl border border-white/[0.06] shadow-xl shadow-black/20 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="h-3 w-3" /> Categoría
                </h3>

                {/* Category Select */}
                <div className="relative" ref={categoryRef}>
                    <div
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${isCategoryOpen
                            ? 'border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className={category ? 'text-white' : 'text-slate-500'}>
                            {category || 'Seleccionar tema...'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown */}
                    {isCategoryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-[#1A1A1C] border border-white/10 rounded-xl shadow-2xl z-50 animate-fade-in custom-scrollbar">
                            {sections.map(section => (
                                <div key={section.title} className="py-2">
                                    <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-[#1A1A1C]/95 backdrop-blur-sm z-10">
                                        {section.title}
                                    </div>
                                    {section.items.map(item => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                setCategory(item.label);
                                                setIsCategoryOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center justify-between group transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-md bg-white/5 text-slate-500 group-hover:text-rose-500 group-hover:bg-rose-500/10 transition-colors">
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <span className="text-slate-200 group-hover:text-white">
                                                    {item.label}
                                                </span>
                                            </div>
                                            {category === item.label && <Check className="h-4 w-4 text-rose-500" />}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Hash className="h-3 w-3" /> Etiquetas
                    </label>
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-rose-500/20 text-rose-300 rounded-lg text-sm font-medium animate-fade-in">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Escribe y presiona Enter..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                    {/* Suggested Tags */}
                    {suggestedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {suggestedTags.slice(0, 5).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => addTag(tag)}
                                    disabled={tags.includes(tag)}
                                    className={`text-xs px-2 py-1 rounded-md border transition-colors ${tags.includes(tag)
                                        ? 'bg-white/5 text-slate-500 border-transparent cursor-default'
                                        : 'border-white/10 text-slate-400 hover:border-rose-400 hover:text-rose-400'
                                        }`}
                                >
                                    + {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </aside>
    );
};

/**
 * Barra de acciones móvil para pantallas pequeñas (fija en la parte inferior)
 */
interface MobileActionBarProps {
    isEditMode: boolean;
    isPublishing: boolean;
    handlePublish: () => void;
    handleSaveDraft: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
    isEditMode,
    isPublishing,
    handlePublish,
    handleSaveDraft
}) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d0f]/90 backdrop-blur-xl border-t border-white/[0.06] py-4 px-6 z-30">
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isPublishing ? 'Publicando...' : (isEditMode ? 'Guardar' : 'Publicar')}
                </button>
                <button
                    onClick={handleSaveDraft}
                    disabled={isPublishing}
                    className="py-3 px-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl font-bold text-sm"
                >
                    <Save className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
