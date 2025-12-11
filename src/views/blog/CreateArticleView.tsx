import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Image as ImageIcon, Type, Youtube, X, ChevronUp, ChevronDown, Plus, Trash2, GripVertical, Eye, Edit3, Tag as TagIcon, Hash, Layers, Check, Bold, Italic, Underline } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { CreatePageLayout } from '../../components/layout/CreatePageLayout';
import { useAppStore } from '../../hooks/useAppStore';
import { NAV_SECTIONS, NAV_SECTIONS_DEV } from '../../data/navigation';
import { useCreateArticle, useArticle, useUpdateArticle } from '../../hooks/useFirebase';

interface CreateArticleViewProps {
  onBack: () => void;
}

type BlockType = 'text' | 'image' | 'video';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

// Helper Component to fix cursor jumping issues
const RichTextEditor = ({
  initialContent,
  onChange,
  placeholder
}: {
  initialContent: string,
  onChange: (content: string) => void,
  placeholder?: string
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Initialize content on mount or if external change occurs (while not focused)
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

  return (
    <div className="relative group/text">
      {/* Toolbar */}
      <div className="absolute -top-12 left-0 bg-slate-800 rounded-lg flex items-center gap-1 p-1 border border-white/10 opacity-0 group-hover/text:opacity-100 transition-opacity z-10 shadow-xl">
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

      <div
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        className="w-full bg-transparent border-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-0 min-h-[1.5em] font-serif"
      />
      {!initialContent && placeholder && (
        <div className="absolute top-0 left-0 text-slate-400 text-lg font-serif pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export const CreateArticleView: React.FC<CreateArticleViewProps> = ({ onBack }) => {
  const { actions, state } = useAppStore();

  // Edit Mode Logic
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const { article: existingArticle, loading: isLoadingExisting } = useArticle(editId || undefined);

  const { create } = useCreateArticle();
  const { update } = useUpdateArticle();

  const [isPublishing, setIsPublishing] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'text', content: '' }
  ]);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Pre-fill data if editing
  useEffect(() => {
    if (existingArticle && isEditMode) {
      setTitle(existingArticle.title);
      setCategory(existingArticle.category);
      setTags(existingArticle.tags || []);
      setCoverImage(existingArticle.image);

      // Parse content back to blocks (simple heuristic: split by \n\n)
      // Ideally we would store blocks structure in DB, but for now we reconstruct
      // This assumes the plain text structure we saved. 
      // FUTURE TODO: Save 'blocks' JSON in Firestore for perfect fidelity.

      // For now, let's treat the whole content as one text block if strict structure is lost, 
      // or try to split if we saved with specific delimiters. 
      // Since we saved as .join('\n\n'), we can try to split, but images/videos 
      // might be hard to distinguish exactly without parsing.

      // Let's rely on the regex we used in BlogPostView to detect media
      const splitContent = existingArticle.content.split('\n\n');
      const reconstructedBlocks: ContentBlock[] = splitContent.map((chunk, index) => {
        const getYoutubeId = (url: string) => {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : null;
        };

        if (getYoutubeId(chunk.trim())) {
          return { id: `restored-${index}`, type: 'video', content: chunk.trim() };
        }
        if (chunk.trim().match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i)) {
          return { id: `restored-${index}`, type: 'image', content: chunk.trim() };
        }
        return { id: `restored-${index}`, type: 'text', content: chunk };
      });

      if (reconstructedBlocks.length > 0) {
        setBlocks(reconstructedBlocks);
      }
    }
  }, [existingArticle, isEditMode]);

  // UX State
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Dynamic Categories based on Content Mode
  const sections = state.contentMode === 'dev' ? NAV_SECTIONS_DEV : NAV_SECTIONS;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find current category object to get related tags (subItems)
  const currentCategoryData = useMemo(() => {
    for (const section of sections) {
      const found = section.items.find(item => item.label === category);
      if (found) return found;
    }
    return null;
  }, [category, sections]);

  // Suggested tags are the subItems of the selected category
  const suggestedTags = currentCategoryData?.subItems || [];

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onSuccess: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // If this is for the cover (we check if onSuccess is setCoverImage), save the file
      if (onSuccess === setCoverImage) {
        setCoverImageFile(file);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onSuccess(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      actions.showToast('Por favor escribe un título', 'error');
      return;
    }
    if (!category) {
      actions.showToast('Selecciona una categoría', 'error');
      return;
    }
    if (blocks.length === 0 || (blocks.length === 1 && !blocks[0].content.trim())) {
      actions.showToast('El artículo no puede estar vacío', 'error');
      return;
    }

    setIsPublishing(true);

    // Helper to strip HTML tags for excerpt
    const stripHtml = (html: string) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const firstTextBlock = blocks.find(b => b.type === 'text')?.content || '';
    const plainTextExcerpt = stripHtml(firstTextBlock);

    // Construct the article item
    const articleData = {
      title,
      excerpt: plainTextExcerpt.substring(0, 150) + (plainTextExcerpt.length > 150 ? '...' : '') || '',
      image: coverImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop',
      author: state.user?.name || 'Usuario Anónimo',
      authorId: state.user?.id || 'anonymous',
      authorAvatar: state.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      // keep original date if editing
      date: isEditMode && existingArticle ? existingArticle.date : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: Math.ceil((blocks.filter(b => b.type === 'text').reduce((acc, curr) => acc + curr.content.length, 0) / 500)) + ' min',
      category: category,
      // keep original stats
      likes: isEditMode && existingArticle ? existingArticle.likes : 0,
      comments: isEditMode && existingArticle ? existingArticle.comments : 0,
      content: blocks.map(b => b.content).join('\n\n'),
      tags: tags,
      domain: state.contentMode
    };

    try {
      if (isEditMode && editId) {
        // UPDATE MODE
        await update(editId, articleData, coverImageFile || undefined);
        actions.showToast('Artículo actualizado correctamente', 'success');
      } else {
        // CREATE MODE
        // Attempt 1: Try with image (if exists)
        await Promise.race([
          create(articleData, coverImageFile || undefined),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
        ]);
        actions.showToast('Artículo publicado correctamente', 'success');
      }
      onBack();
    } catch (error: any) {
      console.warn("Publish/Update failed:", error);

      // Retry logic logic only for CREATE (for now), generic error for update
      if (!isEditMode && coverImageFile) {
        try {
          actions.showToast('Error al subir imagen. Reintentando solo texto...', 'info');
          await create(articleData, undefined);
          actions.showToast('Publicado sin imagen de portada', 'info');
          onBack();
          return;
        } catch (retryError) { }
      }

      actions.showToast(error.message || 'Error al guardar el artículo', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <CreatePageLayout
      title={isPreview ? "Vista Previa" : (isEditMode ? "Editar Artículo" : "Escribir Artículo")}
      onBack={onBack}
      onAction={handlePublish}
      actionLabel={isEditMode ? "Guardar Cambios" : "Publicar"}
      actionColorClass="bg-blue-500 hover:bg-blue-600 text-white"
      isLoading={isPublishing}
    >
      <div className="space-y-8 max-w-4xl mx-auto pb-20">

        {/* Loading Overlay if fetching existing data */}
        {isLoadingExisting && (
          <div className="absolute inset-0 bg-slate-900/50 z-50 flex items-center justify-center rounded-2xl">
            <div className="text-white font-bold animate-pulse">Cargando artículo...</div>
          </div>
        )}

        {/* Toggle Preview Button */}
        <div className="flex justify-between items-center sticky top-20 z-20">
          <h2 className="text-2xl font-bold dark:text-white">
            {isEditMode ? 'Editar Artículo' : 'Nuevo Artículo'}
          </h2>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-white/10 text-sm font-medium hover:scale-105 transition-transform"
          >
            {isPreview ? (
              <> <Edit3 className="h-4 w-4" /> Volver a Editar </>
            ) : (
              <> <Eye className="h-4 w-4" /> Vista Previa </>
            )}
          </button>
        </div>

        {/* Cover Image */}
        <div className="relative">
          {coverImage ? (
            <div className={`relative w-full ${isPreview ? 'h-[400px]' : 'h-64'} rounded-2xl overflow-hidden group transition-all duration-500`}>
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              {!isPreview && (
                <>
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <label
                    htmlFor="cover-upload-change"
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity cursor-pointer"
                  >
                    <span className="font-bold text-white shadow-sm">Cambiar Portada</span>
                    <span className="text-xs text-white/90 mt-1 font-medium shadow-sm">Recomendado: 1920x1080px</span>
                  </label>
                  <input
                    type="file"
                    id="cover-upload-change"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setCoverImage)}
                  />
                </>
              )}
            </div>
          ) : (
            !isPreview && (
              <>
                <label
                  htmlFor="cover-upload"
                  className="w-full h-64 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                >
                  <ImageIcon className="h-10 w-10 text-slate-400 mb-2 group-hover:text-blue-500" />
                  <span className="text-slate-500 font-medium group-hover:text-blue-500">Añadir portada</span>
                  <span className="text-xs text-slate-400 mt-2 group-hover:text-blue-400 transition-colors">Recomendado: 1920x1080px</span>
                </label>
                <input
                  type="file"
                  id="cover-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setCoverImage)}
                />
              </>
            )
          )}
        </div>

        {/* Title */}
        {isPreview ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {category && (
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase rounded-full tracking-wider">
                  {category}
                </span>
              )}
              <span className="text-sm text-slate-400">
                {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              {title || 'Sin Título'}
            </h1>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-sm text-slate-500 dark:text-slate-400 italic">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del Artículo..."
            className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-0 px-0 leading-tight"
          />
        )}

        {/* Metadata Section (Category & Tags) - Edit Mode Only */}
        {!isPreview && (
          <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* CUSTOM Category Select */}
              <div className="w-full md:w-1/3 space-y-2 relative" ref={categoryRef}>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="h-3 w-3" /> Categoría
                </label>

                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${isCategoryOpen
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                >
                  <span className={category ? 'text-slate-900 dark:text-white' : 'text-slate-500'}>
                    {category || 'Seleccionar tema...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Custom Dropdown Options */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 animate-fade-in custom-scrollbar">
                    {sections.map(section => (
                      <div key={section.title} className="py-2">
                        <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-[#1A1A1C]/95 backdrop-blur-sm z-10">
                          {section.title}
                        </div>
                        {section.items.map(item => (
                          <button
                            key={item.label}
                            onClick={() => {
                              setCategory(item.label);
                              setIsCategoryOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                                <item.icon className="h-4 w-4" />
                              </div>
                              <span className="text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                                {item.label}
                              </span>
                            </div>
                            {category === item.label && <Check className="h-4 w-4 text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags Input */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="h-3 w-3" /> Etiquetas
                </label>
                <div className="flex items-center gap-2 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all flex-wrap min-h-[50px]">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium animate-fade-in">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? "Escribe y presiona Enter..." : "..."}
                    className="flex-1 bg-transparent border-none text-sm min-w-[120px] focus:ring-0 p-0 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Suggested Tags (SubItems) */}
            {suggestedTags.length > 0 && (
              <div className="animate-fade-in">
                <span className="text-xs text-slate-400 mr-2">Sugerencias:</span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      disabled={tags.includes(tag)}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors ${tags.includes(tag)
                        ? 'bg-slate-100 dark:bg-white/5 text-slate-400 border-transparent cursor-default'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'
                        }`}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Blocks */}
        <div className="space-y-6">
          {blocks.map((block, index) => (
            <div key={block.id} className="group relative pl-0 md:pl-12 transition-all">

              {/* Controls (Only in Edit Mode) */}
              {!isPreview && (
                <div className="hidden md:flex absolute left-0 top-2 flex-col gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 items-center">
                  <div className="flex flex-col bg-slate-100 dark:bg-white/5 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <div className="h-px w-full bg-slate-200 dark:bg-white/10" />
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Block Content */}
              <div className="w-full">
                {block.type === 'text' && (
                  isPreview ? (
                    <div
                      className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-serif whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  ) : (
                    <RichTextEditor
                      initialContent={block.content}
                      onChange={(newContent) => updateBlock(block.id, newContent)}
                      placeholder="Escribe aquí..."
                    />
                  )
                )}

                {block.type === 'image' && (
                  <div className="w-full my-6">
                    {block.content ? (
                      <div className={`relative rounded-xl overflow-hidden ${!isPreview && 'group/img'}`}>
                        <img src={block.content} alt="Content" className="w-full rounded-xl shadow-md" />
                        {!isPreview && (
                          <button
                            onClick={() => updateBlock(block.id, '')}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      !isPreview && (
                        <>
                          <label
                            htmlFor={`upload-${block.id}`}
                            className="h-48 rounded-xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group/upload"
                          >
                            <ImageIcon className="h-8 w-8 text-slate-400 group-hover/upload:text-blue-500" />
                            <span className="text-sm font-medium text-slate-500 group-hover/upload:text-blue-500">Haz click para subir una imagen</span>
                          </label>
                          <input
                            type="file"
                            id={`upload-${block.id}`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, (url) => updateBlock(block.id, url))}
                          />
                        </>
                      )
                    )}
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="w-full my-6">
                    {getYoutubeId(block.content) ? (
                      <div className="space-y-3">
                        <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYoutubeId(block.content)}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="border-none"
                          ></iframe>
                        </div>
                        {!isPreview && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, e.target.value)}
                              className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-lg py-2 px-3 text-sm text-slate-600 dark:text-slate-400"
                            />
                            <button onClick={() => updateBlock(block.id, '')} className="p-2 text-slate-400 hover:text-red-500">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      !isPreview && (
                        <div className="h-32 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center px-6 gap-4">
                          <Youtube className="h-8 w-8 text-red-500 shrink-0" />
                          <input
                            type="text"
                            placeholder="Pega el enlace de YouTube aquí..."
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            className="flex-1 bg-transparent border-none text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                            autoFocus
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Blocks Bar - Hide in Preview */}
        {!isPreview && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/10 rounded-xl shadow-lg border border-slate-100 dark:border-white/5 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider">Añadir</span>
              <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />

              <button
                onClick={() => addBlock('text')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium"
              >
                <Type className="h-4 w-4" /> Texto
              </button>
              <button
                onClick={() => addBlock('image')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium"
              >
                <ImageIcon className="h-4 w-4" /> Imagen
              </button>
              <button
                onClick={() => addBlock('video')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium"
              >
                <Youtube className="h-4 w-4 text-red-500" /> Video
              </button>
            </div>
          </div>
        )}

      </div>
    </CreatePageLayout>
  );
};
