
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageSquare, Briefcase, UserPlus, CheckCircle2, Maximize2, X, Bookmark, Trash2, Edit } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../../data/content';
import { useAppStore } from '../../hooks/useAppStore';
import { useDeleteProject, useProject } from '../../hooks/useFirebase';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';

interface PortfolioPostViewProps {
  itemId?: string;
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
  onSave?: (id: string, image: string, type?: string) => void;
  onShare?: () => void;
}

export const PortfolioPostView: React.FC<PortfolioPostViewProps> = ({ itemId, onBack, onAuthorClick, onSave, onShare }) => {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();
  const createdItems = state.createdItems || [];
  const allItems = [...createdItems, ...PORTFOLIO_ITEMS];

  const { id: paramId } = useParams<{ id: string }>();
  const id = itemId || paramId;

  const { deleteProject, loading: isDeleting } = useDeleteProject();
  const { project: fetchedProject, loading: isFetching } = useProject(id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const item = allItems.find(p => p.id === id) || fetchedProject;

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#030304] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Proyecto no encontrado</h2>
        <p className="text-slate-400 mb-8">El proyecto que buscas no existe o ha sido eliminado.</p>
        <button onClick={onBack} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
          Volver
        </button>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!item) return;
    try {
      await deleteProject(item.id);
      actions.showToast('Proyecto eliminado correctamente', 'success');
      setIsDeleteModalOpen(false);
      onBack();
    } catch (error) {
      console.error("Error deleting project:", error);
      actions.showToast('Error al eliminar el proyecto', 'error');
      setIsDeleteModalOpen(false);
    }
  };

  const relatedItems = allItems.filter(p => p.id !== id && p.category === item.category).slice(0, 4);

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const projectImages = item.images && item.images.length > 0
    ? item.images
    : [
      item.image,
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1600&auto=format&fit=crop'
    ];

  // Colors for software tags
  const getSoftwareColor = (name: string) => {
    const map: Record<string, string> = {
      'Blender': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      'Substance Painter': 'text-green-500 bg-green-500/10 border-green-500/20',
      'Photoshop': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      'Unreal Engine': 'text-slate-200 bg-white/10 border-white/20',
      'Maya': 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      'ZBrush': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    };
    return map[name] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const softwares = item.software && item.software.length > 0
    ? item.software
    : ['Blender', 'Photoshop', 'Substance Painter'];

  return (
    <div className="min-h-screen bg-[#030304] animate-fade-in pb-20 relative">

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightboxImage(null)}>
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="h-6 w-6" />
          </button>
          <img src={lightboxImage} alt="Fullscreen" className="max-w-full max-h-[95vh] object-contain rounded shadow-2xl" />
        </div>
      )}

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-[#030304]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 md:px-8 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="hidden md:flex flex-col">
            <h1 className="text-sm font-bold text-white leading-tight line-clamp-1">{item.title}</h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="hover:text-amber-500 cursor-pointer transition-colors" onClick={() => onAuthorClick?.(item.artist)}>{item.artist}</span>
              <span>•</span>
              <span className="text-amber-500">{item.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${isLiked
              ? 'bg-amber-500 border-amber-500 text-black'
              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
              }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isLiked ? 'Te gusta' : 'Me gusta'}</span>
          </button>

          {/* Action Buttons */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
            <button
              onClick={() => onSave?.(item.id, item.image, 'project')}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Guardar en colección"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <div className="w-px bg-white/10 my-1 mx-1"></div>
            <button
              onClick={onShare}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Compartir"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Author Actions */}
            {state.user?.name === item.artist && (
              <>
                <div className="w-px bg-white/10 my-1 mx-1"></div>
                <button
                  onClick={() => navigate(`/create?edit=${item.id}`)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-blue-500 transition-colors"
                  title="Editar Proyecto"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-500 transition-colors"
                  title="Eliminar Proyecto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">

        {/* --- LEFT: MAIN IMAGE GALLERY --- */}
        <div className="lg:col-span-9 space-y-4">

          {/* Title and Metadata (Moved to Top) */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{item.title}</h1>
            <div className="flex flex-wrap gap-2">
              {softwares.map(soft => (
                <div key={soft} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border ${getSoftwareColor(soft)}`}>
                  {soft}
                </div>
              ))}
            </div>
          </div>

          {/* Main Hero Image */}
          <div
            className="group relative w-full bg-black rounded-sm overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in"
            onClick={() => setLightboxImage(projectImages[0])}
          >
            <img
              src={projectImages[0]}
              alt="Main View"
              className="w-full h-auto object-cover"
            />
            {/* Hover Actions */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-lg hover:bg-black/80 transition-colors">
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-[#0A0A0C] border border-white/5 p-8 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

            <div className="prose prose-invert prose-lg max-w-none text-slate-300 relative z-10 font-light">
              <p>
                {item.description || "Este proyecto representa una exploración profunda de técnicas avanzadas de renderizado y composición. Inspirado en la estética cyberpunk y la arquitectura brutalista, busqué crear una atmósfera que se sintiera tanto futurista como vivida. Utilicé Blender para el modelado principal y Substance Painter para texturizado procedural, finalizando en Photoshop para corrección de color."}
              </p>
            </div>
          </div>

          {/* Additional Images Grid */}
          {projectImages.length > 1 && (
            <div className="grid grid-cols-1 gap-4">
              {projectImages.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="group relative w-full bg-black rounded-sm overflow-hidden shadow-xl cursor-zoom-in"
                  onClick={() => setLightboxImage(img)}
                >
                  {/* Lazy load simulation */}
                  <img src={img} alt={`Detail ${index + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-black/60 backdrop-blur-md text-white p-2 rounded-lg hover:bg-black/80">
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" /> Comentarios <span className="text-slate-500 text-sm font-normal">(124)</span>
            </h3>

            {/* Input */}
            <div className="flex gap-4 mb-8 bg-[#0A0A0C] p-4 rounded-xl border border-white/5">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                TÚ
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none resize-none min-h-[40px]"
                  placeholder="Escribe un comentario constructivo..."
                  rows={2}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button className="px-5 py-1.5 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 text-xs transition-colors">Publicar</button>
                </div>
              </div>
            </div>

            {/* Fake Comments */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop" className="h-10 w-10 rounded-full object-cover" alt="User" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">Marcus Chen</span>
                    <span className="text-[10px] text-slate-500">hace 2 días</span>
                  </div>
                  <p className="text-slate-300 text-sm">¡La iluminación en la tercera imagen es increíble! ¿Usaste Cycles o Eevee?</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Heart className="h-3 w-3" /> 12</button>
                    <button className="text-xs text-slate-500 hover:text-white">Responder</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" className="h-10 w-10 rounded-full object-cover" alt="User" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">Sarah Jenkins</span>
                    <span className="text-[10px] text-slate-500">hace 1 semana</span>
                  </div>
                  <p className="text-slate-300 text-sm">Me encanta la composición y las texturas del suelo. Gran trabajo.</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Heart className="h-3 w-3" /> 8</button>
                    <button className="text-xs text-slate-500 hover:text-white">Responder</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">

            {/* Author Card */}
            <div className="bg-[#0A0A0C] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-purple-500"></div>

              <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => onAuthorClick?.(item.artist)}>
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-amber-500 to-transparent">
                    <div className="h-full w-full rounded-full bg-black p-[2px]">
                      <img src={item.artistAvatar} alt={item.artist} className="h-full w-full object-cover rounded-full" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4 text-white fill-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg hover:underline decoration-amber-500 underline-offset-4 decoration-2">{item.artist}</h3>
                  <p className="text-xs text-slate-400">Senior Environment Artist</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {state.user && state.user.name === item.artist ? state.user.location : 'Tokio, Japón'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${isFollowing
                    ? 'bg-white/5 text-white border border-white/5'
                    : 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                    }`}
                >
                  {isFollowing ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
                  <Briefcase className="h-4 w-4" /> Contratar
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-white/5">
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/5">
                <div>
                  <div className="text-white font-bold">{item.views.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Vistas</div>
                </div>
                <div>
                  <div className="text-white font-bold">{item.likes.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Likes</div>
                </div>
                <div>
                  <div className="text-white font-bold">124</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Coment.</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Etiquetas</h4>
              <div className="flex flex-wrap gap-2">
                {[item.category, 'Concept Art', 'Sci-Fi', 'Environment', '2024'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* More from Author/Category */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Más como esto</h4>
                <button className="text-xs text-amber-500 hover:underline font-bold">Ver todo</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {relatedItems.map(rel => (
                  <div key={rel.id} className="group aspect-square rounded-xl bg-white/5 overflow-hidden cursor-pointer relative">
                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-bold text-white line-clamp-1">{rel.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* MOBILE BOTTOM ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0C]/90 backdrop-blur-xl border-t border-white/10 p-4 lg:hidden flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <button className={`${isLiked ? 'text-amber-500' : 'text-slate-400'} flex flex-col items-center gap-1`} onClick={() => setIsLiked(!isLiked)}>
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold">{item.likes}</span>
          </button>
          <button className="text-slate-400 flex flex-col items-center gap-1">
            <MessageSquare className="h-6 w-6" />
            <span className="text-[10px] font-bold">124</span>
          </button>
        </div>
        <button className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm">
          Contactar
        </button>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Proyecto"
        message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        loading={isDeleting}
      />

    </div>
  );
};
