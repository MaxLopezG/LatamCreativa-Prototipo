
import React, { useState } from 'react';
import {
    Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
    Image as ImageIcon, Video, FileText, Smile, Send, Globe,
    Users, TrendingUp, Zap, Sparkles, Link2, Code, Palette,
    Play, Music, PenTool, Camera, ChevronDown, Bell, Search,
    Home, User, Settings, Plus, Filter, MapPin, Calendar,
    ShoppingCart, Download, Package, Tag
} from 'lucide-react';

// Tipos para el feed
interface Post {
    id: string;
    author: {
        id: string;
        name: string;
        username: string;
        avatar: string;
        role: string;
        isVerified: boolean;
        isOnline: boolean;
    };
    content: {
        text: string;
        images?: string[];
        video?: string;
        link?: { url: string; title: string; thumbnail: string };
    };
    type: 'portfolio' | 'article' | 'project' | 'status' | 'milestone' | 'asset';
    category: string;
    tags: string[];
    stats: {
        likes: number;
        comments: number;
        shares: number;
        saves: number;
    };
    isLiked: boolean;
    isSaved: boolean;
    createdAt: string;
    location?: string;
    // Asset sale fields
    asset?: {
        price: number;
        currency: string;
        originalPrice?: number;
        fileType: string;
        fileSize: string;
        downloads?: number;
    };
}

interface Story {
    id: string;
    userName: string;
    userAvatar: string;
    hasNewStory: boolean;
    isOwn: boolean;
}

interface TrendingTopic {
    id: string;
    name: string;
    posts: number;
    category: string;
}

interface SuggestedUser {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: string;
    mutualFriends: number;
    isFollowing: boolean;
}

