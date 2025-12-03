
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Search, MoreHorizontal, Send, ChevronLeft, 
  Phone, Video, Check, CheckCheck, Paperclip, Smile, Image as ImageIcon, 
  Mic, MoreVertical, Circle 
} from 'lucide-react';
import { FRIENDS_LIST, MOCK_CHATS } from '../../data/chat';
import { Friend, ChatMessage } from '../../types';
import { ContentMode } from '../../hooks/useAppStore';

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  activeUserId?: string | null;
  onCloseChat?: () => void;
  contentMode?: ContentMode;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isOpen: propsIsOpen, 
  onToggle, 
  activeUserId: propsActiveUserId,
  onCloseChat,
  contentMode = 'creative'
}) => {
  // Local state as fallback or for internal interactions
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalActiveFriendId, setInternalActiveFriendId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Derived state to handle controlled vs uncontrolled
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : internalIsOpen;
  
  // Sync active user ID from props
  useEffect(() => {
      if (propsActiveUserId) {
          setInternalActiveFriendId(propsActiveUserId);
      }
  }, [propsActiveUserId]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_CHATS);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeFriend = internalActiveFriendId ? FRIENDS_LIST.find(f => f.id === internalActiveFriendId) : null;
  const currentChat = internalActiveFriendId ? (messages[internalActiveFriendId] || []) : [];

  const handleToggle = () => {
      if (onToggle) {
          onToggle();
      } else {
          setInternalIsOpen(!internalIsOpen);
      }
  };

  // Scroll to bottom of chat automatically
  useEffect(() => {
    if (internalActiveFriendId && isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        // Simulate typing effect when opening a chat randomly
        if (Math.random() > 0.7) {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        }
    }
  }, [internalActiveFriendId, isOpen, messages, currentChat.length]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !internalActiveFriendId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [internalActiveFriendId]: [...(prev[internalActiveFriendId] || []), newMessage]
    }));
    setInputText('');
    
    // Simulate reply
    setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            // In a real app, we would add a bot response here
        }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
      }
  };

  const closeActiveChat = () => {
      setInternalActiveFriendId(null);
      if (onCloseChat) onCloseChat();
  };

  // Theme Styles
  const triggerGradient = contentMode === 'dev' 
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
    : 'bg-gradient-to-r from-amber-500 to-orange-600';
  
  const shadowColor = contentMode === 'dev' 
    ? 'shadow-blue-500/20' 
    : 'shadow-amber-500/20';

  const searchIconClass = contentMode === 'dev'
    ? 'group-focus-within:text-blue-500'
    : 'group-focus-within:text-amber-500';

  const userMessageGradient = contentMode === 'dev'
    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
    : 'bg-gradient-to-br from-amber-500 to-orange-600';

  const sendButtonColor = contentMode === 'dev'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-amber-500 hover:bg-amber-600';

  const badgeColor = contentMode === 'dev'
    ? 'bg-blue-500'
    : 'bg-amber-500';

  const focusRing = contentMode === 'dev' 
    ? 'focus:border-blue-500/50 focus:ring-blue-500/50' 
    : 'focus:border-amber-500/50 focus:ring-amber-500/50';

  const truncateHoverColor = contentMode === 'dev'
    ? 'group-hover:text-blue-500'
    : 'group-hover:text-amber-500';

  return (
    <>
      {/* Trigger Button - Higher z-index and bottom-20 for mobile to clear tab bar */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl ${shadowColor} transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-black rotate-90' : `${triggerGradient} text-white`
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-slate-50 dark:border-[#030304] flex items-center justify-center text-[10px] font-bold animate-bounce">
                2
            </span>
        )}
      </button>

      {/* Widget Container - Higher z-index, adjusted bottom position for mobile */}
      <div 
        className={`fixed bottom-40 md:bottom-24 right-4 md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-[380px] h-[60vh] md:h-[650px] bg-white dark:bg-[#0A0A0C] rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        {!activeFriend ? (
          // --- FRIENDS LIST VIEW ---
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0A0A0C]">
              <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">Chats</h3>
              <div className="flex gap-1">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                    <MoreVertical className="h-5 w-5" />
                 </button>
              </div>
            </div>
            
            <div className="p-4 pb-2">
                <div className="relative group">
                    <Search className={`absolute left-3 top-2.5 h-4 w-4 text-slate-400 ${searchIconClass} transition-colors`} />
                    <input 
                        type="text" 
                        placeholder="Buscar conversaciones..." 
                        className={`w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:ring-1 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-500 ${focusRing}`}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                <div className="px-3 py-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recientes</h4>
                    {FRIENDS_LIST.map(friend => (
                        <button 
                            key={friend.id}
                            onClick={() => setInternalActiveFriendId(friend.id)}
                            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group relative"
                        >
                            <div className="relative shrink-0">
                                <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5 group-hover:scale-105 transition-transform" />
                                <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white dark:border-[#0A0A0C] ${
                                    friend.status === 'online' ? 'bg-green-500' : 
                                    friend.status === 'busy' ? 'bg-red-500' : 'bg-slate-400'
                                }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h5 className={`font-bold text-slate-900 dark:text-white text-sm truncate ${truncateHoverColor} transition-colors`}>{friend.name}</h5>
                                    <span className="text-[10px] text-slate-400 font-medium">{friend.lastMessageTime}</span>
                                </div>
                                <p className={`text-xs truncate ${friend.unreadCount ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {friend.lastMessage}
                                </p>
                            </div>
                            {friend.unreadCount && (
                                <div className={`h-5 min-w-[20px] px-1.5 rounded-full ${badgeColor} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                    {friend.unreadCount}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          // --- CONVERSATION VIEW ---
          <div className="flex flex-col h-full animate-slide-up">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/95 dark:bg-[#0A0A0C]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                 <button 
                    onClick={closeActiveChat}
                    className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                 >
                    <ChevronLeft className="h-6 w-6" />
                 </button>
                 <div className="relative cursor-pointer">
                     <img src={activeFriend.avatar} alt={activeFriend.name} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                     {activeFriend.status === 'online' && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[#0A0A0C] bg-green-500"></div>
                     )}
                 </div>
                 <div className="flex flex-col">
                     <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight hover:underline cursor-pointer">{activeFriend.name}</h4>
                     <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        {activeFriend.status === 'online' ? <span className="text-green-500">En línea</span> : 'Desconectado'}
                     </p>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors" title="Llamada de voz">
                    <Phone className="h-4 w-4" />
                 </button>
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors" title="Videollamada">
                    <Video className="h-4 w-4" />
                 </button>
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                 </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-[#030304] relative">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

               {/* Date Separator Mock */}
               <div className="flex justify-center my-4 relative z-10">
                   <span className="text-[10px] font-bold text-slate-500 bg-slate-200/50 dark:bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">Hoy</span>
               </div>

               {currentChat.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400 relative z-10">
                       <div className="w-16 h-16 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                           <MessageCircle className="h-8 w-8 opacity-50" />
                       </div>
                       <p className="text-sm font-medium">Inicia la conversación</p>
                       <p className="text-xs opacity-70">Envía un mensaje a {activeFriend.name}</p>
                   </div>
               ) : (
                   currentChat.map((msg, index) => {
                       const isMe = msg.senderId === 'me';
                       // Logic to show avatar only on the last message of a sequence from the same user could go here
                       return (
                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative z-10 animate-fade-in`}>
                               <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-transform ${
                                   isMe 
                                   ? `${userMessageGradient} text-white rounded-br-none` 
                                   : 'bg-white dark:bg-[#1A1A1C] text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-white/5'
                               }`}>
                                   <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                   <div className={`flex items-center justify-end gap-1 mt-1 opacity-70`}>
                                       <span className="text-[9px]">{msg.timestamp}</span>
                                       {isMe && <CheckCheck className="h-3 w-3 text-white/90" />}
                                   </div>
                               </div>
                           </div>
                       );
                   })
               )}
               
               {isTyping && (
                   <div className="flex justify-start relative z-10 animate-fade-in">
                       <div className="bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/5 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                       </div>
                   </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#0A0A0C] border-t border-slate-100 dark:border-white/5">
                <div className="flex items-end gap-2">
                    <div className="flex gap-1 pb-2 text-slate-400">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors hover:text-slate-600 dark:hover:text-white" title="Adjuntar archivo">
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors hover:text-slate-600 dark:hover:text-white hidden md:block" title="Enviar imagen">
                            <ImageIcon className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="relative flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/50 rounded-2xl transition-all">
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            rows={1}
                            className="w-full bg-transparent border-none py-3 pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none resize-none max-h-32 custom-scrollbar"
                            style={{ minHeight: '44px' }}
                        />
                        <button className="absolute right-2 bottom-2 p-1.5 text-slate-400 hover:text-amber-500 transition-colors">
                            <Smile className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="pb-1">
                        {inputText.trim() ? (
                            <button 
                                onClick={handleSendMessage}
                                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-md transform hover:scale-105 active:scale-95 ${sendButtonColor} text-white`}
                            >
                                <Send className="h-4 w-4 ml-0.5" />
                            </button>
                        ) : (
                            <button className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                                <Mic className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
