import React, { useState, useEffect } from 'react';
import { Lock, Bookmark } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { useAppStore } from '../../hooks/useAppStore';
import { usersService } from '../../services/modules/users';

/** 
 * Caché simple en memoria para perfiles de autor para evitar fetches redundantes.
 * Las entradas expiran después de CACHE_TTL milisegundos.
 */
const authorProfileCache: Map<string, { name: string; avatar: string; timestamp: number }> = new Map();
/** Tiempo de vida del caché en milisegundos (1 minuto) */
const CACHE_TTL = 60000;

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
  /** Elemento de acción adicional (ej. botón eliminar) renderizado en la esquina */
  extraAction?: React.ReactNode;
}

/**
 * Componente de tarjeta para mostrar proyectos de portafolio en grids y feeds.
 * Muestra imagen de portada, título, info del autor y acciones interactivas (guardar, ver).
 * Obtiene datos del perfil del autor con caché para minimizar llamadas API.
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
  extraAction
}) => {
  const { state } = useAppStore();
  const [authorProfile, setAuthorProfile] = useState<{ name: string; avatar: string } | null>(null);

  // Fetch author profile with caching
  useEffect(() => {
    const authorId = item.authorId;
    if (!authorId) return;

    // Check cache first
    const cached = authorProfileCache.get(authorId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setAuthorProfile({ name: cached.name, avatar: cached.avatar });
      return;
    }

    // Fetch fresh profile
    usersService.getUserProfile(authorId).then(profile => {
      if (profile) {
        const profileData = { name: profile.name, avatar: profile.avatar };
        setAuthorProfile(profileData);
        // Update cache
        authorProfileCache.set(authorId, { ...profileData, timestamp: Date.now() });
      }
    }).catch(err => {
      console.warn('Could not fetch author profile:', err);
    });
  }, [item.authorId]);

  // Use live author profile data if available, fallback to item's snapshot data
  const displayName = authorProfile?.name || item.artist || 'Unknown';
  const displayAvatar = authorProfile?.avatar || item.artistAvatar || '';

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

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges & Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-20 pointer-events-none">
          <button
            type="button"
            onClick={handleSave}
            className="pointer-events-auto p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/10 hover:border-white"
            title="Guardar en colección"
          >
            <Bookmark className="h-4 w-4" />
          </button>

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

        {/* Info Overlay (Inside Image) */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end z-10">
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
          </div>
        </div>

      </div>
    </div>
  );
};
