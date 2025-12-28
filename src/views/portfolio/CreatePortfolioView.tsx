
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Loader2,
  Monitor,
  Layers,
  Trash2,
  Type,
  Save,
  Calendar,
  Globe,
  ChevronDown,
  Users
} from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useCreateProject, useProject, useUpdateProject } from '../../hooks/useFirebase';
import { GalleryItemCard, GalleryItem, MediaUploader } from './components';
import { EmailVerificationBanner } from '../../hooks/useContentVerification';

interface CreatePortfolioViewProps {
  onBack: () => void;
}

const PORTFOLIO_CATEGORIES = [
  'Modelado 3D', 'Concept Art', 'Animación', 'Ilustración', 'UI/UX Design', 'Environment Art', 'Character Design'
];

const COMMON_SOFTWARE = [
  'Blender', 'Maya', 'ZBrush', 'Substance Painter', 'Unreal Engine', 'Unity', 'Photoshop', 'Illustrator', 'Figma'
];

// Definimos los límites de tamaño (en bytes)
const MAX_SIZE_FREE = 10 * 1024 * 1024; // 10MB para usuarios gratuitos (Suficiente para 1080p/2K alta calidad)
const MAX_SIZE_PRO = 50 * 1024 * 1024;  // 50MB para usuarios Pro (Soporte para 4K/8K sin compresión agresiva)

