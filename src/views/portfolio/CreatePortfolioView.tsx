
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X, Trash2, ArrowLeft, Layers, Monitor, Upload, Check, Loader2 } from 'lucide-react';
import { CreatePageLayout } from '../../components/layout/CreatePageLayout';
import { useAppStore } from '../../hooks/useAppStore';
import { projectsService } from '../../services/modules/projects';

interface CreatePortfolioViewProps {
  onBack: () => void;
}

const PORTFOLIO_CATEGORIES = [
  'Modelado 3D', 'Concept Art', 'Animación', 'Ilustración', 'UI/UX Design', 'Environment Art', 'Character Design'
];

const COMMON_SOFTWARE = [
  'Blender', 'Maya', 'ZBrush', 'Substance Painter', 'Unreal Engine', 'Unity', 'Photoshop', 'Illustrator', 'Figma'
];

export const CreatePortfolioView: React.FC<CreatePortfolioViewProps> = ({ onBack }) => {
  const { state, actions } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [softwares, setSoftwares] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Media State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // UX State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [softwareInput, setSoftwareInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // --- Handlers: Cover Image ---
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers: Gallery ---
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addGalleryFiles(files);
  };

  const handleDropGallery = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    addGalleryFiles(files);
  };

  const addGalleryFiles = (files: File[]) => {
    setGalleryFiles(prev => [...prev, ...files]);

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // --- Handlers: Inputs ---
  const addSoftware = (soft: string) => {
    const trimmed = soft.trim();
    if (trimmed && !softwares.includes(trimmed)) {
      setSoftwares([...softwares, trimmed]);
    }
    setSoftwareInput('');
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return actions.showToast('El título es obligatorio', 'error');
    if (!coverFile && !coverPreview) return actions.showToast('La portada es obligatoria', 'error'); // Allow optional no-cover if user really wants? No, better require it.
    if (!category) return actions.showToast('Selecciona una categoría', 'error');

    setIsSubmitting(true);

    try {
      if (!state.user) throw new Error("No user authenticated");

      const projectData = {
        title,
        description,
        category,
        software: softwares,
        tags,
        artist: state.user.name,
        artistId: state.user.id,
        artistAvatar: state.user.avatar
      };

      const projectId = await projectsService.createProject(
        state.user.id,
        projectData,
        {
          cover: coverFile || undefined,
          gallery: galleryFiles
        }
      );

      actions.showToast('Proyecto publicado con éxito', 'success');
      // Optimistic addition to list could happen here if we had the full object returned
      onBack();
    } catch (error) {
      console.error(error);
      actions.showToast('Error al publicar el proyecto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0B0C] text-slate-900 dark:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B0B0C]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-bold text-lg">Nuevo Proyecto</span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ROW 1: Cover Image (Left) & Basic Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Cover Image - 5 Columns */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Portada del Proyecto *
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropCover}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-[4/3] rounded-2xl border-2 border-dashed relative overflow-hidden cursor-pointer group transition-all 
                ${coverPreview
                  ? 'border-transparent'
                  : 'border-slate-300 dark:border-white/10 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                }`}
            >
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" /> Cambiar Portada
                    </span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3 p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">Arrastra tu portada aquí</p>
                    <p className="text-xs text-slate-400 mt-1">Recomendado: 1600x1200 o mayor</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Info - 7 Columns */}
          <div className="lg:col-span-7 space-y-6">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nombra tu obra maestra..."
                className="w-full bg-transparent text-3xl md:text-4xl font-bold border-b border-slate-200 dark:border-white/10 focus:border-amber-500 px-0 py-2 focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuenta la historia detrás de este proyecto..."
                rows={4}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all"
              />
            </div>

            {/* Category & Software */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Category Select */}
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="h-3 w-3" /> Categoría *
                </label>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full text-left bg-slate-100 dark:bg-white/5 border rounded-xl px-4 py-3 text-sm font-medium transition-all flex items-center justify-between
                    ${isCategoryOpen ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-white/10 hover:border-slate-300'}`}
                >
                  <span className={category ? 'text-slate-900 dark:text-white' : 'text-slate-500'}>
                    {category || 'Seleccionar...'}
                  </span>
                </button>
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                    {PORTFOLIO_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setIsCategoryOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between"
                      >
                        {cat}
                        {category === cat && <Check className="h-4 w-4 text-amber-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Software Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Monitor className="h-3 w-3" /> Software
                </label>
                <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 flex flex-wrap gap-2 min-h-[46px]">
                  {softwares.map(soft => (
                    <span key={soft} className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      {soft}
                      <button onClick={() => setSoftwares(s => s.filter(i => i !== soft))}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={softwareInput}
                    onChange={(e) => setSoftwareInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftware(softwareInput))}
                    placeholder={softwares.length === 0 ? "Ej: Blender..." : ""}
                    className="flex-1 bg-transparent border-none p-0 text-sm focus:ring-0 min-w-[80px]"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

        <hr className="border-slate-200 dark:border-white/5" />

        {/* ROW 2: Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Galería del Proyecto</h2>
            <span className="text-sm text-slate-500">{galleryFiles.length} Imágenes seleccionadas</span>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropGallery}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Upload Button Block */}
            <div
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all p-4 text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-amber-500" />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-amber-500">Añadir más imágenes</span>
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleGallerySelect}
              className="hidden"
            />

            {/* Gallery Previews */}
            {galleryPreviews.map((url, index) => (
              <div key={index} className="aspect-square rounded-2xl overflow-hidden relative group bg-black/20">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 transform hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Tags */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Etiquetas</h2>
          <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
            {tags.map(tag => (
              <span key={tag} className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                # {tag}
                <button onClick={() => setTags(t => t.filter(i => i !== tag))} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addTag(tagInput))}
              placeholder="Añadir etiquetas (Enter)..."
              className="bg-transparent border-none focus:ring-0 text-sm flex-1 min-w-[150px]"
            />
          </div>
        </div>

      </main>
    </div>
  );
};
