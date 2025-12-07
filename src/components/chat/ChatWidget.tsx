
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Search, MoreHorizontal, Send, ChevronLeft, 
  Phone, Video, Check, CheckCheck, Paperclip, Smile, Image as ImageIcon, 
  Mic, MoreVertical, Circle, Loader2, Plus, MapPin, FileText, Info
} from 'lucide-react';
import { FRIENDS_LIST } from '../../data/chat';
import { ChatMessage } from '../../types';
import { ContentMode, useAppStore } from '../../hooks/useAppStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

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
  const queryClient = useQueryClient();
  const { actions } = useAppStore();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalActiveFriendId, setInternalActiveFriendId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Simulated typing state
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : internalIsOpen;
  
  useEffect(() => {
      if (propsActiveUserId) {
          setInternalActiveFriendId(propsActiveUserId);
      }
  }, [propsActiveUserId]);

  // Simulate typing indicator when chat opens
  useEffect(() => {
    if (internalActiveFriendId && isOpen) {
      const timer = setTimeout(() => setIsTyping(true), 2000);
      const stopTimer = setTimeout(() => setIsTyping(false), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(stopTimer);
        setIsTyping(false);
      };
    }
  }, [internalActiveFriendId, isOpen]);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat', internalActiveFriendId],
    queryFn: () => api.getChatMessages(internalActiveFriendId!),
    enabled: !!internalActiveFriendId,
    staleTime: 1000 * 60,
  });

  // Mutation for sending message
  const sendMessageMutation = useMutation({
    mutationFn: api.sendMessage,
    onMutate: async (newMsgData) => {
        await queryClient.cancelQueries({ queryKey: ['chat', newMsgData.friendId] });
        const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat', newMsgData.friendId]);
        const optimisticMsg: ChatMessage = {
            id: 'temp-' + Date.now(),
            senderId: 'me',
            text: newMsgData.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        queryClient.setQueryData<ChatMessage[]>(['chat', newMsgData.friendId], (old) => [...(old || []), optimisticMsg]);
        return { previousMessages };
    },
    onError: (err, newMsgData, context) => {
        queryClient.setQueryData(['chat', newMsgData.friendId], context?.previousMessages);
        actions.showToast(err.message || "Error al enviar mensaje", 'error');
    },
    onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({ queryKey: ['chat', variables.friendId] });
    }
  });

  const activeFriend = internalActiveFriendId ? FRIENDS_LIST.find(f => f.id === internalActiveFriendId) : null;

  const handleToggle = () => {
      if (onToggle) {
          onToggle();
      } else {
          setInternalIsOpen(!internalIsOpen);
      }
  };

  useEffect(() => {
    if (internalActiveFriendId && isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [internalActiveFriendId, isOpen, messages.length, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !internalActiveFriendId) return;
    sendMessageMutation.mutate({ friendId: internalActiveFriendId, text: inputText });
    setInputText('');
    setIsToolsOpen(false);
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

  // Dynamic Styles
  const isDev = contentMode === 'dev';
  const accentGradient = isDev ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-amber-500 to-orange-600';
  const userBubbleGradient = isDev ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-amber-500 to-orange-600';
  const accentText = isDev ? 'text-blue-500' : 'text-amber-500';
  const accentBg = isDev ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-110 active:scale-95 group ${
          isOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-black rotate-90' : `${accentGradient} text-white`
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-slate-50 dark:border-[#030304] flex items-center justify-center text-[10px] font-bold animate-pulse">
                2
            </span>
        )}
      </button>

      {/* Widget Container */}
      <div 
        className={`fixed bottom-40 md:bottom-24 right-4 md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-[400px] h-[65vh] md:h-[700px] bg-white dark:bg-[#0E0E10] rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 flex flex-col overflow-hidden transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-20 pointer-events-none'
        }`}
      >
        {!activeFriend ? (
          // --- FRIENDS LIST VIEW ---
          <div className="flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0E0E10]/80 backdrop-blur-md sticky top-0 z-10">
              <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-2xl tracking-tight">Mensajes</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Tienes 2 no leídos</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                    <MoreVertical className="h-5 w-5" />
                 </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="px-4 py-2">
                <div className="relative group">
                    <Search className={`absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:${accentText} transition-colors`} />
                    <input 
                        type="text" 
                        placeholder="Buscar personas o grupos..." 
                        className={`w-full bg-slate-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-inset rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-500 ${isDev ? 'focus:ring-blue-500/20' : 'focus:ring-amber-500/20'}`}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 mt-2">Recientes</div>
                {FRIENDS_LIST.map(friend => (
                    <button 
                        key={friend.id}
                        onClick={() => setInternalActiveFriendId(friend.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group relative"
                    >
                        <div className="relative shrink-0">
                            <img src={friend.avatar} alt={friend.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-slate-200 dark:group-hover:ring-white/10 transition-all" />
                            <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white dark:border-[#0E0E10] ${
                                friend.status === 'online' ? 'bg-green-500' : friend.status === 'busy' ? 'bg-red-500' : 'bg-slate-400'
                            }`}></div>
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                            <div className="flex justify-between items-center mb-1">
                                <h5 className={`font-bold text-slate-900 dark:text-white text-sm truncate group-hover:${accentText} transition-colors`}>{friend.name}</h5>
                                <span className="text-[10px] text-slate-400 font-medium">{friend.lastMessageTime}</span>
                            </div>
                            <p className={`text-xs truncate ${friend.unreadCount ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                {friend.lastMessage}
                            </p>
                        </div>
                        {friend.unreadCount && (
                            <div className={`h-5 min-w-[20px] px-1.5 rounded-full ${accentBg} text-white text-[10px] font-bold flex items-center justify-center`}>
                                {friend.unreadCount}
                            </div>
                        )}
                    </button>
                ))}
            </div>
          </div>
        ) : (
          // --- CONVERSATION VIEW ---
          <div className="flex flex-col h-full animate-slide-up bg-slate-50 dark:bg-[#0B0B0D]">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0E0E10]/80 backdrop-blur-xl z-20 absolute top-0 left-0 right-0 shadow-sm">
              <div className="flex items-center gap-2">
                 <button onClick={closeActiveChat} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                 </button>
                 <div className="flex items-center gap-3 cursor-pointer group">
                     <div className="relative">
                        <img src={activeFriend.avatar} alt={activeFriend.name} className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-slate-200 dark:group-hover:ring-white/10 transition-all" />
                        <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#0E0E10] ${
                            activeFriend.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                        }`}></div>
                     </div>
                     <div className="flex flex-col">
                         <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{activeFriend.name}</h4>
                         <p className="text-[10px] text-slate-500 font-medium">
                            {activeFriend.status === 'online' ? 'En línea' : 'Visto recientemente'}
                         </p>
                     </div>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Info className="h-5 w-5" />
                  </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-20 pb-4 space-y-6 relative">
               <div className="flex justify-center my-4">
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 dark:bg-white/5 px-3 py-1 rounded-full uppercase tracking-wider">Hoy</span>
               </div>

               {isLoading && (
                   <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
               )}
               
               {!isLoading && messages.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                       <MessageCircle className="h-12 w-12 mb-2" />
                       <p className="text-sm font-medium">Saluda a {activeFriend.name}</p>
                   </div>
               ) : (
                   messages.map((msg, idx) => {
                       const isMe = msg.senderId === 'me';
                       const isOptimistic = msg.id.startsWith('temp-');
                       const showAvatar = !isMe && (idx === messages.length - 1 || messages[idx + 1]?.senderId === 'me');

                       return (
                           <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} group relative z-10 animate-fade-in ${isOptimistic ? 'opacity-80' : 'opacity-100'}`}>
                               {!isMe && (
                                   <div className={`w-8 h-8 mr-2 shrink-0 flex items-end ${!showAvatar ? 'opacity-0' : ''}`}>
                                       <img src={activeFriend.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                                   </div>
                               )}
                               <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm relative ${
                                   isMe 
                                   ? `${userBubbleGradient} text-white rounded-br-none` 
                                   : 'bg-white dark:bg-[#1E1E20] text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-white/5'
                               }`}>
                                   <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                   <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/70' : 'text-slate-400'} text-[9px]`}>
                                       <span>{msg.timestamp}</span>
                                       {isMe && (isOptimistic ? <Circle className="h-2.5 w-2.5 animate-pulse" /> : <CheckCheck className="h-2.5 w-2.5" />)}
                                   </div>
                               </div>
                           </div>
                       );
                   })
               )}
               
               {/* Typing Indicator */}
               {isTyping && (
                   <div className="flex justify-start animate-fade-in">
                       <div className="w-8 h-8 mr-2 shrink-0 flex items-end">
                           <img src={activeFriend.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                       </div>
                       <div className="bg-white dark:bg-[#1E1E20] border border-slate-200 dark:border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></div>
                       </div>
                   </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 pb-4 bg-white dark:bg-[#0E0E10] border-t border-slate-100 dark:border-white/5 relative z-30">
                {/* Tools Menu */}
                <div className={`absolute bottom-20 left-4 bg-white dark:bg-[#1E1E20] border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col gap-2 transition-all duration-300 origin-bottom-left ${
                    isToolsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                }`}>
                    <button className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><ImageIcon className="h-4 w-4" /></div>
                        <span className="text-sm font-medium pr-4">Galería</span>
                    </button>
                    <button className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><FileText className="h-4 w-4" /></div>
                        <span className="text-sm font-medium pr-4">Archivo</span>
                    </button>
                    <button className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><MapPin className="h-4 w-4" /></div>
                        <span className="text-sm font-medium pr-4">Ubicación</span>
                    </button>
                </div>

                <div className="flex items-end gap-2 bg-slate-100 dark:bg-white/5 rounded-[24px] p-1.5 border border-transparent focus-within:border-slate-300 dark:focus-within:border-white/20 transition-colors">
                    <button 
                        onClick={() => setIsToolsOpen(!isToolsOpen)}
                        className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all ${isToolsOpen ? 'bg-slate-300 dark:bg-white/20 rotate-45' : 'hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                    
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        rows={1}
                        className="flex-1 bg-transparent border-none py-2.5 px-1 text-sm text-slate-900 dark:text-white outline-none resize-none max-h-32 custom-scrollbar placeholder-slate-500"
                        style={{ minHeight: '40px' }}
                    />
                    
                    <button className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                        <Smile className="h-5 w-5" />
                    </button>

                    {inputText.trim() ? (
                        <button 
                            onClick={handleSendMessage}
                            className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all shadow-md transform hover:scale-105 active:scale-95 ${accentBg} text-white`}
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </button>
                    ) : (
                        <button className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                            <Mic className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