export const CreatePortfolioView: React.FC<CreatePortfolioViewProps> = ({ onBack }) => {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [softwares, setSoftwares] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  // Media State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [originalCoverImage, setOriginalCoverImage] = useState<string | null>(null);

  // Crop State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // GalleryItem type is now imported from './components'
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // YouTube Input State
  const [isAddingYoutube, setIsAddingYoutube] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');

  // Sketchfab Input State
  const [isAddingSketchfab, setIsAddingSketchfab] = useState(false);
  const [sketchfabLink, setSketchfabLink] = useState('');

  // Publishing State
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'scheduled'>('published');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // UX State
  const { create: createProject, loading: isCreating, progress: createProgress } = useCreateProject();
  const { update: updateProject, loading: isUpdating, progress: updateProgress } = useUpdateProject();
  const { project: projectToEdit, loading: isLoadingEdit } = useProject(editId || undefined);

  const [softwareInput, setSoftwareInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const isSubmitting = isCreating || isUpdating;
  const progress = isCreating ? createProgress : updateProgress;

  // Lógica de Límite Inteligente
  // Aquí verificamos si el usuario tiene un rol premium.
  // En el futuro, esto podría verificar 'state.user.subscriptionStatus === "active"'
  const isProUser = state.user?.role === 'Pro' || state.user?.role === 'Master' || state.user?.role === 'Expert';
  const maxFileSize = isProUser ? MAX_SIZE_PRO : MAX_SIZE_FREE;

  // --- Effect: Load Data for Editing ---
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description || '');
      // Auto-resize description textarea after data loads
      setTimeout(() => {
        if (descriptionRef.current) {
          descriptionRef.current.style.height = 'auto';
          descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
        }
      }, 0);
      setCategory(projectToEdit.category);
      setSoftwares(projectToEdit.software || []);
      setTags(projectToEdit.tags || []);
      setCollaborators(projectToEdit.collaborators || []);

      // Set Cover
      if (projectToEdit.image) {
        setCoverPreview(projectToEdit.image);
        setOriginalCoverImage(projectToEdit.image); // For cropping existing image (might need CORS handling)
      }

      // Set Gallery
      if (projectToEdit.gallery) {
        const mappedItems: GalleryItem[] = projectToEdit.gallery.map((item: any) => {
          let preview = item.url;
          if (item.type === 'youtube') {
            const videoId = getYoutubeVideoId(item.url);
            preview = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
          }
          return {
            id: Math.random().toString(36).substr(2, 9),
            url: item.url, // Keep URL for existing items
            preview: preview,
            caption: item.caption || '',
            type: item.type
          };
        });
        setGalleryItems(mappedItems);
      }
    }
  }, [projectToEdit]);

  const validateFile = (file: File): boolean => {
    if (file.size > maxFileSize) {
      const limitMb = maxFileSize / (1024 * 1024);
      actions.showToast(`El archivo "${file.name}" excede el límite de ${limitMb} MB.${!isProUser ? 'Suscríbete a Pro para subir en 4K.' : ''} `, 'error');
      return false;
    }
    return true;
  };

  // --- Helpers: Cropping ---
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // Aspect Ratio 1:1
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(newCrop);
    setCompletedCrop(newCrop);
  }

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropConfirm = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      try {
        const croppedFile = await getCroppedImg(imgRef.current, completedCrop, 'thumbnail.jpg');
        setCoverFile(croppedFile);
        setCoverPreview(URL.createObjectURL(croppedFile));
        setImageToCrop(null); // Cerrar modal
      } catch (e) {
        console.error(e);
        actions.showToast('Error al recortar la imagen', 'error');
      }
    }
  };

  // --- Handlers: Cover Image ---
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFile(file)) return;
      // En lugar de guardar directamente, abrimos el cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageToCrop(result);
        setOriginalCoverImage(result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset para permitir re-seleccionar el mismo archivo
  };

  const handleDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (!validateFile(file)) return;
      // En lugar de guardar directamente, abrimos el cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageToCrop(result);
        setOriginalCoverImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers: Gallery ---
  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const rawFiles = Array.from(e.target.files) as File[];
      const files = rawFiles.filter(validateFile); // Filtrar archivos que exceden el peso
      await addGalleryFiles(files);
      e.target.value = ''; // Reset input to allow selecting same files again
    }
  };

  const handleDropGallery = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = (Array.from(e.dataTransfer.files) as File[])
        .filter(f => f.type.startsWith('image/'))
        .filter(validateFile); // Filtrar archivos que exceden el peso
      await addGalleryFiles(files);
    }
  };

  const addGalleryFiles = async (files: File[]) => {
    // Filter out duplicates based on name and size
    const newFiles = files.filter(file =>
      !galleryItems.some(existing =>
        existing.file?.name === file.name && existing.file?.size === file.size
      )
    );

    if (newFiles.length === 0) return;

    const newItems = await Promise.all(newFiles.map(async (file) => {
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return {
        id: Math.random().toString(36).substr(2, 9), // Simple unique ID
        file,
        preview,
        caption: '',
        type: 'image' as const
      };
    }));

    setGalleryItems(prev => [...prev, ...newItems]);
  };

  // --- Helpers: YouTube ---
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddYoutube = () => {
    const videoId = getYoutubeVideoId(youtubeLink);
    if (!videoId) {
      actions.showToast('Enlace de YouTube inválido', 'error');
      return;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    // Use standard mq if maxres doesn't exist (can't check easily client side without try/catch fetch, assuming maxres for now or user can update?)
    // Actually standard fallback is safest visually if we don't check. 
    // User won't see it if we use simple img tag.

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: youtubeLink,
      preview: thumbnailUrl,
      caption: '',
      type: 'youtube'
    };

    setGalleryItems(prev => [...prev, newItem]);
    setYoutubeLink('');
    setIsAddingYoutube(false);
  };

  // --- Helpers: Sketchfab ---
  const getSketchfabModelId = (url: string): string | null => {
    if (!url) return null;

    // Pattern: Extract the ID from common Sketchfab URL formats
    // Supports:
    // - https://sketchfab.com/3d-models/model-name-{ID}
    // - https://sketchfab.com/models/{ID}
    // - https://sketchfab.com/models/{ID}/embed
    // Note: .*- is greedy, so it captures everything up to the LAST hyphen before the ID
    const pattern = /sketchfab\.com\/(?:3d-models\/.*-|models\/)([a-zA-Z0-9]+)/i;
    const match = url.match(pattern);
    if (match && match[1]) return match[1];

    return null;
  };

  const handleAddSketchfab = () => {
    const modelId = getSketchfabModelId(sketchfabLink);
    if (!modelId) {
      actions.showToast('Enlace de Sketchfab inválido. Usa el formato: sketchfab.com/3d-models/nombre-{id}', 'error');
      return;
    }

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: sketchfabLink,
      preview: `https://media.sketchfab.com/models/${modelId}/thumbnails/7c9a634f7a1c41dbae28c7e1a591d42e/a2a63d3104434ad9b68f7abac59f9ba9.jpeg`, // Generic placeholder - actual thumbnail requires API
      caption: '',
      type: 'sketchfab'
    };

    setGalleryItems(prev => [...prev, newItem]);
    setSketchfabLink('');
    setIsAddingSketchfab(false);
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === galleryItems.length - 1)) return;

    setGalleryItems(prev => {
      const newItems = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      return newItems;
    });
  };

  const updateGalleryCaption = (id: string, caption: string) => {
    setGalleryItems(prev => prev.map(item =>
      item.id === id ? { ...item, caption } : item
    ));
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

  const addCollaborator = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !collaborators.includes(trimmed)) {
      setCollaborators([...collaborators, trimmed]);
    }
    setCollaboratorInput('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return actions.showToast('El título es obligatorio', 'error');
    if (!coverFile && !coverPreview) return actions.showToast('La portada es obligatoria', 'error'); // Allow optional no-cover if user really wants? No, better require it.
    if (!category) return actions.showToast('Selecciona una categoría', 'error');

    try {
      if (!state.user) throw new Error("No user authenticated");

      const projectData: any = {
        title,
        description,
        category,
        software: softwares,
        tags,
        artist: state.user.name,
        authorId: state.user.id,
        artistAvatar: state.user.avatar,
        artistHeadline: state.user.role,
        artistRole: state.user.role,
        artistUsername: state.user.username,
        location: state.user.location,
        domain: state.contentMode, // Pass the current content mode as the domain
        collaborators, // Added collaborators field
        status: publishStatus, // Publication status
        scheduledAt: publishStatus === 'scheduled' && scheduledDate ? scheduledDate : null
      };

      // Si estamos editando y no se sube una nueva portada, nos aseguramos de conservar la URL de la imagen existente.
      if (editId && !coverFile && projectToEdit) {
        projectData.image = projectToEdit.image;
      }

      // Separation of concerns:
      // 1. Files to upload (only where type === 'image' and file is present)
      // 2. Metadata map to reconstruct the order

      const filesToUpload: File[] = [];
      const galleryMetadata: any[] = [];

      galleryItems.forEach(item => {
        // Case 1: New Image File
        if (item.type === 'image' && item.file) {
          filesToUpload.push(item.file);
          galleryMetadata.push({
            type: 'image',
            caption: item.caption,
            fileIndex: filesToUpload.length - 1 // 0-based index in the 'filesToUpload' array
          });
        }
        // Case 2: Existing Image (Editing) or YouTube Video
        else if (item.url) {
          galleryMetadata.push({
            type: item.type,
            caption: item.caption,
            url: item.url
          });
        }
      });

      if (editId) {
        // UPDATE MODE
        await updateProject(
          editId,
          projectData,
          {
            cover: coverFile,
            gallery: filesToUpload
          },
          {
            maxSizeMB: maxFileSize / (1024 * 1024),
            galleryMetadata
          }
        );
        actions.showToast('Proyecto actualizado con éxito', 'success');
      } else {
        // CREATE MODE
        const result = await createProject(
          projectData,
          {
            cover: coverFile,
            gallery: filesToUpload
          },
          {
            maxSizeMB: maxFileSize / (1024 * 1024),
            galleryMetadata // We pass this new config to the service
          }
        );
        actions.showToast('Proyecto publicado con éxito', 'success');
        // Navigate to the new project using its slug
        navigate(`/portfolio/${result.slug}`);
        return;
      }

      onBack();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Error al publicar el proyecto';
      actions.showToast(errorMessage, 'error');
    }
  };

  // Handler for saving as draft
  const handleSaveDraft = () => {
    setPublishStatus('draft');
    // Use setTimeout to ensure state is updated before submit
    setTimeout(() => handleSubmit(), 0);
  };

  // Handler for scheduling publication
  const handleSchedule = () => {
    if (!scheduledDate) {
      actions.showToast('Selecciona una fecha para programar', 'error');
      return;
    }
    setPublishStatus('scheduled');
    setTimeout(() => handleSubmit(), 0);
  };

  const handleThumbnailClick = () => {
    if (originalCoverImage) {
      setImageToCrop(originalCoverImage);
    } else {
      fileInputRef.current?.click();
    }
  };

  if (isLoadingEdit) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-slate-300 flex flex-col font-sans selection:bg-indigo-500/30">

      {/* Header - Fixed & Minimal via Glassmorphism */}
      <header className="sticky top-0 z-50 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-white/[0.06] h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm hidden md:inline">Cancelar</span>
          </button>
          <div className="h-6 w-px bg-white/[0.06] hidden md:block"></div>
          <span className="font-bold text-white tracking-wide">{editId ? 'Editar Proyecto' : 'Publicar en Portafolio'}</span>
        </div>

        {/* Header Actions removed in favor of Sidebar Panel */}
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 md:p-8 pb-28 lg:pb-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">

        {/* Email Verification Banner */}
        <div className="lg:col-span-2">
          <EmailVerificationBanner />
        </div>

        {/* LEFT COLUMN: Main Content */}
        <div className="flex flex-col gap-8 min-w-0 animate-fade-in">

          {/* Title & Description Section (Moved to Main) */}
          <div className="space-y-6 bg-[#18181b] border border-white/[0.06] rounded-2xl p-8 shadow-xl shadow-black/20">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Type className="h-4 w-4" /> Información del Proyecto
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del Proyecto"
              className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white border-none px-0 py-2 focus:ring-0 placeholder-slate-700 transition-colors"
            />
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
              placeholder="Describe tu proceso, herramientas y objetivo..."
              rows={3}
              className="w-full bg-transparent text-lg text-slate-300 border-none px-0 py-2 focus:ring-0 placeholder-slate-600 resize-none leading-relaxed overflow-hidden"
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="h-px bg-white/[0.06] w-full" />

          {/* Gallery Section - Vertical Stack */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Layers className="h-4 w-4" /> Contenido del Proyecto
              </h3>
              <span className="text-xs text-slate-600 font-mono">{galleryItems.length} items</span>
            </div>

            <div className="space-y-8">
              {/* Existing Items - Vertical Stack */}
              {galleryItems.map((item, index) => (
                <GalleryItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={galleryItems.length}
                  onRemove={removeGalleryItem}
                  onMove={moveGalleryItem}
                  onUpdateCaption={updateGalleryCaption}
                />
              ))}

              {/* Media Uploader Component */}
              <MediaUploader
                mode={isAddingYoutube ? 'youtube' : isAddingSketchfab ? 'sketchfab' : 'none'}
                youtubeLink={youtubeLink}
                sketchfabLink={sketchfabLink}
                onYoutubeLinkChange={setYoutubeLink}
                onSketchfabLinkChange={setSketchfabLink}
                onUploadClick={() => galleryInputRef.current?.click()}
                onYoutubeClick={() => setIsAddingYoutube(true)}
                onSketchfabClick={() => setIsAddingSketchfab(true)}
                onAddYoutube={handleAddYoutube}
                onAddSketchfab={handleAddSketchfab}
                onCancel={() => { setIsAddingYoutube(false); setIsAddingSketchfab(false); }}
              />

              <input ref={galleryInputRef} type="file" multiple accept="image/*" onChange={handleGallerySelect} className="hidden" />
            </div>
          </div>



        </div>

        {/* RIGHT COLUMN: Settings Sidebar */}
        <div className="space-y-6">

          {/* Publishing Options (New) */}
          <div className="bg-[#18181b] rounded-2xl border border-white/[0.06] shadow-xl shadow-black/20 overflow-hidden">
            <div className="bg-white/[0.02] border-b border-white/[0.06] px-6 py-4">
              <h3 className="text-sm font-bold text-slate-300">Opciones de Publicación</h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</label>
                <div className="relative">
                  <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className={`w-full text-left px-4 py-2.5 bg-[#0d0d0f] border rounded-xl text-sm transition-all flex items-center justify-between ${isStatusOpen
                      ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 text-white'
                      : 'border-white/[0.06] text-slate-300 hover:border-white/20 hover:text-white'
                      }`}
                  >
                    <span>{publishStatus === 'draft' ? 'No publicado' : 'Publicado'}</span>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${publishStatus === 'published' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-slate-600'}`} />
                      <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Custom Dropdown Menu */}
                  {isStatusOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden z-20 animate-fade-in">
                        <button
                          onClick={() => { setPublishStatus('draft'); setIsStatusOpen(false); }}
                          className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors flex items-center justify-between group"
                        >
                          <span>No publicado</span>
                          {publishStatus === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                        </button>
                        <button
                          onClick={() => { setPublishStatus('published'); setIsStatusOpen(false); }}
                          className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors flex items-center justify-between group"
                        >
                          <span>Publicado</span>
                          {publishStatus === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">

                {/* Publish Button (Primary) */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {isSubmitting && (
                    <div
                      className="absolute inset-0 bg-green-700 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <div className="relative flex items-center gap-2 z-10">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                    <span>{isSubmitting ? `Subiendo ${progress}%` : (editId ? 'Guardar Cambios' : 'Publicar')}</span>
                  </div>
                </button>

                {/* Save Draft Button (Secondary) */}
                <button
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#60A5FA] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Guardar Borrador
                </button>

                {/* Schedule Section */}
                <div className="space-y-2">
                  {isProUser ? (
                    <>
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-2 bg-[#0d0d0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <button
                        onClick={handleSchedule}
                        disabled={isSubmitting || !scheduledDate}
                        className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Calendar className="h-4 w-4" />
                        Programar Publicación
                      </button>
                    </>
                  ) : (
                    <div className="relative group">
                      <button
                        disabled
                        className="w-full py-3 bg-transparent border border-white/[0.06] text-slate-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                      >
                        <Calendar className="h-4 w-4" />
                        Programar
                      </button>
                      <span className="absolute top-1/2 -translate-y-1/2 right-4 bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        PRO
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail / Cover Setting (Moved to Sidebar) */}
          <div className="bg-[#18181b] p-4 rounded-xl border border-white/[0.06] shadow-xl shadow-black/20">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4 flex items-center justify-between">
              <span>Miniatura del Feed</span>
              {coverPreview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverFile(null);
                    setCoverPreview(null);
                    setOriginalCoverImage(null);
                  }}
                  className="text-slate-500 hover:text-red-400 text-xs font-bold uppercase transition-colors"
                >
                  Remover
                </button>
              )}
            </span>

            <div
              onClick={handleThumbnailClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropCover}
              className="aspect-square w-full rounded-lg border-2 border-dashed border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02] cursor-pointer relative overflow-hidden group transition-all"
            >
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">Modificar Recorte</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-xs font-medium">Subir Cover</span>
                </div>
              )}
            </div>
            <div className="mt-3 text-[10px] text-slate-500 leading-relaxed space-y-1">
              <p>Esta imagen se usará **solo** como miniatura en el feed. No aparecerá en el detalle del proyecto.</p>
              <p className="text-slate-400 font-medium">• Recomendado: 1080x1080px. Es el balance ideal entre calidad y peso para el feed.</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
          </div>

          {/* Classification */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/[0.06] space-y-6 shadow-xl shadow-black/20">

            {/* Category */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Categoría</label>
              <div className="grid grid-cols-2 gap-2">
                {PORTFOLIO_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2.5 text-xs font-bold border rounded-lg transition-all text-left ${category === cat
                      ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-[#0d0d0f] border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-white/[0.06]" />

            {/* Software */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Monitor className="h-3 w-3" /> Software Usado
              </label>
              <div className="flex flex-wrap gap-2">
                {softwares.map(soft => (
                  <span key={soft} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] border border-white/[0.06] text-slate-200 text-xs font-medium rounded-full hover:bg-white/[0.1] transition-colors">
                    {soft}
                    <button onClick={() => setSoftwares(s => s.filter(i => i !== soft))} className="text-slate-500 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={softwareInput}
                  onChange={(e) => setSoftwareInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftware(softwareInput))}
                  placeholder="+ Añadir Software"
                  className="w-full bg-[#0d0d0f] border border-white/[0.06] text-sm text-white rounded-xl px-4 py-2.5 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-slate-600 peer"
                />

                {/* Custom Autocomplete Dropdown */}
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden z-20 hidden peer-focus:block hover:block animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                  {COMMON_SOFTWARE.filter(s => s.toLowerCase().includes(softwareInput.toLowerCase()) && !softwares.includes(s)).map(soft => (
                    <button
                      key={soft}
                      onMouseDown={(e) => { e.preventDefault(); addSoftware(soft); }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <img
                        src={`https://cdn.worldvectorlogo.com/logos/${soft.toLowerCase().replace(/\s+/g, '-')}.svg`}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                        className="w-4 h-4 object-contain opacity-70"
                        alt=""
                      />
                      <span>{soft}</span>
                    </button>
                  ))}

                  {softwareInput && !COMMON_SOFTWARE.some(s => s.toLowerCase() === softwareInput.toLowerCase()) && (
                    <button
                      onMouseDown={(e) => { e.preventDefault(); addSoftware(softwareInput); }}
                      className="w-full text-left px-4 py-3 text-sm text-indigo-400 hover:bg-indigo-500/10 transition-colors border-t border-white/[0.06]"
                    >
                      <span className="font-bold">+ Añadir "{softwareInput}"</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Etiquetas</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] border border-white/[0.06] text-slate-300 text-xs font-medium rounded-full hover:bg-white/[0.1] transition-colors">
                    #{tag}
                    <button onClick={() => setTags(t => t.filter(i => i !== tag))} className="text-slate-500 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addTag(tagInput))}
                placeholder="+ Añadir Etiquetas"
                className="w-full bg-[#0d0d0f] border border-white/[0.06] text-sm text-white rounded-xl px-4 py-2.5 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-slate-600"
              />
            </div>

            {/* Collaborators */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Users className="h-3 w-3" /> Colaboradores
              </label>
              <div className="flex flex-wrap gap-2">
                {collaborators.map(person => (
                  <span key={person} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] border border-white/[0.06] text-slate-300 text-xs font-medium rounded-full hover:bg-white/[0.1] transition-colors">
                    @{person}
                    <button onClick={() => setCollaborators(c => c.filter(i => i !== person))} className="text-slate-500 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCollaborator(collaboratorInput))}
                placeholder="+ Etiquetar perfil"
                className="w-full bg-[#0d0d0f] border border-white/[0.06] text-sm text-white rounded-xl px-4 py-2.5 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-slate-600"
              />
            </div>

          </div>

        </div>

      </main>

      {/* Crop Modal */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6 max-w-2xl w-full flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Recortar Miniatura (1:1)</h3>
              <button onClick={() => setImageToCrop(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[300px] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={50}
                keepSelection
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  alt="Crop me"
                  onLoad={onImageLoad}
                  crossOrigin="anonymous"
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setImageToCrop(null)} className="px-4 py-2 text-slate-300 hover:text-white font-medium text-sm">Cancelar</button>
              <button onClick={handleCropConfirm} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-sm transition-colors">
                Confirmar Recorte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0f]/95 backdrop-blur-xl border-t border-white/10 p-4 flex gap-3 animate-slide-up">
        <button
          onClick={() => actions.showToast('Guardado como borrador', 'success')}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-[#18181b] border border-white/10 text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          Borrador
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !coverPreview}
          className="flex-[2] relative py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && (
            <div
              className="absolute inset-0 bg-green-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          )}
          <div className="relative flex items-center gap-2 z-10">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            <span>{isSubmitting ? `${progress}%` : (editId ? 'Guardar' : 'Publicar')}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
