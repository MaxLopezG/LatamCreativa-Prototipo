
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, Send, ThumbsUp, ThumbsDown, CheckCircle2, BellRing } from 'lucide-react';
import { BLOG_ITEMS, COMMENTS } from '../data/content';
import { ArticleItem } from '../types';

interface BlogPostViewProps {
  articleId: string;
  onBack: () => void;
  onArticleSelect: (id: string) => void;
  onAuthorClick?: (authorName: string) => void;
  onSave?: (id: string, image: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ articleId, onBack, onArticleSelect, onAuthorClick, onSave }) => {
  // Find the article (mock data)
  const article = BLOG_ITEMS.find(item => item.id === articleId) || BLOG_ITEMS[0];
  const relatedArticles = BLOG_ITEMS.filter(item => item.id !== articleId).slice(0, 3);

  // Interaction States
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userReaction, setUserReaction] = useState<'none' | 'liked' | 'disliked'>('none');

  return (
    <div className="max-w-[1200px] mx-auto transition-colors animate-fade-in pb-20">
      
      {/* Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Blog
        </button>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => onSave?.(article.id, article.image)}
             className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
             title="Guardar"
           >
             <Bookmark className="h-5 w-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 md:px-10 py-10">
        
        {/* Main Content Column */}
        <article className="lg:col-span-8">
            {/* Article Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                        {article.category}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-sm">•</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {article.readTime} de lectura
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-8 font-display">
                    {article.title}
                </h1>

                {/* Author & Actions Bar (Pill Design) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-slate-200 dark:border-white/10 py-6">
                    {/* Left Side: Author + Subscribe */}
                    <div className="flex items-center gap-4">
                        <div 
                          className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-white/10 cursor-pointer hover:ring-amber-500 transition-all"
                          onClick={() => onAuthorClick?.(article.author)}
                        >
                            <img src={article.authorAvatar} alt={article.author} className="h-full w-full object-cover" />
                        </div>
                        
                        <div className="flex flex-col">
                            <div 
                                className="flex items-center gap-1.5 cursor-pointer group"
                                onClick={() => onAuthorClick?.(article.author)}
                            >
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-none group-hover:text-amber-500 transition-colors">{article.author}</h3>
                                <CheckCircle2 className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">128K suscriptores</span>
                        </div>

                        <button 
                            onClick={() => setIsSubscribed(!isSubscribed)}
                            className={`ml-2 h-9 px-5 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg ${
                                isSubscribed 
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20' 
                                : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105'
                            }`}
                        >
                            {isSubscribed ? 'Suscrito' : 'Suscribirse'}
                        </button>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Like/Dislike Pill */}
                        <div className="flex h-10 items-center bg-slate-100 dark:bg-white/5 rounded-full ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden">
                            <button 
                                onClick={() => setUserReaction(userReaction === 'liked' ? 'none' : 'liked')}
                                className={`flex items-center gap-2 px-4 h-full border-r border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${
                                    userReaction === 'liked' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                <ThumbsUp className={`h-4 w-4 ${userReaction === 'liked' ? 'fill-current' : ''}`} />
                                <span className="text-sm font-bold">
                                    {article.likes + (userReaction === 'liked' ? 1 : 0)}
                                </span>
                            </button>
                            <button 
                                onClick={() => setUserReaction(userReaction === 'disliked' ? 'none' : 'disliked')}
                                className={`px-4 h-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${
                                    userReaction === 'disliked' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                <ThumbsDown className={`h-4 w-4 ${userReaction === 'disliked' ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Share Button */}
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 ring-1 ring-slate-200 dark:ring-white/10 transition-colors text-slate-700 dark:text-slate-300">
                            <Share2 className="h-5 w-5" />
                        </button>

                        {/* More Button */}
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 ring-1 ring-slate-200 dark:ring-white/10 transition-colors text-slate-700 dark:text-slate-300">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="mb-12 rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            {/* Article Body */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose">
                {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                    <>
                        <p className="lead text-2xl font-serif text-slate-600 dark:text-slate-200 mb-8 border-l-4 border-amber-500 pl-6 italic">
                           {article.excerpt}
                        </p>
                        <p>
                            Este artículo está en proceso de redacción. Vuelve pronto para leer el contenido completo sobre {article.title}.
                        </p>
                    </>
                )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 mb-16 pt-8 border-t border-slate-200 dark:border-white/10">
                {['3D', 'Tutorial', 'Industria', 'Career'].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-amber-500/10 hover:text-amber-500 cursor-pointer transition-colors border border-transparent hover:border-amber-500/20">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Comments Section */}
            <section id="comments" className="bg-slate-50 dark:bg-white/[0.02] -mx-6 md:-mx-10 px-6 md:px-10 py-12 border-t border-slate-200 dark:border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-amber-500" />
                        Comentarios <span className="text-lg font-normal text-slate-500">({COMMENTS.length})</span>
                    </h3>

                    {/* Comment Input */}
                    <div className="flex gap-4 mb-12">
                        <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&fit=crop" 
                            alt="User" 
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                        />
                        <div className="flex-1">
                            <div className="relative">
                                <textarea 
                                    placeholder="Comparte tu opinión..." 
                                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 min-h-[120px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none shadow-sm"
                                ></textarea>
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    <button className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-8">
                        {COMMENTS.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="shrink-0">
                                    <img src={comment.avatar} alt={comment.author} className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{comment.author}</h4>
                                            <span className="text-xs text-slate-500">• {comment.timeAgo}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                                        <button className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
                                            <ThumbsUp className="h-3.5 w-3.5" /> {comment.likes}
                                        </button>
                                        <button className="hover:text-amber-500 transition-colors">Responder</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </article>

        {/* Sidebar - Recommendations */}
        <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-24">
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
                        Recomendados
                    </h3>
                    
                    <div className="flex flex-col gap-6">
                        {relatedArticles.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => onArticleSelect(item.id)}
                                className="group flex gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors"
                            >
                                <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-white/5 relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-1">
                                        {item.category}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                                        {item.title}
                                    </h4>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        {item.readTime} de lectura
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter Box */}
                <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-amber-500/20">
                        <Send className="h-6 w-6 ml-1" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Newsletter Semanal</h4>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        Recibe los mejores tutoriales, noticias y recursos gratuitos directamente en tu correo.
                    </p>
                    <div className="space-y-3">
                        <input type="email" placeholder="tu@correo.com" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors" />
                        <button className="w-full bg-amber-500 text-white text-sm font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-lg">
                            Suscribirme
                        </button>
                    </div>
                </div>
            </div>
        </aside>

      </div>
    </div>
  );
};
