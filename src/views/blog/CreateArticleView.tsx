import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Image as ImageIcon, Type, Youtube, X, ChevronUp, ChevronDown, Plus, Trash2, GripVertical, Eye, Edit3, Tag as TagIcon, Hash, Layers, Check, Bold, Italic, Underline, Save, Calendar, Heart, MessageCircle, Share2, Bookmark, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  // Handle paste to strip unwanted styles (background-color, color, font-family, etc.)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Get HTML content from clipboard
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      // Create a temporary div to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Remove all style attributes and clean up
      const cleanHTML = (element: Element) => {
        // Remove style attribute
        element.removeAttribute('style');
        // Remove class attribute
        element.removeAttribute('class');
        // Remove background/color inline styles from all elements
        Array.from(element.children).forEach(child => {
          cleanHTML(child);
        });
      };

      Array.from(temp.children).forEach(child => cleanHTML(child));

      // Also clean inline styles in text (spans with style)
      temp.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
      temp.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));

      // Insert cleaned HTML
      document.execCommand('insertHTML', false, temp.innerHTML);
    } else if (text) {
      // Fallback to plain text
      document.execCommand('insertText', false, text);
    }

    // Trigger onChange
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
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'scheduled'>('published');
  const [scheduledDate, setScheduledDate] = useState('');
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

  // Convert URLs in text to clickable links
  const linkifyText = (html: string): string => {
    // URL regex pattern
    const urlPattern = /(\bhttps?:\/\/[^\s<>"']+)/gi;

    // Check if the URL is already inside an anchor tag
    return html.replace(urlPattern, (url) => {
      // Create a safe URL
      const safeUrl = url.replace(/"/g, '&quot;');
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors">${url}</a>`;
    });
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
      domain: state.contentMode,
      // Publication status
      status: publishStatus,
      scheduledAt: publishStatus === 'scheduled' ? scheduledDate : null
    };

    try {
      if (isEditMode && editId) {
        // UPDATE MODE
        await update(editId, articleData, coverImageFile || undefined);
        actions.showToast('Artículo actualizado correctamente', 'success');
      } else {
        // CREATE MODE
        // Attempt 1: Try with image (if exists)
        await create(articleData, coverImageFile || undefined);
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

  /**
   * Save as draft without publishing
   */
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      actions.showToast('Por favor escribe un título', 'error');
      return;
    }

    setPublishStatus('draft');
    setIsPublishing(true);

    const stripHtml = (html: string) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const firstTextBlock = blocks.find(b => b.type === 'text')?.content || '';
    const plainTextExcerpt = stripHtml(firstTextBlock);

    const articleData = {
      title,
      excerpt: plainTextExcerpt.substring(0, 150) + (plainTextExcerpt.length > 150 ? '...' : '') || '',
      image: coverImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop',
      author: state.user?.name || 'Usuario Anónimo',
      authorId: state.user?.id || 'anonymous',
      authorAvatar: state.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      date: isEditMode && existingArticle ? existingArticle.date : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: Math.ceil((blocks.filter(b => b.type === 'text').reduce((acc, curr) => acc + curr.content.length, 0) / 500)) + ' min',
      category: category || 'Sin categoría',
      likes: isEditMode && existingArticle ? existingArticle.likes : 0,
      comments: isEditMode && existingArticle ? existingArticle.comments : 0,
      content: blocks.map(b => b.content).join('\n\n'),
      tags: tags,
      domain: state.contentMode,
      status: 'draft' as const,
      scheduledAt: null
    };

    try {
      if (isEditMode && editId) {
        await update(editId, articleData, coverImageFile || undefined);
        actions.showToast('Borrador actualizado', 'success');
      } else {
        await create(articleData, coverImageFile || undefined);
        actions.showToast('Borrador guardado', 'success');
      }
      onBack();
    } catch (error: any) {
      console.error("Error saving draft:", error);
      actions.showToast(error.message || 'Error al guardar borrador', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-slate-300 flex flex-col font-sans selection:bg-rose-500/30">

      {/* Header - Fixed & Minimal via Glassmorphism */}
      <header className="sticky top-0 z-50 bg-[#030304]/80 backdrop-blur-xl border-b border-white/[0.06] h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
            <X className="h-5 w-5" />
            <span className="font-medium text-sm hidden md:inline">Cancelar</span>
          </button>
          <div className="h-6 w-px bg-white/[0.06] hidden md:block"></div>
          <span className="font-bold text-white tracking-wide">{isEditMode ? 'Editar Artículo' : 'Escribir Artículo'}</span>
        </div>

        {/* Preview Toggle */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
        >
          {isPreview ? (
            <><Edit3 className="h-4 w-4" /> Editar</>
          ) : (
            <><Eye className="h-4 w-4" /> Vista Previa</>
          )}
        </button>
      </header>

      {/* PREVIEW MODE - Render like BlogPostView */}
      {isPreview ? (
        <div className="max-w-[1800px] mx-auto transition-colors animate-fade-in pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-10 py-10 relative">

            {/* Left Sidebar - Actions Preview */}
            <aside className="hidden lg:flex lg:col-span-1 flex-col items-center gap-6 sticky top-24 h-fit">
              <div className="flex flex-col gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-sm w-full items-center">
                <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs font-bold mt-1 block">0</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs font-bold mt-1 block">0</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                  <Share2 className="h-5 w-5" />
                </div>
                <div className="p-3 rounded-xl hover:bg-white/10 text-slate-400 flex flex-col items-center gap-1 cursor-not-allowed opacity-50">
                  <Bookmark className="h-5 w-5" />
                </div>
              </div>
            </aside>

            {/* Center Column - Article Content */}
            <article className="lg:col-span-8 lg:px-8">
              <div className="mb-10 text-center lg:text-left">
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
                  {category || 'Sin categoría'}
                </span>
                <span className="text-slate-500 text-sm mx-2">•</span>
                <span className="text-slate-400 text-sm font-medium inline-flex items-center gap-1">
                  {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 font-display">
                {title || 'Sin Título'}
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-6 border-y border-white/10 py-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/10">
                    <img src={state.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} alt="Author" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-lg text-white leading-none">{state.user?.name || 'Usuario'}</h3>
                      <CheckCircle2 className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Vista previa</span>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="text-sm text-slate-400 italic">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              {coverImage && (
                <div className="mb-12 rounded-3xl overflow-hidden aspect-video shadow-2xl">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-loose">
                {blocks.map((block) => (
                  <div key={block.id} className="my-6">
                    {block.type === 'text' && (
                      <div
                        className="text-lg leading-relaxed font-serif whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: linkifyText(block.content) }}
                      />
                    )}
                    {block.type === 'image' && block.content && (
                      <div className="rounded-xl overflow-hidden my-8 shadow-lg">
                        <img src={block.content} alt="Content" className="w-full" />
                      </div>
                    )}
                    {block.type === 'video' && getYoutubeId(block.content) && (
                      <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg my-8">
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
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* Right Sidebar - Related Preview */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Eye className="h-8 w-8 text-rose-500 mx-auto mb-3" />
                <h4 className="font-bold text-white mb-2">Vista Previa</h4>
                <p className="text-sm text-slate-400">Este es cómo se verá tu artículo cuando se publique.</p>
              </div>
            </aside>

          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 md:p-8 pb-28 lg:pb-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* LEFT COLUMN: Main Content */}
          <div className="flex flex-col gap-8 min-w-0 animate-fade-in">

            {/* Loading Overlay */}
            {isLoadingExisting && (
              <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center">
                <div className="text-white font-bold animate-pulse">Cargando artículo...</div>
              </div>
            )}

            {/* Title Section - First */}
            <div className="bg-[#0A0A0C] border border-white/[0.06] rounded-2xl p-6 shadow-xl shadow-black/20">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Type className="h-4 w-4" /> Título del Artículo
              </h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe el título de tu artículo..."
                className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none placeholder-slate-700 text-white focus:outline-none focus:ring-0 px-0 leading-tight"
              />
            </div>

            {/* Cover Image Section - Second */}
            <div className="bg-[#0A0A0C] border border-white/[0.06] rounded-2xl p-6 shadow-xl shadow-black/20">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ImageIcon className="h-4 w-4" /> Portada del Artículo
              </h3>
              {coverImage ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden group transition-all duration-500">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
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
                </div>
              ) : (
                <>
                  <label
                    htmlFor="cover-upload"
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group"
                  >
                    <ImageIcon className="h-10 w-10 text-slate-500 mb-2 group-hover:text-rose-500" />
                    <span className="text-slate-400 font-medium group-hover:text-rose-400">Añadir portada</span>
                    <span className="text-xs text-slate-500 mt-2 group-hover:text-rose-400 transition-colors">Recomendado: 1920x1080px</span>
                  </label>
                  <input
                    type="file"
                    id="cover-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setCoverImage)}
                  />
                </>
              )}
            </div>

            {/* Content Blocks Section - Third */}
            <div className="bg-[#0A0A0C] border border-white/[0.06] rounded-2xl p-8 shadow-xl shadow-black/20 space-y-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Layers className="h-4 w-4" /> Contenido del Artículo
              </h3>

              {/* Content Blocks */}
              <div className="space-y-6 pt-4 border-t border-white/[0.06]">
                {blocks.map((block, index) => (
                  <div key={block.id} className="group relative pl-0 md:pl-12 transition-all">

                    {/* Controls (Only in Edit Mode) - Inline horizontal layout */}
                    {!isPreview && (
                      <div className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                          title="Eliminar bloque"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex flex-row bg-white/5 rounded-lg overflow-hidden border border-white/10">
                          <button
                            onClick={() => moveBlock(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover arriba"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <div className="w-px h-full bg-white/10" />
                          <button
                            onClick={() => moveBlock(index, 'down')}
                            disabled={index === blocks.length - 1}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover abajo"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Block Content */}
                    <div className="w-full">
                      {block.type === 'text' && (
                        isPreview ? (
                          <div
                            className="text-lg leading-relaxed text-slate-300 font-serif whitespace-pre-wrap"
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
                                  className="h-48 rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-rose-400 hover:bg-rose-500/10 transition-all group/upload"
                                >
                                  <ImageIcon className="h-8 w-8 text-slate-400 group-hover/upload:text-rose-500" />
                                  <span className="text-sm font-medium text-slate-500 group-hover/upload:text-rose-400">Haz click para subir una imagen</span>
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
                                    className="flex-1 bg-white/5 border-none rounded-lg py-2 px-3 text-sm text-slate-400"
                                  />
                                  <button onClick={() => updateBlock(block.id, '')} className="p-2 text-slate-400 hover:text-red-500">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            !isPreview && (
                              <div className="h-32 rounded-xl bg-white/5 border border-white/10 flex items-center px-6 gap-4">
                                <Youtube className="h-8 w-8 text-red-500 shrink-0" />
                                <input
                                  type="text"
                                  placeholder="Pega el enlace de YouTube aquí..."
                                  value={block.content}
                                  onChange={(e) => updateBlock(block.id, e.target.value)}
                                  className="flex-1 bg-transparent border-none text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-0"
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
                <div className="flex justify-center py-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">Añadir</span>
                    <div className="h-4 w-px bg-white/10 mx-1" />

                    <button
                      onClick={() => addBlock('text')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors text-sm font-medium"
                    >
                      <Type className="h-4 w-4" /> Texto
                    </button>
                    <button
                      onClick={() => addBlock('image')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors text-sm font-medium"
                    >
                      <ImageIcon className="h-4 w-4" /> Imagen
                    </button>
                    <button
                      onClick={() => addBlock('video')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors text-sm font-medium"
                    >
                      <Youtube className="h-4 w-4 text-red-500" /> Video
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">

            {/* Publish Actions Panel */}
            <div className="bg-[#0A0A0C] p-6 rounded-xl border border-white/[0.06] shadow-xl shadow-black/20 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Publicación</h3>

              {/* Publish Button (Primary) */}
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
            <div className="bg-[#0A0A0C] p-6 rounded-xl border border-white/[0.06] shadow-xl shadow-black/20 space-y-4">
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

          {/* Mobile Action Bar (Fixed Bottom) - Only on smaller screens */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#030304]/90 backdrop-blur-xl border-t border-white/[0.06] py-4 px-6 z-30">
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

        </main>
      )}
    </div>
  );
};

