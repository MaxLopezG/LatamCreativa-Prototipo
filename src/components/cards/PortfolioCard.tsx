import React from 'react';
import { Lock, Bookmark } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { useAppStore } from '../../hooks/useAppStore';
import { useAuthorInfo } from '../../hooks/useAuthorInfo';

/**
 * Props para el componente PortfolioCard
 */
interface PortfolioCardProps {
  /** El item de portafolio a mostrar */
  item: PortfolioItem;
  /** Se llama cuando se hace clic en la tarjeta */
  onClick?: () => void;
  /** Se llama cuando se hace clic en el botón guardar/bookmark */
  onSave?: (id: string, image: string, type: 'project' | 'article') => void;
  /** Tipo de item para el callback de guardar */
  itemType?: 'project' | 'article';
  /** Mostrar badge de tipo (Portafolio/Blog) - útil en colecciones */
  showTypeBadge?: boolean;
  /** Ocultar botón de guardar - útil cuando ya está en una colección */
  hideSaveButton?: boolean;
  /** Elemento de acción adicional (ej. botón eliminar) renderizado en la esquina */
  extraAction?: React.ReactNode;
}

/**
 * Componente de tarjeta para mostrar proyectos de portafolio en grids y feeds.
 * Muestra imagen de portada, título, info del autor y acciones interactivas (guardar, ver).
 * Obtiene datos del perfil del autor en tiempo real para mantener nombre actualizado.
 * 
 * @example
 * ```tsx
 * <PortfolioCard
 *   item={portfolioItem}
 *   onClick={() => navigate(`/portfolio/${item.id}`)}
 *   onSave={(id, img, type) => handleSave(id, img, type)}
 * />
 * ```
 */
export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  item,
  onClick,
  onSave,
  itemType = 'project',
  showTypeBadge = false,
  hideSaveButton = false,
  extraAction
}) => {
  const { state } = useAppStore();

  // Live author lookup - fetches current name/avatar from user profile
  const { authorName, authorAvatar } = useAuthorInfo(
    item.authorId,
    item.artist,
    item.artistAvatar
  );

  // Use live author profile data
  const displayName = authorName || 'Unknown';
  const displayAvatar = authorAvatar || '';

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(item.id, item.image, itemType);
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col gap-3 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#1a1a1e] ring-1 ring-white/10 group-hover:ring-white/30 transition-all shadow-lg group-hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/10">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay for Text Readability - More subtle without hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges & Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-20 pointer-events-none">
          {!hideSaveButton && (
            <button
              type="button"
              onClick={handleSave}
              className="pointer-events-auto p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/10 hover:border-white"
              title="Guardar en colección"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          )}

          {/* Render extra actions (like Delete) here */}
          {extraAction}
        </div>

        {item.isPrivate && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 z-20">
            <Lock className="h-3 w-3 text-slate-300" />
          </div>
        )}

        {/* Status Badge - Draft or Scheduled */}
        {item.status && item.status !== 'published' && (
          <div className={`absolute top-3 ${item.isPrivate ? 'left-12' : 'left-3'} backdrop-blur-md px-2 py-1 rounded-md border z-20 text-[10px] font-bold uppercase tracking-wide ${item.status === 'draft'
            ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
            : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
            }`}>
            {item.status === 'draft' ? 'Borrador' : 'Programado'}
          </div>
        )}

        {/* Info Overlay (Inside Image) - Appears on Hover */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <h3 className="font-bold text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <img
              src={displayAvatar}
              alt={displayName}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="text-xs text-slate-300 font-medium truncate">{displayName}</span>
            {/* Type Badge - only show when showTypeBadge is true */}
            {showTypeBadge && (
              <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold uppercase rounded ${itemType === 'article'
                ? 'bg-rose-500/80 text-white'
                : 'bg-amber-500/80 text-white'
                }`}>
                {itemType === 'article' ? 'Blog' : 'Portafolio'}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
