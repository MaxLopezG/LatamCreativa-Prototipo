/**
 * EditThreadView - Edit Thread Page
 * 
 * Formulario para editar un hilo existente en el foro.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Edit2,
    Tag,
    Hash,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useForumThread, useUpdateThread } from '../../hooks/useForumHooks';
import { ForumEditor } from '../../components/forum';
import { FORUM_CATEGORIES, getCategoryById, CATEGORY_COLOR_CLASSES } from '../../data/forumCategories';
import * as Icons from 'lucide-react';

export const EditThreadView: React.FC = () => {
    const navigate = useNavigate();
    const { id: threadId } = useParams<{ id: string }>();
    const { state } = useAppStore();
    const { thread, loading: loadingThread, error: loadError } = useForumThread(threadId);
    const { update, loading: updating, error: updateError } = useUpdateThread();

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Validation state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Initialize form with thread data
    useEffect(() => {
        if (thread && !initialized) {
            setTitle(thread.title);
            setContent(thread.content);
            setCategory(thread.category);
            setTags(thread.tags || []);
            setInitialized(true);
        }
    }, [thread, initialized]);

    // Redirect if not logged in or not the author
    useEffect(() => {
        if (!state.user) {
            navigate('/auth?redirect=/forum');
            return;
        }
        if (thread && thread.authorId !== state.user.uid) {
            navigate('/forum');
        }
    }, [state.user, thread, navigate]);

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'El título es requerido';
        } else if (title.length < 5) {
            newErrors.title = 'El título debe tener al menos 5 caracteres';
        } else if (title.length > 150) {
            newErrors.title = 'El título no puede exceder 150 caracteres';
        }

        if (!content.trim()) {
            newErrors.content = 'El contenido es requerido';
        } else if (content.length < 20) {
            newErrors.content = 'El contenido debe tener al menos 20 caracteres';
        }

        if (!category) {
            newErrors.category = 'Debes seleccionar una categoría';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle tag input
    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, '');
        if (newTag && !tags.includes(newTag) && tags.length < 5) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({ title: true, content: true, category: true });

        if (!validate() || !threadId) return;

        const success = await update(threadId, {
            title,
            content,
            category,
            tags
        });

        if (success) {
            navigate(`/forum/${thread?.slug || threadId}`);
        }
    };

    // Get selected category info
    const selectedCategory = getCategoryById(category);
    const selectedColorClasses = selectedCategory ? CATEGORY_COLOR_CLASSES[selectedCategory.color] : null;

    // Loading state
    if (loadingThread) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    // Error state
    if (loadError || !thread) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Hilo no encontrado</h2>
                    <p className="text-gray-400 mb-4">El hilo que buscas no existe o fue eliminado.</p>
                    <button
                        onClick={() => navigate('/forum')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                        Volver al foro
                    </button>
                </div>
            </div>
        );
    }

    if (!state.user) {
        return null;
    }

    return (
        <div className="min-h-screen pb-12 px-4 md:px-8 lg:px-12 pt-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(`/forum/${thread.slug || threadId}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al hilo
                </button>

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Edit2 className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Editar Hilo</h1>
                        <p className="text-gray-400">Modifica el contenido de tu hilo</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Banner */}
                {updateError && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{updateError}</p>
                    </div>
                )}

                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                        Título <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, title: true }))}
                        placeholder="Escribe un título claro y descriptivo"
                        className={`w-full px-4 py-3 bg-[#1a1a2e]/60 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${touched.title && errors.title
                            ? 'border-red-500/50 focus:ring-red-500/30'
                            : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                            }`}
                        maxLength={150}
                    />
                    <div className="flex justify-between mt-2">
                        {touched.title && errors.title ? (
                            <span className="text-red-400 text-sm">{errors.title}</span>
                        ) : (
                            <span />
                        )}
                        <span className="text-gray-500 text-sm">{title.length}/150</span>
                    </div>
                </div>

                {/* Category Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categoría <span className="text-red-400">*</span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowCategoryPicker(true)}
                        onBlur={() => setTouched(t => ({ ...t, category: true }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 bg-[#1a1a2e]/60 border rounded-xl text-left transition-all ${touched.category && errors.category
                            ? 'border-red-500/50'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        {selectedCategory ? (
                            <>
                                <div className={`p-2 rounded-lg ${selectedColorClasses?.bg} ${selectedColorClasses?.border} border`}>
                                    {React.createElement(
                                        (Icons as Record<string, React.FC<{ className?: string }>>)[selectedCategory.icon] || Icons.MessageSquare,
                                        { className: `w-5 h-5 ${selectedColorClasses?.text}` }
                                    )}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{selectedCategory.name}</div>
                                    <div className="text-gray-500 text-sm">{selectedCategory.description}</div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                                <Hash className="w-5 h-5" />
                                Selecciona una categoría
                            </div>
                        )}
                    </button>
                    {touched.category && errors.category && (
                        <span className="text-red-400 text-sm mt-2 block">{errors.category}</span>
                    )}

                    {/* Category Picker Modal */}
                    {showCategoryPicker && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">Selecciona una categoría</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryPicker(false)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {FORUM_CATEGORIES.map(cat => {
                                        const colorClasses = CATEGORY_COLOR_CLASSES[cat.color];
                                        const IconComponent = (Icons as Record<string, React.FC<{ className?: string }>>)[cat.icon] || Icons.MessageSquare;

                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setCategory(cat.id);
                                                    setShowCategoryPicker(false);
                                                }}
                                                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${category === cat.id
                                                    ? `${colorClasses.bg} ${colorClasses.border}`
                                                    : 'bg-white/5 border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                                                    <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{cat.name}</div>
                                                    <div className="text-gray-500 text-xs line-clamp-1">{cat.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contenido <span className="text-red-400">*</span>
                    </label>
                    <ForumEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Describe tu pregunta o tema de discusión en detalle..."
                        minHeight="250px"
                        maxLength={10000}
                        showToolbar={true}
                        category={category}
                    />
                    {touched.content && errors.content && (
                        <span className="text-red-400 text-sm mt-2 block">{errors.content}</span>
                    )}
                </div>

                {/* Tags Input */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                        Tags <span className="text-gray-500">(opcional, máx. 5)</span>
                    </label>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-lg"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:text-white transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {tags.length < 5 && (
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="Escribe un tag y presiona Enter"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a2e]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                            >
                                Agregar
                            </button>
                        </div>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                        Los tags ayudan a otros usuarios a encontrar tu hilo
                    </p>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => navigate(`/forum/${thread.slug || threadId}`)}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={updating}
                        className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/20"
                    >
                        {updating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-5 h-5" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditThreadView;
