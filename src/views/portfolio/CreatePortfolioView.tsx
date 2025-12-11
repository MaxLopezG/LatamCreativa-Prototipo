
import React, { useState } from 'react';
import { Image as ImageIcon, Type, Youtube, X, ChevronUp, ChevronDown, Trash2, Eye, Edit3, Layers, Hash, Monitor, Check } from 'lucide-react';
import { CreatePageLayout } from '../../components/layout/CreatePageLayout';
import { useAppStore } from '../../hooks/useAppStore';
import { projectsService } from '../../services/modules/projects';

interface CreatePortfolioViewProps {
  onBack: () => void;
}

type BlockType = 'text' | 'image' | 'video';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

const PORTFOLIO_CATEGORIES = [
  'Modelado 3D', 'Concept Art', 'Animación', 'Ilustración', 'UI/UX Design', 'Environment Art', 'Character Design'
];

const COMMON_SOFTWARE = [
  'Blender', 'Maya', 'ZBrush', 'Substance Painter', 'Unreal Engine', 'Unity', 'Photoshop', 'Illustrator', 'Figma'
];

export const CreatePortfolioView: React.FC<CreatePortfolioViewProps> = ({ onBack }) => {
  const { state, actions } = useAppStore();
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'image', content: '' } // Start with Image block for portfolio
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // UX State
  const [category, setCategory] = useState('');
  const [softwares, setSoftwares] = useState<string[]>([]);
  const [softwareInput, setSoftwareInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
    if (blocks.length === 0) {
      actions.showToast('El proyecto debe tener contenido', 'error');
      return;
    }

    // Extract content from blocks
    const imageBlocks = blocks.filter(b => b.type === 'image' && b.content);
    const textBlocks = blocks.filter(b => b.type === 'text' && b.content);

    // Use first image as cover, or a placeholder if none
    const coverImage = imageBlocks.length > 0
      ? imageBlocks[0].content
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop';

    // Construct description from text blocks
    const fullDescription = textBlocks.map(b => b.content).join('\n\n');

    // Create the new item object (omit ID as it will be generated)
    const projectData = {
      title,
      artist: state.user?.name || 'Usuario Anónimo',
      artistAvatar: state.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      image: coverImage,
      views: '0',
      likes: '0',
      category,
      description: fullDescription,
      images: imageBlocks.map(b => b.content),
      software: softwares,
      domain: state.contentMode || 'creative'
    };

    try {
      await projectsService.createProject(projectData);

      // Optimistic update (optional, but good for immediate feedback)
      actions.addCreatedItem({ ...projectData, id: Date.now().toString() });

      actions.showToast('Proyecto publicado correctamente', 'success');
      onBack();
    } catch (error) {
      console.error("Error publishing project:", error);
      actions.showToast('Error al publicar el proyecto', 'error');
    }
  };

  const handleAddSoftware = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && softwareInput.trim()) {
      e.preventDefault();
      addSoftware(softwareInput.trim());
    }
  };

  const addSoftware = (soft: string) => {
    if (!softwares.includes(soft)) {
      setSoftwares([...softwares, soft]);
    }
    setSoftwareInput('');
  };

  const removeSoftware = (softToRemove: string) => {
    setSoftwares(softwares.filter(s => s !== softToRemove));
  };

  return (
    <CreatePageLayout
      title={isPreview ? "Vista Previa" : "Subir Proyecto"}
      onBack={onBack}
      onAction={handlePublish}
      actionColorClass="bg-amber-500 hover:bg-amber-600 text-white"
    >
      <div className="space-y-8 max-w-4xl mx-auto pb-20">

        {/* Toggle Preview Button */}
        <div className="flex justify-end sticky top-20 z-20">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-white/10 text-sm font-medium hover:scale-105 transition-transform"
          >
            {isPreview ? (
              <> <Edit3 className="h-4 w-4" /> Editar </>
            ) : (
              <> <Eye className="h-4 w-4" /> Vista Previa </>
            )}
          </button>
        </div>

        {/* Title & Header */}
        {isPreview ? (
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              {title || 'Sin Título'}
            </h1>
            <div className="flex flex-wrap gap-2">
              {softwares.map(soft => (
                <span key={soft} className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-bold">
                  {soft}
                </span>
              ))}
            </div>
            {description && (
              <p className="text-lg text-slate-600 dark:text-slate-300 font-light max-w-2xl">
                {description}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del Proyecto..."
              className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-0 px-0 leading-tight"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción o introducción..."
              className="w-full bg-transparent border-none text-lg text-slate-600 dark:text-slate-400 placeholder-slate-400 focus:outline-none focus:ring-0 px-0 resize-none font-light"
              rows={2}
            />
          </div>
        )}

        {/* Metadata Section - Edit Mode Only */}
        {!isPreview && (
          <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">

              {/* Category Select */}
              <div className="w-full md:w-1/3 space-y-2 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="h-3 w-3" /> Categoría
                </label>

                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${isCategoryOpen
                    ? 'border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                >
                  <span className={category ? 'text-slate-900 dark:text-white' : 'text-slate-500'}>
                    {category || 'Seleccionar...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </div>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 animate-fade-in custom-scrollbar">
                    {PORTFOLIO_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between group transition-colors text-slate-700 dark:text-slate-200"
                      >
                        {cat}
                        {category === cat && <Check className="h-4 w-4 text-amber-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Software Input */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Monitor className="h-3 w-3" /> Software Usado
                </label>
                <div className="flex items-center gap-2 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-amber-500 transition-all flex-wrap min-h-[50px]">
                  {softwares.map(soft => (
                    <span key={soft} className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-bold animate-fade-in">
                      {soft}
                      <button onClick={() => removeSoftware(soft)} className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={softwareInput}
                    onChange={(e) => setSoftwareInput(e.target.value)}
                    onKeyDown={handleAddSoftware}
                    placeholder={softwares.length === 0 ? "Ej: Blender, Photoshop..." : "..."}
                    className="flex-1 bg-transparent border-none text-sm min-w-[120px] focus:ring-0 p-0 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Suggested Softwares */}
            <div className="animate-fade-in">
              <span className="text-xs text-slate-400 mr-2">Populares:</span>
              <div className="inline-flex flex-wrap gap-2 mt-2">
                {COMMON_SOFTWARE.map(soft => (
                  <button
                    key={soft}
                    onClick={() => addSoftware(soft)}
                    disabled={softwares.includes(soft)}
                    className={`text-xs px-2 py-1 rounded-md border transition-colors ${softwares.includes(soft)
                      ? 'bg-slate-100 dark:bg-white/5 text-slate-400 border-transparent cursor-default'
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-amber-400 hover:text-amber-500'
                      }`}
                  >
                    + {soft}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Content Blocks */}
        <div className="space-y-6">
          {blocks.map((block, index) => (
            <div key={block.id} className="group relative pl-0 md:pl-12 transition-all">

              {/* Controls */}
              {!isPreview && (
                <div className="hidden md:flex absolute left-0 top-2 flex-col gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 items-center">
                  <div className="flex flex-col bg-slate-100 dark:bg-white/5 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <div className="h-px w-full bg-slate-200 dark:bg-white/10" />
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30"
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
                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {block.content}
                    </p>
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Escribe detalles del proyecto..."
                      className="w-full bg-transparent border-none text-lg leading-relaxed text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none overflow-hidden"
                      rows={1}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
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
                            className="h-64 rounded-xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all group/upload"
                          >
                            <ImageIcon className="h-8 w-8 text-slate-400 group-hover/upload:text-amber-500" />
                            <span className="text-sm font-medium text-slate-500 group-hover/upload:text-amber-500">Subir imagen renderizada o captura</span>
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

        {/* Add Blocks Bar */}
        {!isPreview && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/10 rounded-xl shadow-lg border border-slate-100 dark:border-white/5 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider">Añadir</span>
              <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />

              <button
                onClick={() => addBlock('image')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors text-sm font-bold"
              >
                <ImageIcon className="h-4 w-4 text-amber-500" /> Imagen
              </button>
              <button
                onClick={() => addBlock('text')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium"
              >
                <Type className="h-4 w-4" /> Texto
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
