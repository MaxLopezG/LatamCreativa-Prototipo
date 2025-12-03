
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Search, MoreHorizontal, Send, ChevronLeft, 
  Phone, Video, Check, CheckCheck, Paperclip, Smile, Image as ImageIcon, 
  Mic, MoreVertical, Circle, Loader2 
} from 'lucide-react';
import { FRIENDS_LIST } from '../../data/chat';
import { Friend, ChatMessage } from '../../types';
import { ContentMode } from '../../hooks/useAppStore';
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
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalActiveFriendId, setInternalActiveFriendId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : internalIsOpen;
  
  useEffect(() => {
      if (propsActiveUserId) {
          setInternalActiveFriendId(propsActiveUserId);
      }
  }, [propsActiveUserId]);

  // Fetch messages for active conversation
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat', internalActiveFriendId],
    queryFn: () => api.getChatMessages(internalActiveFriendId!),
    enabled: !!internalActiveFriendId,
    staleTime: 1000 * 60, // 1 minute
  });

  // Mutation for sending message with Optimistic Update
  const sendMessageMutation = useMutation({
    mutationFn: api.sendMessage,
    onMutate: async (newMsgData) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['chat', newMsgData.friendId] });

        // Snapshot previous value
        const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat', newMsgData.friendId]);

        // Optimistically update
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
        // Rollback
        queryClient.setQueryData(['chat', newMsgData.friendId], context?.previousMessages);
        alert("Error sending message: " + err.message);
    },
    onSettled: (data, error, variables) => {
        // Refetch to confirm
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
  }, [internalActiveFriendId, isOpen, messages.length]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !internalActiveFriendId) return;

    sendMessageMutation.mutate({ friendId: internalActiveFriendId, text: inputText });
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

  // Styles
  const triggerGradient = contentMode === 'dev' 
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
    : 'bg-gradient-to-r from-amber-500 to-orange-600';
  const userMessageGradient = contentMode === 'dev'
    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
    : 'bg-gradient-to-br from-amber-500 to-orange-600';
  const sendButtonColor = contentMode === 'dev'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-amber-500 hover:bg-amber-600';

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 active:scale-95 ${
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

      {/* Widget Container */}
      <div 
        className={`fixed bottom-40 md:bottom-24 right-4 md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-[380px] h-[60vh] md:h-[650px] bg-white dark:bg-[#0A0A0C] rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        {!activeFriend ? (
          // FRIENDS LIST
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
                    <Search className={`absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors`} />
                    <input 
                        type="text" 
                        placeholder="Buscar conversaciones..." 
                        className={`w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:ring-1 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-500 focus:border-amber-500/50 focus:ring-amber-500/50`}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {FRIENDS_LIST.map(friend => (
                    <button 
                        key={friend.id}
                        onClick={() => setInternalActiveFriendId(friend.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group relative"
                    >
                        <div className="relative shrink-0">
                            <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5 group-hover:scale-105 transition-transform" />
                            <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white dark:border-[#0A0A0C] ${
                                friend.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                            }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h5 className={`font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-500 transition-colors`}>{friend.name}</h5>
                                <span className="text-[10px] text-slate-400 font-medium">{friend.lastMessageTime}</span>
                            </div>
                            <p className={`text-xs truncate ${friend.unreadCount ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                {friend.lastMessage}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
          </div>
        ) : (
          // CONVERSATION
          <div className="flex flex-col h-full animate-slide-up">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/95 dark:bg-[#0A0A0C]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                 <button onClick={closeActiveChat} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                 </button>
                 <div className="relative cursor-pointer">
                     <img src={activeFriend.avatar} alt={activeFriend.name} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                 </div>
                 <div className="flex flex-col">
                     <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight hover:underline cursor-pointer">{activeFriend.name}</h4>
                     <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        {activeFriend.status === 'online' ? <span className="text-green-500">En línea</span> : 'Desconectado'}
                     </p>
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-[#030304] relative">
               {isLoading && (
                   <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
               )}
               
               {!isLoading && messages.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400">
                       <MessageCircle className="h-8 w-8 opacity-50 mb-2" />
                       <p className="text-sm font-medium">Inicia la conversación</p>
                   </div>
               ) : (
                   messages.map((msg) => {
                       const isMe = msg.senderId === 'me';
                       const isOptimistic = msg.id.startsWith('temp-');
                       return (
                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative z-10 animate-fade-in ${isOptimistic ? 'opacity-70' : 'opacity-100'}`}>
                               <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-transform ${
                                   isMe 
                                   ? `${userMessageGradient} text-white rounded-br-none` 
                                   : 'bg-white dark:bg-[#1A1A1C] text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-white/5'
                               }`}>
                                   <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                   <div className={`flex items-center justify-end gap-1 mt-1 opacity-70`}>
                                       <span className="text-[9px]">{msg.timestamp}</span>
                                       {isMe && (isOptimistic ? <Circle className="h-3 w-3 animate-pulse" /> : <CheckCheck className="h-3 w-3" />)}
                                   </div>
                               </div>
                           </div>
                       );
                   })
               )}
               <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white dark:bg-[#0A0A0C] border-t border-slate-100 dark:border-white/5">
                <div className="flex items-end gap-2">
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
                    </div>
                    <div className="pb-1">
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sendButtonColor} text-white`}
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
