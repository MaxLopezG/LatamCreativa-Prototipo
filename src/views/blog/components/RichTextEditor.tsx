import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

/**
 * Props para el componente RichTextEditor
 */
interface RichTextEditorProps {
    /** Contenido HTML inicial a mostrar */
    initialContent: string;
    /** Se llama cuando el contenido cambia */
    onChange: (content: string) => void;
    /** Texto placeholder cuando está vacío */
    placeholder?: string;
}

/**
 * Editor de texto enriquecido basado en contentEditable con barra de herramientas.
 * Maneja preservación de posición del cursor y sanitización de pegado.
 * 
 * Características:
 * - Formato Negrita, Cursiva, Subrayado
 * - Inserción de emojis
 * - Sanitización de pegado (elimina estilos no deseados)
 * - Preservación de posición del cursor en actualizaciones externas
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    initialContent,
    onChange,
    placeholder
}) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);

    // Inicializar contenido al montar o si hay cambio externo (sin foco)
    useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML !== initialContent) {
            if (document.activeElement !== contentEditableRef.current) {
                contentEditableRef.current.innerHTML = initialContent;
            }
        }
    }, [initialContent]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    /**
     * Maneja el pegado para eliminar estilos no deseados (background-color, color, font-family, etc.)
     */
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');

        if (html) {
            const temp = document.createElement('div');
            temp.innerHTML = html;

            // Clean HTML recursively
            const cleanHTML = (element: Element) => {
                element.removeAttribute('style');
                element.removeAttribute('class');
                Array.from(element.children).forEach(child => cleanHTML(child));
            };

            Array.from(temp.children).forEach(child => cleanHTML(child));
            temp.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
            temp.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));

            document.execCommand('insertHTML', false, temp.innerHTML);
        } else if (text) {
            document.execCommand('insertText', false, text);
        }

        if (contentEditableRef.current) {
            onChange(contentEditableRef.current.innerHTML);
        }
    };

    return (
        <div className="relative group/text">
            {/* Editable text area */}
            <div
                ref={contentEditableRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onBlur={handleInput}
                onPaste={handlePaste}
                className="w-full bg-transparent border-none text-lg leading-relaxed text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-0 min-h-[1.5em] font-serif pb-10"
            />
            {!initialContent && placeholder && (
                <div className="absolute top-0 left-0 text-slate-500 text-lg font-serif pointer-events-none">
                    {placeholder}
                </div>
            )}

            {/* Toolbar - positioned at bottom, shown on hover */}
            <div className="absolute bottom-0 left-0 bg-slate-800 rounded-lg flex items-center gap-1 p-1 border border-white/10 opacity-0 group-hover/text:opacity-100 focus-within:opacity-100 transition-opacity z-10 shadow-xl">
                <button
                    onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); }}
                    className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    title="Negrita"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); }}
                    className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    title="Cursiva"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline'); }}
                    className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    title="Subrayado"
                >
                    <Underline className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                {['😊', '😂', '❤️', '🔥', '👍', '🎉', '🚀'].map(emoji => (
                    <button
                        key={emoji}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            document.execCommand('insertText', false, emoji);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded text-lg leading-none transition-colors"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};