// Datos Mock
const mockStories: Story[] = [
    { id: '1', userName: 'Tu historia', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', hasNewStory: false, isOwn: true },
    { id: '2', userName: 'María García', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', hasNewStory: true, isOwn: false },
    { id: '3', userName: 'Carlos Dev', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', hasNewStory: true, isOwn: false },
    { id: '4', userName: 'Ana Ilustra', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', hasNewStory: true, isOwn: false },
    { id: '5', userName: 'Pedro UX', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', hasNewStory: false, isOwn: false },
    { id: '6', userName: 'Laura 3D', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', hasNewStory: true, isOwn: false },
];

const mockPosts: Post[] = [
    {
        id: '1',
        author: {
            id: 'u1',
            name: 'María García',
            username: 'mariagarcia',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
            role: 'UI/UX Designer',
            isVerified: true,
            isOnline: true
        },
        content: {
            text: '¡Acabo de terminar mi nuevo proyecto de diseño para una app de música! 🎵✨ Fue un reto increíble trabajar con gradientes y glassmorphism. ¿Qué opinan del resultado?',
            images: [
                'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
                'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800'
            ]
        },
        type: 'portfolio',
        category: 'Diseño UI',
        tags: ['UI Design', 'Glassmorphism', 'Mobile App'],
        stats: { likes: 234, comments: 45, shares: 12, saves: 89 },
        isLiked: true,
        isSaved: false,
        createdAt: '2h',
        location: 'Buenos Aires, Argentina'
    },
    {
        id: '2',
        author: {
            id: 'u2',
            name: 'Carlos Mendoza',
            username: 'carlosdev',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            role: 'Full Stack Developer',
            isVerified: true,
            isOnline: false
        },
        content: {
            text: 'Nuevo artículo en mi blog: "Cómo construir una API RESTful con Node.js y TypeScript en 2024" 📝\n\nCubro autenticación JWT, validación con Zod, y patrones de arquitectura limpia. Link en los comentarios 👇',
            link: {
                url: 'https://blog.carlosdev.com/api-restful',
                title: 'Cómo construir una API RESTful con Node.js y TypeScript',
                thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
            }
        },
        type: 'article',
        category: 'Desarrollo',
        tags: ['Node.js', 'TypeScript', 'API', 'Backend'],
        stats: { likes: 567, comments: 89, shares: 156, saves: 234 },
        isLiked: false,
        isSaved: true,
        createdAt: '4h',
    },
    {
        id: '3',
        author: {
            id: 'u3',
            name: 'Ana Ilustra',
            username: 'anailustra',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
            role: 'Ilustradora Digital',
            isVerified: false,
            isOnline: true
        },
        content: {
            text: '🎨 Mi proceso creativo para esta ilustración cyberpunk. Desde el sketch inicial hasta el render final. ¡Espero que les guste!',
            images: [
                'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=800'
            ]
        },
        type: 'portfolio',
        category: 'Ilustración',
        tags: ['Digital Art', 'Cyberpunk', 'Illustration'],
        stats: { likes: 1234, comments: 178, shares: 89, saves: 456 },
        isLiked: false,
        isSaved: false,
        createdAt: '6h',
        location: 'Ciudad de México'
    },
    {
        id: '4',
        author: {
            id: 'u4',
            name: 'Pedro UX',
            username: 'pedroux',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
            role: 'Product Designer',
            isVerified: true,
            isOnline: true
        },
        content: {
            text: '🚀 ¡Hito alcanzado! Nuestro proyecto opensource ya tiene +1000 estrellas en GitHub. Gracias a toda la comunidad que ha contribuido. Esto apenas comienza.',
        },
        type: 'milestone',
        category: 'Open Source',
        tags: ['OpenSource', 'GitHub', 'Community'],
        stats: { likes: 892, comments: 67, shares: 234, saves: 45 },
        isLiked: true,
        isSaved: true,
        createdAt: '8h',
    },
    {
        id: '5',
        author: {
            id: 'u5',
            name: 'Laura 3D',
            username: 'laura3d',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
            role: '3D Artist',
            isVerified: false,
            isOnline: false
        },
        content: {
            text: 'Nuevo proyecto colaborativo: Buscamos desarrolladores y diseñadores para crear una plataforma de NFTs para artistas latinos 🌎\n\n¿Quién se suma? DM abierto 💬',
        },
        type: 'project',
        category: 'Colaboración',
        tags: ['NFT', 'Web3', 'Collaboration', 'Hiring'],
        stats: { likes: 345, comments: 123, shares: 67, saves: 189 },
        isLiked: false,
        isSaved: false,
        createdAt: '12h',
        location: 'Santiago, Chile'
    },
    {
        id: '6',
        author: {
            id: 'u6',
            name: 'Diego Motion',
            username: 'diegomotion',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
            role: '3D Designer & Motion Artist',
            isVerified: true,
            isOnline: true
        },
        content: {
            text: '🎨 ¡Nuevo asset disponible! Pack de 50+ iconos 3D para tus proyectos de UI/UX. Incluye formato PNG, SVG y archivos fuente de Blender.\n\nPerfectos para apps, landing pages y dashboards. ¡Licencia comercial incluida! 🚀',
            images: [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
            ]
        },
        type: 'asset',
        category: 'Assets Digitales',
        tags: ['3D Icons', 'UI Kit', 'Blender', 'Commercial License'],
        stats: { likes: 892, comments: 45, shares: 234, saves: 567 },
        isLiked: false,
        isSaved: true,
        createdAt: '3h',
        location: 'Bogotá, Colombia',
        asset: {
            price: 29,
            currency: 'USD',
            originalPrice: 49,
            fileType: 'ZIP (PNG, SVG, .blend)',
            fileSize: '245 MB',
            downloads: 1234
        }
    }
];

const mockTrending: TrendingTopic[] = [
    { id: '1', name: '#DiseñoUI', posts: 2345, category: 'Diseño' },
    { id: '2', name: '#ReactJS', posts: 1890, category: 'Desarrollo' },
    { id: '3', name: '#AIArt', posts: 1567, category: 'Arte Digital' },
    { id: '4', name: '#Freelance', posts: 1234, category: 'Trabajo' },
    { id: '5', name: '#OpenSource', posts: 987, category: 'Comunidad' },
];

const mockSuggested: SuggestedUser[] = [
    { id: '1', name: 'Diego Motion', username: 'diegomotion', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', role: 'Motion Designer', mutualFriends: 12, isFollowing: false },
    { id: '2', name: 'Sofia Code', username: 'sofiacode', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', role: 'Software Engineer', mutualFriends: 8, isFollowing: false },
    { id: '3', name: 'Andrés Branding', username: 'andresbranding', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', role: 'Brand Designer', mutualFriends: 5, isFollowing: false },
];

// Componente de Historia
const StoryItem: React.FC<{ story: Story }> = ({ story }) => (
    <button className="flex flex-col items-center gap-2 group">
        <div className={`relative p-[3px] rounded-full ${story.hasNewStory ? 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600' : story.isOwn ? 'bg-slate-600' : 'bg-slate-700'}`}>
            <div className="bg-[#18181b] rounded-full p-[2px]">
                <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
                />
            </div>
            {story.isOwn && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#18181b]">
                    <Plus className="w-3 h-3 text-white" />
                </div>
            )}
            {story.hasNewStory && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-[#18181b]" />
            )}
        </div>
        <span className="text-xs text-slate-400 group-hover:text-white transition-colors truncate max-w-[70px]">
            {story.isOwn ? 'Tu historia' : story.userName.split(' ')[0]}
        </span>
    </button>
);

// Componente de Post
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isSaved, setIsSaved] = useState(post.isSaved);
    const [likes, setLikes] = useState(post.stats.likes);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const getTypeIcon = () => {
        switch (post.type) {
            case 'portfolio': return <Palette className="w-3 h-3" />;
            case 'article': return <FileText className="w-3 h-3" />;
            case 'project': return <Code className="w-3 h-3" />;
            case 'milestone': return <Zap className="w-3 h-3" />;
            case 'asset': return <Package className="w-3 h-3" />;
            default: return null;
        }
    };

    const getTypeLabel = () => {
        switch (post.type) {
            case 'portfolio': return 'Portafolio';
            case 'article': return 'Artículo';
            case 'project': return 'Proyecto';
            case 'milestone': return 'Hito';
            case 'asset': return 'En Venta';
            default: return 'Post';
        }
    };

    const getTypeColor = () => {
        switch (post.type) {
            case 'portfolio': return 'from-pink-500 to-rose-500';
            case 'article': return 'from-blue-500 to-cyan-500';
            case 'project': return 'from-green-500 to-emerald-500';
            case 'milestone': return 'from-amber-500 to-orange-500';
            case 'asset': return 'from-purple-500 to-violet-500';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <article className="bg-[#1e1e23] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
            {/* Header */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                        />
                        {post.author.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e1e23]" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white hover:text-amber-400 transition-colors cursor-pointer">
                                {post.author.name}
                            </h3>
                            {post.author.isVerified && (
                                <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 bg-gradient-to-r ${getTypeColor()} text-white`}>
                                {getTypeIcon()}
                                {getTypeLabel()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{post.author.role}</span>
                            <span>•</span>
                            <span>{post.createdAt}</span>
                            {post.location && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {post.location}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{post.content.text}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 text-xs text-amber-400 bg-amber-500/10 rounded-full hover:bg-amber-500/20 cursor-pointer transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Images - Special layout for assets */}
            {post.content.images && post.content.images.length > 0 && (
                post.type === 'asset' && post.asset ? (
                    // Asset layout: Image + Purchase panel side by side
                    <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="flex-1 relative aspect-video md:aspect-auto md:h-80 overflow-hidden group cursor-pointer">
                            <img
                                src={post.content.images[0]}
                                alt="Asset preview"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            {/* Preview badge */}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                Vista previa
                            </div>
                        </div>

                        {/* Purchase Panel - Compact */}
                        <div className="md:w-56 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-[#1e1e23] p-4 flex flex-col justify-between">
                            {/* Price */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-2xl font-black text-white">${post.asset.price}</span>
                                    <span className="text-xs text-slate-400">{post.asset.currency}</span>
                                </div>
                                {post.asset.originalPrice && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm text-slate-500 line-through">${post.asset.originalPrice}</span>
                                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">
                                            -{Math.round((1 - post.asset.price / post.asset.originalPrice) * 100)}%
                                        </span>
                                    </div>
                                )}

                                {/* File info compact */}
                                <div className="space-y-1 text-xs text-slate-400 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <Package className="w-3 h-3" />
                                        <span>{post.asset.fileType}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3 h-3" />
                                        <span>{post.asset.fileSize}</span>
                                    </div>
                                    {post.asset.downloads && (
                                        <div className="flex items-center gap-1.5">
                                            <Download className="w-3 h-3" />
                                            <span>{post.asset.downloads.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Buy Button */}
                            <button className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]">
                                <ShoppingCart className="w-4 h-4" />
                                Comprar
                            </button>
                        </div>
                    </div>
                ) : (
                    // Regular images grid
                    <div className={`grid ${post.content.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
                        {post.content.images.map((img, i) => (
                            <div key={i} className="relative aspect-video overflow-hidden group cursor-pointer">
                                <img
                                    src={img}
                                    alt={`Imagen ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* Link Preview */}
            {post.content.link && (
                <div className="mx-4 mb-3 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors cursor-pointer">
                    <img
                        src={post.content.link.thumbnail}
                        alt={post.content.link.title}
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-3 bg-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <Link2 className="w-3 h-3" />
                            {post.content.link.url}
                        </div>
                        <h4 className="font-medium text-white">{post.content.link.title}</h4>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-sm text-slate-500 border-t border-white/5">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <span>{likes.toLocaleString()} reacciones</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>{post.stats.comments} comentarios</span>
                    <span>{post.stats.shares} compartidos</span>
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-2 flex items-center justify-between border-t border-white/5">
                <button
                    onClick={handleLike}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500 hover:bg-pink-500/10'}`}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">Me gusta</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Comentar</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-all">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Compartir</span>
                </button>
                <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-500/10'}`}
                >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">Guardar</span>
                </button>
            </div>

            {/* Comment Box */}
            {showComments && (
                <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                            alt="Tu avatar"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                                    <Smile className="w-4 h-4 text-slate-400" />
                                </button>
                                <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                                    <Camera className="w-4 h-4 text-slate-400" />
                                </button>
                                <button
                                    disabled={!comment.trim()}
                                    className="p-1.5 text-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};

// Componente de Crear Post
const CreatePostBox: React.FC = () => {
    const [postType, setPostType] = useState<'status' | 'portfolio' | 'article' | 'project'>('status');

    return (
        <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-4">
            <div className="flex items-center gap-3">
                <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                    alt="Tu avatar"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                />
                <button className="flex-1 text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                    ¿Qué estás creando hoy?
                </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Imagen</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors">
                        <Video className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Video</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Artículo</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-colors">
                        <Code className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Proyecto</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sidebar Widget de Trending
const TrendingWidget: React.FC = () => (
    <div className="bg-[#1e1e23] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-white">Tendencias</h3>
            </div>
        </div>
        <div className="p-2">
            {mockTrending.map((topic, i) => (
                <button
                    key={topic.id}
                    className="w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500">{topic.category}</p>
                            <p className="font-semibold text-white">{topic.name}</p>
                            <p className="text-xs text-slate-500">{topic.posts.toLocaleString()} publicaciones</p>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                    </div>
                </button>
            ))}
        </div>
        <button className="w-full p-3 text-amber-500 text-sm font-medium hover:bg-white/5 transition-colors">
            Ver más
        </button>
    </div>
);

// Sidebar Widget de Sugeridos
const SuggestedWidget: React.FC = () => {
    const [following, setFollowing] = useState<string[]>([]);

    const toggleFollow = (id: string) => {
        setFollowing(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-[#1e1e23] rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-white">Sugeridos para ti</h3>
                    </div>
                    <button className="text-xs text-amber-500 hover:underline">Ver todos</button>
                </div>
            </div>
            <div className="p-2">
                {mockSuggested.map((user) => (
                    <div
                        key={user.id}
                        className="p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.role}</p>
                            <p className="text-xs text-slate-500">{user.mutualFriends} amigos en común</p>
                        </div>
                        <button
                            onClick={() => toggleFollow(user.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${following.includes(user.id)
                                ? 'bg-white/10 text-white'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                                }`}
                        >
                            {following.includes(user.id) ? 'Siguiendo' : 'Seguir'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Navegación del Feed
const FeedNav: React.FC<{ activeFilter: string; onFilterChange: (filter: string) => void }> = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'Todo', icon: Globe },
        { id: 'following', label: 'Siguiendo', icon: Users },
        { id: 'portfolio', label: 'Portafolios', icon: Palette },
        { id: 'articles', label: 'Artículos', icon: FileText },
        { id: 'projects', label: 'Proyectos', icon: Code },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    ];

    return (
        <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-2 flex items-center gap-1 overflow-x-auto">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeFilter === filter.id
                        ? 'bg-amber-500 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <filter.icon className="w-4 h-4" />
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

// Left Sidebar
const LeftSidebar: React.FC = () => {
    const menuItems = [
        { icon: Home, label: 'Inicio', active: true },
        { icon: User, label: 'Mi Perfil', active: false },
        { icon: Bookmark, label: 'Guardados', active: false },
        { icon: Users, label: 'Comunidad', active: false },
        { icon: Bell, label: 'Notificaciones', badge: 5, active: false },
        { icon: Settings, label: 'Configuración', active: false },
    ];

    const shortcuts = [
        { name: 'Diseño UI/UX', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200', type: 'group' },
        { name: 'Devs Latam', avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200', type: 'group' },
        { name: 'Ilustradores', avatar: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=200', type: 'group' },
    ];

    return (
        <aside className="space-y-4">
            {/* User Card */}
            <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-4">
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                        alt="Tu perfil"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/50"
                    />
                    <div>
                        <h3 className="font-bold text-white">Tu Nombre</h3>
                        <p className="text-xs text-slate-500">@tunombre</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/5">
                        <p className="font-bold text-white">156</p>
                        <p className="text-[10px] text-slate-500">Posts</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                        <p className="font-bold text-white">2.4K</p>
                        <p className="text-[10px] text-slate-500">Seguidores</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                        <p className="font-bold text-white">890</p>
                        <p className="text-[10px] text-slate-500">Siguiendo</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-2">
                {menuItems.map((item, i) => (
                    <button
                        key={i}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                            <span className="ml-auto px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Shortcuts */}
            <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Mis Comunidades</h4>
                <div className="space-y-2">
                    {shortcuts.map((shortcut, i) => (
                        <button
                            key={i}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <img
                                src={shortcut.avatar}
                                alt={shortcut.name}
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                            <span className="text-sm text-slate-300 truncate">{shortcut.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

// Componente Principal
export const SocialFeedView: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    return (
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 md:px-6 py-6">
            <div className="flex gap-6">
                {/* Left Sidebar - Fixed with own scroll */}
                <aside className="hidden lg:block w-[280px] shrink-0">
                    <div className="fixed w-[280px] top-24 bottom-6 overflow-y-auto custom-scrollbar pr-2">
                        <div className="space-y-4">
                            <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                                        alt="Tu perfil"
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/50"
                                    />
                                    <div>
                                        <h3 className="font-bold text-white">Tu Nombre</h3>
                                        <p className="text-xs text-slate-500">@tunombre</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <p className="font-bold text-white">156</p>
                                        <p className="text-[10px] text-slate-500">Posts</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <p className="font-bold text-white">2.4K</p>
                                        <p className="text-[10px] text-slate-500">Seguidores</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <p className="font-bold text-white">890</p>
                                        <p className="text-[10px] text-slate-500">Siguiendo</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-2">
                                {[
                                    { icon: Home, label: 'Inicio', active: true },
                                    { icon: User, label: 'Mi Perfil', active: false },
                                    { icon: Bookmark, label: 'Guardados', active: false },
                                    { icon: Users, label: 'Comunidad', active: false },
                                    { icon: Bell, label: 'Notificaciones', badge: 5, active: false },
                                    { icon: Settings, label: 'Configuración', active: false },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                            ? 'bg-amber-500/10 text-amber-500'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-auto px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Shortcuts */}
                            <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Mis Comunidades</h4>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Diseño UI/UX', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200' },
                                        { name: 'Devs Latam', avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200' },
                                        { name: 'Ilustradores', avatar: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=200' },
                                    ].map((shortcut, i) => (
                                        <button
                                            key={i}
                                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <img
                                                src={shortcut.avatar}
                                                alt={shortcut.name}
                                                className="w-8 h-8 rounded-lg object-cover"
                                            />
                                            <span className="text-sm text-slate-300 truncate">{shortcut.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="flex-1 min-w-0 space-y-4">
                    {/* Stories */}
                    <div className="bg-[#1e1e23] rounded-2xl border border-white/5 p-4">
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                            {mockStories.map((story) => (
                                <StoryItem key={story.id} story={story} />
                            ))}
                        </div>
                    </div>

                    {/* Create Post */}
                    <CreatePostBox />

                    {/* Feed Navigation */}
                    <FeedNav activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                    {/* Posts */}
                    <div className="space-y-4">
                        {mockPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* Load More */}
                    <button className="w-full py-4 bg-[#1e1e23] rounded-2xl border border-white/5 text-amber-500 font-medium hover:bg-white/5 transition-colors">
                        Cargar más publicaciones
                    </button>
                </main>

                {/* Right Sidebar - Fixed with own scroll */}
                <aside className="hidden lg:block w-[320px] shrink-0">
                    <div className="fixed w-[320px] top-24 bottom-6 overflow-y-auto custom-scrollbar pl-2">
                        <div className="space-y-4">
                            <TrendingWidget />
                            <SuggestedWidget />

                            {/* Footer */}
                            <div className="text-center text-xs text-slate-500 py-4">
                                <p>© 2024 Latam Creativa</p>
                                <div className="flex items-center justify-center gap-3 mt-2">
                                    <a href="#" className="hover:text-white transition-colors">Términos</a>
                                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                                    <a href="#" className="hover:text-white transition-colors">Ayuda</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

