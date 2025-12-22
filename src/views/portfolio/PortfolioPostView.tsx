
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageSquare, Briefcase, UserPlus, CheckCircle2, Maximize2, X, Bookmark, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useDeleteProject, useProject, useProjectComments, useAddProjectComment, useDeleteProjectComment } from '../../hooks/useFirebase';
import { useUserProfileData } from '../../hooks/useUserProfileData';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { projectsService } from '../../services/modules/projects';
import { usersService } from '../../services/modules/users';
import { timeAgo, getYoutubeVideoId, renderDescriptionWithLinks } from '../../utils/helpers';
import { PortfolioItem } from '../../types';

/** Helper to get author ID with backward compatibility for artistId */
const getAuthorId = (item: PortfolioItem | null | undefined): string | undefined =>
  item?.authorId || item?.artistId;


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
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
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

  // --- Efecto 1: Contabilizar Vistas (Solo una vez al cargar el proyecto) ---
  useEffect(() => {
    if (item && item.id) {
      if (!(item as any).isLocal) {
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
    }
  };

  const handleToggleLike = async () => {
    if (!state.user) {
      actions.showToast('Inicia sesión para dar like', 'info');
      return;
    }

    // Optimistic UI: Actualizar visualmente antes de la petición
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikeCount(prev => prevLiked ? prev - 1 : prev + 1);

    try {
      const newStatus = await projectsService.toggleProjectLike(item.id, state.user.id);
      setIsLiked(newStatus);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Rollback si falla
      setIsLiked(prevLiked);
      setLikeCount(prev => prevLiked ? prev + 1 : prev - 1);
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
    // TODO: Add a confirmation modal here
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
                  onClick={() => navigate(`/create/portfolio?edit=${item.id}`)}
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
          <div className="pt-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" /> Comentarios <span className="text-slate-500 text-sm font-normal">({comments.length})</span>
            </h3>

            {/* Input */}
            {state.user ? (
              <div className="flex gap-4 mb-8 bg-[#0A0A0C] p-4 rounded-xl border border-white/5">
                <img src={state.user.avatar} className="h-10 w-10 rounded-full object-cover" alt="Tu avatar" />
                <div className="flex-1">
                  <textarea
                    className="w-full bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none resize-none min-h-[40px]"
                    placeholder="Escribe un comentario constructivo..."
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isAddingComment}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={isAddingComment || !newComment.trim()}
                      className="px-5 py-1.5 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingComment ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-sm mb-8 p-4 bg-[#0A0A0C] rounded-xl border border-white/5">
                <a href="/auth" className="text-amber-500 font-bold hover:underline">Inicia sesión</a> para dejar un comentario.
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {isLoadingComments ? (
                <div className="text-slate-500 text-center py-4">Cargando comentarios...</div>
              ) : (
                rootComments.map(comment => (
                  <div key={comment.id} className="animate-fade-in">
                    {/* Main Comment */}
                    <div className="flex gap-4">
                      <img
                        src={comment.authorAvatar}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-amber-500/50 transition-all"
                        alt={comment.authorName}
                        onClick={() => navigate(`/user/${comment.authorUsername || comment.authorId}`)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-white font-bold text-sm cursor-pointer hover:text-amber-500 transition-colors"
                              onClick={() => navigate(`/user/${comment.authorUsername || comment.authorId}`)}
                            >
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-slate-500">{timeAgo(comment.createdAt)}</span>
                          </div>
                          {(state.user?.id === comment.authorId || state.user?.id === item.authorId) && (
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-slate-500 hover:text-red-500" title="Eliminar comentario">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{comment.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`text-xs flex items-center gap-1 transition-colors ${commentLikes[comment.id]
                              ? 'text-red-500'
                              : 'text-slate-500 hover:text-white'
                              }`}
                          >
                            <Heart className={`h-3 w-3 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                            {comment.likes || 0}
                          </button>
                          <button
                            onClick={() => handleStartReply(comment.id)}
                            className="text-xs text-slate-500 hover:text-white transition-colors"
                          >
                            Responder
                          </button>
                        </div>

                        {/* Reply Input */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 flex gap-3">
                            <img src={state.user?.avatar} className="h-8 w-8 rounded-full object-cover flex-shrink-0" alt="Tu avatar" />
                            <div className="flex-1">
                              <textarea
                                className="w-full bg-[#0A0A0C] border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none p-2"
                                placeholder="Escribe una respuesta..."
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                disabled={isAddingReply}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={handleCancelReply}
                                  className="px-3 py-1 text-slate-400 hover:text-white text-xs transition-colors"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={isAddingReply || !replyText.trim()}
                                  className="px-4 py-1 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isAddingReply ? 'Enviando...' : 'Responder'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {getReplies(comment.id).length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-white/10 space-y-4">
                            {getReplies(comment.id).map(reply => (
                              <div key={reply.id} className="flex gap-3">
                                <img
                                  src={reply.authorAvatar}
                                  className="h-8 w-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-amber-500/50 transition-all"
                                  alt={reply.authorName}
                                  onClick={() => navigate(`/user/${reply.authorUsername || reply.authorId}`)}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className="text-white font-bold text-xs cursor-pointer hover:text-amber-500 transition-colors"
                                        onClick={() => navigate(`/user/${reply.authorUsername || reply.authorId}`)}
                                      >
                                        {reply.authorName}
                                      </span>
                                      <span className="text-[10px] text-slate-500">{timeAgo(reply.createdAt)}</span>
                                    </div>
                                    {(state.user?.id === reply.authorId || state.user?.id === item.authorId) && (
                                      <button onClick={() => handleDeleteComment(reply.id)} className="text-slate-500 hover:text-red-500" title="Eliminar respuesta">
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-slate-300 text-xs whitespace-pre-wrap">{reply.text}</p>
                                  <button
                                    onClick={() => handleCommentLike(reply.id)}
                                    className={`text-[10px] flex items-center gap-1 mt-1 transition-colors ${commentLikes[reply.id]
                                      ? 'text-red-500'
                                      : 'text-slate-500 hover:text-white'
                                      }`}
                                  >
                                    <Heart className={`h-2.5 w-2.5 ${commentLikes[reply.id] ? 'fill-current' : ''}`} />
                                    {reply.likes || 0}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {rootComments.length === 0 && !isLoadingComments && (
                <div className="text-center text-slate-600 py-8">Sé el primero en comentar.</div>
              )}
            </div>
          </div>

        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">

            {/* Author Card */}
            <div className="bg-[#0A0A0C] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-purple-500"></div>

              <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => onAuthorClick?.(authorProfile?.username || item.artistUsername || item.artist)}>
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-amber-500 to-transparent">
                    <div className="h-full w-full rounded-full bg-black p-[2px]">
                      <img src={authorProfile?.avatar || item.artistAvatar} alt={authorProfile?.name || item.artist} className="h-full w-full object-cover rounded-full" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4 text-white fill-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg hover:underline decoration-amber-500 underline-offset-4 decoration-2">{authorProfile?.name || item.artist}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-slate-400">{authorProfile?.role}</p>
                    {(authorProfile?.availableForWork || item.availableForWork) === true && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Disponible
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {authorProfile?.location}
                  </p>
                </div>
              </div>

              {state.user?.id !== itemAuthorId ? (
                /* Visitor View: Seguir + Contratar */
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFollowToggle}
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
              ) : (
                /* Owner View: Solo Editar (full width) */
                <button
                  onClick={() => navigate(`/create/portfolio?edit=${item.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                >
                  <Edit className="h-4 w-4" /> Editar Proyecto
                </button>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-white/5">
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/5">
                <div>
                  <div className="text-white font-bold">{(item.views || 0).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Vistas</div>
                </div>
                <div>
                  <div className="text-white font-bold">{likeCount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Likes</div>
                </div>
                <div>
                  <div className="text-white font-bold">{comments.length}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Coment.</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Etiquetas</h4>
              <div className="flex flex-wrap gap-2">
                {(item.tags && item.tags.length > 0 ? item.tags : [item.category]).map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Collaborators */}
            <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Colaboradores</h4>
              <div className="flex flex-wrap gap-2">
                {item.collaborators && item.collaborators.length > 0 ? (
                  item.collaborators.map(person => (
                    <span key={person} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                      @{person}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-600 italic">Sin colaboradores</span>
                )}
              </div>
            </div>

            {/* More from Author/Category */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Más de {item.artist}</h4>
                <button className="text-xs text-amber-500 hover:underline font-bold">Ver todo</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {displayRelated.map(rel => (
                  <div
                    key={rel.id}
                    className="group aspect-square rounded-xl bg-white/5 overflow-hidden cursor-pointer relative"
                    onClick={() => navigate(`/portfolio/${rel.id}`)}
                  >
                    <img src={rel.image || rel.coverImage} alt={rel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
          <button className={`${isLiked ? 'text-amber-500' : 'text-slate-400'} flex flex-col items-center gap-1`} onClick={handleToggleLike}>
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold">{likeCount}</span>
          </button>
          <button className="text-slate-400 flex flex-col items-center gap-1">
            <MessageSquare className="h-6 w-6" />
            <span className="text-[10px] font-bold">{comments.length}</span>
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
