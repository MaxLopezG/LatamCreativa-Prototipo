import React, { useState } from 'react';
import { X, Newspaper, Image as ImageIcon, Tag, Send, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { ArticleItem } from '../../types';
import { TagInput } from '../ui/TagInput';
import { COMMON_TAGS } from '../../data/tags';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OFFICIAL_PROFILE = {
    name: "Latam Creativa",
    id: "latam-creativa-official",
    avatar: "https://ui-avatars.com/api/?name=Latam+Creativa&background=0D0D0F&color=F59E0B&bold=true",
    role: "Official Account"
};

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
    const { state, actions } = useAppStore();
    const user = state.user;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [isOfficialPost, setIsOfficialPost] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
        }
    };

    const handlePublish = async () => {
        if (!title || !content) return;
        setIsSubmitting(true);

        try {
            let imageUrl = image;

            // 1. Upload Image if exists
            if (imageFile) {
                const storageRef = ref(storage, `blog-covers/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            } else if (!image) {
                // Default image if none provided
                imageUrl = 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop';
            }

            // 2. Prepare Author Data
            const author = isOfficialPost ? OFFICIAL_PROFILE : {
                name: user?.name || 'Anonymous',
                id: user?.id || 'anon',
                avatar: user?.avatar || '',
                role: user?.role || 'Member'
            };

            const newPost: ArticleItem = {
                id: Date.now().toString(), // Helper ID, Firestore will generate real one ideally or we use this
                title,
                excerpt: content.substring(0, 120) + '...',
                content,
                author: author.name,
                authorAvatar: author.avatar,
                role: author.role,
                date: new Date().toISOString(),
                readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min`,
                likes: 0,
                comments: 0,
                image: imageUrl,
                tags,
                category: 'General'
            };

            // 3. Save to Firestore
            const docRef = await addDoc(collection(db, 'articles'), newPost);

            // 4. Update Local State (Optimistic or Refresh)
            // We'll update the ID to match Firestore's ID
            actions.addBlogPost({ ...newPost, id: docRef.id });

            actions.showToast('Artículo publicado exitosamente', 'success');

            // Reset form
            setTitle('');
            setContent('');
            setImage('');
            setImageFile(null);
            setTags([]);
            setIsOfficialPost(false);
            onClose();

        } catch (error) {
            console.error("Error publishing post:", error);
            actions.showToast('Error al publicar el artículo', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#08080A] w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                            <Newspaper className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Crear Nuevo Artículo</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Título del Artículo</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-2xl font-bold bg-transparent border-b border-slate-200 dark:border-slate-800 focus:border-amber-500 outline-none py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                            placeholder="Escribe un título impactante..."
                        />
                    </div>

                    {/* Image URL */}
                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Imagen de Portada
                        </label>

                        {!image ? (
                            <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-8 transition-colors hover:border-amber-500 hover:bg-amber-500/5 group">
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-amber-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">
                                        Haz clic para subir una imagen
                                    </span>
                                    <span className="text-xs text-slate-400 text-center max-w-xs">
                                        PNG, JPG o WEBP (Max. 5MB)
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="relative h-56 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 group">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => {
                                            setImage('');
                                            setImageFile(null);
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-200"
                                    >
                                        Eliminar Imagen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contenido</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 transition-all text-slate-900 dark:text-slate-300 resize-none leading-relaxed"
                            placeholder="Comparte tu conocimiento con la comunidad..."
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <TagInput
                            tags={tags}
                            onAddTag={(tag) => {
                                if (!tags.includes(tag)) {
                                    setTags([...tags, tag]);
                                }
                            }}
                            onRemoveTag={(tag) => setTags(tags.filter(t => t !== tag))}
                            suggestions={COMMON_TAGS}
                            label="Etiquetas"
                            icon={<Tag className="h-4 w-4" />}
                            placeholder="Ej. Tutorial, 3D, Career..."
                        />
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">

                    {/* Admin Toggle */}
                    {user?.isAdmin && (
                        <div
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-colors border ${isOfficialPost ? 'bg-amber-500/10 border-amber-500/50' : 'border-transparent hover:bg-slate-200 dark:hover:bg-white/5'}`}
                            onClick={() => setIsOfficialPost(!isOfficialPost)}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isOfficialPost ? 'bg-amber-500 border-amber-500' : 'border-slate-400'}`}>
                                {isOfficialPost && <CheckCircle2 className="h-3.5 w-3.5 text-black" />}
                            </div>
                            <div>
                                <span className={`block text-sm font-bold ${isOfficialPost ? 'text-amber-500' : 'text-slate-500'}`}>Publicar como Latam Creativa</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={!title || !content || isSubmitting}
                            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all ${!title || !content || isSubmitting
                                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'
                                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Publicando...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Publicar Artículo
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
