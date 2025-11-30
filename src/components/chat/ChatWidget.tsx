
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Search, MoreHorizontal, Send, ChevronLeft, Phone, Video, Check, Circle } from 'lucide-react';
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
        className={`fixed bottom-40 md:bottom-24 right-4 md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-[380px] h-[55vh] md:h-[600px] bg-white dark:bg-[#0A0A0C] rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        {!activeFriend ? (
          // --- FRIENDS LIST VIEW ---
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0A0A0C]">
              <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">Chats</h3>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                    <MoreHorizontal className="h-5 w-5" />
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
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0A0A0C] z-10">
              <div className="flex items-center gap-3">
                 <button 
                    onClick={closeActiveChat}
                    className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                 >
                    <ChevronLeft className="h-5 w-5" />
                 </button>
                 <div className="relative cursor-pointer">
                     <img src={activeFriend.avatar} alt={activeFriend.name} className="h-10 w-10 rounded-full object-cover" />
                     {activeFriend.status === 'online' && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[#0A0A0C] bg-green-500"></div>
                     )}
                 </div>
                 <div>
                     <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight hover:underline cursor-pointer">{activeFriend.name}</h4>
                     <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        {activeFriend.status === 'online' ? <span className="text-green-500">● En línea</span> : 'Desconectado'}
                     </p>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                    <Phone className="h-4 w-4" />
                 </button>
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                    <Video className="h-4 w-4" />
                 </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-[#030304] relative">
               {/* Date Separator Mock */}
               <div className="flex justify-center my-4">
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-white/10 px-3 py-1 rounded-full">Hoy</span>
               </div>

               {currentChat.map((msg) => {
                   const isMe = msg.senderId === 'me';
                   return (
                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                           <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-transform ${
                               isMe 
                               ? `${userMessageGradient} text-white rounded-br-none` 
                               : 'bg-white dark:bg-[#1A1A1C] text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-white/5'
                           }`}>
                               <p className="leading-relaxed">{msg.text}</p>
                               <div className={`flex items-center justify-end gap-1 mt-1 opacity-70`}>
                                   <span className="text-[9px]">{msg.timestamp}</span>
                                   {isMe && <Check className="h-3 w-3" />}
                               </div>
                           </div>
                       </div>
                   );
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#0A0A0C] border-t border-slate-100 dark:border-white/5">
                <div className="relative flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className={`w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:ring-1 rounded-full py-2.5 pl-4 pr-12 text-sm text-slate-900 dark:text-white outline-none transition-colors ${focusRing}`}
                        />
                        <button 
                            onClick={handleSendMessage}
                            className={`absolute right-1 top-1 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                                inputText.trim() 
                                ? `${sendButtonColor} text-white shadow-md transform hover:scale-105` 
                                : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-default'
                            }`}
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
