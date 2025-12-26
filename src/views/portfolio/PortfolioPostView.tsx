
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageSquare, Briefcase, UserPlus, CheckCircle2, Maximize2, X, Bookmark, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useDeleteProject, useProject, useProjectComments, useAddProjectComment, useDeleteProjectComment } from '../../hooks/useFirebase';
import { useUserProfileData } from '../../hooks/useUserProfileData';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { ReportModal } from '../../components/modals/ReportModal';
import { Flag } from 'lucide-react';
import { projectsService } from '../../services/modules/projects';
import { usersService } from '../../services/modules/users';
import { timeAgo, getYoutubeVideoId, getSketchfabModelId, renderDescriptionWithLinks } from '../../utils/helpers';
import { shouldCountView } from '../../utils/viewTracking';
import { PortfolioItem } from '../../types';
import { PortfolioSidebar } from './components';
import { CommentsSection } from '../../components/CommentsSection';
import { SEOHead } from '../../components/SEOHead';

/** Helper para obtener el ID del autor */
const getAuthorId = (item: PortfolioItem | null | undefined): string | undefined =>
  item?.authorId;


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

  const { id: paramId } = useParams<{ id: string }>();
  const id = itemId || paramId;

  const { deleteProject, loading: isDeleting } = useDeleteProject();
  const { project: fetchedProject, loading: isFetching } = useProject(id);
  const { comments, loading: isLoadingComments } = useProjectComments(id);
  const { add: addComment, loading: isAddingComment } = useAddProjectComment();
  const { remove: deleteComment } = useDeleteProjectComment();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);

  // Comment interaction state
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isAddingReply, setIsAddingReply] = useState(false);

  // La única fuente de la verdad es el proyecto traído desde Firebase.
  const item = fetchedProject;

  // Memoized author ID with backward compatibility
  const itemAuthorId = useMemo(() => getAuthorId(item), [item]);

  // Use robust user profile data fetching
  const { displayUser: authorProfile } = useUserProfileData(
    item ? {
      name: item.artist,
      id: itemAuthorId,
      avatar: item.artistAvatar,
      role: (item as any).artistRole,
      location: (item as any).location
    } : null,
    undefined, // authorName
    { preventRedirect: true }
  );

  // --- Efecto 1: Contabilizar Vistas (Solo una vez cada 24h por proyecto) ---
  useEffect(() => {
    if (item && item.id) {
      if (!(item as any).isLocal && shouldCountView('project', item.id)) {
        projectsService.incrementProjectView(item.id);
      }
    }
  }, [item?.id]); // Dependencia solo del ID del proyecto, no del usuario

  // --- Efecto 2: Datos dependientes del Usuario y Relacionados ---
  useEffect(() => {
    if (item && item.id) {
      // Verificar Like (Solo si hay usuario)
      if (state.user) {
        projectsService.getProjectLikeStatus(item.id, state.user.id).then(setIsLiked);

        // Verificar Follow status
        if (itemAuthorId) {
          usersService.getSubscriptionStatus(itemAuthorId, state.user.id).then(setIsFollowing);
        }
      }

      // Inicializar contador
      setLikeCount(Number(item.likes || 0));

      // Cargar Proyectos Relacionados
      if (itemAuthorId) {
        // Optimized: Fetch only 5 projects (Current + 4 Related)
        projectsService.getUserProjects(itemAuthorId, 5).then(projects => {
          // Filtrar el proyecto actual y tomar los primeros 4
          setRelatedProjects(projects.filter(p => p.id !== item.id).slice(0, 4));
        });
      }
    }
  }, [item?.id, state.user?.id]);

  // --- Efecto 3: Cargar estado de likes de comentarios ---
  useEffect(() => {
    if (item?.id && state.user?.id && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      projectsService.getCommentsLikeStatuses(item.id, commentIds, state.user.id)
        .then(statuses => setCommentLikes(statuses));
    }
  }, [item?.id, state.user?.id, comments]);

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const handleFollowToggle = async () => {
    if (!state.user) {
      actions.showToast('Inicia sesión para seguir a creadores', 'info');
      return;
    }

    if (!itemAuthorId) return;

    // Prevent rapid clicks
    if (isFollowLoading) return;

    setIsFollowLoading(true);

    // Optimistic UI
    const prevFollowing = isFollowing;
    setIsFollowing(!prevFollowing);

    try {
      if (prevFollowing) {
        await usersService.unsubscribeFromUser(itemAuthorId, state.user.id);
      } else {
        await usersService.subscribeToUser(itemAuthorId, state.user.id);
      }
      // Update global subscription state to reflect changes in sidebar/other views
      actions.triggerSubscriptionUpdate();
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Rollback
      setIsFollowing(prevFollowing);
      actions.showToast('Error al actualizar seguimiento', 'error');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!state.user) {
      actions.showToast('Inicia sesión para dar like', 'info');
      return;
    }

    // Prevent rapid clicks - if already processing, ignore
    if (isLikeLoading) return;

    setIsLikeLoading(true);

    // Store previous state for rollback
    const prevLiked = isLiked;
    const prevCount = likeCount;

    // Optimistic UI: Actualizar visualmente antes de la petición
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const newStatus = await projectsService.toggleProjectLike(item.id, state.user.id);
      // Sync with server response
      setIsLiked(newStatus);
      // Adjust count based on actual server status
      setLikeCount(newStatus ? prevCount + 1 : prevCount - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Rollback to previous state
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      actions.showToast('Error al dar like', 'error');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !item?.id) return;
    try {
      await addComment(item.id, newComment.trim());
      setNewComment(''); // Clear input on success
    } catch (error: any) {
      actions.showToast(error.message, 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!item?.id) return;
    try {
      await deleteComment(item.id, commentId);
      actions.showToast('Comentario eliminado', 'success');
    } catch (error: any) {
      actions.showToast(error.message, 'error');
    }
  };

  // --- Comment Like Handler ---
  const handleCommentLike = async (commentId: string) => {
    if (!state.user) {
      actions.showToast('Inicia sesión para dar like', 'info');
      return;
    }
    if (!item?.id) return;

    // Optimistic UI update
    const wasLiked = commentLikes[commentId] || false;
    setCommentLikes(prev => ({ ...prev, [commentId]: !wasLiked }));

    try {
      await projectsService.toggleCommentLike(item.id, commentId, state.user.id);
    } catch (error) {
      // Rollback on error
      setCommentLikes(prev => ({ ...prev, [commentId]: wasLiked }));
      actions.showToast('Error al dar like', 'error');
    }
  };

  // --- Reply Handlers ---
  const handleStartReply = (commentId: string) => {
    if (!state.user) {
      actions.showToast('Inicia sesión para responder', 'info');
      return;
    }
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyText.trim() || !item?.id || !state.user) return;

    setIsAddingReply(true);
    try {
      await projectsService.addCommentReply(item.id, parentCommentId, {
        authorId: state.user.id,
        authorName: state.user.name || 'Usuario',
        authorUsername: state.user.username || '',
        authorAvatar: state.user.avatar || '',
        text: replyText.trim()
      });
      setReplyingTo(null);
      setReplyText('');
      actions.showToast('Respuesta publicada', 'success');
    } catch (error: any) {
      actions.showToast(error.message || 'Error al publicar respuesta', 'error');
    } finally {
      setIsAddingReply(false);
    }
  };

  // Helper: Get replies for a comment
  const getReplies = (parentId: string) => {
    return comments.filter(c => c.parentId === parentId);
  };

  // Helper: Get root comments (no parentId)
  const rootComments = comments.filter(c => !c.parentId);

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

  // Usar solo los proyectos relacionados que vienen del servicio.
  const displayRelated = relatedProjects;

  // Construye la galería, dando prioridad a la nueva estructura `gallery` pero con fallback a `images` para datos antiguos.
  const galleryContent = (item.gallery && item.gallery.length > 0)
    ? item.gallery
    : (item.images || []).map(url => ({ url, caption: '', type: 'image' as const }));

  const heroContent = galleryContent.length > 0 ? galleryContent[0] : null;
  const additionalContent = galleryContent.slice(1);
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

  const softwares = item.software || [];

  return (
    <div className="min-h-screen bg-[#030304] animate-fade-in relative">
      <SEOHead
        title={item.title}
        description={item.description?.substring(0, 150) || `Proyecto de ${item.artist}`}
        image={item.image}
        url={`/portfolio/${item.id}`}
        type="website"
        author={item.artist}
        keywords={item.software || []}
      />

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
              <span className="hover:text-amber-500 cursor-pointer transition-colors" onClick={() => onAuthorClick?.(authorProfile?.username || item.artistUsername || item.artist)}>{authorProfile?.name || item.artist}</span>
              <span>•</span>
              <span className="text-amber-500">{item.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            disabled={isLikeLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${isLiked
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
            {state.user && state.user.id !== itemAuthorId && (
              <>
                <div className="w-px bg-white/10 my-1 mx-1"></div>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
                  title="Reportar"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Author Actions */}
            {state.user?.name === item.artist && (
              <>
                <div className="w-px bg-white/10 my-1 mx-1"></div>

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

        {/* --- LEFT: MAIN CONTENT --- */}
        <div className="lg:col-span-9 space-y-12">

          {/* Title and Metadata (Moved to Top) */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{item.title}</h1>
            {item.createdAt && (
              <p className="text-slate-400 text-sm mb-4">Publicado el {new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {softwares.map(soft => (
                <div key={soft} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border ${getSoftwareColor(soft)}`}>
                  {soft}
                </div>
              ))}
            </div>
          </div>

          {/* Description Block */}
          {item.description && (
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-light">
              <p className="whitespace-pre-wrap">{renderDescriptionWithLinks(item.description)}</p>
            </div>
          )}

          {/* Main Hero Content */}
          {heroContent && (
            <div className="space-y-4">
              <div
                className={`group relative w-full bg-black rounded-sm overflow-hidden shadow-2xl shadow-black/50 ${heroContent.type === 'image' ? 'cursor-zoom-in' : ''}`}
                onClick={() => heroContent.type === 'image' && heroContent.url && setLightboxImage(heroContent.url)}
              >
                {heroContent.type === 'youtube' ? (
                  <div className="relative pt-[56.25%] w-full">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(heroContent.url || '') || ''}`}
                      title={heroContent.caption || "YouTube video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : heroContent.type === 'sketchfab' ? (
                  <div className="relative pt-[56.25%] w-full">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://sketchfab.com/models/${getSketchfabModelId(heroContent.url || '')}/embed?autostart=1&ui_theme=dark`}
                      title={heroContent.caption || "Sketchfab 3D Model"}
                      frameBorder="0"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <>
                    <img
                      src={heroContent.url}
                      alt="Main View"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-lg hover:bg-black/80 transition-colors">
                        <Maximize2 className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {heroContent.caption && (
                <div className="bg-[#0A0A0C] border-l-2 border-amber-500 pl-4 py-2">
                  <p className="text-slate-300 text-sm italic">{heroContent.caption}</p>
                </div>
              )}
            </div>
          )}

          {/* Additional Content Grid */}
          {additionalContent.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {additionalContent.map((imgItem, index) => (
                <div key={index} className="space-y-4">
                  {/* Media Container */}
                  <div
                    className={`group relative w-full bg-black rounded-sm overflow-hidden shadow-xl ${imgItem.type === 'image' ? 'cursor-zoom-in' : ''}`}
                    onClick={() => imgItem.type === 'image' && imgItem.url && setLightboxImage(imgItem.url)}
                  >
                    {/* YouTube Render */}
                    {imgItem.type === 'youtube' ? (
                      <div className="relative pt-[56.25%] w-full">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${getYoutubeVideoId(imgItem.url || '') || ''}`}
                          title={imgItem.caption || "YouTube video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : imgItem.type === 'sketchfab' ? (
                      /* Sketchfab 3D Model Render */
                      <div className="relative pt-[56.25%] w-full">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://sketchfab.com/models/${getSketchfabModelId(imgItem.url || '')}/embed?autostart=1&ui_theme=dark`}
                          title={imgItem.caption || "Sketchfab 3D Model"}
                          frameBorder="0"
                          allow="autoplay; fullscreen; xr-spatial-tracking"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      /* Image Render */
                      <>
                        <img src={imgItem.url || ''} alt={`Detail ${index + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="bg-black/60 backdrop-blur-md text-white p-2 rounded-lg hover:bg-black/80">
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Caption Display */}
                  {imgItem.caption && (
                    <div className="border-l-2 border-white/10 pl-4">
                      <p className="text-slate-400 text-sm italic">{imgItem.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="max-w-4xl mx-auto">
            <CommentsSection
              comments={comments}
              isLoading={isLoadingComments}
              contentAuthorId={item.authorId}
              onAddComment={async (text) => {
                if (!item?.id) return;
                await addComment(item.id, text);
              }}
              onDeleteComment={async (commentId) => {
                if (!item?.id) return;
                await deleteComment(item.id, commentId);
                actions.showToast('Comentario eliminado', 'success');
              }}
              onLikeComment={handleCommentLike}
              onAddReply={async (parentId, text) => {
                if (!item?.id || !state.user) return;
                await projectsService.addCommentReply(item.id, parentId, {
                  authorId: state.user.id,
                  authorName: state.user.name || 'Usuario',
                  authorUsername: state.user.username || '',
                  authorAvatar: state.user.avatar || '',
                  text
                });
                actions.showToast('Respuesta publicada', 'success');
              }}
              commentLikes={commentLikes}
            />
          </div>


        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <PortfolioSidebar
          item={item}
          authorProfile={authorProfile}
          isOwner={state.user?.id === itemAuthorId}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          likeCount={likeCount}
          commentsCount={comments.length}
          relatedProjects={displayRelated}
          onAuthorClick={onAuthorClick}
          onFollowToggle={handleFollowToggle}
        />

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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentType="project"
        contentId={item?.id || ''}
        contentTitle={item?.title}
      />

    </div>
  );
};
